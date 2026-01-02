import { extractProxyRoutes } from '../proxyUtils';

describe('extractProxyRoutes', () => {
  it('should return empty array for undefined proxy', () => {
    expect(extractProxyRoutes(undefined)).toEqual([]);
  });

  it('should return empty array for empty proxy array', () => {
    expect(extractProxyRoutes([])).toEqual([]);
  });

  it('should extract context as array of strings', () => {
    const proxy = [{ context: ['/api'], target: 'http://localhost:3000' }];
    expect(extractProxyRoutes(proxy)).toEqual(['/api']);
  });

  it('should extract multiple contexts from array', () => {
    const proxy = [
      { context: ['/api', '/graphql'], target: 'http://localhost:3000' },
    ];
    expect(extractProxyRoutes(proxy)).toEqual(['/api', '/graphql']);
  });

  it('should extract context as single string', () => {
    const proxy = [{ context: '/api', target: 'http://localhost:3000' }];
    expect(extractProxyRoutes(proxy)).toEqual(['/api']);
  });

  it('should extract path property (legacy format)', () => {
    const proxy = [{ path: '/legacy', target: 'http://localhost:3000' }];
    expect(extractProxyRoutes(proxy)).toEqual(['/legacy']);
  });

  it('should extract path as array', () => {
    const proxy = [
      { path: ['/legacy', '/old-api'], target: 'http://localhost:3000' },
    ];
    expect(extractProxyRoutes(proxy)).toEqual(['/legacy', '/old-api']);
  });

  it('should prefer context over path', () => {
    const proxy = [
      { context: '/api', path: '/legacy', target: 'http://localhost:3000' },
    ];
    expect(extractProxyRoutes(proxy)).toEqual(['/api']);
  });

  it('should handle multiple proxy entries', () => {
    const proxy = [
      { context: ['/api'], target: 'http://localhost:3000' },
      { context: '/ws', target: 'http://localhost:3001' },
      { path: '/legacy', target: 'http://localhost:3002' },
    ];
    expect(extractProxyRoutes(proxy)).toEqual(['/api', '/ws', '/legacy']);
  });

  it('should skip function entries', () => {
    const proxy = [
      { context: ['/api'], target: 'http://localhost:3000' },
      () => ({ context: '/dynamic', target: 'http://localhost:3001' }),
    ];
    // Functions are filtered out since we can't statically analyze them
    expect(extractProxyRoutes(proxy as any)).toEqual(['/api']);
  });

  it('should skip entries without context or path', () => {
    const proxy = [
      { context: ['/api'], target: 'http://localhost:3000' },
      { target: 'http://localhost:3001', router: {} }, // router-based proxy without context
    ];
    expect(extractProxyRoutes(proxy)).toEqual(['/api']);
  });

  it('should handle null entries gracefully', () => {
    const proxy = [
      { context: ['/api'], target: 'http://localhost:3000' },
      null as any,
    ];
    expect(extractProxyRoutes(proxy)).toEqual(['/api']);
  });

  it('should handle mixed context types across entries', () => {
    const proxy = [
      { context: ['/api', '/graphql'], target: 'http://localhost:3000' },
      { context: '/ws', target: 'http://localhost:3001' },
    ];
    expect(extractProxyRoutes(proxy)).toEqual(['/api', '/graphql', '/ws']);
  });
});
