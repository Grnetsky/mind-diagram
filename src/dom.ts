import { leChartPen } from "@meta2d/le5le-charts/src/common";
import {CollapseChildPlugin, toolBoxPlugin} from "@meta2d/mind-diagram";

export function createDom(name,style,even = undefined,func = undefined,className = undefined) {
  // 创建dom
  let dom = document.createElement(name);
  // 设置dom样式
  if(style && typeof style === 'object'){
    Object.assign(dom.style,style);
    className && dom.classList.add(className);
  }else {
    throw new Error('createDom error: parma "style" must be a Object');
  }
  // 绑定dom事件；
  if(typeof even === 'string' && typeof func === 'function'){
    dom.addEventListener(even,(e)=>{
      func();
    });
  }
  return dom;
}


export class ToolBox {
  box: HTMLElement;
  x: number;
  y:number;
  pen:leChartPen;
  funcList: {name:string,func?:Function}[];
  boxStyle: {};
  constructor(parentHtml,style = {}) {
    this.box = document.createElement('div');
    this.box.style.backgroundColor = '#fff';
    this.box.style.borderRadius = '5px';
    this.box.style.boxShadow = '0px 6px 20px rgba(25,25,26,.06), 0px 2px 12px rgba(25,25,26,.04)';
    this.box.style.width = 'max-content';
    this.box.style.height = '40px';
    this.box.style.padding = '6px';
    this.box.className = 'toolBox';
    this.box.style.display = 'none';
    this.box.style.zIndex = '999';
    this.setStyle(this.box,style);
    parentHtml.appendChild(this.box);
  }
  setStyle(box, style){
    Object.keys(style).forEach(i=>{
      box.style[i] = style[i];
    });
  }
  hide(){
    this.box.style.display = 'none';
  }
  bindPen(pen){
    this.pen = pen;
  }
  show(){
    this.box.style.display = 'flex';
    this.box.style.flexDirection = 'row';
  }
  translatePosition(pen){
    this.hide();
    const store = pen.calculative.canvas.store;
    const worldRect = pen.calculative.worldRect;
    this.box.style.position = 'absolute';
    this.box.style.outline = 'none';
    this.box.style.left = worldRect.x + store.data.x + worldRect.width /2 + 'px';
    this.box.style.top = worldRect.y + store.data.y + -80 + 'px';
    this.box.style.userSelect = 'none';
    this.show();
  }
  renderChildren(){
    this.box.style.display = 'flex';
    this.box.style.justifyContent = 'center';
    this.box.style.alignItems = 'center';
    // this.box.style.overflow = 'hidden';
    this.box.style.position = 'relative';
    this.box.style.transform = 'translateX(-50%)';
    const fragmentChild = new DocumentFragment();
    this.box.innerHTML = '';

    let stylesheet = document.styleSheets[0]; // 选择第一个样式表
    stylesheet.insertRule(".toolbox_item {" +
      "display: flex;" +
      "justify-content: center;" +
      "align-items: center;" +
      "height: 100%;" +
      "margin: 0 1px;" +
      "cursor: pointer;" +
      "transition: all .3s ease;" +
      "border-radius: 5px;" +
      "padding: 0 5px;" +
      "}", 0);
    stylesheet.insertRule(".toolbox_item:hover {" +
      "background-color: #eee;" +
      "}", 0);

    this.funcList.forEach(i=>{
      if(i.name){
        let itemsSpan =this.setChildDom(this.pen,i);
        itemsSpan.className = 'toolbox_item';
        fragmentChild.appendChild(itemsSpan);
      }
    });
    this.box.appendChild(fragmentChild);
  }

  /**
   * @description 创造子节点  设置样式 配置事件函数等；
   * @param pen 操作的图元
   * @param item 该toolItem配置项 包含 显示name 事件event 回调函数func 和该按钮的样式style 与setDom自定义样式
   * */
  setChildDom(pen, item ){
    // 是否应该在这设置为WebComponent？
    const dom = document.createElement('div');
    // TODO 影子DOM 实现 自定义工具栏item样式
    dom.attachShadow({mode:'open'}).innerHTML = item.setDom? item.setDom(item,dom) : (item.icon? `<img/ src="${item.icon}" title="${item.name}">` : item.name);
    // 设置style样式
    typeof item.style === 'object' && this.setStyle(dom, item.style);
    if(item.event){
      let eventFunc = function (){
        item.func(this);
      };
      dom.addEventListener(item.event,eventFunc.bind(pen));
    }
    if(item.children){
      dom.addEventListener('click',(e)=>{
        //TODO 此处 container显示和隐藏 应当实现
        dom.childrenDom.style.visibility === 'visible'? dom.childrenDom.style.visibility = 'hidden' : dom.childrenDom.style.visibility = 'visible';
      });
    }
    let containerDom = null;
    if(item.children && item.children.length > 0){
      // 是否重写dom

      // TODO setChildrenDom是否也需要实现影子dom
      if(
        typeof item.setChildrenDom === 'function'
      ){
        // 重新child dom
        let dom = item.setChildrenDom(item);
        if(typeof dom === 'string'){
          let div = document.createElement('div');
          div.innerHTML = dom;
          containerDom = div;
        }else{
          containerDom = dom;
        }
      }else{
        containerDom = createDom('div',{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          position:'absolute',
          visibility:'hidden',
          top:'38px',
          backgroundColor:'#fff',
          borderRadius:'5px',
          padding:'3px',
          width:'max-content',
          boxShadow: '0px 6px 20px rgba(25,25,26,.06), 0px 2px 12px rgba(25,25,26,.04)',
        });
      }
      let fragment = new DocumentFragment();
      for(let i of item.children){
        let node = createDom('div',
          {
            padding: '5px 8px'
          },i.event,function(){
            i.func(this);
          }.bind(pen),'toolbox_item');
        node.attachShadow({mode: "open"}).innerHTML = i.setDom? i.setDom(i,node) :( (i.icon && i.name)? '<span style="padding-right: 30px">'+ i.icon+'</span> <span>'+i.name+'</span>' :'<span>'+(i.name || i.icon)+'</span>');
        fragment.appendChild(node);
      }
      dom.style.position = 'relative';
      containerDom.appendChild(fragment);
      containerDom.style.position = 'absolute';
      dom.shadowRoot.appendChild(containerDom);
      (dom as any).childrenDom = containerDom;

// 添加样式到元素
    }
    return dom;
  }
  setFuncList(funcList){
    this.funcList = funcList;
    this.renderChildren();
  }
  clearFuncList(){
    this.setFuncList([]);
  }
}


export class CollapseButton {
  box: HTMLElement;
  x: number;
  y:number;
  penId: string;
  icon = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" t="1695196647299" class="icon" viewBox="0 0 1024 1024" version="1.1" p-id="15005" width="200" height="200"><path d="M353.96380445 470.37781333c-28.69589333 26.00504889-28.30791111 68.80711111 0.94776888 94.40711112l329.83722667 288.60643555c9.45834667 8.27619555 23.83416889 7.31704889 32.11036445-2.14129778s7.31704889-23.83416889-2.14129778-32.11036444l-329.83722667-288.60643556c-8.78023111-7.68227555-8.87921778-18.71075555-0.35612445-26.43399111l330.48803556-299.50520889c9.31157333-8.43889778 10.02040889-22.82951111 1.58037334-32.14222222-8.43889778-9.31157333-22.82951111-10.02040889-32.14222223-1.58037333l-330.48803555 299.50520888z" p-id="15006" fill="#ffffff"/></svg>';
  count = 0;
  constructor(parentHtml,style = {}) {
    this.box = document.createElement('div');
    this.box.style.backgroundColor = '#4480F9';
    this.box.style.borderRadius = '50%';
    this.box.style.boxShadow = '0px 6px 20px rgba(25,25,26,.06), 0px 2px 12px rgba(25,25,26,.04)';
    this.box.style.width = '14px';
    this.box.style.height = '14px';
    // this.box.style.padding = '2px';
    this.box.className = 'hide_button';
    this.box.style.display = 'none';
    this.box.style.zIndex = '999';
    this.box.style.cursor = 'pointer';
    this.box.style.display = 'flex';
    this.box.style.justifyContent = 'center';
    this.box.style.alignItems = 'center';
    this.box.style.color = "#fff";
    this.box.style.fontSize = '400';
    this.setStyle(this.box,style);
    parentHtml.appendChild(this.box);
  }
  onClick(){
    if(this.mind.childrenVisible){
      let count = CollapseChildPlugin.collapse(this);
      this.mind.singleton.collapseButton.setNumber(count);

      // 从当前节点处更新
      toolBoxPlugin.update(meta2d.findOne(this.id));
    }else{
      CollapseChildPlugin.extend(this);
      this.mind.singleton.collapseButton.setIcon();
      toolBoxPlugin.update(meta2d.findOne(this.id));
    }
  }
  setIcon(){
    this.box.innerHTML = this.icon;
  }
  // 折叠子项 level为折叠层数 默认则折叠所有子项
  setStyle(box, style){
    Object.keys(style).forEach(i=>{
      box.style[i] = style[i];
    });
  }
  setNumber(_number){
    this.box.innerHTML = _number;
  }
  hide(){
    this.box.style.display = 'none';
  }
  show(){
    this.box.style.display = 'flex';
  }
  bindPen(penId){
    let pen = meta2d.findOne(penId);
    this.penId = penId;
    this.box.onclick = this.onClick.bind(pen);
    if(pen.mind.childrenVisible){
      this.box.innerHTML = this.icon;
    }else{
      this.box.innerHTML = pen.mind.allChildrenCount;
    }
  }
  translatePosition(pen,position = 'right'){
    this.hide();
    const store = pen.calculative.canvas.store;
    const worldRect = pen.calculative.worldRect;
    this.box.style.position = 'absolute';
    this.box.style.outline = 'none';
    let pos = {
      x:"-999",
      y:"-999"
    };
    switch (position) {
      case 'right':
        pos.x = worldRect.x + store.data.x + worldRect.width + 6 + 'px';
        pos.y = worldRect.y + store.data.y + worldRect.height / 2 + 'px';
        break;
      case 'left':
      case 'top':
      case 'bottom':
    }
    this.box.style.left = pos.x;
    this.box.style.top =  pos.y;
    this.box.style.transform = "translateY(-50%)";
    this.box.style.userSelect = 'none';
    // this.show();
  }

}
