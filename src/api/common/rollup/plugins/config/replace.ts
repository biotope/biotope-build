
export const replace = (legacy: boolean): object => (legacy ? ({
  'import.meta.url': '(__filename)',
  'import.meta': '({ url: __filename })',
}) : {});
