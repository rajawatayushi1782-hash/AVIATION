import "./jetSlideStrip.scss";
import * as utils from "shell/app/app.utils";
import ContentBlock, {
  ContentBlockData,
} from "components/contentBlock/contentBlock";
import { useLayoutEffect, useRef, useState } from "react";
import {ReactComponent as StripNumber} from "static/images/strip-number.svg";
import classNames from "classnames";
import GraphicAnimated from "static/images/strip-landing.svg";

export type JetStripData = {
  content: ContentBlockData;
};

interface jetSlideReachProps extends JetStripData {}

const JetSlideStrip: React.FC<jetSlideReachProps> = (props) => {
  const [visible, setVisible] = useState<boolean>(false);
  const aFrame = useRef<any>(0);
  const mainRef = useRef<HTMLObjectElement>(null);

  useLayoutEffect(() => {
    const render = () => {
      const main = mainRef.current;
      if (main) {
        const vpTop = utils.vpTop(main);
        const plx = utils.clamp(vpTop, -1, 2);
        main.style.setProperty('--plx', plx.toFixed(5) + "%");

        setVisible(vpTop >= 0);


        // const maskTop = utils.clamp(100 - 100 * vpTop, 0, 100);
        // // const maskBtm = utils.clamp(100 * vpTop + 1, 0, 100);
        // main.style.setProperty('--mask-top', maskTop.toFixed(5) + "%");
       //  main.style.setProperty('--mask-btm', maskBtm.toFixed(8) + "%");
      }
      aFrame.current = requestAnimationFrame(render);
    }
    
    aFrame.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(aFrame.current);
  }, [])

  return (
    <div className={classNames("jet-slide-strip", {"is-visible": visible})} ref={mainRef}>
      <div className="jet-slide-strip__graphic">
        <div className="jet-slide-strip__number">
          <StripNumber />
          <span className="jet-slide-strip__number-label">meters</span>
        </div>
        {visible && <object type="image/svg+xml" data={GraphicAnimated}>svg-animation</object>}
      </div>
      <ContentBlock {...props.content} static={true} spaced={true} />
    </div>
  );
};

export default JetSlideStrip;
