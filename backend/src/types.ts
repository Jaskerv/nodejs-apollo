import { Request, Response } from 'express';
import { Redis } from 'ioredis';

export type Context = {
  // eslint-disable-next-line no-undef
  req : Request & {session: Express.Session}
  res : Response
  redis: Redis
}
