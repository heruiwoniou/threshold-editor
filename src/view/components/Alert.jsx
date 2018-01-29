import { Model } from "backbone";
import h from "virtual-dom/h";
import ViewModel from "./../../common/view-model";
import Component from "./../../common/component";
import _ from "underscore";

const tips = [
  {
    className: "threshold-editor__note threshold-editor__note--warn",
    text: "trigger a warning"
  },
  {
    className: "threshold-editor__note threshold-editor__note--error",
    text: "trigger an error"
  },
  {
    className: "threshold-editor__note threshold-editor__note--critical",
    text: "trigger a critical"
  }
];

const AlertConstructor = ViewModel.extend({
  tpl(props, state, parentState) {
    let thresholds = this.model.getThreshold();
    let l = _.filter(thresholds, o => !!o).length;
    let inputList = state.selected
      ? thresholds.slice(0, 3)
      : thresholds.slice(0, l == 0 ? 1 : l);
    return (
      <span>
        <div className="threshold-editor__col-3 threshold-editor__list--padding">
          {inputList.map((o, i) => {
            return (
              <div className="threshold-editor__threshold-container">
                <div className="threshold-editor__threshold__value">
                  <input
                    type="number"
                    value={inputList[i]}
                    onchange={({ target: { value } }) =>
                      parentState.thresholdChange(this.model, i, value)
                    }
                  />
                </div>
                <div className="threshold-editor__threshold__tip">
                  <span className={tips[i].className}>
                    {tips[i].text}
                    <i />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </span>
    );
  }
});

export default Component(AlertConstructor);
