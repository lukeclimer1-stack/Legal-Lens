'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { DEFAULT_ADMIN_PASSWORD } from '@/lib/auth'

const SESSION_KEY = 'll-site-authed'

interface SiteAuthValue {
  authed: boolean
  password: string
  login: (input: string) => boolean
}

const SiteAuthContext = createContext<SiteAuthValue>({
  authed: false,
  password: '',
  login: () => false,
})

export function SiteAuthProvider({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')

  useEffect(() => {
    try {
      if (sessionStorage.getItem(SESSION_KEY) === '1') {
        setAuthed(true)
        setPassword(DEFAULT_ADMIN_PASSWORD)
      }
    } catch {}
  }, [])

  function login(input: string): boolean {
    if (input === DEFAULT_ADMIN_PASSWORD) {
      setAuthed(true)
      setPassword(input)
      try { sessionStorage.setItem(SESSION_KEY, '1') } catch {}
      return true
    }
    return false
  }

  return (
    <SiteAuthContext.Provider value={{ authed, password, login }}>
      {children}
    </SiteAuthContext.Provider>
  )
}

export function useSiteAuth() {
  return useContext(SiteAuthContext)
}
