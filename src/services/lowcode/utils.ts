/**
 * 本地存储的命名规范
 */
export function getLSName(scenarioName: string, ns: string = 'projectSchema') {
  return `${scenarioName}:${ns}`;
}
