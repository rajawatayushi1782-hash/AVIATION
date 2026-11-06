import classNames from "classnames";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import "./flipBoard.scss";
import { FLIPBOARD_LETTERS } from "./flipBoardChars";

interface flipBoardProps {
  className?: string;
  chars?: string[];
  value: string;
  isOut?: boolean;
}

const FlipBoard: React.FC<flipBoardProps> = (props) => {
  return (
    <div className={classNames(props.className)}>
      {props.value.split("").map((item, key) => (
        <FlipBoardItem value={!props.isOut ? item : ' '} key={key} chars={props.chars || FLIPBOARD_LETTERS} index={key} />
      ))}
    </div>
  );
};

// ITEM
interface flipBoardItemProps {
  chars: string[];
  value: string;
  index: number;
}

const FlipBoardItem: React.FC<flipBoardItemProps> = (props) => {
  const [index, setIndex] = useState<number>(0);
  const [indexNew, setIndexNew] = useState<number>(0);

  const aFrame = useRef<any>();
  const timeRef = useRef<number>(0);
  const totalRef = useRef<number>(0);
  const indexRef = useRef<number>(0);

  const doIncreaseIndex = useCallback(() => {
    let _index = indexRef.current + 1;
    if (_index >= props.chars.length) {
      _index = 0;
    }
    setIndex(_index);
    indexRef.current = _index;
  }, [props.chars.length]);

  useLayoutEffect(() => {
    let _next = props.chars.indexOf(props.value.toUpperCase());
    setIndexNew(_next);
  }, [props.value, props.chars]);

  useLayoutEffect(() => {
    const render = () => {
      const time = window.performance.now();
      let timeDelta = time - timeRef.current;
      totalRef.current += timeDelta;

      if (totalRef.current < props.index * 80) {
        timeRef.current = time;
        timeDelta = 0;
      }

      if (timeDelta > 40) {
        timeRef.current = time;
        //
        indexRef.current !== indexNew && doIncreaseIndex();
        if (indexRef.current !== indexNew) {
          aFrame.current = requestAnimationFrame(render);
        }
      } else {
        aFrame.current = requestAnimationFrame(render);
      }
    };

    cancelAnimationFrame(aFrame.current);
    timeRef.current = window.performance.now();
    totalRef.current = 0;
    aFrame.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(aFrame.current);
  }, [indexNew, doIncreaseIndex, props.index]);

  return <i className={classNames("flip-board-item")}>{props.chars[index]}</i>;
};

export default FlipBoard;
