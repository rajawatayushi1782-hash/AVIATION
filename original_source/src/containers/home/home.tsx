import Loop from "shell/loop/loop";

import data from "data/home.data.json";
import "./home.scss";
import Mission from "components/mission/mission";
import Footer from "components/footer/footer";

interface homeProps {}

const Home: React.FC<homeProps> = (props) => (
  <div className="home">
    <div className="home__inner">
      <Mission {...data.mission} />
      <Loop {...data} />
      <Footer withBackground />
    </div>
  </div>
);

export default Home;
