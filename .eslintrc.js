/*
 * @Author: gerrardlt 305690790@qq.com
 * @Date: 2023-01-12 14:01:21
 * @LastEditors: gerrardlt 305690790@qq.com
 * @LastEditTime: 2023-01-26 19:48:49
 * @FilePath: \quhu\.eslintrc.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'space-before-function-paren': 0,
    'no-trailing-spaces': 0,
    'no-unused-vars': 'off',
    camelcase: 'off'
  }
}
