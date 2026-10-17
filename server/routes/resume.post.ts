import { resumeData } from '~~/server/data/resume'

/**
 * POST /resume 接口
 * 
 * 【背景说明】：
 * 迁移自原 Egg 项目: app/controller/resume/index.js 中的 POST 请求处理分支。
 * 该接口直接返回简历相关的纯 JSON 数据结构，保持原有字段协议完全一致。
 */
export default defineEventHandler(async () => {
  return {
    code: 1,
    msg: 'ok',
    data: resumeData,
  }
})
