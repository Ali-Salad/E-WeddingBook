import confetti from "canvas-confetti";

export function fireGoldConfetti(originElement?: HTMLElement | null) {
  let origin = { x: 0.5, y: 0.6 };

  if (originElement) {
    const rect = originElement.getBoundingClientRect();
    origin = {
      x: (rect.left + rect.width / 2) / window.innerWidth,
      y: (rect.top + rect.height / 2) / window.innerHeight,
    };
  }

  const colors = ["#C5A059", "#E5C787", "#FAF8F5", "#FFDEA5", "#8C6D32", "#5E1924"];

  // First burst
  confetti({
    particleCount: 55,
    spread: 65,
    origin,
    colors,
    ticks: 120,
    gravity: 0.85,
    scalar: 1.15,
    disableForReducedMotion: true,
  });

  // Second celebratory shimmer
  setTimeout(() => {
    confetti({
      particleCount: 40,
      spread: 90,
      origin,
      colors,
      ticks: 100,
      gravity: 0.9,
      scalar: 0.9,
      disableForReducedMotion: true,
    });
  }, 160);

  // Subtle trailing sparkles
  setTimeout(() => {
    confetti({
      particleCount: 25,
      spread: 120,
      origin,
      colors,
      ticks: 80,
      gravity: 0.95,
      scalar: 0.75,
      disableForReducedMotion: true,
    });
  }, 320);
}
