import "./statement.scss";
import * as utils from "shell/app/app.utils";
import { useLayoutEffect, useRef, useState } from "react";
import classNames from "classnames";
import FlipBoard from "components/flipBoard/flipBoard";

type StatementData = {
  quote: string;
  image: string;
  overline: string;
};

interface statementProps extends StatementData {}

const Statement: React.FC<statementProps> = (props) => {
  const [visible, setVisible] = useState<boolean>(false);
  const mainRef = useRef<HTMLObjectElement>(null);
  const aFrame = useRef<any>(0);

  useLayoutEffect(() => {
    const render = () => {
      const main = mainRef.current;
      if (main) {
        const vpTop = utils.vpTop(main);
        if (vpTop >= -1 && vpTop <= 2) {
          main.style.setProperty('--progress', utils.clamp(vpTop, -1, 2).toFixed(5));
        }
        setVisible(vpTop >= 0 && vpTop < 1);
      }
      aFrame.current = requestAnimationFrame(render);
    };

    aFrame.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(aFrame.current);
  }, []);

  return (
    <div
      className={classNames("statement", { "is-visible": visible })}
      ref={mainRef}
    >
      <div className="statement__inner">
        <div className="statement__image">
          <img src={utils.assetPath(props.image)} alt="" />
        </div>
        <div className="statement__quote">
          <div className="statement__quote-movel">
            <h6><FlipBoard value={props.overline} isOut={!visible} /></h6>
            <p>{props.quote}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statement;
