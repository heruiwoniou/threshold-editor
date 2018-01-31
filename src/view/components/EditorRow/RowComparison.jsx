import { Model } from "backbone";
import h from "virtual-dom/h";
import ViewModel from "./../../../common/view-model";
import Component from "./../../../common/component";
import _ from "underscore";

const ComparisonConstructor = ViewModel.extend({
  tpl(props, state, parentState) {
    return (
      <span>
        <div className="threshold-editor__col-2 threshold-editor__list--padding">
          <b>when the ErrorSystem</b>
        </div>
        <div className="threshold-editor__col-1 threshold-editor__list--padding">
          <select>
            <option value="value">value</option>
            <option value="delta">delta</option>
          </select>
        </div>
        <div className="threshold-editor__col-2 threshold-editor__list--padding">
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
      </span>
    );
  }
});

export default Component(ComparisonConstructor);
