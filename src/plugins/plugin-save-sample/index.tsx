import { IPublicModelPluginContext } from '@alilc/lowcode-types';
import { Button } from '@alifd/next';
import { saveSchemaToLocal, resetSchemaToLocal } from '../../services/lowcode';

// 保存功能示例
const SaveSamplePlugin = (ctx: IPublicModelPluginContext) => {
  return {
    async init() {
      const { skeleton, hotkey, config } = ctx;
      const scenarioName = config.get('scenarioName');

      skeleton.add({
        name: 'saveSample',
        area: 'topArea',
        type: 'Widget',
        props: {
          align: 'right',
        },
        content: <Button onClick={() => saveSchemaToLocal(scenarioName)}>保存到本地</Button>,
      });
      skeleton.add({
        name: 'resetSchema',
        area: 'topArea',
        type: 'Widget',
        props: {
          align: 'right',
        },
        content: <Button onClick={() => resetSchemaToLocal(scenarioName)}>重置页面</Button>,
      });
      hotkey.bind('command+s', (e) => {
        e.preventDefault();
        saveSchemaToLocal(scenarioName);
      });
    },
  };
};
SaveSamplePlugin.pluginName = 'SaveSamplePlugin';
SaveSamplePlugin.meta = {
  dependencies: ['EditorInitPlugin'],
};
export default SaveSamplePlugin;
