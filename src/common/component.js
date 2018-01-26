export default function(Constructor) {
  return function(...args) {
    return new Constructor(...args).tpl();
  };
}
