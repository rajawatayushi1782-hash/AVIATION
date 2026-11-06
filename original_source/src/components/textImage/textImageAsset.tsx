import "./textImageAsset.scss";

import * as utils from "shell/app/app.utils";
import classNames from "classnames";

export type TextImageAssetData = {
  image: string;
  objectPosition: string;
};

interface textImageAssetProps extends TextImageAssetData {
  reverse?: boolean;
}

const TextImageAsset: React.FC<textImageAssetProps> = (props) => {
  return (
    <div
      className={classNames("text-image-asset", {
        "is-reverse": props.reverse,
      })}
    >
      <div className="text-image-asset__movel">
        <img
          src={utils.assetPath(props.image)}
          className="text-image-asset__img"
          style={{
            objectPosition: props.objectPosition,
            transformOrigin: props.objectPosition,
          }}
          alt=""
          loading="lazy"
          decoding="async"
        />
      </div>
    </div>
  );
};

export default TextImageAsset;
