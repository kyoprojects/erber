function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

function loadCSS(href) {
  return new Promise((resolve, reject) => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    // link.onload = resolve;
    // link.onerror = reject;
    document.head.appendChild(link);
  });
}

loadCSS("https://kyoprojects.github.io/erber/erber.css");

Promise.all([
  loadScript("https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js"),
  loadScript("https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"),
  loadScript(
    "https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js"
  ),
  loadScript("https://unpkg.com/lenis@1.1.5/dist/lenis.min.js"),
  loadScript("https://unpkg.com/split-type"),
])
  .then(() => {
    console.log("All scripts loaded");
    initAnimations();
  })
  .catch((error) => {
    console.error("Error loading scripts:", error);
  });

//

function initAnimations() {
  // lenis
  const lenis = new Lenis();
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // gsap
  gsap.registerPlugin(ScrollTrigger);

  // header
  let targetElement = document.querySelector(".framer-1jbc6qn");
  gsap.to(targetElement, { duration: 0.3, y: -80, autoAlpha: 0 });
  let lastScrollTop = 0;
  let threshold = 100;
  let hysteresis = 100;

  window.addEventListener(
    "scroll",
    () => {
      let currentScroll =
        window.pageYOffset || document.documentElement.scrollTop;

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

  // text reveal
  let fullText;
  function runSplit() {
    let textElement = document.querySelector(".framer-jg88uz p");
    fullText = new SplitType(textElement, { types: "lines" });
    console.log(fullText);

    $(".line").append('<div class="line-mask"></div>');
  }
  runSplit();
  window.addEventListener("resize", () => {
    fullText.revert();
    runSplit();
  });

  // scroll animations
  $(".line").each(function () {
    let triggerElement = $(this);
    let targetElement = triggerElement.find(".line-mask");
    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: triggerElement,
        start: "top bottom",
        end: "bottom 20%",
        scrub: true,
        delay: 10,
      },
    });
    tl.to(targetElement, {
      width: "0%",
      // duration: 1, // Adjust the duration for smoothness
      ease: "power2.inOut", // Use easing for smoother animation
    });
  });

  /// image gallery slides
  gsap
    .timeline({
      scrollTrigger: {
        trigger: ".framer-nw2mzd",
        start: "top bottom", // Adjust this value as needed
        end: "bottom top", // Adjust this value as needed
        scrub: 3, // Synchronize the animation with the scrollbar
        toggleActions: "play none none none",
      },
    })
    .fromTo(".framer-1ew3k9w", { y: "0" }, { y: "-150px" })
    .fromTo(".framer-eh6noh", { y: "0" }, { y: "-150px" }, "<")
    .fromTo(".framer-ahrhkz", { y: "0" }, { y: "150px" }, "<");

  // carrousel
  const carouselItems = document.querySelectorAll(".framer--carousel li");
  gsap.from(carouselItems, {
    scrollTrigger: {
      trigger: ".framer--carousel", // The element that triggers the animation
      start: "center bottom", // Adjust based on when you want the animation to start
      end: "bottom center",
      // scrub: true, // Allows the animation to scrub based on scroll position
    },
    opacity: 0,
    y: "100px", // Move items from 50px below their original position
    stagger: 0.15, // Stagger each item by 0.2 seconds
    duration: 0.4, // Animation duration
  });

  // process containers
  const processContainers = document.querySelectorAll(
    "[data-framer-name='process-container']"
  );
  const processContainersWrapper = document.querySelectorAll(
    "[data-framer-name='process-container-wrapper']"
  );
  gsap.from(processContainers, {
    scrollTrigger: {
      trigger: processContainersWrapper, // The element that triggers the animation
      start: "center bottom", // Adjust based on when you want the animation to start
      end: "bottom center",
      // scrub: true, // Allows the animation to scrub based on scroll position
    },
    opacity: 0,
    y: 50, // Move items from 50px below their original position
    stagger: 0.15, // Stagger each item by 0.2 seconds
    duration: 0.4, // Animation duration
  });
}
