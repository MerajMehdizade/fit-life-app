//  lib/progress.ts
export function calculateProgress(startDate: Date) {
  if (!startDate) {
    return { currentWeek: 1, percent: 0 };
  }

  const now = new Date();
  const start = new Date(startDate);

  const diffMs = now.getTime() - start.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  const currentWeek = Math.max(1, Math.floor(diffDays / 7) + 1);
  const percent = Math.min((currentWeek / 10) * 100, 100);

  return { currentWeek, percent };
}
