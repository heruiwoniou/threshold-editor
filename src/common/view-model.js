import { View } from "backbone";
import h from "virtual-dom/h";
import createElement from "virtual-dom/create-element";
import diff from "virtual-dom/diff";
import patch from "virtual-dom/patch";

let ViewModel = View.extend({
  // virtual tree
  tree: null,
  // real dom
  treeNode: null,
  timer: null,
  components: {},
  // virtual render,
  tpl() { },
  initializeRender() {
    this.tree = this.tpl(this);
    this.treeNode = createElement(this.tree);
    return this.updateRender;
  },
  updateRender() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      let newTree = this.tpl(this);
      var patches = diff(this.tree, newTree);
      this.treeNode = patch(this.treeNode, patches);
      this.tree = newTree;
    }, 0);
  },
  triggerRender() {
    this.triggerRender = this.initializeRender();
    this.$el.replaceWith(this.treeNode);
  },
  render() {
    this.triggerRender();
  }
});

export default ViewModel;
