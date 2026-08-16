/** Signed-in home after a direct login (header, landing, or `/login`). */
export const PROPERTIES_PATH = '/deals';

export function resolvePostLoginPath(from: unknown): string {
  if (
    typeof from === 'string' &&
    from.startsWith('/') &&
    !from.startsWith('//') &&
    from !== '/login'
  ) {
    return from;
  }

  return PROPERTIES_PATH;
}
