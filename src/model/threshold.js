import { Model } from "backbone";

const regex = /^(\d*)\s*(\d*)\s*(\d*)$/;
const rules = /\((\d{2}:\d{2}\s*\d{2}:\d{2})\)\s*([><=])\s*(\d*\s*\d*\s*\d*)|(\s*)([><=])\s*(\d*\s*\d*\s*\d*)/;
export const analysis = function(str) {
  let mathes = rules.exec(str);
  let time = mathes[1] || mathes[4];
  let times = time.split(" ");
  let operator = mathes[2] || mathes[5];
  let threshold = mathes[3] || mathes[6];
  let instance = new Threshold({
    from: times.length == 2 ? times[0] : "",
    to: times.length == 2 ? times[1] : "",
    operator,
    threshold
  });
  window[instance.cid] = instance;
  return instance;
};
const Threshold = Model.extend({
  defaults: {
    from: "",
    to: "",
    operator: ">",
    threshold: ""
  },
  getFrom() {
    return this.get("from").split(":")[0];
  },
  getTo() {
    return this.get("to").split(":")[0];
  },
  getThreshold(l = 3) {
    let res = /^(\d*)\s*(\d*)\s*(\d*)$/.exec(this.get("threshold"));
    return res.slice(1, 1 + l);
  }
});

export default Threshold;
