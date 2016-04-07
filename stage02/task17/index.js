/* 数据格式演示
var aqiSourceData = {
  "北京": {
    "2016-01-01": 10,
    "2016-01-02": 10,
    "2016-01-03": 10,
    "2016-01-04": 10
  }
};
*/

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
  var y = dat.getFullYear();
  var m = dat.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  var d = dat.getDate();
  d = d < 10 ? '0' + d : d;
  return y + '-' + m + '-' + d;
}
function randomBuildData(seed) {
  var returnData = {};
  var dat = new Date("2016-01-01");
  var datStr = ''
  for (var i = 1; i < 92; i++) {
    datStr = getDateStr(dat);//设置格式，否则就会按照标准的方法显示时间
    returnData[datStr] = Math.ceil(Math.random() * seed);
    dat.setDate(dat.getDate() + 1);//此方法会自动计算是否到下个月
  }
  return returnData;
}

var aqiSourceData = {
  "北京": randomBuildData(500),
  "上海": randomBuildData(300),
  "广州": randomBuildData(200),
  "深圳": randomBuildData(100),
  "成都": randomBuildData(300),
  "西安": randomBuildData(500),
  "福州": randomBuildData(100),
  "厦门": randomBuildData(100),
  "沈阳": randomBuildData(500)
};

// 用于渲染图表的数据
var chartData = {};

// 记录当前页面的表单选项
var pageState = {
  nowSelectCity: -1,
  nowGraTime: "day"
}

/**
 *兼容绑定事件
 */
function addEvent(obj,event,func){
  if(addEventListener){
    event = event.replace(/^on/, "");
    obj.addEventListener(event,func);
  }
  else{
    obj.attachEvent(event,func);
  }
}


/**
 * 渲染图表
 */
function renderChart() {
  
}

/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange() {
  // 确定是否选项发生了变化 
  // 设置对应数据
  // 调用图表渲染函数
  if(event.target.value !== pageState.nowGraTime){
    pageState.nowGraTime = event.target.value;
    renderChart();
  }
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange() {
  // 确定是否选项发生了变化 
  // 设置对应数据
  // 调用图表渲染函数
  var citySelect = document.getElementById("city-select");
  if(citySelect != pageState.nowSelectCity){
    pageState.nowSelectCity = citySelect;
    renderChart();
  }
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
  var iptArr = document.getElementsByTagName("input");
  for(var i=0; i<iptArr.length; i++){
    /*addEvent(iptArr[i],"onclick",function(event){
      graTimeChange(event.target.value);//直接传递iptArr[i]是得到undefined，这个再验证
    });*/
    //addEvent(iptArr[i],"onclick",graTimeChange(iptArr[i].value));//这种跟上面那种为何结果不同的，待考证
    addEvent(iptArr[i],"onclick",graTimeChange);
  }
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
  // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
  // 给select设置事件，当选项发生变化时调用函数citySelectChange
  var citySelect = document.getElementById("city-select");
  var str = "<option>-请选择城市-</option>";
  for(var i in aqiSourceData){
    str += "<option>" + i + "</option>";
  }
  citySelect.innerHTML = str;
  addEvent(citySelect,"onchange",citySelectChange);
}

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
  // 将原始的源数据处理成图表需要的数据格式
  // 处理好的数据存到 chartData 中
}

/**
 * 初始化函数
 */
function init() {
  initGraTimeForm()
  initCitySelector();
  initAqiChartData();
}

init();