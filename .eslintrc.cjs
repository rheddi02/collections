/** @type {import("eslint").Linter.Config} */
const config = {
  "extends": [
    "plugin:@nrwl/nx/react-typescript",
    "next",
    "next/core-web-vitals",
    "../../.eslintrc.json"
  ],
  "ignorePatterns": ["!**/*", ".next/**/*"],
  "overrides": [
    {
      "files": ["*.ts", "*.tsx", "*.js", "*.jsx"],
      "rules": {}
    },
    {
      "files": ["*.ts", "*.tsx"],
      "rules": {}
    },
    {
      "files": ["*.js", "*.jsx"],
      "rules": {}
    }
  ],
  "rules": {
    "@next/next/no-html-link-for-pages": "off"
  },
  "env": {
    "jest": true
  }
}

module.exports = config;