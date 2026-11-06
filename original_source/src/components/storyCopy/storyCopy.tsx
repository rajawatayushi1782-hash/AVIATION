import classNames from "classnames";
import { useState } from "react";
import { useLayoutEffect, useRef } from "react";
import "./storyCopy.scss";

interface storyCopyProps {
  copy: Array<string>;
}

const StoryCopy: React.FC<storyCopyProps> = (props) => {
  const [init, setInit] = useState<boolean>(false);
  const mainRef = useRef<HTMLDivElement>(null);
  const movelRef = useRef<HTMLDivElement>(null);
  const aFrame = useRef<any>();

  useLayoutEffect(() => {
    const render = () => {
      const main = mainRef.current;
      // const movel = movelRef.current;
      if (main) {
        const mainBox = main.getBoundingClientRect();
        main.style.setProperty('--offset-y', `${mainBox.top.toFixed(5)}px`)
      }
      aFrame.current = requestAnimationFrame(render);
    }
    //
    setInit(true);
    aFrame.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(aFrame.current);
  }, []);

  return (
    <div className={classNames("story-copy", {"is-init": init})} ref={mainRef}>
      <div className="story-copy__fixie">
        <div className="story-copy__movel" ref={movelRef}>
          <div className="story-copy__wrapper">
            {props.copy.map((item, key) => (
              <p key={key}>{item}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryCopy;
