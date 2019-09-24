//1，js实现promise
//2，js实现继承
//3，css动画 无限旋转。
//4，输入url显示页面发生了什么
//5，写一个eventEmitter类，包括on(),off(),once(),emit()
//6，首屏渲染优化
//7，vue实现数据双向绑定原理
//8，eventloop
setTimeout(function () {
	console.log(1)
}, 0)
new Promise(function(resole){
	console.log(2)
	for(var i=0;i<10000;i++){
		i===10000 && resole()
	}
	console.log(3)
}).then(function(){
	console.log(4)
})
console.log(5)
//2 3 5 undefined 1
//9,VUE
Vue.compontent("example",{
	template:`<span>{{msg}}</span>`,
	data(){
		return{
			msg:'没有更新'
		}
	},
	methods:{
		updataMsg(){
			this.msg='更新完成'
			console.log(this.$el.textContent)
		}
	}
})
