import classNames from "classnames";
//
import "./textImage.scss";
import ImagePlx from "components/imagePlx/imagePlx";
import * as utils from "shell/app/app.utils";
import { useLayoutEffect, useRef, useState } from "react";
import ContentBlock, {
  ContentBlockData,
} from "components/contentBlock/contentBlock";
import TextImageAsset, { TextImageAssetData } from "./textImageAsset";
import TextImageDouble, { TextImageDoubleData } from "./textImageDouble";

export interface textImageProps {
  id: string;
  imageAsset?: TextImageAssetData;
  imageMobile: string[];
  content: ContentBlockData[];
  imageDouble: TextImageDoubleData;
  objectPosition?: string;
  reverse?: boolean;
  transIn?: string;
  transOut?: string;
  fixedTop?: boolean;
  fixedBottom?: boolean;
  fixedOut?: boolean;
}

const TextImage: React.FC<textImageProps> = (props) => {
  const [isIn, setIn] = useState<boolean>(false);
  const [isHalf, setHalf] = useState<boolean>(false);
  const [isOut, setOut] = useState<boolean>(false);
  const [isMobile, setMobile] = useState<boolean>(utils.isMobileVP());
  const elRef = useRef<HTMLObjectElement>(null!);
  const aFrame = useRef<any>();

  useLayoutEffect(() => {
    const render = () => {
      const el = elRef.current;
      if (el) {
        const vpTop = utils.vpTop(el);
        
        // these are mostly used for the desktop images
        setIn(vpTop >= 0);
        setHalf(vpTop >= 0.5);
        setOut(vpTop > 1);
      }

      aFrame.current = requestAnimationFrame(render);
    };

    aFrame.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(aFrame.current);
  }, []);

  useLayoutEffect(() => {
    const handleResize = () => setMobile(utils.isMobileVP());

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className={classNames("text-image", `text-image--${props.id || "noid"}`, {
        "is-in": isIn,
        "is-out": isOut,
        "is-half": isHalf,
        "is-fixed-out": !!props.fixedOut,
      })}
      ref={elRef}
      id={props.id}
    >
      <div className="text-image__inner">
        {/* CONTENT */}
        {!isMobile && !!props.imageAsset && (
          <TextImageAsset reverse={props.reverse} {...props.imageAsset} />
        )}
        {!isMobile && !!props.imageDouble && (
          <TextImageDouble
            {...props.imageDouble}
            isIn={isIn}
            isOut={isOut}
            isHalf={isHalf}
          />
        )}
        {props.content.map((item, key) => (
          <div key={key}>
            {isMobile && !!props.imageMobile[key] && (
              <ImagePlx
                src={utils.assetPath(props.imageMobile[key])}
                key={`plx${key}`}
              />
            )}
            <ContentBlock
              {...item}
              spaced={true}
              fixed={true}
              key={"cb"+key}
              reverse={!!props.reverse || key === 1}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TextImage;
