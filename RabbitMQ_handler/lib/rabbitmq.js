const amqplib = require('amqplib');
require('dotenv').config()
class Rabbitmq {
    connect = undefined
    send_channel = undefined
    receive_channel = undefined

    receivers_map = new Map()

    constructor(Handler) {
        (async () => {
            this.connect = await amqplib.connect(`amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`);

            // Listener
            this.receive_channel = await this.connect.createChannel();
            await this.receive_channel.assertQueue('tasks');
            this.receive_channel.consume('tasks', Handler);

            // Sender
            this.send_channel = await this.connect.createChannel();
            await this.send_channel.assertQueue('output');
        })();
    }

    sendAnswer(Task_body){
        this.send_channel.sendToQueue("output", Buffer.from(JSON.stringify(Task_body)));
    }
}

module.exports = Rabbitmq