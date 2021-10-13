import anime from 'animejs';

export function goTranslateX(elements: Array<HTMLElement>): void {
  anime({
    targets: [...elements],
    scale: [0, 1],
    duration: 1000,
    delay: anime.stagger(100),
  });
}
