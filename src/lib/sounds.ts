import useSound from 'use-sound'

export function useGameSounds() {
    const [playHover] = useSound('/sounds/hover.mp3', { volume: 0.5 })
    const [playSelect] = useSound('/sounds/select.mp3', { volume: 0.7 })
    const [playSuccess] = useSound('/sounds/success.mp3', { volume: 0.8 })
    const [playError] = useSound('/sounds/error.mp3', { volume: 0.6 })
    const [playLevelUp] = useSound('/sounds/level-up.mp3', { volume: 0.8 })
    const [playComplete] = useSound('/sounds/complete.mp3', { volume: 1.0 })

    return {
        playHover,
        playSelect,
        playSuccess,
        playError,
        playLevelUp,
        playComplete,
    }
}