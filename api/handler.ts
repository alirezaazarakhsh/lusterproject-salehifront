import type { IncomingMessage, ServerResponse } from 'http';
import { appReady } from '../server';

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const app = await appReady;
  return (app as any)(req, res);
}
