if (typeof currentUrl === 'undefined') {
  let currentUrl = window.location.href;
  const baseUrls = ['aquamarine-autonomy-753641.framer.app/', 'erber.framer.ai/'];

  if (baseUrls.some(baseUrl => currentUrl.includes(baseUrl))) {
    function loadScript(src) {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }

    function loadCSS(href) {
      return new Promise((resolve, reject) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
      });
    }

    Promise.all([
      loadScript('https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js'),
      loadScript('https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js'),
      loadScript('https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js'),
      loadScript('https://unpkg.com/lenis@1.1.5/dist/lenis.min.js'),
      loadScript('https://unpkg.com/split-type'),
      loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js')
    ])
      .then(() => {
        console.log('All scripts loaded');
        initAnimations();
      })
      .catch(error => {
        console.error('Error loading scripts:', error);
      });
  }

  function initAnimations() {
    let mm = gsap.matchMedia();

    // lenis
    mm.add('(min-width: 391px)', () => {
      const lenis = new Lenis();
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    });
    // gsap
    gsap.registerPlugin(ScrollTrigger);

    // header
    let targetElement = document.querySelector('[data-framer-name="header-wrap"]');
    gsap.to(targetElement, { duration: 0.3, y: -80, autoAlpha: 0 });
    let lastScrollTop = 0;
    let threshold = 100;
    let hysteresis = 100;

    window.addEventListener(
      'scroll',
      () => {
        let currentScroll = window.pageYOffset || document.documentElement.scrollTop;

        if (currentScroll > lastScrollTop) {
          // Downscroll
          if (currentScroll > threshold + hysteresis) {
            // Adding hysteresis
            gsap.to(targetElement, { duration: 0.3, y: -80, autoAlpha: 0 });
          }
        } else {
          // Upscroll
          if (currentScroll > threshold + hysteresis) {
            gsap.to(targetElement, { duration: 0.3, y: 0, autoAlpha: 1 });
          } else if (currentScroll <= threshold - hysteresis) {
            // Using hysteresis
            gsap.to(targetElement, { duration: 0.3, y: 0, autoAlpha: 0 });
          }
        }
        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
      },
      false
    );

    // split text
    let textElement = document.querySelectorAll('.framer-jg88uz p');

    textElement.forEach(element => {
      let fullText;
      function runSplit() {
        // Split the text into words within the current element
        fullText = new SplitType(element, { types: 'words' });
        console.log(fullText);

        // Append word masks to words within the current element
        element.querySelectorAll('.word').forEach(word => {
          let mask = document.createElement('div');
          mask.classList.add('word-mask');
          word.appendChild(mask);
        });
      }
      runSplit();
      mm.add('(min-width: 391px)', () => {
        // window.addEventListener('resize', () => {
        //   fullText.revert();
        //   runSplit();
        //   console.log('resize');
        });
      });
      let masks = element.querySelectorAll('.word-mask');
      console.log(masks);
      let tl = gsap.timeline({
        scrollTrigger: {
          trigger: element,
          start: 'top bottom',
          end: 'bottom top',
          // markers: true
          scrub: true
        }
      });
      tl.fromTo(masks, { opacity: 0.6 }, { opacity: 0, duration: 0.5, ease: 'power2.inOut', stagger: 0.05 });
    });

    /// image gallery slides
    mm.add('(min-width: 391px)', () => {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: '.framer-nw2mzd',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 3,
            toggleActions: 'play none none none'
          }
        })
        .fromTo('.framer-1ew3k9w', { y: '0' }, { y: '-150px' })
        .fromTo('.framer-eh6noh', { y: '0' }, { y: '-150px' }, '<')
        .fromTo('.framer-ahrhkz', { y: '0' }, { y: '150px' }, '<');
    });
    mm.add('(max-width: 390px)', () => {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: '.framer-nw2mzd',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 3,
            toggleActions: 'play none none none'
          }
        })
        .fromTo('.framer-1ew3k9w', { y: '0' }, { y: '-40px' })
        // .fromTo('.framer-eh6noh', { y: '0' }, { y: '-80px' }, '<')
        .fromTo('.framer-ahrhkz', { y: '0' }, { y: '40px' }, '<');
    });

    // carrousel
    const secondSectionWrap = document.querySelector('[data-framer-name="second-section-wrap"]');
    const carouselItems = document.querySelectorAll('.framer--carousel li');
    const newCarouselItems = document.querySelectorAll('[data-framer-name="section2-stagger"]');
    console.log('carouselItems', newCarouselItems);

    gsap.from(newCarouselItems, {
      scrollTrigger: {
        trigger: secondSectionWrap,
        start: 'center bottom',
        end: 'bottom center'
      },
      opacity: 0,
      y: '20px',
      stagger: 0.15,
      duration: 0.4
    });

    // process containers
    const processContainers = document.querySelectorAll("[data-framer-name='process-container']");
    const processContainersWrapper = document.querySelectorAll("[data-framer-name='process-container-wrapper']");
    gsap.from(processContainers, {
      scrollTrigger: { trigger: processContainersWrapper, start: 'top center', end: 'bottom center' },
      opacity: 0,
      y: 50,
      stagger: 0.15,
      duration: 0.4
    });

    // setTimeout(() => {
    //   const iframe = document.getElementById("iFrameResizer0");

    //   const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

    //   const style = document.createElement("style");
    //   style.type = "text/css";
    //   style.innerHTML = ".wally-main-item { display: none !important; }";

    //   iframeDoc.head.appendChild(style);
    //   console.log("iframeDoc", iframeDoc);
    // }, 3000);\

    // full-screen menu animation
    let menuCircle = document.querySelector('[data-framer-name="menu-circle"]');
    let menuToggle = document.querySelectorAll('[data-framer-name="menu-toggle"]');
    let menuPseudo = document.querySelectorAll('[data-framer-name="menu-pseudo"]');
    let menuContainer = document.querySelector('[data-framer-name="menu-container"]');
    let menuColumns = document.querySelectorAll('[data-framer-name="menu-column"]');

    let menuOpenState = false;

    gsap.set(menuPseudo, { autoAlpha: 0 });
    gsap.set(menuContainer, { autoAlpha: 0 });
    gsap.set(menuContainer, { backgroundColor: 'rgba(0, 0, 0, 0.0)' });

    // Ensure the element can resize properly
    menuCircle.style.position = 'absolute';
    menuCircle.style.boxSizing = 'border-box';
    menuColumns.forEach(column => gsap.set(column, { autoAlpha: 0 }));

    /// menu toggle event listener
    menuToggle.forEach(toggle => {
      toggle.addEventListener('click', () => {
        console.log('menu clicked');

        const tl = gsap.timeline();

        if (menuOpenState) {
          console.log('close menu');
          tl.to(menuContainer, { duration: 0.2, autoAlpha: 0 });
          tl.to(
            menuCircle,
            {
              duration: 0.6,
              width: '0',
              height: '0',
              autoAlpha: 0,
              ease: 'power2.inOut'
            },
            '-=0.2'
          ).to(menuPseudo, { duration: 0, autoAlpha: 0 });
          menuOpenState = false;
        } else {
          console.log('open menu');

          // desktop
          mm.add('(min-width: 391px)', () => {
            tl.to(menuPseudo, { duration: 0, autoAlpha: 1 })
              .to(menuContainer, { duration: 0.0, autoAlpha: 1 })
              .to(menuCircle, {
                duration: 0.6,
                width: '250vw',
                height: '250vw',
                autoAlpha: 1,
                ease: 'power2.inOut'
              })
              .fromTo(
                menuColumns,
                { y: '-60px', autoAlpha: 0 },
                {
                  duration: 0.5,
                  y: '0',
                  autoAlpha: 1,
                  stagger: 0.05,
                  ease: 'power4.inOut'
                },
                '-=0.5'
              );
          });

          // // mobile
          // mm.add('(max-width: 390px)', () => {
          //   tl.to(menuPseudo, { duration: 0, autoAlpha: 1 })
          //     .to(menuContainer, { duration: 0.0, autoAlpha: 1 })
          //     .to(menuCircle, {
          //       duration: 0.6,
          //       width: '250vh',
          //       height: '250vh',
          //       autoAlpha: 1,
          //       ease: 'power2.inOut'
          //     })
          //     .fromTo(
          //       menuColumns,
          //       { y: '-60px', autoAlpha: 0 },
          //       {
          //         duration: 0.5,
          //         y: '0',
          //         autoAlpha: 1,
          //         stagger: 0.05,
          //         ease: 'power4.inOut'
          //       },
          //       '-=0.5'
          //     );
          // });

          menuOpenState = true;
        }
      });
    });

    //
  }
}
