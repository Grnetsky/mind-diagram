import { leChartPen } from "@meta2d/le5le-charts/src/common";

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
    console.log('bindPen',pen);
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
    this.box.style.overflow = 'hidden';
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
   * @param item 该toolItem配置项 包含 显示name 事件event 回调函数func 和该按钮的样式style
   * */
  setChildDom(pen, item ){
    const dom = document.createElement('span');
    dom.innerHTML = item.icon? `<img/ src="${item.icon}" title="${item.name}">` : item.name;
    typeof item.style === 'object' && this.setStyle(dom, item.style);
    if(item.event){
      let eventFunc = function (){
        item.func(this);
      };
      dom.addEventListener(item.event,eventFunc.bind(pen));
    }
    return dom;
  }
  setFuncList(funcList){
    this.funcList = funcList;
    this.renderChildren();
  }
  clearFuncList(){
    this.funcList = [];
    this.renderChildren();
  }
}
