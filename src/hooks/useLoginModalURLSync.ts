import { useEffect } from 'react'
import { useSetAtom } from 'jotai'
import { useSearchParams } from 'next/navigation'
import { loginModalURLSyncAtom } from '@/features/auth/loginModal'

export function useLoginModalURLSync() {
  const setIsLoginModalOpen = useSetAtom(loginModalURLSyncAtom)
  const searchParams = useSearchParams()

  useEffect(() => {
    const isLoggingIn = searchParams.get('isLoggingIn') === 'true'
    setIsLoginModalOpen(isLoggingIn)
  }, [searchParams, setIsLoginModalOpen])
}