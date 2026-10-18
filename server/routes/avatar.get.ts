import generateAvatar from '~~/server/utils/avatar-generator.js'

/**
 * GET /avatar
 * 迁移自 xEntry/app/controller/avatar/index.js。
 */
export default defineEventHandler(async (event) => {
  setResponseHeader(event, 'Content-Type', 'image/png')
  return await generateAvatar()
})
