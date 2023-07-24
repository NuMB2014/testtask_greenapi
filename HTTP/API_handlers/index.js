require('dotenv').config()
const { v4: uuidv4 } = require('uuid');
const TestTask_handler_class = require('./test_task')
class API {
    request_timeout = undefined
    API_HANDLERS = undefined
    rabbitmq = undefined
    constructor(rabbitmq) {
        this.rabbitmq = rabbitmq
        this.API_HANDLERS = {
            TestTask: new TestTask_handler_class(rabbitmq)
        }
        this.request_timeout = parseInt(process.env.HTTP_REQUEST_TIMEOUT)
        if(typeof this.request_timeout === 'number' && this.request_timeout > 0){
            console.log(`API | Request timeout set to ${this.request_timeout} ms`)
        } else {
            console.error("API | Program close. Please set 'HTTP_REQUEST_TIMEOUT' variable in .env or docker-compose.yml")
            process.exit(23) // SIGSTOP Posix id
        }
    }

    /**
     * @description Принудительное завершение запроса, в случае зависания/долгого ожидания
     */
    RequestTimeOut(req, res, next) {
        res.UUID = uuidv4();
        res.type('application/json')
        res.TimeoutTimer = setTimeout(() => {
            this.rabbitmq.DeleteHandlerTask(res.UUID)
            res.status(408).send(JSON.stringify({
                code: 408,
                error: "Task timeout"
            }));
        }, this.request_timeout)
        next();
    };
}

module.exports = API