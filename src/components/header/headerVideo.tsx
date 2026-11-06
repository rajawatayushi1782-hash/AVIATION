import * as utils from "shell/app/app.utils";
import { headerMediaProps } from "components/header/header";
import classNames from "classnames";
import { useEffect, useLayoutEffect, useState } from "react";
import { useHistory } from "react-router";

interface headerVideoProps extends headerMediaProps {
  active: boolean;
  onCanPlay: () => void;
  id: string;
}

const HeaderVideo: React.FC<headerVideoProps> = (props) => {
  const [ended, setEnded] = useState<boolean>(false);
  const history = useHistory();
  const [ratio, setRatio] = useState<number>(window.innerHeight / window.innerWidth);

  const videoSrc = () => {
    return utils.isMobileVP()
      ? props.videoMobile || props.video || ""
      : props.video || "";
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      document.body.classList.add("is-intro-complete");
    }, props.loop ? 100 : 2800);
    return () => clearTimeout(timer);
  }, [props.loop]);

  useEffect(() => {
    return history.listen(() => {
      document.body.classList.remove("is-intro-complete");
    });
  }, [history]);

  useLayoutEffect(() => {
    const handleResize = () => {
      setRatio(window.innerHeight / window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className={classNames("header-video", `header-video--${props.id}`, {
        "is-ended": ended,
        "header-video--align-left": props.id === "home" && ratio > 9 / 16,
      })}
      style={{ zIndex: props.index }}
    >
      <video
        src={utils.assetPath(videoSrc())}
        poster={props.videoMobileFallback ? utils.assetPath(props.videoMobileFallback) : undefined}
        autoPlay
        muted
        playsInline
        loop={!!props.loop}
        onCanPlay={props.onCanPlay}
        onEnded={() => {
          setEnded(true);
          !props.loop && document.body.classList.add("is-intro-complete");
        }}
      />
    </div>
  );
};

export default HeaderVideo;
