import { useLayoutEffect, useRef, useState } from "react";
import "./countingNumber.scss";
import classNames from "classnames";

export type CountingNumberData = {
  divider?: number;
  number: number;
  unit?: string;
  label?: string;
  debug?: boolean;
  dot?: boolean;
  white?: boolean;
};

interface countingNumberProps extends CountingNumberData {}

const CountingNumber: React.FC<countingNumberProps> = (props) => {
  // const [count, setCount] = useState(Math.floor(props.number/ 10));
  const [count, setCount] = useState(props.number);
  const aFrame = useRef<any>();
  const tLast = useRef<number>(0);
  const countLast = useRef<number>(props.number/ 10);
  const mainRef = useRef<HTMLObjectElement>(null!);
  const numberEl = useRef<HTMLDivElement>(null!);

  useLayoutEffect(() => {
    const render = () => {
      const main = mainRef.current;
      if (main) {
        const tCur = window.performance.now();
        const tDelta = tCur - tLast.current;
        tLast.current = tCur;
        //
        const mainBox = main.getBoundingClientRect();
        if (
          mainBox.top <= window.innerHeight &&
          mainBox.top >= -window.innerHeight / 2
        ) {
          const step = (props.number - countLast.current) / 6;
          let value = countLast.current;
          value += (step / 80) * tDelta;
          if (value > props.number) {
            value = props.number;
          }
          setCount(Math.ceil(value));
          countLast.current = value;
        } else {
          setCount(0);
          countLast.current = 0;
        }
      }

      aFrame.current = requestAnimationFrame(render);
    };

    // aFrame.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(aFrame.current);
  }, [props.number]);

  const renderCount = () => {
    let countString = count.toFixed(0);
    while (countString.length < props.number.toString().length) {
      countString = "0" + countString;
    }
    if (props.divider) {
      const countAr = countString.split("");
      countAr.splice(1, 0, ".");
      countString = countAr.join("");
    }
    return countString.split("").map((item, key) => (
      <i key={key} className={classNames({ "is-dot": item === "." })}>
        {item}
      </i>
    ));
  };

  return (
    <div
      className={classNames("counting-number", {
        "with-dot": !!props.dot,
        "is-white": !!props.white,
      })}
      ref={mainRef}
    >
      <div className="counting-number__number">
        {!!props.unit && <span>{props.unit}</span>}
        <div className="counting-number__number-el" ref={numberEl}>{renderCount()}</div>
        {!!props.unit && <span>{props.unit}</span>}
      </div>
      {!!props.label && (
        // <FlipBoard value={label} chars={FLIPBOARD_LETTERS} className="counting-number__label" />
        <div className="counting-number__label">{props.label}</div>
      )}
    </div>
  );
};

export default CountingNumber;
