import {installPlugin, MindManager} from "./src/common";
import { toolBoxPlugin} from "mind-plugins-core";
import {pluginsMessageChannels} from "./src/plugins";

export * from './src/common';
export * from './src/register';
export * from './src/node';
export * from './src/plugins';
// 微队列中执行，等待meta2d加载成功
(window as any).MindManager = MindManager;
(window as any ).MindManager.pluginsMessageChannels = pluginsMessageChannels;
installPlugin(toolBoxPlugin);

