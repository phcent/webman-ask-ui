const IS_DEV = process.env.NODE_ENV !== 'production';

const API_ROOT = IS_DEV ? '/dev' : 'https://api.phcent.com';

const STATIC_PATH = '';
const CONTENT_TYPE = 'application/json;charset=UTF-8';
const CDN_PATH = '';
const ICP = '沪ICP备17014045号'

module.exports = {
  IS_DEV,
  API_ROOT,
  STATIC_PATH,
  CDN_PATH,
  CONTENT_TYPE,
  ICP
};
