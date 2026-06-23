/**
 *
 * @returns {Promise<Awaited<ModelOption[]>>}
 */
export function getModels() {
  const models = [
    {value: "DeepSeek", label: "DeepSeek"},
    {value: "Biomed GPT", label: "Biomed GPT"},
    {value: "精卫一心", label: "精卫一心"},
    {value: "华佗医疗大模型", label: "华佗医疗大模型"},
    {value: "仲景中医模型", label: "仲景中医模型"},
  ];
  return Promise.resolve(models);
}
