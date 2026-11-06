import "./quote.scss";
import * as utils from "shell/app/app.utils";
import { useLayoutEffect, useRef, useState } from "react";
import classNames from "classnames";

interface quoteProps {
  author?: string;
  imageLeft: string;
  imageRight?: string;
  quote: string;
}

const Quote: React.FC<quoteProps> = (props) => {
  const [isIn, setIn] = useState<boolean>(false);
  const [isOut, setOut] = useState<boolean>(false);
  const elRef = useRef<HTMLObjectElement>(null!);
  const spacerRef = useRef<HTMLDivElement>(null!);
  const imagesRef = useRef<HTMLDivElement>(null);
  const quoteMovelRef = useRef<HTMLDivElement>(null);
  const aFrame = useRef<any>();

  useLayoutEffect(() => {
    const render = () => {
      const el = elRef.current;
      const spacer = spacerRef.current;
      if (el && spacer) {
        const vpTop = utils.clamp(utils.vpTop(el), 0, 1.5);
        if (vpTop >= 0 && vpTop <= 1.5) {
          el.style.setProperty("--progress", vpTop.toFixed(5));
          el.style.setProperty("--mask", ((vpTop - 0.5) / 0.5).toFixed(5));
        }

        setIn(vpTop >= 0);
        setOut(vpTop >= 1);
      }
      aFrame.current = requestAnimationFrame(render);
    };

    aFrame.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(aFrame.current);
  }, []);

  return (
    <div
      className={classNames("quote", {
        "is-in": isIn,
        "is-out": isOut,
      })}
      ref={elRef}
    >
      <div className="quote__images" ref={imagesRef}>
        <div className="quote__image-container is-quote-first">
          <img
            src={utils.assetPath(props.imageLeft)}
            className="quote__image is-first"
            alt=""
          />
        </div>
        <div className="quote__quote" ref={spacerRef}>
          <div className="quote__quote-movel" ref={quoteMovelRef}>
            <blockquote>{props.quote}</blockquote>
            {props.author && <figcaption>{props.author}</figcaption>}
          </div>
        </div>
        {props.imageRight && (
          <div className="quote__image-container is-quote-second">
            <img
              src={utils.assetPath(props.imageRight)}
              className="quote__image is-last"
              alt=""
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Quote;
