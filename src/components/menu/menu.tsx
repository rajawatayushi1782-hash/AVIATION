import React from "react";
import { NavLink } from "react-router-dom";
import classNames from "classnames";
import "./menu.scss";
import { ROUTES } from "constants/routes";

interface MenuProps {
  isOpen: boolean;
  onClose?: () => void;
}

interface NavItem {
  label: string;
  route: string;
}

// 6 navigation links arranged for the 2-column grid:
// Column 1: Home, The Jets, The Experience
// Column 2: Sponsoring, Our Story, Career
// Displayed as:
// Home         Sponsoring
// The Jets     Our Story
// The Experience Career
const NAV_ITEMS: NavItem[] = [
  { label: "Home", route: ROUTES.Home },
  { label: "Sponsoring", route: ROUTES.Sponsoring },
  { label: "The Jets", route: ROUTES.Jets },
  { label: "Our Story", route: ROUTES.Story },
  { label: "The Experience", route: ROUTES.Experience },
  { label: "Career", route: ROUTES.Career },
];

const Menu: React.FC<MenuProps> = ({ isOpen, onClose }) => {
  const handleLinkClick = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <div
      className={classNames("menu", { "is-open": isOpen })}
      role="dialog"
      aria-modal="true"
      aria-label="Navigation Menu"
    >
      {/* Header spacer to prevent any collision with the centered logo & burger */}
      <div className="menu__header-spacer" />

      {/* Main navigation container with 2-column grid */}
      <div className="menu__nav-wrapper">
        <nav className="menu__grid" aria-label="Main Navigation">
          {NAV_ITEMS.map((item, index) => (
            <div className="menu__item-wrapper" key={item.label}>
              <NavLink
                exact
                to={{ pathname: item.route, state: "skipTimeout" }}
                className="menu__link"
                activeClassName="active"
                onClick={handleLinkClick}
                style={{
                  transitionDelay: isOpen ? `${0.12 + index * 0.05}s` : "0s",
                }}
              >
                <span>{item.label}</span>
              </NavLink>
            </div>
          ))}
        </nav>
      </div>

      {/* 3-Column Balanced Footer */}
      <footer className="menu__footer">
        <div className="menu__footer-inner">
          {/* Column 1 (LEFT): Copyright & Location */}
          <div className="menu__footer-col menu__footer-col--left">
            <span className="menu__footer-text">©2026 Platoon Aviation</span>
            <span className="menu__footer-text">From Hamburg with love</span>
          </div>

          {/* Column 2 (CENTER): Phone & Email */}
          <div className="menu__footer-col menu__footer-col--center">
            <a
              href="tel:+4940285330247"
              className="menu__footer-link"
              aria-label="Call Platoon Aviation at +49 40 285 330-247"
            >
              +49 40 285 330-247
            </a>
            <a
              href="mailto:hello@flyplatoon.com"
              className="menu__footer-link"
              aria-label="Email Platoon Aviation at hello@flyplatoon.com"
            >
              hello@flyplatoon.com
            </a>
          </div>

          {/* Column 3 (RIGHT): Social links & Legal pages in a single vertical column */}
          <div className="menu__footer-col menu__footer-col--right">
            <a
              href="https://www.linkedin.com/company/platoon-aviation"
              target="_blank"
              rel="noopener noreferrer"
              className="menu__footer-link"
            >
              LinkedIn
            </a>
            <a
              href="https://www.instagram.com/flyplatoon/"
              target="_blank"
              rel="noopener noreferrer"
              className="menu__footer-link"
            >
              Instagram
            </a>
            <NavLink
              exact
              to={{ pathname: ROUTES.Imprint, state: "skipTimeout" }}
              className="menu__footer-link"
              activeClassName="active"
              onClick={handleLinkClick}
            >
              Imprint
            </NavLink>
            <NavLink
              exact
              to={{ pathname: ROUTES.PrivacyPolicy, state: "skipTimeout" }}
              className="menu__footer-link"
              activeClassName="active"
              onClick={handleLinkClick}
            >
              Privacy Policy
            </NavLink>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Menu;
