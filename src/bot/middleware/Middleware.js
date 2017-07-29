export default class Middleware {
  use(fn) {
    this.go = (stack => next => stack(() => fn.call(this, next)))(this.go);
  }
  go = next => next();
}
