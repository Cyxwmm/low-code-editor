import { material, project } from '@alilc/lowcode-engine';
import { filterPackages } from '@alilc/lowcode-plugin-inject';
import { IPublicTypeProjectSchema, IPublicEnumTransformStage } from '@alilc/lowcode-types';
import { Message, Dialog } from '@alifd/next';
import { getLSName } from './utils';
import DefaultPageSchema from './defaultPageSchema.json';
import DefaultI18nSchema from './defaultI18nSchema.json';

/**
 * 从远端获取资产包协议
 * TODO: 这里的接口都是模拟的数据，后期需要存放到指定cdn位置，或存储到服务器。
 */
export async function getAssetsRequest() {
  const res = await window.fetch('http://127.0.0.1:8080/lowcode-assets@0.0.1/zmdms-assets.json');

  const assetsText = await res.text();

  return JSON.parse(assetsText);
}

/**
 * 获取页面schema协议（页面描述）。本地获取
 * @param scenarioName 场景名称
 */
export async function getPageSchemaByLocal(scenarioName: string) {
  // 1. 一些前置判断
  if (!scenarioName) {
    console.error('scenarioName is required!');
    return;
  }

  // 2.从localStorage中获取项目的schema协议
  const localValue = window.localStorage.getItem(getLSName(scenarioName, 'projectSchema')) || '{}';
  let localProjectSchema: any = null;
  try {
    localProjectSchema = JSON.parse(localValue);
  } catch (err) {
    console.log('解析ProjectSchema失败', err);
  }

  // 3. 从项目的schema协议拿到pageSchema协议
  const pageSchema = localProjectSchema?.componentsTree?.[0];

  // 4. 如果本地存储中有pageSchema，那么返回
  if (pageSchema) {
    return pageSchema;
  }

  return DefaultPageSchema;
}

/**
 * 获取项目的schema协议（应用描述）。本地获取
 * @param scenarioName 场景名称
 */
export async function createProjectSchema(pageSchema: any, i18nSchema) {
  return {
    componentsTree: [pageSchema],
    componentsMap: material.componentsMap as any,
    version: '1.0.0',
    i18n: i18nSchema,
  };
}

/**
 * 获取项目的schema协议（应用描述）
 * TODO: 改成从服务端获取。
 */
export async function getProjectSchemaRequest(scenarioName: string) {
  const pageSchema = await getPageSchemaByLocal(scenarioName);
  return createProjectSchema(pageSchema, DefaultI18nSchema);
}

/**
 * 保存项目的schema协议（应用描述）到本地
 */
export async function setProjectSchemaToLocal(scenarioName: string) {
  if (!scenarioName) {
    console.error('scenarioName is required!');
    return;
  }
  window.localStorage.setItem(
    getLSName(scenarioName),
    JSON.stringify(project.exportSchema(IPublicEnumTransformStage.Save)),
  );
}

/**
 * 保存项目的资产包协议（assets的packages内容）到本地
 */
export async function setAssetsPackagesToLocal(scenarioName: string) {
  if (!scenarioName) {
    console.error('scenarioName is required!');
    return;
  }
  // 拿到项目的资产包协议
  const packages = await filterPackages(material.getAssets()?.packages);
  window.localStorage.setItem(getLSName(scenarioName, 'packages'), JSON.stringify(packages));
}

/**
 * 保存到本地功能
 */
export async function saveSchemaToLocal(
  scenarioName: string = 'unknown',
  message: string = '成功保存到本地',
) {
  setProjectSchemaToLocal(scenarioName);
  await setAssetsPackagesToLocal(scenarioName);
  Message.success(message);
}

/**
 * 重置页面Scheme信息
 */
export async function resetSchemaToLocal(scenarioName: string = 'unknown') {
  try {
    await new Promise<void>((resolve, reject) => {
      Dialog.confirm({
        content: '确定要重置吗？您所有的修改都将消失！',
        onOk: () => {
          resolve();
        },
        onCancel: () => {
          reject();
        },
      });
    });
  } catch (err) {
    return;
  }
  const defaultSchema = await createProjectSchema(DefaultPageSchema, DefaultI18nSchema);

  // 导入project
  project.importSchema(defaultSchema as any);

  // 获取模拟器的host，重新渲染画布
  project.simulatorHost?.rerender();

  saveSchemaToLocal(scenarioName, '成功重置页面');
}
