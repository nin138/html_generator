"use strict";

var diary_title = "title";

var saveData = '{"body":{"backgroundColor":"rgb(20,200,220)"},"els":[{"name":"textnode1","type":"textnode","css":{"text":"fdgbhnh\\nfdsfg\\nwe"},"parent":"BODY"},{"name":"[div] n2","type":"div","css":{"backgroundColor":"#0f3"},"parent":"BODY"},{"name":"[div] n3","type":"div","css":{"backgroundColor":"#00f","padding":"10px"},"parent":"[div] n2"},{"name":"textnode4","type":"textnode","css":{"text":"sdf\\new"},"parent":"[div] n2"}]}';
saveData = JSON.parse(saveData);

function ajax(data, url, method, success, err) {
	var req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		var result = document.getElementById('result');
		if(req.readyState == 4) {
			if (req.status >= 200 && req.status < 300) {
				if(success) success(req.responseText);
			} else {
				if(err) err(req.responseText, req.status);
			}
		}
	}
	req.open(method, url, true);
	req.setRequestHeader("content-type", "application/x-www-form-urlencoded;charset=UTF-8");
	req.send(data);
}


class CssDataLists {
	constructor() {
		this.html_tag = ["div", "p"];
		this.unit = ["px", "rem", "em", "%", "vh", "vw", "vmin", "vmax"];
		this.unit_data = {
			rem: 16,
			vh: 0,
			vw: 0,
			vmin: 0,
			vmax: 0,
		}
		this.colors = ["AliceBlue", "AntiqueWhite", "Aqua", "Aquamarine", "Azure", "Beige", "Bisque", "Black", "BlanchedAlmond", "Blue", "BlueViolet", "Brown", "BurlyWood", "CadetBlue", "Chartreuse", "Chocolate", "Coral", "CornflowerBlue", "Cornsilk", "Crimson", "Cyan", "DarkBlue", "DarkCyan", "DarkGoldenrod", "DarkGray", "DarkGreen", "DarkKhaki", "DarkMagenta", "DarkOliveGreen", "DarkOrange", "DarkOrchid", "DarkRed", "DarkSalmon", "DarkSeaGreen", "DarkSlateBlue", "DarkSlateGray", "DarkTurquoise", "DarkViolet", "DeepPink", "DeepSkyBlue", "DimGray", "DodgerBlue", "FireBrick", "FloralWhite", "ForestGreen", "Fuchsia", "Gainsboro", "GhostWhite", "Gold", "Goldenrod", "Gray", "Green", "GreenYellow", "Honeydew", "HotPink", "IndianRed", "Indigo", "Ivory", "Khaki", "Lavender", "LavenderBlush", "LawnGreen", "LemonChiffon", "LightBlue", "LightCoral", "LightCyan", "LightGoldenrodYellow", "LightGreen", "LightGrey", "LightPink", "LightSalmon", "LightSeaGreen", "LightSkyBlue", "LightSlateGray", "LightSteelBlue", "LightYellow", "Lime", "LimeGreen", "Linen", "Magenta", "Maroon", "MediumAquamarine", "MediumBlue", "MediumOrchid", "MediumPurple", "MediumSeaGreen", "MediumSlateBlue", "MediumSpringGreen", "MediumTurquoise", "MediumVioletRed", "MidnightBlue", "MintCream", "MistyRose", "Moccasin", "NavajoWhite", "Navy", "OldLace", "Olive", "OliveDrab", "Orange", "OrangeRed", "Orchid", "PaleGoldenrod", "PaleGreen", "PaleTurquoise", "PaleVioletRed", "PapayaWhip", "PeachPuff", "Peru", "Pink", "Plum", "PowderBlue", "Purple", "Red", "RosyBrown", "RoyalBlue", "SaddleBrown", "Salmon", "SandyBrown", "SeaGreen", "Seashell", "Sienna", "Silver", "SkyBlue", "SlateBlue", "SlateGray", "Snow", "SpringGreen", "SteelBlue", "Tan", "Teal", "Thistle", "Tomato", "Turquoise", "Violet", "Wheat", "White", "WhiteSmoke", "Yellow", "YellowGreen"];
		this.all = ["inherit", "initial", "unset", "V."];
		this.rules = {
			ifFlex: ["flexDirection", "flexWrap", "justifyContent", "alignItems", "alignContent"],
			ifParentIsFlex: ["flex", "flexGrow", "flexShrink", "flexBasis", "order"],
			ifNotStatic: ["top", "left", "right", "bottom"],
		}
		this.types = [ "position", "display" , "size" , "text", "flex" ];
		this.data = {
			position: { 
				type: "position",
				values: ["static", "relative", "absolute", "fixed"],
			},
			top: {
				type: "position",
				unit: true, 
			},
			left: {
				type: "position",
				unit: true, 
			},
			right: {
				type: "position",
				unit: true, 
			},
			bottom: {
				type: "position",
				unit: true, 
			},
			float: {
				type: "position",
				values: ["none", "left", "right"], 
			},
			clear: {
				type: "position",
				values: ["left", "right", "both"], 
			},
			zIndex: {
				type: "position",
				number: true,
			},
			display: {
				type: "display",
				values: ["block", "inline", "inline-block", "flex", "inline-flex", "none", "inherit"], 
			},
			flex: { 
				type: "flex",
				number: true,
				unit: true,
				has_child: true, children: ["flexGrow", "flexShrink", "flexBasis"],
			},
			flexGrow: { 
				type: "flex",
				parent: "flex",
				number: true,
			},
			flexShrink: { 
				type: "flex",
				parent: "flex",
				number: true,
			},
			flexBasis: { 
				type: "flex",
				unit: true, values: ["auto"],
				parent: "flex", 
			},
			flexDirection: { 
				type: "flex",
				values: ["row","row-reverse","column","column-reverse"], 
			},
			flexWrap: { 
				type: "flex",
				values: ["nowrap","wrap","wrap-reverse"],
			},
			justifyContent: {
				type: "flex",
				values: ["flex-start","flex-end","center","space-around","spane-between"] 
			},
			alignItems: { 
				type: "flex",
				values: ["stretch","flex-start","flex-end","center","base-line"] 
			},
			alignContent: { 
				type: "flex",
				values: ["stretch","flex-start","flex-end","center","space-around","spane-between"], 
			},
			alignSelf: { 
				type: "flex",
				values: ["stretch","flex-start","flex-end","center","space-around","spane-between"] 
			},
			order: { 
				type: "flex",
				int: true,
			},
			opacity: {
				type: "display",
				number: true,
			},
			backgroundColor: {
				type: "display", 
				color: true, values: ["rgba(,,,)","rgb(,,)","transparent",], 
			},
			width: { 
				type: "size",
				unit: true, values: ["auto"], 
			},
			height: { 
				type: "size",
				unit: true, values: ["auto"], 
			},
			margin: { 
				type: "size",
				unit: true, values: ["auto"], 
				has_child: true, children: ["marginTop", "marginLeft", "marginRight", "marginBottom"],
			},
			marginTop: {
				type: "size",
				unit: true, values: ["auto"],
				parent: "margin" 
			},
			marginLeft: { 
				type: "size",
				unit: true, values: ["auto"],
				parent: "margin" 
			},
			marginRight: {
				type: "size", 
				unit: true, values: ["auto"], 
				parent: "margin" 
			},
			marginBottom: { 
				type: "size",
				unit: true, values: ["auto"], 
				parent: "margin" 
			},
			padding: { 
				type: "size",
				unit: true, 
				has_child: true, children: ["paddingTop", "paddingLeft", "paddingRight", "paddingBottom"],
			},
			paddingTop: { 
				type: "size",
				unit: true, 
				parent: "padding", 
			},
			paddingLeft: { 
				type: "size",
				unit: true, 
				parent: "padding", 
			},
			paddingRight: { 
				type: "size",
				unit: true, 
				parent: "padding", 
			},
			paddingBottom: { 
				type: "size",
				unit: true, 
				parent: "padding", 
			},
			fontSize: {
				type: "text",
				unit: true,
			},
			fontWeight: {
				type: "text",
				values: [ "normal", "bold", "bolder", "lighter" ],
			},
			color: {
				type: "text",
				color: true, values: ["rgba(,,,)","rgb(,,)","transparent",],
			}
		};
		this.bodyAtrs = ["backgroundColor","width","height","padding","paddingTop","paddingLeft","paddingRight","paddingBottom"];
		this.el = document.getElementById('inp-area');
	}
	onResize() {
		this.unit_data.vh = iframe.window.innerHeight / 100;
		this.unit_data.vw = iframe.window.innerWidth / 100;
		if(this.unit_data.vh > this.unit_data.vw ) {
			this.unit_data.vmin = this.unit_data.vw;
			this.unit_data.vmax = this.unit_data.vh;
		} else {
			this.unit_data.vmax = this.unit_data.vw;
			this.unit_data.vmin = this.unit_data.vh;
		}
	}
	toPxValues(style) {
		if(!style.v_val) {
			style.v_val = 0;
			style.v_unit = "px";
		} else {
			style.v_unit = this.getUnit(style.v_val);
			style.v_val = this.toPx(style.v_val, style.v_unit);
		}
		if(!style.h_val) {
			style.h_val = 0;
			style.h_unit = "px";
		} else {
			style.h_unit = this.getUnit(style.h_val);
			style.h_val = this.toPx(style.h_val, style.h_unit);
		}
		return style;
	}
	toPx(val, unit) {
		val = parseInt(val);
		if(unit == "px") return val;
		else if(unit == "%") {
			return val * html.activeNode.parent.el.offsetWidth / 100;
		} else if(unit == "em") {
			//!!!
		} else {
			return val * this.unit_data[unit];
		}
	}
	toUnitFromPx(val, unit) {
		if(val == 0) return 0;
		else if(unit == "px") return val;
		else if(unit == "%") {
			return val / (html.activeNode.parent.el.offsetWidth / 100);
		} else if(unit == "em") {
			//!!!
		} else {
			return val / this.unit_data[unit];
		}
	}
	getUnit(val) {
		for(let u of this.unit) {
			if(val.indexOf(u) != -1) return u;
		}
		return false;
	}
	toChainCase(atr) {
		var i = 0;
		while(i != null) { 
			i = atr.match(/[A-Z]/);
			if(i != null) i = i.index;
			if(i != null) atr = atr.slice(0, i) + "-" + atr.charAt(i).toLowerCase() + atr.slice(i+1, atr.length);
		}
		return atr;
	}
	isValid(atr, value) {
		let ret = false;
		let d = this.data[atr];
		value = value.trim();
		if(value.startsWith("V.")) console.log("v");
		if(value == "") return true;
		for(let v of this.all) if(v == value) return true;
		if(d.unit && this.isUnitValue(value)) return true;
		if(d.color && this.isColorValue(value)) return true;
		if(d.values) for(let val of d.values) if(val == value) return true;
		if(d.number && isFinite(value)) return true;
		if(d.int && isFinite(value) && !/[.]/.test(value)) return true;
		if(atr == "margin" || atr == "padding") {
			let values = value.split(" ");
			if(values.length < 5) {
				for(let v of values) {
					v = v.trim();
					if(!this.isUnitValue(v) && v != "auto") return false;
				}
				return true;
			}
		}
		if(atr == "flex") {
			let values = value.split(" ");
			if(!isFinite(values[0])) return false;
			if(values.length == 2) {
				if(isFinite(values[1]) || this.isUnitValue(values[1])) return true;
			} else if(values.length == 3) {
				if(isFinite(values[1]) && this.isUnitValue(values[2])) return true;
			}
		}
		return ret;
	}
	isColorValue(value) {
		var ret = true;
		if(value.charAt(0) == "#") {
			value = value.substring(1);
			for(let c of value) {
				if(!/[a-f]|[A-F]|\d/.test(c)) ret = false;
			}
			if(ret && value.length == 3 || value.length == 6) return true;
		} else if(value.startsWith("rgba(")) {
			value = value.substring(5, value.length - 1);
			value = value.split(",");
			if(value.length == 4) {
				let op = value.pop();
				if(op.charAt(0) == ".") op = "0" + op;
				op = parseInt(op);
				if(isFinite(op) && op >= 0 && op <= 1) {
					for(let val of value) {
						val = val.trim();
						val = parseInt(val);
						if(isFinite(val) && val >= 0 && val <= 255) {}
						else return false;
					}
					return true;
				}	
			}
			return false;
		} else if(value.startsWith("rgb(")) {
			value = value.substring(4, value.length - 1);
			value = value.split(",");
			if(value.length == 3) {
				for(let val of value) {
					val = val.trim();
					val = parseInt(val);
					if(isFinite(val) && val >= 0 && val <= 255) {} else { return false; }
				}
				return true;
			}
		} else {
			for(let color of this.colors) {

				if(color.toLowerCase() == value.toLowerCase()) return true;
			}
		}
		return false;
	}
	isUnitValue(value) {
		if(value == "0") return true;
		if(value.charAt(0) == "-") value = value.substring(1);
		let i = 0;
		let c = 0;
		for(i; i < value.length; i++) {
			if(/[.]/.test(value[i])) c++;
			else if(!/\d/.test(value[i])) break;
		}
		if(c > 1 || value.charAt(i - 1) == ".") return false;
		if(i != 0 ) {
			value = value.substring(i);
			for(let unit of this.unit) {
				if(value == unit) return true;
			}
		}
		return false;
	}
	parseShorthand(atr, value) {
		let atrs = {};
		value = value.trim();
		if(atr == "margin" || atr == "padding") {
			value = value.split(" ");
			switch(value.length) {
			case 1:
				atrs[atr + "Top"] = value[0];
				atrs[atr + "Left"] = value[0];
				atrs[atr + "Right"] = value[0];
				atrs[atr + "Bottom"] = value[0];
				break;
			case 2:
				atrs[atr + "Top"] = value[0];
				atrs[atr + "Bottom"] = value[0];
				atrs[atr + "Left"] = value[1];
				atrs[atr + "Right"] = value[1];
				break;
			case 3:
				atrs[atr + "Top"] = value[0];
				atrs[atr + "Bottom"] = value[2];
				atrs[atr + "Left"] = value[1];
				atrs[atr + "Right"] = value[1];
				break;
			case 4:
				atrs[atr + "Top"] = value[0];
				atrs[atr + "Bottom"] = value[2];
				atrs[atr + "Left"] = value[3];
				atrs[atr + "Right"] = value[1];
				break
			}
		}
		else if(atr == "flex") {
			value = value.split(" ");
			for(let i = 0; i < value.length; i++) value[i] = value[i].trim();
			atrs["flexGrow"] = "";
			atrs["flexShrink"] = "";
			atrs["flexBasis"] = "";
			if(value.length == 1) {
				if(isFinite(value[0])) atrs["flexGrow"] = value[0];
				else if(this.isUnitValue(value[0])) atrs["flexBasis"] = value[0];
			} else if(value.length == 2) {
				atrs["flexGrow"] = value[0];
				if(isFinite(value[1])) atrs["flexShrink"] = value[1];
				else atrs["flexBasis"] =value[1];
			} else {
				atrs["flexGrow"] = value[0];
				atrs["flexShrink"] = value[1];
				atrs["flexBasis"] = value[2];
			}
		}
		return atrs;
	}
	shorthandValues(atr, children) {
		if(atr == "margin" || atr == "padding") {
			let top = children[atr + "Top"].trim() || 0;
			let left = children[atr + "Left"].trim() || 0;
			let right = children[atr + "Right"].trim() || 0;
			let bottom = children[atr + "Bottom"].trim() || 0;
			let val;
			if(left == right) {
				if(top == bottom) {
					if(left == top) val = top;
					else val = top +" "+ left; 
				}
				else val = top +" "+ left +" "+ bottom;
				}
			else val = top +" "+ right +" "+ bottom +" "+ left;
			return val;
		} else if(atr == "flex") {
			let val;
			if(children["flexGrow"] == "") val = "0 "; 
			else val = children["flexGrow"] + " ";
			if(children["flexShrink"] != "") val += children["flexShrink"] + " ";
			if(children["flexBasis"] != "") val += children["flexBasis"];
			return val;
		}
	}
}
var css_data = new CssDataLists();
var C = {};
var iframe;
var html;
window.addEventListener("load", function() {	
	class Iframe {
		constructor() {
			this.el = document.createElement("iframe");
			document.body.appendChild(this.el);
			this.window = this.el.contentWindow;
			this.doc = this.window.document;
			this.body = this.doc.body;
			this.head = this.doc.getElementsByTagName('head')[0];
			let reset_css = this.doc.createElement("link");
			reset_css.setAttribute("rel", "stylesheet");
			reset_css.setAttribute("href", "./css/reset.css");
			let iframe_css = this.doc.createElement("link");
			iframe_css.setAttribute("rel", "stylesheet");
			iframe_css.setAttribute("href", "./css/iframe.css");
			this.head.appendChild(reset_css);
			this.head.appendChild(iframe_css);
			this.doc.getElementsByTagName('html')[0].style.fontSize = "16px";
			this.selector_element = this.doc.createElement('div');
			this.selector_element.className = 'selector-element';
			this.selector_element.style.pointerEvents = "none";
			this.body.appendChild(this.selector_element);
			this.body.addEventListener("mousedown", this.onMousedown.bind(this));
			this.body.addEventListener("mousemove", this.onMousemove.bind(this));
			this.body.addEventListener("mouseleave", this.onMouseup.bind(this));
			this.body.addEventListener("mouseup", this.onMouseup.bind(this));
			this.clicking = false;
			this.dragging = false;
			this.point = {
				id: null,
				is_static: null,
				start: { x: null, y: null },
				style: {},
				unit: {},
			};
		}
		setSelectorElement() {
			let act = (html.activeNode.type === "textnode")? html.activeNode.parent : html.activeNode;
			this.selector_element.style.width = act.el.offsetWidth + "px";
			this.selector_element.style.height = act.el.offsetHeight + "px";
			let rect = act.el.getBoundingClientRect();
			this.selector_element.style.left = rect.left + iframe.window.pageXOffset + "px";
			this.selector_element.style.top = rect.top + iframe.window.pageYOffset + "px";
		}
		onMousedown(ev) {
			this.point.id = ev.target.getAttribute("data-id");
			C.event.changeActiveNode(this.point.id);
			if(this.point.id == 0) return;
			this.clicking = true;
			this.point = {
				id: null,
				is_static: null,
				start: { x: null, y: null },
				style: {},
				unit: {},
			};
			let style = {};
			let position =  html.activeNode.getStyle("position");
			if(position == "" || position == "static") { 
				this.point.is_static = true;
				style.h_atr = "marginLeft";
				style.h_val = html.activeNode.getStyle(style.h_atr);
				style.v_atr = "marginTop";
				style.v_val = html.activeNode.getStyle(style.v_atr);
			} else {
				if(html.activeNode.getStyle("bottom")) style.v_atr = "bottom";
				else style.v_atr = "top";
				if(html.activeNode.getStyle("right")) style.h_atr = "right";
				else style.h_atr = "left";
				style.v_val = html.activeNode.getStyle(style.v_atr);
				style.h_val = html.activeNode.getStyle(style.h_atr);
			}
			this.point.style = css_data.toPxValues(style);
			this.point.start.x = this.getPageX(ev);
			this.point.start.y = this.getPageY(ev);
		}
		onMousemove(ev) {
			if(this.clicking) {
				this.dragging = true;
				this.selector_element.style.display = "none";
				let x = this.point.start.x - this.getPageX(ev);
				let y = this.point.start.y - this.getPageY(ev);
				if(this.point.style.h_atr == "right") html.activeNode.el.style[this.point.style.h_atr] = this.point.style.h_val + x + "px";
				else html.activeNode.el.style[this.point.style.h_atr] = this.point.style.h_val - x + "px";
				if(this.point.style.v_atr == "bottom") html.activeNode.el.style[this.point.style.v_atr] = this.point.style.v_val + y + "px";
				else html.activeNode.el.style[this.point.style.v_atr] = this.point.style.v_val - y + "px";
			}
		}
		onMouseup(ev) {
			if(this.dragging) {
				let x = this.point.start.x - this.getPageX(ev);
				let y = this.point.start.y - this.getPageY(ev);
				if(this.point.style.h_atr == "right") x = this.point.style.h_val + x;
				else x = this.point.style.h_val - x;
				if(this.point.style.v_atr == "bottom") y = this.point.style.v_val + y;
				else y = this.point.style.v_val - y;
				let holizontal = css_data.toUnitFromPx(x, this.point.style.h_unit) + this.point.style.h_unit;
				let vertical = css_data.toUnitFromPx(y, this.point.style.v_unit) + this.point.style.v_unit;;
				C.event.onElementMoved(this.point.style.v_atr, vertical);
				C.event.onElementMoved(this.point.style.h_atr, holizontal);
				this.dragging = false;
				this.selector_element.style.display = "block";
				this.setSelectorElement();
			}
			this.clicking = false;
		}
		getPageX(ev) { return ev.pageX || ev.changedTouches[0].pageX; }
		getPageY(ev) { return ev.pageY || ev.changedTouches[0].pageY; }
	}

	class EventController {
		constructor() {
			this.quitUrl = "MyDiary";
			this.inp_dom_type = document.getElementById("createElementType");
			this.delete_element_msg = document.getElementById("modal-delete-msg");
			this.init();
		}
		init() {
			document.getElementById("btn-open-create").addEventListener("click", function() { 
				if(html.activeNode.type != "textnode") {
					nin.modal.show("modal-create");
					document.getElementById("modal-errmsg").innerHTML = "";
				} else C.log.e("textnodeには子要素を追加できません");
			});
			document.getElementById("btn-create").addEventListener("click", this.createElement);
			document.getElementById("btn-save").addEventListener("click", this.onSaveClick.bind(this));
			document.getElementById("btn-create-text").addEventListener("click", this.createTextNode);
			document.getElementById("modal-delete-btn").addEventListener("click", this.removeNode.bind(this));
			document.getElementById("btn-fin-edit-save").addEventListener("click", this.saveAndQuit.bind(this));
			document.getElementById("btn-fin-edit-nosave").addEventListener("click", this.quit.bind(this));
			window.addEventListener("resize", this.onResize);
			iframe.window.addEventListener("resize", this.onResize);
			let dlist = document.createElement('datalist');
			dlist.id = "html_tag_list";
			for(let t of css_data.html_tag) {
				let op = document.createElement("option");
				op.value = t;
				dlist.appendChild(op);
			}
			document.body.appendChild(dlist);
			this.inp_dom_type.setAttribute("list", "html_tag_list");
			this.inp_dom_type.autocomplete = true;
			window.onbeforeunload = this.onBeforeUnload.bind(this);
		}
		createElement() {
			let tag = document.getElementById("createElementType").value;
			let flag = false;
			for(let t of css_data.html_tag) {
				if(t == tag) {
					flag = true;
					break;
				}
			}
			if(!flag) document.getElementById("modal-errmsg").innerHTML = "タグ: 「 " + tag + " 」は存在しません。"; 
			else if(html.activeNode.type == "textnode") C.log.e("textnodeには子要素を追加できません");
			else {
				html.createElement(tag, document.getElementById("createElementName").value);
				nin.modal.close();	
			}
		}
		createTextNode() {
			if(html.activeNode.type == "textnode") C.log.e("textnodeには子要素を追加できません");
			else html.createTextNode();
		}
		onRemoveButton(id) {
			this.delete_element_id = id;
			this.delete_element_msg.innerHTML = html.elements[id].name + " を削除してもよろしいですか？";
			nin.modal.show("modal-delete");
		}
		removeNode() {
			html.removeNode(html.elements[this.delete_element_id]);
			if(html.activeNode.deleted) {
				this.changeActiveNode(0);
			}
			iframe.setSelectorElement();
			nin.modal.close();
		}
		moveNode(move_node_id, target_id, isBefore) {
			let move_node = html.elements[move_node_id];
			let target = html.elements[target_id];
			if(move_node.type != "textnode" && move_node.isChild(target_id)) C.log.e("子要素に親要素を追加することはできません");
			else if(isBefore) target.parent.insertBefore(move_node, target);
			else if(target.type == "textnode") C.log.e("textnodeには子要素を追加できません");
			else target.appendChild(move_node);
		}
		changeActiveNode(id) {
			html.changeActiveNode(html.elements[id]);
			iframe.setSelectorElement();
			C.edit.loadData(html.activeNode.getEditData());
		}
		onInputChange(atr, value) {
			if(css_data.isValid(atr, value)) {
				if(html.activeNode.changeCss(atr, value)) {
					if(css_data.data[atr].has_child) {
						C.edit.parseShorthand(atr, value); 
					}
					else if(css_data.data[atr].parent) {
						C.edit.loadChild(css_data.data[atr].parent);
					}
					var msg = html.activeNode.name + ".style." + css_data.toChainCase(atr) + " is ";
					if(value == "") msg += "deleted.";
					else msg += "changed to " + value;
					C.log.i(msg);
					iframe.setSelectorElement();
				}
			} else C.log.e(css_data.toChainCase(atr) + ": " + value + "は正しい値ではありません。");
		}
		onElementMoved(atr, value) {
			if(html.activeNode.changeCss(atr, value)) {
				var msg = html.activeNode.name + ".style." + css_data.toChainCase(atr) + " is ";
				msg += "changed to " + value;
				C.log.i(msg);
				C.edit.input[atr].value = value;
				if(atr.startsWith("margin")) C.edit.loadChild(css_data.data[atr].parent);
			}
		}
		onTextAreaChange(text) {
			html.activeNode.setText(text);
			iframe.setSelectorElement();
		}
		onResize() {
			iframe.setSelectorElement();
			css_data.onResize();
		}
		onSaveClick() {
			let success = function() {
				nin.modal.show("modal-save");
			}
			let err = function(msg) {
				nin.modal.show("modal-err");
				document.getElementById("modal-err-msg").innerHTML = msg || "エラーが発生しました。";
			}
			this.save(success, err);
		}
		save(success, err) {
			let save_data = this.createSaveData();
			let html_string = this.createHtml();
			console.log(save_data);
			console.log(html_string);
			let data = "save=" + save_data + "&html=" + html_string + "&title=" + diary_title;
			ajax(data, "SaveDiary", "post", success.bind(this), err.bind(this));
		}
		createSaveData() {
			var save = {};
			save.body = Object.assign({},　html.elements[0].getEditData());
			for(let atr in save.body) {
				if(save.body[atr] == "") delete save.body[atr];
			}
			save.els = [];
			for(let el of html.elements) {
				if(el.type == "body" || el.deleted) continue;
				let css = Object.assign({}, el.getEditData());
				if(css.text) css.text = css.text.replace( /\n/g,"\\n");
				for(let atr in css) {
					if(css[atr] == "") delete css[atr];
				}
				save.els.push({ name: el.name, type: el.type, css: css, parent: el.parent.name });
			}
			return JSON.stringify(save);
		}
		createHtml() {
			function create(html, node) {
				if(node.type != "textnode") {
					html += "<" + node.type + " style=\"";
					let css = node.getEditData();
					for(let atr in css) {
						if(css[atr] != "" && !css_data.data[atr].parent) html += css_data.toChainCase(atr) + ": " + css[atr] + "; ";
					}
					html += "\">";
					for(let child of node.childNodes) {
						if(!child.deleted) html = create(html, child);
					}
					html += "</" + node.type + ">";
				} else html += node.getHtml();
				return html;
			}
			return create("", html.elements[0]);
		}
		onBeforeUnload(ev) {
			let val = "変更が保存されていない可能性があります。";
			ev.returnValue = val;
			return val;  
		}
		saveAndQuit() {
			let success = function() {
				window.onbeforeunload = "";
				this.quit();
			}
			let err = function(msg) {
				nin.modal.close();
				nin.modal.show("modal-err");
				document.getElementById("modal-err-msg").innerHTML = msg || "エラーが発生しました。";
			}
			this.save(success, err);
		}
		quit() {
			window.location.href = this.quitUrl;
		}
	}

	class TreeController {
		constructor() {
			this.el = document.getElementById("tree");
			this.tree_wrap = document.getElementById("tree_wrap");
			this.body_el;
			this.drag_id;
		}
		onDragstart(ev) {
			this.drag_id = ev.target.getAttribute("data-id");
		}
		onDrop(ev) {
			let target = ev.target;
			target.style.outline = "none";
			while(!target.getAttribute("data-id")) target = target.parentNode;
			if(this.drag_id != target.getAttribute("data-id")) {
				let isBefore = false;
				if(ev.target.className == "tree_before_area") isBefore = true;
				C.event.moveNode(this.drag_id, target.getAttribute("data-id"), isBefore);
			}
		}
		onDragenter(ev) { ev.target.style.outline = "dashed"; }
		onDragleave(ev) { ev.target.style.outline = "none"; }
		onDragover(ev) { ev.preventDefault(); }
		addElement(treeEl) {
			treeEl.el.addEventListener("dragenter", this.onDragenter);
			treeEl.el.addEventListener("dragleave", this.onDragleave);
			treeEl.el.addEventListener("dragover", this.onDragover);
			treeEl.el.addEventListener("drop", this.onDrop.bind(this));
			if(treeEl.node.type == "body") {
				this.tree_wrap.appendChild(treeEl.el);
				this.body_el = treeEl.el;
				treeEl.el.style.marginTop = "2px";
				treeEl.el.draggable = false;
				treeEl.el_area.draggable = false;
				treeEl.el.addEventListener("click", this.onClick.bind(this));
				treeEl.btn_del.style.display = "none";
				treeEl.before_area.style.display = "none";
				treeEl.btn_del.addEventListener("click", this.onDelClick.bind(this));

			}
			else {
				treeEl.btn_del.draggable = false;
				treeEl.node.parent.tree.appendChild(treeEl.el);
				treeEl.el.addEventListener("dragstart", this.onDragstart.bind(this));
			}
		}
		onClick(ev) {
			let target = ev.target;
			if(ev.target.className == "tree_el_del") C.event.onRemoveButton(ev.target.parentNode.getAttribute("data-id"));
			else if(ev.target.className == "tree_before_area") {
				C.event.changeActiveNode(html.elements[ev.target.parentNode.getAttribute("data-id")].parent.id);
			} else {
				while(!target.getAttribute("data-id")) {
					target = target.parentNode;
				}
				C.event.changeActiveNode(target.getAttribute("data-id"));
			}
		}
		onDelClick() {
			console.log(ev);
		}
	}

	class EditController {
		constructor() {
			this.el = document.getElementById("edit");
			this.input_area = document.getElementById("input-area");
			this.input = {};
			this.input_wrap = {};
			this.text_area = document.createElement("textarea");
			this.text_area.className = "text-edit";
			this.dlist = {};
			this.init();
		}
		init() {
			for(let type of css_data.types) {
				let wrap = document.createElement("div");
				wrap.innerHTML = type;
				wrap.className = "inp-type-wrap";
				this.input_area.appendChild(wrap);
				this.input_wrap[type] = wrap;
			}
			let text_area_wrap = document.createElement("div");
			this.input_area.appendChild(text_area_wrap);
			text_area_wrap.appendChild(this.text_area);
			text_area_wrap.className = "text-edit-wrap"
			this.text_area.addEventListener("input", this.onTextAreaChange.bind(this));
			for(let atr in css_data.data) {
				let wrap = document.createElement("div");
				wrap.className = "inp-atr-wrap";
				let name = document.createElement("label");
				if(css_data.data[atr].parent) name.className = "child-atr-label";
				name.innerHTML = css_data.toChainCase(atr);
				let input = document.createElement("input");
				input.setAttribute("type", "text");
				input.addEventListener("input", this.onInputChange.bind(this, atr));
				wrap.appendChild(name);
				wrap.appendChild(input);
				this.input_wrap[css_data.data[atr].type].appendChild(wrap);
				this.input[atr] = input;
			}
			this.createAutoComplete();
		}
		parseShorthand(atr, value) {
			let atrs = css_data.parseShorthand(atr, value);
			for(let c in atrs) this.input[c].value = atrs[c];
		}
		loadChild(atr) {
			let children = {};
			for(let c of css_data.data[atr].children) children[c] = this.input[c].value;
			this.input[atr].value = css_data.shorthandValues(atr, children);
		}
		createAutoComplete() {
			for(let atr in this.input) {
				let dlist = document.createElement('dataList');
				dlist.id = "dlist-" + atr;
				if(css_data.data[atr].values) {
					for(let val of css_data.data[atr].values) {
						let op = document.createElement('option');
						op.value = val;
						dlist.appendChild(op);
					}
				}
				if(css_data.data[atr].color) {
					for(let val of css_data.colors) {
						let op = document.createElement('option');
						op.value = val;
						dlist.appendChild(op);
					}
				}
				for(let val of css_data.all) {
					let op = document.createElement('option');
					op.value = val;
					dlist.appendChild(op);
				}
				this.dlist[atr] = dlist;
				this.el.appendChild(dlist);
				this.input[atr].autocomplete = true;
				this.input[atr].setAttribute("list", "dlist-"+ atr);
			}
		}
		onTextAreaChange() { C.event.onTextAreaChange(this.text_area.value); }
		onInputChange(atr) {
			var value = this.input[atr].value;
			C.event.onInputChange(atr, value);
		}
		loadData(data) {
			for(let atr in this.input) this.input[atr].parentNode.style.display = "none";
			this.text_area.parentNode.style.display = "none";
			if(data.text != undefined) {
				this.text_area.parentNode.style.display = "block";
				this.text_area.value = data.text;
				for(let type in this.input_wrap) this.input_wrap[type].style.display = "none";
			} else {
				for(let type in this.input_wrap) this.input_wrap[type].style.display = "block";
				for(let atr in data) {
					this.input[atr].parentNode.style.display = "flex";
					this.input[atr].value = data[atr];
				}
			}
		}
	}

	class LogController {
		constructor() {
			this.head_info = document.getElementById("head-info-area");
			this.head_info.addEventListener("animationend", this.onAnimeend.bind(this));
		}
		onAnimeend() {
			this.head_info.className = "";
		}
		i(msg) {
			this.head_info.className = "head_info_anime"
			this.print_message(msg, "#000");
		}
		e(msg) {
			this.head_info.className = "head_info_anime-err"
			this.print_message(msg, "#fff");
		}
		print_message(msg, color) {
			this.head_info.style.color = color;
			this.head_info.innerHTML = msg;
		}
	}

	iframe = new Iframe();
	C.tree = new TreeController();
	C.edit = new EditController();
	C.event = new EventController();
	C.log = new LogController();
	html = new Html();
	if(window.saveData) html.loadSaveData(saveData);
	css_data.onResize();
	setTimeout(iframe.setSelectorElement.bind(iframe), 1000);
});



class Html {
	constructor() {
		this.elements = [];
		this.elementCount = 1;
		this.activeNode = new Element(0, "body", "BODY");
		this.elements.push(this.activeNode);
	}
	loadSaveData(data) {
		this.elements[0].loadCss(data.body);
		for(let el_s of data.els) {
			var flag = false;
			for(let el of this.elements) {
				if(el.name == el_s.parent) {
					this.changeActiveNode(el);
					flag = true;
				}
			}
			if(!flag) C.log.e("savedata が壊れてます");
			if(el_s.type == "textnode") {
				this.createTextNode();
				this.elements[this.elementCount - 1].setText(el_s.css.text);
			} else {
				this.createElement(el_s.type, el_s.name);
				this.elements[this.elementCount - 1].loadCss(el_s.css);
			}
		}
		C.event.changeActiveNode(0);
	}
	createElement(type, name) {
		if(!name) name = "[" + type + "] n" + this.elementCount;
		this.elements.push(new Element(this.elementCount, type, name, this.activeNode));
		this.activeNode.addChild(this.elements[this.elementCount]);
		this.elementCount++;
		C.event.changeActiveNode(this.elementCount - 1);
	}
	createTextNode() {
		this.elements.push(new TextNode(this.elementCount, "textnode" + this.elementCount, this.activeNode));
		this.activeNode.addChild(this.elements[this.elementCount]);
		this.elementCount++;
		C.event.changeActiveNode(this.elementCount - 1);
	}
	removeNode(node) {
		node.parent.removeChild(node);
	}
	changeActiveNode(node) {
		const inactive_color = "#3af";
		const active_color = "#f00";
		this.activeNode.tree.el.style.color = inactive_color;
		this.activeNode = node;
		this.activeNode.tree.el.style.color = active_color;
		iframe.setSelectorElement();
	}
}

class TreeElement {
	constructor(node) {
		this.node = node;
		this.el = document.createElement("div");
		this.el.className = "tree_el";
		this.before_area = document.createElement("div");
		this.before_area.className = "tree_before_area";
		this.el_area = document.createElement("div");
		this.el_area.className = "tree_el_area";
		this.btn_del = document.createElement("div");
		this.btn_del.className = "tree_el_del";
		this.el.appendChild(this.before_area);
		this.el.appendChild(this.btn_del);
		this.el.appendChild(this.el_area);
		this.el_area.innerHTML = node.name;
		if(node.type != "body") this.el.draggable = true;
		this.setTree();
		this.el.setAttribute("data-id", this.node.id);
	}
	appendChild(el) {
		this.el_area.appendChild(el);
	}
	insertBefore(el, target) {
		this.el_area.insertBefore(el, target);
	}
	removeChild(el) {
		this.el_area.removeChild(el);
	}
	setTree() {
		C.tree.addElement(this);
	}
}

class CSS {
	constructor() {
		this.values = {};
		for(let atr in css_data.data) {
			this.values[atr] = "";
		}
	}
	get(atr) {
		return this.values[atr];
	}
	set(atr ,value) {
		if(this.values[atr] == value) return false;
		this.values[atr] = value;
		if(css_data.data[atr].has_child) {
			this.parseShorthand(atr, value);
		} else if(css_data.data[atr].parent) {
			this.loadChild(css_data.data[atr].parent);
		}
		return true;
	}
	parseShorthand(atr, value) {
		let atrs = css_data.parseShorthand(atr, value);
		for(let c in atrs) this.values[c] = atrs[c];
	}
	loadChild(atr) {
		let children = {};
		for(let c of css_data.data[atr].children) children[c] = this.values[c];
		this.values[atr] = css_data.shorthandValues(atr, children);
	}
}

class Node {
	constructor(id, type, name, parent) {
		this.id = id;
		this.type = type;
		this.name = name;
		this.parent = parent;
		this.tree = new TreeElement(this);
		this.deleted = false;
	}
	removeThis() {
		this.deleted = true;
		this.parent.tree.removeChild(this.tree.el);
	}
}

class TextNode extends Node {
	constructor(id, name, parent) {
		super(id, "textnode", name, parent);
		this.text = "";
		this.el = [];
		this.el.push(iframe.doc.createTextNode(""));
		this.parent.el.appendChild(this.el[0]);
	}
	removeThis() {
		super.removeThis();
		for(let el of this.el) {
			this.parent.el.removeChild(el);
		}
	}
	getHtml() {
		return this.text.replace( / /g,"\u00a0")
										.replace( /\n/g,"<br>");
	}
	getEditData() {
		return { text: this.text };
	}
	changeParent(newParent) {
		for(let el of this.el) {
			newParent.el.appendChild(el);
			this.parent = newParent;
		}
		// newParent.treeEl.appendChild(this.treeEl);
	}
	setText(text) {
		var position = -1;
		if(this.el.length > 0) {
			for (var i = 0; i < this.parent.el.childNodes.length; i++) {
				if(this.el[0].isEqualNode(this.parent.el.childNodes[i])) position = i;
			}
		}
		for(let el of this.el) this.parent.el.removeChild(el);
		this.el = [];
		this.text = text;
		this.parseText(text);
		for(let el of this.el) {
			if(position === -1) this.parent.el.appendChild(el);
			else this.parent.el.insertBefore(el, this.parent.el.childNodes[position]);
			position++;
		}
	}
	parseText(text) {	
		text = text.replace(/ /g,"\u00a0");
		text = text.split("\n");
		for(let t of text) {
			if(t !== "") this.el.push(iframe.doc.createTextNode(t));
			this.el.push(iframe.doc.createElement('br'));
		}
		this.el.pop();
	}
	getText() {
		return this.text;
	}
}

class Element extends Node {
	constructor(id, type, name, parent) {
		super(id, type, name, parent);
		this.css = new CSS();
		if(type == "body") {
			this.el = iframe.body;
		} else {
			this.el = iframe.doc.createElement(type);
			this.parent.el.appendChild(this.el);
		}
		this.el.setAttribute("data-id", id);
		this.childNodes = [];
		// this.clssList = [];
	}
	isChild(id) {
		if(this.id == id) return true;
		for(let c of this.childNodes) {
			if(c.id == id) return true;
			if(c.type != "textnode" && c.isChild(id)) {
				return true;
			}
		}
		return false;
	}
	appendChild(node) {
		for(let i = 0; i < node.parent.childNodes.length; i++) {
			if(node.parent.childNodes[i].id == node.id) {
				node.parent.childNodes.splice(i, 1);
			}
		}
		this.addChild(node);
		if(node.type == "textnode") {
			for(let el of node.el) { this.el.appendChild(el); }
		} else this.el.appendChild(node.el);
		this.tree.appendChild(node.tree.el);
		node.parent = this;
	}
	insertBefore(node, target) {
		for(let i = 0; i < node.parent.childNodes.length; i++) {
			if(node.parent.childNodes[i].id == node.id) {
				node.parent.childNodes.splice(i, 1);
			}
		}
		for(let i = 0; i < this.childNodes.length; i++) {
			if(this.childNodes[i].id == target.id) {
				this.childNodes.splice(i - 1, 0, node);
				break;
			}
		}
		let target_el = (target.type == "textnode")? target.el[0] : target.el;
		if(node.type == "textnode") {
			for(let el of node.el) this.el.insertBefore(el, target_el);
		} else this.el.insertBefore(node.el, target_el);
		this.tree.insertBefore(node.tree.el, target.tree.el);
		node.parent = this;
	}
	addChild(node) {
		this.childNodes.push(node);
	}
	removeThis() {
		super.removeThis();
		for(let c of this.childNodes) {
			c.removeThis();
		}
		this.parent.el.removeChild(this.el);
	}
	removeChild(node) {
		for(let i = 0; i < this.childNodes.length; i++) {
			if(this.childNodes[i].id == node.id) {
				this.childNodes[i].removeThis();
				this.childNodes.splice(i, 1);
			}
		}
	}
	loadCss(css) {
		for(let atr in css) {
			this.changeCss(atr, css[atr]);
		}
	}
	changeCss(atr, value) {
		this.el.style[atr] = value;
		return this.css.set(atr, value);
	}
//!!!!!!!!!!!!!!
	getStyle(atr) {
		return this.css.get(atr);
	}
	getEditData() {
		return this.css.values;
	}
}
