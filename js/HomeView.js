var HomeView = function(store) {

	this.render = function() {
		this.el.html(HomeView.template());
		return this;
	};

	this.refeshData = function() {
		this.findAll();
		this.el.html(HomeView.template());
		return this;
	};

	this.findByName = function() {
		store.findByName($('.search-key').val(), function(employees) {
			$('.employee-list').html(HomeView.liTemplate(employees));
		});
	};

	this.findAll = function() {
		var input;
		if($('.search-key').val() == null){
			input = " ";
		}
		else {
			input = $('.search-key').val();
		}
		store.findByName(input, function(employees) {
			$('.employee-list').html(HomeView.liTemplate(employees));
		});
	};

	this.initialize = function() {
		// Define a div wrapper for the view. The div wrapper is used to attach events.
		this.el = $('<div/>');
		$('body').on('keyup', '.search-key', this.findByName);
		this.findAll();
	};

	this.initialize();

}

HomeView.template = Handlebars.compile($("#home-tpl").html());
HomeView.liTemplate = Handlebars.compile($("#employee-li-tpl").html());
