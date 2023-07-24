const express = require('express')
const class_API = require('./API_handlers/index')
const class_RabbitMQ = require('./lib/rabbitmq')
require('dotenv').config()
const RabbitMQ = new class_RabbitMQ()
const API = new class_API(RabbitMQ)
const app = express();

const port = process.env.HTTP_PORT

app.use(express.json())
app.use(API.RequestTimeOut.bind(API));

app.post('/test_task', API.API_HANDLERS.TestTask.TaskHandler.bind(API.API_HANDLERS.TestTask))

app.use((req, res, next) => {
    RabbitMQ.DeleteHandlerTask(res.UUID)
    clearTimeout(res.TimeoutTimer)
    res.status(404).send(JSON.stringify({
        code: 404,
        error: "Not found"
    }));
});

app.listen(port, () => {
    console.log(`API | HTTP server listening on port ${port}`)
})
