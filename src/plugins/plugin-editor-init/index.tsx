import { IPublicModelPluginContext } from '@alilc/lowcode-types';
import { injectAssets } from '@alilc/lowcode-plugin-inject';

import { getAssetsRequest, getProjectSchemaRequest } from '../../services/lowcode';

const EditorInitPlugin = (ctx: IPublicModelPluginContext, options: any) => {
  return {
    async init() {
      const { material, project, config } = ctx;
      // 初始化一些参数配置信息（暂时不知道用途，主要是传递一些参数给引擎插件使用：当前场景、场景相关的一些配置信息（物料等等））
      const scenarioName = options['scenarioName'];
      const scenarioDisplayName = options['displayName'] || scenarioName;
      const scenarioInfo = options['info'] || {};
      // 保存在 config 中用于引擎范围其他插件使用
      config.set('scenarioName', scenarioName);
      config.set('scenarioDisplayName', scenarioDisplayName);
      config.set('scenarioInfo', scenarioInfo);

      // TODO: 从远端获取资产包协议，并设置物料描述
      // 将来要换成服务端接口、或者服务端的地址
      const assets = await getAssetsRequest();

      // 设置物料描述
      await material.setAssets(await injectAssets(assets));

      // 获取应用schema数据（应用描述）
      const schema = await getProjectSchemaRequest(scenarioName);
      // 加载 schema
      project.importSchema(schema as any);
    },
  };
};
EditorInitPlugin.pluginName = 'EditorInitPlugin';
EditorInitPlugin.meta = {
  preferenceDeclaration: {
    title: '保存插件配置',
    properties: [
      {
        key: 'scenarioName',
        type: 'string',
        description: '用于localstorage存储key',
      },
      {
        key: 'displayName',
        type: 'string',
        description: '用于显示的场景名',
      },
      {
        key: 'info',
        type: 'object',
        description: '用于扩展信息',
      },
    ],
  },
};
export default EditorInitPlugin;
