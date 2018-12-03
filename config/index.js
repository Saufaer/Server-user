var nconf = require('nconf');//модуль для конфигураций
var path = require('path'); //Модуль предоставляет утилиты для работы с путями к файлам и директориям
//откуда этому модулю читать конфигурацию:
nconf.argv()//прочитать из командной строки
   .env()//из переменных окружения
   .file({ file: path.join(__dirname,'config.json') });//из файла

module.exports = nconf;