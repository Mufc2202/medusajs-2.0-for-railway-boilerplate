export const getBaseURL = () => {
  return (
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.NODE_ENV === "production"
      ? "https://dolgins.com"
      : "http://localhost:3000")
  )
}
