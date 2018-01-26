import { View } from "backbone";
import h from "virtual-dom/h";
import createElement from "virtual-dom/create-element";
import diff from "virtual-dom/diff";
import patch from "virtual-dom/patch";

export default View.extend({
  // virtual tree
  tree: null,
  // real dom
  treeNode: null,
  // virtual render
  tpl() {},
  initializeRender() {
    this.tree = this.tpl(this);
    this.treeNode = createElement(this.tree);
    return this.updateRender;
  },
  updateRender() {
    let newTree = this.tpl(this);
    var patches = diff(this.tree, newTree);
    this.treeNode = patch(this.treeNode, patches);
    this.tree = newTree;
  },
  triggerRender() {
    this.triggerRender = this.initializeRender();
    this.$el.html(this.treeNode);
  },
  render() {
    this.triggerRender();
  }
});
