const getTime = function () {
  const date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth();
  var day = date.getDate();
  var hour = date.getHours();
  var minute = date.getMinutes();
  var seconds = date.getSeconds();
  var timeNow = `${year}-${month}-${day} ${hour}:${minute}:${seconds}`;
  return timeNow;
};

module.exports = {
  getTime: getTime
}