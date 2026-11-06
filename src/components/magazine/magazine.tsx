import ResponsiveImage, {
  ResponsiveImageSetData,
} from "components/responsiveImage/responsiveImage";
import { useLayoutEffect, useRef, useState } from "react";
import "./magazine.scss";
import * as utils from "shell/app/app.utils";
import classNames from "classnames";
import { buttonProps } from "components/button/buttonProps";
import FlipBoard from "components/flipBoard/flipBoard";
import ButtonSolid from "components/button/buttonSolid";
import parse from "html-react-parser";

type MagazineData = {
  overline: string;
  headline: string;
  copy: string[];
  button: buttonProps;
  imageSet: ResponsiveImageSetData;
  stickyOut?:boolean;
};

interface magazineProps extends MagazineData {}

const Magazine: React.FC<magazineProps> = (props) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [out, setOut] = useState<boolean>(false);
  const mainRef = useRef<HTMLObjectElement>(null);
  const isMobile = utils.isMobileVP();
  const aFrame = useRef<any>(0);

  useLayoutEffect(() => {
    const render = () => {
      const main = mainRef.current;
      if (main) {
        const vpTop = utils.vpTop(main);
        
        setVisible(isMobile ? vpTop >= 0 : vpTop >= 0.5);
        setOut(!props.stickyOut ? vpTop > 0.8 : vpTop >= 1);

        if (vpTop >= -0.5 && vpTop <= 2) {
          main.style.setProperty('--mask-top', utils.clamp(vpTop/0.5).toFixed(5));
          if (!props.stickyOut) {
            main.style.setProperty('--mask-btm', utils.clamp((vpTop - 0.8) / 0.2).toFixed(5));
          }
        } else {
          main.style.setProperty('--mask-top', "0");
        }     
      }
      aFrame.current = requestAnimationFrame(render);
    }

    aFrame.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(aFrame.current);
  }, [props.stickyOut, isMobile])

  return (
    <div className={classNames("magazine", {"is-visible": visible, "is-out": out, "is-sticky-out": props.stickyOut})} ref={mainRef}>
      <div className="magazine__fixie">
        <div className="magazine__inner">
          <div className="magazine__headline">
            {!!props.overline && <h6><FlipBoard value={props.overline} isOut={!visible} /></h6> }
            {/* {!!props.overline && <h6>{props.overline}</h6>} */}
            <h2>{props.headline}</h2>
          </div>
          <div className="magazine__image">
            <ResponsiveImage {...props} />
          </div>
          <div className="magazine__copy wrapper">
            {props.copy.map((item, key) => (
              <p key={key}>{parse(item)}</p>
            ))}
            {props.button && <ButtonSolid {...props.button} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Magazine;
