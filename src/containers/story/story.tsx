import "./story.scss";
import data from "data/story.data.json";
import StoryCopy from "components/storyCopy/storyCopy";
import Footer from "components/footer/footer";
interface storyProps {}

const Story: React.FC<storyProps> = (props) => (
  <div className="story">
    <StoryCopy copy={data.storyCopy} />
    <Footer withChapters />
  </div>
);

export default Story;
