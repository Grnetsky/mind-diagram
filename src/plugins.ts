import {getRect, Pen} from "@meta2d/core";
import {ToolBox} from "@meta2d/mind-diagram/src/toolBox";
import {
  generateColor,
} from "@meta2d/mind-diagram";

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
  // 计算子节点的颜色和位置
  calChildrenPosAndColor(pen,recursion = true){
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
    let generateColorFunc = generateColor();
    toolBoxPlugin.calcChildWandH(pen);
    for(let i = 0;i<children.length;i++){
      // 循环设置每个
      let child = children[i]; // 获取子元素
      topHeight += ((children[i-1]?.mind?.maxHeight) || 0) +(children[i-1]?(toolBoxPlugin.childrenGap):0) ;
      let nodeColor = generateColorFunc.next().value;
      child.mind.x = worldReact.x + pen.mind.maxWidth + toolBoxPlugin.levelGap;
      child.mind.y = worldReact.y  - 1 / 2 * pen.mind.maxHeight + topHeight + 1/2*worldReact.height+((child.mind?.maxHeight / 2 - 1 / 2 * penRects[i].height) || 0);
      child.mind.color = nodeColor;
      meta2d.setValue({
        id: child.id,
        x: child.mind.x,
        y: child.mind.y,
        color: nodeColor
      },{render:false});
      if(recursion) toolBoxPlugin.calChildrenPosAndColor(child,true);

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
  connectLine(pen,newPen,style = 'curve'){
    let line = meta2d.connectLine(pen, newPen, pen.anchors[1], newPen.anchors[3], false);
    meta2d.updateLineType(line, style);
  },
  reSetLines(pen,recursion = true){
    let colors = generateColor();
    let children = pen.mind.children;
    if(!children || children.length === 0 )return;
    for(let i = 0 ;i<children.length;i++){
      const child = children[i];
      let line = child.connectedLines?.[0];
      if(line){
        line.mind? '' : line.mind = {};
        line.mind.color = colors.next().value;
      }
      meta2d.setValue({
        id:line.lineId,
        color: line.mind.color
      },{render:false});
      if(recursion){
          toolBoxPlugin.reSetLines(child,true);
      }
    }
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
          toolBoxPlugin.addNode(pen,0);
        },
        icon:'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMzRweCIgaGVpZ2h0PSIzNHB4IiB2aWV3Qm94PSIwIDAgMzQgMzQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+5LiL57qn6IqC54K5PC90aXRsZT4KICAgIDxkZWZzPgogICAgICAgIDxyZWN0IGlkPSJwYXRoLTEiIHg9IjE0IiB5PSIxOCIgd2lkdGg9IjE2IiBoZWlnaHQ9IjciIHJ4PSIxIj48L3JlY3Q+CiAgICAgICAgPG1hc2sgaWQ9Im1hc2stMiIgbWFza0NvbnRlbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIG1hc2tVbml0cz0ib2JqZWN0Qm91bmRpbmdCb3giIHg9IjAiIHk9IjAiIHdpZHRoPSIxNiIgaGVpZ2h0PSI3IiBmaWxsPSJ3aGl0ZSI+CiAgICAgICAgICAgIDx1c2UgeGxpbms6aHJlZj0iI3BhdGgtMSI+PC91c2U+CiAgICAgICAgPC9tYXNrPgogICAgPC9kZWZzPgogICAgPGcgaWQ9Iumhtemdoi0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0i5Zu65a6aIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMzM2LjAwMDAwMCwgLTI3LjAwMDAwMCkiPgogICAgICAgICAgICA8ZyBpZD0i57yW57uELTLlpIfku70iIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE4Mi4wMDAwMDAsIDI0LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPGcgaWQ9IuS4i+e6p+iKgueCuSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTU0LjAwMDAwMCwgMy4wMDAwMDApIj4KICAgICAgICAgICAgICAgICAgICA8cmVjdCBpZD0i6YCP5piO5bqV5Zu+IiBmaWxsLW9wYWNpdHk9IjAiIGZpbGw9IiNGRkZGRkYiIHg9IjAiIHk9IjAiIHdpZHRoPSIzNCIgaGVpZ2h0PSIzNCI+PC9yZWN0PgogICAgICAgICAgICAgICAgICAgIDxyZWN0IGlkPSLnn6nlvaLlpIfku70tNiIgc3Ryb2tlPSIjODE4MTg3IiB4PSI0LjUiIHk9IjguNSIgd2lkdGg9IjE1IiBoZWlnaHQ9IjYiIHJ4PSIxIj48L3JlY3Q+CiAgICAgICAgICAgICAgICAgICAgPGxpbmUgeDE9IjEyIiB5MT0iMjIiIHgyPSIxNCIgeTI9IjIyIiBpZD0i55u057q/LTciIHN0cm9rZT0iIzgxODE4NyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIj48L2xpbmU+CiAgICAgICAgICAgICAgICAgICAgPGxpbmUgeDE9IjEyIiB5MT0iMTUiIHgyPSIxMiIgeTI9IjIyIiBpZD0i55u057q/LTYiIHN0cm9rZT0iIzgxODE4NyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIj48L2xpbmU+CiAgICAgICAgICAgICAgICAgICAgPHVzZSBpZD0i55+p5b2i5aSH5Lu9LTUiIHN0cm9rZT0iIzlDOUNBNSIgbWFzaz0idXJsKCNtYXNrLTIpIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1kYXNoYXJyYXk9IjIiIHhsaW5rOmhyZWY9IiNwYXRoLTEiPjwvdXNlPgogICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4='

      },
      {
        name:'重新布局',
        event:'click',
        func(pen){
          let children = pen.mind?.children || [];
          if(children.length >0){
            toolBoxPlugin.update(pen,true);
          }
        }
      },
      {
        name:'仅计算子节点',
        event:'click',
        func(pen){
          let children = pen.mind?.children || [];
          if(children.length >0){
            toolBoxPlugin.update(pen,false);
          }
        }
      },
      {
        name:'线条颜色',
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
        },
        icon:'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMzRweCIgaGVpZ2h0PSIzNHB4IiB2aWV3Qm94PSIwIDAgMzQgMzQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+5ZCM57qn6IqC54K5PC90aXRsZT4KICAgIDxkZWZzPgogICAgICAgIDxyZWN0IGlkPSJwYXRoLTEiIHg9IjkiIHk9IjgiIHdpZHRoPSIxNiIgaGVpZ2h0PSI3Ij48L3JlY3Q+CiAgICAgICAgPG1hc2sgaWQ9Im1hc2stMiIgbWFza0NvbnRlbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIG1hc2tVbml0cz0ib2JqZWN0Qm91bmRpbmdCb3giIHg9IjAiIHk9IjAiIHdpZHRoPSIxNiIgaGVpZ2h0PSI3IiBmaWxsPSJ3aGl0ZSI+CiAgICAgICAgICAgIDx1c2UgeGxpbms6aHJlZj0iI3BhdGgtMSI+PC91c2U+CiAgICAgICAgPC9tYXNrPgogICAgPC9kZWZzPgogICAgPGcgaWQ9Iumhtemdoi0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0i5Zu65a6aIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjkwLjAwMDAwMCwgLTI3LjAwMDAwMCkiPgogICAgICAgICAgICA8ZyBpZD0i57yW57uELTLlpIfku70iIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE4Mi4wMDAwMDAsIDI0LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPGcgaWQ9IuWQjOe6p+iKgueCuSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTA4LjAwMDAwMCwgMy4wMDAwMDApIj4KICAgICAgICAgICAgICAgICAgICA8cmVjdCBpZD0i6YCP5piO5bqV5Zu+IiBmaWxsLW9wYWNpdHk9IjAiIGZpbGw9IiNGRkZGRkYiIHg9IjAiIHk9IjAiIHdpZHRoPSIzNCIgaGVpZ2h0PSIzNCI+PC9yZWN0PgogICAgICAgICAgICAgICAgICAgIDxyZWN0IGlkPSLnn6nlvaIiIHN0cm9rZT0iIzgxODE4NyIgeD0iOS41IiB5PSIxOC41IiB3aWR0aD0iMTUiIGhlaWdodD0iNiIgcng9IjEiPjwvcmVjdD4KICAgICAgICAgICAgICAgICAgICA8bGluZSB4MT0iMTciIHkxPSIxNSIgeDI9IjE3IiB5Mj0iMTgiIGlkPSLnm7Tnur8tNiIgc3Ryb2tlPSIjODE4MTg3IiBzdHJva2UtbGluZWNhcD0icm91bmQiPjwvbGluZT4KICAgICAgICAgICAgICAgICAgICA8dXNlIGlkPSLnn6nlvaLlpIfku70tNCIgc3Ryb2tlPSIjOUM5Q0E1IiBtYXNrPSJ1cmwoI21hc2stMikiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWRhc2hhcnJheT0iMiIgeGxpbms6aHJlZj0iI3BhdGgtMSI+PC91c2U+CiAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg=='
      },
      {
        name: '新增子级节点',
        event: 'click',
        func: async (pen)=>{
          await toolBoxPlugin.addNode(pen,0);
        },
        icon:'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMzRweCIgaGVpZ2h0PSIzNHB4IiB2aWV3Qm94PSIwIDAgMzQgMzQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+5LiL57qn6IqC54K5PC90aXRsZT4KICAgIDxkZWZzPgogICAgICAgIDxyZWN0IGlkPSJwYXRoLTEiIHg9IjE0IiB5PSIxOCIgd2lkdGg9IjE2IiBoZWlnaHQ9IjciIHJ4PSIxIj48L3JlY3Q+CiAgICAgICAgPG1hc2sgaWQ9Im1hc2stMiIgbWFza0NvbnRlbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIG1hc2tVbml0cz0ib2JqZWN0Qm91bmRpbmdCb3giIHg9IjAiIHk9IjAiIHdpZHRoPSIxNiIgaGVpZ2h0PSI3IiBmaWxsPSJ3aGl0ZSI+CiAgICAgICAgICAgIDx1c2UgeGxpbms6aHJlZj0iI3BhdGgtMSI+PC91c2U+CiAgICAgICAgPC9tYXNrPgogICAgPC9kZWZzPgogICAgPGcgaWQ9Iumhtemdoi0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0i5Zu65a6aIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMzM2LjAwMDAwMCwgLTI3LjAwMDAwMCkiPgogICAgICAgICAgICA8ZyBpZD0i57yW57uELTLlpIfku70iIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE4Mi4wMDAwMDAsIDI0LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPGcgaWQ9IuS4i+e6p+iKgueCuSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTU0LjAwMDAwMCwgMy4wMDAwMDApIj4KICAgICAgICAgICAgICAgICAgICA8cmVjdCBpZD0i6YCP5piO5bqV5Zu+IiBmaWxsLW9wYWNpdHk9IjAiIGZpbGw9IiNGRkZGRkYiIHg9IjAiIHk9IjAiIHdpZHRoPSIzNCIgaGVpZ2h0PSIzNCI+PC9yZWN0PgogICAgICAgICAgICAgICAgICAgIDxyZWN0IGlkPSLnn6nlvaLlpIfku70tNiIgc3Ryb2tlPSIjODE4MTg3IiB4PSI0LjUiIHk9IjguNSIgd2lkdGg9IjE1IiBoZWlnaHQ9IjYiIHJ4PSIxIj48L3JlY3Q+CiAgICAgICAgICAgICAgICAgICAgPGxpbmUgeDE9IjEyIiB5MT0iMjIiIHgyPSIxNCIgeTI9IjIyIiBpZD0i55u057q/LTciIHN0cm9rZT0iIzgxODE4NyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIj48L2xpbmU+CiAgICAgICAgICAgICAgICAgICAgPGxpbmUgeDE9IjEyIiB5MT0iMTUiIHgyPSIxMiIgeTI9IjIyIiBpZD0i55u057q/LTYiIHN0cm9rZT0iIzgxODE4NyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIj48L2xpbmU+CiAgICAgICAgICAgICAgICAgICAgPHVzZSBpZD0i55+p5b2i5aSH5Lu9LTUiIHN0cm9rZT0iIzlDOUNBNSIgbWFzaz0idXJsKCNtYXNrLTIpIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1kYXNoYXJyYXk9IjIiIHhsaW5rOmhyZWY9IiNwYXRoLTEiPjwvdXNlPgogICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4='
      },
      {
        name:'仅计算子节点',
        event:'click',
        func(pen){
          if(pen.mind.children.length >0){
            toolBoxPlugin.update(pen,false);
          }
        }
      }
    ]
  },
  calcChildWandH(pen){
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
      let maxObj = toolBoxPlugin.calcChildWandH(child);
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
    // let translateToolBox = debounce(toolbox.translatePosition.bind(toolbox),200 );
    // let bindPenDebounce = debounce(toolbox.bindPen.bind(toolbox),200);
    setLifeCycleFunc(target,'onMove',(targetPen)=>{
      toolbox.hide();
      // translateToolBox(targetPen);
      // bindPenDebounce(targetPen);
    });

    setLifeCycleFunc(target,'onDestroy',(targetPen)=>{
      toolbox.hide();
      toolBoxPlugin.deleteNode(targetPen);
      toolBoxPlugin.update(meta2d.findOne(targetPen.mind.preNodeId),true);
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
      // color:generateColor((pen.mind.children[pen.mind.children.length-1])?.calculative.color),
      textColor:'#000',
      lineWidth:3,
      fontSize:16,
      borderRadius: pen.borderRadius,
    });
    if(position){
      pen.mind.children.splice(position,0,newPen);
    }else{
      pen.mind.children.push(newPen);
    }
    toolBoxPlugin.combineLifeCycle(newPen); // 重写生命周期
    toolBoxPlugin.connectLine(pen,newPen);
    let rootNode = meta2d.findOne(pen.mindManager.rootId);
    toolBoxPlugin.update(rootNode,true);
    // toolBoxPlugin.calChildrenPosition(pen);
    meta2d.toolbox.bindPen(newPen);
    meta2d.toolbox.setFuncList(toolBoxPlugin.funcList['leaf']);
    meta2d.toolbox.translatePosition(newPen);
  },
  // TODO 似乎这里有bug？ getPenRect值不是最新的
  update(pen,recursion = true){
    toolBoxPlugin.calChildrenPosAndColor(pen,recursion);
    toolBoxPlugin.reSetLines(pen,recursion);
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
