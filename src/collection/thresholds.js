import { Collection } from "backbone";
import Threshold from "./../model/threshold";
export default Collection.extend({
  model: Threshold,
  comparator(m1, m2) {
    let time1 = m1.getFrom();
    let time2 = m2.getFrom();
    time1 = time1 === "" ? 24 : ~~time1;
    time2 = time2 === "" ? 24 : ~~time2;
    return time1 > time2 ? 1 : 0;
  },
  export() {
    let res = [];
    this.sortBy(model => {
      let start = model.getFrom();
      start = start === "" ? 24 : ~~start;
      return start;
    }).forEach(model => {
      let from = model.get("from");
      let to = model.get("to");
      let item = [
        model.get("operator"),
        model.get("threshold").replace(/\s+$/g, "")
      ];
      item = (to !== "" && from !== "" ? ["(", from, to, ")"] : [""]).concat(
        item
      );
      res.push(item.join(" "));
    });
    console.log(res);
    return res
      .join(",")
      .replace(/\(\s/g, "(")
      .replace(/\s\)/g, ")")
      .replace(/\s{2,}/g, " ")
      .replace(/\s,/g, ",");
  }
});
