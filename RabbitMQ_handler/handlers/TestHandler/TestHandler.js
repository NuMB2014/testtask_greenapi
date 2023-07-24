class TestHandler {
    constructor() {
    }

    TaskParse(data){
        if(data.test) {
            return {
                code: 200,
                result: "ok"
            }
        }
        else {
            return {
                code: 400,
                error: "Task handler return error"
            }
        }
    }
}

module.exports = TestHandler