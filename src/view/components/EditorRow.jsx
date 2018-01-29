import { Model } from "backbone";
import h from "virtual-dom/h";
import ViewModel from "./../../common/view-model";
import Component from "./../../common/component";
import _ from "underscore";

import { colors } from './../utils/colors'
import Time from "./Time.jsx";
import Comparison from "./Comparison.jsx";
import Alert from "./Alert.jsx";

const EditorRowConstructor = ViewModel.extend({
  tpl(props, state, parentState) {
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
              "threshold-editor__color-tab " +
              colors[state.index % colors.length]
            }
          />
          <div className="threshold-editor__row threshold-editor__list">
            <Time
              {...{
                state,
                parentState,
                model: this.model,
                components: parentState.components,
                instanceName: "component-time-" + this.cid
              }}
            />
            <Comparison
              {...{
                state,
                parentState,
                model: this.model,
                components: parentState.components,
                instanceName: "component-comparison-" + this.cid
              }}
            />
            <Alert
              {...{
                state,
                parentState,
                model: this.model,
                components: parentState.components,
                instanceName: "component-alert-" + this.cid
              }}
            />
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
