module.exports = (app) => {
  return {
    // 判断是否为本地开发服务
    isLocal() {
      return process.env._ENV === "local";
    },
    // 判断是否为生产环境
    isProd() {
      return process.env._ENV === "prod";
    },
    // 判断是否为测试环境
    isTest() {
      return process.env._ENV === "test";
    },
    // 获取当前环境
    getEnv() {
      return process.env._ENV ?? "local";
    },
  };
};
