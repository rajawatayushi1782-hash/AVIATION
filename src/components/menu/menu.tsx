import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import classNames from "classnames";
//
import "./menu.scss";
import data from "data/app.data.json";
import { useHistory } from "react-router";
import { ROUTES } from "constants/routes";
import * as utils from "shell/app/app.utils";
import { VIEWPORT } from "constants/viewport";
import footerData from "data/footer.data.json";
import FooterLegalItem from "components/footer/footerLegalItem";

interface menuProps {
  isOpen: boolean;
  onClose?: () => void;
}

const Menu: React.FC<menuProps> = (props) => {
  const [active, setActive] = useState<number>(-1);
  const current = useRef<number>(-1);
  const history = useHistory();
  const [isDesktop, setIsDesktop] = useState<boolean>(() =>
    typeof window !== "undefined" ? window.innerWidth >= VIEWPORT.Desktop : true
  );
  const mouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const aFrame = useRef<any>(0);
  const aPosition = useRef({ x: 0, y: 0 });
  const imagesRef = useRef<HTMLDivElement>(null);
  //
  const resetTimeout = useRef<any>();
  const resetActive = () => {
    resetTimeout.current = setTimeout(() => {
      setActive(current.current);
    }, 100);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= VIEWPORT.Desktop);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (props.isOpen) {
      const pageIndex = data.pages
        .filter((item) => item.route !== "Imprint" && item.route !== "PrivacyPolicy")
        .findIndex((item) => {
          const route = ROUTES[item.route as keyof typeof ROUTES];
          return route === history.location.pathname;
        });
      current.current = pageIndex;
      setActive(pageIndex);
    }
  }, [props.isOpen, history.location.pathname]);

  useLayoutEffect(() => {
    const render = () => {
      aPosition.current.x = utils.lerp(
        aPosition.current.x,
        mouse.current.x,
        0.1
      );
      aPosition.current.y = utils.lerp(
        aPosition.current.y,
        mouse.current.y,
        0.1
      );

      const movel = imagesRef.current;
      if (movel) {
        movel.style.transform = `translate(0,${
          (5 / 100) * aPosition.current.y
        }vh)`;
      }
      aFrame.current = requestAnimationFrame(render);
    };
    props.isOpen && (aFrame.current = requestAnimationFrame(render));
    return () => cancelAnimationFrame(aFrame.current);
  }, [props.isOpen]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = {
        x:
          (100 / (window.innerWidth / 2)) * (e.clientX - window.innerWidth / 2),
        y:
          (100 / (window.innerHeight / 2)) *
          (e.clientY - window.innerHeight / 2),
      };
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const filteredPages = data.pages.filter(
    (item) => item.route !== "Imprint" && item.route !== "PrivacyPolicy"
  );
  const length = filteredPages.length;

  return (
    <div
      className={classNames(
        "menu",
        { "is-open": props.isOpen },
        { "is-desktop": isDesktop }
      )}
    >
      <div className="menu__wrapper wrapper">
        <div className="menu__inner grid-row">
          <div className="menu__left grid-cell">
            {filteredPages.map((item, key) => {
              const route = ROUTES[item.route as keyof typeof ROUTES];
              return (
                <NavLink
                  exact
                  to={{ pathname: route, state: "skipTimeout" }}
                  className="menu-item"
                  key={key}
                  onClick={() => props.onClose?.()}
                  onMouseOver={() => {
                    setActive(key);
                    clearTimeout(resetTimeout.current);
                  }}
                  onMouseOut={resetActive}
                  style={{
                    transitionDelay: `${
                      0.2 + (0.4 / length) * (length - key)
                    }s`,
                  }}
                >
                  <span>{item.menuTitle}</span>
                </NavLink>
              );
            })}
            <NavLink
              exact
              to={{ pathname: ROUTES.Imprint, state: "skipTimeout" }}
              className="menu-item"
              onClick={() => props.onClose?.()}
              onMouseOver={() => {
                setActive(-1);
                clearTimeout(resetTimeout.current);
              }}
              onMouseOut={resetActive}
              style={{
                transitionDelay: `${0.2}s`,
              }}
            >
              <span>Imprint</span>
            </NavLink>
          </div>
          <div className="menu__images grid-cell" ref={imagesRef}>
            {filteredPages.map((item, key) => (
              <img
                src={utils.assetPath(item.menuImg)}
                alt={item.menuTitle}
                className={classNames({ "is-active": key === active })}
                key={key}
                loading="lazy"
                decoding="async"
              />
            ))}
          </div>
        </div>
      </div>
      <div className="menu__footer">
        {footerData.contact.map((item, key) => {
          return <FooterLegalItem label={item.label} link={item.link} key={key} />;
        })}
      </div>
    </div>
  );
};

export default Menu;
