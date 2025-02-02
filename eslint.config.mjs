import love from "eslint-config-love";

export default [
  {
    ...love,
    files: ["**/*.js", "**/*.ts"],
    ignores: ['node_modules/', 'dist/', 'build/', 'coverage/', 'public/'],
    rules: {
      ...love.rules,
      'no-unsafe-type-assertion': 'off',
      'class-methods-use-this': 'off',
    },
  },
];
