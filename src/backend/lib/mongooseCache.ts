import * as redis from 'redis';
import * as util from 'util';
import { Mongoose } from 'mongoose';

import Config from '../lib/Config';
import { IQuery } from '../interfaces';

const client = redis.createClient(Config.get('REDIS_URI'));

/**
 * Add Redis caching to Mongoose queries.
 *
 * Mongoose queries by default will always fetch data from the DB.
 * This mixin will create a `.cache` function on Mongoose's Query object so
 * queries can be cached in Redis and later retrieved there instead of
 * always hitting the DB.
 */
export const applyMongooseCachedQueryMixins = (mongoose: Mongoose) => {
  const exec = mongoose.Query.prototype.exec;
  (client.hget as any) = util.promisify(client.hget);

  (mongoose.Query.prototype as IQuery).cache = function (
    ttl?: number,
    key?: string,
  ) {
    this.useCache = true;
    this.expire = ttl;
    this.hashKey = JSON.stringify(key || this.mongooseCollection.name);

    return this;
  };

  /**
   * Override Mongoose's `exec` function to first check cache
   * for data instead of directly hitting the DB.
   */
  mongoose.Query.prototype.exec = async function () {
    if (!this.useCache) {
      return await exec.apply(this, arguments);
    }

    const key = JSON.stringify({
      collection: this.mongooseCollection.name,
      query: this.getQuery(),
      fields: this._fields ? Object.keys(this._fields) : [],
      options: this.options,
    });

    /**
     * Get the cached value from Redis.
     */
    const cacheValue = await client.hget(this.hashKey, key);

    /**
     * If there is nothing in the cache, get the result from the DB
     * and then store result in cache.
     */
    if (!cacheValue) {
      const result = await exec.apply(this, arguments);

      client.hset(this.hashKey, key, JSON.stringify(result));

      if (this.expire) {
        client.expire(this.hashKey, this.expire);
      }

      return result;
    }

    /**
     * Return the cached value
     */
    const doc: Document | Document[] = JSON.parse(cacheValue.toString());
    if (Array.isArray(doc)) {
      return doc.map((d) => new this.model(d));
    } else {
      return this.model(doc);
    }
  };
};

/**
 * Expose the ability to remove an entry in the cache.
 */
export const bustCache = (hashKey: string) => {
  client.del(JSON.stringify(hashKey));
};
