export default function(Constructor) {
  return function(option, ...args) {
    let { components, instanceName, props, state, parentState } = option;
    let instance = null;
    if (!(instance = components[instanceName])) {
      instance = components[instanceName] = new Constructor(option, ...args);
    }
    return instance.tpl(props || {}, state || {}, parentState);
  };
}
