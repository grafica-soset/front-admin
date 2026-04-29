import { sessionStore as useSessionStore } from '~/stores/sessionStore'

export function usePaginatedFetch(endpoint: string, extraQuery: () => Record<string, unknown>) {
  const route = useRoute()
  const router = useRouter()
  const session = useSessionStore()

  const { data, status } = useFetch(endpoint, {
    server: false,
    query: computed(() => ({
      token: session.token,
      page: Number(route.query.page ?? 0),
      size: 20,
      ...extraQuery()
    })),
    onResponseError({ response }) {
      if (response.status === 401) {
        router.push({ path: '/login', query: { redirectTo: route.fullPath } })
      }
    }
  })

  const pageData = computed(() => data.value?.data ?? null)
  const items = computed(() => pageData.value?.items ?? [])
  const totalPages = computed(() => pageData.value?.totalPages ?? 0)
  const currentPage = computed(() => pageData.value?.currentPage ?? 0)
  const totalItems = computed(() => pageData.value?.totalItems ?? 0)
  const pageSize = computed(() => pageData.value?.pageSize ?? 20)

  const firstItem = computed(() => totalItems.value === 0 ? 0 : currentPage.value * pageSize.value + 1)
  const lastItem = computed(() => Math.min((currentPage.value + 1) * pageSize.value, totalItems.value))

  const paginationItems = computed(() => {
    const total = totalPages.value
    if (total === 0) return []

    let pages: number[]
    if (total <= 7) {
      pages = Array.from({ length: total }, (_, i) => i)
    } else {
      const current = currentPage.value
      const set = new Set<number>([0, total - 1])
      for (let p = Math.max(0, current - 1); p <= Math.min(total - 1, current + 1); p++) {
        set.add(p)
      }
      pages = [...set].sort((a, b) => a - b)
    }

    const result: { type: string; page?: number; key: string }[] = []
    for (let i = 0; i < pages.length; i++) {
      if (i > 0 && pages[i] - pages[i - 1] > 1) {
        result.push({ type: 'ellipsis', key: `ellipsis-${i}` })
      }
      result.push({ type: 'page', page: pages[i], key: `page-${pages[i]}` })
    }
    return result
  })

  function irParaPagina(page: number) {
    router.replace({
      query: { ...route.query, page: page > 0 ? page : undefined }
    })
  }

  return { status, items, totalPages, currentPage, totalItems, firstItem, lastItem, paginationItems, irParaPagina }
}
