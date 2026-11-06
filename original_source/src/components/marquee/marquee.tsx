import { useEffect, useRef } from "react";
import "./marquee.scss";

interface marqueeProps {
  copy?: string;
  elements: string[];
  isActive: boolean;
  reverse?: boolean;
}

const Marquee: React.FC<marqueeProps> = (props) => {
  const elRef = useRef<HTMLDivElement>(null!);
  const slideRef = useRef<any>(null!);
  const itemRef = useRef<HTMLDivElement>(null!);
  const animationFrame = useRef<any>();
  //
  const left = useRef<number>(0);
  const speed = 1;
  //
  useEffect(() => {
    const render = () => {
      left.current = (left.current - speed) % itemRef.current.clientWidth;

      const slide = slideRef.current;
      !!slide && (slide.style.transform = `translate3d(${left.current.toFixed(5)}px, 0, 0)`)

      props.isActive &&
        (animationFrame.current = requestAnimationFrame(render));
    };
    props.isActive && (animationFrame.current = requestAnimationFrame(render));
    return () => cancelAnimationFrame(animationFrame.current);
  }, [props.isActive]);

  const renderInner = () => {
    if (props.copy) {
      return props.copy;
    }

    if (props.elements) {
      return props.elements.map((item, key) => <div key={key} className="marquee__el">{item}</div>)
    }

    return null;
  }

  return (
    <div className="marquee" ref={elRef}>
      <div className="marquee__inner" ref={slideRef}>
        <div className="marquee__row" ref={itemRef}>
          {renderInner()}
        </div>
        <div className="marquee__row">{renderInner()}</div>
        <div className="marquee__row">{renderInner()}</div>
      </div>
    </div>
  );
};

export default Marquee;
