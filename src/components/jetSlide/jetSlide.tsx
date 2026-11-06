import "./jetSlide.scss";
import JetSlideExperience, { JetExperienceData } from "./jetSlideExperience";
import JetSlideLugguage, { JetLugguageData } from "./jetSlideLugguage";
import JetSlideReach, { JetReachData } from "./jetSlideReach";
import JetSlideStrip, { JetStripData } from "./jetSlideStrip";
import JetSlideTimes, { JetSlideTimesData } from "./jetSlideTimes";

interface jetSlideProps {
  lugguage: JetLugguageData;
  strip: JetStripData;
  reach: JetReachData;
  times: JetSlideTimesData;
  experience: JetExperienceData;
}

const JetSlide: React.FC<jetSlideProps> = (props) => {
  return (
    <div className="jet-slide">
      <JetSlideLugguage {...props.lugguage} />
      <JetSlideStrip {...props.strip} />
      <JetSlideTimes {...props.times} />
      <JetSlideReach {...props.reach} />
      {/* <JetSlideExperience {...props.experience} /> */}
    </div>
  );
};

export default JetSlide;
