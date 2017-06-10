import {View, color_theme} from "./view";


export class IFrame extends View{
  init() {
    this.set_element("iframe-area", color_theme.primary);
  }
}
export class TopMenu extends View{
  init() {
    this.set_element("top-menu-area", color_theme.primary);
  }
}
export class Tab extends View{
  init() {
    this.set_element("top-tab-area", color_theme.primary);
  }
}
export class Tree extends View {
  init() {
    this.set_element("tree-area", color_theme.secondary);
  }
}
export class Edit extends View {
  init() {
    this.set_element("edit-area", color_theme.secondary);
  }
}
