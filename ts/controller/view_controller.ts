import {IFrame, TopMenu, Tab, Edit, Tree} from "../view/iframe";
import {Setting} from "../setting/setting";
import {Project} from "../project";
import {Project_manager} from "../view/project_manager";
export class ViewController {
  public setting: Setting;
  private iframe: IFrame;
  private top_menu: TopMenu;
  private tab: Tab;
  private edit: Edit;
  private tree: Tree;
  private project_manager: Project_manager;
  private project: Project;

  constructor(setting) {
    this.setting = setting;
    this.iframe = new IFrame(this);
    this.top_menu = new TopMenu(this);
    this.tab = new Tab(this);
    this.edit = new Edit(this);
    this.tree = new Tree(this);
    this.project_manager = new Project_manager(this);
    this.setting.on_color_theme_change();
  }
  public set_project(project: Project) {
    this.project = project;
    this.project_manager.set_project(project);
  }
}