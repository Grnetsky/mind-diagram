import {mindNode2} from "./node";
import {installPlugin} from "mind-diagram";

export function mindPens(...plugins) {
  if(plugins.length > 0){
    plugins.forEach(i=>installPlugin(i));
  }
  return {
    mindNode2
  };
}
