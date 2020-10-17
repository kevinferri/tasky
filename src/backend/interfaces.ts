import { Response, Request } from 'express';
import { DocumentQuery, Query } from 'mongoose';

import { IUser } from './models/userModel';

export interface IResponse extends Response {}
export interface IRequest extends Request {
  user: IUser;
}

export interface IQuery extends Query<any> {
  cache?: () => Query<any>;
}

export interface IDocumentQuery extends DocumentQuery<{}, any, {}> {
  cache?: () => Query<any>;
}
