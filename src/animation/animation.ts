import anime from 'animejs';

export function goTranslateX(elements: Array<HTMLElement>): void {
  anime({
    targets: [...elements],
    scale: [0, 1],
    duration: 1000,
    delay: anime.stagger(100),
  });
}
export function birdMove(
  elements: Array<HTMLElement>,
  mouseEvent: Array<number>
): anime {
  return anime({
    targets: [...elements],
    duration: 700,
    translateX: function() {
      return mouseEvent[0];
    },
    translateY: function(el, i) {
      if (i == elements.length - 1) {
        return 5;
      }
      return 7 - i + mouseEvent[1];
    },
    autoplay: false,

    loop: true,
    direction: 'alternate',
    easing: 'easeInOutSine',
    delay: anime.stagger(30),
  });
}
