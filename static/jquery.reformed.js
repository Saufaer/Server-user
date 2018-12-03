
//что избежать конфликтов имен с другими библиотеками javascript
//обернем объект jQuery в непосредственно выполняемую функцию-выражение (IIFE, Immediately Invoked Function Expression), которое связывает объект jQuery с символом "$"

//используем конструкцию:
/*(function( $ ) {
  <плагин>
    здесь $ будет действовать как синоним jQuery (без конфликтов) 
})(jQuery);*/



(function($)
{


  var reformed = { // все методы плагина объединены в один объектный литерал reformed
    settings: {
      'editor':'data' // id кнопки = data
    },
    init: function(json) {// инициализация плагина
      var $this = $(this);//переименование ,чтобы избежать создания нового объекта jQuery в each 
      
      reform = $.parseJSON(json);//конвертируем строку json в javascript-объект

      $this.empty().append(reformed.object(reform));
      //.empty() Очищает содержание выбранных элементов
      //.append() вставляет указанное содержимое как последний элемент в каждом из элементов коллекции jQuery 
//$this очистится и получит reformed.object(reform) - обработанный объект - форму
      return $this;//
    },


    kvp: function(key, value) {//из названий полей key и их значений value вернем форму
    
   
      var output = '<div class="kvp"><div class="front">';
 {
        output += '<label class="key">'+key+'</label>';//пропишем название участка 
      }

      {
        if ($.isPlainObject(value)) {//Метод $.isPlainObject позволяет узнать является ли переданный объект простым объектом (созданным с помощью "{}" или "new Object").
          output += reformed.object(value);//добавим этот объект value в виде формы в общую форму
        } 
        else
         if ($.isArray(value)) {//$.isArray() Проверяет, является ли заданный элемент массивом. 

          output += reformed.array(value);//добавим массив в виде формы в общую форму
        } 
        else //если это значение поля

          {
            output += '<input class="value" value="'+value+'" />';//вставка значения в поле
          }
      

      }

      output += '</div>';//закрываем блок класса front
      output += '</div>';//класса kvp
      return output;//вернем форму
    },

    object: function(object) {//из простого объекта object вернём форму
      var output = '<fieldset class="object">';//Элемент <fieldset> предназначен для группирования элементов формы.
      if (reformed.settings.editor == 'data') {//если кнопка с id data 
        for (var attrname in object) {//проходим по всем свойствам объекта
          output += reformed.kvp(attrname, object[attrname]);//добавляем новые элементы формы
        }
      } 
      output += '</fieldset>';//закрываем группу
      return output;//вернем полученную форму - объект
    },

    array: function(array) {//из массива array вернём форму
      var output = '<fieldset class="array">';//создаем группу
             {
        $.each(array, function (index, value) {//для всех элементов группы (массива)

            if ($.isPlainObject(value)) {//если объект простой (без вложений)
            output += reformed.object(value);//добавляем его как простой объект в виде формы к общей
          } else 
          if ($.isArray(value)) {//если это массив
            output += reformed.array(value);//добавляем как массив в виде формы к общей (вложенный массив в массиве)
          }
        });
      }
      output += '</fieldset>';//закрываем группу
      return output;//возвращаем форму (группу - массив)
    }
  };
//расширить объект $.fn
$.fn.reform = function(json) {//объявляем плагин reform (создание формы из json)
  //вызов метода init 
  reformed.init.apply(this, arguments);//apply() вызывает функцию init с указанным значением this и аргументами, предоставленными в виде массива
};

$.rejson = function(from) {//объект jquery - из form вернем строку json 
  var _json = {};//сюда запишем новый json из формы
  $(from + ' > fieldset.object > div.kvp').each(function () {//для всех kvp (всех сформированных) 
    //.each( function ) Возвращает: jQuery
// Итерация над объектом JQuery, выполняет функцию для каждого элемента
      _kvp = kvp($(this));//kvp(<элементы в div class="kvp"> )
      for (var attrname in _kvp) {//проходим по всем свойствам _kvp
        _json[attrname] = _kvp[attrname];//соберем все "маленькие" json-коды в общий 
      }
  });

  return JSON.stringify(_json, null, '\t');//вернем строку json
  //JSON.stringify(value[, replacer[, space]])
  //value - Значение, преобразуемое в строку JSON.
  //null - результат не преобразуем
  //'\t'  Делает результат красиво отформатированным (расставляя пробелы).
};

function kvp(el) {//из el вернем json-код
  var _kvp = {};//json-код
  
  {
    var k = el.find('div.front > label.key').html();//el.find(label.key) вернет все элементы label.key, находящиеся внутри el.

    //находим в div.front элемента label.key из html (это название очередного объекта)

    //.html() Возвращает строку .Получает HTML-содержимое первого элемента в наборе.
    

    var v = $(el.find('div.front > input, fieldset')[0]);  
    //el.find('div.front > input, fieldset')[0] из el будет запрашивать все элементы fieldset в input-e , но возвращает первый элемент DOM т.к[0]
    //получим javascript - объект
    //преобразование : $(ляля) преобразует ляля в объект jquery
  }
  if (v.is('input')) {//если элемент в поле ввода
  //.is() Проверяет, соответствует ли хотя бы один из выбранных элементов определенному условию
     {
      var value = v.val();//записываем значение этого элемента (строки)
      //.val() используется для получения значений элементов формы
      {
        _kvp[k] = value;//записываем из соответствующего элемента формы (key)  в json для отдельных объектов
       }
    }
  } 

  else //если элемент не в поле ввода , значит он в группе
  if (v.hasClass('array')) {//если элемент пренадлежит массиву
    var _ary = [];//массив

    if (v.children('fieldset.object').length > 0) {//если набор потомков родителя v (группы) ненулевой
      //Метод .children() возвращает новый набор jQuery, состоящий из всех прямых потомков каждого элемента исходного набора jQuery. 

      v.children('fieldset.object').each(function() {//для всех v.children('fieldset.object')
        _ary.push(obj($(this)));//вставить объект
      });
    } 
    else //если набор нулевой
    {
      v.children('input').each(function() {
        _ary.push($(this).val());
      });
    }
      _kvp[k] = _ary;//записываем массив в общий json
  }
   else//если элемент отдельный  (не в массиве)
    if (v.hasClass('object')) {//если это отдельный объект группы
    _kvp[k] = obj(v);//записываем его в общий json (учитывая все вложения в нем)
  }
  return _kvp;//вернем получившийся json
}

/**
 * Объекты всегда имеют один или несколько .kvp. В любом есть вложенные
 **/
function obj(el) {//из el найдем все вложенные и вернем как цельный
  var _obj = {};
  el.children('.kvp').each(function() {//для всех потомков выполним обработку   
    var _temp_kvp = kvp($(this));//создаем внутреннюю группу kvp
    for (attrname in _temp_kvp) {//проходим по всем свойствам группы
      _obj[attrname] = _temp_kvp[attrname];//копируем их в новый объект
    }
  });
  return _obj;//получаем цельный объект , в котором вложены все внутренние
}

})(jQuery);
