import * as utils from "shell/app/app.utils";

import "./textImageDouble.scss";

export type TextImageDoubleData = {
  main: string[];
  second: string;
};

interface textImageDoubleProps extends TextImageDoubleData {
  isIn: boolean;
  isOut: boolean;
  isHalf: boolean;
}

const TextImageDouble: React.FC<textImageDoubleProps> = (props) => {
  return (
    <div className="text-image-double">
      <div className="text-image-double__movel">
        <div className="text-image-double__second">
          <img src={utils.assetPath(props.second)} alt="" />
        </div>
        <div className="text-image-double__main">
          {props.main.map((item, key) => (
            <img src={utils.assetPath(item)} key={key} alt="" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TextImageDouble;
