export const BASE_PATH = "/0noxtackore_site";

export function withBasePath(path: string): string {
  if (!path.startsWith("/")) return path;
  if (path.startsWith(`${BASE_PATH}/`) || path === BASE_PATH) return path;
  return `${BASE_PATH}${path}`;
}
