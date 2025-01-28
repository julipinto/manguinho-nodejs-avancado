import love from "eslint-config-love";

export default [
  {
    ...love,
    files: ["**/*.js", "**/*.ts"],
    ignores: ['node_modules/', 'dist/', 'build/', 'coverage/', 'public/'],
  },
];
