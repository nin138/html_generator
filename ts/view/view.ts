import {ViewController} from "../controller/view_controller";
export enum color_theme {
  primary, secondary, accent
}
export abstract class View {
  protected view_controller: ViewController;
  protected element;
  constructor(view_controller) {
    this.view_controller = view_controller;
    this.init();
  }
  protected set_element(element_id: string, color_type: color_theme) {
    this.element = document.getElementById(element_id);
    switch(color_type) {
      case color_theme.primary:
        this.view_controller.setting.color_primary(this.element);
        break;
      case color_theme.secondary:
        this.view_controller.setting.color_secondary(this.element);
        break;
      case color_theme.accent:
        this.view_controller.setting.color_accent(this.element);
        break;
    }
  }
  abstract init();
}