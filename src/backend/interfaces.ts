import { Response, Request } from 'express';
import { IUser } from './models/userModel';

export interface IResponse extends Response {}
export interface IRequest extends Request {
  user: IUser;
}
