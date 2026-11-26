import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Router } from "express";
import { prisma } from "./db.js";

const router = Router();

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is missing from .env");
  return secret;
}

function createToken(userId: number, email: string, role: "admin" | "traveler") {
  return jwt.sign({ userId, email, role }, getJwtSecret(), { expiresIn: "1d" });
}

function normalizedEmail(value: unknown): string {
  return String(value ?? "").trim().toLowerCase();
}

router.post("/register", async (request, response) => {
  const email = normalizedEmail(request.body?.email);
  const password = String(request.body?.password ?? "");
  if (!/^\S+@\S+\.\S+$/.test(email) || email.length > 254) {
    response.status(400).json({ success: false, message: "Enter a valid email address" });
    return;
  }
  if (password.length < 8 || password.length > 128) {
    response.status(400).json({ success: false, message: "Password must be between 8 and 128 characters" });
    return;
  }
  try {
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({ data: { email, passwordHash } });
    response.status(201).json({
      success: true,
      token: createToken(user.id, user.email, "traveler"),
      user: { id: user.id, email: user.email, role: "traveler" },
    });
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "P2002") {
      response.status(409).json({ success: false, message: "An account already exists for this email" });
      return;
    }
    console.error("Account registration failed:", error);
    response.status(500).json({ success: false, message: "Could not create the account" });
  }
});

router.post("/user/login", async (request, response) => {
  const email = normalizedEmail(request.body?.email);
  const password = String(request.body?.password ?? "");
  if (!email || !password) {
    response.status(400).json({ success: false, message: "Email and password are required" });
    return;
  }
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      response.status(401).json({ success: false, message: "Email or password is incorrect" });
      return;
    }
    response.json({
      success: true,
      token: createToken(user.id, user.email, "traveler"),
      user: { id: user.id, email: user.email, role: "traveler" },
    });
  } catch (error) {
    console.error("User login failed:", error);
    response.status(500).json({ success: false, message: "Could not sign in" });
  }
});

export function requireTraveler(request: any, response: any, next: any) {
  const token = request.headers.authorization?.replace(/^Bearer\s+/i, "");
  if (!token) {
    response.status(401).json({ success: false, message: "Authentication required" });
    return;
  }
  try {
    const payload = jwt.verify(token, getJwtSecret());
    if (typeof payload !== "object" || payload.role !== "traveler" || typeof payload.userId !== "number") {
      response.status(403).json({ success: false, message: "Traveler account required" });
      return;
    }
    request.traveler = payload;
    next();
  } catch {
    response.status(401).json({ success: false, message: "Invalid or expired token" });
  }
}

router.get("/me", requireTraveler, async (request: any, response) => {
  response.json({
    success: true,
    user: { id: request.traveler.userId, email: request.traveler.email, role: "traveler" },
  });
});

router.post("/login", async (request, response) => {
  const email = normalizedEmail(request.body?.email);
  const password = String(request.body?.password ?? "");
  if (!email || !password) {
    response.status(400).json({ success: false, message: "Email and password are required" });
    return;
  }
  try {
    const admin = await prisma.adminUser.findUnique({ where: { email } });
    if (!admin || !(await bcrypt.compare(password, admin.passwordHash))) {
      response.status(401).json({ success: false, message: "Invalid email or password" });
      return;
    }
    response.json({
      success: true,
      token: createToken(admin.id, admin.email, "admin"),
      user: { id: admin.id, email: admin.email, role: admin.role },
    });
  } catch (error) {
    console.error("Admin login failed:", error);
    response.status(500).json({ success: false, message: "Login failed" });
  }
});

export function requireAdmin(request: any, response: any, next: any) {
  const token = request.headers.authorization?.replace(/^Bearer\s+/i, "");
  if (!token) {
    response.status(401).json({ success: false, message: "Authentication required" });
    return;
  }
  try {
    const payload = jwt.verify(token, getJwtSecret());
    if (typeof payload !== "object" || payload.role !== "admin") {
      response.status(403).json({ success: false, message: "Admin access required" });
      return;
    }
    request.admin = payload;
    next();
  } catch {
    response.status(401).json({ success: false, message: "Invalid or expired token" });
  }
}

export default router;
