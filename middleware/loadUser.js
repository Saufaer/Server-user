var User = require('../models/user').User;

module.exports = function(req, res, next) {
  req.user = res.locals.user = null;//по умолчанию если посетитель не вошёл, то user=null

  if (!req.session.user) return next();//если user нет , то сразу передаем управление

  User.findById(req.session.user, function(err, user) {
    if (err) return next(err);

    req.user = res.locals.user = user;//записываем в свойство req
    // все что запишем в объект res.locals.user будет доступно всем шаблонам (res.locals - спец свойство )
    next();//передаем управление дальше
  });
};