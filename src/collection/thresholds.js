import { Collection } from "backbone";
import Threshold from "./../model/threshold";
export default Collection.extend({
  model: Threshold,
  comparator(m1, m2) {
    let time1 = m1.getFrom();
    let time2 = m2.getFrom();
    time1 = time1 === "" ? 24 : ~~time1;
    time2 = time2 === "" ? 24 : ~~time2;
    return time1 > time2 ? 1 : 0
  }
});
