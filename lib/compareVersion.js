function toNum(a) {
  var a = a.split('-')[0].toString();
  //这里变了
  var c = a.split(/\D/);
  if (c[0] == '') c.shift()
  var num_place = ["", "0", "00", "000", "0000"], r = num_place.reverse();
  for (var i = 0; i < c.length; i++) {
    var len = c[i].length;
    c[i] = r[len] + c[i];
  }
  var res = c.join('');
  return res;
}
function isHighVersion(a, b) {
  var _a = toNum(a), _b = toNum(b);
  if (_a > _b) return true
  else return false
  
}

module.exports = isHighVersion