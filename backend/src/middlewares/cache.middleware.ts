import { createMiddleware } from "hono/factory";
import { Redis } from "ioredis";
import { HttpError, HttpStatus } from "../lib/errors.js";

const redis = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: Number(process.env.REDIS_PORT) || 6379,
});

interface CacheOptions {
  expire?: number;
  prefix?: string;
  paths?: string[];
}

class CacheManager {
  private redis: Redis;

  constructor(redis: Redis) {
    this.redis = redis;
  }

  async get(key: string): Promise<string | null> {
    try {
      // console.log("get success");
      // console.log("key: ", key);
      return await this.redis.get(key);
    } catch (error) {
      console.error("Redis get error:", error);
      return null;
    }
  }

  async set(key: string, value: string, expire?: number): Promise<void> {
    try {
      // console.log("set success");
      if (expire) {
        await this.redis.setex(key, expire, value);
      } else {
        await this.redis.set(key, value);
      }
    } catch (error) {
      console.error("Redis set error:", error);
    }
  }

  async delete(pattern: string): Promise<void> {
    try {
      const keys = await this.redis.keys(pattern);
      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
    } catch (error) {
      console.error("Redis delete error:", error);
    }
  }
}

const cacheManager = new CacheManager(redis);

export const cacheMiddleware = (options: CacheOptions = {}) => {
  const { expire = 3600, prefix = "cache", paths = ["*"] } = options;

  return createMiddleware(async (c, next) => {
    try {
      let currentPath = c.req.path;
      // console.log("paths:", paths);
      // console.log("currentPath: ", currentPath);
      if (currentPath.startsWith("/api")) {
        currentPath = currentPath.replace("/api", "");
      }

      const shouldCache = paths.some(
        (path) => path === "*" || currentPath.startsWith(path)
      );

      if (!shouldCache) {
        // console.log("gk");
        return await next();
      }

      // const token = c.get("token") || "";
      // const tokenHash = token.substring(0, 10);
      const method = c.req.method.toLowerCase();
      const queryParams = new URLSearchParams(c.req.query()).toString();
      const cacheKey = `${prefix}:${currentPath}:${queryParams}`;
      // console.log("cachekey", cacheKey);

      if (method === "get") {
        const cachedData = await cacheManager.get(cacheKey);
        if (cachedData) {
          return c.json(JSON.parse(cachedData));
        }
      }

      await next();

      if (method === "get" && c.res && c.res.status === 200) {
        const responseBody = await c.res.clone().json();
        await cacheManager.set(cacheKey, JSON.stringify(responseBody), expire);
      }

     
    } catch (error) {
      console.error("Cache middleware error:", error);
      throw new HttpError(HttpStatus.INTERNAL_SERVER_ERROR, {
        message: "Cache error occurred",
      });
    }
  });
};

export const invalidateCache = async (pattern: string): Promise<void> => {
  // console.log("deleting cache");
  await cacheManager.delete(pattern);
};


export const profileCacheMiddleware = cacheMiddleware({
  expire: 1800,
  prefix: "profile",
  paths: ["/profile"],
});

export const feedCacheMiddleware = cacheMiddleware({
  expire: 1800,
  prefix: "feed",
  paths: ["/feed"]
})