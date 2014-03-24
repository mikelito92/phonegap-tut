var app = {

	registerEvents: function() {
		var self = this;
		// Check of browser supports touch events...
		if (document.documentElement.hasOwnProperty('ontouchstart')) {
			// ... if yes: register touch event listener to change the "selected" state of the item
			$('body').on('touchstart', 'a', function(event) 
				$(this).on('touchend', function(e) {
					$(this).off('touchend');
					$(event.target).removeClass('tappable-active');
				});
				$(this).on('touchmove', function(e){
					$(this).off('touchend');
					});
				}
				$(event.target).addClass('tappable-active');
			});
			/*$('body').on('touchend', 'a', function(event) {
				$(event.target).removeClass('tappable-active');
			});*/
		} else {
			// ... if not: register mouse events instead
			$('body').on('mousedown', 'a', function(event) {
				$(event.target).addClass('tappable-active');
			});
			$('body').on('mouseup', 'a', function(event) {
				$(event.target).removeClass('tappable-active');
			});
		}
	},

	showAlert: function (message, title) {
		if (navigator.notification) {
			navigator.notification.alert(message, null, title, 'OK');
		} else {
			alert(title ? (title + ": " + message) : message);
		}
	},

	initialize: function() {
		var self = this;
		this.store = new MemoryStore(function() {
			$('body').html(new HomeView(self.store).render().el);
		});
		this.registerEvents();
	}

};

app.initialize();