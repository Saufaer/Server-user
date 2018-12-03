var crypto = require('crypto');//функционал шифрования
var async = require('async');//для организации обработки ошибок методом waterfall

var mongoose = require('../libs/mongoose'),

  Schema = mongoose.Schema;//используется Schema для создания методов класса

var schema = new Schema({
  username: {
    type: String, //тип 
    unique: true, // уникальность
    required: true //обязательность
  },
  hashedPassword: {
    type: String,
    required: true
  },
  salt: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  }
});

schema.methods.encryptPassword = function(password) {
  return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};

schema.virtual('password')//виртуальное поле, значение которого не будет сохраняться в базе
  .set(function(password) {
    this._plainPassword = password;
    this.salt = Math.random() + '';//в базе сохранится значение salt (некоторый случайный ключ)
    this.hashedPassword = this.encryptPassword(password);// и hashedPassword (результат криптографической функции -  crypto.createHmac) => sha1(salt + password)
  })
  .get(function() { return this._plainPassword; });


schema.methods.checkPassword = function(password) {
  return this.encryptPassword(password) === this.hashedPassword;//true ,если верен
};


schema.statics.authorize = function(username, password, callback) {//schema.statics.authorize - метод авторизации
  async.waterfall([//в waterfall аргументы переплывают с одной функции к следующей вниз (их 2)
    function(callback) {
      User.findOne({username: username}, callback);//ищем по имени пользователя в базе, по завершении поиска вызовет callback
    },
    function(user, callback) {//user-у будет присвоен callback из findOne : если найдено , то в user попадет true , если не найдено в user попадет null
      if (user) {//если найден
        if (user.checkPassword(password)) {//проверяем пароль 
          callback(null, user);//если правильный - возвращаем callback (на самый верх)
        } else { 

          callback(new AuthError(403));//если нет, то создаем экземпляр обработчика ошибок AuthError 
        }
      }
       else 
       {//если пользователь не найден, то авторизуем его (это новый)
        var user = new User({username: username, password: password});//создаем объект класса (нового пользователя)
        user.save(function(err) {//сохраняем его в базе
          if (err) return callback(err);//если в процессе возникла ошибка (отдаем её express на обработку)
          callback(null, user);//при успешном сохранении - возвращаем callback (передаем user далее)
        });
      }
    }
  ], callback);//результат авторизации передаем наружу (во внешний callback ) и обрабатываем его через User.authorize (в login.js)
};

function AuthError(status) { 
  this.status = status//это будет статусом конкретного экземпляра
}


 exports.User = mongoose.model('User', schema);//объявляем модель и экспортируем (всё начинается с неё)

  var User = exports.User;

exports.AuthError = AuthError;

