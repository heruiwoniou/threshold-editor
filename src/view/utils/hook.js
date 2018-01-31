import nextTick from 'next-tick'
export function AsyncValHook(value) {
  if (!(this instanceof AsyncValHook)) {
    return new AsyncValHook(value);
  }
  this.value = value;
}

AsyncValHook.prototype.hook = function (node) {
  nextTick(() => {
    node.value = this.value;
  })
}

AsyncValHook.prototype.unhook = function (node) {
  node.value = ""
}

AsyncValHook.prototype.type = 'AsyncValHook';