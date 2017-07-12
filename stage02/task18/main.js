
//使用queueWraper获取并封装节点成为队列。
var queue = $("li");


var input = document.getElementById('input');
var leftIn = document.getElementById('left-in');
var leftOut = document.getElementById('left-out');
var rightIn = document.getElementById('right-in');
var rightOut = document.getElementById('right-out');
var ul = document.getElementById("list");



leftIn.onclick = function () {
	queue.pushLeft('li',input.value);
}

leftOut.onclick = function () {
	queue.popLeft();
}

rightIn.onclick = function () {
	queue.pushRight('li',input.value);
}

rightOut.onclick = function () {
	queue.popRight();
}

//使用事件代理
ul.addEventListener("click",function (e) {
	if (e.target && (e.target.nodeName.toUpperCase() == "LI")) {
		e.target.parentNode.removeChild(e.target);
	}
},false);