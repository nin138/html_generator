
// window.onbeforeunload = function(){
// 	return "";
// }
var requestAnimationFrams
(function() {
	requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || 
		window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
	window.requestAnimationFrame = requestAnimationFrame;
})();


var cssUnits = {
	rem: 16,
	vw: null,
	vh: null,
	vmin: null,
	vmax: null,
	onResize: function() {
		cssUnits.vw = iframe.window.innerWidth;
		cssUnits.vh = iframe.window.innerHeight;
		if(cssUnits.vh < cssUnits.vw) {
			cssUnits.vmin = cssUnits.vh;
			cssUnits.vmax = cssUnits.vw;
		} else {
			cssUnits.vmin = cssUnits.vw;
			cssUnits.vmax = cssUnits.vh;
		}
	}
};
var log;
var iframe;
var editArea;
var domController;
var keyController;
var input;
var cssDataLists;
var elementCreator;
var buttonEvents = {
	createEl: function() {
		ninModal.show('createElementMordal', 'center');
		document.getElementById("createElementName").focus();
	}
}
var Util = {
	getPageX: function(ev) {
		return ev.pageX || ev.changedTouches[0].pageX;
	},
	getPageY:function(ev) {
		return ev.pageY || ev.changedTouches[0].pageY;
	},
};
var Observer = {
	mo: null,
	onDOMChange: function(records) {
		for(let record of records) {
			if(record.target.className !== "selector-element") {
				let style = record.target.style;
				let i = 0;
				var list = {};
				while(style[i]) {
					let key = style[i];
					if(key.indexOf("-") != -1) {
						let sp = key.split("-");
						key = sp[0] + sp[1].charAt(0).toUpperCase() + sp[1].slice(1);
					}
					list[key] = style[style[i]];
					i++;
				}
				domController.elements.elementList[record.target.getAttribute("data-id")].onStyleChange(list);
				domController.setSelectorElement();
			}
		}
	},
};
function iframeOnLoad() {
	elementCreator = new ElementCreator();
	cssDataLists = new CssDataLists();
	log = new LogController();
	input = new InputController();
	iframe = new Iframe();
	editArea = new EditArea();
	domController = new DOMController();
	iframe.doc.getElementsByTagName('html')[0].style.fontSize = "16px";
	cssUnits.onResize();
	Observer.mo = new MutationObserver(Observer.onDOMChange);
	var filter = ["style"];
	var moOption = {
		attributes: true,
		subtree: true,
		attributeOldValue: true,
		attributeFilter: filter
	};
	Observer.mo.observe(iframe.doc.body, moOption);
	keyController = new keyboardController();
}
class CssDataLists {
	constructor() {
		this.unit = ["px","rem","em","%","vh","vw","vmin","vmax"];
		var units = ["inherit","px","rem","em","%","vh","vw","vmin","vmax","V"];
		var autoWithUnits = ["auto","inherit","px","rem","em","%","vh","vw","vmin","vmax","V"];
		this.mergedAtrs = ["margin", "padding","flex"];
		this.ifFlex = ["flexDirection","flexWrap","justifyContent","alignItems","alignContent"];
		this.ifParentIsFlex = ["flex","flexGrow","flexShrink","flexBasis","order"];
		this.data = {
			position: { unit: ["static", "relative", "absolute", "fixed"], child: ["top","left","right","bottom"], },
			top: { unit: units, parent: "position", },
			left: { unit: units, parent: "position", },
			right: { unit: units, parent: "position", },
			bottom: { unit: units, parent: "position", },
			float: { unit: ["none", "left", "right"] },
			clear: { unit: ["left", "right", "both"] },
			zIndex: { unit: [] },
			display: { unit: ["block", "inline", "inline-block", "flex", "inline-flex", "none", "inherit"], 
				child: ["flexDirection","flexWrap","justifyContent","alignItems","alignContent",] },
			flexDirection: { unit: ["row","row-reverse","column","column-reverse"], parent: "display" },
			flexWrap: { unit: ["nowrap","wrap","wrap-reverse"], parent: "display" },
			justifyContent: { unit: ["flex-start","flex-end","center","space-around","spane-between"], parent: "display" },
			alignItems: { unit: ["stretch","flex-start","flex-end","center","base-line"], parent: "display" },
			alignContent: { unit: ["stretch","flex-start","flex-end","center","space-around","spane-between"], parent: "display" },

			parentElement_display: { unit: ["block", "inline", "inline-block", "flex", "inline-flex", "none", "inherit"],
				child: ["flex","flexGrow","flexShrink","flexBasis","alignSelf","order"], },
			flex: { unit: [], parent: "parentElement_display" },
			flexGrow: { unit: [], parent: "parentElement_display" },
			flexShrink: { unit: [], parent: "parentElement_display" },
			flexBasis: { unit: autoWithUnits, parent: "parentElement_display" },
			alignSelf: { unit: ["stretch","flex-start","flex-end","center","space-around","spane-between"],parent: "parentElement_display" },
			order: { unit: [], parent: "parentElement_display" },

			opacity: { unit: [] },
			backgroundColor: { unit: ["rgba(,,,)","rgb(,,)","transparent",], },
			width: { unit: autoWithUnits, },
			height: { unit: autoWithUnits, },
			margin: { unit: autoWithUnits, child: ["marginTop","marginLeft","marginRight","marginBottom"], },
			marginTop: { unit: autoWithUnits, parent: "margin", },
			marginLeft: { unit: autoWithUnits, parent: "margin", },
			marginRight: { unit: autoWithUnits, parent: "margin", },
			marginBottom: { unit: autoWithUnits, parent: "margin", },
			padding: { unit: units, child: ["paddingTop","paddingLeft","paddingRight","paddingBottom"], },
			paddingTop: { unit: units, parent: "padding", },
			paddingLeft: { unit: units, parent: "padding", },
			paddingRight: { unit: units, parent: "padding", },
			paddingBottom: { unit: units, parent: "padding", },
		};
		this.bodyAtrs = ["backgroundColor","width","height","padding","paddingTop","paddingLeft","paddingRight","paddingBottom"];
		this.dlist = {};
		this.tempOp = {};
		this.el = document.getElementById('inp-area');
	}
	createAutoComplete(list) {
		for(let atr in this.data) {
			let dlist = document.createElement('dataList');
			dlist.id = "dlist-" + atr;
			for(let val of this.data[atr]["unit"]) {
				if(val === "V") {
					let op = document.createElement('option');
					op.textContent = "variable";
					op.value = "V.";
					dlist.appendChild(op);
				} else {
					let op = document.createElement('option');
					op.value = val;
					dlist.appendChild(op);
				}
			}
			this.dlist[atr] = dlist;
			this.el.appendChild(dlist);
			list[atr].autocomplete = true;
			list[atr].setAttribute("list", "dlist-"+ atr);
		}
	}
	onInputChange(atr, val) {
				//AutoComplete naosu
		this.eraseTemp(atr);
		if(atr === "parentElement_display") {
		} else if(this.mergedAtrs.indexOf(atr) !== -1) {

		} else if(this.data[atr] && this.data[atr].unit.indexOf("px") !== -1) {
			if(!isNaN(parseInt(val))) {
				this.tempOp[atr] = [];
				var num = (parseInt(val));
				for(let unit of this.unit) {
					let op = document.createElement('option')
					op.value = num + unit;
					this.dlist[atr].appendChild(op);
					this.tempOp[atr].push(op);
				}
			} else {

			}
		} else {

		}
	}
	eraseTemp(atr) {
		if(this.tempOp[atr]) {
			for(let op of this.tempOp[atr]) {
				op.parentNode.removeChild(op);
			}
			this.tempOp[atr] = null;
		}
	} 
}
class ElementCreator {
	constructor() {}
	input(atr) {
		var inpEl = document.createElement('input');
		inpEl.setAttribute("type", "text");
		inpEl.setAttribute("id", "inp-"+atr);
		inpEl.setAttribute("onkeyup", "input.onInputChange(\'" + atr + "\')");
		inpEl.setAttribute("onchange", "input.onInputChange(\'" + atr + "\')");
		return inpEl;
	}
}
class InputController {
	constructor() {
		this.el = document.getElementById("inp-area");
		this.textArea = document.getElementById("inp-text-area");
		this.value = {};
		this.picker = {};
		this.onInit();
		cssDataLists.createAutoComplete(this.value);
	}
	onInit() {
		var atrs = cssDataLists.data;
		for(let atr in atrs) {
			if(!atrs[atr].parent) {
				var wrap = document.createElement('div');
				var inpEl = elementCreator.input(atr);
				var name = document.createElement('p');
				name.textContent = atr;
				if(atr.match(/[A-Z]/)) name.textContent = atr.replace(atr.match(/[A-Z]/)[0],"-"+atr.match(/[A-Z]/)[0].toLowerCase());
				if(!atrs[atr].child) {
					wrap.className = "atr-wrap";
					wrap.appendChild(name);
					wrap.appendChild(inpEl);
				} else {
					wrap.className = "mult-atr-wrap";
					let mAtr = document.createElement('div')
					mAtr.className = "mult-atr";
					mAtr.appendChild(name);
					mAtr.appendChild(inpEl);
					wrap.appendChild(mAtr);
					var sWrap = document.createElement('div');
					sWrap.className = "sub-atr-wrap";
					wrap.appendChild(sWrap);
					for(let sub of atrs[atr].child) {
						var sName = document.createElement('p');
						var sInp = elementCreator.input(sub);
						var sAtr = document.createElement('div');
						sAtr.className = 'sub-atr';
						sName.textContent = sub;
						if(sub.match(/[A-Z]/)) sName.textContent = sub.replace(sub.match(/[A-Z]/)[0],"-"+sub.match(/[A-Z]/)[0].toLowerCase());
						sAtr.appendChild(sName);
						sAtr.appendChild(sInp);
						sWrap.appendChild(sAtr);
						this.value[sub] = sInp;
					}
				}
				this.value[atr] = inpEl;
				this.el.appendChild(wrap);
			}
		}
		var picker = ["backgroundColor"];
		for(let atr of picker) {
			let inpC = document.createElement('input');
			inpC.className = "inp-picker";
			inpC.setAttribute("type", "color");
			inpC.setAttribute("id", atr + "-picker");
			inpC.setAttribute("onchange", "input.onColorPickerChange('"+atr+"')");
			this.picker[atr] = inpC;
			this.value[atr].parentNode.appendChild(inpC);
		}
	}
	onActivated(type) {
		switch(type) {
			case "body":
				for(let atr in this.value) {
					this.value[atr].parentNode.style.display = (cssDataLists.bodyAtrs.indexOf(atr) !== -1)? "flex" : "none";
				}
				break;
			case "text":
				this.textArea.value = domController.activeElement.getText();
				this.textArea.parentNode.style.display = "flex";
				for(let atr in this.value) {
					this.value[atr].parentNode.style.display = "none";
				}
				return;
			default: 
				for(let atr in this.value) {
					this.value[atr].parentNode.style.display = "flex";
				}
				break;
		} 
		this.textArea.parentNode.style.display = "none";
	}
	onActiveElementChange(css) {
		if(domController) {
			this.onActivated(domController.activeElement.type);
		} else this.onActivated("body");
		if(domController && domController.activeElement.type !== "text") {
			for(let key in this.value) {
				this.value[key].value = css.value[key];
			}
			if(domController.activeElement.parent){
				this.value.parentElement_display.value = domController.activeElement.parent.css.value.display;
			}
			this.changeMargin();
		}
	}
	reloadCss() {
		let css = domController.activeElement.css;
		for(let key in this.value) {
			this.value[key].value = css.value[key];
		}
		if(domController.activeElement.parent) this.value.parentElement_display.value = domController.activeElement.parent.css.value.display;
		this.changeMargin();
	}
	changeMargin() {
		let top = this.value.marginTop.value;
		let right = this.value.marginRight.value;
		let bottom = this.value.marginBottom.value;
		let left = this.value.marginLeft.value;
		this.value.margin.value = createVal(top,right,bottom,left);
		top = this.value.paddingTop.value;
		right = this.value.paddingRight.value;
		bottom = this.value.paddingBottom.value;
		left = this.value.paddingLeft.value;
		this.value.padding.value = createVal(top,right,bottom,left);
		function createVal(top,right,bottom,left) {
			let val;
			if(right == left) {
				if(top == bottom) {
					if(right == top) val = top;
					else val = top +" "+ left; 
				}
				else val = top +" "+ left +" "+ bottom;
				}
			else val = top +" "+ right +" "+ bottom +" "+ left;
			return val;
		}
	}
	onTextChange() {
		domController.activeElement.setText(this.textArea.value);
		domController.setSelectorElement();
	}
	onInputChange(atr) {
		setTimeout(this.onInputChange2.bind(this,atr), 1, true);
	}
	onInputChange2(atr) {
		if(atr === "parentElement_display") {
			domController.activeElement.parent.el.style["display"] = this.value[atr].value;
		}
		domController.activeElement.el.style[atr] = this.value[atr].value;
		cssDataLists.onInputChange(atr, this.value[atr].value);
	}

	// onUnitChange(atr) {
	// 	console.log(atr);
	// 	if(this.isUnit(this.unit[atr].value)) {
	// 		for(let u of cssDataLists.unit) {
	// 			let regExp = new RegExp( u, "g" ) ;
	// 			this.value[atr].value = this.value[atr].value.replace(regExp, this.unit[atr].value);
	// 		}
	// 		domController.activeElement.el.style[atr] = this.value[atr].value + this.unit[atr].value;
	// 	}
	// 	else if(this.unit[atr].value === "free") {}
	// 	else {
	// 		domController.activeElement.el.style[atr] = this.unit[atr].value;
	// 		this.value[atr].value = this.unit[atr].value;
	// 	}
	// 	this.onInputChange(atr);
	// }
	onColorPickerChange(atr) {
		this.value[atr].value = this.picker[atr].value;
		this.onInputChange(atr);
	}
	isUnit(unit) {
		if(cssDataLists.unit.indexOf(unit) != -1) return true;
		else return false;
	}
}

class EditArea {
	constructor() {
		this.el = document.getElementById("edit");
		this.treeEl = document.getElementById("tree");
		this.bgColor = "0,0,0";
		this.editIsOpen = true;
		this.treeIsOpen = true;
		this.changeOpacity(50);
		this.treeButton = document.createElement('p');
		this.treeButton.className = "tree-button";
		this.treeButton.innerText = ">>";
		document.body.appendChild(this.treeButton);
		this.treeButton.addEventListener('mousedown', this.toggleTree.bind(this));
	}
	changeOpacity(v) {
		this.el.style.backgroundColor = "rgba("+this.bgColor+","+ v/100 +")";
		this.treeEl.style.backgroundColor = "rgba("+this.bgColor+","+ v/100 +")";
	}

	toggleTree() {
		if(this.treeIsOpen) this.closeTree();
		else this.openTree();
	}
	toggleEdit() {
		if(this.editIsOpen) this.closeEdit();
		else this.openEdit();
	}
	openEdit() {
		this.el.style.opacity = 1;
		this.el.style.transform = "translateX(0px)";
		this.treeButton.style.right = "350px";
		this.treeButton.style.transform = "rotate(180deg)";
		this.editIsOpen = true;
	}
	closeEdit() {
		if(this.treeIsOpen) {
			this.closeTree();
		} else 
		this.el.style.opacity = 1;
		this.el.style.transform = "translateX(100%)";
		this.treeButton.style.right = "0px";
		this.editIsOpen = false;
		this.treeButton.style.transform = "rotate(180deg)";
	}
	openTree() {
		if(this.editIsOpen) {
			this.treeEl.style.opacity = 1;
			this.treeEl.style.transform = "translateX(0px)";
			this.treeButton.style.right = "700px";
			this.treeIsOpen = true;
			this.treeButton.style.transform = "";
		} else this.openEdit();
	}
	closeTree() {
		this.treeEl.style.opacity = 0;
		this.treeEl.style.transform = "translateX(100%)";
		this.treeButton.style.right = "350px";
		this.treeIsOpen = false;
		this.treeButton.style.transform = "rotate(180deg)";
	}
	onElementMove() {
		this.el.style.opacity = 0;
		this.el.style.transform = "translateX(200%)";
		this.treeEl.style.opacity = 0;
		this.treeEl.style.transform = "translateX(200%)";
		this.treeButton.style.right = "0px";
	}
	onElementMoveEnd() {
		if(this.editIsOpen) this.openEdit();
		if(this.treeIsOpen) this.openTree();
	}
}
class Iframe {
	constructor() {
		this.el;
		this.window;
		this.doc;
		this.head;
		this.onInit();
		this.target = {
			el: null,
			x: null,
			y: null,
			type: {
				v: null,
				h: null,
				vval: null,
				hval: null,
				vUnit: null,
				hUnit: null,
			}
		};
		this.dragging = false;
		this.doc.body.addEventListener('mousedown', this.onMousedown.bind(this));
		this.doc.body.addEventListener('mousemove', this.onMousemove.bind(this));
		this.doc.body.addEventListener('mouseup', this.onMouseup.bind(this));
		this.doc.body.addEventListener('mouseleave', this.onMouseup.bind(this));
	}
	onInit() {
		this.el = document.createElement("iframe");
		document.body.appendChild(this.el);
		this.window = this.el.contentWindow;
		this.doc = this.window.document;
		this.head = this.doc.getElementsByTagName('head')[0];
		let css = this.doc.createElement("link");
		css.setAttribute("rel", "stylesheet");
		css.setAttribute("href", "./css/reset.css");
		this.head.appendChild(css);
		let testcss = this.doc.createElement("link");
		testcss.setAttribute("rel", "stylesheet");
		testcss.setAttribute("href", "./css/test.css");
		this.head.appendChild(testcss);
	}
	onMouseup(ev) {
		if(this.dragging) {
			console.log(ev.type);
			this.moveAnime(ev);
			this.dragging = false;
			editArea.onElementMoveEnd();
			domController.selectorElement.style.animationIterationCount = "infinite";
			input.reloadCss();
		}
	}
	onMousemove(ev) {
		if(this.dragging) {
			console.log(ev);
			requestAnimationFrame(this.moveAnime.bind(this, ev));
		}
	}
	moveAnime(ev) {
		editArea.onElementMove();
		let x = Util.getPageX(ev) - this.target.x;
		let y = Util.getPageY(ev) - this.target.y;
		domController.activeElement.el.style[this.target.type.h] = this.pxToUnit(x, this.target.type.hUnit) + this.target.type.hval + this.target.type.hUnit;
		domController.activeElement.el.style[this.target.type.v] = this.pxToUnit(y, this.target.type.vUnit) + this.target.type.vval + this.target.type.vUnit;
	}
	pxToUnit(val ,unit) {
		return val;
	}
	onMousedown(ev) {
		if(ev.target.getAttribute("data-id") !== "n0") {
			domController.selectorElement.style.animationIterationCount = 1;
			this.dragging = true;
			let target = domController.elements.elementList[ev.target.getAttribute("data-id")];
			domController.changeActiveElement(target);
			this.target.el = target.el;
			this.target.x = Util.getPageX(ev);
			this.target.y= Util.getPageY(ev);
			let position = target.css.value.position;
			if( position != "relative" && position != "absolute" && position != "fixed") {
				this.setType("marginTop", "marginLeft"); 
			} else {
				this.setType("top", "left");
			}
		}
	}
	setType(v, h) {
		let target = domController.activeElement;
		this.target.type.v = v;
		this.target.type.h = h;
		this.target.type.vval = target.css.getNumber(target.css.value[v]);
		this.target.type.hval = target.css.getNumber(target.css.value[h]);
		this.target.type.vUnit = target.css.getUnit(target.css.value[v]);
		this.target.type.hUnit = target.css.getUnit(target.css.value[h]);
	}
	changeIframeSize(size) {
		this.el.style.width = size;
		domController.onResize();
	}
}

class DOMController {
	constructor() {
		this.elements = new ElementsController();
		this.activeElement = this.elements.elementList["n0"];

		this.selectorElement = iframe.doc.createElement('div');
		this.selectorElement.className = 'selector-element';
		this.selectorElement.style.pointerEvents = "none";
		iframe.doc.body.appendChild(this.selectorElement);
		this.changeActiveElement(this.activeElement);
		this.createEls = {
			name: document.getElementById("createElementName"),
			type: document.getElementById("createElementType"),
			button: document.getElementById('createElementButton')
		};
		this.createEls.button.onclick = this.onCreateButtonClicked.bind(this);
	}
	onResize() {
		this.setSelectorElement();
		this.setSelectorElement(); //need 2times maybe chrome bug
	}
	changeActiveElement(el) {
		for(let key in this.elements.elementList) {
			this.elements.elementList[key].treeEl.style.color = "#000";
		}
		el.treeEl.style.color = "#f00";
		this.activeElement = el;
		this.setSelectorElement();
		input.onActiveElementChange(this.activeElement.css);
	}
	setSelectorElement() {
		let act = (this.activeElement.type === "text")? this.activeElement.parent : this.activeElement;
		this.selectorElement.style.width = act.el.offsetWidth + "px";
		this.selectorElement.style.height = act.el.offsetHeight + "px";
		let rect = act.el.getBoundingClientRect();
		this.selectorElement.style.left = rect.left + iframe.window.pageXOffset + "px";
		this.selectorElement.style.top = rect.top + iframe.window.pageYOffset + "px";
	}
	onCreateButtonClicked() {
		let type = this.createEls.type.value;
		let name = this.createEls.name.value;
		let duplicateFlag = false;
		if(!name) {
			var i = 1;
			do {
				duplicateFlag = false;
				name = type + i;
				for(let e in this.elements.elementList) {
					if(this.elements.elementList[e].name === name) duplicateFlag = true;
				}
				i++
			} while(duplicateFlag)
		} else {
			for(let e in this.elements.elementList) {
				if(this.elements.elementList[e].name === name) duplicateFlag = true;
			}
		}
		if(!duplicateFlag) {
			this.createElement(type, name);
			this.createEls.name.value = "";
			ninModal.close();
		} else { 
			alert("その名前は既に使われています。");
		}
	}
	createElement(type, name) {
		if(this.activeElement.type === "text") log.e(log.ecode[0]);
		else {
			this.elements.createElement(type ,name, this.activeElement);
			log.createElement(type, name);
		}
	}
	createTextNode() {
		if(this.activeElement.type === "text") log.e(log.ecode[0]);
		else {
			this.elements.createTextNode(this.activeElement);
			log.i("<span class=\"st-red\">textnode</span>を作成しました");
		}
	}
	removeElement() {
	}
}

class ElementsController {
	constructor() {
		this.nodeCount = 0;
		this.tree = new TreeController(this);
		this.elementNames = {};
		this.elementList = {};
		this.createBody();
	}
	createBody() {
		let id = "n" + this.nodeCount;
		this.elementNames[id] = "body";
		this.elementList[id] = new BodyElement(id, "body", "body", "html");
		this.elementList[id].setTreeEl(this.tree.createBody("body"));
		this.nodeCount++;
	}
	createElement(type, name, parent) {
		let id = "n" + this.nodeCount;
		this.elementNames[id] = name;
		this.elementList[id] = new Element(id, type, name, parent);
		this.elementList[id].setTreeEl(this.tree.createElement(name, parent.treeEl));
		this.nodeCount++;
	}
	createTextNode(parent) {
		let id = "n" + this.nodeCount;
		this.elementNames[id] = "textNode";
		this.elementList[id] = new TextNode(id, parent);
		this.elementList[id].setTreeEl(this.tree.createElement("textnode", parent.treeEl));
		this.nodeCount++;
	}
}

class TreeController {
	constructor(parent) {
		this.parent = parent;
		this.el = document.getElementById('tree');
		this.el.addEventListener('mousedown', this.onMousedown.bind(this));
		this.draggingEl;
		this.el.addEventListener('drop', this.onDrop.bind(this));
		this.el.ondragover = function(ev) {
			ev.preventDefault();
		}
	}
	createBody(name) {
		let el = document.createElement('div');
		el.innerText = name;
		el.className = "tree-el-div";
		this.el.appendChild(el);
		return el;
	}
	createElement(name, parent) {
		let wrap = document.createElement('div');
		wrap.innerText = name;
		wrap.className = "tree-el-div";
		wrap.draggable = true;
		wrap.addEventListener('dragstart', this.onDragStart.bind(this));
		return wrap;
	}
	changeParent(el, newParent) {
		if(newParent.type === "text") {
			log.e(log.ecode[0]);
		} else if(el.type === "text") {
			log.i("text node moved");
			el.move(newParent);
		}  else {
			log.elMove(el.name);
			el.parent = newParent;
			newParent.el.appendChild(el.el);
			newParent.treeEl.appendChild(el.treeEl);
		}
	}
	onMousedown(e) {
		if(e.target.getAttribute("data-id") != null) {
			domController.changeActiveElement(this.parent.elementList[e.target.getAttribute("data-id")]);
		}
	}
	onDragStart(ev) {
		this.draggingEl = ev.target.getAttribute('data-id');
	}
	onDrop(ev) {
		if(ev.target.getAttribute('data-id') && this.draggingEl !== ev.target.getAttribute('data-id'))
		{
			this.changeParent(this.parent.elementList[this.draggingEl], this.parent.elementList[ev.target.getAttribute('data-id')]);
			domController.setSelectorElement();
		}
	}
}

class BaseElement {
	constructor(id, type, name, parent) {
		this.id = id;
		this.type = type;
		this.name = name;
		this.parent = parent;
		this.treeEl;
		this.el;
		this.css = new CssClass(this);
	}
	setTreeEl(el) {
		this.treeEl = el;
		this.treeEl.setAttribute('data-id', this.id);
	}
	onStyleChange(list) {
		this.css.setList(list);
	}
	setChild() {

	}
	removeChild() {

	}
}
class BodyElement extends BaseElement {
	constructor(id, type, name, parent) {
		super(id,type, name, "");
		this.el = iframe.doc.getElementsByTagName('body')[0];
		this.el.setAttribute('data-id', this.id);
	}
}
class Element extends BaseElement{
	constructor(id, type, name, parent) {
		super(id, type, name, parent);
		this.onCreate();
	}
	onCreate() {
		this.el = iframe.doc.createElement(this.type);
		this.el.setAttribute('data-id', this.id);
		this.parent.el.appendChild(this.el);
	}
	setTreeEl(el) {
		super.setTreeEl(el);
		domController.changeActiveElement(this);
		this.parent.treeEl.appendChild(this.treeEl);
	}
}
class TextNode {
	constructor(id, parent) {
		this.type = "text"
		this.id = id;
		this.parent = parent;
		this.treeEl;
		this.el = [];
		this.el.push(iframe.doc.createTextNode(""));
		this.parent.el.appendChild(this.el[0]);
		this.text = "";
	}
	setTreeEl(el) {
		this.treeEl = el;
		this.treeEl.setAttribute('data-id', this.id);
		domController.changeActiveElement(this);
		this.parent.treeEl.appendChild(this.treeEl);
	}
	move(newParent) {
		for(let el of this.el) {
			newParent.el.appendChild(el);
			this.parent = newParent;
		}
		newParent.treeEl.appendChild(this.treeEl);
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
		text = text.replace( / /g,"\u00a0");
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


class CssClass {
	constructor(parent) {
		this.parent = parent;
		this.value = {
			display: "",
			position: "",
			top: "",
			left: "",
			bottom: "",
			right: "",
			width: "",
			height: "",
			backgroundColor: "",
			margin: "",
			marginTop: "",
			marginRight: "", 
			marginBottom: "",
			marginLeft :"",
			padding: "",
			paddingTop: "",
			paddingRight: "", 
			paddingBottom: "",
			paddingLeft :"",
			float: "",
			clear: "",
			zIndex: "",
			flexDirection: "",
			flexWrap: "",
			justifyContent: "",
			alignItems: "",
			alignContent: "",
			flex: "",
			flexGrow: "",
			flexShrink: "",
			flexBasis: "",
			order: "",
			alignSelf: "",
			opacity: "",
		};
	}
	getCssAtr(atr) {
		var i = 0;
		while(i != null) { 
			i = atr.match(/[A-Z]/);
			if(i != null) i = i.index;
			if(i != null) atr = atr.slice(0, i) + "-" + atr.charAt(i).toLowerCase() + atr.slice(i+1, atr.length);
		}
		return atr;
	}
	getCss(name) {
		var f = false;
		var str = "." + name + "{";
		for(let atr in this.value) {
			if(this.value[atr] != "") {
				let cssAtr = this.getCssAtr(atr);
				str += cssAtr + ":" + this.value[atr] + ";";
				f = true;
			}
		}
		str += "}";
		if(!f) str = "";
		return str;
	}
	setList(list) {
		var flag;
		for(var oAtr in this.value) {
			flag = false;
			for(var nAtr in list) {
				if(oAtr === nAtr) {
					this.set(nAtr, list[nAtr]);
					flag = true;
				}
			}
			if(!flag) this.set(oAtr, "");
		}
	}
	set(atr, value) {
		if(this.value[atr] !== value) {
			log.onStyleChange(this.parent.name ,atr, this.value[atr], value);
			this.value[atr] = value;
		}
	}
	getAtrType(atr) {
		if(data.type1.indexOf(atr) != -1) return 1;
		else if(data.type2.indexOf(atr) != -1) return 2;
		else if(data.type3.indexOf(atr) != -1) return 3;
	}
	getUnit(value) {
		for(var i = cssDataLists.unit.length - 1; i >= 0; i--) {
			if(value.indexOf(cssDataLists.unit[i]) != -1) return cssDataLists.unit[i];
		}
		return false;
	}
	getNumber(value) {
		for(let atr of cssDataLists.unit) {
			if(value.indexOf(atr) != -1) value = value.slice(0, value.indexOf(atr));
		}
		value = parseInt(value);
		if(!value) {
			return 0;
		}
		return value;
	} 
}

class ClassController {

}

class VariableController {

}
class Variable {
	
}
class HistoryController {
	redo() {

	}
	undo() {

	}
}
class LogController {
	constructor() {
		this.el = document.getElementById('log-area');
		this.logs = document.getElementById('logs');
		this.ecode = [		
			"text nodeは子要素を持つことはできません",
		];
		this.i("--welcome--");
	}
	e(msg) {
		this.el.style.backgroundColor = "red";
		this.setLog(msg);
	}
	i(msg) {
		this.el.style.backgroundColor = "blue";
		this.setLog(msg);
		this.el.innerHTML = msg;
	}
	setLog(text) {
		let el = document.createElement('p');
		el.innerHTML = text;
		this.el.innerHTML = text;
		this.logs.appendChild(el);
		this.logs.scrollTop = this.logs.scrollHeight;
	}
	toggleLogs() {
		this.logs.style.display = (this.logs.style.display !== "none")? "none" : "block";
	}
	elMove(name) {
		this.i("element " + this.wrap("st-red", name) + "moved");
	}
	createElement(type, name) {
		this.i("["+ type + "]"+ this.wrap("st-red", name) + "が作成されました。");
	}
	wrap(cssClass, data) {
		return "<span class=\"" + cssClass + "\">" + data + "</span>";
	}
	onStyleChange(name ,atr, oldVal, newVal) {
		let msg = name + "[" + atr + "] is changed";
		if(oldVal) msg += " from " + oldVal;
		if(!newVal) newVal = "null";
		msg += " to " + newVal;
		this.i(msg);
	}
}
class keyboardController {
	constructor() {
		this.keyBuffer = [];
		document.addEventListener("keyup" , this.onKeyup.bind(this));
		document.addEventListener("keydown" , this.onKeydown.bind(this));
		iframe.doc.addEventListener("keyup" , this.onKeyup.bind(this));
		iframe.doc.addEventListener("keydown" , this.onKeydown.bind(this));
	}
	onKeydown(e) {
		if(e.ctrlKey) {
			switch(e.key) {
				case "r": 
					if(!this.keyBuffer[e.keyCode]) editArea.toggleTree()
					e.preventDefault();
					break;
				case "e":
					if(!this.keyBuffer[e.keyCode]) editArea.toggleEdit()
					e.preventDefault();
					break;
				case "l":
					if(!this.keyBuffer[e.keyCode]) log.toggleLogs()
					e.preventDefault();
					break;
				case "c":
					if(!this.keyBuffer[e.keyCode]) {
						if(e.target === document.body || e.target === iframe.doc.body) {
							buttonEvents.createEl();
						}
					}
					e.preventDefault();
					break;
			}
		}
		if(e.altKey) {
			if(e.key === "Enter" && e.target.id.startsWith('inp-')) {
				console.log(e.target.id.slice(4, e.target.id.length));
			}
		}
		this.keyBuffer[e.keyCode] = true;
	}
	onKeyup(e) {
		this.keyBuffer[e.keyCode] = false;
	}
}

function onLoadFunction() {
	iframeOnLoad();
}







function save() {
	console.log("save");
	var htmlCreater = new HtmlCreater();
	console.log(htmlCreater.getHtml());
	// console.log(htmlCreater.getSavedata());
}
class HtmlCreater {
	constructor() {
		this.dom = this.getDomTree();
		this.css = this.getCss();
	}
	getHtml() {
		var html = "<!DOCTYPE html><html lang=\"ja\"><head><meta charset=\"utf-8\"><link rel=\"stylesheet\" href=\"./css/reset.css\"><link rel=\"stylesheet\" href=\"./lib/nin-lib.css\"><link rel=\"stylesheet\" href=\"./css/html-gen.css\"><title>title</title><style type=\"text/css\">"
		html += this.css + "</style>" + this.dom;
		return html;
	}
	getSavedata() {
		
	}
	getCss() {
		var str = "";
		for(let name in domController.elements.elementList) {
			if(domController.elements.elementList[name].type != "text")
				str += domController.elements.elementList[name].css.getCss(name);
		}
		return str;
	}
	getDomTree() {
		var dom = new DOMItem(iframe.doc.body);
		var str = dom.createHtml("");
		return str;
	}

}
class DOMItem {
	constructor(el) {
		this.el = el;
		if(el.nodeName == "#text") {
			this.tagName = "textnode";
		} else if(el.nodeName == "BR") {
			this.tagName = "br";
		} else {
			this.tagName = el.tagName;
			this.name = el.getAttribute("data-id");
			this.css = domController.elements.elementList[this.name].css;
			this.children = [];
			this.getChildren();
		}
	}
	getChildren() {
		for(var i = 0; i < this.el.childNodes.length; i++) {
			if(this.el.childNodes[i].className !== "selector-element") this.children.push(new DOMItem(this.el.childNodes[i]));
		}
		// console.log(this.css);
		// console.log(this.children);
	}
	createHtml(str) {
		switch(this.tagName) {
			case "textnode":
				str += this.el.nodeValue;
				break;
			case "br":
				str += "<br>";
				break;
			default :
				str += "<"+ this.tagName.toLowerCase() +" class=\"" + this.name + "\">";
				for(var i = 0; i < this.children.length; i++) {
					str = this.children[i].createHtml(str);
				}
				str += "</"+ this.tagName.toLowerCase() +">";
		}
		return str;
	}
}