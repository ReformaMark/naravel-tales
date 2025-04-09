import { Button } from "@/components/ui/button";
import { Pause, Play, Square } from "lucide-react";
import { useState, useEffect } from "react";
import { useSpeechSynthesis } from "../hooks/use-speech-synthesis";

interface SpeechControlsProps {
  text: string;
}

export function SpeechControls({ text }: SpeechControlsProps) {
  const { speak, pause, resume, cancel, speaking, paused } =
    useSpeechSynthesis();
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    setIsPlaying(speaking);
  }, [speaking]);

  const handlePlayPause = () => {
    if (speaking) {
      if (paused) {
        resume();
      } else {
        pause();
      }
    } else {
      speak(text);
    }
  };

  const handleStop = () => {
    cancel();
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        size="icon"
        variant="secondary"
        onClick={handlePlayPause}
        className="w-8 h-8 rounded-full"
      >
        {speaking && !paused ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4" />
        )}
      </Button>
      {isPlaying && (
        <Button
          size="icon"
          variant="secondary"
          onClick={handleStop}
          className="w-8 h-8 rounded-full"
        >
          <Square className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
