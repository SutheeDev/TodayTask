import { useState, useEffect, useCallback } from "react";
import { getTodayKey, getDaysDifference } from "../utils/dateUtils";
import { getLocalStorage, setLocalStorage } from "../utils/localStorage";

interface UseDayCheckReturn {
  showTransition: boolean;
  dayGap: number;
  lastSeenDayKey: string | null;
  dismissTransition: () => void;
}

const STORAGE_KEY = "lastSeenDayKey";

export const useDayCheck = (): UseDayCheckReturn => {
  const [showTransition, setShowTransition] = useState(false);
  const [dayGap, setDayGap] = useState(0);
  const [lastSeenDayKey, setLastSeenDayKey] = useState<string | null>(null);

  const checkDay = useCallback(() => {
    const today = getTodayKey();
    const stored = getLocalStorage<string>(STORAGE_KEY);

    if (!stored) {
      setLocalStorage(STORAGE_KEY, today);
      return;
    }

    if (stored === today) {
      return;
    }

    const diff = getDaysDifference(stored, today);

    if (diff >= 1) {
      setShowTransition(true);
      setDayGap(diff);
    }

    setLastSeenDayKey(stored);
  }, []);

  const dismissTransition = useCallback(() => {
    const today = getTodayKey();
    setLocalStorage(STORAGE_KEY, today);
    setShowTransition(false);
  }, []);

  useEffect(() => {
    checkDay();

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        checkDay();
      }
    };

    const handleFocus = () => {
      checkDay();
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("focus", handleFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("focus", handleFocus);
    };
  }, [checkDay]);

  return { showTransition, dayGap, lastSeenDayKey, dismissTransition };
};
