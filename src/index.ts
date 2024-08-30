import { init, plugins } from '@alilc/lowcode-engine';
import InjectPlugin from '@alilc/lowcode-plugin-inject';
import { createFetchHandler } from '@alilc/lowcode-datasource-fetch-handler';
import UndoRedoPlugin from '@alilc/lowcode-plugin-undo-redo';
import ZhEnPlugin from '@alilc/lowcode-plugin-zh-en';
import CodeGenPlugin from '@alilc/lowcode-plugin-code-generator';
import DataSourcePanePlugin from '@alilc/lowcode-plugin-datasource-pane';
import SchemaPlugin from '@alilc/lowcode-plugin-schema';
import CodeEditorPlugin from '@alilc/lowcode-plugin-code-editor';
import ManualPlugin from '@alilc/lowcode-plugin-manual';
import SimulatorResizerPlugin from '@alilc/lowcode-plugin-simulator-select';
import EditorInitPlugin from './plugins/plugin-editor-init';
import DefaultSettersRegistryPlugin from './plugins/plugin-default-setters-registry';
import LogoSamplePlugin from './plugins/plugin-logo-sample';
import ComponentPanelPlugin from './plugins/plugin-component-panel';
import LoadIncrementalAssetsWidgetPlugin from './plugins/plugin-load-incremental-assets-widget';
import SaveSamplePlugin from './plugins/plugin-save-sample';
import PreviewSamplePlugin from './plugins/plugin-preview-sample';
import CustomSetterSamplePlugin from './plugins/plugin-custom-setter-sample';
import SetRefPropPlugin from '@alilc/lowcode-plugin-set-ref-prop';
import SimulatorLocalePlugin from './plugins/plugin-simulator-locale';
import lowcodePlugin from './plugins/plugin-lowcode-component';
import appHelper from './appHelper';
import './global.scss';

async function registerPlugins() {
  // 注意 Inject 插件必须在其他插件前注册，且所有插件的注册必须 await
  await plugins.register(InjectPlugin);

  // 初始化插件（这个插件主要做了一些：加载物料描述、加载应用描述文件）
  await plugins.register(EditorInitPlugin, {
    // 场景名称
    scenarioName: 'general',
    displayName: '综合场景',
    info: {
      urls: [
        {
          key: '设计器',
          value: 'https://github.com/alibaba/lowcode-demo/tree/main/demo-general',
        },
        {
          key: 'fusion-ui 物料',
          value: 'https://github.com/alibaba/lowcode-materials/tree/main/packages/fusion-ui',
        },
        {
          key: 'fusion 物料',
          value:
            'https://github.com/alibaba/lowcode-materials/tree/main/packages/fusion-lowcode-materials',
        },
      ],
    },
  });

  // 设置内置 setter 和事件绑定、插件绑定面板
  await plugins.register(DefaultSettersRegistryPlugin);

  // 位于：topArea left 区域
  // 用途：logo面板相关配置
  await plugins.register(LogoSamplePlugin);

  // 位于：leftArea top 区域
  // 用途：组件库插件
  await plugins.register(ComponentPanelPlugin);

  // 位于：leftArea bottom 区域
  // 用途：提供一种手动修改schema的方式的 插件
  await plugins.register(SchemaPlugin, { isProjectSchema: true });

  // 位于：leftArea bottom 区域
  // 用途：使用文档（这里当然是低代码引擎的使用文档）
  await plugins.register(ManualPlugin);

  // 位于：topArea right 区域
  // 用途：注册 回退/前进（历史记录） 插件
  await plugins.register(UndoRedoPlugin);

  // 位于：leftArea bottom
  // 用途：注册中英文切换 插件
  await plugins.register(ZhEnPlugin);

  // 用到了操作物料的相关功能
  // 用途：为设计提供在高级设置面板中设置ref-id的能力 plugin for setting ref-id.
  await plugins.register(SetRefPropPlugin);

  // 位于：topArea center
  // 用途：切换画布尺寸的插件
  await plugins.register(SimulatorResizerPlugin);

  // 位于：topArea right
  // 异步加载资源，物料相关（目前异步加载的资源对我们的低代码平台没啥作用）
  await plugins.register(LoadIncrementalAssetsWidgetPlugin);

  // 插件参数声明 & 传递，参考：https://lowcode-engine.cn/site/docs/api/plugins#%E8%AE%BE%E7%BD%AE%E6%8F%92%E4%BB%B6%E5%8F%82%E6%95%B0%E7%89%88%E6%9C%AC%E7%A4%BA%E4%BE%8B
  // 位于：leftArea
  // 数据源面板插件
  await plugins.register(DataSourcePanePlugin, {
    importPlugins: [],
    dataSourceTypes: [
      {
        type: 'fetch',
      },
      {
        type: 'jsonp',
      },
    ],
  });

  // 位于：leftArea
  // 用途：修改源码
  await plugins.register(CodeEditorPlugin);

  // 位于：topArea right
  // 用途：注册出码插件
  // TODO: 后续得出码估计得写一份基于自己业务的出码逻辑
  await plugins.register(CodeGenPlugin);

  // 位于：topArea right
  // 用途：保存到本地
  await plugins.register(SaveSamplePlugin);

  // 位于：topArea right
  // 用途：预览
  await plugins.register(PreviewSamplePlugin);

  await plugins.register(CustomSetterSamplePlugin);

  // 设计器区域多语言切换
  await plugins.register(SimulatorLocalePlugin);

  await plugins.register(lowcodePlugin);
}

(async function main() {
  await registerPlugins();

  init(document.getElementById('lce-container')!, {
    locale: 'zh-CN',
    enableCondition: true,
    enableCanvasLock: true,
    // 默认绑定变量
    supportVariableGlobally: true,
    requestHandlersMap: {
      fetch: createFetchHandler(),
    },
    appHelper,
  });
})();
