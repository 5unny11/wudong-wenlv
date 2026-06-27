import { MidwayConfig } from '@midwayjs/core';

export default {
  keys: 'wudong_wenlv_cookie_key_2026',
  koa: { port: 7001 },
  // 日志 — 只输出到控制台
  midwayLogger: {
    default: { enableConsole: true, enableFile: false, enableError: false },
  },
  typeorm: {
    dataSource: {
      default: {
        type: 'mysql',
        host: 'localhost', port: 3306, username: 'wudong',
        password: 'wudong123', database: 'wudong_wenlv',
        synchronize: true, logging: false,
        entities: ['**/entity/*.entity.ts'], timezone: '+08:00',
      },
    },
  },
  jwt: {
    secret: 'wudong_wenlv_jwt_secret_key_2026',
    sign: { expiresIn: '7d' },
  },
  swagger: {
    title: '乌东文旅平台 API',
    description: '乌东文旅“衣食住行”综合服务平台接口文档',
    version: '1.0.0',
  },
  cors: { origin: '*', allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH' },
} as MidwayConfig;
