import TextImage from "components/textImage/textImage";
import Facts from "components/facts/facts";
import Quote from "components/quote/quote";
import Fullsize from "components/fullsize/fullsize";
import Gallery from "components/gallery/gallery";
import Magazine from "components/magazine/magazine";
import Statement from "components/statement/statement";

export interface loopItemProps {
  type: string;
  data: any;
}

interface loopProps {
  loop: Array<loopItemProps>;
}

const Loop: React.FC<loopProps> = (props) => {
  const switchComp = (item: loopItemProps, key: number) => {
    let comp = null;
    switch (item.type) {
      case "textImage":
        comp = <TextImage {...item.data} key={key} />;
        break;

      case "facts":
        comp = <Facts {...item.data} key={key} />;
        break;

      case "quote":
        comp = <Quote {...item.data} key={key} />;
        break;

      case "fullsize":
        comp = <Fullsize {...item.data} key={key} />;
        break;

      case "gallery":
        comp = <Gallery {...item.data} key={key} />;
        break;

      case "magazine":
        comp = <Magazine {...item.data} key={key} />;
        break;

      case "statement":
        comp = <Statement {...item.data} key={key} />;
        break;
    }
    return comp;
  };

  return <>{props.loop.map((item, key) => switchComp(item, key))}</>;
};

export default Loop;
