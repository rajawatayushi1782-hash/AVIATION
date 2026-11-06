import "./sponsoring.scss";
import data from "data/sponsoring.data.json";
import Loop from "shell/loop/loop";
import SponsoringSlide from "components/sponsoringSlide/sponsoringSlide";
import Fullsize from "components/fullsize/fullsize";
import Footer from "components/footer/footer";

interface sponsoringProps {}

const sponsoring: React.FC<sponsoringProps> = (props) => (
  <div className="sponsoring">
    <div className="sponsoring__inner">
      <Loop {...data} />
      {/* <SponsoringSlide {...data.slides} />
      <Fullsize {...data.closing} /> */}
      <Footer withBackground />
    </div>
  </div>
);

export default sponsoring;
