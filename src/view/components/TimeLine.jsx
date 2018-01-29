import { Model } from "backbone";
import h from "virtual-dom/h";
import ViewModel from "./../../common/view-model";
import Component from "./../../common/component";
import _ from "underscore";

import { colors } from "./../utils/colors";

const TimeLineConstructor = ViewModel.extend({
  tpl(props, state, parentState) {
    return (
      <div className="threshold-editor__timeline">
        <div className="threshold-editor__time-panel">
          {_.range(12).map(hours => {
            return <span>{2 + hours * 2 + ":00"} &nbsp;</span>;
          })}
        </div>
        <div className="threshold-editor__timebar-container">
          {this.collection.map((model, i) => {
            let isallday = model.isallday();
            let barStyle = isallday
              ? { width: "100%" }
              : {
                  left: ~~model.getFrom() * 100 / 24 + "%",
                  right: (24 - ~~model.getTo()) * 100 / 24 + "%"
                };
            barStyle.zIndex = this.collection.length - i;
            return (
              <div
                className={
                  "threshold-editor__timebar " +
                  colors[i] +
                  (isallday ? " is-allday" : "")
                }
                style={barStyle}
              />
            );
          })}
        </div>
      </div>
    );
  }
});

export default Component(TimeLineConstructor);
