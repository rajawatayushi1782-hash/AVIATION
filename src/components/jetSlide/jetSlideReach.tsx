import "./jetSlideReach.scss";
import ContentBlock, {
  ContentBlockData,
} from "components/contentBlock/contentBlock";
import CountingNumber, { CountingNumberData } from "components/countingNumber/countingNumber";
import GraphicAnimated from "static/images/reach-map.svg";
// import GraphicCSS from "static/images/platoon-map-css.svg";
import { useLayoutEffect, useState, useRef } from "react";
import * as utils from "shell/app/app.utils"; 

export type JetReachData = {
  content: ContentBlockData;
  stats: CountingNumberData[];
};

interface jetSlideReachProps extends JetReachData {}

const JetSlideReach: React.FC<jetSlideReachProps> = (props) => {
  const [inVp, setInVp] = useState<boolean>(false);
  const aFrame = useRef<any>(0);
  const mainRef = useRef<HTMLObjectElement>(null);

  useLayoutEffect(() => {
    const render = () => {
      const main = mainRef.current;
      if (!!main) {
        const vpY = utils.vpY(main);
        setInVp(vpY >= 0 && vpY <= 1);
        aFrame.current = requestAnimationFrame(render);
      }
    }

    aFrame.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(aFrame.current);
  }, []);
  
  return (
    <div className="jet-slide-reach" ref={mainRef}>
      <div className="jet-slide-reach__graphics">
        <div className="jet-slide-reach__stats">
          {props.stats.map((item, key) => <CountingNumber {...item} key={key} />)}
        </div>
        {/* {inVp && <object type="image/svg+xml" data={GraphicAnimated}>svg-animation</object>} */}
        {inVp && <object type="image/svg+xml" data={GraphicAnimated}>svg-animation</object>}
      </div>
      <ContentBlock {...props.content} static={true} spaced={true} />
    </div>
  );
};

export default JetSlideReach;
