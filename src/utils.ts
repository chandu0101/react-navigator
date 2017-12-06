export function removeTrailingForwardSlashes(value: string): string {
  return value.replace(/\/+$/, '')
}
