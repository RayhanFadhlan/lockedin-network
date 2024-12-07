import { Redis } from "ioredis";


export class CacheManager {
  private redis: Redis;

  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || "localhost",
      port: Number(process.env.REDIS_PORT) || 6379,
    });
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
