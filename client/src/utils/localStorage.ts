import { Task } from "../model";

export const setLocalStorage = (key: string, value: Task[]): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const getLocalStorage = <T>(key: string): T | null => {
  const item = localStorage.getItem(key);
  return item ? (JSON.parse(item) as T) : null;
};
