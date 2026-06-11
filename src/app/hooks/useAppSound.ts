import { useApp } from '../store';
import { useSound } from './useSound';

export type SoundKey = "click" | "success" | "error" | "modal" | "levelUp";

export function useAppSound(soundKey: SoundKey, options = {}) {
  const { isSoundEnabled } = useApp();
  const { playPop, playSuccess } = useSound();

  const play = () => {
    if (!isSoundEnabled) return;
    if (soundKey === "click" || soundKey === "modal") {
      playPop();
    } else {
      playSuccess();
    }
  };

  return play;
}
