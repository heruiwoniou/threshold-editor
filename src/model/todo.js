import Backbone from "backbone";

const KEY = "todos-backbone";

let Todo = Backbone.Model.extend({
  toJson() {
    let json = Backbone.Model.prototype.toJSON.call(this);
    json.cid = this.cid;
    return json;
  }
});

let Todos = Backbone.Collection.extend({
  model: Todo,
  initialize() {
    let store = localStorage.getItem(KEY);
    if (store) {
      store = JSON.parse(store);
      this.set(store);
    }
    this.on("add", this.store, this);
    this.on("change", this.store, this);
  },
  store() {
    let json = JSON.stringify(this.toJSON());
    localStorage.setItem(KEY, json);
  }
});
