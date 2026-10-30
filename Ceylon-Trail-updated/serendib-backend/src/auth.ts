import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Router } from "express";

import { prisma } from "./db.js";

const router = Router();

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is missing from .env");
  }

  return secret;
}

router.post("/login", async (request, response) => {
  const { email, password } = request.body;

  if (!email || !password) {
    response.status(400).json({
      success: false,
      message: "Email and password are required",
    });
    return;
  }

  try {
    const admin = await prisma.adminUser.findUnique({
      where: {
        email: String(email).trim().toLowerCase(),
      },
    });

    if (!admin) {
      response.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
      return;
    }

    const passwordMatches = await bcrypt.compare(
      String(password),
      admin.passwordHash,
    );

    if (!passwordMatches) {
      response.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
      return;
    }

    const token = jwt.sign(
      {
        userId: admin.id,
        email: admin.email,
        role: admin.role,
      },
      getJwtSecret(),
      {
        expiresIn: "1d",
      },
    );

    response.json({
      success: true,
      token,
      user: {
        id: admin.id,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Login failed:", error);

    response.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
});

export function requireAdmin(
  request: any,
  response: any,
  next: any,
) {
  const authorization = request.headers.authorization;
  const token = authorization?.replace("Bearer ", "");

  if (!token) {
    response.status(401).json({
      success: false,
      message: "Authentication required",
    });
    return;
  }

  try {
    const payload = jwt.verify(token, getJwtSecret());

    if (
      typeof payload !== "object" ||
      payload.role !== "admin"
    ) {
      response.status(403).json({
        success: false,
        message: "Admin access required",
      });
      return;
    }

    request.admin = payload;
    next();
  } catch {
    response.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
}

export default router;