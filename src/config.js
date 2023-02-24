
import each from 'lodash/each';
const defaultConfig = require('../config.json');

class Config {
  constructor(c) {
    each(c, (value, key) => {
      this[key] = value;
    });
  }

  get (k) {
    return this[k];
  }

  set (k, v) {
    this[k] = v;
  }
}

const config = new Config(defaultConfig);
console.log(config)
// if (typeof config !== 'undefined') {
//   throw new Error("default config.json file may not contain a property 'Config'");
// }
config.Config = Config
export default config