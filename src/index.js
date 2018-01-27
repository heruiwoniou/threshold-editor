import "./style/index.styl";
import _ from "underscore";
import Editor from "./view/editor.jsx";
import Thresholds from "./collection/thresholds";
import { analysis } from "./model/threshold";
export default function(el, datas = "") {
  return new Editor({
    el: el,
    collection: new Thresholds(
      _.chain(datas.split(","))
        .compact()
        .map(o => analysis(o))
        .value()
    )
  });
}
