import {Project} from "../project";
import {color_theme, View} from "./view";
import {Html} from "../entity/html";
import {Util} from "../util";
import {Setting} from "../setting/setting";
import {Alert, AlertButtons} from "../alert";

export class Project_manager extends View{
  private project: Project;
  private root_folder: Folder;
  init() {
    this.set_element("project-folder-area", color_theme.secondary);
    new Alert()
      .title("a")
      .message("bwfe")
      .button(AlertButtons.YES_NO)
      .checkbox('foo')
      .input('hoge')
      .callback((t, i, c)=> {
        console.log(t);
        console.log(i);
        console.log(c);})
      .create()
      .show();
  }
  set_project(project: Project) {
    this.project = project;
    this.root_folder = new Folder(this, this.project.get_project_name());
    this.root_folder.on_click();
    const html_list = project.get_html();
    for(let html in html_list) {
      this.add_html(html_list[html]);
    }
  }
  private add_html(html: Html) {
    let parent = this.root_folder;
    const paths = html.get_path().split("/");
    for(const path of paths) {
      if(!parent.is_exist(path)) { parent.add_folder(path) }
      parent = parent.child(path);
    }
    parent.add_file(html.get_name(), "html");
  }
}
class RightClickView {
  private element = document.createElement('div');
  private active_view;
  private static types = {
    any: ["delete", "rename"],
    folder: ["new"],
    html: [],
  };
  private is_open = false;
  private static instance = new RightClickView();
  static get_instance() {
    return RightClickView.instance;
  }
  private constructor() {
    this.element.className = "right-click-view";
    document.body.appendChild(this.element);
    Setting.get_instance().color_accent(this.element);
    this.element.addEventListener('click', (ev)=> { this.on_click(ev) });
  }
  private on_click(ev) {
    this.active_view.on_menu_event(ev.target.getAttribute("data-ev"));
  }
  open(view: ProjectManagerItem, ev: MouseEvent) {
    if(this.is_open) this.close();
    this.element.style.display = "block";
    this.active_view = view;
    this.create_view(view.get_type());
    const point = Util.get_point(ev);
    ev.stopPropagation();
    ev.preventDefault();
    this.element.style.left = point.x + "px";
    this.element.style.top = point.y + "px";
    this.is_open = true;
    window.addEventListener('click', ()=> { this.close(); });
    window.addEventListener('contextmenu', ()=> { this.close(); });
  }
  close() {
    this.active_view.on_blur();
    this.element.style.display = "none";
    this.is_open = false;
    window.removeEventListener('click', ()=> { this.close(); });
    window.removeEventListener('contextmenu', ()=> { this.close(); });
  }
  private create_view(type) {
    this.element.innerHTML = "";
    const list = RightClickView.types.any.concat(RightClickView.types[type]);
    list.forEach(value => {
      const el = document.createElement("p");
      el.className = "right-click-view-item";
      el.textContent = value;
      el.setAttribute("data-ev", value);
      this.element.appendChild(el);
    });
  }
}
interface ProjectManagerItem {
  get_type()
  on_right_click(ev)
  on_blur()
}
class Folder implements ProjectManagerItem {
  private type;
  private parent;
  private full_path;
  private path;
  private name;
  private children;
  private element: HTMLElement;
  private arrow_element;
  private name_element;
  private is_open = false;
  constructor(parent , name: string) {
    this.type = "folder";
    this.parent = parent;
    this.path = parent.full_path || ""; // when root
    this.name = name;
    this.full_path = this.path + "/" + name;
    this.children = {};
    this.element = document.createElement("div");
    this.element.className = "folder";
    this.arrow_element = document.createElement("span");
    this.arrow_element.innerHTML = "▼";
    this.arrow_element.className = "folder-arrow";
    this.element.appendChild(this.arrow_element);
    this.name_element = document.createElement("span");
    this.name_element.className = "folder-name";
    this.name_element.innerHTML = this.name;
    this.element.appendChild(this.name_element);
    this.arrow_element.addEventListener("click", this.on_click.bind(this));
    this.name_element.addEventListener("click", this.on_click.bind(this));
    this.arrow_element.addEventListener("contextmenu", this.on_right_click.bind(this));
    this.name_element.addEventListener("contextmenu", this.on_right_click.bind(this));
    this.parent.element.appendChild(this.element);
  }
  get_type() { return this.type; }
  rename() {

  }
  on_right_click(ev) {
    RightClickView.get_instance().open(this, ev);
    this.name_element.style.background = "rgba(0, 0, 255, .5)";
  }
  on_blur() {
    this.name_element.style.background = "";
  }
  on_click() {
    if (this.is_open) {
      this.element.style.height = "1rem";
      this.arrow_element.style.transform = "rotate(-90deg)";
    } else {
      this.element.style.height = "auto";
      this.arrow_element.style.transform = "rotate(0deg)";
    }
    this.is_open = !this.is_open;
  }
  is_exist(name): boolean {
    return (this.children[name]);
  }
  child(name) { return this.children[name]; }
  add_folder(name) {
    if(!this.is_exist(name))this.children[name] = new Folder(this, name);
  }
  add_file(name, type) {
    if(!this.is_exist(name))this.children[name] = new File(this, name, type);
  }
}
class File implements ProjectManagerItem{
  private parent;
  private path;
  private name;
  private full_path;
  private type;
  private element;
  constructor(parent, name, type) {
    this.parent = parent;
    this.name = name;
    this.type = type;
    this.element = document.createElement("div");
    this.path = parent.full_path;
    this.element.innerHTML = this.name + "." + type;
    this.element.className = "file";
    parent.element.appendChild(this.element);
    this.element.addEventListener("contextmenu", this.on_right_click.bind(this));
  }
  get_type() { return this.type }
  on_right_click(ev) {
    this.element.style.background = "rgba(0, 0, 255, .5)";
    RightClickView.get_instance().open(this, ev);
  }
  on_blur() {
    this.element.style.background = "";
  }
}