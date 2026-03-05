export function asNotNull(title: string | undefined): string | undefined {
  return !!title && title != 'null' ? title : undefined;
}
