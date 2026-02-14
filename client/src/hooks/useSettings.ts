import { useState, useEffect, useCallback } from "react";
import { getLocalStorage, setLocalStorage } from "../utils/localStorage";

export interface AppSettings {
  maxActive: number;
  maxFocused: number;
  maxCarriedOver: number;
}

const DEFAULT_SETTINGS: AppSettings = {
  maxActive: 7,
  maxFocused: 3,
  maxCarriedOver: 3,
};

const STORAGE_KEY = "appSettings";

const RANGES: Record<keyof AppSettings, [number, number]> = {
  maxActive: [1, 10],
  maxFocused: [1, 3],
  maxCarriedOver: [1, 5],
};

export const useSettings = () => {
  const [settings, setSettings] = useState<AppSettings>(() => {
    const stored = getLocalStorage<AppSettings>(STORAGE_KEY);
    return stored ? { ...DEFAULT_SETTINGS, ...stored } : DEFAULT_SETTINGS;
  });

  useEffect(() => {
    setLocalStorage(STORAGE_KEY, settings);
  }, [settings]);

  const updateSetting = useCallback(
    (key: keyof AppSettings, value: number) => {
      const [min, max] = RANGES[key];
      const clamped = Math.min(max, Math.max(min, value));
      setSettings((prev) => {
        const next = { ...prev, [key]: clamped };
        if (key === "maxActive" && clamped < prev.maxCarriedOver) {
          next.maxCarriedOver = clamped;
        }
        if (key === "maxCarriedOver") {
          const effectiveMax = Math.min(RANGES.maxCarriedOver[1], prev.maxActive);
          next.maxCarriedOver = Math.min(effectiveMax, Math.max(1, value));
        }
        return next;
      });
    },
    []
  );

  return { settings, updateSetting };
};
