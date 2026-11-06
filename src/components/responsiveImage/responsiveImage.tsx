import "./responsiveImage.scss";
import * as utils from "shell/app/app.utils";
import classNames from "classnames";

export type ResponsiveImageSetData = {
  mobile: string;
  desktop: string;
};

interface responsiveImageProps {
  className?: string;
  imageSet: ResponsiveImageSetData;
  style?: React.CSSProperties;
}

const ResponsiveImage: React.FC<responsiveImageProps> = (props) => {
  return (
    <picture className={classNames("responsive-image", props.className)} style={props.style}>
      <source
        media="(max-width: 979px)"
        srcSet={utils.assetPath(props.imageSet.mobile)}
      />
      <source
        media="(min-width: 980px)"
        srcSet={utils.assetPath(props.imageSet.desktop)}
      />
      <img
        src={utils.assetPath(props.imageSet.mobile)}
        alt=""
        loading="lazy"
        decoding="async"
      />
    </picture>
  );
};

export default ResponsiveImage;
