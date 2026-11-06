import "./legal.scss";
//
// import data from "data/imprint.data.json";
import Footer from "components/footer/footer";
import parse from "html-react-parser";
import { useHistory } from "react-router";
import { useEffect, useRef, useState } from "react";

type LegalData = {
  title: string;
  blocks: Array<{
    headline: string;
    paragraphs: string[];
  }>;
};

interface legalProps {}

const Legal: React.FC<legalProps> = (props) => {
  const [data, setData] = useState<LegalData | null>(null);
  const history = useHistory();
  const currentPath = useRef<string>();

  useEffect(() => {
    if (history.location.pathname !== currentPath.current) {
      const location = history.location.pathname.replace("/", "");
      try {
        const _data: LegalData = require("data/" + location + ".data.json");
        !!_data && setData(_data);
        window.scrollTo(0, 0);
        currentPath.current = history.location.pathname;
      } catch (error) {}
    }
  }, [data, history.location.pathname]);

  return (
    <div className="legal">
      <div className="legal__inner">
        <div className="legal__content wrapper--tight">
          <h2 className="legal__content-header">{!!data && data.title}</h2>
          {!!data && !!data.blocks &&
            data.blocks.map((item, key) => {
              return (
                <div className="legal__content-block" key={key}>
                  {item.headline && <h2 className="legal__content-headline">{item.headline}</h2>}
                  {/* <div className="legal__content-paragraph"> */}
                  {item.paragraphs && item.paragraphs.map((item, key) => (
                    <p key={key}>{parse(item)}</p>
                  ))}
                  {/* </div> */}
                </div>
              );
            })}
        </div>
      </div>
      <Footer withChapters />
    </div>
  );
};

export default Legal;
