"use client"

import { useAtom } from 'jotai'
import { Volume2, VolumeX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { isSoundEnabledAtom } from '@/features/settings/sound-settings'

export function SoundToggle() {
    const [isSoundEnabled, setIsSoundEnabled] = useAtom(isSoundEnabledAtom)

    return (
        <Button
            size="icon"
            onClick={() => setIsSoundEnabled(!isSoundEnabled)}
            className="fixed top-4 right-4"
            title={isSoundEnabled ? 'Mute sounds' : 'Unmute sounds'}
        >
            {isSoundEnabled ? (
                <>
                    <Volume2 className="h-5 w-5" />
                    <span className="sr-only">Unmute sounds</span>
                </>

            ) : (
                <>
                    <VolumeX className="h-5 w-5" />
                    <span className="sr-only">Mute sounds</span>
                </>
            )}
        </Button>
    )
}