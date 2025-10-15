import { AdminModel } from "../models";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AdminPayload } from "../types";

export class AuthService {
  async signup(email: string, password: string) {
    const exists = await AdminModel.findOne({ email });
    if (exists) throw { status: 409, message: "admin exists" };
    const hash = await bcrypt.hash(password, 12);
    const admin = new AdminModel({ email, password: hash });
    await admin.save();
    return { id: admin._id, email: admin.email };
  }

  async login(email: string, password: string) {
    const admin = await AdminModel.findOne({ email });
    if (!admin) throw { status: 401, message: "invalid credentials" };
    const ok = await bcrypt.compare(password, admin.password);
    if (!ok) throw { status: 401, message: "invalid credentials" };
    const payload: AdminPayload = {
      sub: admin._id.toString(),
      email: admin.email,
      role: "admin",
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET || "secret", {
      expiresIn: "1h",
    });
    return { access_token: token };
  }

  verifyToken(token: string): AdminPayload | null {
    try {
      const p = jwt.verify(
        token,
        process.env.JWT_SECRET || "secret"
      ) as AdminPayload;
      return p;
    } catch (e) {
      return null;
    }
  }
}
export const authService = new AuthService();
