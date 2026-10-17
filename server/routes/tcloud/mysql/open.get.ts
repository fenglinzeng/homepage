export default defineEventHandler(async (event) => {
  return await handleOpenPort(event, '3306', '动态临时开放MySQL')
})
