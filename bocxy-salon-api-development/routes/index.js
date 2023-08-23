const fs = require('fs');
const loginController = require('../controllers/login');

module.exports = app => {

    app.use(loginController.verifyToken)

    fs.readdirSync(__dirname).forEach( file => {
        if (file == "index.js") return
        var name = file.substr(0, file.indexOf('.'))
        if(name)
            app.use('/', require(`./${name}`))
    })
}
