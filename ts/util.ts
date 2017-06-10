export class Util {
  private constructor() {}
  static get_point(ev: MouseEvent) {
    return new Point(ev.pageX, ev.pageY)
  }
  static ignite_event(element, event) {
    const evt = document.createEvent("HTMLEvents");
    evt.initEvent(event, true, true ); // event type, bubbling, cancelable
    return element.dispatchEvent(evt);
  }
  static create_element(tag: string, class_name?: string, innerHTML?: string, parent?: HTMLElement) {
    const ret = document.createElement(tag);
    if(class_name) ret.className = class_name;
    if(innerHTML) ret.innerHTML = innerHTML;
    if(parent) parent.appendChild(ret);
    return ret;
  }
}
export class Point {
  constructor(public x: number, public y: number) {}
}