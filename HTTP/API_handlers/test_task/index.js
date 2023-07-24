class Test_Task_API {
    #rabbitmq = undefined
    task_key = "test_task"
    constructor(rabbitmq) {
        this.#rabbitmq = rabbitmq
    }

    TaskHandler(request, response) {
        this.#rabbitmq.sendTask({
            id: response.UUID,
            key: this.task_key,
            task: request.body
        })
        this.#rabbitmq.CreateHandlerTask(response.UUID, (function (output) {
            clearTimeout(response.TimeoutTimer)
            this.DeleteHandlerTask(response.UUID)
            response.status(output.data?.code ?? 200).send(JSON.stringify(output.data))
        }).bind(this.#rabbitmq))
    }
}

module.exports = Test_Task_API