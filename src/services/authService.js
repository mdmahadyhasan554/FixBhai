/** Simulates an API call. Swap with real axios calls when backend is ready. */
export const loginUser = async ({ email, password }) => {
  await new Promise(r => setTimeout(r, 800))
  if (!email || !password) throw new Error('Invalid credentials')
  return {
    user:  { name: email.split('@')[0], email, role: 'customer' },
    token: 'demo_token_' + Date.now(),
  }
}

export const registerUser = async ({ name, email, phone, password }) => {
  await new Promise(r => setTimeout(r, 800))
  if (!name || !email || !password) throw new Error('All fields are required')
  return {
    user:  { name, email, phone, role: 'customer' },
    token: 'demo_token_' + Date.now(),
  }
}
