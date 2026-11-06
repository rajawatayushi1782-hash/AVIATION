import { useEffect, useRef, useState } from "react";
import "./mission.scss";
import * as utils from "shell/app/app.utils";
import classNames from "classnames";
import FlipBoard from "components/flipBoard/flipBoard";

interface missionProps {
  overline: string;
  copy: string[];
  subline: string;
}

const Mission: React.FC<missionProps> = (props) => {
  const [visible, setVisible] = useState<boolean>(false);
  const mainRef = useRef<any>();
  const innerRef = useRef<any>();
  const copyRef = useRef<any>();
  const aFrame = useRef<any>();
  const overlineRef = useRef<any>();
  const sublineRef = useRef<any>();

  useEffect(() => {
    const render = () => {
      const main = mainRef.current;
      const inner = innerRef.current;
      if (main && inner) {
        const vpTop = utils.vpTop(main);
        const overline = overlineRef.current;
        const copy = copyRef.current;
        const subline = sublineRef.current;

        if (vpTop >= 0 && vpTop <= 1) {
          const inner = innerRef.current;
          const deltaY = (window.innerHeight - inner.clientHeight) / 2;
          inner.style.transform = `translate3d(0, ${(deltaY * vpTop).toFixed(5)}px, 0)`;
          // opacity
          const opacityY = 1 - utils.clamp(vpTop * 5 - 3.5);
          const opacityY2 = 1 - utils.clamp(vpTop * 5 - 4);

          !!overline && (overline.style.opacity = opacityY.toString());
          !!copy && (copy.style.opacity = opacityY.toString());
          !!subline && (subline.style.opacity = opacityY2.toString());
        } else {
          !!overline && (overline.style.opacity = "0");
          !!copy && (copy.style.opacity = "0");
          !!subline && (subline.style.opacity = "0");
        }
        //
        setVisible(vpTop > 0);
      }
      aFrame.current = requestAnimationFrame(render);
    };
    aFrame.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(aFrame.current);
  }, []);

  return (
    <div className={classNames("mission")} ref={mainRef}>
      <div className="mission__inner">
        <div className="wrapper mission__wrapper" ref={innerRef}>
          <div className="mission-row grid-row">
            <div className="mission__content grid-cell">
              <h6 className="mission__overline" ref={overlineRef}>
                <FlipBoard value={props.overline} isOut={!visible} />
              </h6>
              <div className="mission__copy" ref={copyRef}>
                {props.copy.map((item, key) => (
                  <p key={key}>{item}</p>
                ))}
              </div>
              <div className="mission__copy mission__subline" ref={sublineRef}>
                <p>{props.subline}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mission;
