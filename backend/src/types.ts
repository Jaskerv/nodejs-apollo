import { Request, Response } from 'express';

export type Context = {
  // eslint-disable-next-line no-undef
  req : Request & {session: Express.Session}
  res : Response
}
