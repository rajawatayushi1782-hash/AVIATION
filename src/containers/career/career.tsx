import "./career.scss";
import Footer from "components/footer/footer";
import parse from "html-react-parser";
import { useHistory } from "react-router";
import { useEffect, useRef, useState } from "react";
import FetchJobs from './FetchJobs';

type CareerData = {
  title: string;
  blocks: Array<{
    headline: string;
    paragraphs: string[];
  }>;
};

interface careerProps {}

const Career: React.FC<careerProps> = (props) => {
  const [data, setData] = useState<CareerData | null>(null);
  const history = useHistory();
  const currentPath = useRef<string>();

  useEffect(() => {
    if (history.location.pathname !== currentPath.current) {
      try {
        const _data: CareerData = require("data/career.data.json");
        !!_data && setData(_data);
        window.scrollTo(0, 0);
        currentPath.current = history.location.pathname;
      } catch (error) {}
    }
  }, [data, history.location.pathname]);

  return (
    <div className="career">
      {/* <div className="career__header" style={{ backgroundImage: 'url(bucket:/header-jets.jpg)', height: '100vh', backgroundSize: 'cover', backgroundPosition: 'center' }}> */}
        {/* Fullscreen header image */}
      {/* </div> */}
      <div className="career__inner">
        <div className="career__content wrapper--tight">
          <h2 className="career__content-header">{!!data && data.title}</h2>
          {!!data && (
            <>
              {/* Render "Join Our Team" block first */}
              {data.blocks.map((item, key) => {
                if (item.headline === "Join Our Team") {
                  return (
                    <div className="career__content-block" key={key}>
                      <h2 className="career__content-headline">{item.headline}</h2>
                      {item.paragraphs.map((paragraph, index) => {
                        if (paragraph.includes('<ul>')) {
                          return (
                            <div key={index} dangerouslySetInnerHTML={{ __html: paragraph }} />
                          );
                        }
                        return (
                          <p key={index}>{parse(paragraph)}</p>
                        );
                      })}
                    </div>
                  );
                }
                return null; // Skip rendering other blocks here
              })}

              {/* Render job offers blocks */}
              {data.blocks.map((item, key) => {
                if (item.headline !== "Join Our Team" && item.headline !== "Why Work With Us") {
                  return (
                    <div className="career__content-block" key={key}>
                      <h2 className="career__content-headline">{item.headline}</h2>
                      {item.paragraphs.map((paragraph, index) => {
                        if (paragraph.includes('<ul>')) {
                          return (
                            <div key={index} dangerouslySetInnerHTML={{ __html: paragraph }} />
                          );
                        }
                        return (
                          <p key={index}>{parse(paragraph)}</p>
                        );
                      })}
                    </div>
                  );
                }
                return null; // Skip rendering "Join Our Team" and "Why Work With Us"
              })}
          <FetchJobs />

              {/* Render "Why Work With Us" block last */}
              {data.blocks.map((item, key) => {
                if (item.headline === "Why Work With Us") {
                  return (
                    <div className="career__content-block" key={key}>
                      <h2 className="career__content-headline">{item.headline}</h2>
                      {item.paragraphs.map((paragraph, index) => {
                        if (paragraph.includes('<ul>')) {
                          return (
                            <div key={index} dangerouslySetInnerHTML={{ __html: paragraph }} />
                          );
                        }
                        return (
                          <p key={index}>{parse(paragraph)}</p>
                        );
                      })}
                    </div>
                  );
                }
                return null;
              })}

              {/* Add About Us section */}
              <div className="career__content-block">
                <h2 className="career__content-headline">About us</h2>
                <p>Founded in 2021, Platoon Aviation's vision is to become the market's leading charter operator, achieved by leveraging advanced technology, state-of-the-art aircraft, and our team's unparalleled expertise.</p>
                <p>In 2024 Platoon will operate 8 identical PC-24, which operate on a floating fleet model across Europe (i.e. the aircraft have no fixed home base). The PC-24 offers an unparalleled level of comfort for our passengers, coupled with exceptional performance capabilities and better luggage capacity.</p>
                <p>Operating on an ad hoc basis, Platoon does not offer a scheduled service but according to market trends and individual demand from clients. Platoon operates in a B2B style model, which means we work principally with brokers across the world, and this has enabled us to already become a recognized brand and airline on the market due to the higher volume of flights we are able to operate.</p>
                <p>Platoon is determined to set the new benchmark in private charter when it comes to service and experience, and truly make our guests feel at home in the sky when they fly Platoon.</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Career;