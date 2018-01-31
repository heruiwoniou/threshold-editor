import { Model, Collection } from "backbone";
import h from "virtual-dom/h";
import createElement from "virtual-dom/create-element";
import ViewModel from "./../common/view-model";

import Threshold from "./../model/threshold";
import EditorRow from "./components/EditorRow";
import TimeLine from "./components/TimeLine.jsx";

let globalClickCancel = false;
const Editor = ViewModel.extend({
  initialize() {
    $(document).on("click", e => {
      if (!globalClickCancel) {
        this.collection.forEach(model => model.set("editing", false));
      }
      globalClickCancel = false;
    });
    this.listenTo(this.model, "change", this.render);
    this.listenTo(this.collection, "add remove change", this.render);
    this.render();
  },
  tpl() {
    return (
      <div className="threshold-editor" id={"threshold-editor-" + this.cid}>
        <div className="threshold-editor__body">
          <div className="threshold-editor__row threshold-editor__header">
            <div className="threshold-editor__col-1">
              From
              <span className="threshold-editor__split" />
            </div>
            <div className="threshold-editor__col-1">
              Until
              <span className="threshold-editor__split" />
            </div>
            <div className="threshold-editor__col-5">
              Comparison
              <span className="threshold-editor__split" />
            </div>
            <div className="threshold-editor__col-3">Alerts</div>
          </div>
          <div className="threshold-editor__row threshold-editor__control">
            <div className="threshold-editor__col-10">
              <a
                href="javascript:;"
                className="threshold-editor__button threshold-editor__button--add"
                onclick={() => this.addNewItem()}
              >
                add a new threshold (+)
              </a>
            </div>
          </div>
          <div className="threshold-editor__content">
            {this.collection
              .sortBy(model => {
                let start = model.getFrom();
                start = start === "" ? 24 : ~~start;
                return start;
              })
              .map((model, i) => {
                return (
                  <EditorRow
                    {...{
                      state: {
                        index: i,
                        selected: model.get("editing")
                      },
                      parentState: this,
                      model,
                      components: this.components,
                      instanceName: "component-editor-row" + model.cid
                    }}
                  />
                );
              })}
          </div>
        </div>
        <TimeLine
          {...{
            parentState: this,
            collection: this.collection,
            components: this.components,
            instanceName: "component-time-line" + this.cid
          }}
        />
      </div>
    );
  },
  itemClick(model) {
    globalClickCancel = true;
    model.set("editing", true);
    this.collection
      .filter(o => o.cid !== model.cid)
      .forEach(model => model.set("editing", false));
  },
  addNewItem() {
    this.collection.add(new Threshold());
  },
  removeItem(model, index) {
    if (this.model.get("selectIndex") == index) {
      this.model.set("selectIndex", -1);
    }
    this.collection.remove(model);
  },
  fromChange(model, value) {
    if (value === "") {
      model.set("from", "");
      model.set("to", "");
    } else {
      model.set("from", value === "" ? "" : value + ":00");
      if (model.get("to") == "") model.set("to", "00:00");
    }
  },
  toChange(model, value) {
    model.set("to", value === "" ? "" : value + ":00");
  },
  thresholdChange(model, index, value) {
    switch (index) {
      case 0:
        model.setFirst(value);
        break;
      case 1:
        model.setSecond(value);
        break;
      case 2:
        model.setThree(value);
        break;
    }
  }
});

export default function(...args) {
  return new Editor(...args);
}
