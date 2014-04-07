define(function(require) {

  "use strict";

  /**
   *
   *
   *
   */
  var date = function(date, format) {
    // TODO error handling

    var o = {
      "M+": date.getMonth() + 1,
      "d+": date.getDate(),
      "h+": date.getHours(),
      "m+": date.getMinutes(),
      "s+": date.getSeconds(),
      "q+": Math.floor((date.getMonth() + 3) / 3),
      "S": date.getMilliseconds()
    };

    if (/(y+)/.test(format)) {
      format = format.replace(RegExp.$1,
        (date.getFullYear() + "").substr(4 - RegExp.$1.length)
      );
    }

    for (var k in o) {
      if (new RegExp("(" + k + ")").test(format)) {
        format = format.replace(RegExp.$1,
          RegExp.$1.length === 1 ?
            o[k] :
            ("00" + o[k]).substr(("" + o[k]).length));
      }
    }
    return format;
  };

  var round = function(value, decimal) {
    var offset = value >= 0 ? 0.5 : -0.5;

    decimal = decimal || 100;
    // http://jsperf.com/math-floor-vs-math-round-vs-parseint/18
    return ~~(value * decimal + offset) / decimal;
  };

  return {
    "date": date,
    "round": round
  };
});
