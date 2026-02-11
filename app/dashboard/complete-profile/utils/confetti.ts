export const generateConfetti = (count: number) => {
  const colors = ["#FBBF24", "#60A5FA", "#34D399", "#F87171", "#A78BFA"];
  return Array.from({ length: count }).map(() => ({
    id: Math.random().toString(36).substr(2, 9),
    left: Math.random() * 100,
    rotate: Math.random() * 360,
    color: colors[Math.floor(Math.random() * colors.length)],
    size: Math.random() * 8 + 4,
    duration: Math.random() * 2 + 1.5,
  }));
};
