import "./facts.scss";
import * as utils from "shell/app/app.utils";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import classNames from "classnames";
import FlipBoard from "components/flipBoard/flipBoard";
import { FLIPBOARD_FULL } from "components/flipBoard/flipBoardChars";
import Hammer from "hammerjs";

interface factsProps {
  items: [
    {
      title: string[];
      copy: string;
      illu: string;
      key?: string;
    }
  ];
  bottom: boolean;
}

const Facts: React.FC<factsProps> = (props) => {
  const [iSlide, setISlide] = useState<number>(1);
  const [visible, setVisible] = useState<boolean>(false);
  const aFrame = useRef<any>();
  const rowEl = useRef<HTMLObjectElement>(null!);
  const mainEl = useRef<HTMLObjectElement>(null!);
  const innerEl = useRef<HTMLObjectElement>(null!);
  const itemAr = useRef<Array<HTMLDivElement | null>>([]);
  //
  const hammertime = useRef<any>();

  useLayoutEffect(() => {
    const render = () => {
      const main = mainEl.current;
      const row = rowEl.current;
      if (main) {
        const vpTop = utils.vpTop(main);
        const _visible = vpTop >= 0 && vpTop <= 2;
        setVisible(_visible);
        if (_visible) {
          const deltaY = (main.clientHeight - row.clientHeight) / 2;
          row.style.transform = `translate3d(0, ${(deltaY * vpTop).toFixed(
            5
          )}px, 0)`;
        }
      }
      aFrame.current = requestAnimationFrame(render);
    };
    aFrame.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(aFrame.current);
  }, []);

  useEffect(() => {
    const main = mainEl.current;
    if (main && !hammertime.current) {
      // touchAction "pan-y" keeps native vertical scrolling working when a
      // swipe starts on the slider (Android/iPad); only horizontal swipes
      // are claimed by Hammer.
      hammertime.current = new Hammer(main, { touchAction: "pan-y" });
      hammertime.current
        .get("swipe")
        .set({ direction: Hammer.DIRECTION_HORIZONTAL });
      hammertime.current.on("swipeleft swiperight", (e: any) => {
        let iSlideNew =
          e.direction === Hammer.DIRECTION_LEFT
            ? iSlide + 1
            : e.direction === Hammer.DIRECTION_RIGHT
            ? iSlide - 1
            : iSlide;
        setISlide(utils.clamp(iSlideNew, 0, 2));
      });
    }
    return () => {
      if (hammertime.current) {
        hammertime.current.destroy();
        hammertime.current = null;
      }
    };
  }, [iSlide]);

  return (
    <div
      className={classNames("facts", {
        "is-visible": visible,
        "is-bottom": props.bottom,
      })}
      ref={mainEl}
    >
      <div className="facts__inner wrapper" ref={innerEl}>
        <h6 className="facts__headline">
          <FlipBoard
            value="Fact Sheet"
            chars={FLIPBOARD_FULL}
            isOut={!visible}
          />
        </h6>
        <div
          className="facts__slide"
          style={{
            transform: `translateX(calc(-50% - (50vw * ${iSlide - 1}) ))`,
          }}
        >
          <div className="facts__row grid-row" ref={rowEl}>
            {props.items.map((item, key) => (
              <div
                className={classNames("facts-item grid-cell", {
                  "is-active": key === iSlide,
                })}
                key={key}
                style={{ transitionDelay: `${0.6 + key * 0.2}s` }}
                ref={(ref) => (itemAr.current[key] = ref)}
              >
                <div className="facts-item__illu">
                  <img
                    src={utils.assetPath("https://content.flyplatoon.com/website/illustrations/" + item.illu)}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="facts-item__content">
                  <h4 className="facts-item__headline">
                    {item.title.map((item, key) => (
                      <span key={key}>{item}</span>
                    ))}
                  </h4>
                  <p className="facts-item__copy">{item.copy}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="facts-dotnav">
          {props.items.map((item, key) => (
            <div
              className={classNames("facts-dotnav__dot", {
                "is-active": key === iSlide,
              })}
              key={key}
            />
          ))}
        </div>
      </div>
      {/* <div className="facts__bg" />
      {props.bottom && <Fog />} */}
      {/* <Fog /> */}
    </div>
  );
};

export default Facts;
