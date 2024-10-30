import useSound from 'use-sound'
import { useAtomValue } from 'jotai'
import { isSoundEnabledAtom } from '@/features/settings/sound-settings'


export function useGameSounds() {
    const isSoundEnabled = useAtomValue(isSoundEnabledAtom)

    const [playHover] = useSound('/sounds/hover.mp3', {
        volume: 0.5,
        soundEnabled: isSoundEnabled,
    })
    const [playSelect] = useSound('/sounds/select.mp3', {
        volume: 0.5,
        soundEnabled: isSoundEnabled,
    })
    const [playSuccess] = useSound('/sounds/success.mp3', {
        volume: 0.5,
        soundEnabled: isSoundEnabled,
    })
    const [playError] = useSound('/sounds/error.mp3', {
        volume: 0.5,
        soundEnabled: isSoundEnabled,
    })
    const [playLevelUp] = useSound('/sounds/level-up.mp3', {
        volume: 0.5,
        soundEnabled: isSoundEnabled,
    })
    const [playComplete] = useSound('/sounds/complete.mp3', {
        volume: 0.5,
        soundEnabled: isSoundEnabled,
    })

    return {
        playHover,
        playSelect,
        playSuccess,
        playError,
        playLevelUp,
        playComplete,
    }
}