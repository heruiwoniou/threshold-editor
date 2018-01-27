import { Model, Collection } from "backbone";
import h from "virtual-dom/h";
import createElement from "virtual-dom/create-element";
import ViewModel from "./../common/view-model";
import Component from "./../common/component";

export const DataModel = Model.extend({
  defaults: {
    text: "Hello, World!"
  }
});

export const DataModels = Collection.extend({
  model: DataModel
});

let ListView = Component(
  ViewModel.extend({
    tpl() {
      return (
        <ul>
          {this.collection.map((model, i) => {
            return (
              <li onclick={() => this.toRemove(model)}>{model.get("text")}</li>
            );
          })}
        </ul>
      );
    },
    toRemove(model) {
      this.collection.remove(model);
    }
  })
);

let i = 0;

export const HomeView = ViewModel.extend({
  initialize() {
    this.model ? this.listenTo(this.model, "change", this.render) : null;
    this.listenTo(this.collection, "add remove change", this.render);
    this.render();
  },
  tpl() {
    return (
      <div className="threshold-editor">
        <span onclick={() => this.toClick()}>{this.model.get("text")}</span>
        <ListView {...{ collection: this.collection, components: this.components, instanceName: 'ListView' }}  />
      </div>
    );
  },
  toClick() {
    this.model.set("text", "hellow-----" + Math.random() * 1e3);
    this.collection.add({ text: i++ });
  }
});
