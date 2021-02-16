import { Request, Response } from 'express';
import { Session, SessionData } from 'express-session';
import { Redis } from 'ioredis';

export type Context = {
  // eslint-disable-next-line no-undef
  req : Request & {session: Session & Partial<SessionData> & {userId: number}}
  res : Response
  redis: Redis
}
