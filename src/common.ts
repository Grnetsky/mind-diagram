
//
let ToolBox = {
  funcList:[],
  target: null,
  // 设置功能列表
  setFuncList(list){
    if(Array.isArray(list) && list.length > 0){
      this.funcList = list;
    }
  },

};

export let MindManger = {
  root: true,
  penId: '',
  parentId:'',
  data:{
    rootId:'',
    children:[],
  },
  ToolBox: ToolBox, // toolBox工具
  installPlugin,
  uninstallPlugin
};


export function* generateColor() {
  const colorList = ['#ee353e','#ff7a10','#f6f217','#65ff0e',
    '#1dfaf3','#019efc','#aa15ff'
  ];let index = 0;
  while(true) {
    yield colorList[index];
    index = (index + 1) % colorList.length;
  }
}

export function installPlugin(mindManager,plugin,...args) {
  if (validatePlugin(plugin)) {
    if(beforeInstallPlugin(mindManager,plugin)){
      let pen = meta2d.findOne(mindManager.penId);
      plugin.install(mindManager,pen,args); // 本身执行plugin的install函数
      mindManager.plugins.push(plugin);
      afterInstallPlugin(mindManager,plugin);
    }

  } else {
    console.warn('le5le mind-diagram warning: Your plugin is not valid');
  }
}

// 卸载插件
export function uninstallPlugin(mindManager,plugin,...args) {
  try {
    mindManager.plugins?.splice(mindManager.plugins?.findIndex(i=>i.name === plugin.name ),1);
    plugin.status = false;
    return true;
  }catch (e) {
    return false;
  }
}

// 数据结构
interface treeData {

}

// 插件验证函数
function validatePlugin(plugin) {
  return !!plugin.name;
}

// 插件前置钩子
function beforeInstallPlugin(mindManager,plugin) {
  //检测是否存在
  let pluginIndex = mindManager.plugins?.findIndex(i=>i.name === plugin.name );
  if(pluginIndex !== -1)return false;
  // doOtherThings
  return true;
}

// 插件后置守卫
function afterInstallPlugin(mindManager,plugin) {
  plugin.status = true;
  console.log(mindManager.plugins);
}

class ToolBoxItem {
  constructor() {
  }
  run(pen){

  }
}
