import classNames from "classnames";
import "./topbar.scss";
//
import React, { useEffect, useRef, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { ROUTES } from "constants/routes";
import * as utils from "shell/app/app.utils";

interface topbarProps {
  doFade: boolean;
  menuOpen: boolean;
  darkLogo?: boolean;
}

const Topbar: React.FC<topbarProps> = (props) => {
  const [isOut, setIsOut] = useState<boolean>(false);
  const [isLegal, setLegal] = useState<boolean>(false);
  //
  const elRef = useRef<HTMLDivElement>(null!);
  const logoRef = useRef<any>(null!);
  //
  const aFrame = useRef<any>();
  const history = useHistory();

  const historyListen = history.listen;

  useEffect(() => {
    const handlePathname = () => {
      const legalPages = [ROUTES.Imprint as string, ROUTES.PrivacyPolicy as string, ROUTES.Career as string];
      setLegal(legalPages.indexOf(history.location.pathname) > -1);
    }
    handlePathname()
    return historyListen(() => {
      handlePathname();
    });   
  }, [historyListen, history.location.pathname])

  useEffect(() => {
    const render = () => {
      const scroll = document.getElementById('scrollable');
      if (!scroll) {
        aFrame.current = requestAnimationFrame(render);
        return false;
      }
      const el = elRef.current;
      if (props.doFade && el) {
        const _isOut =
          window.core.scrollTop > window.innerHeight &&
          window.core.scrollTop <
          scroll.clientHeight - window.innerHeight - 40;
        setIsOut(_isOut);

        // is out opacity
        let opacity = 1;
        if (window.core.scrollTop < window.innerHeight * 1.5) {
          const vpY = window.core.scrollTop / window.innerHeight;
          opacity = 1 - utils.clamp((vpY - 0.2) / 0.8);
        }
        el.style.opacity = opacity.toFixed(5);
      } else {
        setIsOut(false);
      }
      //
      aFrame.current = requestAnimationFrame(render);
    };
    //
    aFrame.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(aFrame.current);
  }, [props.doFade]);
  //

  return (
    <div
      className={classNames(
        "topbar",
        { "is-out": isOut,  "is-menu-open": props.menuOpen, "is-legal": isLegal }
      )}
      ref={elRef}
    >
      <div className="topbar__inner">
        <Link
          to={ROUTES.Home}
          ref={logoRef}
          className="topbar__logo"
          aria-label="Platoon Aviation - Home"
        >
          <img src={utils.assetPath(isLegal && history.location.pathname != ROUTES.Career && !props.menuOpen ? "https://content.flyplatoon.com/website/platoon-black.svg" : "https://content.flyplatoon.com/website/platoon-white.svg")} alt="Platoon Aviation logo" />
        </Link>
      </div>
    </div>
  );
};

export default Topbar;