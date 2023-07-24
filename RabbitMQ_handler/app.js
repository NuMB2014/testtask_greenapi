const RabbitMQ_lib = require("./lib/rabbitmq")
const Handlers_lib = require("./handlers/HandlersIndex")
const Handlers = new Handlers_lib()
const RabbitMQ = new RabbitMQ_lib(Handler)

console.log("TASK HANDLER | Start process")

function Handler(msg) {
    // console.log(msg.content.toString())
    if (msg) {
        try {
            const data = JSON.parse(msg.content.toString())
            let result = Handlers.ParseIncommingMessage(data)
            RabbitMQ.sendAnswer(
                Object.assign({id: data.id},{ data: result }))
        } catch (e) {
            console.log(`RABBITMQ | Error while parse message - ${msg.content.toString()}\nRABBITMQ | ${e}`);
        }
        RabbitMQ.receive_channel.ack(msg);
    } else {
        console.log(`RABBITMQ | Empty message - ${JSON.stringify(msg)}`);
        RabbitMQ.receive_channel.reject(msg);
    }
}