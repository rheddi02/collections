// /** @type {import("eslint").Linter.Config} */
// const config = {
//   "parser": "@typescript-eslint/parser",
//   "parserOptions": {
//     "project": true
//   },
//   "plugins": [
//     "@typescript-eslint"
//   ],
//   "extends": [
//     "next/core-web-vitals",
//     "plugin:@typescript-eslint/recommended-type-checked",
//     "plugin:@typescript-eslint/stylistic-type-checked"
//   ],
//   "rules": {
//     "@typescript-eslint/no-unsafe-assignment": "off",
//     "@typescript-eslint/array-type": "off",
//     "@typescript-eslint/consistent-type-definitions": "off",
//     "@typescript-eslint/consistent-type-imports": [
//       "warn",
//       {
//         "prefer": "type-imports",
//         "fixStyle": "inline-type-imports"
//       }
//     ],
//     "@typescript-eslint/no-unused-vars": [
//       "warn",
//       {
//         "argsIgnorePattern": "^_"
//       }
//     ],
//     "@typescript-eslint/require-await": "off",
//     "@typescript-eslint/no-misused-promises": [
//       "error",
//       {
//         "checksVoidReturn": {
//           "attributes": false
//         }
//       }
//     ]
//   }
// }
// module.exports = config;/** @type {import("eslint").Linter.Config} */
const config = {
  "extends": [
    "plugin:@nrwl/nx/react-typescript",
    "next",
    "next/core-web-vitals",
    "../../.eslintrc.json"
  ],
  "ignorePatterns": ["!**/*", ".next/**/*"],
  
  "rules": {
    "@next/next/no-html-link-for-pages": "off"
  },
  "env": {
    "jest": true
  }
}

module.exports = config;