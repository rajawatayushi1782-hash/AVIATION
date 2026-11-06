import classNames from "classnames";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import "./flippingNumber.scss";

interface flippingNumberProps {
  className?: string;
  value: string;
}

const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

const FlippingNumber: React.FC<flippingNumberProps> = (props) => {
  return (
    <div className={classNames("flipping-number", props.className)}>
      {props.value.split("").map((item, key) => (
       numbers.indexOf(item) > -1 ? <FlippingNumberStrip value={item} key={key} /> : <span key={key}>{item}</span>
      ))}
    </div>
  );
};

interface flippingNumberStrip {
  value: string;
}

const FlippingNumberStrip: React.FC<flippingNumberStrip> = (props) => {
  const [index, setIndex] = useState<number>(0);
  const indexLast = useRef<number>(0);
  const indexDelta = useRef<number>(0);

  useLayoutEffect(() => {
    indexLast.current = index;
  }, [index]);

  useEffect(() => {
    const _index = numbers.indexOf(props.value);
    indexDelta.current = Math.abs(_index - indexLast.current);
    indexLast.current = _index;
    
    setIndex(numbers.indexOf(props.value));
  }, [props.value]);

  return (
    <div className="flipping-number-strip">
      <div
        className="flipping-number-strip__movel"
        style={{
          transform: `translateY(${(-100 / numbers.length) * index}%)`,
          transitionDuration: `${indexDelta.current * 0.5}s`,
        }}
      >
        {numbers.map((item, key) => (
          <div key={key}>{item}</div>
        ))}
      </div>
    </div>
  );
};

export default FlippingNumber;
