import "./jetSlideLugguage.scss";
import * as utils from "shell/app/app.utils";
import { useLayoutEffect, useRef, useState } from "react";
import CountingNumber, {
  CountingNumberData,
} from "components/countingNumber/countingNumber";
import classNames from "classnames";
import GraphicAnimated from "static/images/suitcases.svg";

export type JetLugguageData = {
  items: CountingNumberData[];
};

interface jetSlideLugguageProps extends JetLugguageData {}

const JetSlideLugguage: React.FC<jetSlideLugguageProps> = (props) => {
  const aFrame = useRef<any>(0);
  const mainRef = useRef<HTMLObjectElement>(null);
  const itemsRef = useRef<HTMLObjectElement>(null);
  const bagsRef = useRef<HTMLDivElement>(null);
  const [absolute, setAbsolute] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);

  useLayoutEffect(() => {
    const render = () => {
      const main = mainRef.current;
      if (main) {
        const vpTop = utils.vpTop(main);
        // const vpPLX = utils.clamp(vpTop, -1, 1);
        // if (vpPLX > -1 && vpPLX < 1) {
        //   main.style.setProperty("--plx", vpPLX.toFixed(5));
        //   const bags = bagsRef.current;
        //   // if (bags) {
        //   //   const opacity = utils.clamp((vpTop - 0.6) / 0.6 + 0.2);
        //   //   bags.style.opacity = opacity.toFixed(5);
        //   // }
        // }
        setVisible(vpTop >= 0);
        setAbsolute(vpTop >= 1);
      }
      aFrame.current = requestAnimationFrame(render);
    };
    aFrame.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(aFrame.current);
  }, []);

  return (
    <div className={classNames("jet-slide-lugguage", {"is-absolute": absolute})} ref={mainRef}>
      <div className="jets-slide-lugguage__bags" ref={bagsRef}>
        {visible && <object type="image/svg+xml" data={GraphicAnimated}>svg-animation</object>}
        {/* <img src={utils.assetPath("/graphics/jets-lugguage.svg")} alt="" /> */}
      </div>
      <div className="jet-slide-lugguage__items" ref={itemsRef}>
        {props.items.map((item, key) => (
          <div className="jet-slide-lugguage-item" key={key}>
            {/* <FlippingNumber value={renderNumber ? item.number.toString() : '0'} /> */}
            <CountingNumber {...item} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default JetSlideLugguage;
