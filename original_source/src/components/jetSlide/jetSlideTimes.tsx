import FlipBoard from "components/flipBoard/flipBoard";
import Marquee from "components/marquee/marquee";
import { useLayoutEffect, useRef, useState } from "react";
import * as utils from "shell/app/app.utils";
import "./jetSlideTimes.scss";
import { FLIPBOARD_AIRPORTS } from "components/flipBoard/flipBoardChars";
import FlippingNumber from "components/flippingNumber/flippingNumber";

export type JetSlideTimeCombo = {
  airport: string;
  time: string;
};

export type JetSlideTimesData = {
  airports: string[];
  timeCombos: JetSlideTimeCombo[][];
};

interface jetSlideTimeProps extends JetSlideTimesData {}

const JetSlideTimes: React.FC<jetSlideTimeProps> = (props) => {
  const [index, setIndex] = useState<number>(0);
  const [inViewport, setInViewport] = useState<boolean>(false);
  const indexRef = useRef<number>(0);
  const timer = useRef<any>(null);
  const aFrame = useRef<any>(0);
  const mainRef = useRef<HTMLObjectElement>(null);

  useLayoutEffect(() => {
    const render = () => {
      const main = mainRef.current;
      if (main) {
        const vpY = utils.vpY(main);
        setInViewport(vpY >= 0 && vpY <= 1);
      }

      aFrame.current = requestAnimationFrame(render);
    };

    aFrame.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(aFrame.current);
  }, []);

  useLayoutEffect(() => {
    const startTimeout = () => {
      clearTimeout(timer.current);
      timer.current = setTimeout(doApplyTimes, 1000);
    };

    const doApplyTimes = () => {
      let newIndex = indexRef.current + 1;
      indexRef.current = newIndex < props.timeCombos.length ? newIndex : 0;
      setIndex(indexRef.current);
      //
      clearTimeout(timer.current);
      timer.current = setTimeout(doApplyTimes, 6000);
    };
    !inViewport ? clearTimeout(timer.current) : startTimeout();
  }, [inViewport, props.timeCombos.length]);

  const doFillString = (airport: string) => {
    let _airport = airport;
    while (_airport.length < 20) {
      _airport = " " + _airport;
      if (_airport.length < 20) _airport = _airport + " ";
    }
    return _airport;
  };

  return (
    <div className="jet-slide-times" ref={mainRef}>
      <div className="jet-slide-times__inner">
        <div className="jet-slide-times__times-wrapper wrapper">
          {props.timeCombos[index].map(
            (item: JetSlideTimeCombo, key: number) => (
              <div className="jet-slide-times__combo" key={key}>
                <FlipBoard
                  value={doFillString(item.airport)}
                  chars={FLIPBOARD_AIRPORTS}
                  className="jet-slide-times__airport"
                />
                <FlippingNumber
                  value={item.time}
                  className="jet-slide-times__time"
                />
              </div>
            )
          )}
        </div>
        <div className="jet-slide-times__marquee">
          <Marquee elements={props.airports} isActive={inViewport} />
        </div>
      </div>
    </div>
  );
};

export default JetSlideTimes;
