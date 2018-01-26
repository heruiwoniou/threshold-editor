import { Model } from "backbone";
import h from "virtual-dom/h";
import createElement from "virtual-dom/create-element";
import ViewModel from "./views/ViewModel";

export const DataModel = Model.extend({
  defaults: {
    text: "Hello, World!"
  }
});

export const HomeView = ViewModel.extend({
  el: "body",
  initialize: function() {
    this.model.on("change", this.render, this);
    this.render();
  },
  tpl() {
    return (
      <div className="Text" onclick={() => this.toClick()}>
        <span>{this.model.get("text")}</span>
      </div>
    );
  },
  toClick() {
    this.model.set("text", "hellow-----" + Math.random() * 1e3);
  }
});
