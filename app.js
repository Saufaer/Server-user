var express = require('express');
var http = require('http');
var path = require('path');//Модуль предоставляет утилиты для работы с путями к файлам и директориям
var config = require('./config');//файл с конфигурациями
var mongoose = require('./libs/mongoose');


var app = express();//express будет обрабатывать все приходящие запросы

// Middleware - обработчик запроса, используем стандартные из express
//директива app.engine, чтобы сказать express , что файлы с расширением ejs нужно обрабатывать ИМЕННО шаблонным движком ejs-locals
app.engine('ejs',require('ejs-locals'))//дополнение к шаблонной системе ejs

app.set('views', __dirname + '/views');//настройки для системы шаблонизации (шаблоны в папке - views)

app.set('view engine', 'ejs');//движок для шаблонов - ejs

app.use(express.static(__dirname + '/static'));//нужно добавить express.static промежуточное  app указать его в каталог со статическими активами.(для подключения .js в html или ejs)

//Parser - синтаксический анализатор (разбор)
app.use(express.bodyParser());//считывает form и json которые присылаются методом post (разбирает тело запроса)
//в итоге данные станут доступны в req.body.<свойства>
//когда полностью прочитает post , то передаст управление 
//bodyParser подключен раньше router, чтобы он успел прочитать все post данные, разобрал их и записал поля формы в соотв св-ва req.body

app.use(express.cookieParser());//разбирает cookie : req.headers => req.cookies (добавляет свойство)

//чтобы хранить сессии в mongodb нужен модуль connect-mongo
var MongoStore = require('connect-mongo')(express);//создаем класс, к которому будет обращаться Middleware session, чтобы сохранять или загружать сессии

app.use(express.session({
  secret: config.get('session:secret'), //значение cookie при её создании (случайно сгенерированное), [secret - обязательный параметр в express.session]
  //получаем идентификатор (длинный уникальный), по нему определяем что пришёл тот же посетитель(продолжается та же сессия)
  //кроме сервера и пользователя значение идентиф никто не знает(за счет этого защищенность) + есть криптографическая подпись(формируется на основе: индентификатор + secret единожды ) <строка-идентификатор>.<крипто-подпись>
  //если как то поменять строку-идентификатор, то криптографическая подпись не изменится (она формируется единожды) и по ней определяется подделка cookie
  //поэтому можно хранить на компе у посетителя значение идентификатора и проверять его на подлинность (не боясь что он его изменит)

  key: config.get('session:key'),//посетитель получит эту cookie при первом входе (именно этот key)
  cookie: config.get('session:cookie'), 

   //объект класса, к которому будет обращаться Middleware session, чтобы сохранять или загружать сессии
  store: new MongoStore({mongooseConnection: mongoose.connections[0]})//опция mongooseConnection: mongoose.connection означает что логин и пароль (строку соединения) к базе 
  //MongoStore может взять из mongoose (MongoStore не используется соединение mongoose, а возьмет только настройки подключения к базе)
}));

//когда заходит посетитель он либо получает новую сессию, восстанавливается старая по индетификатору
//и эта сессия записывается в свойство req.session:
//в req.session можно записать любые свойства и они автоматически сохранятся когда этот запрос будет завершен


app.use(require('./middleware/loadUser'))//загрузить пользователя (middleware)

app.use(app.router);//позволяет сказать какие запросы обработать и каким образом

require('./routes')(app);//подключим модуль routes и передадим ему app

app.use(express.static(path.join(__dirname, 'public')));//если ни один из middleware запрос не обработали,то он смотрит есть ли в 
//в папке public соответствующий файл

var server = http.createServer(app);
server.listen( config.get('port'), function(){//номер порта берем из config
  console.log('Express server listening on port ' + config.get('port'));
});


