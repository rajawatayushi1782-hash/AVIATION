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
        const scroll = document.getElementById("scrollable");
        const totalHeight = scroll ? scroll.clientHeight : document.body.clientHeight;
        const currentScroll =
          window.core && typeof window.core.scrollTop === "number"
            ? window.core.scrollTop
            : window.scrollY;
        const isDark =
          currentScroll > window.innerHeight &&
          currentScroll < totalHeight - window.innerHeight - elRef.current.clientHeight;
        setDark(isDark);
      }
      aFrame.current = requestAnimationFrame(render);
    };
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
