import { serve } from '@hono/node-server'
import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})




app.onError((err, c) => {
  console.error(`${err}`);
  return c.json({
    status: 'error',
    message: err.message || 'Internal Server Error'
  }, 500)
})


app.notFound((c) => {
  return c.json({
    status: 'error',
    message: 'Not Found'
  }, 404)
})


const port = Number(process.env.PORT) || 3000
console.log(`Server is running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port
})
