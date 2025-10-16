import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { searchCourses, uploadCoursesCSV } from "../services/api";

export default function CoursesPage() {
  const { token, logout } = useContext(AuthContext);
  const [q, setQ] = useState("");
  const [results, setResults] = useState(() => {
    try {
      return (
        JSON.parse(localStorage.getItem("courses_cache") || "null")?.results ||
        []
      );
    } catch {
      return [];
    }
  });
  const [status, setStatus] = useState("idle");
  const [file, setFile] = useState(null);

  // pagination
  const [page, setPage] = useState(1);
  const [size] = useState(20); // page size
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    doSearch(page);
    // eslint-disable-next-line
  }, []);

  async function doSearch(requestPage = 1) {
    setStatus("loading");
    try {
      const res = await searchCourses(token, q, "", "", requestPage, size);
      const list = res.results || [];
      setResults(list);
      // cache full response so refresh can reuse
      localStorage.setItem(
        "courses_cache",
        JSON.stringify({
          results: list,
          total: res.total,
          totalPages: res.totalPages,
          page: res.page,
          size: res.size,
        })
      );
      setPage(res.page || requestPage);
      setTotal(res.total || 0);
      setTotalPages(res.totalPages || 1);
      setStatus("done");
    } catch (e) {
      setStatus("error");
      console.error(e);
    }
  }

  async function onUpload(e) {
    e.preventDefault();
    if (!file) return alert("choose CSV");
    setStatus("uploading");
    try {
      const resp = await uploadCoursesCSV(token, file);
      console.log("uploaded", resp);
      // after upload, refresh first page
      await doSearch(1);
      setStatus("done");
    } catch (e) {
      console.error(e);
      setStatus("error");
    }
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <h2>Courses</h2>
        <div>
          <button
            className="ghost"
            onClick={() => {
              localStorage.removeItem("token");
              logout();
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <div className="search-row">
        <input
          className="search-input"
          placeholder="Search courses (title, instructor, category)..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button onClick={() => doSearch(1)}>Search</button>
      </div>

      <div className="panel">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <h3 className="small">Results</h3>
          <div className="small">
            Total: {total} • Page {page} of {totalPages}
          </div>
        </div>

        <div className="course-list">
          {status === "loading" && <p className="small">Loading...</p>}
          {status !== "loading" && results.length === 0 && (
            <p className="small">No courses found.</p>
          )}
          {results.map((c) => (
            <div key={c.course_id} className="course">
              <h3>{c.title}</h3>
              <p>{c.description}</p>
              <div className="meta small">
                {c.instructor} • {c.category} • {c.duration}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            gap: 8,
            marginTop: 12,
            alignItems: "center",
          }}
        >
          <button
            onClick={() => doSearch(1)}
            disabled={page === 1 || status === "loading"}
            className="ghost"
          >
            First
          </button>
          <button
            onClick={() => doSearch(Math.max(1, page - 1))}
            disabled={page === 1 || status === "loading"}
            className="ghost"
          >
            Prev
          </button>

          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <span className="small">Page</span>
            <input
              type="number"
              min={1}
              max={totalPages}
              value={page}
              onChange={(e) => {
                const p = Number(e.target.value) || 1;
                if (p >= 1 && p <= totalPages) doSearch(p);
              }}
              style={{
                width: 60,
                padding: 6,
                borderRadius: 8,
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.04)",
                color: "inherit",
              }}
            />
            <span className="small">/ {totalPages}</span>
          </div>

          <button
            onClick={() => doSearch(page + 1)}
            disabled={page >= totalPages || status === "loading"}
            className="ghost"
          >
            Next
          </button>
          <button
            onClick={() => doSearch(totalPages)}
            disabled={page >= totalPages || status === "loading"}
            className="ghost"
          >
            Last
          </button>

          <div style={{ marginLeft: "auto" }} className="small">
            Showing {results.length} items
          </div>
        </div>

        <form onSubmit={onUpload} className="upload-area">
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <button type="submit">Upload CSV</button>
        </form>

        <div style={{ marginTop: 12 }} className="small">
          Local cache used for courses (localStorage). Refresh to clear.
        </div>
      </div>
    </div>
  );
}
