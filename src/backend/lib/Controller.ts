import { DocumentQuery } from 'mongoose';

import { IRequest, IResponse } from '../interfaces';

export abstract class Controller {
  readonly DEFAULT_LIMIT = 25;
  readonly MIN_LIMIT = 1;
  readonly MAX_LIMIT = 100;

  /**
   * Gets the logged in user for the given request.
   */
  getCurUser(req: IRequest) {
    return req.user;
  }

  /**
   * Gets the body in the given request.
   */
  getReqBody(req: IRequest) {
    return req.body;
  }

  /**
   * Gets the url params in the given request.
   */
  getReqParams(req: IRequest) {
    return req.params;
  }

  /**
   * Gets the url params in the given request.
   */
  getQueryParams(req: IRequest) {
    return req.query;
  }

  /**
   * Gets and formats fields in the url query params so Mongoose can query based on them.
   * ?fields=_id,name,title -> fields name title.
   */
  private _getReqFields(req: IRequest) {
    if (!req.query.fields) {
      return '';
    }

    return (req.query.fields as string).split(',').join(' ');
  }

  /**
   * Executes a given Mongoose query from options in the query string of the request url:
   *
   * `fields`  - The document fields the query should return.
   * `sort`    - How the query should be sorted.
   * `limit`   - How many documents the query should return.
   */
  async query(req: IRequest, query: DocumentQuery<any, any, {}>) {
    const queryParams = this.getQueryParams(req);
    const sort = (queryParams.sort as string) || '';
    let limit = parseInt(queryParams.limit as string);

    if (!limit || limit > this.MAX_LIMIT || limit < this.MIN_LIMIT) {
      limit = this.DEFAULT_LIMIT;
    }

    return await query
      .select(this._getReqFields(req))
      .limit(limit)
      .sort(sort)
      .exec();
  }
}
