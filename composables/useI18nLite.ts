import { vi } from '~/locales/vi'

type Dict = typeof vi

function get(obj: any, path: string): unknown {
  return path.split('.').reduce((acc, key) => (acc && typeof acc === 'object' ? acc[key] : undefined), obj)
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
