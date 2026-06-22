export function formatApiError(error: unknown, fallbackMessage = "读取失败"): string {
  if (error instanceof Error) {
    return error.message
  }

  return fallbackMessage
}
