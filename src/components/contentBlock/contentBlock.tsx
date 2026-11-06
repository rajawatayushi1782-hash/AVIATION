import parse from "html-react-parser";

import "./contentBlock.scss";
import * as utils from "shell/app/app.utils";
import { buttonProps } from "components/button/buttonProps";
import classNames from "classnames";
import { useLayoutEffect, useRef, useState } from "react";
import ButtonSolid from "components/button/buttonSolid";
import FlipBoard from "components/flipBoard/flipBoard";
import {
  FLIPBOARD_FULL,
} from "components/flipBoard/flipBoardChars";

export type ContentBlockData = {
  button?: buttonProps;
  copy: string[];
  headline: string;
  overline?: string;
};

interface contentBlockProps extends ContentBlockData {
  darkOverline?: boolean;
  spaced?: boolean;
  inverted?: boolean;
  fixed?: boolean;
  reverse?: boolean;
  static?: boolean;
}

const ContentBlock: React.FC<contentBlockProps> = (props) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [out, setOut] = useState<boolean>(false);
  const isMobile = utils.isMobileVP();
  //
  const mainRef = useRef<HTMLObjectElement>(null);
  const topPlxRef = useRef<HTMLDivElement>(null);
  const aFrame = useRef<any>();
  //
  useLayoutEffect(() => {
    const render = () => {
      const main = mainRef.current;
      if (main) {
        const vpTop = isMobile
          ? 1 - utils.vpY(main)
          : utils.vpTop(main);

        setVisible(vpTop >= 0);
        setOut(vpTop > 1);

        if (vpTop >= -1 && vpTop <= 2 && !isMobile && !props.static) {
          const vpYclamp = utils.clamp(vpTop, -1, 2);
          const topPlx = topPlxRef.current;
          if (topPlx) {
            const offset = window.innerHeight - main.clientHeight;
            topPlx.style.transform = `translate3d(0,${((-window.innerHeight*0.15) * vpYclamp - offset*0.15).toFixed(5)}px,0)`;
          }
        }
      }
      aFrame.current = requestAnimationFrame(render);
    };

    aFrame.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(aFrame.current);
  }, [props.fixed, props.static, isMobile]);
  //
  return (
    <div
      className={classNames("content-block", {
        "is-visible": visible,
        "is-out": out,
        "is-fixed": props.fixed,
        "is-inverted": props.inverted,
        "is-spaced": props.spaced,
        "is-dark-overline": props.darkOverline,
        "is-reverse": props.reverse,
        "is-static": props.static,
      })}
      ref={mainRef}
    >
      <div className="content-block__container">
        <div className="content-block__inner">
          {/* TOP */}
          <div className="content-block-top">
            <div className="content-block-top__container">
              <div className="content-block-top__plx" ref={topPlxRef}>
                {!!props.overline && (
                  <h6>
                    <FlipBoard
                      value={props.overline}
                      isOut={!visible}
                      chars={FLIPBOARD_FULL}
                      className="h6"
                    />
                  </h6>
                )}
                {/* {!!props.overline && <h6>{props.overline}</h6>} */}
                <h2 className="content-block-top__headline">
                  {parse(props.headline)}
                </h2>
              </div>
            </div>
          </div>
          {/* Bottom */}
          <div className="content-block-bottom">
            <div className="content-block-bottom__movel">
              {props.copy.map((item, key) => (
                <p key={key}>{item}</p>
              ))}
              {!!props.button && (
                <ButtonSolid
                  {...props.button}
                  className="content-block__button"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentBlock;
