export default defineEventHandler(async (event) => {
  return await handleOpenPort(event, '20202', '动态临时开放ECS', { exposePort: false })
})
