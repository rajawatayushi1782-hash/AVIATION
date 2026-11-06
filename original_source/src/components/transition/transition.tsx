import classNames from "classnames";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import "./transition.scss";

interface transitionProps {
  duration: number;
  isOpen: boolean;
}

const Transition: React.FC<transitionProps> = (props) => {
  const [noTrans, setNoTrans] = useState<boolean>(false);
  const history = useHistory();

  // const layers = new Array(1);

  useEffect(() => {
    setNoTrans(!!history.location.state);
  }, [history.location.state]);

  return (
    <div className={classNames("transition", { "is-open": props.isOpen, "no-trans": noTrans })}>
      <div
        className="transition__layer"
        style={{
          transitionDuration: `${props.duration}ms`,
        }}
      />
      {/* {Array.from(layers.keys()).map((item, key) => {
        const index = (1 / layers.length) * (key + 1);
        return (
          <div
            className="transition__layer"
            key={key}
            style={{
              transitionDuration: `${props.duration / layers.length}ms`,
              transitionDelay: `${props.duration / layers.length * key}ms`,
              opacity: `${index}`,
            }}
          />
        );
      })} */}
    </div>
  );
};

export default Transition;
