var User = require('../models/user').User;//подкл модель (для поиска в базе)
var AuthError = require('../models/user').AuthError;
var async = require('async');//для организации обработки ошибок методом waterfall


exports.get = function(req, res) {
  res.render('login');
};

exports.post = function(req, res, next) {
 
  var username = req.body.username;
  var password = req.body.password;


  User.authorize(username, password, function(err, user) {//эта функция получает function(err, user) т.е результат авторизации
    if (err) {//если результат - ошибка
      if (err instanceof AuthError) {
        return next(new AuthError(403));
      }
       else
        {//если это иная ошибка 
        return next(err);//то передаем её express
      }
    }
//если нет ошибок 
    req.session.user = user._id;//присваиваем _id от mongoose как номер сессии
    res.send(200);

  });

};