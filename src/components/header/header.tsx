import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
//
import "./header.scss";
import data from "data/app.data.json";
import * as utils from "shell/app/app.utils";
import { useHistory } from "react-router";
import classNames from "classnames";
import HeaderVideo from "./headerVideo";
import find from "lodash/find";
import { ResponsiveImageSetData } from "components/responsiveImage/responsiveImage";

export interface headerMediaProps {
  key: string;
  index: number;
  loop?: boolean;
  video?: string;
  videoMobile?: string;
  videoEnd?: string;
  videoMobileFallback?: string;
  imageSet?: ResponsiveImageSetData;
  title: string;
}

interface headerProps {
  onReady: () => void;
  pathname: string | undefined;
}

const Header: React.FC<headerProps> = (props) => {
  const [renderNext, setRenderNext] = useState<boolean>(false);
  const [actInfinite, setActInfinite] = useState<boolean>(false);

  // data sets
  const [dataSet, setDataSet] = useState<Array<any>>([]);
  const [medias, setMedias] = useState<Array<headerMediaProps>>([]);
  const pathnameCur = useRef<string | undefined>(props.pathname);
  const pathnameNext = useRef<string | undefined>(props.pathname);
  // vars
  const animationFrame = useRef<any>();
  const history = useHistory();
  const mainRef = useRef<HTMLDivElement>(null!);
  const titlesRef = useRef<HTMLDivElement>(null!);
  const mediasPlxRef = useRef<HTMLDivElement>(null!);
  // wheel
  const [isWheel, setIsWheel] = useState<boolean>(false);
  const wheelTimeout = useRef<any>();
  //
  const historyPush = history.push;
  // update the location on media change
  useEffect(() => {
    if (pathnameCur.current !== props.pathname) {
      pathnameCur.current = pathnameNext.current = props.pathname;
    } else if (!!pathnameNext.current && pathnameNext.current !== props.pathname) {
      setActInfinite(false);
      pathnameCur.current = pathnameNext.current;
      historyPush(pathnameNext.current, "skipTimeout");
      // reset scroll
      window.scrollTo(0,0);
      window.core.scrollTop = 0;
    }
  }, [medias, props.pathname, historyPush]);
  //
  useEffect(() => {
    let _medias = dataSet.map((item) => item.header);
    setMedias(_medias);
  }, [dataSet]);
  // APPLY NEW HEADER SET
  useEffect(() => {
    if (!!props.pathname) {
      const newRoute = utils.getRouteWithPathname(props.pathname).toString();
      const newDataSet = find(data.pages, { route: newRoute });
      //
      if (typeof newDataSet === "object") {
        const _dataSet: Array<any> = [newDataSet];
        if (!!newDataSet.nextRoute) {
          let newDataNextSet = find(data.pages, {
            route: newDataSet.nextRoute,
          });
          _dataSet.push(newDataNextSet);
        }
        setDataSet(_dataSet);
        setRenderNext(false);
        setActInfinite(false);
      }
    }
    cancelAnimationFrame(animationFrame.current);
  }, [props.pathname]);

  // SCROLL / RENDER NEXT
  useLayoutEffect(() => {
    const render = () => {
      const el = document.getElementById('scrollable');
      if (!el || el.clientHeight === 0) {
        animationFrame.current = requestAnimationFrame(render);
        return false;
      }
      // ASSET CHANGE
      const scrollMax = el.clientHeight - window.innerHeight;
      if (dataSet.length > 1) {
        const lowerHalf = window.core.scrollTop > scrollMax / 2;
        setRenderNext(lowerHalf);
      }
      if (dataSet.length >= 1) {
        // track if bottom
        const scrollBottom =  Math.ceil(window.core.scrollTop) >= scrollMax;
        setActInfinite(scrollBottom);
      }
      // PLX for Titles
      const main = mainRef.current;
      if (main) {
        const vpHalf =
        window.core.scrollTop < el.clientHeight / 2 ||
          dataSet.length === 1
            ? window.core.scrollTop / window.innerHeight
            : (window.core.scrollTop -
              el.clientHeight +
                window.innerHeight) /
              window.innerHeight;
        const vpPLX = utils.clamp(vpHalf, -1, 1);
        //
        const mediasPlx = mediasPlxRef.current;
        if (!!mediasPlx) {
          // mediasPlx.style.transform = `translate3d(0,${((-window.innerHeight * 0.4) * vpPLX).toFixed(5)}px,0)`;
        }
        //
        const titles = titlesRef.current;
        if (!!titles) {
          const titleOpacity = 1 - utils.clamp(vpPLX * 2);
          titles.style.opacity = titleOpacity.toFixed(5);
          titles.style.transform = `translate3d(0,${(-window.innerHeight * vpPLX).toFixed(5)}px,0)`;
        }
      }
      //
      animationFrame.current = requestAnimationFrame(render);
    };

    animationFrame.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrame.current);
  }, [dataSet, actInfinite, isWheel]);

  // PUSH NEW ROUTE
  const pushNewRoute = useCallback(() => {
    const nextRoute = !!dataSet.length && dataSet[0].nextRoute;
    if (nextRoute) {
      // push the next route
      pathnameNext.current = utils.getRouteWithKey(nextRoute);
      // exchange medias
      if (!!medias && medias.length > 1) {
        const _medias = [...medias];
        _medias.shift();
        setMedias(_medias);
      }
    }
  }, [dataSet, medias]);

  // PUSH NEW ROUTE or ACT INFINITE && !WHELL
  useEffect(() => {
    if (!!actInfinite && !isWheel) {
      pushNewRoute();
      setActInfinite(false);
    }
  }, [actInfinite, isWheel, pushNewRoute]);

  // WHEEL
  useEffect(() => {
    const handleWheel = (e: any) => {
      clearTimeout(wheelTimeout.current);
      setIsWheel(true);
      wheelTimeout.current = setTimeout(() => setIsWheel(false), 200);
    };
    //
    // Listen for both input types: iPads report desktop UAs but scroll by
    // touch, and hybrid devices (touch laptops, tablets with trackpads)
    // can use either. The handler never calls preventDefault, so the
    // listeners can be passive (keeps scrolling smooth on Android).
    document.addEventListener("wheel", handleWheel, { passive: true });
    document.addEventListener("touchmove", handleWheel, { passive: true });
    return () => {
      document.removeEventListener("wheel", handleWheel);
      document.removeEventListener("touchmove", handleWheel);
    };
  }, []);

  const isMediaActive = (key: number) =>
    (key === 0 && !renderNext) || (key === 1 && !!renderNext);

  return (
    <div
      className={classNames(
        "header",
        `header--${(props.pathname || "home").replace("/", "")}`,
        `len-media-${medias.length}`,
        {
          "is-next": renderNext,
        }
      )}
      ref={mainRef}
    >
      {!!dataSet.length && (
        <>
          {/* TITLES */}
          <div className="header-titles" ref={titlesRef}>
            {medias.map((item: headerMediaProps, key) => (
              <h1
                key={item.key}
                className={classNames(
                  "header-title",
                  `header-title--${item.key}`
                )}
              >
                <span>{item.title}</span>
              </h1>
            ))}
          </div>
          {/* MEDIAS */}
          <div className="header-medias">
            <div className="header-medias__container" ref={mediasPlxRef}>
              {medias.map((item: headerMediaProps, key) => {
                if (item.video) {
                  return (
                    <HeaderVideo
                      {...item}
                      key={item.key}
                      active={isMediaActive(key)}
                      onCanPlay={props.onReady}
                      id={item.key}
                    />
                  );
                }

                if (item.imageSet) {
                  return (
                    <img
                      src={utils.assetPath(
                        utils.isMobileVP()
                          ? item.imageSet.mobile
                          : item.imageSet.desktop
                      )}
                      alt=""
                      style={{ zIndex: item.index }}
                      key={item.key}
                    />
                  );
                }
                return false;
              })}
            </div>
          </div>
        </>
      )}
      <div
        className={classNames("header-loader", {
          "is-visible": !!actInfinite && !!isWheel,
        })}
      >
        <span>Loading</span>
      </div>
    </div>
  );
};

export default Header;
