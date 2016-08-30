Function.prototype.method = function(name,func){
    this.prototype[name] = func;
    return this;
}

var a = function(){

}.method("start",function(){})
.method("end",function(){});