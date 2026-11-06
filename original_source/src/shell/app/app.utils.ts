import { ROUTES } from "constants/routes";
import { VIEWPORT } from "constants/viewport";

export const assetPath = (url: string) => {
  if (url.startsWith("bucket:/")) {
    if (process.env.NODE_ENV === 'development') {
      return url.replace("bucket:/", process.env.PUBLIC_URL + "/content/")
    }
    return url.replace("bucket:/", "https://content.flyplatoon.com/website/")
  }

  return process.env.PUBLIC_URL + url
}

export const clamp = (val: number, valMin: number = 0, valMax: number = 1) => {
  let valReturn = val;
  if (valReturn < valMin) {
    valReturn = valMin;
  } else if (valReturn > valMax) {
    valReturn = valMax;
  }
  return valReturn;
}

// start, target, progress
export const lerp = (a: number, b: number, n: number) => (1 - n) * a + n * b;

export const getRouteWithPathname = (pathname: string) => {
  let route: String = Object.keys(ROUTES)
    .filter((item) => ROUTES[item as keyof typeof ROUTES] === pathname)
    .join(",");
  return route.toString();
}

export const getRouteWithKey = (routeKey: string) => {
  return ROUTES[routeKey as keyof typeof ROUTES];
}

export const isMobileVP = () => {
  return window.innerWidth < VIEWPORT.Desktop;
}

export const vpY = (el: HTMLObjectElement, debug: boolean = false) => {
  const box = el.getBoundingClientRect();
  const vpMax = window.innerHeight + box.height;
  const vpY = (box.top + box.height) / vpMax;
  return vpY;
}

export const vpYstacked = (el: HTMLObjectElement, debug: boolean = false) => {
  const box = el.getBoundingClientRect();
  const vpMax = window.innerHeight;
  const vpY = (box.top) / vpMax;
  !debug && console.log(vpY);
  return vpY;
}

export const vpTop = (el: HTMLObjectElement, debug: boolean = false) => {
  const box = el.getBoundingClientRect();
  const vpY = (window.innerHeight - box.top) / box.height;
  return vpY;
}

export const vpTop2 = (el: HTMLObjectElement, debug: boolean = false) => {
  const box = el.getBoundingClientRect();
  const vpY = (window.innerHeight - box.top) / box.height;
  return vpY;
}

