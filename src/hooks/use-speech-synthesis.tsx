import { useAtom } from "jotai";
import { useCallback, useEffect, useRef, useState } from "react";
import { isSoundEnabledAtom } from "@/features/settings/sound-settings";

export const useSpeechSynthesis = () => {
  const synth = useRef(window.speechSynthesis);
  const [isSoundEnabled] = useAtom(isSoundEnabledAtom);
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const cancel = useCallback(() => {
    synth.current.cancel();
    setSpeaking(false);
    setPaused(false);
    utteranceRef.current = null;
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (!isSoundEnabled) return;

      cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utteranceRef.current = utterance;

      const voices = synth.current.getVoices();
      const ziraVoice = voices.find(
        (voice) => voice.name === "Microsoft Zira - English (United States)"
      );

      if (ziraVoice) {
        utterance.voice = ziraVoice;
      }

      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 1;

      utterance.onstart = () => {
        setSpeaking(true);
        setPaused(false);
      };

      utterance.onend = () => {
        setSpeaking(false);
        setPaused(false);
        utteranceRef.current = null;
      };

      utterance.onpause = () => {
        setPaused(true);
      };

      utterance.onresume = () => {
        setPaused(false);
      };

      synth.current.speak(utterance);
    },
    [isSoundEnabled, cancel]
  );

  const pause = useCallback(() => {
    synth.current.pause();
    setPaused(true);
  }, []);

  const resume = useCallback(() => {
    if (isSoundEnabled && utteranceRef.current) {
      synth.current.resume();
      setPaused(false);
    }
  }, [isSoundEnabled]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancel();
    };
  }, [cancel]);

  // Handle sound enabled/disabled
  useEffect(() => {
    if (!isSoundEnabled && speaking) {
      cancel();
    }
  }, [isSoundEnabled, speaking, cancel]);

  return {
    speak,
    pause,
    resume,
    cancel,
    speaking,
    paused,
  };
};
