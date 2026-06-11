import { useState, useEffect } from "react";
import { useApp } from "../store";
import { useIsPremium } from "./useIsPremium";

export const HEART_REFILL_TIME = 5 * 60 * 1000; // 5 phút / 1 tim
export const MAX_HEARTS = 5;

export function useHearts() {
  const { user, updateProfile } = useApp();
  const isPremium = useIsPremium();
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    if (isPremium) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const lastUpdate = user.lastHeartUpdate || now;
      const diff = now - lastUpdate;
      
      if (user.hearts < MAX_HEARTS) {
        const heartsToAdd = Math.floor(diff / HEART_REFILL_TIME);
        if (heartsToAdd > 0) {
          const newHearts = Math.min(MAX_HEARTS, user.hearts + heartsToAdd);
          updateProfile({
            hearts: newHearts,
            lastHeartUpdate: lastUpdate + (heartsToAdd * HEART_REFILL_TIME)
          });
        } else {
          setTimeLeft(Math.floor((HEART_REFILL_TIME - diff) / 1000));
        }
      } else {
        if (diff > HEART_REFILL_TIME) {
          updateProfile({ lastHeartUpdate: now });
        }
        setTimeLeft(0);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [user.hearts, user.lastHeartUpdate, isPremium, updateProfile]);

  return {
    hearts: isPremium ? Infinity : user.hearts,
    isPremium,
    timeLeft,
    isFull: user.hearts >= MAX_HEARTS,
    maxHearts: MAX_HEARTS,
  };
}
