import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Initialize Upstash Redis client
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// Configure the rate limiter
export const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(5, "10s"), // 5 requests per 10 seconds
  analytics: true, // Optional: enable analytics
  ephemeralCache: new Map(), // Optional: for caching blocked requests
});
