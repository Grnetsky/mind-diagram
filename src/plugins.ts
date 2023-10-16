import {Pen, disconnectLine, connectLine as connectLineMeta, connectLine} from "@meta2d/core";
// import { CollapseButton } from "./dom";

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

export let pluginsMessageChannels = new PubSub();

export let openAndClosePlugin: Plugin = {
  name:"openAndClose",
  status: false,
  install:(manager,pen)=>{
    // 获取pen对象
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
export let setLifeCycleFunc = rewritePenLifeCycle();


// export let CollapseChildPlugin: any = {
//   name:'hideChildren',
//   status: false,
//
//   // 安装插件
//   install(manager, pen, args){
//
//     if(!pen.mind.singleton?.collapseButton  ){
//       pen.mind.singleton = {};
//       pen.mind.singleton.collapseButton = new CollapseButton((window as any).meta2d.canvas.externalElements.parentElement,{
//       });
//     }
//     pluginsMessageChannels.subscribe('addNode',(data)=>{
//       if(!data.mind.singleton?.collapseButton){
//         data.mind.singleton = {};
//         data.mind.singleton.collapseButton = new CollapseButton((window as any).meta2d.canvas.externalElements.parentElement,{
//         });
//         CollapseChildPlugin.init(data);
//       }
//     });
//     // 跟随移动
//     CollapseChildPlugin.init(pen);
//   },
//
//   // 插件卸载执行函数
//   uninstall(){
//   },
//   init(pen){
//     pen.mind.childrenVisible = true;
//     pen.mind.allChildrenCount = 0;
//     pen.mind.singleton.collapseButton.bindPen(pen.id);
//     pen.mind.singleton.collapseButton.translatePosition(pen);
//     CollapseChildPlugin.combineLifeCycle(pen);
//     pen.mind.singleton.collapseButton.hide();
//   },
//
//   // 监听生命周期
//   combineLifeCycle(target){
//     setLifeCycleFunc(target,'onMouseEnter',(targetPen)=>{
//       if(targetPen.mind.children.length > 0){
//         targetPen.mind.singleton.collapseButton.translatePosition(targetPen);
//         targetPen.mind.singleton.collapseButton.show();
//       }
//     });
//
//     setLifeCycleFunc(target,'onMouseLeave',(targetPen)=>{
//       if(targetPen.mind.childrenVisible){
//         targetPen.mind.singleton.collapseButton.hide();
//       }
//     });
//
//     let moveDebounce = debounce((targetPen)=>{
//       targetPen.mind.singleton?.collapseButton?.translatePosition(targetPen);
//       if(targetPen.mind.childrenVisible){
//         targetPen.mind.singleton?.collapseButton?.hide();
//       }
//         // targetPen.mind.singleton?.collapseButton?.show();
//     },200);
//     setLifeCycleFunc(target,'onMove',moveDebounce);
//   },
//   // 折叠函数
//   collapse(pen){
//     pen.mind.childrenVisible = false;
//     let children = pen.mind.children;
//     let allCount = children.length;
//     if(!children || children.length === 0)return 0;
//     for(let i = 0 ; i< children.length;i++){
//       let child = children[i];
//       // 设置子节点的可见性为false
//       child.mind.visible = false;
//
//       // 设置相关line的可见性为false
//       let line = child.connectedLines[0];
//       (window as any).meta2d.setVisible((window as any).meta2d.findOne(line.lineId),false,false);
//       // 计算子节点的个数
//       allCount += CollapseChildPlugin.collapse(child);
//     }
//     pen.mind.allChildrenCount = allCount;
//     return allCount;
//   },
//   // 展开函数
//   extend(pen){
//     pen.mind.childrenVisible = true;
//     let children = pen.mind.children;
//     if(!children || children.length === 0)return;
//
//     // 让所有子集都展开
//     for(let i = 0 ; i< children.length;i++){
//       let child = children[i];
//       child.mind.visible = true;
//       let line = child.connectedLines[0];
//       (window as any).meta2d.setVisible((window as any).meta2d.findOne(line.lineId),true,false);
//       CollapseChildPlugin.extend(child);
//     }
//   }
// };


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
