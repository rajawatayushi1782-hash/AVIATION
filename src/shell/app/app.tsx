import classNames from "classnames";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Redirect, Route, Switch, useHistory, useLocation } from "react-router";
import "./app.scss";
import Topbar from "components/topbar/topbar";
import { ROUTES } from "constants/routes";
import * as H from "history";
import Header from "components/header/header";
import Menu from "components/menu/menu";
import Home from "containers/home/home";
import Experience from "containers/experience/experience";
import Jets from "containers/jets/jets";
import Story from "containers/story/story";
import Legal from "containers/legal/legal";
import Career from "containers/career/career";
import Sponsoring from "containers/sponsoring/sponsoring";
import Burger from "components/burger/burger";
// import Loader from "components/loader/loader";
import CookieNotice from "components/cookieNotice/cookieNotice";
import Transition from "components/transition/transition";
import Scroll from "shell/scroll/scroll";
import Seo from "components/seo/seo";
import isMobile from "ismobilejs";

// Ensure process.env is available
if (typeof process === 'undefined') {
  (window as any).process = { env: { NODE_ENV: 'production' } };
}

declare global {
  interface Window {
    core: {
      scrollTop: number;
      scrollCustom: boolean;
    }
  }
}

// Custom (wheel-driven) scrolling only on devices with a fine pointer.
// UA sniffing alone misses iPads (iPadOS reports a desktop UA) and
// Android devices in "desktop site" mode — all of those must use
// native touch scrolling.
const isTouchDevice =
  isMobile(window.navigator).any ||
  (typeof window.matchMedia === "function" &&
    window.matchMedia("(pointer: coarse)").matches) ||
  navigator.maxTouchPoints > 1;

window.core = {
  scrollTop: 0,
  scrollCustom: !isTouchDevice,
};

const App: React.FC<{}> = () => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  // const [isLoading, setLoading] = useState<boolean>(true);
  const [transition, setTransition] = useState<boolean>(false);
  const [location, setLocation] = useState<H.Location>({
    pathname: window.location.pathname,
    state: {},
    search: "",
    hash: "",
  });

  const history = useHistory();
  // Live router location — drives SEO immediately, independent of the
  // ~500ms transition delay applied to `location` (used for the animation).
  const routerLocation = useLocation();
  const locationTimeout = useRef<any>();
  const transitionTimeout = useRef<any>();
  const tTransition = 500;

  useLayoutEffect(() => {
    !window.core.scrollCustom && document.documentElement.classList.add("is-scroll-default");
    // document.documentElement.classList.add("mobile-scroll");
    //
    const handleResize = () => {
      document.documentElement.style.setProperty(
        "--win-height",
        `${window.innerHeight}px`
      );
    };
    //
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const unlisten = history.listen((location) => {
      // console.log('history change', history.location.pathname);
      clearTimeout(locationTimeout.current);
      let skipTimeout = false;
      if (!!location.state && location.state === "skipTimeout") {
        skipTimeout = true;
      }

      if (!skipTimeout) {
        setTransition(true);
      }
      locationTimeout.current = setTimeout(
        () => {
          if (isMounted) {
            setLocation({
              pathname: location.pathname,
              state: "",
              search: "",
              hash: "",
            });
            setMenuOpen(false);
            transitionTimeout.current = setTimeout(
              () => isMounted && setTransition(false),
              skipTimeout ? 0 : 300
            );
          }
        },
        skipTimeout ? 0 : tTransition
      );
    });

    return () => {
      isMounted = false;
      unlisten();
      clearTimeout(locationTimeout.current);
      clearTimeout(transitionTimeout.current);
    };
  }, [history]);

  const handleHeaderReady = () => {
    // setLoading(false);
  };

  return (
    <div className={classNames("app", { "is-menu-open": menuOpen })}>
      {/* SEO: per-route title, description and canonical tag */}
      <Seo pathname={routerLocation.pathname} />
      <Burger isOpen={menuOpen} onClick={() => setMenuOpen(!menuOpen)} />
      {/* TOPBAR */}
      <Topbar
        doFade={location?.pathname !== "/our-story"}
        menuOpen={menuOpen}
      />
      {/* MENU */}
      <Menu isOpen={menuOpen} />
      {/* HEADER */}
      <Header pathname={location?.pathname} onReady={handleHeaderReady} />
      {/* LOADER */}
      {/* <Loader isVisible={isLoading} /> */}
      {/* COOKIE NOTICE */}
      <CookieNotice />
      {/* TRANSITION */}
      <Transition isOpen={transition || menuOpen} duration={tTransition} />
      {/* CONTENT */}
      <Scroll pathname={location.pathname}>
        <Switch location={location}>
          <Route path={ROUTES.Home} component={Home} exact />
          <Route path={ROUTES.Jets} component={Jets} />
          <Route path={ROUTES.Experience} component={Experience} />
          <Route path={ROUTES.Career} component={Career} />
          <Route path={ROUTES.Sponsoring} component={Sponsoring} />
          <Route path={ROUTES.Story} component={Story} />
          <Route path={ROUTES.Imprint} component={Legal} />
          <Route path={ROUTES.PrivacyPolicy} component={Legal} />
          <Redirect to={ROUTES.Home} />
        </Switch>
      </Scroll>
    </div>
  );
};

export default App;