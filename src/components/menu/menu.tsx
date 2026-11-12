import React from "react";
import { NavLink } from "react-router-dom";
import classNames from "classnames";
import "./menu.scss";
import { ROUTES } from "constants/routes";
import * as utils from "shell/app/app.utils";

interface MenuProps {
  isOpen: boolean;
  onClose?: () => void;
}

interface NavCard {
  label: string;
  route: string;
  image: string;
}

// 6 navigation cards matching original FlyPlatoon menu:
// Row 1: Home | The Jets | The Experience | Career
// Row 2: Sponsoring | Our Story
const NAV_CARDS: NavCard[] = [
  {
    label: "Home",
    route: ROUTES.Home,
    image: "https://content.flyplatoon.com/website/menu-home.jpg",
  },
  {
    label: "The Jets",
    route: ROUTES.Jets,
    image: "https://content.flyplatoon.com/website/menu-jets.jpg",
  },
  {
    label: "The Experience",
    route: ROUTES.Experience,
    image: "https://content.flyplatoon.com/website/menu-experience.jpg",
  },
  {
    label: "Career",
    route: ROUTES.Career,
    image: "https://content.flyplatoon.com/website/career_menu-title.jpg",
  },
  {
    label: "Sponsoring",
    route: ROUTES.Sponsoring,
    image: "https://content.flyplatoon.com/website/sps_ptn_8.jpg",
  },
  {
    label: "Our Story",
    route: ROUTES.Story,
    image: "https://content.flyplatoon.com/website/menu-story.jpg",
  },
];

const Menu: React.FC<MenuProps> = ({ isOpen, onClose }) => {
  const handleCardClick = () => {
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
      {/* Header spacer to prevent collision with topbar logo and burger */}
      <div className="menu__header-spacer" />

      {/* Main navigation container with 6 image cards */}
      <div className="menu__cards-container">
        <nav className="menu__cards-grid" aria-label="Main Navigation">
          {NAV_CARDS.map((card, index) => (
            <NavLink
              exact
              to={{ pathname: card.route, state: "skipTimeout" }}
              className="menu__card"
              activeClassName="is-active"
              key={card.label}
              onClick={handleCardClick}
              style={{
                transitionDelay: isOpen ? `${0.08 + index * 0.04}s` : "0s",
              }}
            >
              <div className="menu__card-image">
                <img
                  src={utils.assetPath(card.image)}
                  alt={card.label}
                  loading="eager"
                  decoding="async"
                />
              </div>
              <span className="menu__card-title">{card.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Footer with legal & contact info */}
      <footer className="menu__footer">
        <div className="menu__footer-inner">
          <div className="menu__footer-left">
            <span>©2026 Platoon Aviation</span>
            <span>From Hamburg with love</span>
          </div>
          <div className="menu__footer-center">
            <a href="tel:+4940285330247" aria-label="Call Platoon Aviation at +49 40 285 330-247">+49 40 285 330-247</a>
            <a href="mailto:hello@flyplatoon.com" aria-label="Email Platoon Aviation at hello@flyplatoon.com">hello@flyplatoon.com</a>
          </div>
          <div className="menu__footer-right">
            <a href="https://www.linkedin.com/company/platoon-aviation" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href="https://www.instagram.com/flyplatoon/" target="_blank" rel="noopener noreferrer">Instagram</a>
            <NavLink exact to={{ pathname: ROUTES.Imprint, state: "skipTimeout" }} onClick={handleCardClick}>Imprint</NavLink>
            <NavLink exact to={{ pathname: ROUTES.PrivacyPolicy, state: "skipTimeout" }} onClick={handleCardClick}>Privacy Policy</NavLink>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Menu;
