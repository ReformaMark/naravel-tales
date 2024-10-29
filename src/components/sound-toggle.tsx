'use client'

import { Button } from '@/components/ui/button';
import { Volume2, VolumeX } from 'lucide-react';
import useLocalStorage from "use-local-storage";

export function SoundToggle() {
    const [isMuted, setIsMuted] = useLocalStorage('sound-muted', false)

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMuted(!isMuted)}
            className="fixed top-4 right-4"
        >
            {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
        </Button>
    )
}