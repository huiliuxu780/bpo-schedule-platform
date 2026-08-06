export type ApiResult<T> = {
  data: T | null
  error: string | null
  /** 详情类接口返回 404 时为 true，页面应走 notFound() 而非错误态 */
  notFound?: boolean
}

export function formatApiErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message
  }

  return "读取失败"
}
