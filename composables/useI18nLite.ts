import { vi } from '~/locales/vi'

type Dict = typeof vi

type UnknownRecord = Record<string, unknown>

function get(obj: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object') return (acc as UnknownRecord)[key]
    return undefined
  }, obj)
}

export function useI18nLite() {
  // For now: Vietnamese only. Keep the shape flexible so we can add en later.
  const dict: Dict = vi

  function t(key: string): string {
    const v = get(dict, key)
    return typeof v === 'string' ? v : key
  }

  return { t }
}
