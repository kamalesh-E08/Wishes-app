import type {
  Request,
  Response,
  NextFunction,
} from "express";

import {firebaseAuth} from "../config/firebase";

export interface AuthRequest
  extends Request {
  user?: {
    uid: string;
    email?: string;
  };
}

export const auth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const header =
      req.headers.authorization;

    if (!header) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    const token =
      header.replace(
        "Bearer ",
        "",
      );

   const decoded = await firebaseAuth.verifyIdToken(token);

    req.user = {
      uid: decoded.uid,
      email: decoded.email,
    };

    next();
  } catch{
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
};