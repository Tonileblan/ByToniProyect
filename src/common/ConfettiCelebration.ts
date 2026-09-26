import confetti from 'canvas-confetti';

export const triggerCelebration = () => {
  try {
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#6366F1', '#8B5CF6', '#38BDF8', '#10B981', '#F59E0B']
    });
  } catch (e) {
    console.log('Confetti trigger skipped', e);
  }
};
