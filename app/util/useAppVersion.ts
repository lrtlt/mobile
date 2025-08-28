export const getAppVersion = () => {
  const appVersion = require('../../package.json').version;
  return appVersion;
};
