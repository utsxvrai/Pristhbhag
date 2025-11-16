const redis = require('redis');
require('dotenv').config();
const JWT = require('jsonwebtoken');

const REDIS_URL = process.env.REDIS_URL || process.env.REDIS_HOST && process.env.REDIS_PORT ? `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}` : 'redis://localhost:6379';

const client = redis.createClient({ url: REDIS_URL });

client.on('error', (err) => console.error('Redis Client Error', err));

async function connectRedis() {
  if (!client.isOpen) {
    await client.connect();
  }
}

async function revokeToken(token) {
  try {
    if (!token) return false;
    const raw = token.startsWith('Bearer ') ? token.split(' ')[1] : token;
    // decode token to get expiry
    const decoded = JWT.decode(raw);
    let ttl = 60 * 60; // default 1 hour
    if (decoded && decoded.exp) {
      const nowSec = Math.floor(Date.now() / 1000);
      ttl = Math.max(1, decoded.exp - nowSec);
    }
    await connectRedis();
    await client.set(`revoked:${raw}`, '1', { EX: ttl });
    return true;
  } catch (err) {
    console.error('Failed to revoke token in Redis', err);
    return false;
  }
}

async function isRevoked(token) {
  try {
    if (!token) return false;
    const raw = token.startsWith('Bearer ') ? token.split(' ')[1] : token;
    await connectRedis();
    const v = await client.get(`revoked:${raw}`);
    return !!v;
  } catch (err) {
    console.error('Failed to check revoked token in Redis', err);
    return false;
  }
}

module.exports = {
  client,
  revokeToken,
  isRevoked,
  connectRedis,
};
