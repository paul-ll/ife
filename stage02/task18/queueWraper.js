(function() {
	
	var queueWraper = function (tagName) {
		return new queueWraper.init(tagName);
	}

	queueWraper.init = function (tagName) {
		this.items = document.getElementsByTagName(tagName);
	}

	queueWraper.init.prototype ={

		parent:function () {
			return this.items[0].parentNode
		},

		deleteElement:function (element) {
			this.parent().removeChild(element);
		},

		createElement:function (tagName,val) {
			var element = document.createElement(tagName);
			element.innerText = val;
			return element;
		},

		pushLeft:function(tagName,val) {
			this.parent().insertBefore(this.createElement(tagName,val),this.items[0]);
		},

		pushRight:function (tagName,val) {
			this.parent().appendChild(this.createElement(tagName,val));
		},

		popLeft:function () {
			var value = this.parent().firstElementChild.innerText
			this.deleteElement(this.parent().firstElementChild);
			alert(value);
		},

		popRight:function () {
			var value = this.parent().lastElementChild.innerText
			this.deleteElement(this.parent().lastElementChild);
			alert(value);
		}
	}

	//使用$符号代替queueWraper方法
	window.queueWraper = window.$ = queueWraper; 

})(window);