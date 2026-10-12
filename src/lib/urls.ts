const base = `${import.meta.env.BASE_URL.replace(/\/$/, '')}/`;

/** Prefix local URLs while leaving fragments and external destinations intact. */
export function withBase(path: string): string {
  if (!path.startsWith('/') || path.startsWith('//')) return path;
  return `${base}${path.slice(1)}`;
}

/** Match navigation against routes both with and without the deployment prefix. */
export function routePath(path: string): string {
  const route = path.startsWith(base) ? `/${path.slice(base.length)}` : path;
  return route.replace(/\/$/, '') || '/';
}
