import { Model, Collection } from "backbone";
import h from "virtual-dom/h";
import createElement from "virtual-dom/create-element";
import ViewModel from "./../common/view-model";

import EditorRow from "./components/EditorRow.jsx";
import Threshold from "./../model/threshold";

const State = Model.extend({
  defaults: {
    selectIndex: -1,
    globalClickCancel: false
  }
});

const Editor = ViewModel.extend({
  initialize() {
    $(document).on("click", e => {
      if (!this.globalClickCancel) {
        this.model.set("selectIndex", -1);
      }
      this.globalClickCancel = false;
    });
    this.listenTo(this.model, "change", this.render);
    this.listenTo(this.collection, "add remove change", this.render);
    this.render();
  },
  tpl() {
    return (
      <div className="threshold-editor" id={"threshold-editor-" + this.cid}>
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
        <div className="threshold-editor__body">
          {this.collection.map((model, i) => {
            return (
              <EditorRow
                {...{
                  state: {
                    index: i,
                    selected: this.model.get("selectIndex", i) == i
                  },
                  parentState: this,
                  model,
                  components: this.components,
                  instanceName: "component-" + model.cid
                }}
              />
            );
          })}
        </div>
      </div>
    );
  },
  itemClick(i) {
    this.globalClickCancel = true;
    this.model.set("selectIndex", i);
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
    if (value === "") {
      model.set("from", "");
      model.set("to", "");
    } else {
      model.set("to", value === "" ? "" : value + ":00");
      if (model.get("from") == "") model.set("from", "00:00");
    }
  },
  globalClick() {
    alert(1);
  }
});

export default function(option, ...args) {
  option.model = new State();
  return new Editor(option, ...args);
}
