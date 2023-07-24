const TestHandler_lib = require("./TestHandler/TestHandler")
class Handlers {
    handlers = new Map()
    constructor(){
        this.handlers.set("test_task", new TestHandler_lib())
    }

    ParseIncommingMessage(msg){
        let handler = this.handlers.get(msg.key)
        if(handler){
            try {
                return handler.TaskParse(msg.task)
            } catch (e) {
                return {
                    code: 500,
                    error: "Task parse error"
                }
            }
        } else {
            return {
                code: 400,
                error: "Task handler does not exist"
            }
        }
    }
}

module.exports = Handlers;