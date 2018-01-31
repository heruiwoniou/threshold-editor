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
      <div className="threshold-editor__timeline" style={{ display: list.length == 0 ? 'none' : 'block' }}>
        <div className="threshold-editor__time-panel">
          {_.range(12).map(hours => {
            return <span>{2 + hours * 2 + ":00"} &nbsp;</span>;
          })}
        </div>
        <div className="threshold-editor__timebar-container">
          {_.map(list, (model, i) => {
            let isallday = model.isallday();
            let from = ~~model.getFrom() * 100 / 24 + "%"
            let to = (24 - ~~model.getTo()) * 100 / 24 + "%"
            let editing = model.get("editing")
            let zIndex = editing ? list.length : i;
            let barStyle = isallday
              ? { width: "100%" }
              : {
                left: from,
                right: to
              };
            barStyle.zIndex = zIndex;
            if (model.getIsAcrossTheDay()) {
              return (
                <div className={
                  "threshold-editor__timebar is-across-the-day " +
                  colors[list.length - 1 - i] +
                  (editing ? " is-editing" : "")
                } style={{ zIndex }}>
                  <div className="threshold-editor__timebar__child" style={{ left: 0, right: to }}></div>
                  <div className="threshold-editor__timebar__child" style={{ right: 0, left: from }}></div>
                </div>
              )
            } else {
              return (
                <div
                  className={
                    "threshold-editor__timebar " +
                    colors[list.length - 1 - i] +
                    (isallday ? " is-allday" : "") +
                    (editing ? " is-editing" : "")
                  }
                  style={barStyle}
                />
              );
            }
          })}
        </div>
      </div>
    );
  }
});

export default Component(TimeLineConstructor);
