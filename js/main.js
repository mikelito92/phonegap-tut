var app = {

	showAlert: function (message, title) {
		if (navigator.notification) {
			navigator.notification.alert(message, null, title, 'OK');
		} else {
			alert(title ? (title + ": " + message) : message);
		}
	},

	registerEvents: function() {
		$(window).on('hashchange', $.proxy(this.route, this));
		$('body').on('mousedown', 'a', function(event) {
			$(event.target).addClass('tappable-active');
		});
		$('body').on('mouseup', 'a', function(event) {
			$(event.target).removeClass('tappable-active');
		});
		document.addEventListener("deviceready", this.onDeviceReady, false);
	},

	route: function() {
		var self = this;
		var hash = window.location.hash;
		console.log("\"" + hash + "\"");
		if (!hash) {
			if (this.homePageRendered) {
				console.log(1);
				this.slidePage(this.homePage.render());
			} else {
				console.log(2);
				this.homePage = new HomeView(this.store);
				this.homePageRendered = this.homePage.render();
				this.slidePage(this.homePageRendered);
			}
			return;
		}
		var match = hash.match(this.detailsURL);
		if (match) {
			this.store.findById(Number(match[1]), function(employee) {
				self.slidePage(new EmployeeView(employee).render());
			});
		}
		match = hash.match(this.newEmployeeURL);
		if (match) {
			self.slidePage(new NewEmployeeView(this.store).render());
		}
		/*match = hash.match(this.newEmployeeSavedURL);
		if(match){
			self.slidePage(this.homePage);
		}*/
	},

	slidePage: function(page) {

		var currentPageDest,
			self = this;

		// If there is no current page (app just started) -> No transition: Position new page in the view port
		if (!this.currentPage) {
			$(page.el).attr('class', 'page stage-center');
			$('body').append(page.el);
			this.currentPage = page;
			return;
		}

		// Cleaning up: remove old pages that were moved out of the viewport
		$('.stage-right, .stage-left').not('.homePage').remove();

		if (page === app.homePage) {
			// Always apply a Back transition (slide from left) when we go back to the search page
			$(page.el).attr('class', 'page stage-left');
			currentPageDest = "stage-right";
		} else {
			// Forward transition (slide from right)
			$(page.el).attr('class', 'page stage-right');
			currentPageDest = "stage-left";
		}

		$('body').append(page.el);

		// Wait until the new page has been added to the DOM...
		setTimeout(function() {
			// Slide out the current page: If new page slides from the right -> slide current page to the left, and vice versa
			$(self.currentPage.el).attr('class', 'page transition ' + currentPageDest);
			// Slide in the new page
			$(page.el).attr('class', 'page stage-center transition');
			self.currentPage = page;
		});

	},

	onDeviceReady: function() {
		document.addEventListener("backbutton", this.onBackKeyDown, false);
	},

	onBackKeyDown: function() {
		var self = this;
		if(this.homePageRendered){
			navigator.app.exitApp();
			console.log('exitApp');
		}
		else{
			window.location.href = window.location.pathname + "#";
		}
	},

	initialize: function() {
		var self = this;
		this.detailsURL = /^#employees\/(\d{1,})/;
		this.newEmployeeURL = /^#new-employee/;
		this.newEmployeeSavedURL = /^#new-employee-saved/;
		this.registerEvents();
		this.store = new WebSqlStore(function() {
			self.route();
		});
	}

};

app.initialize();
