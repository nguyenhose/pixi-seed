type ActionFuntion = (action: any) => void;

export abstract class BaseHandler {
  protected actionRouter: Map<string, ActionFuntion> = new Map();
  private _handlerName: string;

  constructor() {
    this.actionRouter = new Map();
    this._handlerName = "";
  }

  protected formatString(value: string): string {
    return value.toLocaleUpperCase();
  }

  map(method: string) {
    // this.actionRouter.set(method, this[method]);
  }

  onAction(action: string, message: any) {
    let fn = this.actionRouter.get(action);
    if (fn) {
      fn.call(this, message);
    }
  }

  get handlerName(): string {
    return this._handlerName;
  }

  set handlerName(v: string) {
    this._handlerName = v;
  }
}
