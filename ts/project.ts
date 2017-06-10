import {HtmlBuilder} from "./builder/html_builder";
import {Html} from "./entity/html";
/**
 * Created by yano.kunpei on 2017/05/14.
 */
export class ProjectBuilder {
  constructor() {}
  build() {
  }
}


export class Project {
  private project_name: string;
  private html;
  private lib;
   constructor(data) {
     this.html = {};
     this.init(data);
   }
   get_html(): Html[] {
     return this.html;
   }
   get_project_name(): string {
     return this.project_name;
   }
  private init(data) {
     this.project_name = data.project_name;
    for(const html of data.html) {
      this.add_html(html);
    }
  }
  protected add_html(data) {
    const builder = new HtmlBuilder();
    this.html[data.path + "/" + data.name] = builder.path(data.path)
      .name(data.name)
      .elements(data.elements)
      .build();
  }
}