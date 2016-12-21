var Sidebar = Backbone.Model.extend({
  promptColor: function() {
    var cssColor = prompt("Please enter a CSS color:");
    this.set({color: cssColor});
  }
});

window.sidebar = new Sidebar;

sidebar.on('change:color', function(model, color) {
  $('#divBackbone').css({background: color});
});

//sidebar.set({color: 'red'});

//sidebar.promptColor();


var myModel = Backbone.Model.extend({
	defaults:function(){
		return {
			ID:0,
			Name:"wa ha ha",
			SortIndex:0,
			Age:0,
			Sex:'man'
		};
	}

});

var myModelList = Backbone.Collection.extend({

	model:myModel,

	mans :function(){
		return this.where({Sex:'man'});
	},
	comparator:'SortIndex'

});

var myModelView = Backbone.View.extend({

	tagName:'li',

	template:_template(),

	events:{
		"click"

	}


});