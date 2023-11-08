import {mindNode2} from "./node";
import {installPlugin, MindManager} from "./common";
import {pluginsMessageChannels} from "./plugins";
import {mindLine2, mindLine2Anchors} from "./mindLine";

export function mindPens(...plugins) {
  (window as any).MindManager = MindManager;
  (window as any ).MindManager.pluginsMessageChannels = pluginsMessageChannels;
  if(plugins.length > 0){
    plugins.forEach(i=>installPlugin(i));
  }
  return {
    mindNode2,
    mindLine2,
  };
}


export function mindAnchors() {
  return {
    mindLine2:mindLine2Anchors
  };
}
