import mongoose from "mongoose";
import { Client as ESClient } from "@elastic/elasticsearch";
import Redis, { Redis as RedisT } from "ioredis";
import { Course } from "../types";

const esNode = process.env.ELASTIC_HOST || "http://elasticsearch:9200";
const esIndex = process.env.ELASTIC_INDEX || "courses";
const redisHost = process.env.REDIS_HOST || "redis";
const redisPort = Number(process.env.REDIS_PORT || 6379);

const CourseSchema = new mongoose.Schema(
  {
    course_id: { type: String, unique: true },
    title: String,
    description: String,
    category: String,
    instructor: String,
    duration: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
export const CourseModel = mongoose.model("Course", CourseSchema);

export class CourseService {
  es: ESClient;
  redis: RedisT;

  constructor() {
    this.es = new ESClient({ node: esNode });
    this.redis = new Redis({ host: redisHost, port: redisPort });
  }

  async saveAndIndex(course: Course) {
    await CourseModel.updateOne(
      { course_id: course.course_id },
      { $set: course },
      { upsert: true }
    );
    await this.es.index({
      index: esIndex,
      id: course.course_id,
      document: course,
    });
    await this.redis.flushall();
  }

  async search(
    q?: string,
    category?: string,
    instructor?: string,
    page = 1,
    size = 10
  ) {
    const cacheKey = `search:${q || ""}:${category || ""}:${
      instructor || ""
    }:p${page}:s${size}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) return { cached: true, ...JSON.parse(cached) };

    const must: any[] = [];
    if (q)
      must.push({
        multi_match: {
          query: q,
          fields: ["title^3", "description", "instructor", "category"],
        },
      });
    if (category) must.push({ match: { category } });
    if (instructor) must.push({ match: { instructor } });
    const body = must.length
      ? { query: { bool: { must } } }
      : { query: { match_all: {} } };

    // Get search hits (paged)
    const esRes = await this.es.search({
      index: esIndex,
      body,
      from: (page - 1) * size,
      size,
    });

    // Get total count (use hits.total.value if available, otherwise call count)
    let total = 0;
    try {
      const totalField = esRes.hits?.total;
      if (
        typeof totalField === "object" &&
        typeof totalField.value === "number"
      ) {
        total = totalField.value;
      } else {
        // fallback: call count API
        const cnt = await this.es.count({ index: esIndex, body });
        total = cnt.count ?? 0;
      }
    } catch (e) {
      // best-effort fallback
      total = esRes.hits?.hits?.length ?? 0;
    }

    const hits = esRes.hits.hits.map((h: any) => h._source);

    const totalPages = Math.max(1, Math.ceil(total / size));

    const resp = {
      cached: false,
      results: hits,
      total,
      totalPages,
      page,
      size,
    };

    // Cache full response (including metadata)
    await this.redis.set(cacheKey, JSON.stringify(resp), "EX", 60 * 5); // 5 minutes

    return resp;
  }

  async getCourse(courseId: string) {
    const cacheKey = `course:${courseId}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) return JSON.parse(cached);
    const c = await CourseModel.findOne({ course_id: courseId }).lean();
    if (c) await this.redis.set(cacheKey, JSON.stringify(c), "EX", 60 * 60);
    return c;
  }
}

export const courseService = new CourseService();
