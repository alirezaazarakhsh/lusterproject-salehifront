import type { Request, Response, NextFunction } from 'express';
import { adminAuth } from '../lib/firebase-admin';
import type { DecodedIdToken } from 'firebase-admin/auth';
import {
  getOrCreateUser,
  parsePermissionsJson,
  verifyAdminSessionToken,
} from '../db/users';

export interface AuthRequest extends Request {
  user?:
    | DecodedIdToken
    | {
        id: number;
        uid: string;
        phone: string;
        email: string;
        displayName: string;
        role: string;
        avatarUrl?: string;
        permissions?: string[];
      };
}

export const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'لطفاً ابتدا با شماره موبایل و رمز عبور وارد پنل مدیریت شوید.' });
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    // ۱. بررسی توکن اختصاصی ادمین (شماره موبایل و رمز عبور در PostgreSQL)
    if (token.startsWith('adm.')) {
      const adminRecord = await verifyAdminSessionToken(token);
      if (!adminRecord) {
        return res.status(401).json({ error: 'نشست مدیریتی شما منقضی شده یا نامعتبر است. لطفاً مجدداً وارد شوید.' });
      }
      req.user = {
        id: adminRecord.id,
        uid: adminRecord.uid,
        phone: adminRecord.phone,
        email: adminRecord.email,
        displayName: adminRecord.displayName,
        role: adminRecord.role,
        avatarUrl:
          adminRecord.avatarUrl ||
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
        permissions: parsePermissionsJson(adminRecord.permissionsJson),
      };
      return next();
    }

    // ۲. پشتیبانی از توکن Firebase در صورت نیاز
    const decodedToken = await adminAuth.verifyIdToken(token);
    req.user = decodedToken;
    if (decodedToken.uid && decodedToken.email) {
      await getOrCreateUser(
        decodedToken.uid,
        decodedToken.email,
        decodedToken.name || decodedToken.email
      );
    }
    return next();
  } catch (error) {
    console.error('Error verifying admin token:', error);
    return res.status(401).json({ error: 'نشست مدیریتی نامعتبر است. لطفاً دوباره وارد شوید.' });
  }
};
