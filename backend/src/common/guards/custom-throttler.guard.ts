import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

/**
 * Custom Throttler Guard
 *
 * Tracks rate limit quotas by authenticated user ID if the user is signed in
 * (via JWT Bearer token), or falls back to client IP address (supporting
 * reverse proxies via X-Forwarded-For headers) for public/unauthenticated requests.
 */
@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  protected async getTracker(req: Record<string, any>): Promise<string> {
    if (req.user?.id) {
      return `user-${req.user.id}`;
    }

    const forwarded = req.headers?.['x-forwarded-for'];
    const ip = forwarded
      ? (typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : forwarded[0])
      : (req.ips?.length ? req.ips[0] : req.ip);

    return `ip-${ip || 'unknown'}`;
  }
}

