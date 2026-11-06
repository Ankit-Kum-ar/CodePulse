import { CustomThrottlerGuard } from './custom-throttler.guard';

describe('CustomThrottlerGuard', () => {
  let guard: CustomThrottlerGuard;

  beforeEach(() => {
    // Instantiate with dummy dependencies
    guard = new CustomThrottlerGuard(
      { throttlers: [{ limit: 60, ttl: 60000 }] },
      {} as any,
      {} as any,
    );
  });

  it('should track by user ID when user is authenticated in request', async () => {
    const req = {
      user: { id: 'usr_12345' },
      ip: '192.168.1.1',
    };

    const tracker = await (guard as any).getTracker(req);
    expect(tracker).toBe('user-usr_12345');
  });

  it('should track by x-forwarded-for header when unauthenticated and behind a reverse proxy', async () => {
    const req = {
      headers: {
        'x-forwarded-for': '203.0.113.195, 70.41.3.18',
      },
      ip: '10.0.0.1',
    };

    const tracker = await (guard as any).getTracker(req);
    expect(tracker).toBe('ip-203.0.113.195');
  });

  it('should track by req.ips when available and no user is authenticated', async () => {
    const req = {
      ips: ['198.51.100.42'],
      ip: '10.0.0.1',
    };

    const tracker = await (guard as any).getTracker(req);
    expect(tracker).toBe('ip-198.51.100.42');
  });

  it('should track by req.ip when no forwarded headers or user are present', async () => {
    const req = {
      ip: '198.51.100.99',
    };

    const tracker = await (guard as any).getTracker(req);
    expect(tracker).toBe('ip-198.51.100.99');
  });

  it('should fallback to ip-unknown when no IP is found', async () => {
    const req = {};

    const tracker = await (guard as any).getTracker(req);
    expect(tracker).toBe('ip-unknown');
  });
});

