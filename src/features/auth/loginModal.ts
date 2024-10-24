import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export const isLoginModalOpenAtom = atomWithStorage('isLoginModalOpen', false)

export const loginModalURLSyncAtom = atom(
  (get) => get(isLoginModalOpenAtom),
  (_get, set, newValue: boolean) => {
    set(isLoginModalOpenAtom, newValue)
    const url = new URL(window.location.href)
    if (newValue) {
      url.searchParams.set('isLoggingIn', 'true')
    } else {
      url.searchParams.delete('isLoggingIn')
    }
    window.history.replaceState({}, '', url)
  }
)