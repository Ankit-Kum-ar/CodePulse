/**
 * Caching and Rate Limiting Constants for GitHub API Proxy Routes
 */

export const GITHUB_CACHE_KEYS = {
  DEVELOPER: (username: string) => `github:developer:${username.toLowerCase()}`,
  PROFILE: (username: string) => `github:profile:${username.toLowerCase()}`,
  REPOS: (username: string) => `github:repos:${username.toLowerCase()}`,
  EVENTS: (username: string) => `github:events:${username.toLowerCase()}`,
};

export const GITHUB_CACHE_TTL = {
  // TTLs in milliseconds (cache-manager v5+ uses milliseconds)
  DEVELOPER: 5 * 60 * 1000, // 5 minutes
  PROFILE: 10 * 60 * 1000,  // 10 minutes
  REPOS: 5 * 60 * 1000,     // 5 minutes
  EVENTS: 3 * 60 * 1000,    // 3 minutes
};

export const GITHUB_RATE_LIMITS = {
  // Global defaults
  DEFAULT_TTL: 60000,  // 60-second window in ms
  DEFAULT_LIMIT: 60,   // 60 requests per minute

  // Proxy route limits (conservative to avoid exhausting GitHub rate limits)
  PROXY_TTL: 60000,    // 60-second window in ms
  PROXY_LIMIT: 30,     // 30 requests per minute per IP / authenticated user

  // Strict operations (sync, cache purge) to avoid abuse
  STRICT_TTL: 60000,   // 60-second window in ms
  STRICT_LIMIT: 10,    // 10 requests per minute per IP / authenticated user
};

