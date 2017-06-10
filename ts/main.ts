import { Project } from './project';
import {ViewController} from "./controller/view_controller";
import {Setting} from "./setting/setting";
import {save_data} from  "./save_data";
import {EventController} from "./event_controller";
window.addEventListener("contextmenu", (ev)=> { ev.preventDefault() });
window.addEventListener("load", () => {
  const settings = Setting.get_instance();
  settings.load_settings(save_data.settings);
  const project: Project = new Project(save_data.project);
  const view_controller = new ViewController(settings);
  const ev_controller = new EventController(view_controller, settings);
  ev_controller.load_project(project);
  console.log(project);
  console.log(view_controller);
});
