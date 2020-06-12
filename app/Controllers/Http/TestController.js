'use strict'
class TestController {
    async get({request, response, view}) {
        return view.render('test.get')
    }    
    async post({request, response, view}) {
        let cmd = request.body.data.cmd;

        let exec = require('child-process-promise').exec;
        let rc;
        try{
            rc = await exec(cmd);
            rc = rc.stdout;
        }
        catch(ex){
            rc = "wrong command";
        }
        

        response.send(JSON.stringify(rc));
    }    
}

module.exports = TestController
