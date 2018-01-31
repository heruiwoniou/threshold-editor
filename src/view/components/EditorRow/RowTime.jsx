import { Model } from "backbone";
import h from "virtual-dom/h";
import ViewModel from "./../../../common/view-model";
import Component from "./../../../common/component";
import _ from "underscore";

const TimeConstructor = ViewModel.extend({
  tpl(props, state, parentState) {
    let isallday = this.model.isallday();
    return (
      <span>
        <div className="threshold-editor__col-2 threshold-editor__list--occupy-container">
          <div
            className={
              isallday
                ? "threshold-editor__list--occupy is-allday"
                : "threshold-editor__list--occupy"
            }
          >
            <div className="threshold-editor__row">
              <div
                className={
                  isallday
                    ? "threshold-editor__col-10 threshold-editor__list--padding"
                    : "threshold-editor__col-5 threshold-editor__list--padding"
                }
              >
                <select
                  onchange={e =>
                    parentState.fromChange(this.model, e.target.value)
                  }
                >
                  {_.range(24).map((o, i) => {
                    let hours =
                      i.toString().length >= 2 ? i.toString() : "0" + i;
                    let t = "00:00".replace(/00/, hours);
                    return (
                      <option
                        value={hours}
                        {...{ selected: this.model.getFrom() === hours }}
                      >
                        {t}
                      </option>
                    );
                  })}
                  <option
                    value=""
                    {...{ selected: this.model.getFrom() === "" }}
                  >
                    all day
                  </option>
                </select>
              </div>
              {isallday ? (
                ""
              ) : (
                <div className="threshold-editor__col-5 threshold-editor__list--padding">
                  <select
                    onchange={e =>
                      parentState.toChange(this.model, e.target.value)
                    }
                  >
                    {_.range(24).map((o, i) => {
                      let hours =
                        i.toString().length >= 2 ? i.toString() : "0" + i;
                      let t = "00:00".replace(/00/, hours);
                      return (
                        <option
                          value={hours}
                          selected={this.model.getTo() === hours}
                        >
                          {t}
                        </option>
                      );
                    })}
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>
      </span>
    );
  }
});

export default Component(TimeConstructor);
