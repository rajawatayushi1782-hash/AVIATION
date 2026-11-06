import "./footerLegalItem.scss";
//
import React from "react";
import {NavLink} from "react-router-dom"

import { ROUTES } from "constants/routes";

export type FooterLegalItemData = {
  label: string;
  link?: string;
  route?: string;
};

interface footerLegalItemProps extends FooterLegalItemData {}

const FooterLegalItem: React.FC<footerLegalItemProps> = (props) => {

  if (!!props.link) {
    return (
      <a className="footer-legal-item" href={props.link} target="_blank" rel="noreferrer">
        {props.label}
      </a>
    );
  }
  if (!!props.route) {
    const route = ROUTES[props.route as keyof typeof ROUTES];
    return <NavLink exact to={route} className="footer-legal-item">{props.label}</NavLink>;
  }

  return <div className="footer-legal-item">{props.label.replace('%year%', new Date().getFullYear().toString())}</div>;
};

export default FooterLegalItem;
