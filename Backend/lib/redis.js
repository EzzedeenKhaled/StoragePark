import Redis from "ioredis";
import dotenv from "dotenv";
dotenv.config({path: './Backend/.env'});

export const redis = new Redis(process.env.UPSTASH_REDIS_URL);
