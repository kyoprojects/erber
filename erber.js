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
  // let targetElement = document.querySelector(".framer-1jbc6qn");
  let targetElement = document.querySelector(
    '[data-framer-name="header-wrap"]'
  );
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
      // duration: 1,
      ease: "power2.inOut",
    });
  });

  /// image gallery slides
  gsap
    .timeline({
      scrollTrigger: {
        trigger: ".framer-nw2mzd",
        start: "top bottom",
        end: "bottom top",
        scrub: 3,
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
      trigger: ".framer--carousel",
      start: "center bottom",
      end: "bottom center",
      // scrub: true
    },
    opacity: 0,
    y: "100px",
    stagger: 0.15,
    duration: 0.4,
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
      trigger: processContainersWrapper,
      start: "center bottom",
      end: "bottom center",
      // scrub: true,
    },
    opacity: 0,
    y: 50,
    stagger: 0.15,
    duration: 0.4,
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
  let menuToggle = document.querySelectorAll(
    '[data-framer-name="menu-toggle"]'
  );
  let menuPseudo = document.querySelectorAll(
    '[data-framer-name="menu-pseudo"]'
  );
  let menuContainer = document.querySelector(
    '[data-framer-name="menu-container"]'
  );

  let menuOpenState = false;

  gsap.set(menuPseudo, { autoAlpha: 0 });
  gsap.set(menuContainer, { autoAlpha: 0 });

  // Ensure the element can resize properly
  menuCircle.style.position = "absolute";
  menuCircle.style.boxSizing = "border-box";

  /// menu toggle event listener
  menuToggle.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      console.log("menu clicked");

      const tl = gsap.timeline();

      if (menuOpenState) {
        console.log("close menu");
        // tl.to(menuContainer, { duration: 0, autoAlpha: 0 }, "-=0.6")
        tl.to(menuCircle, {
          duration: 0.6,
          width: "0",
          height: "0",
          autoAlpha: 0,
          ease: "power2.inOut",
        }).to(menuPseudo, { duration: 0, autoAlpha: 0 }, "-=0.6");
        menuOpenState = false;
      } else {
        console.log("open menu");
        tl.to(menuPseudo, { duration: 0, autoAlpha: 1 }).to(menuCircle, {
          duration: 0.6,
          width: "300vw",
          height: "300vw",
          autoAlpha: 1,
          ease: "power2.inOut",
        });
        // .to(menuContainer, { duration: 0, autoAlpha: 1 }, "-=0.6");
        menuOpenState = true;
      }
    });
  });
}
