import {Html} from "../entity/html";
export class HtmlBuilder {
    private path_;
    private name_;
    private elements_;
    constructor() {
    }
    path(path) {
        this.path_ = path;
        return this;
    }
    name(name) {
        this.name_ = name;
        return this;
    }
    elements(arr) {
        this.elements_ = arr;
        return this;
    }
    build() {
        const html = new Html(this.path_, this.name_);
        if(this.elements_) {
            for (let el of this.elements_) {
                html.add_element(el);
            }
        }
        return html;
    }
}