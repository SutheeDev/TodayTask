export const getTodayKey = (dayBoundaryMinutes: number = 0): string => {
  const d = new Date();
  d.setHours(2, 0, 0, 0); // TEMP: simulate 2:00 AM — remove after testing
  d.setMinutes(d.getMinutes() - dayBoundaryMinutes);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const getDaysDifference = (a: string, b: string): number => {
  const msPerDay = 86400000;
  const dateA = new Date(a + "T00:00:00");
  const dateB = new Date(b + "T00:00:00");
  return Math.round((dateB.getTime() - dateA.getTime()) / msPerDay);
};
