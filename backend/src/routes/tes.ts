import { Hono } from 'hono'

const tes = new Hono()


tes.get('/', (c) => {
  return c.text('Hello Hono!')
})