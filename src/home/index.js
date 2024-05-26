import gsap from 'gsap';
import { MotionPathPlugin } from 'gsap/all';
import ScrollTrigger from 'gsap/ScrollTrigger';

import createLenis from '$utils/createLenis';

console.log('Choo Chews!');

function init() {
  gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
  gsap.registerPlugin(MotionPathPlugin);

  // if (Webflow.env('editor') === undefined) {
  //   gsap.to('.page-wrapper', {
  //     autoAlpha: 1,
  //   });
  // }
  createAccordionElements();
  createLenis();
  animateThemeColors();
  animateTrainWheels();
  animateArrowLine();
}

function animateThemeColors() {
  // Select all elements with the data-color attribute
  const elements = document.querySelectorAll('[data-color]');

  // Create an array of colors starting and ending with default blue
  const colors = ['blue'];
  elements.forEach((element) => {
    colors.push(element.getAttribute('data-color'));
  });
  colors.push('blue');

  // Create ScrollTriggers for each element
  elements.forEach((element, index) => {
    ScrollTrigger.create({
      trigger: element,
      start: 'top 80%', // Adjust this based on when you want the trigger to activate
      onEnter: () => {
        // Change the body's data-theme attribute to the element's data-color value
        document.body.setAttribute('data-theme', colors[index + 1]);
        console.log('data-theme: ', colors[index + 1]);
      },
      onLeaveBack: () => {
        // Change the body's data-theme attribute to the previous element's data-color value
        document.body.setAttribute('data-theme', colors[index]);
        console.log('changing data theme back to: ', colors[index]);
      },
      end: 'top 80%', // Change the end position for an earlier trigger on scroll back
    });
  });
}

function animateTrainWheels() {
  // Get the SVG elements
  const wheel1 = document.querySelector('.wheel-1');
  const wheel2 = document.querySelector('.wheel-2');
  const connectingRod = document.querySelectorAll('.rod');

  // Animate the wheels
  gsap.to(
    [wheel1, wheel2],
    {
      rotation: -360,
      transformOrigin: 'center',
      // duration: 3,
      ease: 'none',
      // repeat: -1,
      delay: 1.15,
      scrollTrigger: {
        trigger: wheel1,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 3,
      },
    },
    0
  );

  // Animate the connecting rod on scroll
  gsap.to(
    connectingRod,
    {
      motionPath: {
        path: '.path',
        align: '.path',
        alignOrigin: [0.24, 0.5],
        autoRotate: false,
        start: 0.37,
        end: 1.37,
      },
      // duration: 3,
      ease: 'none',
      // repeat: -1,
      scrollTrigger: {
        trigger: wheel1,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 3,
      },
    },
    0
  );

  // gsap.to(
  //   [wheel1, wheel2],
  //   {
  //     rotation: -360,
  //     transformOrigin: 'center',
  //     duration: 3,
  //     ease: 'none',
  //     repeat: -1,
  //     // delay: 1.15,
  //   },
  //   0
  // );

  // Animate the connecting rod
  // gsap.to(
  //   connectingRod,
  //   {
  //     motionPath: {
  //       path: '.path',
  //       align: '.path',
  //       alignOrigin: [0.24, 0.5],
  //       autoRotate: false,
  //       fromCurrent: false,
  //       start: 0.37,
  //       end: 1.37,
  //     },
  //     duration: 3,
  //     ease: 'none',
  //     repeat: -1,
  //   },
  //   0
  // );
}

function animateArrowLine() {
  const path = document.querySelector('.arrow-line');

  // Get the length of the path
  const pathLength = path.getTotalLength();

  // Set up the initial dash array and dash offset
  path.style.strokeDasharray = pathLength;
  path.style.strokeDashoffset = pathLength;

  // Animate the stroke-dashoffset to reveal the path
  gsap.from(path, {
    strokeDashoffset: 0,
    duration: 4,
    ease: 'power1.inOut',
    scrollTrigger: {
      trigger: path,
      start: 'top bottom',
      end: 'top 80%',
      scrub: 3,
      once: true,
    },
  });
}

function createAccordionElements() {
  // Accordion
  const accordionItems = [...document.querySelectorAll('.accordion_item')];

  // on page load close every item but the first
  accordionItems.forEach((item, index) => {
    const accordionPanel = item.querySelector('.accordion_panel');
    const arrow = item.querySelector('svg');

    gsap.set(accordionPanel, {
      height: 0,
    });
    gsap.to(arrow, {
      rotate: -90,
    });

    item.addEventListener('click', () => {
      console.log('click');
      accordionItems.forEach((el) => {
        const accordionPanel = el.querySelector('.accordion_panel');
        const text = el.querySelector('.accordion_panel .text-rich-text');
        const arrow = el.querySelector('svg');

        const textHeight = text.getBoundingClientRect().height;
        const duration = 0.5;

        // If the clicked item is not the current element, close it.
        if (item !== el) {
          gsap.to(accordionPanel, {
            height: '0px',
            duration: 0.35,
          });
          gsap.to(text, {
            y: 0,
            autoAlpha: 1,
            duration: 0.35,
          });
          gsap.to(arrow, {
            rotate: -90,
            duration: 0.35,
          });
        } else {
          // If the clicked item is the current element and it's open (height is not 0), close it.
          if (accordionPanel.clientHeight !== 0) {
            gsap.to(accordionPanel, {
              height: '0px',
              duration: 0.35,
            });
            gsap.to(text, {
              y: 0,
              autoAlpha: 1,
              duration: 0.35,
            });
            gsap.to(arrow, {
              rotate: -90,
              duration: 0.35,
            });
          } else {
            // If it's closed, open it.
            gsap.to(accordionPanel, {
              height: 'auto',
              duration: duration,
            });
            gsap.from(text, {
              y: 0,
              autoAlpha: 0,
              duration: 0.35,
            });
            gsap.to(arrow, {
              rotate: 0,
              duration: 0.35,
            });
          }
        }
      });
    });
  });
}

window.addEventListener('DOMContentLoaded', () => {
  init();
});
