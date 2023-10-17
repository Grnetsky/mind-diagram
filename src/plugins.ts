import {Pen} from "@meta2d/core";

export interface Plugin {
  name:string;
  install:(manager,...args)=> void;
  uninstall:()=>void;
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
export let setLifeCycleFunc = rewritePenLifeCycle();
