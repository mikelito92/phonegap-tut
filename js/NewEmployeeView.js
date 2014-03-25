var NewEmployeeView = function(store) {

	this.render = function() {
		this.el.html(NewEmployeeView.template());
		return this;
	};

	this.showAlert = function (message, title) {
		if (navigator.notification) {
			navigator.notification.alert(message, null, title, 'OK');
		} else {
			alert(title ? (title + ": " + message) : message);
		}
	};

	this.initialize = function() {
		// Define a div wrapper for the view. The div wrapper is used to attach events.
		this.el = $('<div/>');
		var that = this;
		$('body').on('submit', '#new-employee-form', function(e){
			e.preventDefault();
			e.stopPropagation();
			e.stopImmediatePropagation();

			var formData = $("#new-employee-form").serializeArray();
			var employee = {};
			for(var key in formData){
				employee[formData[key].name] = formData[key].value;
			}
			employee['managerId'] = 0;
			var e = employee;
			console.log(employee);
			if(that.isEmpty(e.firstName) | that.isEmpty(e.lastName)){
				that.showAlert("Name must not be empty.", "Error");
			}
			else{
				store.addEmployee(e.firstName, e.lastName, e['title'], e.managerId, e.city, e.officePhone, e.cellPhone, e.email);

				return;
			}

			// return false;
		});
	};

	this.isEmpty = function (str) {
		return (!str || /^\s*$/.test(str) || 0 === str.length);
	};

	this.initialize();

}

NewEmployeeView.template = Handlebars.compile($("#new-employee-tpl").html());
