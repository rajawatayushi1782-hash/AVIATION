import "./footer.scss";
//
import data from "data/footer.data.json";
import * as utils from "shell/app/app.utils";
import React from "react";
import classNames from "classnames";
import FooterLegalItem from "./footerLegalItem";
import { NavLink, useLocation } from "react-router-dom";
import { ROUTES } from "constants/routes";

interface footerProps {
  withChapters?: boolean;
  withBackground?: boolean;
}

const Footer: React.FC<footerProps> = (props) => {
  const location = useLocation();
  const isHome = location.pathname === "/" || location.pathname === "";
  const showChapters = props.withChapters !== undefined ? props.withChapters : isHome;

  const renderChapters = () => {
    if (showChapters) {
      return (
        <div className="footer-chapter">
          <div className="footer-chapter__row">
            {data.chapters.map((item, key) => {
              const route = ROUTES[item.route as keyof typeof ROUTES];
              return (
                <NavLink
                  exact
                  to={route}
                  className="footer-chapter-item"
                  key={key}
                >
                  <div className="footer-chapter-item__image-wrap">
                    <img src={utils.assetPath(item.image)} alt={item.label} loading="lazy" />
                  </div>
                  <div className="footer-chapter-header-title">
                    {item.label}
                  </div>
                </NavLink>
              );
            })}
          </div>
        </div>
      );
    }
    return false;
  };

  return (
    <footer
      className={classNames("footer", {
        "with-chapters": showChapters,
        "without-chapters": !showChapters,
        "with-background": props.withBackground,
      })}
    >
      {/* .footer-chapters */}
      {renderChapters()}
      {/* .footer-legal */}
      <div className="footer-legal">
        <div className="footer-legal__row">
          <div className="footer-legal__group is-desktop">
            {data.copyright.map((subItem: any, key: number) => (
              <FooterLegalItem {...subItem} key={"item" + key} />
            ))}
          </div>
          <div className="footer-legal__group footer-legal__group--contact">
            {data.contact.map((subItem: any, key: number) => (
              <FooterLegalItem {...subItem} key={"item" + key} />
            ))}
          </div>
          <div className="footer-legal__group is-double">
            {data.social.map((subItem: any, key: number) => (
              <FooterLegalItem {...subItem} key={"item" + key} />
            ))}
          </div>
          <div className="footer-legal__group is-double">
            {data.legal.map((subItem: any, key: number) => (
              <FooterLegalItem {...subItem} key={"item" + key} />
            ))}
          </div>
          <div className="footer-legal__group is-mobile">
            {data.copyright.map((subItem: any, key: number) => (
              <FooterLegalItem {...subItem} key={"item" + key} />
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
