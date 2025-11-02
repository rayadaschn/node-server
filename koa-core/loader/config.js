const path = require("path");
const { sep } = path; // 路径分隔符
const glob = require("glob"); //  glob 模式匹配

/**
 * config 加载器
 * @param {*} app Koa 实例
 * @description 加载配置,可通过 app.config.${目录}.${文件} 访问
 * 配置区分 本地/测试/生成, 通过 env 环境读取不同文件配置 env.config
 *
 * 目录下对应的 config 配置
 * 默认配置 config/config.default.js
 * 本地配置 config/config.local.js
 * 测试配置 config/config.test.js
 * 生成配置 config/config.prod.js
 *
 */
module.exports = (app) => {
  // 读取配置目录(从根目录读取) /config/**/*.js 下的所有文件
  const configDir = path.join(app.baseDir, `.${sep}config`);
  const filterList = glob.sync(path.join(configDir, "**/*.js"));

  // 获取默认配置
  let defaultConfig = {};
  try {
    defaultConfig = require(path.join(configDir, "config.default.js"));
  } catch (error) {
    console.log("[exception] there is no default config file.");
  }

  // 获取 env.config
  let envConfig = {};
  try {
    if (app.env.isLocal()) {
      const localConfig = require(path.join(configDir, "config.local.js"));
      envConfig = { ...envConfig, ...localConfig };
    } else if (app.env.isTest()) {
      const testConfig = require(path.join(configDir, "config.test.js"));
      envConfig = { ...envConfig, ...testConfig };
    } else if (app.env.isProd()) {
      const prodConfig = require(path.join(configDir, "config.prod.js"));
      envConfig = { ...envConfig, ...prodConfig };
    }
  } catch (error) {
    console.log("[exception] there is no env config file.");
  }

  // 合并默认配置和 env 配置
  const configs = { ...defaultConfig, ...envConfig };
  console.log("🚀 ~ configs:", configs);

  // 注册所有配置, 使得可以通过 app.config.${目录}.${文件} 访问
  app.configs = configs;
};
