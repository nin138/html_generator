import {CSS} from "./css";
import {Err} from "../std/err";
export abstract class Node {
  private deleted;
  constructor(
    private id,
    private type,
    private name,
    protected parent
  ) {
    // this.tree = new TreeElement(this);
    this.deleted = false;
  }
  abstract remove()
  get_id() { return this.id }
  get_type() { return this.id }
  abstract is_child(id): boolean
  abstract append(new_parent)
  abstract insert_before(new_parent, reference)
  abstract get_editable()
}

class TextNode extends Node {
  private text;
  private nodes;
  constructor(id, name, parent) {
    super(id, "textnode", name, parent);
    this.nodes = [];
  }
  remove() {
  }
  append(new_parent) {
        for(let el of this.nodes) {
            new_parent.el.appendChild(el);			//!!!!!!!!!!!!!!!
            this.parent = new_parent;
        }
        // newParent.treeEl.appendChild(this.treeEl);
    }
  insert_before(new_parent, reference) {}		//!!!!!!!!!!!!!!!!!!!!!!!!!
  set_text(text) {
        let position = -1;
        if(this.nodes.length > 0) {
            for (let i = 0; i < this.parent.el.childNodes.length; i++) {
                if(this.nodes[0].isEqualNode(this.parent.el.childNodes[i])) position = i;
            }
        }
        for(let el of this.nodes) this.parent.el.removeChild(el);
        this.nodes = [];
        this.text = text;
        this.parse_text(text);
        for(let el of this.nodes) {
            if(position === -1) this.parent.el.appendChild(el);
            else this.parent.el.insertBefore(el, this.parent.el.childNodes[position]);
            position++;
        }
    }
  private parse_text(text) {
        text = text.replace(/ /g,"\u00a0");
        text = text.split("\n");
        for(let t of text) {
            if(t !== "") this.nodes.push(document.createTextNode(t));
            this.nodes.push(document.createElement('br'));
        }
        this.nodes.pop();
    }
  get_editable(){
        return { text: this.text };
    }
  get_text() {
        return this.text;
    }
  is_child(id) { return false }
}

class Element<T extends Node> extends Node {
  private css;
  private tag;
  private element;
  private child_nodes: T[];
  constructor(id, tag, name, parent) {
    super(id, "element", name, parent);
    this.css = new CSS();
    this.tag = tag;
    this.element = document.createElement(this.tag);
    this.parent.element.appendChild(this.element);
    this.element.setAttribute("data-id", id);
    this.child_nodes = [];
  }
  is_child(id) {
        if(this.get_id() == id) return true;
        for(let c of this.child_nodes) {
            if(c.get_id() == id) return true;
            if(c.get_type() != "textnode" && c.is_child(id)) {
                return true;
            }
        }
        return false;
    }
  append_child(node) {
    for(let i = 0; i < node.parent.childNodes.length; i++) {
      if(node.parent.childNodes[i].id == node.id) {
        node.parent.childNodes.splice(i, 1);
      }
    }
    this.add_child(node);
    if(node.type == "textnode") {
      for(let el of node.el) { this.element.append_child(el); }
    } else this.element.append_child(node.el);
    // this.tree.appendChild(node.tree.el);
    node.parent = this;
  }
  append(new_parent) {
  }
  insert_before(node, target) {
        for(let i = 0; i < node.parent.childNodes.length; i++) {
            if(node.parent.childNodes[i].id == node.id) {
                node.parent.childNodes.splice(i, 1);
            }
        }
        for(let i = 0; i < this.child_nodes.length; i++) {
            if(this.child_nodes[i].get_id() == target.id) {
                this.child_nodes.splice(i - 1, 0, node);
                break;
            }
        }
        let target_el = (target.type == "textnode")? target.el[0] : target.el;
        if(node.type == "textnode") {
            for(let el of node.el) this.element.insertBefore(el, target_el);
        } else this.element.insertBefore(node.el, target_el);
        // this.tree.insertBefore(node.tree.el, target.tree.el);
        node.parent = this;
    }
  add_child(node) {
    this.child_nodes.push(node);
  }
  remove() {}
  removeChild(node) {
    for(let i = 0; i < this.child_nodes.length; i++) {
      if(this.child_nodes[i].get_id() == node.id) {
        this.child_nodes[i].remove();
        this.child_nodes.splice(i, 1);
      }
    }
  }
  loadCss(css) {
        for(let atr in css) {
            this.changeCss(atr, css[atr]);
        }
    }
  changeCss(atr, value) {
    this.element.style[atr] = value;
    return this.css.set(atr, value);
  }
  getStyle(atr) { //!!!!!!!!!!!!!!
        return this.css.get(atr);
    }
  get_editable() {
        return this.css.values;
    }
}
class BodyElement extends Node {
  private element;
  constructor(body_elemennt) {
    super("0", "body", "body", null);
    this.element = body_elemennt;
  }
  is_child(id) { return true }
  append(new_parent) { return  new Err("dom_exception") }
  insert_before(new_parent, reference) { return  new Err("dom_exception") }
  get_editable() {}
  remove() { return  new Err("body_cant_remove_exception") }
}