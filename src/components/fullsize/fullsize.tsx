import classNames from "classnames";
import ContentBlock, {
  ContentBlockData,
} from "components/contentBlock/contentBlock";
import ResponsiveImage, {
  ResponsiveImageSetData,
} from "components/responsiveImage/responsiveImage";
import { useEffect, useRef } from "react";
import * as utils from "shell/app/app.utils";
import "./fullsize.scss";

interface fullsizeProps {
  id: string;
  contentBlock?: ContentBlockData;
  imageSet: ResponsiveImageSetData;
  inverted?: boolean;
  objectPosition?: string;
  reverse?: boolean;
  doZoom?: boolean;
}

const Fullsize: React.FC<fullsizeProps> = (props) => {
  const elRef = useRef<HTMLObjectElement>(null!);
  const imgMovelRef = useRef<HTMLDivElement>(null);
  const aFrame = useRef<any>();

  useEffect(() => {
    const render = () => {
      const el = elRef.current;
      const movel = imgMovelRef.current;
      if (el && movel) {
        const vpY = utils.vpY(el);
        if (vpY > -0.5 && vpY < 1.5) {
          const vPLX = (vpY - 0.5) * 2;
          movel.style.transform = `scale(${1.2 - 0.2 * vPLX})`;
          // movel.style.transform = `translate3d(0,${
          //   -window.innerHeight * 0.2 * vPLX
          // }px,0) scale(${1.2 - 0.2 * vPLX})`;
        }
      }
      aFrame.current = requestAnimationFrame(render);
    };

    aFrame.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(aFrame.current);
  }, []);

  return (
    <div
      className={classNames("fullsize", `fullsize--${props.id}`, {
        "is-reverse": props.reverse,
      })}
      ref={elRef}
    >
      <div className="fullsize-movel" ref={imgMovelRef}>
        <ResponsiveImage
          className="fullsize-image"
          imageSet={props.imageSet}
          style={{ objectPosition: props.objectPosition || "initial" }}
        />
      </div>
      {props.contentBlock && (
        <ContentBlock
          {...props.contentBlock}
          inverted={!!props.inverted}
          static={true}
        />
      )}
    </div>
  );
};

export default Fullsize;
