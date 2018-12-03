
var fs = require("fs");


module.exports = function(app) {

  app.get('/', require('./frontpage').get);

  app.get('/login', require('./login').get);
  app.post('/login', require('./login').post);//обработчик (при post на логин подключаем post этого модуля)

   app.get('/history',  require('./history').get);

  app.post('/logout', require('./logout').post);

app.get('/editor',  require('./editor').get);




app.post('/editor', function(req, res){

fs.appendFile("static/DAT/DAT"+req.session.user+".json", JSON.stringify(req.body,null,'\t'), function() {
            res.send(req.body)
            var content;

fs.readFile("static/DAT/DAT"+req.session.user+".json", function read(err, data) {
    if (err) {
        throw err;
    }

   
});

function processFile() {
    console.log(content);
}
        });

});

};
