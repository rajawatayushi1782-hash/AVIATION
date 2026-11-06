import { useEffect, useRef } from "react";

import "./imagePlx.scss";
import * as utils from "shell/app/app.utils";
import classNames from "classnames";

interface imagePlxProps {
  src: string;
}

const ImagePlx: React.FC<imagePlxProps> = (props) => {
  const aFrame = useRef<any>();
  const elRef = useRef<any>();
  const imgRef = useRef<any>();
  //
  useEffect(() => {
    const render = () => {
      const el = elRef.current;
      const img = imgRef.current;
      if (el && img) {
        const vpY = utils.vpY(el);
        const hDelta = el.clientHeight - img.clientHeight;
        img.style.transform = `translateY(${hDelta * utils.clamp(vpY)}px)`;
      }
      aFrame.current = requestAnimationFrame(render);
    };
    aFrame.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(aFrame.current);
  }, []);

  return (
    <div
      className={classNames("image-plx")}
      ref={elRef}
    >
      <div className="image-plx__inner">
        <img src={props.src} ref={imgRef} alt="" loading="lazy" decoding="async" />
      </div>
    </div>
  );
};

export default ImagePlx;
