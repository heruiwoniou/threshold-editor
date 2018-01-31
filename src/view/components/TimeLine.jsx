import { Model } from "backbone";
import h from "virtual-dom/h";
import ViewModel from "./../../common/view-model";
import Component from "./../../common/component";
import _ from "underscore";

import { colors } from "./../utils/colors";

const TimeLineConstructor = ViewModel.extend({
  tpl(props, state, parentState) {
    let self = this;
    let list = [];
    this.collection
      .sortBy(model => {
        let start = model.getFrom();
        start = start === "" ? 24 : ~~start;
        return start;
      })
      .forEach((model, i) => {
        list[this.collection.length - 1 - i] = model;
      });
    return (
      <div className="threshold-editor__timeline">
        <div className="threshold-editor__time-panel">
          {_.range(12).map(hours => {
            return <span>{2 + hours * 2 + ":00"} &nbsp;</span>;
          })}
        </div>
        <div className="threshold-editor__timebar-container">
          {_.map(list, (model, i) => {
            let isallday = model.isallday();
            let barStyle = isallday
              ? { width: "100%" }
              : {
                  left: ~~model.getFrom() * 100 / 24 + "%",
                  right: (24 - ~~model.getTo()) * 100 / 24 + "%"
                };
            barStyle.zIndex = model.get("editing") ? list.length : i;
            return (
              <div
                className={
                  "threshold-editor__timebar " +
                  colors[list.length - 1 - i] +
                  (isallday ? " is-allday" : "")
                }
                style={barStyle}
                onmousedown={function(e) {
                  self.mousedown(e, this, i, list.length + 1);
                }}
              />
            );
          })}
        </div>
      </div>
    );
  },
  mousedown(e, el, oldVal, newVal) {
    if (e.which == 1) {
      el.style.zIndex = newVal;
      let onselectstart = document.onselectstart;
      document.onselectstart = function() {
        return false;
      };
      let onmouseup = () => {
        el.style.zIndex = oldVal;
        document.removeEventListener("mouseup", onmouseup);
        document.onselectstart = onselectstart;
      };
      document.addEventListener("mouseup", onmouseup);
    }
  }
});

export default Component(TimeLineConstructor);
