/*
 * @Author: gerrardlt 305690790@qq.com
 * @Date: 2023-01-23 02:48:28
 * @LastEditors: gerrardlt 305690790@qq.com
 * @LastEditTime: 2023-01-23 04:45:08
 * @FilePath: \quhu\src\assets\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const load = require.context('./svg', false, /\.svg$/)
load.keys().map(load)
