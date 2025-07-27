export function lazyImport<T>(moduleName: string): Promise<T> {
  return new Function('m', 'return import(m)')(moduleName) as Promise<T>;
}
