import RouteController from '../Controller';

const namedPaths = {
  Home: '/',
  Post: '/post/:id',
  Users: '/users{/:id}',
  Files: { path: '/files/*path', sensitive: true },
} as const;

const routes = [
  { name: 'Home' },
  { name: 'Post' },
  { name: 'Users' },
  { name: 'Files' },
  { name: '/raw/:slug' },
];

function createRouter() {
  return new RouteController({
    history: {} as any,
    namedPaths,
    routes,
    notFound: { notFound: true },
  });
}

describe('RouteController', () => {
  describe('getMatchedRoutes', () => {
    it.each([
      ['/', [{ name: 'Home' }]],
      ['/post/5', [{ name: 'Post', id: '5' }]],
      ['/post/5/', [{ name: 'Post', id: '5' }]],
      ['/users', [{ name: 'Users' }]],
      ['/users/5', [{ name: 'Users', id: '5' }]],
      ['/files/a/b', [{ name: 'Files', path: ['a', 'b'] }]],
      ['/FILES/a', [{ notFound: true }]],
      ['/raw/x', [{ name: '/raw/:slug', slug: 'x' }]],
      ['/nope/x', [{ notFound: true }]],
    ])('%s', (path, expected) => {
      expect(createRouter().getMatchedRoutes(path)).toEqual(expected);
    });

    it('decodes params', () => {
      expect(createRouter().getMatchedRoutes('/post/a%20b')).toEqual([
        { name: 'Post', id: 'a b' },
      ]);
    });

    it('keeps malformed escapes raw instead of throwing', () => {
      expect(createRouter().getMatchedRoutes('/post/%E0%A4%A')).toEqual([
        { name: 'Post', id: '%E0%A4%A' },
      ]);
      expect(createRouter().getMatchedRoutes('/files/%/b')).toEqual([
        { name: 'Files', path: ['%', 'b'] },
      ]);
      expect(createRouter().getMatchedRoutes('/post/5?q=50%')).toEqual([
        { name: 'Post', id: '5?q=50%' },
      ]);
      const catchAll = new RouteController({
        history: {} as any,
        namedPaths: { All: '{/*rest}' },
        routes: [{ name: 'All' }],
        notFound: {},
      });
      expect(catchAll.getMatchedRoutes('/%E0%A4%A/x')).toEqual([
        { name: 'All', rest: ['%E0%A4%A', 'x'] },
      ]);
    });

    it('respects a custom decode', () => {
      const router = new RouteController({
        history: {} as any,
        namedPaths: { Post: { path: '/post/:id', decode: false } },
        routes: [{ name: 'Post' }],
        notFound: {},
      });
      expect(router.getMatchedRoutes('/post/a%20b')).toEqual([
        { name: 'Post', id: 'a%20b' },
      ]);
    });

    it('falls back to the safe decode when decode is undefined', () => {
      const undefinedDecode = new RouteController({
        history: {} as any,
        namedPaths: { Post: { path: '/post/:id', decode: undefined } },
        routes: [{ name: 'Post' }],
        notFound: {},
      });
      expect(undefinedDecode.getMatchedRoutes('/post/%E0%A4%A')).toEqual([
        { name: 'Post', id: '%E0%A4%A' },
      ]);
    });
  });

  describe('buildPath', () => {
    it('builds named and raw paths', () => {
      const router = createRouter();
      expect(router.buildPath('Home')).toBe('/');
      expect(router.buildPath('Post', { id: 'a b/c' })).toBe('/post/a%20b%2Fc');
      expect(router.buildPath('Users')).toBe('/users');
      expect(router.buildPath('Users', { id: 5 })).toBe('/users/5');
      expect(router.buildPath('Files', { path: ['a', 'b'] })).toBe(
        '/files/a/b',
      );
      expect(router.buildPath('/raw/:slug', { slug: 'x' })).toBe('/raw/x');
    });

    it('stringifies numbers and skips null and empty arrays', () => {
      const router = createRouter();
      expect(router.buildPath('Post', { id: 5 })).toBe('/post/5');
      expect(router.pathBuilders.Post({ id: 5 })).toBe('/post/5');
      expect(router.buildPath('Users', { id: null as any })).toBe('/users');
      expect(router.buildPath('Users', { id: '' })).toBe('/users');
      expect(router.pathBuilders.Users(null as any)).toBe('/users');
      expect(
        new RouteController({
          history: {} as any,
          namedPaths: { A: '/a{/*rest}' },
          routes: [{ name: 'A' }],
          notFound: {},
        }).buildPath('A', { rest: [] }),
      ).toBe('/a');
    });

    it('throws for unknown routes and missing params', () => {
      const router = createRouter();
      expect(() => router.buildPath('Nope')).toThrow('Unknown route: Nope');
      // @ts-expect-error id is required
      expect(() => router.buildPath('Post')).toThrow('Missing parameters: id');
      expect(() => router.buildPath('Post', { id: '' })).toThrow(
        'Missing parameters: id',
      );
    });

    it('accepts typed routers where untyped ones are expected', () => {
      const router = createRouter();
      const loose: RouteController<{ name: string }> = router;
      expect(loose.buildPath('Post', { id: 1 })).toBe('/post/1');
    });
  });
});

// type-only checks: type-checked by the jest preset (tsconfig.test.json), never called
export function typeAssertions(router: ReturnType<typeof createRouter>) {
  // @ts-expect-error unknown param
  router.buildPath('Post', { idd: 5 });
  // @ts-expect-error wildcard takes string[]
  router.buildPath('Files', { path: 'a' });
  // @ts-expect-error unknown param on raw path
  router.buildPath('/raw/:slug', { nope: 'x' });
}
