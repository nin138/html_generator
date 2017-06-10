import {ViewController} from "./controller/view_controller";
import {Project} from "./project";
import {Setting} from "./setting/setting";
export class EventController {
  private project: Project;
  constructor(
    private view_controller: ViewController,
    private setting: Setting
  ) {
    this.init();
  }

  public load_project(project: Project) {
    this.project = project;
    this.view_controller.set_project(project);
  }
  private init() {

  }

}