import type { Request, Response } from 'express';
import { appReady } from '../server.ts';

export default async function handler(req: Request, res: Response) {
  const app = await appReady;
  app(req, res);
}