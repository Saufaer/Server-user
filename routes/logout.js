exports.post = function(req, res) {// если идёт post на logout
  req.session.destroy();//то уничтожаем сессию
  res.redirect('/');//перенаправляем посетителя на главную страницу
};