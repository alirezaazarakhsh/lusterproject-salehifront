import crypto from 'crypto';
import { asc, eq } from 'drizzle-orm';
import { db } from './index.ts';
import { users } from './schema.ts';

const ADMIN_TOKEN_SECRET =
  process.env.ADMIN_TOKEN_SECRET || 'salehi-chandelier-postgres-admin-secret-2026';

// حداکثر زمان نشست هر ادمین در پنل: ۳۰ دقیقه
const ADMIN_SESSION_MAX_AGE_MS = 30 * 60 * 1000;

export const ALL_ADMIN_SECTIONS = [
  'dashboard',
  'admins',
  'products',
  'categories',
  'projects',
  'stories',
  'articles',
  'messages',
  'orders',
  'settings',
] as const;

export const DEFAULT_ADMIN_AVATAR =
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80';

export function parsePermissionsJson(raw?: string | string[] | null): string[] {
  if (Array.isArray(raw)) {
    const filtered = raw.map((s) => String(s).trim()).filter(Boolean);
    return filtered.length > 0 ? filtered : [...ALL_ADMIN_SECTIONS];
  }
  if (typeof raw === 'string' && raw.trim()) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const cleaned = parsed.map((s) => String(s).trim()).filter(Boolean);
        // اگر ادمین قبلاً تمام ۹ بخش قبلی را داشته، بخش جدید تنظیمات وب سایت را هم داشته باشد
        if (cleaned.length === 9 && !cleaned.includes('settings')) {
          return [...cleaned, 'settings'];
        }
        return cleaned;
      }
    } catch {
      // ignore parse error
    }
  }
  return [...ALL_ADMIN_SECTIONS];
}

export function normalizePhoneNumber(raw: string): string {
  const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
  const arabicDigits = '٠١٢٣٤٥٦٧٨٩';
  return String(raw || '')
    .trim()
    .replace(/[۰-۹]/g, (d) => String(persianDigits.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String(arabicDigits.indexOf(d)))
    .replace(/\s+/g, '');
}

let defaultAdminSeeded = false;

export async function ensureDefaultAdmin() {
  if (defaultAdminSeeded) return;
  try {
    const defaultPhone = '09120759419';
    const defaultUid = `admin-${defaultPhone}`;
    const existing = await db
      .select()
      .from(users)
      .where(eq(users.phone, defaultPhone));

    if (existing.length === 0) {
      await db
        .insert(users)
        .values({
          uid: defaultUid,
          phone: defaultPhone,
          password: 'sasha9419',
          email: `${defaultPhone}@salehi-admin.local`,
          displayName: 'اکبر صالحی (مدیر ارشد)',
          role: 'super_admin',
          avatarUrl:
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
          permissionsJson: JSON.stringify(ALL_ADMIN_SECTIONS),
        })
        .onConflictDoUpdate({
          target: users.uid,
          set: {
            phone: defaultPhone,
            password: 'sasha9419',
            role: 'super_admin',
          },
        });
    } else if (!existing[0].avatarUrl) {
      await db
        .update(users)
        .set({
          avatarUrl:
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
          permissionsJson:
            existing[0].permissionsJson || JSON.stringify(ALL_ADMIN_SECTIONS),
        })
        .where(eq(users.id, existing[0].id));
    }
    defaultAdminSeeded = true;
  } catch (error) {
    console.error('Error ensuring default admin:', error);
  }
}

export function createAdminSessionToken(user: {
  id: number;
  uid: string;
  phone: string;
  role: string;
}): string {
  const now = Date.now();
  const payload = JSON.stringify({
    id: user.id,
    uid: user.uid,
    phone: user.phone,
    role: user.role,
    iat: now,
    exp: now + ADMIN_SESSION_MAX_AGE_MS,
  });
  const base64Payload = Buffer.from(payload, 'utf8').toString('base64url');
  const signature = crypto
    .createHmac('sha256', ADMIN_TOKEN_SECRET)
    .update(base64Payload)
    .digest('base64url');
  return `adm.${base64Payload}.${signature}`;
}

export async function verifyAdminSessionToken(token: string) {
  if (!token || !token.startsWith('adm.')) {
    return null;
  }
  const parts = token.split('.');
  if (parts.length !== 3) {
    return null;
  }
  const [, base64Payload, signature] = parts;
  const expectedSig = crypto
    .createHmac('sha256', ADMIN_TOKEN_SECRET)
    .update(base64Payload)
    .digest('base64url');

  if (signature !== expectedSig) {
    return null;
  }

  try {
    const decoded = JSON.parse(
      Buffer.from(base64Payload, 'base64url').toString('utf8')
    );
    const now = Date.now();
    if (decoded.exp && now > Number(decoded.exp)) {
      return null;
    }
    if (decoded.iat && now - Number(decoded.iat) > ADMIN_SESSION_MAX_AGE_MS) {
      return null;
    }
    await ensureDefaultAdmin();
    const rows = await db
      .select()
      .from(users)
      .where(eq(users.phone, normalizePhoneNumber(decoded.phone)));
    return rows[0] || null;
  } catch (error) {
    console.error('Error verifying admin session token:', error);
    return null;
  }
}

export async function authenticateAdminByPhoneAndPassword(
  rawPhone: string,
  rawPassword: string
) {
  await ensureDefaultAdmin();
  const phone = normalizePhoneNumber(rawPhone);
  const password = String(rawPassword || '').trim();

  if (!phone || !password) {
    throw new Error('شماره موبایل و رمز عبور الزامی است.');
  }

  try {
    const rows = await db.select().from(users).where(eq(users.phone, phone));
    const matchedUser = rows.find((u) => u.password === password);

    if (!matchedUser) {
      throw new Error('شماره موبایل یا رمز عبور اشتباه است.');
    }

    const token = createAdminSessionToken(matchedUser);
    const permissions = parsePermissionsJson(matchedUser.permissionsJson);
    const userPayload = {
      id: matchedUser.id,
      uid: matchedUser.uid,
      phone: matchedUser.phone,
      displayName: matchedUser.displayName,
      role: matchedUser.role,
      email: matchedUser.email,
      avatarUrl:
        matchedUser.avatarUrl ||
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
      permissionsJson: matchedUser.permissionsJson || JSON.stringify(permissions),
      permissions,
      createdAt: matchedUser.createdAt,
    };
    return {
      token,
      expiresInMs: ADMIN_SESSION_MAX_AGE_MS,
      admin: userPayload,
      user: userPayload,
    };
  } catch (error: any) {
    if (error?.message === 'شماره موبایل یا رمز عبور اشتباه است.') {
      throw error;
    }
    console.error('Database query failed in authenticateAdmin:', error);
    throw new Error('خطا در بررسی اطلاعات ورود مدیر.', { cause: error });
  }
}

export async function getOrCreateUser(
  uid: string,
  email: string,
  displayName = 'مدیر سیستم'
) {
  try {
    const result = await db
      .insert(users)
      .values({
        uid,
        email,
        displayName,
      })
      .onConflictDoUpdate({
        target: users.uid,
        set: {
          email,
          displayName,
        },
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Database query failed in getOrCreateUser:', error);
    throw new Error('Failed to synchronize user profile.', { cause: error });
  }
}

export async function getUsers() {
  try {
    await ensureDefaultAdmin();
    const rows = await db.select().from(users).orderBy(asc(users.id));
    return rows.map((r) => ({
      ...r,
      avatarUrl:
        r.avatarUrl ||
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
      permissions: parsePermissionsJson(r.permissionsJson),
    }));
  } catch (error) {
    console.error('Database query failed in getUsers:', error);
    throw new Error('خطا در دریافت لیست ادمین‌ها از دیتابیس.', {
      cause: error,
    });
  }
}

export async function createAdminUser(data: {
  displayName: string;
  phone: string;
  password: string;
  role?: string;
  avatarUrl?: string;
  permissions?: string[];
  permissionsJson?: string;
}) {
  await ensureDefaultAdmin();
  const phone = normalizePhoneNumber(data.phone);
  const password = String(data.password || '').trim();
  const displayName = String(data.displayName || '').trim() || `ادمین (${phone})`;
  const permissions = parsePermissionsJson(
    data.permissions || data.permissionsJson
  );
  const role =
    permissions.length === ALL_ADMIN_SECTIONS.length ? 'super_admin' : 'admin';
  const avatarUrl =
    String(data.avatarUrl || '').trim() ||
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80';

  if (!phone || phone.length < 10) {
    throw new Error('لطفاً شماره موبایل معتبر وارد کنید (مثلاً 09120759419).');
  }
  if (!password || password.length < 4) {
    throw new Error('رمز عبور باید حداقل ۴ کاراکتر باشد.');
  }

  try {
    const existing = await db.select().from(users).where(eq(users.phone, phone));
    if (existing.length > 0) {
      throw new Error('ادمینی با این شماره موبایل قبلاً ثبت شده است.');
    }

    const uid = `admin-${phone}-${Date.now()}`;
    const email = `${phone}@salehi-admin.local`;

    const result = await db
      .insert(users)
      .values({
        uid,
        phone,
        password,
        email,
        displayName,
        role,
        avatarUrl,
        permissionsJson: JSON.stringify(permissions),
      })
      .returning();

    return {
      ...result[0],
      permissions,
    };
  } catch (error: any) {
    if (
      error?.message?.includes('قبلاً ثبت شده') ||
      error?.message?.includes('معتبر') ||
      error?.message?.includes('کاراکتر')
    ) {
      throw error;
    }
    console.error('Database query failed in createAdminUser:', error);
    throw new Error('خطا در ثبت ادمین جدید در دیتابیس.', { cause: error });
  }
}

export async function updateAdminUser(
  id: number,
  data: {
    displayName?: string;
    phone?: string;
    password?: string;
    role?: string;
    avatarUrl?: string;
    permissions?: string[];
    permissionsJson?: string;
  }
) {
  await ensureDefaultAdmin();
  try {
    const existingRows = await db.select().from(users).where(eq(users.id, id));
    const current = existingRows[0];
    if (!current) {
      throw new Error('ادمین مورد نظر یافت نشد.');
    }

    const nextPhone = data.phone
      ? normalizePhoneNumber(data.phone)
      : current.phone;
    const nextPassword =
      data.password && data.password.trim().length > 0
        ? data.password.trim()
        : current.password;
    const nextDisplayName =
      data.displayName && data.displayName.trim().length > 0
        ? data.displayName.trim()
        : current.displayName;
    const nextPermissions =
      data.permissions || data.permissionsJson
        ? parsePermissionsJson(data.permissions || data.permissionsJson)
        : parsePermissionsJson(current.permissionsJson);
    const nextRole =
      nextPermissions.length === ALL_ADMIN_SECTIONS.length
        ? 'super_admin'
        : 'admin';
    const nextAvatarUrl =
      typeof data.avatarUrl === 'string' && data.avatarUrl.trim().length > 0
        ? data.avatarUrl.trim()
        : current.avatarUrl ||
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80';

    const result = await db
      .update(users)
      .set({
        phone: nextPhone,
        password: nextPassword,
        displayName: nextDisplayName,
        role: nextRole,
        avatarUrl: nextAvatarUrl,
        permissionsJson: JSON.stringify(nextPermissions),
        email: `${nextPhone}@salehi-admin.local`,
      })
      .where(eq(users.id, id))
      .returning();

    return {
      ...result[0],
      permissions: nextPermissions,
    };
  } catch (error: any) {
    console.error('Database query failed in updateAdminUser:', error);
    throw new Error(error?.message || 'خطا در ویرایش اطلاعات ادمین.', {
      cause: error,
    });
  }
}

export async function deleteAdminUser(id: number) {
  await ensureDefaultAdmin();
  try {
    const allAdmins = await db.select().from(users);
    if (allAdmins.length <= 1) {
      throw new Error(
        'امکان حذف تنها ادمین باقی‌مانده سیستم وجود ندارد. ابتدا ادمین دیگری اضافه کنید.'
      );
    }

    await db.delete(users).where(eq(users.id, id));
    return { success: true, id };
  } catch (error: any) {
    if (error?.message?.includes('تنها ادمین')) {
      throw error;
    }
    console.error('Database query failed in deleteAdminUser:', error);
    throw new Error('خطا در حذف ادمین از دیتابیس.', { cause: error });
  }
}
