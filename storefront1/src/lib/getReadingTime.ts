export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200 // Average reading speed
  const words = content?.split(/\s+/).length // Count words
  return Math.ceil(words / wordsPerMinute) // Calculate reading time in minutes
}
