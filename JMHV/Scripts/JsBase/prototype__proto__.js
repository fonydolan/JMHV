//prototype __proto__
//原型链 继承

"user strict"
(function(){
	var Person = function(){ };

	var person = new Person();
	/*
		new 的处理过程
		1.var person ={}; 
		2.p.__proto__=Person.prototype;
		3.Person.call(p);  构造p，初始化p
		证明：
		Person.prototype === Person.prototype

		理解：
		1. __proto__  原型链
			每个对象都会在其内部初始化一个属性，就是__proto__，当我们访问一个对象的属性 时，
			如果这个对象内部不存在这个属性，那么他就会去__proto__里找这个属性，这个__proto__又会有自己的__proto__，
			于是就这样 一直找下去，也就是我们平时所说的原型链的概念。
			按照标准，__proto__是不对外公开的，也就是说是个私有属性，但是Firefox的引擎将他暴露了出来成为了一个共有的属性，
			我们可以对外访问和设置。

	*/
	Person.prototype.Say = function(){ alert("wa ha ha"); };
	var person2 = new Person();
	person2.Say();
	/*
	那么当我们调用person2.Say()时，首先p中没有Say这个属性， 于是，他就需要到他的__proto__中去找，
	也就是Person.prototype，而我们在上面定义了 Person.prototype.Say=function(){}; 于是，就找到了这个方法。
	*/
	Person.prototype.Salary = 50000;
	var Programmer = function(){};
	Programmer.prototype= new Person();//Programmer.prototype.__proto__ = Person.prototype;
	Programmer.prototype.WriteCode = function () {
		alert("writing code");
	};
	var person3 = new Programmer();//person3.__proto__=Programer.prototype;
	person3.Say();//say 在Person.prototype  => person3.__proto__.__proto__.Say()
	person3.WriteCode(); //person3.__proto__.WriteCode()
	alert(p.Salary);//person3.__proto__.__proto__.Salary
	/*
		var p=new Programmer()可以得出p.__proto__=Programmer.prototype;
		这也就是原型链的实现原理。
		原型链的本质在于__proto__！

		对象的constructor属性就是生成它的函数
		person2.constructor === Person true
		person3.constructor === Person true
		constructor属性是会追随原型链;

		每个对象还有一个基本函数 isPrototypeOf
		这个函数用来检测对象是否是另一个对象的原型, 本质上就是
		Person.prototype.isPrototypeOf(person);//返回true.
		可以利用这个函数检测对象是否是某个类型, 而避免使用constructor导致的追溯继承链干扰.
		比如要检测b是否是B生成的对象, 可以这样调用:
		Programmer.prototype.isPrototypeOf(person3)//true 表明new Programmer()生成

		避免使用constructor导致的追溯继承链干扰
		var person4 = Programmer.constructor()
		Programmer.prototype.isPrototypeOf(person4) //false 表明非new Programmer()生成
	*/

});