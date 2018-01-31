import { Model } from "backbone";
import _ from "underscore";
const regex = /^([\d\.]*)\s*([\d\.]*)\s*([\d\.]*)$/;
const rules = /\((\d{2}:\d{2}\s*\d{2}:\d{2})\)\s*([><=])\s*(\d*\s*\d*\s*\d*)|(\s*)([><=])\s*(\d*\s*\d*\s*\d*)/;
export const analysis = function (str) {
  let mathes = rules.exec(str);
  let time = mathes[1] || mathes[4];
  let times = time.split(" ");
  let operator = mathes[2] || mathes[5];
  let threshold = mathes[3] || mathes[6];
  return new Threshold({
    from: times.length == 2 ? times[0] : "",
    to: times.length == 2 ? times[1] : "",
    operator,
    threshold
  });
};
const Threshold = Model.extend({
  defaults: {
    from: "",
    to: "",
    operator: ">",
    threshold: "",
    editing: false
  },
  getIsAcrossTheDay() {
    return ~~this.get("from").split(":")[0] > ~~this.get("to").split(":")[0]
  },
  getFrom() {
    return this.get("from").split(":")[0];
  },
  getTo() {
    return this.get("to").split(":")[0];
  },
  getThreshold(l = 3) {
    let res = regex.exec(this.get("threshold"));
    return res.slice(1, 1 + l);
  },
  setFirst(val) {
    let res = regex.exec(this.get("threshold"));
    res = res.slice(1, 4);
    _.each(res, (o, i) => {
      if (i < 1 && o === "") {
        res[i] = val;
      }
    });
    res[0] = val;
    this.set("threshold", res.join(" "));
  },
  setSecond(val) {
    let res = regex.exec(this.get("threshold"));
    res = res.slice(1, 4);
    _.each(res, (o, i) => {
      if (i < 1 && o === "") {
        res[i] = val;
      }
    });
    res[1] = val;
    this.set("threshold", res.join(" "));
  },
  setThree(val) {
    let res = regex.exec(this.get("threshold"));
    res = res.slice(1, 4);
    _.each(res, (o, i) => {
      if (i < 2 && o === "") {
        res[i] = val;
      }
    });
    res[2] = val;
    this.set("threshold", res.join(" "));
  },
  isallday() {
    return this.getFrom() === "" && this.getTo() === "";
  }
});

export default Threshold;
