import "./cookieNotice.scss";
//
import React, { useState, useEffect } from "react";
import data from "data/app.data.json";
import ButtonSolid from "components/button/buttonSolid";
import classNames from "classnames";
import Cookies from "js-cookie";

interface cookieNoticeProps {}

const CookieNotice: React.FC<cookieNoticeProps> = (props) => {
  const [visible, setVisible] = useState(false);


  useEffect(() => {
    if (!Cookies.get('cn_accepted' )) {
      setVisible(true);
    };
    }, []);

  const handleAccept = () => {
    setVisible(false);
    Cookies.set("cn_accepted", "1", { expires: 365 });
  };
  return (
    <div className={classNames("cookieNotice", { "is-visible": visible })}>
      {/* {console.log(setVisible)} */}
      <div className="cookieNotice__inner wrapper">
        <div className="cookieNotice__inner-paragraph">
          {data.cookies.paragraph.map((item, key) => <span key={key}>{item}</span>)}
        </div>
        <div className="cookieNotice__inner-btn grid-row">
          <div className="cookieNotice__btn grid-cell">
            <ButtonSolid label="Read more" route="PrivacyPolicy" soft />
          </div>
          <div className="cookieNotice__btn is-aggree grid-cell">
            <ButtonSolid  label="Agree" onClick={handleAccept} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieNotice;
