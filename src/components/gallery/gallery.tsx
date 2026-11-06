import "./gallery.scss";
import * as utils from "shell/app/app.utils";
import { useLayoutEffect, useRef, useState } from "react";
import classNames from "classnames";

type GalleryItemData = {
  image: string;
  desktop: { y: string; width: string; widthMobile: string };
};

interface galleryProps {
  items: GalleryItemData[];
}

const Gallery: React.FC<galleryProps> = (props) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [out, setOut] = useState<boolean>(false);
  const mainRef = useRef<HTMLObjectElement>(null!);
  const aFrame = useRef<any>();

  useLayoutEffect(() => {
    const render = () => {
      const main = mainRef.current;
      if (main) {
        const vpY = utils.clamp(utils.vpTop(main), -1, 2);
        setVisible(vpY > 0);
        setOut(vpY >= 1);
        if (vpY >= -0.5 && vpY <= 1.5) {
          main.style.setProperty("--progress", vpY.toFixed(5))
        }
        
      }
      aFrame.current = requestAnimationFrame(render);
    };

    aFrame.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(aFrame.current);
  }, []);

  return (
    <div
      className={classNames("gallery", { "is-visible": visible, "is-out": out })}
      ref={mainRef}
    >
      <div className="gallery__inner">
        <div className="gallery__row grid-row">
          {props.items.map((item, key) => (
            <div
              className="gallery-item grid-cell"
              style={{ width: utils.isMobileVP() ? item.desktop.widthMobile : item.desktop.width }}
              key={key}
            >
              <img src={utils.assetPath(item.image)} alt="" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Gallery;
