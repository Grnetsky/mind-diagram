
export let MindManger = {
  plugins:[],
  installPlugin,
  uninstallPlugin
};

export function installPlugin(plugin,...args) {
  if (validatePlugin(plugin)) {
    if(beforeInstallPlugin(plugin)){
      plugin.install(args); // 本身执行plugin的install函数
      MindManger.plugins.push(plugin);
      afterInstallPlugin(plugin);
    }
  } else {
    console.warn('le5le mind-diagram warning: Your plugin is not valid');
  }
}

// 卸载插件
export function uninstallPlugin(plugin,...args) {
  try {
    MindManger.plugins?.splice(MindManger.plugins?.findIndex(i=>i.name === plugin.name ),1);
    plugin.status = false;
    plugin.uninstall?.();
    return true;
  }catch (e) {
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
  let pluginIndex = MindManger.plugins?.findIndex(i=>i.name === plugin.name );
  if(pluginIndex !== -1)return false;
  // doOtherThings
  return true;
}

// 插件后置守卫
function afterInstallPlugin(plugin) {
  plugin.status = true;
}

