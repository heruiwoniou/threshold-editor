import { Model } from "backbone";
import h from "virtual-dom/h";
import createElement from "virtual-dom/create-element";
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
const colors = [
  "purple",
  "light-blue",
  "green",
  "blue",
  "magenta",
  "bright-green"
];
const EditorRowConstructor = ViewModel.extend({
  tpl(props, state, parentState) {
    let isallday = this.model.getFrom() === "" && this.model.getTo() === "";
    return (
      <div
        className={
          state.selected
            ? "threshold-editor__single-rules threshold-editor__single-rules--active"
            : "threshold-editor__single-rules"
        }
      >
        <div
          className="threshold-editor__trigger--itemclick"
          onclick={() => parentState.itemClick(state.index)}
        >
          <span
            className={
              "threshold-editor__color-tab threshold-editor__color-tab--" +
              colors[state.index % colors.length]
            }
          />
          <div className="threshold-editor__row threshold-editor__list">
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
                        ? "threshold-editor__col-10"
                        : "threshold-editor__col-5"
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
                    <div className="threshold-editor__col-5">
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
                        <option value="" selected={this.model.getTo() === ""}>
                          all day
                        </option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="threshold-editor__col-2">
              <b>when the ErrorSystem</b>
            </div>
            <div className="threshold-editor__col-1">
              <select>
                <option value="value">value</option>
                <option value="delta">delta</option>
              </select>
            </div>
            <div className="threshold-editor__col-2">
              <select>
                {[
                  [">", "is greater than (>)"],
                  ["<", "is less than (<)"],
                  ["=", "is equa l to (=)"]
                ].map(([value, text]) => {
                  return (
                    <option
                      value={value}
                      selected={value === this.model.get("operator")}
                    >
                      {text}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="threshold-editor__col-3 ">
              {this.model.getThreshold(state.selected ? 3 : 1).map((o, i) => {
                return (
                  <div className="threshold-editor__threshold-container">
                    <div className="threshold-editor__threshold__value">
                      <input type="text" />
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
          </div>
        </div>
        {state.selected ? (
          <a
            href="javascript:;"
            className="threshold-editor__delete"
            onclick={() => parentState.removeItem(this.model, state.index)}
          />
        ) : (
          ""
        )}
      </div>
    );
  }
});

export default Component(EditorRowConstructor);
