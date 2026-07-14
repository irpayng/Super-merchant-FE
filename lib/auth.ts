export function setAuthToken(token: string) {
  localStorage.setItem('token', token)
  document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`
}

export function clearAuthToken() {
  localStorage.removeItem('token')
  document.cookie = 'token=; path=/; max-age=0; SameSite=Lax'
}

export function getAuthToken() {
  return localStorage.getItem('token')
}
