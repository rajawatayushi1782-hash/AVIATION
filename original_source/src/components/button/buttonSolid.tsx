import classNames from "classnames";
import { Link } from "react-router-dom";

import * as utils from "shell/app/app.utils";
import { buttonProps } from "./buttonProps";

import "./buttonSolid.scss";

interface buttonSolidProps extends buttonProps {
  className?: string;
  soft?: boolean;
}

const ButtonSolid: React.FC<buttonSolidProps> = (props) => {
  const classList = classNames("button-solid", props.className, {"is-soft": props.soft})

  if (props.route) {
    const link = utils.getRouteWithKey(props.route);
    return (
      <Link to={link} className={classList}>
        <span>{props.label}</span>
      </Link>
    )
  }

  if (props.onClick) {
    return <button className={classList} onClick={props.onClick}><span>{props.label}</span></button>
  }

  return (
    <a href={props.href || ""} className={classList}>
      <span>{props.label}</span>
    </a>
  );
};

export default ButtonSolid;
