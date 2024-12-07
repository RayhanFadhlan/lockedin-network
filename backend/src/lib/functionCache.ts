import { Redis } from "ioredis";
import { CacheManager } from "./CacheManager.js";



const cacheManager = new CacheManager();

export const withCache = (prefix: string, expire: number = 3600) => {
  return  function (fn: Function) {
    return async (...args: any[]) => {
      const cacheKey = `${prefix}:${fn.name}:${JSON.stringify(args)}`;
      
      try {

        const cachedResult = await cacheManager.get(cacheKey);
        if (cachedResult) {
          return JSON.parse(cachedResult);
        }

        
        const result = await fn(...args);
        

        await cacheManager.set(cacheKey, JSON.stringify(result), expire);
        
        return result;
      } catch (error) {
        console.error(`Cache error in ${fn.name}:`, error);

        return await fn(...args);
      }
    };
  };
};
