import {pluginsMessageChannels} from "@meta2d/mind-diagram";
import {deepClone} from "@meta2d/core";

export let MindManager = {
  rootIds:[],
  plugins:[],
  installPlugin,
  uninstallPlugin,
  _env:{}  // 中转函数
};

// export function installPlugin(plugin,...args): Promise<void> {
//   return new Promise<void>((resolve, reject) => {
//     if (validatePlugin(plugin)) {
//       if(beforeInstallPlugin(plugin)){
//         resolve();// 本身执行plugin的install函数
//       }
//     } else {
//       console.warn('le5le mind-diagram warning: Your plugin is not valid');
//       reject('no valid');
//     }
//   }).then(()=>{
//     plugin.install(args);
//     MindManager.plugins.push(plugin);
//     afterInstallPlugin(plugin);
//   });
//
// }

export function installPlugin(plugin,...args) {
    if (validatePlugin(plugin)) {
      if(beforeInstallPlugin(plugin)){
        plugin.install(args);
        console.log('installPlugin',plugin.name);
        MindManager.plugins.push(plugin);
        afterInstallPlugin(plugin);
        return true;
      }
    } else {
      console.warn('le5le mind-diagram warning: Your plugin is not valid');
      return false;
    }
}


// 卸载插件
export function uninstallPlugin(pluginName,...args) {
  try {
    let pluginIndex: any = MindManager.plugins?.findIndex(i=>i.name === pluginName );
    if(pluginIndex === -1){
      return false;
    }
    let plugin = MindManager.plugins[pluginIndex];
    MindManager.plugins?.splice(pluginIndex,1);
    plugin.status = false;
    plugin.uninstall?.(args);
    return true;
  }catch (e) {
    console.log('uninstallPlugin error：',e.message);
    return false;
  }
}

// 插件验证函数
function validatePlugin(plugin) {
  return !!plugin.name;
}

// 插件前置钩子
function beforeInstallPlugin(plugin) {
  //检测是否存在
  let pluginIndex = MindManager.plugins?.findIndex(i=>i.name === plugin.name );
  if(pluginIndex !== -1)return false;
  // doOtherThings
  return true;
}

// 插件后置守卫
function afterInstallPlugin(plugin) {
  plugin.status = true;
}

export function getPlugin(name){
  let plugin = MindManager.plugins.find(i=>i.name === name);
  return plugin;
}
