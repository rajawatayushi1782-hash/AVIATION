import "./jets.scss";
import data from "data/jets.data.json";
import Loop from "shell/loop/loop";
import JetSlide from "components/jetSlide/jetSlide";
import Fullsize from "components/fullsize/fullsize";
import Footer from "components/footer/footer";

interface jetsProps {}

const Jets: React.FC<jetsProps> = (props) => (
  <div className="jets">
    <div className="jets__inner">
      <Loop {...data} />
      <JetSlide {...data.slides} />
      <Fullsize {...data.closing} />
      <Footer withBackground />
    </div>
  </div>
);

export default Jets;
