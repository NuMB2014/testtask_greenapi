const amqplib = require('amqplib');
class Rabbitmq {
    connect = undefined
    send_channel = undefined
    receive_channel = undefined

    receivers_map = new Map()

    constructor() {
        (async () => {
            this.connect = await amqplib.connect(`amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`);
            this.receive_channel = await this.connect.createChannel();
            await this.receive_channel.assertQueue('output');

            // Listener
            this.receive_channel.consume('output', (msg) => {
                if (msg) {
                    try {
                        let output_data = JSON.parse(msg.content.toString())
                        let callback_from_map = this.receivers_map.get(output_data.id)
                        if(callback_from_map){
                            callback_from_map(output_data)
                        }
                    } catch (e) {
                        console.log(`RABBITMQ | Error while parse message - ${JSON.stringify(msg)}\nRABBITMQ | ${e}`);
                    }
                    this.receive_channel.ack(msg);
                } else {
                    console.log(`RABBITMQ | Empty message - ${JSON.stringify(msg)}`);
                    this.receive_channel.reject(msg);
                }
            });

            // Sender
            this.send_channel = await this.connect.createChannel();
            await this.send_channel.assertQueue('tasks');
        })();
    }

    sendTask(Task_body){
        this.send_channel.sendToQueue("tasks", Buffer.from(JSON.stringify(Task_body)));
    }

    CreateHandlerTask(id, callback){
        this.receivers_map.set(id, callback)
    }

    DeleteHandlerTask(id){
        this.receivers_map.delete(id)
    }
}

module.exports = Rabbitmq