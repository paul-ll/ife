/**
 * aqiData，存储用户输入的空气指数数据
 * 示例格式：
 * aqiData = {
 *    "北京": 90,
 *    "上海": 40
 * };
 */
var aqiData = {},
	hasValue = false;

//判断空字符
function trim(str){
	return str.replace(/^\s+|\s+$/g,"");
}

//判断城市是否都为中英文字符
function isTrueCity(str){
	return str.match(/\d/);
}

//判断空气质量指数是否都为数字
function isTrueAir(str){
	return str.match(/\D/);
}

/**
 * 从用户输入中获取数据，向aqiData中增加一条数据
 * 然后渲染aqi-list列表，增加新增的数据
 */
function addAqiData() {
	var city = document.getElementById("aqi-city-input").value,
		air = document.getElementById("aqi-value-input").value,
		warnCity = document.getElementById("warn-city"),
		warnAir = document.getElementById("warn-air");
	if(!trim(city)){
		warnCity.innerHTML = "城市名称不能为空,请重新输入！";
		return false;
	}else if(isTrueCity(city)){
		warnCity.innerHTML = "城市名称不能为非中英文字符,请重新输入！";
		return false;
	}else{
		warnCity.innerHTML = "";
	}
	if(!trim(air)){
		warnAir.innerHTML = "空气质量指数不能为空,请重新输入！";
		return false;
	}
	else if(isTrueAir(air)){
		warnAir.innerHTML = "空气质量指数不能为非数字,请重新输入！";
		return false;
	}else{
		warnAir.innerHTML = "";
	}
	aqiData[city] = air;
	hasValue = true;
}

/**
 * 渲染aqi-table表格
 */
function renderAqiList() {
	if(hasValue === true){
		var table = document.getElementById("aqi-table");
		var list = "<tr><th>城市</th><th>空气质量</th><th>操作</th></tr>";
		for(var city in aqiData){
			hasValue = true;
			list += "<tr><td>" + city + "</td><td>" + aqiData[city] + "</td><td><button>删除</button></td></tr>";
		}
		table.innerHTML = list;
	}
}

/**
 * 点击add-btn时的处理逻辑
 * 获取用户输入，更新数据，并进行页面呈现的更新
 */
function addBtnHandle() {
  	addAqiData();
  	renderAqiList();
}

/**
 * 点击各个删除按钮的时候的处理逻辑
 * 获取哪个城市数据被删，删除数据，更新表格显示
 */
function delBtnHandle(e){
	delete aqiData[e.target.parentElement.parentElement.firstChild.innerHTML];
	renderAqiList();
}

function init() {
  	// 在这下面给add-btn绑定一个点击事件，点击时触发addBtnHandle函数
  	var addBtn = document.getElementById("add-btn");
  	addBtn.onclick = function(){
  		addBtnHandle();
  	}
  	// 想办法给aqi-table中的所有删除按钮绑定事件，触发delBtnHandle函数
  	var table = document.getElementById("aqi-table");
  	table.onclick = function(e){
  		delBtnHandle(e);
  	}
}

init();