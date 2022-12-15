import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LocomotiveScroll from "locomotive-scroll";
import each from "lodash/each";
import { copyText } from "./utils/index";
// import Home from "./pages/home";

const toContactButtons = document.querySelectorAll(".contact-scroll");
const footer = document.getElementById("js-footer");
const scrollEl = document.querySelector("[data-scroll-container]");
const emailButton = document.querySelector("button.email");
const toCopyText = document.querySelector(".to-copy span");
// const body = document.body;

gsap.registerPlugin(ScrollTrigger);

const scroll = new LocomotiveScroll({
  el: scrollEl,
  smooth: true,
  lerp: 0.06,
  tablet: {
    breakpoint: 768,
  },
});

setTimeout(() => {
  scroll.update();
}, 1000);

scroll.on("scroll", ScrollTrigger.update);

ScrollTrigger.scrollerProxy(scroll.el, {
  scrollTop(value) {
    return arguments.length
      ? scroll.scrollTo(value, 0, 0)
      : scroll.scroll.instance.scroll.y;
  },

  getBoundingClientRect() {
    return {
      top: 0,
      left: 0,
      width: window.innerWidth,
      height: window.innerHeight,
    };
  },
});

export default class Home {
  constructor(scroll) {
    this.locomotive = scroll;
    this.heroTextAnimation();
    this.homeIntro();
    this.homeAnimations();
    this.homeActions();
  }

  homeActions() {
    each(toContactButtons, (button) => {
      button.onclick = () => {
        this.locomotive.scrollTo(footer);
      };
    });

    emailButton.addEventListener("click", (e) => {
      copyText(e);
      toCopyText.textContent = "copied";

      setTimeout(() => {
        toCopyText.textContent = "Click To Copy";
      }, 2000);
    });
  }

  homeIntro() {
    const tl = gsap.timeline();

    gsap.to(scrollEl, {
      autoAlpha: 1,
    });

    tl.from(".home__nav", {
      duration: 0.5,
      delay: 0.3,
      opacity: 0,
      yPercent: -100,
      ease: "power4.out",
    })
      .from(".hero__title [title-overflow]", {
        duration: 0.7,
        yPercent: 100,
        stagger: {
          amount: 0.2,
        },
        ease: "power4.out",
      })
      .from(
        ".hero__title .bottom__right",
        {
          duration: 1,
          yPercent: 100,
          opacity: 0,
          ease: "power4.out",
        },
        "<20%"
      )
      .set(".hero__title .overflow", { overflow: "unset" })
      .from(
        ".hero__title .mobile",
        {
          duration: 0.7,
          yPercent: 100,
          stagger: {
            amount: 0.2,
          },
          ease: "power4.out",
        },
        "-=1.4"
      );
  }

  homeAnimations() {
    gsap.to(".home__projects__line", { autoAlpha: 1 });
    gsap.utils.toArray(".home__projects__line").forEach((el) => {
      const line = el.querySelector("span");
      gsap.from(line, {
        duration: 1.5,
        scrollTrigger: {
          trigger: el,
          scroller: "[data-scroll-container]",
        },
        scaleX: 0,
      });
    });

    gsap.utils.toArray("[data-fade-in]").forEach((el) => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          scroller: "[data-scroll-container]",
        },
        duration: 1.5,
        yPercent: 100,
        opacity: 0,
        ease: "power4.out",
      });
    });

    if (window.innerWidth <= 768) {
      gsap.utils.toArray(".home__projects__project").forEach((el) => {
        const text = el.querySelector(".title__main");
        const link = el.querySelector(".project__link");
        gsap.from([text, link], {
          scrollTrigger: {
            trigger: el,
            scroller: "[data-scroll-container]",
          },
          duration: 1.5,
          yPercent: 100,
          stagger: {
            amount: 0.2,
          },
          ease: "power4.out",
        });
      });

      const awardsTl = gsap.timeline({
        defaults: {
          ease: "power1.out",
        },
        scrollTrigger: {
          trigger: ".home__awards",
          scroller: "[data-scroll-container]",
        },
      });
      awardsTl.from(".awards-title span", {
        duration: 1,
        opacity: 0,
        yPercent: 100,
        stagger: {
          amount: 0.2,
        },
      });
    }
  }

  heroTextAnimation() {
    gsap.to(".hero__title__dash.desktop", {
      scrollTrigger: {
        trigger: ".hero__title",
        scroller: "[data-scroll-container]",
        scrub: true,
        start: "-8% 9%",
        end: "110% 20%",
      },
      scaleX: 4,
      ease: "none",
    });
  }
}

new Home(scroll);

function CurosrEffect() {
  this.cursor = document.querySelector("#curosr");
  this.cursorOval = this.cursor.querySelector(".oval");

  this.cursorQuickSetter = gsap.quickSetter(this.cursor, "css");
  this.cursorOvalQuickSetter = gsap.quickSetter(this.cursorOval, "css");

  this.renderStyle = {
    current: { x: 1, y: 1 },
    last: { x: 1, y: 1 },
    ease: 0.1,
  };

  this.__map = (x, a, b, c, d) => {
    return (((x - a) * (d - c)) / (b - a) + c).toFixed(3);
  };
  this.__lerp = (a, b, n) => {
    return ((1 - n) * a + n * b).toFixed(3);
  };

  this.render = () => {
    this.renderStyle.current.x = this.__lerp(
      this.renderStyle.current.x,
      this.renderStyle.last.x,
      this.renderStyle.ease
    );
    this.renderStyle.current.y = this.__lerp(
      this.renderStyle.current.y,
      this.renderStyle.last.y,
      this.renderStyle.ease
    );

    let disMoveX =
      Math.abs(this.renderStyle.last.x) - Math.abs(this.renderStyle.current.x);
    let disMoveY =
      Math.abs(this.renderStyle.last.y) - Math.abs(this.renderStyle.current.y);

    let disMove = Math.abs(Math.max(Math.abs(disMoveX), Math.abs(disMoveY)));

    let scaleX = this.__map(disMove, 0, 160, 1, 1.2);
    let scaleY = this.__map(disMove, 0, 160, 1, 0.85);

    this.cursorQuickSetter({
      x: this.renderStyle.current.x,
      y: this.renderStyle.current.y,
    });

    let rotation = (Math.atan(disMoveY / disMoveX) * 180) / Math.PI;
    if (rotation) {
      this.cursorOvalQuickSetter({
        rotation: rotation,
        scaleY: scaleY,
        scaleX: scaleX,
      });
    }

    requestAnimationFrame(this.render);
  };

  this.init = () => {
    this.render();
    let _this = this;
    console.log("ok");
    window.addEventListener("mousemove", function (event) {
      _this.renderStyle.last.x = event.clientX - 20;
      _this.renderStyle.last.y = event.clientY - 20;
    });
  };
  this.init();
}

new CurosrEffect();

// portfolio
$(".gallery ul li a").click(function () {
  var itemID = $(this).attr("href");
  $(".gallery ul").addClass("item_open");
  $(itemID).addClass("item_open");
  return false;
});
$(".close").click(function () {
  $(".port, .gallery ul").removeClass("item_open");
  return false;
});

$(".gallery ul li a").click(function () {
  $("html, body").animate(
    {
      scrollTop: parseInt($("#top").offset().top),
    },
    400
  );
});
