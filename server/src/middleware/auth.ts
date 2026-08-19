import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  admin?: { id: string; role: string };
}

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) return res.status(401).json({ message: "Unauthorized" });

  try {
    const token = auth.slice(7);
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET missing");
    const decoded = jwt.verify(token, secret) as { id: string; role: string };
    req.admin = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
