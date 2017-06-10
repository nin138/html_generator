// /**
//  * Created by yano.kunpei on 2017/05/13.
//  */
// "use strict";
//
//
// function on_page_load() {
//
// }
// function on_project_load() {
//
// }
//
// window.addEventListener("load", _ => {
//     const view_controller = new ViewController();
//     const project = new Project();
//     project.init(save_data);
// });
//
// class NewProjectBuilder {
//     constructor() {
//         this.project = new Project();
//     }
//     set_domain() {
//         return this;
//     }
// }
//
//
// class HtmlBuilder {
//     constructor() {
//         this.html = new Html();
//     }
//     package(name) {
//         this.html.package = name;
//         return this;
//     }
//     name(name) {
//         this.html.name = name;
//         return this;
//     }
//     elements(arr) {
//         for(let el in arr) {
//             this.html.add_element(el);
//         }
//         return this;
//     }
//     build() {
//         return this.html;
//     }
// }
// class Html {
//     constructor() {
//         this.package;
//         this.name;
//         this.id;
//         this.elements = [];
//         this.next_id = 0;
//         this.activeNode;
//     }
//     add_element() {
//         //{"name":"[div] n2","type":"div","css":{"backgroundColor":"#0f3"},"parent":"BODY"}
//
//     }
//
// }
//
// class NodeBuilder {
//     constructor() {
//         this.type;
//     }
//     type(type) {
//         this.type = type;
//         return this;
//     }
//     name(name) {
//         this.name = name;
//         return this;
//     }
//     id(id) {
//         this.id = id;
//         return this;
//     }
//     parent(parent) {
//         this.parent = parent;
//         return this;
//     }
//     build() {
//         let ret;
//         if(type == "text") {
//             ret = new TextNode(this.id, this.name, this.parent);
//             constructor(id, name, parent)
//         } else {
//             if(type == "body") ret = new BodyElement();
//             ret = new Element(this.id, this.type, this.name, this.parent);
//         }
//         return ret
//     }
// }
//
// //Node
// class Node {
//     constructor(id, type, name, parent) {
//         this.id = id;
//         this.type = type;
//         this.name = name;
//         this.parent = parent;
//         // this.tree = new TreeElement(this);
//         this.deleted = false;
//     }
//     remove() {
//         // this.deleted = true;
//         // this.parent.tree.removeChild(this.tree.el);
//     }
//     append() {}
//     insert_before() {}
//     get_editable() {}
// }
//
// class TextNode extends Node {
//     constructor(id, name, parent) {
//         super(id, "textnode", name, parent);
//         this.text = "";
//         this.el = [];
//     }
//     remove() {
//         super.remove();
//         for(let el of this.el) {
//             this.parent.el.removeChild(el);
//         }
//     }
//     append(new_parent) {
//         for(let el of this.el) {
//             new_parent.el.appendChild(el);			//!!!!!!!!!!!!!!!
//             this.parent = new_parent;
//         }
//         // newParent.treeEl.appendChild(this.treeEl);
//     }
//     insert_before() {}		//!!!!!!!!!!!!!!!!!!!!!!!!!
//     set_text(text) {
//         let position = -1;
//         if(this.el.length > 0) {
//             for (let i = 0; i < this.parent.el.childNodes.length; i++) {
//                 if(this.el[0].isEqualNode(this.parent.el.childNodes[i])) position = i;
//             }
//         }
//         for(let el of this.el) this.parent.el.removeChild(el);
//         this.el = [];
//         this.text = text;
//         this.parse_text(text);
//         for(let el of this.el) {
//             if(position === -1) this.parent.el.appendChild(el);
//             else this.parent.el.insertBefore(el, this.parent.el.childNodes[position]);
//             position++;
//         }
//     }
//     parse_text(text) {
//         text = text.replace(/ /g,"\u00a0");
//         text = text.split("\n");
//         for(let t of text) {
//             if(t !== "") this.el.push(iframe.doc.createTextNode(t));
//             this.el.push(iframe.doc.createElement('br'));
//         }
//         this.el.pop();
//     }
//     get_text() {
//         return this.text;
//     }
// }
// class Element extends Node {
//     constructor(id, tag, name, parent) {
//         super(id, type, name, parent);
//         this.css = new CSS();
//         this.type = "element";
//         this.tag = tag;
//         this.el = iframe.doc.createElement(type);
//         this.parent.el.appendChild(this.el);
//         this.el.setAttribute("data-id", id);
//         this.childNodes = [];
//         // this.clssList = [];
//         this.init();
//     }
//     isChild(id) {
//         if(this.id == id) return true;
//         for(let c of this.childNodes) {
//             if(c.id == id) return true;
//             if(c.type != "textnode" && c.isChild(id)) {
//                 return true;
//             }
//         }
//         return false;
//     }
//     appendChild(node) {
//         for(let i = 0; i < node.parent.childNodes.length; i++) {
//             if(node.parent.childNodes[i].id == node.id) {
//                 node.parent.childNodes.splice(i, 1);
//             }
//         }
//         this.addChild(node);
//         if(node.type == "textnode") {
//             for(let el of node.el) { this.el.appendChild(el); }
//         } else this.el.appendChild(node.el);
//         this.tree.appendChild(node.tree.el);
//         node.parent = this;
//     }
//     insertBefore(node, target) {
//         for(let i = 0; i < node.parent.childNodes.length; i++) {
//             if(node.parent.childNodes[i].id == node.id) {
//                 node.parent.childNodes.splice(i, 1);
//             }
//         }
//         for(let i = 0; i < this.childNodes.length; i++) {
//             if(this.childNodes[i].id == target.id) {
//                 this.childNodes.splice(i - 1, 0, node);
//                 break;
//             }
//         }
//         let target_el = (target.type == "textnode")? target.el[0] : target.el;
//         if(node.type == "textnode") {
//             for(let el of node.el) this.el.insertBefore(el, target_el);
//         } else this.el.insertBefore(node.el, target_el);
//         this.tree.insertBefore(node.tree.el, target.tree.el);
//         node.parent = this;
//     }
//     addChild(node) {
//         this.childNodes.push(node);
//     }
//     removeThis() {
//         super.removeThis();
//         for(let c of this.childNodes) {
//             c.removeThis();
//         }
//         this.parent.el.removeChild(this.el);
//     }
//     removeChild(node) {
//         for(let i = 0; i < this.childNodes.length; i++) {
//             if(this.childNodes[i].id == node.id) {
//                 this.childNodes[i].removeThis();
//                 this.childNodes.splice(i, 1);
//             }
//         }
//     }
//     loadCss(css) {
//         for(let atr in css) {
//             this.changeCss(atr, css[atr]);
//         }
//     }
//     changeCss(atr, value) {
//         this.el.style[atr] = value;
//         return this.css.set(atr, value);
//     }
//     getStyle(atr) { //!!!!!!!!!!!!!!
//         return this.css.get(atr);
//     }
//     getEditData() {
//         return this.css.values;
//     }
// }
// class BodyElement extends Node {
//     constructor() {
//         this.el = iframe.body;
//     }
// }
//
//
//
//
//
// class Settings {
//     constructor() {
//         this.p_color_el = [];
//         this.s_color_el = [];
//         this.t_color_el = [];
//         this.color = {
//             primary: "#222",
//             secondary: "#445",
//             accent: "#ccc"
//         };
//         this.init();
//     }
//     init() {
//         const primary_color_id_list = [];
//         for(let id of primary_color_id_list) this.p_color_el.push(document.getElementById(id));
//         const secondary_color_id_list = ["top-menu", "top-tab", "project-folder"];
//         for(let id of secondary_color_id_list) this.s_color_el.push(document.getElementById(id));
//         this.set_color();
//     }
//     set_color() {
//         for(let el of this.p_color_el) {
//             el.style.backgroundColor = this.color.primary;
//         }
//         for(let el of this.s_color_el) {
//             el.style.backgroundColor = this.color.secondary;
//         }
//         for(let el of this.t_color_el) {
//             el.style.backgroundColor = this.color.accent;
//         }
//     }
// }
//
//
//
// //View
// class ViewController {
//     constructor() {
//         this.project_folder = new ProjectFolder();
//     }
// }
//
// class ProjectFolder {
//     constructor() {
//         this.el = document.getElementById("project-folder");
//     }
// }
