import classNames from "classnames";
import { useLayoutEffect, useRef } from "react";
import * as utils from "shell/app/app.utils";

import "./scroll.scss";
const lerp = (a: number, b: number, n: number) => (1 - n) * a + n * b;

interface scrollProps {
  className?: string;
  pathname?: string;
}

const Scroll: React.FC<scrollProps> = (props) => {
  const disabled = useRef<boolean>(false);
  //
  const mainRef = useRef<HTMLDivElement>(null);
  const scrollableRef = useRef<HTMLDivElement>(null);
  //
  const current = useRef<number>(0);
  const scrollToRender = useRef<number>(0);
  // const speedTarget = useRef<number>(0);
  const ease = 0.1;
  const aFrame = useRef<any>();
  //
  const wheel = useRef<number>(0);
  const wheelOnEnter = useRef<number>(0);
  const touchEnter = useRef<number>(0);

  useLayoutEffect(() => {
    if (!window.core.scrollCustom) {
      disabled.current = true;
    }
    //
    !!disabled.current && document.body.classList.add("custom-scroll-disabled");
  }, []);

  useLayoutEffect(() => {
    if (!!window.core) {
      scrollToRender.current = 0;
      current.current = 0;
      wheel.current = 0;
      window.scrollTo({top: 0});
      window.core.scrollTop = 0;
    }
  }, [props.pathname]);

  useLayoutEffect(() => {
    const setPosition = () => {
      const scrollTo = scrollToRender.current;
      if (
        Math.round(scrollTo) !== Math.round(current.current) ||
        scrollTo < 10
      ) {
        const scroll = scrollableRef.current;
        scroll && (scroll.style.transform = `translate3d(0,-${scrollTo}px,0)`);
        document.documentElement.style.setProperty("--scroll", `${scrollTo}px`);
      }
    };

    const getScroll = () => {
      return wheel.current;
      // return window.pageYOffset || document.documentElement.scrollTop;
    };

    const render = () => {
      // const speed = Math.min(Math.abs(current.current - scrollToRender.current), 200) / 200;
      // speedTarget.current += (speed - speedTarget.current) * 0.2;
      //
      if (!disabled.current) {
        current.current = getScroll();

        let renderCurrent = lerp(scrollToRender.current, current.current, ease);
        renderCurrent = Number(renderCurrent.toFixed(2));
        //renderCurrent = Math.floor(renderCurrent * 100000) / 100000;
        renderCurrent < 0 && (renderCurrent = 0);
        scrollToRender.current = renderCurrent;

        setPosition();
        window.core.scrollTop = scrollToRender.current;
      } else {
        // Native scrolling: keep the shared scroll state and the --scroll
        // custom property in sync with the real scroll position. The
        // desktop "pinned section" styles (position: fixed +
        // translate3d(0, var(--scroll), 0)) depend on --scroll, so touch
        // devices wide enough for the desktop layout (e.g. iPad in
        // landscape) break without this.
        window.core.scrollTop = window.scrollY;
        document.documentElement.style.setProperty(
          "--scroll",
          `${window.scrollY}px`
        );
      }
      aFrame.current = requestAnimationFrame(render);
    };

    aFrame.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(aFrame.current);
  }, []);

  useLayoutEffect(() => {
    const handleWheel = (e: any) => {
      const scrollable = scrollableRef.current;
      if (!!scrollable) {
        const _wheel = wheel.current + e.deltaY;
        const _wheelMax = scrollable.clientHeight - window.innerHeight;
        wheel.current = utils.clamp(_wheel, 0, _wheelMax);
      }
    };

    const handleTouchStart = (e: any) => {
      touchEnter.current = e.touches[0].clientY;
      wheelOnEnter.current = wheel.current;
    };

    const handleTouchMove = (e: any) => {
      var te = e.changedTouches[0].clientY;
      const tDelta = te - touchEnter.current;
      const scrollable = scrollableRef.current;
      if (!!scrollable) {
        const _wheel = wheelOnEnter.current - tDelta * 1.5;
        const _wheelMax = scrollable.clientHeight - window.innerHeight;
        wheel.current = utils.clamp(_wheel, 0, _wheelMax);
      }
    };

    document.addEventListener("wheel", handleWheel, { passive: true });
    // Touch fallback: if a touch device was not detected and ended up with
    // the custom scroll (overflow: hidden), swiping must still scroll.
    if (!disabled.current) {
      document.addEventListener("touchstart", handleTouchStart, {
        passive: true,
      });
      document.addEventListener("touchmove", handleTouchMove, {
        passive: true,
      });
    }
    return () => {
      document.removeEventListener("wheel", handleWheel);
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  return (
    <div
      className={classNames("scroll", props.className, {
        disabled: !!disabled.current,
      })}
      ref={mainRef}
      // style={{ height: `${contentHeight}px` }}
    >
      <div className="scroll__scrollable" id="scrollable" ref={scrollableRef}>
        {props.children}
      </div>
    </div>
  );
};

export default Scroll;
