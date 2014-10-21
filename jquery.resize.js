/**
 * @license MIT http://mu-lib.mit-license.org/
 */
define([ "jquery" ], function ResizeModule($) {

	/**
	 * Normalized resize event for DOM elements. Extends {@link jQuery} with:
	 *
	 * - {@link $#event-resize} event
	 *
	 * @class mu-lib.jquery.resize
	 * @static
	 * @alias plugin.jquery
	 */

	var NULL = null;
	var RESIZE = "resize";
	var W = "w";
	var H = "h";
	var $ELEMENTS = $([]);
	var INTERVAL = NULL;

	function iterator(index, self) {
		// Get data
		var $data = $.data(self);

		// Get reference to $self
		var $self = $(self);

		// Get previous width and height
		var w = $self.width();
		var h = $self.height();

		// Check if width or height has changed since last check
		if (w !== $data[W] || h !== $data[H]) {
			$self.trigger(RESIZE, [$data[W] = w, $data[H] = h]);
		}
	}

	/**
	 * Internal interval
	 */
	function interval() {
		$ELEMENTS.each(iterator);
	}

	$.event.special[RESIZE] = {
		setup : function () {
			var self = this;

			// window has a native resize event, exit fast
			if ($.isWindow(self)) {
				return false;
			}

			// Store data
			var $data = $.data(self, RESIZE, {});

			// Get reference to $self
			var $self = $(self);

			// Initialize data
			$data[W] = $self.width();
			$data[H] = $self.height();

			// Add to tracked collection
			$ELEMENTS = $ELEMENTS.add(self);

			// If this is the first element, start interval
			if($ELEMENTS.length === 1) {
				INTERVAL = setInterval(interval, 100);
			}
		},

		teardown : function () {
			var self = this;

			// window has a native resize event, exit fast
			if ($.isWindow(self)) {
				return false;
			}

			// Remove data
			$.removeData(self, RESIZE);

			// Remove from tracked collection
			$ELEMENTS = $ELEMENTS.not(self);

			// If this is the last element, stop interval
			if($ELEMENTS.length === 0 && INTERVAL !== NULL) {
				clearInterval(INTERVAL);
			}
		}
	};
});
