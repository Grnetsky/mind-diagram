import {installPlugin, MindManger} from "./src/common";
import { toolBoxPlugin} from "mind-plugins-core";

export * from './src/common';
export * from './src/register';
export * from './src/node';
export * from './src/plugins';

// 微队列中执行，等待meta2d加载成功
Promise.resolve().then(()=>{
  (window as any).MindManager = MindManger;
  installPlugin(toolBoxPlugin);
});

