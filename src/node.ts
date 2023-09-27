import {leChartPen} from "@meta2d/le5le-charts/src/common";
import {
  CollapseChildPlugin,
  installPlugin,
  MindManger,
  openAndClosePlugin,
  toolBoxPlugin
} from "@meta2d/mind-diagram";
import {mind, rectangle} from "@meta2d/core/src/diagrams";
import {deepClone, Pen} from "@meta2d/core";


// 创建节点的函数
export function mindNode2(pen: leChartPen, ctx: CanvasRenderingContext2D,parentId = '') {
  pen.mind = pen.mind ?? {};
  pen.mind.visible = true;
  let prePen = meta2d.findOne(pen.mind.preNodeId); //TODO  获取父节点 可能会有多个？暂时不处理'
  pen.mind.type = 'mind-node-1'; //标记为脑图1号节点
  if(prePen){
    pen.mindManager = prePen.mindManager; // 将此pen的id设置为
  }
  pen.mind.isRoot = pen.mind.isRoot ?? false;//是否为根节点
  pen.mind.children = pen.mind.children ?? [];
  if(!pen.mindManager){
    // 新创建的node；
    pen.mindManager = deepClone(MindManger);
    pen.mindManager.plugins = [];
    pen.mindManager.penId = pen.id;
    if(parentId){
      pen.mindManager.parentId = parentId; // 关联父节点
      let parent = meta2d.findOne(parentId);
      parent.mindManager.data.children.push(pen.id);
    }
    pen.mind.isRoot = true;
    pen.mindManager.rootId = pen.id;
    installPlugin(pen.mindManager,openAndClosePlugin);
    installPlugin(pen.mindManager,toolBoxPlugin);
    installPlugin(pen.mindManager,CollapseChildPlugin);
  }else {
    // (pen.mindManager.data.children.length === 0) && (pen.mind.isRoot = true);
  }

  // if(!pen.onMouseEnter){  // 注册事件
  //   pen.onMouseEnter = mouseEnter;
  //   pen.onMouseLeave = mouseLeave;
  // }
  if(!pen.onClick){
    pen.onClick = click;
  }


  return nodePen(pen,ctx);
}
function mouseEnter(pen) {
  // show add Button
}

function mouseLeave(pen) {
}

function click(pen){
  // toolbox show

}

export function nodePen(pen: Pen, ctx?: CanvasRenderingContext2D): Path2D {
  const path = !ctx ? new Path2D() : ctx;
  let wr = pen.calculative.borderRadius || 0,
    hr = wr;
  const { x, y, width, height, ex, ey } = pen.calculative.worldRect;
  if (wr < 1) {
    wr = width * wr;
    hr = height * hr;
  }
  let r = wr < hr ? wr : hr;
  if (width < 2 * r) {
    r = width / 2;
  }
  if (height < 2 * r) {
    r = height / 2;
  }

  path.moveTo(x + r, y);
  path.arcTo(ex, y, ex, ey, r);
  path.arcTo(ex, ey, x, ey, r);
  path.arcTo(x, ey, x, y, r);
  path.arcTo(x, y, ex, y, r);
  if (path instanceof Path2D) {
    return path;
  }
}

