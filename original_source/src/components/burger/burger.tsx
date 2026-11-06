import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
//
import "./burger.scss";

interface burgerProps {
  isOpen: boolean;
  onClick: () => void;
}

const Burger: React.FC<burgerProps> = (props) => {
  const [dark, setDark] = useState<boolean>();
  const elRef = useRef<HTMLDivElement>(null!);
  const aFrame = useRef<any>();
  const onClick = props.onClick;

  useEffect(() => {
    const render = () => {
      if (elRef.current) {
        const isDark = window.scrollY > window.innerHeight && window.scrollY < document.body.clientHeight - window.innerHeight - elRef.current.clientHeight;
        setDark(isDark);
      }
      aFrame.current = requestAnimationFrame(render);
    }
    aFrame.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(aFrame.current);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      !!props.isOpen && onClick();
    };
    document.addEventListener("scroll", handleScroll);
    return () => document.removeEventListener("scroll", handleScroll);
  }, [onClick, props.isOpen]);

  return (
    <div className={classNames("burger", {"is-dark": dark})} ref={elRef}>
      <button
        className={classNames(
          "hamburger",
          "hamburger--spring",
          {
            "is-active": props.isOpen
          }
        )}
        type="button"
        onClick={props.onClick}
        aria-label={props.isOpen ? "Close menu" : "Open menu"}
        aria-expanded={props.isOpen}
      >
        <span className="hamburger-box">
          <span className="hamburger-inner"></span>
        </span>
      </button>
    </div>
  );
};

export default Burger;
