import {getRect, Pen} from "@meta2d/core";
import {ToolBox} from "@meta2d/mind-diagram/src/toolBox";

export interface Plugin {
  name:string;
  install:(manager,...args)=> void;
  status:boolean;
}

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
  calChildrenPosition(pen,recursion = false){
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
    // 设置值
    toolBoxPlugin.calcMaxHeight(pen);
    for(let i = 0;i<children.length;i++){
      // 循环设置每个
      let child = children[i]; // 获取子元素
      topHeight += ((children[i-1]?.mind?.maxHeight) || 0) +(children[i-1]?(toolBoxPlugin.childrenGap):0) ;
      meta2d.setValue({
        id:child.id,
        x: worldReact.x + pen.mind.maxWidth + toolBoxPlugin.levelGap ,
        y:worldReact.y  - 1 / 2 * pen.mind.maxHeight + topHeight + 1/2*worldReact.height+((child.mind?.maxHeight / 2 - 1 / 2 * penRects[i].height) || 0)
      },{render:false});
    }
    let lastChild = children.length>0?children[children.length-1]:false;
    if(lastChild && (!lastChild.connectedLines || lastChild.connectedLines?.length === 0)){
      let line = meta2d.connectLine(pen,lastChild,pen.anchors[1],lastChild.anchors[3],false);
      meta2d.updateLineType(line, 'curve');
    }
    if(recursion){
      for (let i = 0;i <children.length;i++){
        let child = children[i];
        toolBoxPlugin.calChildrenPosition(child,true);
      }
    }
    meta2d.render();
  },
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
  async deleteNode(pen){
    toolBoxPlugin.deleteLines(pen);
    let parent = meta2d.findOne(pen.mind.preNodeId);
    parent && parent.mind.children.splice(parent.mind.children.indexOf(pen),1);
    await meta2d.delete(pen.mind.children);
  },
  install:(manager, pen, args)=>{
    let toolbox = null;
    if(!meta2d.toolbox){
      toolbox = new ToolBox(meta2d.canvas.externalElements.parentElement,{
      });
      meta2d.toolbox = toolbox;
    }
    // 跟随移动
    toolBoxPlugin.combineLifeCycle(pen);
    meta2d.on('inactive',(targetPen)=>{
      meta2d.toolbox.hide();
    });
  },
  funcList: {
    'root':[
      {
        name: '新增子级节点',
        event: 'click',
        func: async (pen)=>{
          // let newPen = await meta2d.addPen({
          //   name:'mindNode2',
          //   mind:{
          //     isRoot: false,
          //     preNodeId:pen.id,
          //     children: []
          //   },
          //   text:pen.text+1,
          //   x:pen.x ,
          //   y:pen.y ,
          //   width: pen.width,
          //   height: pen.height,
          //   borderRadius: pen.borderRadius,
          // });
          // pen.mind.children.push(newPen);
          // toolBoxPlugin.calChildrenPosition(pen,true);
          // toolBoxPlugin.combineLifeCycle(newPen); // 重写生命周期
          // meta2d.render();
          toolBoxPlugin.addNode(pen);
        }
      },
      {
        name:'重新布局',
        event:'click',
        func(pen){
          let children = pen.mind?.children || [];
          if(children.length >0){
            toolBoxPlugin.calChildrenPosition(pen,true);
          }
        }
      },
      {
        name:'仅计算子节点',
        event:'click',
        func(pen){
          let children = pen.mind?.children || [];
          if(children.length >0){
            toolBoxPlugin.calChildrenPosition(pen,false);
          }
        }
      }
    ],
    'leaf':[
      {
        name: '新增同级节点',
        event: 'click',
        func: async (pen)=>{
          if(pen.mind.type === 'mind-node-1' ){
            let parent = meta2d.findOne(pen.mind.preNodeId);
            let index = parent.mind.children.indexOf(pen);
            await toolBoxPlugin.addNode(parent,index+1);
          }
        }
      },
      {
        name: '新增子级节点',
        event: 'click',
        func: async (pen)=>{
          toolBoxPlugin.addNode(pen);
        }
      },
      {
        name:'计算位置',
        event:'click',
        func(pen){
          if(pen.mind.children.length >0){
            toolBoxPlugin.calChildrenPosition(pen);
          }
        }
      }
    ]
  },
  calcMaxHeight(pen){
    let children = pen.mind.children || [];
    let worldRect = meta2d.getPenRect(pen);
    if(children.length ===0){
      pen.mind.maxHeight = worldRect.height;
      pen.mind.maxWidth = worldRect.width;
      return {
        maxHeight: worldRect.height,
        maxWidth: worldRect.width
      };
    }
    let maxHeight = 0;
    let maxWidth = 0;
    for(let i = 0;i<children.length;i++){
      let child = children[i];
      let maxObj = toolBoxPlugin.calcMaxHeight(child);
      maxHeight += maxObj.maxHeight;
      maxWidth = maxWidth > maxObj.maxWidth? maxWidth : maxObj.maxWidth;
    }
    maxHeight += toolBoxPlugin.childrenGap * (children.length - 1);
    let maxH = maxHeight > worldRect.height?maxHeight : worldRect.height;
    pen.mind.maxHeight = maxH;
    pen.mind.maxWidth = maxWidth;
    return {
      maxHeight:maxH,
      maxWidth
    };
  },
  combineLifeCycle(target){
    let toolbox = meta2d.toolbox;
    let translateToolBox = debounce(toolbox.translatePosition.bind(toolbox),200);
    setLifeCycleFunc(target,'onMove',(targetPen)=>{
      toolbox.hide();
      translateToolBox(targetPen);
      console.log(targetPen,"移动了");
    });

    setLifeCycleFunc(target,'onDestroy',(targetPen)=>{
      toolbox.hide();
      toolBoxPlugin.deleteNode(targetPen);
      toolBoxPlugin.calChildrenPosition(meta2d.findOne(targetPen.mind.preNodeId),true);
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
  // 增加节点  同级设level为true
  async addNode(pen,position = 0, type = "mindNode2",){
    let newPen = await meta2d.addPen({
      name:type,
      mind:{
        isRoot: false,
        preNodeId:pen.id,
        children: [],
        width: 0, // 包含了自己和子节点的最大宽度
        height: 0 // 包含了自己和子节点的最大高度
      },
      x:pen.x ,
      y:pen.y ,
      width: pen.width,
      height: pen.height,
      text: '分支主题',
      borderRadius: pen.borderRadius,
    });
    if(position){
      pen.mind.children.splice(position,0,newPen);
    }else{
      pen.mind.children.push(newPen);
    }
    // toolBoxPlugin.calChildrenPosition(pen.t);
    toolBoxPlugin.combineLifeCycle(newPen); // 重写生命周期
    // toolBoxPlugin.calChildrenPosition(pen);

    toolBoxPlugin.calChildrenPosition(meta2d.findOne(pen.mindManager.rootId),true);
    let line = meta2d.connectLine(pen,newPen,pen.anchors[1],newPen.anchors[3],false);
    meta2d.updateLineType(line, 'curve');
    meta2d.render();
  },
  calcMaxHandW(pen){
    let children = pen.mind.children;
    for (let i = 0;i<children.length;i++){}
  }
};


// 防抖函数
function debounce(func,delay){
  let timeout; //定时器
  return function(arg){
    // 判断定时器是否存在，存在的话进行清除，重新进行定时器计数
    if(timeout) clearTimeout(timeout);//清除之前的事件
    timeout = setTimeout(()=>{
      func.call(this,arg);//执行事件
    },delay);
  };
}


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
