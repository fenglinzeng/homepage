import generateAvatar from '~~/server/utils/avatar-generator.js'

/**
 * GET /avatar
 * 生成头像图片。
 */
export default defineEventHandler(async (event) => {
  setResponseHeader(event, 'Content-Type', 'image/png')
  return await generateAvatar()
})
