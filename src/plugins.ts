import {getRect, Pen, setGlobalAlpha, disconnectLine, connectLine as connectLineMeta, connectLine} from "@meta2d/core";
import {ToolBox, CollapseButton, createDom} from "@meta2d/mind-diagram/src/dom";
import {
  generateColor,
} from "@meta2d/mind-diagram";
import {Logger} from "typedoc";
import {defaultFuncList} from "@meta2d/mind-diagram/src/default";

export interface Plugin {
  name:string;
  install:(manager,...args)=> void;
  status:boolean;
}

class PubSub {
  private subscribers: { [event: string]: [(data: any) => void] } = {};

  // 订阅事件
  subscribe(event: string, callback: (data: any) => void): void {
    if (!this.subscribers[event]) {
      // @ts-ignore
      this.subscribers[event] = [];
    }
    this.subscribers[event].push(callback);
  }

  // 取消订阅
  unsubscribe(event: string, callback: (data: any) => void): void {
    if (this.subscribers[event]) {
      // @ts-ignore
      this.subscribers[event] = this.subscribers[event].filter((subscriberCallback) => subscriberCallback !== callback);
    }
  }

  // 发布事件
  publish(event: string, data: any): void {
    if (this.subscribers[event]) {
      this.subscribers[event].forEach((callback) => callback(data));
    }
  }
}

let pluginsMessageChannels = new PubSub();

export let openAndClosePlugin: Plugin = {
  name:"openAndClose",
  status: false,
  install:(manager,pen)=>{
    // 获取pen对象
  }
};
export let toolBoxPlugin: any = {
  name:'toolBox',
  status: false,
  childrenGap: 20,
  levelGap: 200,
  // 计算子节点的颜色和位置
  calChildrenPosAndColor(pen,recursion = true, position='right'){
    if(!pen)return;
    let children = pen.mind?.children;
    if(!children)return;
    let worldReact = meta2d.getPenRect(pen); //获取该节点的世界坐标宽度信息
    // let allHeight = 0; // 子节点所占的高度
    let allWidth = 0; // 子节点所占的宽度
    // 子节点的世界坐标信息集合
    let penRects = [];
    for(let i = 0 ;i<children.length;i++){
      let child = children[i];
      let childWorldRect = meta2d.getPenRect(child);
      penRects.push(childWorldRect);
    }
    let topHeight = 0;
    let topWidth = 0;
    // 设置值
    let generateColorFunc = generateColor();
    toolBoxPlugin.calcChildWandH(pen,position);
    for(let i = 0;i<children.length;i++){
      // 循环设置每个
      let child = children[i]; // 获取子元素
      topHeight += ((children[i-1]?.mind?.maxHeight) || 0) +(children[i-1]?(toolBoxPlugin.childrenGap):0) ;
      topWidth += ((children[i-1]?.mind?.maxWidth) || 0) +(children[i-1]?(toolBoxPlugin.childrenGap):0) ;

      let nodeColor = pen.mind.color || generateColorFunc.next().value;
      switch (position){
        case 'right':
          child.mind.x = worldReact.x + worldReact.width + toolBoxPlugin.levelGap;
          child.mind.y = worldReact.y - 1 / 2 * pen.mind.maxHeight + topHeight + 1/2 * worldReact.height + ((child.mind?.maxHeight / 2 - 1 / 2 * penRects[i].height) || 0);
          break;
        case 'left':
          child.mind.x = worldReact.x - child.width- toolBoxPlugin.levelGap;
          child.mind.y = worldReact.y - 1 / 2 * pen.mind.maxHeight + topHeight + 1/2 * worldReact.height + ((child.mind?.maxHeight / 2 - 1 / 2 * penRects[i].height) || 0);
          break;
        case 'bottom':
          child.mind.x = worldReact.x - 1 / 2 * pen.mind.maxWidth + topWidth + 1/2 * worldReact.width + ((child.mind?.maxWidth / 2 - 1 / 2 * penRects[i].width) || 0);
          child.mind.y = worldReact.y + child.height + toolBoxPlugin.levelGap;
          break;
        case 'top':
          child.mind.x = worldReact.x - 1 / 2 * pen.mind.maxWidth + topWidth + 1/2 * worldReact.width + ((child.mind?.maxWidth / 2 - 1 / 2 * penRects[i].width) || 0);
          child.mind.y = worldReact.y - child.height - toolBoxPlugin.levelGap;
      }
      child.mind.color = nodeColor;
      if(child.mind.visible){
        meta2d.setValue({
          id: child.id,
          x: child.mind.x,
          y: child.mind.y,
          color: nodeColor
        },{render:false});
        meta2d.setVisible(child,true,false);
      }else{
        meta2d.setVisible(child,false,false);
      }
      if(recursion) toolBoxPlugin.calChildrenPosAndColor(child,true,child.mind.direction);


      // meta2d.setValue({
      //   id:child.id,
      //   x: worldReact.x + pen.mind.maxWidth + toolBoxPlugin.levelGap ,
      //   y:worldReact.y  - 1 / 2 * pen.mind.maxHeight + topHeight + 1/2*worldReact.height+((child.mind?.maxHeight / 2 - 1 / 2 * penRects[i].height) || 0),
      //   color:nodeColor
      // },{render:false});
      // meta2d.setValue({id:child.connectedLines[0].id,color:nodeColor,},{render:false});
    }
    // 最后添加的图元
    // let lastChild = children.find(child=>!child.connectedLines || child.connectedLines.length === 0);
    // if(lastChild && (!lastChild.connectedLines || lastChild.connectedLines?.length === 0)) {
    //   meta2d.updateLineType(line, 'curve');
    //   meta2d.setValue({id: line.id, color: lastChild.calculative.color, lineWidth: 2}, {render: false});
    // }
  },
  connectLine(pen,newPen,option = {position: 'top',style : 'polyline'}){
    let line = null;
    switch (option.position){
      case 'right':
        line = meta2d.connectLine(pen, newPen, pen.anchors[1], newPen.anchors[3], false);
        break;
      case 'left':
        line = meta2d.connectLine(newPen, pen, newPen.anchors[1],pen.anchors[3] , false);
        break;
      case 'bottom':
        line = meta2d.connectLine(pen, newPen, pen.anchors[2],newPen.anchors[0] , false);
        break;
      case 'top':
        line = meta2d.connectLine(newPen, pen, newPen.anchors[2],pen.anchors[0] , false);
        break;
    }
    meta2d.updateLineType(line, option.style);
  },

  // 重新设置线颜色
  reSetLinesColor(pen,recursion = true){
    let colors = generateColor();
    let children = pen.mind.children;
    if(!children || children.length === 0 )return;
    for(let i = 0 ;i<children.length;i++){
      const child = children[i];
      let line = child.connectedLines?.[0];
      if(line){
        line.mind? '' : (line.mind = {});
        line.mind.color = pen.mind.color || colors.next().value;
        meta2d.setValue({
          id:line.lineId,
          color: line.mind.color
        },{render:false});
      }
      if(recursion){
          toolBoxPlugin.reSetLinesColor(child,true);
      }
    }
  },
  // 重新递归设置连线的样式
  resetLineStyle(pen,recursion = true){
    let children = pen.mind.children;
    if(!children || children.length === 0 )return;
    for(let i = 0 ;i<children.length;i++){
      const child = children[i];
      let line = meta2d.findOne(child.connectedLines?.[0].lineId);
      if(line){
        meta2d.updateLineType(line,meta2d.findOne(pen.mindManager.rootId).mind.lineStyle);
      }
      if(recursion){
        toolBoxPlugin.resetLineStyle(child,true);
      }
    }
  },
  // 重新设置连线的位置
  resetLinePos(pen,recursion = true){
    console.log('执行resetLien');
    let children = pen.mind.children;
    if(!children || children.length === 0 )return;
    for(let i = 0 ;i<children.length;i++){
      const child = children[i];
      if(!child.connectedLines || child.connectedLines.length === 0)return;
      let line = meta2d.findOne(child.connectedLines[0].lineId);

      let prePen = meta2d.findOne(child.mind.preNodeId);
      let prePenAnchor = null;
      let lineAnchor1 = line.anchors[0];
      let penAnchor = null;
      let lineAnchor2 = line.anchors[line.anchors.length - 1];
      switch (prePen.mind.direction) {
        case 'right':
          prePenAnchor = prePen.anchors[1];
          penAnchor = pen.anchors[3];
          break;
        case 'left':
          prePenAnchor = prePen.anchors[3];
          penAnchor = pen.anchors[1];
          break;
        case 'bottom':
          prePenAnchor = prePen.anchors[2];
          penAnchor = pen.anchors[0];
          break;
        case 'top':
          prePenAnchor = prePen.anchors[0];
          penAnchor = pen.anchors[2];
          break;
      }
      // debugger
      // disconnectLine(pen,penAnchor,line,lineAnchor2);
      // disconnectLine(prePen,prePenAnchor,line,lineAnchor1);
      console.log('disconnectLine');
      if(recursion){
        toolBoxPlugin.resetLinePos(child,true);
      }
    }
  },
  // 递归修改子节点的direction属性
  resetDirection(pen,direction,recursion = true){
    let children = pen.mind.children;
    if(!children || children.length === 0 )return;
    for(let i = 0 ;i<children.length;i++){
      const child = children[i];
      child.mind.direction = direction;
      if(recursion){
        toolBoxPlugin.resetDirection(child,direction,true);
      }
    }
  },
  // 删除连线
  deleteLines(pen){
    if(!pen)return;
    let lines = [];
    pen.connectedLines?.forEach((
      i
    )=>{
      let line = meta2d.findOne(i.lineId);
      line && lines.push(line);
    });
    meta2d.delete(lines);
  },

  // 删除node
  async deleteNode(pen){
    // 删除与之相关的线
    toolBoxPlugin.deleteLines(pen);

    // 查找到对应的父级，删除其在父级中的子级列表数据
    let parent = meta2d.findOne(pen.mind.preNodeId);
    parent && parent.mind.children.splice(parent.mind.children.indexOf(pen),1);

    // 刷新界面

    // 删除meta2d数据
    await meta2d.delete(pen.mind.children);
    toolBoxPlugin.update(meta2d.findOne(pen.mindManager.rootId));
  },
  install:(manager, pen, args)=>{
    let toolbox = null;
    if(!globalThis.toolbox){
      toolbox = new ToolBox(meta2d.canvas.externalElements.parentElement,{
      });
      globalThis.toolbox = toolbox;
    }
    // 跟随移动
    toolBoxPlugin.combineLifeCycle(pen);
    meta2d.on('inactive',(targetPen)=>{
      globalThis.toolbox.hide();
    });
  },
  uninstall(){
    globalThis.toolbox = null;
  },

  funcList: defaultFuncList,
  calcChildWandH(pen,position = 'right'){
    let children = pen.mind.children || [];
    let worldRect = meta2d.getPenRect(pen);
    if(children.length ===0 || !pen.mind.childrenVisible){
      pen.mind.maxHeight = worldRect.height;
      pen.mind.maxWidth = worldRect.width;
      return {
        maxHeight: worldRect.height,
        maxWidth: worldRect.width
      };
    }
    let maxHeight = 0;
    let maxWidth = 0;
    let maxH = 0;
    let maxW = 0;
    if(position === 'right' || position === 'left'){
      for(let i = 0;i<children.length;i++){
        let child = children[i];
        let maxObj = toolBoxPlugin.calcChildWandH(child,position);
        maxHeight += maxObj.maxHeight;
        maxWidth = maxWidth > maxObj.maxWidth? maxWidth : maxObj.maxWidth;
      }
      maxHeight += toolBoxPlugin.childrenGap * (children.length - 1);
      maxH = maxHeight > worldRect.height?maxHeight : worldRect.height;
      pen.mind.maxHeight = maxH;
      pen.mind.maxWidth = maxWidth;
      return {
        maxHeight:maxH,
        maxWidth
      };
    }else {
      for(let i = 0;i<children.length;i++){
        let child = children[i];
        let maxObj = toolBoxPlugin.calcChildWandH(child,position);
        maxWidth += maxObj.maxWidth;
        maxHeight = maxHeight > maxObj.maxHeight? maxHeight : maxObj.maxHeight;
      }
      maxWidth += toolBoxPlugin.childrenGap * (children.length - 1);
      maxW = maxWidth > worldRect.width?maxWidth : worldRect.width;
      pen.mind.maxHeight = maxHeight;
      pen.mind.maxWidth = maxW;
      return {
        maxHeight,
        maxWidth: maxW
      };
    }

  },

  combineLifeCycle(target){
    let toolbox = globalThis.toolbox;
    setLifeCycleFunc(target,'onMove',(targetPen)=>{
      toolbox.hide();
    });
    setLifeCycleFunc(target,'onDestroy',(targetPen)=>{
      toolbox.hide();
      toolBoxPlugin.deleteNode(targetPen);
    });
    setLifeCycleFunc(target,'onMouseUp',(targetPen)=>{
      toolbox.bindPen(targetPen);
      toolbox.setFuncList(target.mind.isRoot?toolBoxPlugin.funcList['root']:toolBoxPlugin.funcList['leaf']);
      toolbox.translatePosition(targetPen);
    });
    setLifeCycleFunc(target,'onMouseDown',(targetPen)=>{
      toolbox.hide();
    });
  },

  // setDirection(pen,direction){
  //   return pen.mind?.direction? pen.mind.direction = direction:((pen.mind = {}) && (pen.mind.direction = direction));
  // },

  // 增加节点  同级设level为true
  async addNode(pen,position = 0, type = "mindNode2",){
    let newPen = await meta2d.addPen({
      name:type,
      mind:{
        isRoot: false,
        preNodeId:pen.id,
        children: [],
        width: 0, // 包含了自己和子节点的最大宽度
        height: 0, // 包含了自己和子节点的最大高度
        direction:pen.mind.direction
      },
      x:pen.x ,
      y:pen.y ,
      width: pen.width,
      height: pen.height,
      text: '分支主题',
      // color:generateColor((pen.mind.children[pen.mind.children.length-1])?.calculative.color),
      textColor:'#000',
      lineWidth:3,
      fontSize:16,
      borderRadius: pen.borderRadius,
    });

    // 添加节点
    if(position){
      pen.mind.children.splice(position,0,newPen);
    }else{
      pen.mind.children.push(newPen);
    }
    toolBoxPlugin.combineLifeCycle(newPen); // 重写生命周期
    let rootNode = meta2d.findOne(pen.mindManager.rootId);
    // 连线
    toolBoxPlugin.connectLine(pen,newPen,{position:pen.mind.direction,style: rootNode.mind.lineStyle});

    // 从根节点更新
    toolBoxPlugin.update(rootNode,true);
    // toolBoxPlugin.calChildrenPosition(pen);
    globalThis.toolbox.bindPen(newPen);
    globalThis.toolbox.setFuncList(toolBoxPlugin.funcList['leaf']);
    globalThis.toolbox.translatePosition(newPen);
    pluginsMessageChannels.publish('addNode',newPen);
  },
  update(pen,recursion = true){
    if(!pen)return;
    toolBoxPlugin.calChildrenPosAndColor(pen,recursion,pen.mind.direction);
    toolBoxPlugin.reSetLinesColor(pen,recursion);
    toolBoxPlugin.resetLineStyle(pen,recursion);
    toolBoxPlugin.render();
  },
  render(){
    meta2d.render();
  }
};

/**
 * @description 闭包 重写 pen的生命周期，为了追加回调函数
 * @return 生命周期操作函数，可在原生命周期回调函数基础上进行执行多个函数，可通过传参，设置函数的增加和删除，类似addEventListener 和 removeEventListener
*/
function rewritePenLifeCycle() {
  let funcMap = null;
  let funcPenMap = new Map();
  return (pen: Pen, lifeCycle, func: Function, del=false )=>{
    if(funcPenMap.has(pen) && funcPenMap.get(pen)){
      funcMap = funcPenMap.get(pen);
    }else {
      funcPenMap.set(pen,funcMap = new Map());
    }
    if(typeof func !== "function")return ()=>{
      console.warn('[rewritePenLifeCycle] warn: not a function ');
    };
    let funcListSet = new Set();
    let originFuncMap = new Map(); // 原始事件回调Map
    if(funcMap.has(lifeCycle) && funcMap.get(lifeCycle)){
      funcListSet = funcMap.get(lifeCycle);
    }else {
      originFuncMap.set(lifeCycle,pen[lifeCycle]);
      funcMap.set(lifeCycle,funcListSet);
    }
    if(del){
      funcListSet.delete(func);
    }else {
      funcListSet.add(func);
    }
    let originLifeCycle = originFuncMap.get(lifeCycle); // 原始事件;
    let rewriteFunc = (pen)=>{
      originLifeCycle?.(pen);
      funcListSet.forEach(i=>{
        // @ts-ignore
        i(pen);
      });
    };
    pen[lifeCycle] = rewriteFunc;
  };
}

// 获取函数
let setLifeCycleFunc = rewritePenLifeCycle();


export let CollapseChildPlugin: any = {
  name:'hideChildren',
  status: false,

  // 安装插件
  install(manager, pen, args){

    if(!pen.mind.singleton?.collapseButton  ){
      pen.mind.singleton = {};
      pen.mind.singleton.collapseButton = new CollapseButton(meta2d.canvas.externalElements.parentElement,{
      });
    }
    pluginsMessageChannels.subscribe('addNode',(data)=>{
      if(!data.mind.singleton?.collapseButton){
        data.mind.singleton = {};
        data.mind.singleton.collapseButton = new CollapseButton(meta2d.canvas.externalElements.parentElement,{
        });
        CollapseChildPlugin.init(data);
      }
    });
    // 跟随移动
    CollapseChildPlugin.init(pen);
  },

  // 插件卸载执行函数
  uninstall(){
  },
  init(pen){
    pen.mind.childrenVisible = true;
    pen.mind.allChildrenCount = 0;
    pen.mind.singleton.collapseButton.bindPen(pen.id);
    pen.mind.singleton.collapseButton.translatePosition(pen);
    CollapseChildPlugin.combineLifeCycle(pen);
    pen.mind.singleton.collapseButton.hide();
  },

  // 监听生命周期
  combineLifeCycle(target){
    setLifeCycleFunc(target,'onMouseEnter',(targetPen)=>{
      if(targetPen.mind.children.length > 0){
        targetPen.mind.singleton.collapseButton.translatePosition(targetPen);
        targetPen.mind.singleton.collapseButton.show();
      }
    });

    setLifeCycleFunc(target,'onMouseLeave',(targetPen)=>{
      if(targetPen.mind.childrenVisible){
        targetPen.mind.singleton.collapseButton.hide();
      }
    });

    let moveDebounce = debounce((targetPen)=>{
      targetPen.mind.singleton?.collapseButton?.translatePosition(targetPen);
      if(targetPen.mind.childrenVisible){
        targetPen.mind.singleton?.collapseButton?.hide();
      }
        // targetPen.mind.singleton?.collapseButton?.show();
    },200);
    setLifeCycleFunc(target,'onMove',moveDebounce);
  },
  // 折叠函数
  collapse(pen){
    pen.mind.childrenVisible = false;
    let children = pen.mind.children;
    let allCount = children.length;
    if(!children || children.length === 0)return 0;
    for(let i = 0 ; i< children.length;i++){
      let child = children[i];
      // 设置子节点的可见性为false
      child.mind.visible = false;

      // 设置相关line的可见性为false
      let line = child.connectedLines[0];
      meta2d.setVisible(meta2d.findOne(line.lineId),false,false);
      // 计算子节点的个数
      allCount += CollapseChildPlugin.collapse(child);
    }
    pen.mind.allChildrenCount = allCount;
    return allCount;
  },
  // 展开函数
  extend(pen){
    pen.mind.childrenVisible = true;
    let children = pen.mind.children;
    if(!children || children.length === 0)return;

    // 让所有子集都展开
    for(let i = 0 ; i< children.length;i++){
      let child = children[i];
      child.mind.visible = true;
      let line = child.connectedLines[0];
      meta2d.setVisible(meta2d.findOne(line.lineId),true,false);
      CollapseChildPlugin.extend(child);
    }
  }
};


function debounce(func, wait) {
  let timeout;
  return function() {
    const context = this;
    const args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(function() {
      func.apply(context, args);
    }, wait);
  };
}
