import chalkAnimation from 'chalk-animation';

export const animateText = (text) => {
  const animation = chalkAnimation.rainbow(text);
  return () => animation.stop(); // Returns a function to stop the animation
};
