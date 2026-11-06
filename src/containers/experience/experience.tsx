import "./experience.scss";
import data from "data/experience.data.json";
import Loop from "shell/loop/loop";
import Footer from "components/footer/footer";

interface experienceProps {}

const Experience: React.FC<experienceProps> = (props) => (
  <div className="experience">
    <div className="experience__inner">
      <Loop {...data} />
      <Footer withBackground />
    </div>
  </div>
);

export default Experience;
