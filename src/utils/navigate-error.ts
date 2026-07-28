import router from '@/router'

export function navigateToError(status: string, title?: string, message?: string) {
  const query: Record<string, string> = { status }
  if (title) query.title = title
  if (message) query.message = message
  router.push({ path: '/error', query })
}
