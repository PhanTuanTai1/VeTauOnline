function accent_fold(a) {
	if (!a) return "";
	for (var b = "", c = 0; c < a.length; c++) b += accent_map[a.charAt(c)] || a.charAt(c);
	return b
}

function showError(a, b) {
	"undefined" != typeof a && $("#errors .message").html(a), $("#errors").modal(), "function" == typeof b && $("#errors").on("hidden.bs.modal", b)
}

function showMessage(a) {
	$("#message .message").html(a), $("#message").fadeIn(), setTimeout(function () {
		$("#message").fadeOut()
	}, 5e3)
}

function showModalMessage(a, b) {
	$("#modal_message_title").html(a), $("#modal_message_text").html(b), $("#modal_message").modal()
}

function showWaitingOverlay(a, b) {
	$("#waiting_text1").html(a), $("#waiting_text2").html("undefined" != typeof b ? b : ""), $("#main_container").addClass("blur"), $("#waiting_overlay").fadeIn()
}

function hideWaitingOverlay() {
	$("#main_container").removeClass("blur"), $("#waiting_overlay").fadeOut()
}

function calculateProcessingFee(a, b, c) {
	if (0 == a) return 0;
	if ("undefined" == typeof b && ($("input[name=payment_type]:checked").length ? b = $("input[name=payment_type]:checked").val() : $("#payment_type").length && (b = $("#payment_type").val())), "undefined" == typeof c && (c = currency), "PAYPAL" == b || "STRIPE" == b.substr(0, 6)) {
		var d, e;
		return "PAYPAL" == b ? (d = 44, e = .5) : "STRIPE_ALIPAY" == b.substr(0, 13) ? (d = 22, e = .35) : (d = 34, e = .5), "STRIPE_ALIPAY" == b.substr(0, 13) && "undefined" != typeof alipay_currencies && $.inArray(c, alipay_currencies) < 0 && (c = "SGD"), "SGD" != c && "STRIPE_ALIPAY" != b.substr(0, 13) && (d += 20), d /= 1e3, 1e3 * Math.ceil((exchange(e, "SGD", "VND") + d * a) / (1 - d) * .001)
	}
	return "ONEPAY_DOMESTIC" == b ? 1e3 * Math.ceil((1760 + .011 * a) / .989 * .001) : "ONEPAY_AMEX" == b ? 1e3 * Math.ceil((7150 + .0385 * a) / .9615 * .001) : "PAYOO" == b ? 1e3 * Math.ceil((5e3 + .01 * a) / .99 * .001) : "AGENT_CREDIT" == b || "PAYOO_POS" == b || "BANK" == b.substr(0, 4) || "CASH" == b.substr(0, 4) ? 0 : 1e3 * Math.ceil((7150 + .026 * a) / .974 * .001)
}

function number_format(a, b, c, d) {
	a = (a + "").replace(/[^0-9+\-Ee.]/g, "");
	var e = isFinite(+a) ? +a : 0,
		f = isFinite(+b) ? Math.abs(b) : 0,
		g = "undefined" == typeof d ? "," : d,
		h = "undefined" == typeof c ? "." : c,
		i = "",
		j = function (a, b) {
			var c = Math.pow(10, b);
			return "" + Math.round(a * c) / c
		};
	return i = (f ? j(e, f) : "" + Math.round(e)).split("."), i[0].length > 3 && (i[0] = i[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, g)), (i[1] || "").length < f && (i[1] = i[1] || "", i[1] += new Array(f - i[1].length + 1).join("0")), i.join(h)
}

function round_money(a, b) {
	"undefined" == typeof b && (b = currency);
	var c = $.inArray(b, int_currencies) >= 0 || $.inArray(b, forced_int_currencies) >= 0 ? 0 : 2;
	return number_format(a, c)
}

function number2money(a, b, c) {
	"undefined" == typeof b && (b = currency), "undefined" == typeof c && (c = "&nbsp;");
	var d = currencies[b];
	return $.inArray(b, left_currencies) >= 0 ? d + c + round_money(a, b) : round_money(a, b) + c + d
}

function str2number(a) {
	return "String" != typeof a && (a = a.toString()), "" != a ? Number(a.replace(/[^0-9\.-]/g, "")) : 0
}

function exchange(a, b, c) {
	return exchange_rates || ($.getJSON(site_url + "ajax/exchange_rates", {
		url: current_url
	}, function (a) {
		exchange_rates = a
	}), exchange_rates = default_exchange_rates), "undefined" == typeof c && (c = currency), str2number(round_money(b != c ? a * exchange_rates[b + "/" + c] : a, c))
}

function updateCurrency() {
	$(".money").each(function () {
		var a = "INPUT" == $(this).prop("tagName") ? str2number($(this).val()) : Number($(this).attr("data-amount")),
			b = $(this).attr("data-currency");
		if ("undefined" == typeof b && (b = "VND"), "undefined" != typeof a && !isNaN(a) && "undefined" != typeof b) {
			if ("VND" == b && $(this).data("VND_value", a), b != currency) {
				if ("VND" != b) {
					var c = exchange($.inArray(b, int_currencies) >= 0 ? 1 : .01, b, "VND");
					c > 500 && (c = 500), a = exchange(a, b, "VND"), $(this).data("VND_value") && Math.abs(a - $(this).data("VND_value")) < c && (a = $(this).data("VND_value"))
				}
				a = exchange(a, "VND", currency)
			}
			"INPUT" == $(this).prop("tagName") ? ($(this).attr("data-currency", currency), $(this).val(number2money(a, currency, " "))) : $(this).html(number2money(a))
		}
	})
}

function initLogoSlideshows(a) {
	$(".logo_slideshow").each(function () {
		var b = $(this),
			c = b.children();
		c.length > 1 ? b.hasClass("slideshow_started") || (b.addClass("slideshow_started"), c.eq(0).addClass("active"), c.length > 1 && setInterval(function () {
			var a = b.find(".active"),
				d = a.next();
			d.length || (d = c.eq(0)), a.removeClass("active"), d.addClass("active")
		}, 1e3 * (a - 1) / c.length)) : b.find("img").eq(0).addClass("active")
	})
}

function log_message(a) {
	"undefined" == typeof current_url && (current_url = window.location.href), $.get(site_url + "ajax/log_message", {
		message: a,
		current_url: encodeURI(current_url)
	})
}

function post(a, b, c) {
	var d = $("<form></form>");
	d.attr("method", "post"), d.attr("action", a), "undefined" != typeof c && d.attr("target", c), $.each(b, function (a, b) {
		var c = $("<input></input>");
		c.attr("type", "hidden"), c.attr("name", a), c.attr("value", b), d.append(c)
	}), $(document.body).append(d), d.submit()
}

function htmlDecode(a) {
	var b = (new DOMParser).parseFromString(a, "text/html");
	return b.documentElement.textContent
}

function copyToClipboard(a) {
	$(".copy_clipboard").css("background-color", "transparent");
	var b = $("<input>");
	$("body").append(b), b.val($(a).text()).select(), $(a).css("background", "rgba(66,200,244,.2)"), document.execCommand("copy"), b.remove()
}

function load_js(a) {
	$("<script/>", {
		type: "text/javascript",
		src: a
	}).appendTo("head")
}

function load_gmaps() {
	window.hasOwnProperty("googlemap_js_loaded") || (load_js("https://maps.googleapis.com/maps/api/js?key=AIzaSyDZtKlx_xYNnnF3p1CcwgUyW3hHJ8ra6Rk"), window.googlemap_js_loaded = !0)
}

function load_recaptcha() {
	window.hasOwnProperty("recaptcha_js_loaded") || (load_js("https://www.google.com/recaptcha/api.js"), window.recaptcha_js_loaded = !0)
}

function load_resultset_by_transportation_type() {
	("undefined" == typeof transportation_type || "" != transportation_type) && $("input[name='transport_filter']").each(function () {
		if ($(this).val() != transportation_type) {
			var a = $(this).val();
			return $(".result." + a).each(function () {
				$(this).hide(), $($(this).attr("data-target")).hide()
			}), !0
		}
		var b = new Array,
			c = $("input[name=" + $(this).attr("name") + "]:checked");
		c.each(function () {
			b.push($(this).val())
		}), $("#transports").val(b.join("-"));
		var a = $(this).val();
		if ($(this).is(":checked")) {
			if (!$(this).attr("data-checked")) return $("#origin").typeahead("val", $("#origin_town").val().capitalize()), $("#destination").typeahead("val", $("#destination_town").val().capitalize()), $("#origin_type").val("town"), $("#destination_type").val("town"), $("#departure_reload").attr("name", "departure"), void $("#search_form").submit();
			$(".result." + a).show()
		} else $(".result." + a).each(function () {
			$(this).hide(), $($(this).attr("data-target")).hide()
		});
		$.post(site_url + "ajax/set_transports_filter/" + $("#sess_key").val() + "/" + $("#transports").val());
		var d = "transport_filter" == $(this).attr("name") ? "mobile_transport_filter" : "transport_filter";
		$("input[name=" + d + "][value=" + $(this).val() + "]").prop("checked", $(this).is(":checked")), $("#results_disclaimer").css("opacity", 1), $("#results_headers, #results_disclaimer, .progress").toggle($(".result:visible").length > 0), $("#no_results").toggle(0 == $(".result:visible").length), iea && $("#btnLoadMore").toggle($(".result:visible").length > 0)
	})
}
if ("undefined" == typeof jQuery) throw new Error("Bootstrap's JavaScript requires jQuery"); + function (a) {
	"use strict";
	var b = a.fn.jquery.split(" ")[0].split(".");
	if (b[0] < 2 && b[1] < 9 || 1 == b[0] && 9 == b[1] && b[2] < 1 || b[0] > 2) throw new Error("Bootstrap's JavaScript requires jQuery version 1.9.1 or higher, but lower than version 3")
}(jQuery), + function (a) {
	"use strict";

	function b() {
		var a = document.createElement("bootstrap"),
			b = {
				WebkitTransition: "webkitTransitionEnd",
				MozTransition: "transitionend",
				OTransition: "oTransitionEnd otransitionend",
				transition: "transitionend"
			};
		for (var c in b)
			if (void 0 !== a.style[c]) return {
				end: b[c]
			};
		return !1
	}
	a.fn.emulateTransitionEnd = function (b) {
		var c = !1,
			d = this;
		a(this).one("bsTransitionEnd", function () {
			c = !0
		});
		var e = function () {
			c || a(d).trigger(a.support.transition.end)
		};
		return setTimeout(e, b), this
	}, a(function () {
		a.support.transition = b(), a.support.transition && (a.event.special.bsTransitionEnd = {
			bindType: a.support.transition.end,
			delegateType: a.support.transition.end,
			handle: function (b) {
				return a(b.target).is(this) ? b.handleObj.handler.apply(this, arguments) : void 0
			}
		})
	})
}(jQuery), + function (a) {
	"use strict";

	function b(b) {
		return this.each(function () {
			var c = a(this),
				e = c.data("bs.alert");
			e || c.data("bs.alert", e = new d(this)), "string" == typeof b && e[b].call(c)
		})
	}
	var c = '[data-dismiss="alert"]',
		d = function (b) {
			a(b).on("click", c, this.close)
		};
	d.VERSION = "3.3.6", d.TRANSITION_DURATION = 150, d.prototype.close = function (b) {
		function c() {
			g.detach().trigger("closed.bs.alert").remove()
		}
		var e = a(this),
			f = e.attr("data-target");
		f || (f = e.attr("href"), f = f && f.replace(/.*(?=#[^\s]*$)/, ""));
		var g = a(f);
		b && b.preventDefault(), g.length || (g = e.closest(".alert")), g.trigger(b = a.Event("close.bs.alert")), b.isDefaultPrevented() || (g.removeClass("in"), a.support.transition && g.hasClass("fade") ? g.one("bsTransitionEnd", c).emulateTransitionEnd(d.TRANSITION_DURATION) : c())
	};
	var e = a.fn.alert;
	a.fn.alert = b, a.fn.alert.Constructor = d, a.fn.alert.noConflict = function () {
		return a.fn.alert = e, this
	}, a(document).on("click.bs.alert.data-api", c, d.prototype.close)
}(jQuery), + function (a) {
	"use strict";

	function b(b) {
		return this.each(function () {
			var d = a(this),
				e = d.data("bs.button"),
				f = "object" == typeof b && b;
			e || d.data("bs.button", e = new c(this, f)), "toggle" == b ? e.toggle() : b && e.setState(b)
		})
	}
	var c = function (b, d) {
		this.$element = a(b), this.options = a.extend({}, c.DEFAULTS, d), this.isLoading = !1
	};
	c.VERSION = "3.3.6", c.DEFAULTS = {
		loadingText: "loading..."
	}, c.prototype.setState = function (b) {
		var c = "disabled",
			d = this.$element,
			e = d.is("input") ? "val" : "html",
			f = d.data();
		b += "Text", null == f.resetText && d.data("resetText", d[e]()), setTimeout(a.proxy(function () {
			d[e](null == f[b] ? this.options[b] : f[b]), "loadingText" == b ? (this.isLoading = !0, d.addClass(c).attr(c, c)) : this.isLoading && (this.isLoading = !1, d.removeClass(c).removeAttr(c))
		}, this), 0)
	}, c.prototype.toggle = function () {
		var a = !0,
			b = this.$element.closest('[data-toggle="buttons"]');
		if (b.length) {
			var c = this.$element.find("input");
			"radio" == c.prop("type") ? (c.prop("checked") && (a = !1), b.find(".active").removeClass("active"), this.$element.addClass("active")) : "checkbox" == c.prop("type") && (c.prop("checked") !== this.$element.hasClass("active") && (a = !1), this.$element.toggleClass("active")), c.prop("checked", this.$element.hasClass("active")), a && c.trigger("change")
		} else this.$element.attr("aria-pressed", !this.$element.hasClass("active")), this.$element.toggleClass("active")
	};
	var d = a.fn.button;
	a.fn.button = b, a.fn.button.Constructor = c, a.fn.button.noConflict = function () {
		return a.fn.button = d, this
	}, a(document).on("click.bs.button.data-api", '[data-toggle^="button"]', function (c) {
		var d = a(c.target);
		d.hasClass("btn") || (d = d.closest(".btn")), b.call(d, "toggle"), a(c.target).is('input[type="radio"]') || a(c.target).is('input[type="checkbox"]') || c.preventDefault()
	}).on("focus.bs.button.data-api blur.bs.button.data-api", '[data-toggle^="button"]', function (b) {
		a(b.target).closest(".btn").toggleClass("focus", /^focus(in)?$/.test(b.type))
	})
}(jQuery), + function (a) {
	"use strict";

	function b(b) {
		return this.each(function () {
			var d = a(this),
				e = d.data("bs.carousel"),
				f = a.extend({}, c.DEFAULTS, d.data(), "object" == typeof b && b),
				g = "string" == typeof b ? b : f.slide;
			e || d.data("bs.carousel", e = new c(this, f)), "number" == typeof b ? e.to(b) : g ? e[g]() : f.interval && e.pause().cycle()
		})
	}
	var c = function (b, c) {
		this.$element = a(b), this.$indicators = this.$element.find(".carousel-indicators"), this.options = c, this.paused = null, this.sliding = null, this.interval = null, this.$active = null, this.$items = null, this.options.keyboard && this.$element.on("keydown.bs.carousel", a.proxy(this.keydown, this)), "hover" == this.options.pause && !("ontouchstart" in document.documentElement) && this.$element.on("mouseenter.bs.carousel", a.proxy(this.pause, this)).on("mouseleave.bs.carousel", a.proxy(this.cycle, this))
	};
	c.VERSION = "3.3.6", c.TRANSITION_DURATION = 600, c.DEFAULTS = {
		interval: 5e3,
		pause: "hover",
		wrap: !0,
		keyboard: !0
	}, c.prototype.keydown = function (a) {
		if (!/input|textarea/i.test(a.target.tagName)) {
			switch (a.which) {
				case 37:
					this.prev();
					break;
				case 39:
					this.next();
					break;
				default:
					return
			}
			a.preventDefault()
		}
	}, c.prototype.cycle = function (b) {
		return b || (this.paused = !1), this.interval && clearInterval(this.interval), this.options.interval && !this.paused && (this.interval = setInterval(a.proxy(this.next, this), this.options.interval)), this
	}, c.prototype.getItemIndex = function (a) {
		return this.$items = a.parent().children(".item"), this.$items.index(a || this.$active)
	}, c.prototype.getItemForDirection = function (a, b) {
		var c = this.getItemIndex(b),
			d = "prev" == a && 0 === c || "next" == a && c == this.$items.length - 1;
		if (d && !this.options.wrap) return b;
		var e = "prev" == a ? -1 : 1,
			f = (c + e) % this.$items.length;
		return this.$items.eq(f)
	}, c.prototype.to = function (a) {
		var b = this,
			c = this.getItemIndex(this.$active = this.$element.find(".item.active"));
		return a > this.$items.length - 1 || 0 > a ? void 0 : this.sliding ? this.$element.one("slid.bs.carousel", function () {
			b.to(a)
		}) : c == a ? this.pause().cycle() : this.slide(a > c ? "next" : "prev", this.$items.eq(a))
	}, c.prototype.pause = function (b) {
		return b || (this.paused = !0), this.$element.find(".next, .prev").length && a.support.transition && (this.$element.trigger(a.support.transition.end), this.cycle(!0)), this.interval = clearInterval(this.interval), this
	}, c.prototype.next = function () {
		return this.sliding ? void 0 : this.slide("next")
	}, c.prototype.prev = function () {
		return this.sliding ? void 0 : this.slide("prev")
	}, c.prototype.slide = function (b, d) {
		var e = this.$element.find(".item.active"),
			f = d || this.getItemForDirection(b, e),
			g = this.interval,
			h = "next" == b ? "left" : "right",
			i = this;
		if (f.hasClass("active")) return this.sliding = !1;
		var j = f[0],
			k = a.Event("slide.bs.carousel", {
				relatedTarget: j,
				direction: h
			});
		if (this.$element.trigger(k), !k.isDefaultPrevented()) {
			if (this.sliding = !0, g && this.pause(), this.$indicators.length) {
				this.$indicators.find(".active").removeClass("active");
				var l = a(this.$indicators.children()[this.getItemIndex(f)]);
				l && l.addClass("active")
			}
			var m = a.Event("slid.bs.carousel", {
				relatedTarget: j,
				direction: h
			});
			return a.support.transition && this.$element.hasClass("slide") ? (f.addClass(b), f[0].offsetWidth, e.addClass(h), f.addClass(h), e.one("bsTransitionEnd", function () {
				f.removeClass([b, h].join(" ")).addClass("active"), e.removeClass(["active", h].join(" ")), i.sliding = !1, setTimeout(function () {
					i.$element.trigger(m)
				}, 0)
			}).emulateTransitionEnd(c.TRANSITION_DURATION)) : (e.removeClass("active"), f.addClass("active"), this.sliding = !1, this.$element.trigger(m)), g && this.cycle(), this
		}
	};
	var d = a.fn.carousel;
	a.fn.carousel = b, a.fn.carousel.Constructor = c, a.fn.carousel.noConflict = function () {
		return a.fn.carousel = d, this
	};
	var e = function (c) {
		var d, e = a(this),
			f = a(e.attr("data-target") || (d = e.attr("href")) && d.replace(/.*(?=#[^\s]+$)/, ""));
		if (f.hasClass("carousel")) {
			var g = a.extend({}, f.data(), e.data()),
				h = e.attr("data-slide-to");
			h && (g.interval = !1), b.call(f, g), h && f.data("bs.carousel").to(h), c.preventDefault()
		}
	};
	a(document).on("click.bs.carousel.data-api", "[data-slide]", e).on("click.bs.carousel.data-api", "[data-slide-to]", e), a(window).on("load", function () {
		a('[data-ride="carousel"]').each(function () {
			var c = a(this);
			b.call(c, c.data())
		})
	})
}(jQuery), + function (a) {
	"use strict";

	function b(b) {
		var c, d = b.attr("data-target") || (c = b.attr("href")) && c.replace(/.*(?=#[^\s]+$)/, "");
		return a(d)
	}

	function c(b) {
		return this.each(function () {
			var c = a(this),
				e = c.data("bs.collapse"),
				f = a.extend({}, d.DEFAULTS, c.data(), "object" == typeof b && b);
			!e && f.toggle && /show|hide/.test(b) && (f.toggle = !1), e || c.data("bs.collapse", e = new d(this, f)), "string" == typeof b && e[b]()
		})
	}
	var d = function (b, c) {
		this.$element = a(b), this.options = a.extend({}, d.DEFAULTS, c), this.$trigger = a('[data-toggle="collapse"][href="#' + b.id + '"],[data-toggle="collapse"][data-target="#' + b.id + '"]'), this.transitioning = null, this.options.parent ? this.$parent = this.getParent() : this.addAriaAndCollapsedClass(this.$element, this.$trigger), this.options.toggle && this.toggle()
	};
	d.VERSION = "3.3.6", d.TRANSITION_DURATION = 350, d.DEFAULTS = {
		toggle: !0
	}, d.prototype.dimension = function () {
		var a = this.$element.hasClass("width");
		return a ? "width" : "height"
	}, d.prototype.show = function () {
		if (!this.transitioning && !this.$element.hasClass("in")) {
			var b, e = this.$parent && this.$parent.children(".panel").children(".in, .collapsing");
			if (!(e && e.length && (b = e.data("bs.collapse"), b && b.transitioning))) {
				var f = a.Event("show.bs.collapse");
				if (this.$element.trigger(f), !f.isDefaultPrevented()) {
					e && e.length && (c.call(e, "hide"), b || e.data("bs.collapse", null));
					var g = this.dimension();
					this.$element.removeClass("collapse").addClass("collapsing")[g](0).attr("aria-expanded", !0), this.$trigger.removeClass("collapsed").attr("aria-expanded", !0), this.transitioning = 1;
					var h = function () {
						this.$element.removeClass("collapsing").addClass("collapse in")[g](""), this.transitioning = 0, this.$element.trigger("shown.bs.collapse")
					};
					if (!a.support.transition) return h.call(this);
					var i = a.camelCase(["scroll", g].join("-"));
					this.$element.one("bsTransitionEnd", a.proxy(h, this)).emulateTransitionEnd(d.TRANSITION_DURATION)[g](this.$element[0][i])
				}
			}
		}
	}, d.prototype.hide = function () {
		if (!this.transitioning && this.$element.hasClass("in")) {
			var b = a.Event("hide.bs.collapse");
			if (this.$element.trigger(b), !b.isDefaultPrevented()) {
				var c = this.dimension();
				this.$element[c](this.$element[c]())[0].offsetHeight, this.$element.addClass("collapsing").removeClass("collapse in").attr("aria-expanded", !1), this.$trigger.addClass("collapsed").attr("aria-expanded", !1), this.transitioning = 1;
				var e = function () {
					this.transitioning = 0, this.$element.removeClass("collapsing").addClass("collapse").trigger("hidden.bs.collapse")
				};
				return a.support.transition ? void this.$element[c](0).one("bsTransitionEnd", a.proxy(e, this)).emulateTransitionEnd(d.TRANSITION_DURATION) : e.call(this)
			}
		}
	}, d.prototype.toggle = function () {
		this[this.$element.hasClass("in") ? "hide" : "show"]()
	}, d.prototype.getParent = function () {
		return a(this.options.parent).find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]').each(a.proxy(function (c, d) {
			var e = a(d);
			this.addAriaAndCollapsedClass(b(e), e)
		}, this)).end()
	}, d.prototype.addAriaAndCollapsedClass = function (a, b) {
		var c = a.hasClass("in");
		a.attr("aria-expanded", c), b.toggleClass("collapsed", !c).attr("aria-expanded", c)
	};
	var e = a.fn.collapse;
	a.fn.collapse = c, a.fn.collapse.Constructor = d, a.fn.collapse.noConflict = function () {
		return a.fn.collapse = e, this
	}, a(document).on("click.bs.collapse.data-api", '[data-toggle="collapse"]', function (d) {
		var e = a(this);
		e.attr("data-target") || d.preventDefault();
		var f = b(e),
			g = f.data("bs.collapse"),
			h = g ? "toggle" : e.data();
		c.call(f, h)
	})
}(jQuery), + function (a) {
	"use strict";

	function b(b) {
		var c = b.attr("data-target");
		c || (c = b.attr("href"), c = c && /#[A-Za-z]/.test(c) && c.replace(/.*(?=#[^\s]*$)/, ""));
		var d = c && a(c);
		return d && d.length ? d : b.parent()
	}

	function c(c) {
		c && 3 === c.which || (a(e).remove(), a(f).each(function () {
			var d = a(this),
				e = b(d),
				f = {
					relatedTarget: this
				};
			e.hasClass("open") && (c && "click" == c.type && /input|textarea/i.test(c.target.tagName) && a.contains(e[0], c.target) || (e.trigger(c = a.Event("hide.bs.dropdown", f)), c.isDefaultPrevented() || (d.attr("aria-expanded", "false"), e.removeClass("open").trigger(a.Event("hidden.bs.dropdown", f)))))
		}))
	}

	function d(b) {
		return this.each(function () {
			var c = a(this),
				d = c.data("bs.dropdown");
			d || c.data("bs.dropdown", d = new g(this)), "string" == typeof b && d[b].call(c)
		})
	}
	var e = ".dropdown-backdrop",
		f = '[data-toggle="dropdown"]',
		g = function (b) {
			a(b).on("click.bs.dropdown", this.toggle)
		};
	g.VERSION = "3.3.6", g.prototype.toggle = function (d) {
		var e = a(this);
		if (!e.is(".disabled, :disabled")) {
			var f = b(e),
				g = f.hasClass("open");
			if (c(), !g) {
				"ontouchstart" in document.documentElement && !f.closest(".navbar-nav").length && a(document.createElement("div")).addClass("dropdown-backdrop").insertAfter(a(this)).on("click", c);
				var h = {
					relatedTarget: this
				};
				if (f.trigger(d = a.Event("show.bs.dropdown", h)), d.isDefaultPrevented()) return;
				e.trigger("focus").attr("aria-expanded", "true"), f.toggleClass("open").trigger(a.Event("shown.bs.dropdown", h))
			}
			return !1
		}
	}, g.prototype.keydown = function (c) {
		if (/(38|40|27|32)/.test(c.which) && !/input|textarea/i.test(c.target.tagName)) {
			var d = a(this);
			if (c.preventDefault(), c.stopPropagation(), !d.is(".disabled, :disabled")) {
				var e = b(d),
					g = e.hasClass("open");
				if (!g && 27 != c.which || g && 27 == c.which) return 27 == c.which && e.find(f).trigger("focus"), d.trigger("click");
				var h = " li:not(.disabled):visible a",
					i = e.find(".dropdown-menu" + h);
				if (i.length) {
					var j = i.index(c.target);
					38 == c.which && j > 0 && j--, 40 == c.which && j < i.length - 1 && j++, ~j || (j = 0), i.eq(j).trigger("focus")
				}
			}
		}
	};
	var h = a.fn.dropdown;
	a.fn.dropdown = d, a.fn.dropdown.Constructor = g, a.fn.dropdown.noConflict = function () {
		return a.fn.dropdown = h, this
	}, a(document).on("click.bs.dropdown.data-api", c).on("click.bs.dropdown.data-api", ".dropdown form", function (a) {
		a.stopPropagation()
	}).on("click.bs.dropdown.data-api", f, g.prototype.toggle).on("keydown.bs.dropdown.data-api", f, g.prototype.keydown).on("keydown.bs.dropdown.data-api", ".dropdown-menu", g.prototype.keydown)
}(jQuery), + function (a) {
	"use strict";

	function b(b, d) {
		return this.each(function () {
			var e = a(this),
				f = e.data("bs.modal"),
				g = a.extend({}, c.DEFAULTS, e.data(), "object" == typeof b && b);
			f || e.data("bs.modal", f = new c(this, g)), "string" == typeof b ? f[b](d) : g.show && f.show(d)
		})
	}
	var c = function (b, c) {
		this.options = c, this.$body = a(document.body), this.$element = a(b), this.$dialog = this.$element.find(".modal-dialog"), this.$backdrop = null, this.isShown = null, this.originalBodyPad = null, this.scrollbarWidth = 0, this.ignoreBackdropClick = !1, this.options.remote && this.$element.find(".modal-content").load(this.options.remote, a.proxy(function () {
			this.$element.trigger("loaded.bs.modal")
		}, this))
	};
	c.VERSION = "3.3.6", c.TRANSITION_DURATION = 300, c.BACKDROP_TRANSITION_DURATION = 150, c.DEFAULTS = {
		backdrop: !0,
		keyboard: !0,
		show: !0
	}, c.prototype.toggle = function (a) {
		return this.isShown ? this.hide() : this.show(a)
	}, c.prototype.show = function (b) {
		var d = this,
			e = a.Event("show.bs.modal", {
				relatedTarget: b
			});
		this.$element.trigger(e), this.isShown || e.isDefaultPrevented() || (this.isShown = !0, this.checkScrollbar(), this.setScrollbar(), this.$body.addClass("modal-open"), this.escape(), this.resize(), this.$element.on("click.dismiss.bs.modal", '[data-dismiss="modal"]', a.proxy(this.hide, this)), this.$dialog.on("mousedown.dismiss.bs.modal", function () {
			d.$element.one("mouseup.dismiss.bs.modal", function (b) {
				a(b.target).is(d.$element) && (d.ignoreBackdropClick = !0)
			})
		}), this.backdrop(function () {
			var e = a.support.transition && d.$element.hasClass("fade");
			d.$element.parent().length || d.$element.appendTo(d.$body), d.$element.show().scrollTop(0), d.adjustDialog(), e && d.$element[0].offsetWidth, d.$element.addClass("in"), d.enforceFocus();
			var f = a.Event("shown.bs.modal", {
				relatedTarget: b
			});
			e ? d.$dialog.one("bsTransitionEnd", function () {
				d.$element.trigger("focus").trigger(f)
			}).emulateTransitionEnd(c.TRANSITION_DURATION) : d.$element.trigger("focus").trigger(f)
		}))
	}, c.prototype.hide = function (b) {
		b && b.preventDefault(), b = a.Event("hide.bs.modal"), this.$element.trigger(b), this.isShown && !b.isDefaultPrevented() && (this.isShown = !1, this.escape(), this.resize(), a(document).off("focusin.bs.modal"), this.$element.removeClass("in").off("click.dismiss.bs.modal").off("mouseup.dismiss.bs.modal"), this.$dialog.off("mousedown.dismiss.bs.modal"), a.support.transition && this.$element.hasClass("fade") ? this.$element.one("bsTransitionEnd", a.proxy(this.hideModal, this)).emulateTransitionEnd(c.TRANSITION_DURATION) : this.hideModal())
	}, c.prototype.enforceFocus = function () {
		a(document).off("focusin.bs.modal").on("focusin.bs.modal", a.proxy(function (a) {
			this.$element[0] === a.target || this.$element.has(a.target).length || this.$element.trigger("focus")
		}, this))
	}, c.prototype.escape = function () {
		this.isShown && this.options.keyboard ? this.$element.on("keydown.dismiss.bs.modal", a.proxy(function (a) {
			27 == a.which && this.hide()
		}, this)) : this.isShown || this.$element.off("keydown.dismiss.bs.modal")
	}, c.prototype.resize = function () {
		this.isShown ? a(window).on("resize.bs.modal", a.proxy(this.handleUpdate, this)) : a(window).off("resize.bs.modal")
	}, c.prototype.hideModal = function () {
		var a = this;
		this.$element.hide(), this.backdrop(function () {
			a.$body.removeClass("modal-open"), a.resetAdjustments(), a.resetScrollbar(), a.$element.trigger("hidden.bs.modal")
		})
	}, c.prototype.removeBackdrop = function () {
		this.$backdrop && this.$backdrop.remove(), this.$backdrop = null
	}, c.prototype.backdrop = function (b) {
		var d = this,
			e = this.$element.hasClass("fade") ? "fade" : "";
		if (this.isShown && this.options.backdrop) {
			var f = a.support.transition && e;
			if (this.$backdrop = a(document.createElement("div")).addClass("modal-backdrop " + e).appendTo(this.$body), this.$element.on("click.dismiss.bs.modal", a.proxy(function (a) {
					return this.ignoreBackdropClick ? void(this.ignoreBackdropClick = !1) : void(a.target === a.currentTarget && ("static" == this.options.backdrop ? this.$element[0].focus() : this.hide()))
				}, this)), f && this.$backdrop[0].offsetWidth, this.$backdrop.addClass("in"), !b) return;
			f ? this.$backdrop.one("bsTransitionEnd", b).emulateTransitionEnd(c.BACKDROP_TRANSITION_DURATION) : b()
		} else if (!this.isShown && this.$backdrop) {
			this.$backdrop.removeClass("in");
			var g = function () {
				d.removeBackdrop(), b && b()
			};
			a.support.transition && this.$element.hasClass("fade") ? this.$backdrop.one("bsTransitionEnd", g).emulateTransitionEnd(c.BACKDROP_TRANSITION_DURATION) : g()
		} else b && b()
	}, c.prototype.handleUpdate = function () {
		this.adjustDialog()
	}, c.prototype.adjustDialog = function () {
		var a = this.$element[0].scrollHeight > document.documentElement.clientHeight;
		this.$element.css({
			paddingLeft: !this.bodyIsOverflowing && a ? this.scrollbarWidth : "",
			paddingRight: this.bodyIsOverflowing && !a ? this.scrollbarWidth : ""
		})
	}, c.prototype.resetAdjustments = function () {
		this.$element.css({
			paddingLeft: "",
			paddingRight: ""
		})
	}, c.prototype.checkScrollbar = function () {
		var a = window.innerWidth;
		if (!a) {
			var b = document.documentElement.getBoundingClientRect();
			a = b.right - Math.abs(b.left)
		}
		this.bodyIsOverflowing = document.body.clientWidth < a, this.scrollbarWidth = this.measureScrollbar()
	}, c.prototype.setScrollbar = function () {
		var a = parseInt(this.$body.css("padding-right") || 0, 10);
		this.originalBodyPad = document.body.style.paddingRight || "", this.bodyIsOverflowing && this.$body.css("padding-right", a + this.scrollbarWidth)
	}, c.prototype.resetScrollbar = function () {
		this.$body.css("padding-right", this.originalBodyPad)
	}, c.prototype.measureScrollbar = function () {
		var a = document.createElement("div");
		a.className = "modal-scrollbar-measure", this.$body.append(a);
		var b = a.offsetWidth - a.clientWidth;
		return this.$body[0].removeChild(a), b
	};
	var d = a.fn.modal;
	a.fn.modal = b, a.fn.modal.Constructor = c, a.fn.modal.noConflict = function () {
		return a.fn.modal = d, this
	}, a(document).on("click.bs.modal.data-api", '[data-toggle="modal"]', function (c) {
		var d = a(this),
			e = d.attr("href"),
			f = a(d.attr("data-target") || e && e.replace(/.*(?=#[^\s]+$)/, "")),
			g = f.data("bs.modal") ? "toggle" : a.extend({
				remote: !/#/.test(e) && e
			}, f.data(), d.data());
		d.is("a") && c.preventDefault(), f.one("show.bs.modal", function (a) {
			a.isDefaultPrevented() || f.one("hidden.bs.modal", function () {
				d.is(":visible") && d.trigger("focus")
			})
		}), b.call(f, g, this)
	})
}(jQuery), + function (a) {
	"use strict";

	function b(b) {
		return this.each(function () {
			var d = a(this),
				e = d.data("bs.tooltip"),
				f = "object" == typeof b && b;
			(e || !/destroy|hide/.test(b)) && (e || d.data("bs.tooltip", e = new c(this, f)), "string" == typeof b && e[b]())
		})
	}
	var c = function (a, b) {
		this.type = null, this.options = null, this.enabled = null, this.timeout = null, this.hoverState = null, this.$element = null, this.inState = null, this.init("tooltip", a, b)
	};
	c.VERSION = "3.3.6", c.TRANSITION_DURATION = 150, c.DEFAULTS = {
		animation: !0,
		placement: "top",
		selector: !1,
		template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
		trigger: "hover focus",
		title: "",
		delay: 0,
		html: !1,
		container: !1,
		viewport: {
			selector: "body",
			padding: 0
		}
	}, c.prototype.init = function (b, c, d) {
		if (this.enabled = !0, this.type = b, this.$element = a(c), this.options = this.getOptions(d), this.$viewport = this.options.viewport && a(a.isFunction(this.options.viewport) ? this.options.viewport.call(this, this.$element) : this.options.viewport.selector || this.options.viewport), this.inState = {
				click: !1,
				hover: !1,
				focus: !1
			}, this.$element[0] instanceof document.constructor && !this.options.selector) throw new Error("`selector` option must be specified when initializing " + this.type + " on the window.document object!");
		for (var e = this.options.trigger.split(" "), f = e.length; f--;) {
			var g = e[f];
			if ("click" == g) this.$element.on("click." + this.type, this.options.selector, a.proxy(this.toggle, this));
			else if ("manual" != g) {
				var h = "hover" == g ? "mouseenter" : "focusin",
					i = "hover" == g ? "mouseleave" : "focusout";
				this.$element.on(h + "." + this.type, this.options.selector, a.proxy(this.enter, this)), this.$element.on(i + "." + this.type, this.options.selector, a.proxy(this.leave, this))
			}
		}
		this.options.selector ? this._options = a.extend({}, this.options, {
			trigger: "manual",
			selector: ""
		}) : this.fixTitle()
	}, c.prototype.getDefaults = function () {
		return c.DEFAULTS
	}, c.prototype.getOptions = function (b) {
		return b = a.extend({}, this.getDefaults(), this.$element.data(), b), b.delay && "number" == typeof b.delay && (b.delay = {
			show: b.delay,
			hide: b.delay
		}), b
	}, c.prototype.getDelegateOptions = function () {
		var b = {},
			c = this.getDefaults();
		return this._options && a.each(this._options, function (a, d) {
			c[a] != d && (b[a] = d)
		}), b
	}, c.prototype.enter = function (b) {
		var c = b instanceof this.constructor ? b : a(b.currentTarget).data("bs." + this.type);
		return c || (c = new this.constructor(b.currentTarget, this.getDelegateOptions()), a(b.currentTarget).data("bs." + this.type, c)), b instanceof a.Event && (c.inState["focusin" == b.type ? "focus" : "hover"] = !0), c.tip().hasClass("in") || "in" == c.hoverState ? void(c.hoverState = "in") : (clearTimeout(c.timeout), c.hoverState = "in", c.options.delay && c.options.delay.show ? void(c.timeout = setTimeout(function () {
			"in" == c.hoverState && c.show()
		}, c.options.delay.show)) : c.show())
	}, c.prototype.isInStateTrue = function () {
		for (var a in this.inState)
			if (this.inState[a]) return !0;
		return !1
	}, c.prototype.leave = function (b) {
		var c = b instanceof this.constructor ? b : a(b.currentTarget).data("bs." + this.type);
		return c || (c = new this.constructor(b.currentTarget, this.getDelegateOptions()), a(b.currentTarget).data("bs." + this.type, c)), b instanceof a.Event && (c.inState["focusout" == b.type ? "focus" : "hover"] = !1), c.isInStateTrue() ? void 0 : (clearTimeout(c.timeout), c.hoverState = "out", c.options.delay && c.options.delay.hide ? void(c.timeout = setTimeout(function () {
			"out" == c.hoverState && c.hide()
		}, c.options.delay.hide)) : c.hide())
	}, c.prototype.show = function () {
		var b = a.Event("show.bs." + this.type);
		if (this.hasContent() && this.enabled) {
			this.$element.trigger(b);
			var d = a.contains(this.$element[0].ownerDocument.documentElement, this.$element[0]);
			if (b.isDefaultPrevented() || !d) return;
			var e = this,
				f = this.tip(),
				g = this.getUID(this.type);
			this.setContent(), f.attr("id", g), this.$element.attr("aria-describedby", g), this.options.animation && f.addClass("fade");
			var h = "function" == typeof this.options.placement ? this.options.placement.call(this, f[0], this.$element[0]) : this.options.placement,
				i = /\s?auto?\s?/i,
				j = i.test(h);
			j && (h = h.replace(i, "") || "top"), f.detach().css({
				top: 0,
				left: 0,
				display: "block"
			}).addClass(h).data("bs." + this.type, this), this.options.container ? f.appendTo(this.options.container) : f.insertAfter(this.$element), this.$element.trigger("inserted.bs." + this.type);
			var k = this.getPosition(),
				l = f[0].offsetWidth,
				m = f[0].offsetHeight;
			if (j) {
				var n = h,
					o = this.getPosition(this.$viewport);
				h = "bottom" == h && k.bottom + m > o.bottom ? "top" : "top" == h && k.top - m < o.top ? "bottom" : "right" == h && k.right + l > o.width ? "left" : "left" == h && k.left - l < o.left ? "right" : h, f.removeClass(n).addClass(h)
			}
			var p = this.getCalculatedOffset(h, k, l, m);
			this.applyPlacement(p, h);
			var q = function () {
				var a = e.hoverState;
				e.$element.trigger("shown.bs." + e.type), e.hoverState = null, "out" == a && e.leave(e)
			};
			a.support.transition && this.$tip.hasClass("fade") ? f.one("bsTransitionEnd", q).emulateTransitionEnd(c.TRANSITION_DURATION) : q()
		}
	}, c.prototype.applyPlacement = function (b, c) {
		var d = this.tip(),
			e = d[0].offsetWidth,
			f = d[0].offsetHeight,
			g = parseInt(d.css("margin-top"), 10),
			h = parseInt(d.css("margin-left"), 10);
		isNaN(g) && (g = 0), isNaN(h) && (h = 0), b.top += g, b.left += h, a.offset.setOffset(d[0], a.extend({
			using: function (a) {
				d.css({
					top: Math.round(a.top),
					left: Math.round(a.left)
				})
			}
		}, b), 0), d.addClass("in");
		var i = d[0].offsetWidth,
			j = d[0].offsetHeight;
		"top" == c && j != f && (b.top = b.top + f - j);
		var k = this.getViewportAdjustedDelta(c, b, i, j);
		k.left ? b.left += k.left : b.top += k.top;
		var l = /top|bottom/.test(c),
			m = l ? 2 * k.left - e + i : 2 * k.top - f + j,
			n = l ? "offsetWidth" : "offsetHeight";
		d.offset(b), this.replaceArrow(m, d[0][n], l)
	}, c.prototype.replaceArrow = function (a, b, c) {
		this.arrow().css(c ? "left" : "top", 50 * (1 - a / b) + "%").css(c ? "top" : "left", "")
	}, c.prototype.setContent = function () {
		var a = this.tip(),
			b = this.getTitle();
		a.find(".tooltip-inner")[this.options.html ? "html" : "text"](b), a.removeClass("fade in top bottom left right")
	}, c.prototype.hide = function (b) {
		function d() {
			"in" != e.hoverState && f.detach(), e.$element.removeAttr("aria-describedby").trigger("hidden.bs." + e.type), b && b()
		}
		var e = this,
			f = a(this.$tip),
			g = a.Event("hide.bs." + this.type);
		return this.$element.trigger(g), g.isDefaultPrevented() ? void 0 : (f.removeClass("in"), a.support.transition && f.hasClass("fade") ? f.one("bsTransitionEnd", d).emulateTransitionEnd(c.TRANSITION_DURATION) : d(), this.hoverState = null, this)
	}, c.prototype.fixTitle = function () {
		var a = this.$element;
		(a.attr("title") || "string" != typeof a.attr("data-original-title")) && a.attr("data-original-title", a.attr("title") || "").attr("title", "")
	}, c.prototype.hasContent = function () {
		return this.getTitle()
	}, c.prototype.getPosition = function (b) {
		b = b || this.$element;
		var c = b[0],
			d = "BODY" == c.tagName,
			e = c.getBoundingClientRect();
		null == e.width && (e = a.extend({}, e, {
			width: e.right - e.left,
			height: e.bottom - e.top
		}));
		var f = d ? {
				top: 0,
				left: 0
			} : b.offset(),
			g = {
				scroll: d ? document.documentElement.scrollTop || document.body.scrollTop : b.scrollTop()
			},
			h = d ? {
				width: a(window).width(),
				height: a(window).height()
			} : null;
		return a.extend({}, e, g, h, f)
	}, c.prototype.getCalculatedOffset = function (a, b, c, d) {
		return "bottom" == a ? {
			top: b.top + b.height,
			left: b.left + b.width / 2 - c / 2
		} : "top" == a ? {
			top: b.top - d,
			left: b.left + b.width / 2 - c / 2
		} : "left" == a ? {
			top: b.top + b.height / 2 - d / 2,
			left: b.left - c
		} : {
			top: b.top + b.height / 2 - d / 2,
			left: b.left + b.width
		}
	}, c.prototype.getViewportAdjustedDelta = function (a, b, c, d) {
		var e = {
			top: 0,
			left: 0
		};
		if (!this.$viewport) return e;
		var f = this.options.viewport && this.options.viewport.padding || 0,
			g = this.getPosition(this.$viewport);
		if (/right|left/.test(a)) {
			var h = b.top - f - g.scroll,
				i = b.top + f - g.scroll + d;
			h < g.top ? e.top = g.top - h : i > g.top + g.height && (e.top = g.top + g.height - i)
		} else {
			var j = b.left - f,
				k = b.left + f + c;
			j < g.left ? e.left = g.left - j : k > g.right && (e.left = g.left + g.width - k)
		}
		return e
	}, c.prototype.getTitle = function () {
		var a, b = this.$element,
			c = this.options;
		return a = b.attr("data-original-title") || ("function" == typeof c.title ? c.title.call(b[0]) : c.title)
	}, c.prototype.getUID = function (a) {
		do a += ~~(1e6 * Math.random()); while (document.getElementById(a));
		return a
	}, c.prototype.tip = function () {
		if (!this.$tip && (this.$tip = a(this.options.template), 1 != this.$tip.length)) throw new Error(this.type + " `template` option must consist of exactly 1 top-level element!");
		return this.$tip
	}, c.prototype.arrow = function () {
		return this.$arrow = this.$arrow || this.tip().find(".tooltip-arrow")
	}, c.prototype.enable = function () {
		this.enabled = !0
	}, c.prototype.disable = function () {
		this.enabled = !1
	}, c.prototype.toggleEnabled = function () {
		this.enabled = !this.enabled
	}, c.prototype.toggle = function (b) {
		var c = this;
		b && (c = a(b.currentTarget).data("bs." + this.type), c || (c = new this.constructor(b.currentTarget, this.getDelegateOptions()), a(b.currentTarget).data("bs." + this.type, c))), b ? (c.inState.click = !c.inState.click, c.isInStateTrue() ? c.enter(c) : c.leave(c)) : c.tip().hasClass("in") ? c.leave(c) : c.enter(c)
	}, c.prototype.destroy = function () {
		var a = this;
		clearTimeout(this.timeout), this.hide(function () {
			a.$element.off("." + a.type).removeData("bs." + a.type), a.$tip && a.$tip.detach(), a.$tip = null, a.$arrow = null, a.$viewport = null
		})
	};
	var d = a.fn.tooltip;
	a.fn.tooltip = b, a.fn.tooltip.Constructor = c, a.fn.tooltip.noConflict = function () {
		return a.fn.tooltip = d, this
	}
}(jQuery), + function (a) {
	"use strict";

	function b(b) {
		return this.each(function () {
			var d = a(this),
				e = d.data("bs.popover"),
				f = "object" == typeof b && b;
			(e || !/destroy|hide/.test(b)) && (e || d.data("bs.popover", e = new c(this, f)), "string" == typeof b && e[b]())
		})
	}
	var c = function (a, b) {
		this.init("popover", a, b)
	};
	if (!a.fn.tooltip) throw new Error("Popover requires tooltip.js");
	c.VERSION = "3.3.6", c.DEFAULTS = a.extend({}, a.fn.tooltip.Constructor.DEFAULTS, {
		placement: "right",
		trigger: "click",
		content: "",
		template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
	}), c.prototype = a.extend({}, a.fn.tooltip.Constructor.prototype), c.prototype.constructor = c, c.prototype.getDefaults = function () {
		return c.DEFAULTS
	}, c.prototype.setContent = function () {
		var a = this.tip(),
			b = this.getTitle(),
			c = this.getContent();
		a.find(".popover-title")[this.options.html ? "html" : "text"](b), a.find(".popover-content").children().detach().end()[this.options.html ? "string" == typeof c ? "html" : "append" : "text"](c), a.removeClass("fade top bottom left right in"), a.find(".popover-title").html() || a.find(".popover-title").hide()
	}, c.prototype.hasContent = function () {
		return this.getTitle() || this.getContent()
	}, c.prototype.getContent = function () {
		var a = this.$element,
			b = this.options;
		return a.attr("data-content") || ("function" == typeof b.content ? b.content.call(a[0]) : b.content)
	}, c.prototype.arrow = function () {
		return this.$arrow = this.$arrow || this.tip().find(".arrow")
	};
	var d = a.fn.popover;
	a.fn.popover = b, a.fn.popover.Constructor = c, a.fn.popover.noConflict = function () {
		return a.fn.popover = d, this
	}
}(jQuery), + function (a) {
	"use strict";

	function b(c, d) {
		this.$body = a(document.body), this.$scrollElement = a(a(c).is(document.body) ? window : c), this.options = a.extend({}, b.DEFAULTS, d), this.selector = (this.options.target || "") + " .nav li > a", this.offsets = [], this.targets = [], this.activeTarget = null, this.scrollHeight = 0, this.$scrollElement.on("scroll.bs.scrollspy", a.proxy(this.process, this)), this.refresh(), this.process()
	}

	function c(c) {
		return this.each(function () {
			var d = a(this),
				e = d.data("bs.scrollspy"),
				f = "object" == typeof c && c;
			e || d.data("bs.scrollspy", e = new b(this, f)), "string" == typeof c && e[c]()
		})
	}
	b.VERSION = "3.3.6", b.DEFAULTS = {
		offset: 10
	}, b.prototype.getScrollHeight = function () {
		return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight)
	}, b.prototype.refresh = function () {
		var b = this,
			c = "offset",
			d = 0;
		this.offsets = [], this.targets = [], this.scrollHeight = this.getScrollHeight(), a.isWindow(this.$scrollElement[0]) || (c = "position", d = this.$scrollElement.scrollTop()), this.$body.find(this.selector).map(function () {
			var b = a(this),
				e = b.data("target") || b.attr("href"),
				f = /^#./.test(e) && a(e);
			return f && f.length && f.is(":visible") && [
				[f[c]().top + d, e]
			] || null
		}).sort(function (a, b) {
			return a[0] - b[0]
		}).each(function () {
			b.offsets.push(this[0]), b.targets.push(this[1])
		})
	}, b.prototype.process = function () {
		var a, b = this.$scrollElement.scrollTop() + this.options.offset,
			c = this.getScrollHeight(),
			d = this.options.offset + c - this.$scrollElement.height(),
			e = this.offsets,
			f = this.targets,
			g = this.activeTarget;
		if (this.scrollHeight != c && this.refresh(), b >= d) return g != (a = f[f.length - 1]) && this.activate(a);
		if (g && b < e[0]) return this.activeTarget = null, this.clear();
		for (a = e.length; a--;) g != f[a] && b >= e[a] && (void 0 === e[a + 1] || b < e[a + 1]) && this.activate(f[a])
	}, b.prototype.activate = function (b) {
		this.activeTarget = b, this.clear();
		var c = this.selector + '[data-target="' + b + '"],' + this.selector + '[href="' + b + '"]',
			d = a(c).parents("li").addClass("active");
		d.parent(".dropdown-menu").length && (d = d.closest("li.dropdown").addClass("active")), d.trigger("activate.bs.scrollspy")
	}, b.prototype.clear = function () {
		a(this.selector).parentsUntil(this.options.target, ".active").removeClass("active")
	};
	var d = a.fn.scrollspy;
	a.fn.scrollspy = c, a.fn.scrollspy.Constructor = b, a.fn.scrollspy.noConflict = function () {
		return a.fn.scrollspy = d, this
	}, a(window).on("load.bs.scrollspy.data-api", function () {
		a('[data-spy="scroll"]').each(function () {
			var b = a(this);
			c.call(b, b.data())
		})
	})
}(jQuery), + function (a) {
	"use strict";

	function b(b) {
		return this.each(function () {
			var d = a(this),
				e = d.data("bs.tab");
			e || d.data("bs.tab", e = new c(this)), "string" == typeof b && e[b]()
		})
	}
	var c = function (b) {
		this.element = a(b)
	};
	c.VERSION = "3.3.6", c.TRANSITION_DURATION = 150, c.prototype.show = function () {
		var b = this.element,
			c = b.closest("ul:not(.dropdown-menu)"),
			d = b.data("target");
		if (d || (d = b.attr("href"), d = d && d.replace(/.*(?=#[^\s]*$)/, "")), !b.parent("li").hasClass("active")) {
			var e = c.find(".active:last a"),
				f = a.Event("hide.bs.tab", {
					relatedTarget: b[0]
				}),
				g = a.Event("show.bs.tab", {
					relatedTarget: e[0]
				});
			if (e.trigger(f), b.trigger(g), !g.isDefaultPrevented() && !f.isDefaultPrevented()) {
				var h = a(d);
				this.activate(b.closest("li"), c), this.activate(h, h.parent(), function () {
					e.trigger({
						type: "hidden.bs.tab",
						relatedTarget: b[0]
					}), b.trigger({
						type: "shown.bs.tab",
						relatedTarget: e[0]
					})
				})
			}
		}
	}, c.prototype.activate = function (b, d, e) {
		function f() {
			g.removeClass("active").find("> .dropdown-menu > .active").removeClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded", !1), b.addClass("active").find('[data-toggle="tab"]').attr("aria-expanded", !0), h ? (b[0].offsetWidth, b.addClass("in")) : b.removeClass("fade"), b.parent(".dropdown-menu").length && b.closest("li.dropdown").addClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded", !0), e && e()
		}
		var g = d.find("> .active"),
			h = e && a.support.transition && (g.length && g.hasClass("fade") || !!d.find("> .fade").length);
		g.length && h ? g.one("bsTransitionEnd", f).emulateTransitionEnd(c.TRANSITION_DURATION) : f(), g.removeClass("in")
	};
	var d = a.fn.tab;
	a.fn.tab = b, a.fn.tab.Constructor = c, a.fn.tab.noConflict = function () {
		return a.fn.tab = d, this
	};
	var e = function (c) {
		c.preventDefault(), b.call(a(this), "show")
	};
	a(document).on("click.bs.tab.data-api", '[data-toggle="tab"]', e).on("click.bs.tab.data-api", '[data-toggle="pill"]', e)
}(jQuery), + function (a) {
	"use strict";

	function b(b) {
		return this.each(function () {
			var d = a(this),
				e = d.data("bs.affix"),
				f = "object" == typeof b && b;
			e || d.data("bs.affix", e = new c(this, f)), "string" == typeof b && e[b]()
		})
	}
	var c = function (b, d) {
		this.options = a.extend({}, c.DEFAULTS, d), this.$target = a(this.options.target).on("scroll.bs.affix.data-api", a.proxy(this.checkPosition, this)).on("click.bs.affix.data-api", a.proxy(this.checkPositionWithEventLoop, this)), this.$element = a(b), this.affixed = null, this.unpin = null, this.pinnedOffset = null, this.checkPosition()
	};
	c.VERSION = "3.3.6", c.RESET = "affix affix-top affix-bottom", c.DEFAULTS = {
		offset: 0,
		target: window
	}, c.prototype.getState = function (a, b, c, d) {
		var e = this.$target.scrollTop(),
			f = this.$element.offset(),
			g = this.$target.height();
		if (null != c && "top" == this.affixed) return c > e ? "top" : !1;
		if ("bottom" == this.affixed) return null != c ? e + this.unpin <= f.top ? !1 : "bottom" : a - d >= e + g ? !1 : "bottom";
		var h = null == this.affixed,
			i = h ? e : f.top,
			j = h ? g : b;
		return null != c && c >= e ? "top" : null != d && i + j >= a - d ? "bottom" : !1
	}, c.prototype.getPinnedOffset = function () {
		if (this.pinnedOffset) return this.pinnedOffset;
		this.$element.removeClass(c.RESET).addClass("affix");
		var a = this.$target.scrollTop(),
			b = this.$element.offset();
		return this.pinnedOffset = b.top - a
	}, c.prototype.checkPositionWithEventLoop = function () {
		setTimeout(a.proxy(this.checkPosition, this), 1)
	}, c.prototype.checkPosition = function () {
		if (this.$element.is(":visible")) {
			var b = this.$element.height(),
				d = this.options.offset,
				e = d.top,
				f = d.bottom,
				g = Math.max(a(document).height(), a(document.body).height());
			"object" != typeof d && (f = e = d), "function" == typeof e && (e = d.top(this.$element)), "function" == typeof f && (f = d.bottom(this.$element));
			var h = this.getState(g, b, e, f);
			if (this.affixed != h) {
				null != this.unpin && this.$element.css("top", "");
				var i = "affix" + (h ? "-" + h : ""),
					j = a.Event(i + ".bs.affix");
				if (this.$element.trigger(j), j.isDefaultPrevented()) return;
				this.affixed = h, this.unpin = "bottom" == h ? this.getPinnedOffset() : null, this.$element.removeClass(c.RESET).addClass(i).trigger(i.replace("affix", "affixed") + ".bs.affix")
			}
			"bottom" == h && this.$element.offset({
				top: g - b - f
			})
		}
	};
	var d = a.fn.affix;
	a.fn.affix = b, a.fn.affix.Constructor = c, a.fn.affix.noConflict = function () {
		return a.fn.affix = d, this
	}, a(window).on("load", function () {
		a('[data-spy="affix"]').each(function () {
			var c = a(this),
				d = c.data();
			d.offset = d.offset || {}, null != d.offsetBottom && (d.offset.bottom = d.offsetBottom), null != d.offsetTop && (d.offset.top = d.offsetTop), b.call(c, d)
		})
	})
}(jQuery),
function (a) {
	"function" == typeof define && define.amd ? define(["jquery"], a) : a("object" == typeof exports ? require("jquery") : jQuery)
}(function (a, b) {
	function c() {
		return new Date(Date.UTC.apply(Date, arguments))
	}

	function d() {
		var a = new Date;
		return c(a.getFullYear(), a.getMonth(), a.getDate())
	}

	function e(a, b) {
		return a.getUTCFullYear() === b.getUTCFullYear() && a.getUTCMonth() === b.getUTCMonth() && a.getUTCDate() === b.getUTCDate()
	}

	function f(c, d) {
		return function () {
			return d !== b && a.fn.datepicker.deprecated(d), this[c].apply(this, arguments)
		}
	}

	function g(a) {
		return a && !isNaN(a.getTime())
	}

	function h(b, c) {
		function d(a, b) {
			return b.toLowerCase()
		}
		var e, f = a(b).data(),
			g = {},
			h = new RegExp("^" + c.toLowerCase() + "([A-Z])");
		c = new RegExp("^" + c.toLowerCase());
		for (var i in f) c.test(i) && (e = i.replace(h, d), g[e] = f[i]);
		return g
	}

	function i(b) {
		var c = {};
		if (q[b] || (b = b.split("-")[0], q[b])) {
			var d = q[b];
			return a.each(p, function (a, b) {
				b in d && (c[b] = d[b])
			}), c
		}
	}
	var j = function () {
			var b = {
				get: function (a) {
					return this.slice(a)[0]
				},
				contains: function (a) {
					for (var b = a && a.valueOf(), c = 0, d = this.length; d > c; c++)
						if (0 <= this[c].valueOf() - b && this[c].valueOf() - b < 864e5) return c;
					return -1
				},
				remove: function (a) {
					this.splice(a, 1)
				},
				replace: function (b) {
					b && (a.isArray(b) || (b = [b]), this.clear(), this.push.apply(this, b))
				},
				clear: function () {
					this.length = 0
				},
				copy: function () {
					var a = new j;
					return a.replace(this), a
				}
			};
			return function () {
				var c = [];
				return c.push.apply(c, arguments), a.extend(c, b), c
			}
		}(),
		k = function (b, c) {
			a.data(b, "datepicker", this), this._process_options(c), this.dates = new j, this.viewDate = this.o.defaultViewDate, this.focusDate = null, this.element = a(b), this.isInput = this.element.is("input"), this.inputField = this.isInput ? this.element : this.element.find("input"), this.component = this.element.hasClass("date") ? this.element.find(".add-on, .input-group-addon, .btn") : !1, this.component && 0 === this.component.length && (this.component = !1), this.isInline = !this.component && this.element.is("div"), this.picker = a(r.template), this._check_template(this.o.templates.leftArrow) && this.picker.find(".prev").html(this.o.templates.leftArrow), this._check_template(this.o.templates.rightArrow) && this.picker.find(".next").html(this.o.templates.rightArrow), this._buildEvents(), this._attachEvents(), this.isInline ? this.picker.addClass("datepicker-inline").appendTo(this.element) : this.picker.addClass("datepicker-dropdown dropdown-menu"), this.o.rtl && this.picker.addClass("datepicker-rtl"), this.o.calendarWeeks && this.picker.find(".datepicker-days .datepicker-switch, thead .datepicker-title, tfoot .today, tfoot .clear").attr("colspan", function (a, b) {
				return Number(b) + 1
			}), this._process_options({
				startDate: this._o.startDate,
				endDate: this._o.endDate,
				daysOfWeekDisabled: this.o.daysOfWeekDisabled,
				daysOfWeekHighlighted: this.o.daysOfWeekHighlighted,
				datesDisabled: this.o.datesDisabled
			}), this._allow_update = !1, this.setViewMode(this.o.startView), this._allow_update = !0, this.fillDow(), this.fillMonths(), this.update(), this.isInline && this.show()
		};
	k.prototype = {
		constructor: k,
		_resolveViewName: function (b) {
			return a.each(r.viewModes, function (c, d) {
				return b === c || -1 !== a.inArray(b, d.names) ? (b = c, !1) : void 0
			}), b
		},
		_resolveDaysOfWeek: function (b) {
			return a.isArray(b) || (b = b.split(/[,\s]*/)), a.map(b, Number)
		},
		_check_template: function (c) {
			try {
				if (c === b || "" === c) return !1;
				if ((c.match(/[<>]/g) || []).length <= 0) return !0;
				var d = a(c);
				return d.length > 0
			} catch (e) {
				return !1
			}
		},
		_process_options: function (b) {
			this._o = a.extend({}, this._o, b);
			var e = this.o = a.extend({}, this._o),
				f = e.language;
			q[f] || (f = f.split("-")[0], q[f] || (f = o.language)), e.language = f, e.startView = this._resolveViewName(e.startView), e.minViewMode = this._resolveViewName(e.minViewMode), e.maxViewMode = this._resolveViewName(e.maxViewMode), e.startView = Math.max(this.o.minViewMode, Math.min(this.o.maxViewMode, e.startView)), e.multidate !== !0 && (e.multidate = Number(e.multidate) || !1, e.multidate !== !1 && (e.multidate = Math.max(0, e.multidate))), e.multidateSeparator = String(e.multidateSeparator), e.weekStart %= 7, e.weekEnd = (e.weekStart + 6) % 7;
			var g = r.parseFormat(e.format);
			e.startDate !== -1 / 0 && (e.startDate = e.startDate ? e.startDate instanceof Date ? this._local_to_utc(this._zero_time(e.startDate)) : r.parseDate(e.startDate, g, e.language, e.assumeNearbyYear) : -1 / 0), 1 / 0 !== e.endDate && (e.endDate = e.endDate ? e.endDate instanceof Date ? this._local_to_utc(this._zero_time(e.endDate)) : r.parseDate(e.endDate, g, e.language, e.assumeNearbyYear) : 1 / 0), e.daysOfWeekDisabled = this._resolveDaysOfWeek(e.daysOfWeekDisabled || []), e.daysOfWeekHighlighted = this._resolveDaysOfWeek(e.daysOfWeekHighlighted || []), e.datesDisabled = e.datesDisabled || [], a.isArray(e.datesDisabled) || (e.datesDisabled = e.datesDisabled.split(",")), e.datesDisabled = a.map(e.datesDisabled, function (a) {
				return r.parseDate(a, g, e.language, e.assumeNearbyYear)
			});
			var h = String(e.orientation).toLowerCase().split(/\s+/g),
				i = e.orientation.toLowerCase();
			if (h = a.grep(h, function (a) {
					return /^auto|left|right|top|bottom$/.test(a)
				}), e.orientation = {
					x: "auto",
					y: "auto"
				}, i && "auto" !== i)
				if (1 === h.length) switch (h[0]) {
					case "top":
					case "bottom":
						e.orientation.y = h[0];
						break;
					case "left":
					case "right":
						e.orientation.x = h[0]
				} else i = a.grep(h, function (a) {
					return /^left|right$/.test(a)
				}), e.orientation.x = i[0] || "auto", i = a.grep(h, function (a) {
					return /^top|bottom$/.test(a)
				}), e.orientation.y = i[0] || "auto";
				else;
			if (e.defaultViewDate instanceof Date || "string" == typeof e.defaultViewDate) e.defaultViewDate = r.parseDate(e.defaultViewDate, g, e.language, e.assumeNearbyYear);
			else if (e.defaultViewDate) {
				var j = e.defaultViewDate.year || (new Date).getFullYear(),
					k = e.defaultViewDate.month || 0,
					l = e.defaultViewDate.day || 1;
				e.defaultViewDate = c(j, k, l)
			} else e.defaultViewDate = d()
		},
		_events: [],
		_secondaryEvents: [],
		_applyEvents: function (a) {
			for (var c, d, e, f = 0; f < a.length; f++) c = a[f][0], 2 === a[f].length ? (d = b, e = a[f][1]) : 3 === a[f].length && (d = a[f][1], e = a[f][2]), c.on(e, d)
		},
		_unapplyEvents: function (a) {
			for (var c, d, e, f = 0; f < a.length; f++) c = a[f][0], 2 === a[f].length ? (e = b, d = a[f][1]) : 3 === a[f].length && (e = a[f][1], d = a[f][2]), c.off(d, e)
		},
		_buildEvents: function () {
			var b = {
				keyup: a.proxy(function (b) {
					-1 === a.inArray(b.keyCode, [27, 37, 39, 38, 40, 32, 13, 9]) && this.update()
				}, this),
				keydown: a.proxy(this.keydown, this),
				paste: a.proxy(this.paste, this)
			};
			this.o.showOnFocus === !0 && (b.focus = a.proxy(this.show, this)), this._events = this.isInput ? [
				[this.element, b]
			] : this.component && this.inputField.length ? [
				[this.inputField, b],
				[this.component, {
					click: a.proxy(this.show, this)
				}]
			] : [
				[this.element, {
					click: a.proxy(this.show, this),
					keydown: a.proxy(this.keydown, this)
				}]
			], this._events.push([this.element, "*", {
				blur: a.proxy(function (a) {
					this._focused_from = a.target
				}, this)
			}], [this.element, {
				blur: a.proxy(function (a) {
					this._focused_from = a.target
				}, this)
			}]), this.o.immediateUpdates && this._events.push([this.element, {
				"changeYear changeMonth": a.proxy(function (a) {
					this.update(a.date)
				}, this)
			}]), this._secondaryEvents = [
				[this.picker, {
					click: a.proxy(this.click, this)
				}],
				[this.picker, ".prev, .next", {
					click: a.proxy(this.navArrowsClick, this)
				}],
				[this.picker, ".day:not(.disabled)", {
					click: a.proxy(this.dayCellClick, this)
				}],
				[a(window), {
					resize: a.proxy(this.place, this)
				}],
				[a(document), {
					"mousedown touchstart": a.proxy(function (a) {
						this.element.is(a.target) || this.element.find(a.target).length || this.picker.is(a.target) || this.picker.find(a.target).length || this.isInline || this.hide()
					}, this)
				}]
			]
		},
		_attachEvents: function () {
			this._detachEvents(), this._applyEvents(this._events)
		},
		_detachEvents: function () {
			this._unapplyEvents(this._events)
		},
		_attachSecondaryEvents: function () {
			this._detachSecondaryEvents(), this._applyEvents(this._secondaryEvents)
		},
		_detachSecondaryEvents: function () {
			this._unapplyEvents(this._secondaryEvents)
		},
		_trigger: function (b, c) {
			var d = c || this.dates.get(-1),
				e = this._utc_to_local(d);
			this.element.trigger({
				type: b,
				date: e,
				viewMode: this.viewMode,
				dates: a.map(this.dates, this._utc_to_local),
				format: a.proxy(function (a, b) {
					0 === arguments.length ? (a = this.dates.length - 1, b = this.o.format) : "string" == typeof a && (b = a, a = this.dates.length - 1), b = b || this.o.format;
					var c = this.dates.get(a);
					return r.formatDate(c, b, this.o.language)
				}, this)
			})
		},
		show: function () {
			return this.inputField.prop("disabled") || this.inputField.prop("readonly") && this.o.enableOnReadonly === !1 ? void 0 : (this.isInline || this.picker.appendTo(this.o.container), this.place(), this.picker.show(), this._attachSecondaryEvents(), this._trigger("show"), (window.navigator.msMaxTouchPoints || "ontouchstart" in document) && this.o.disableTouchKeyboard && a(this.element).blur(), this)
		},
		hide: function () {
			return this.isInline || !this.picker.is(":visible") ? this : (this.focusDate = null, this.picker.hide().detach(), this._detachSecondaryEvents(), this.setViewMode(this.o.startView), this.o.forceParse && this.inputField.val() && this.setValue(), this._trigger("hide"), this)
		},
		destroy: function () {
			return this.hide(), this._detachEvents(), this._detachSecondaryEvents(), this.picker.remove(), delete this.element.data().datepicker, this.isInput || delete this.element.data().date, this
		},
		paste: function (b) {
			var c;
			if (b.originalEvent.clipboardData && b.originalEvent.clipboardData.types && -1 !== a.inArray("text/plain", b.originalEvent.clipboardData.types)) c = b.originalEvent.clipboardData.getData("text/plain");
			else {
				if (!window.clipboardData) return;
				c = window.clipboardData.getData("Text")
			}
			this.setDate(c), this.update(), b.preventDefault()
		},
		_utc_to_local: function (a) {
			if (!a) return a;
			var b = new Date(a.getTime() + 6e4 * a.getTimezoneOffset());
			return b.getTimezoneOffset() !== a.getTimezoneOffset() && (b = new Date(a.getTime() + 6e4 * b.getTimezoneOffset())), b
		},
		_local_to_utc: function (a) {
			return a && new Date(a.getTime() - 6e4 * a.getTimezoneOffset())
		},
		_zero_time: function (a) {
			return a && new Date(a.getFullYear(), a.getMonth(), a.getDate())
		},
		_zero_utc_time: function (a) {
			return a && c(a.getUTCFullYear(), a.getUTCMonth(), a.getUTCDate())
		},
		getDates: function () {
			return a.map(this.dates, this._utc_to_local)
		},
		getUTCDates: function () {
			return a.map(this.dates, function (a) {
				return new Date(a)
			})
		},
		getDate: function () {
			return this._utc_to_local(this.getUTCDate())
		},
		getUTCDate: function () {
			var a = this.dates.get(-1);
			return a !== b ? new Date(a) : null
		},
		clearDates: function () {
			this.inputField.val(""), this.update(), this._trigger("changeDate"), this.o.autoclose && this.hide()
		},
		setDates: function () {
			var b = a.isArray(arguments[0]) ? arguments[0] : arguments;
			return this.update.apply(this, b), this._trigger("changeDate"), this.setValue(), this
		},
		setUTCDates: function () {
			var b = a.isArray(arguments[0]) ? arguments[0] : arguments;
			return this.setDates.apply(this, a.map(b, this._utc_to_local)), this
		},
		setDate: f("setDates"),
		setUTCDate: f("setUTCDates"),
		remove: f("destroy", "Method `remove` is deprecated and will be removed in version 2.0. Use `destroy` instead"),
		setValue: function () {
			var a = this.getFormattedDate();
			return this.inputField.val(a), this
		},
		getFormattedDate: function (c) {
			c === b && (c = this.o.format);
			var d = this.o.language;
			return a.map(this.dates, function (a) {
				return r.formatDate(a, c, d)
			}).join(this.o.multidateSeparator)
		},
		getStartDate: function () {
			return this.o.startDate
		},
		setStartDate: function (a) {
			return this._process_options({
				startDate: a
			}), this.update(), this.updateNavArrows(), this
		},
		getEndDate: function () {
			return this.o.endDate
		},
		setEndDate: function (a) {
			return this._process_options({
				endDate: a
			}), this.update(), this.updateNavArrows(), this
		},
		setDaysOfWeekDisabled: function (a) {
			return this._process_options({
				daysOfWeekDisabled: a
			}), this.update(), this
		},
		setDaysOfWeekHighlighted: function (a) {
			return this._process_options({
				daysOfWeekHighlighted: a
			}), this.update(), this
		},
		setDatesDisabled: function (a) {
			return this._process_options({
				datesDisabled: a
			}), this.update(), this
		},
		place: function () {
			if (this.isInline) return this;
			var b = this.picker.outerWidth(),
				c = this.picker.outerHeight(),
				d = 10,
				e = a(this.o.container),
				f = e.width(),
				g = "body" === this.o.container ? a(document).scrollTop() : e.scrollTop(),
				h = e.offset(),
				i = [0];
			this.element.parents().each(function () {
				var b = a(this).css("z-index");
				"auto" !== b && 0 !== Number(b) && i.push(Number(b))
			});
			var j = Math.max.apply(Math, i) + this.o.zIndexOffset,
				k = this.component ? this.component.parent().offset() : this.element.offset(),
				l = this.component ? this.component.outerHeight(!0) : this.element.outerHeight(!1),
				m = this.component ? this.component.outerWidth(!0) : this.element.outerWidth(!1),
				n = k.left - h.left,
				o = k.top - h.top;
			"body" !== this.o.container && (o += g), this.picker.removeClass("datepicker-orient-top datepicker-orient-bottom datepicker-orient-right datepicker-orient-left"), "auto" !== this.o.orientation.x ? (this.picker.addClass("datepicker-orient-" + this.o.orientation.x), "right" === this.o.orientation.x && (n -= b - m)) : k.left < 0 ? (this.picker.addClass("datepicker-orient-left"), n -= k.left - d) : n + b > f ? (this.picker.addClass("datepicker-orient-right"), n += m - b) : this.picker.addClass(this.o.rtl ? "datepicker-orient-right" : "datepicker-orient-left");
			var p, q = this.o.orientation.y;
			if ("auto" === q && (p = -g + o - c, q = 0 > p ? "bottom" : "top"), this.picker.addClass("datepicker-orient-" + q), "top" === q ? o -= c + parseInt(this.picker.css("padding-top")) : o += l, this.o.rtl) {
				var r = f - (n + m);
				this.picker.css({
					top: o,
					right: r,
					zIndex: j
				})
			} else this.picker.css({
				top: o,
				left: n,
				zIndex: j
			});
			return this
		},
		_allow_update: !0,
		update: function () {
			if (!this._allow_update) return this;
			var b = this.dates.copy(),
				c = [],
				d = !1;
			return arguments.length ? (a.each(arguments, a.proxy(function (a, b) {
				b instanceof Date && (b = this._local_to_utc(b)), c.push(b)
			}, this)), d = !0) : (c = this.isInput ? this.element.val() : this.element.data("date") || this.inputField.val(), c = c && this.o.multidate ? c.split(this.o.multidateSeparator) : [c], delete this.element.data().date), c = a.map(c, a.proxy(function (a) {
				return r.parseDate(a, this.o.format, this.o.language, this.o.assumeNearbyYear)
			}, this)), c = a.grep(c, a.proxy(function (a) {
				return !this.dateWithinRange(a) || !a
			}, this), !0), this.dates.replace(c), this.o.updateViewDate && (this.viewDate = this.dates.length ? new Date(this.dates.get(-1)) : this.viewDate < this.o.startDate ? new Date(this.o.startDate) : this.viewDate > this.o.endDate ? new Date(this.o.endDate) : this.o.defaultViewDate), d ? (this.setValue(), this.element.change()) : this.dates.length && String(b) !== String(this.dates) && d && (this._trigger("changeDate"), this.element.change()), !this.dates.length && b.length && (this._trigger("clearDate"), this.element.change()), this.fill(), this
		},
		fillDow: function () {
			if (this.o.showWeekDays) {
				var b = this.o.weekStart,
					c = "<tr>";
				for (this.o.calendarWeeks && (c += '<th class="cw">&#160;</th>'); b < this.o.weekStart + 7;) c += '<th class="dow', -1 !== a.inArray(b, this.o.daysOfWeekDisabled) && (c += " disabled"), c += '">' + q[this.o.language].daysMin[b++ % 7] + "</th>";
				c += "</tr>", this.picker.find(".datepicker-days thead").append(c)
			}
		},
		fillMonths: function () {
			for (var a, b = this._utc_to_local(this.viewDate), c = "", d = 0; 12 > d; d++) a = b && b.getMonth() === d ? " focused" : "", c += '<span class="month' + a + '">' + q[this.o.language].monthsShort[d] + "</span>";
			this.picker.find(".datepicker-months td").html(c)
		},
		setRange: function (b) {
			b && b.length ? this.range = a.map(b, function (a) {
				return a.valueOf()
			}) : delete this.range, this.fill()
		},
		getClassNames: function (b) {
			var c = [],
				f = this.viewDate.getUTCFullYear(),
				g = this.viewDate.getUTCMonth(),
				h = d();
			return b.getUTCFullYear() < f || b.getUTCFullYear() === f && b.getUTCMonth() < g ? c.push("old") : (b.getUTCFullYear() > f || b.getUTCFullYear() === f && b.getUTCMonth() > g) && c.push("new"), this.focusDate && b.valueOf() === this.focusDate.valueOf() && c.push("focused"), this.o.todayHighlight && e(b, h) && c.push("today"), -1 !== this.dates.contains(b) && c.push("active"), this.dateWithinRange(b) || c.push("disabled"), this.dateIsDisabled(b) && c.push("disabled", "disabled-date"), -1 !== a.inArray(b.getUTCDay(), this.o.daysOfWeekHighlighted) && c.push("highlighted"), this.range && (b > this.range[0] && b < this.range[this.range.length - 1] && c.push("range"), -1 !== a.inArray(b.valueOf(), this.range) && c.push("selected"), b.valueOf() === this.range[0] && c.push("range-start"), b.valueOf() === this.range[this.range.length - 1] && c.push("range-end")), c
		},
		_fill_yearsView: function (c, d, e, f, g, h, i) {
			for (var j, k, l, m = "", n = e / 10, o = this.picker.find(c), p = Math.floor(f / e) * e, q = p + 9 * n, r = Math.floor(this.viewDate.getFullYear() / n) * n, s = a.map(this.dates, function (a) {
					return Math.floor(a.getUTCFullYear() / n) * n
				}), t = p - n; q + n >= t; t += n) j = [d], k = null, t === p - n ? j.push("old") : t === q + n && j.push("new"), -1 !== a.inArray(t, s) && j.push("active"), (g > t || t > h) && j.push("disabled"), t === r && j.push("focused"), i !== a.noop && (l = i(new Date(t, 0, 1)), l === b ? l = {} : "boolean" == typeof l ? l = {
				enabled: l
			} : "string" == typeof l && (l = {
				classes: l
			}), l.enabled === !1 && j.push("disabled"), l.classes && (j = j.concat(l.classes.split(/\s+/))), l.tooltip && (k = l.tooltip)), m += '<span class="' + j.join(" ") + '"' + (k ? ' title="' + k + '"' : "") + ">" + t + "</span>";
			o.find(".datepicker-switch").text(p + "-" + q), o.find("td").html(m)
		},
		fill: function () {
			var d, e, f = new Date(this.viewDate),
				g = f.getUTCFullYear(),
				h = f.getUTCMonth(),
				i = this.o.startDate !== -1 / 0 ? this.o.startDate.getUTCFullYear() : -1 / 0,
				j = this.o.startDate !== -1 / 0 ? this.o.startDate.getUTCMonth() : -1 / 0,
				k = 1 / 0 !== this.o.endDate ? this.o.endDate.getUTCFullYear() : 1 / 0,
				l = 1 / 0 !== this.o.endDate ? this.o.endDate.getUTCMonth() : 1 / 0,
				m = q[this.o.language].today || q.en.today || "",
				n = q[this.o.language].clear || q.en.clear || "",
				o = q[this.o.language].titleFormat || q.en.titleFormat;
			if (!isNaN(g) && !isNaN(h)) {
				this.picker.find(".datepicker-days .datepicker-switch").text(r.formatDate(f, o, this.o.language)), this.picker.find("tfoot .today").text(m).css("display", this.o.todayBtn === !0 || "linked" === this.o.todayBtn ? "table-cell" : "none"), this.picker.find("tfoot .clear").text(n).css("display", this.o.clearBtn === !0 ? "table-cell" : "none"), this.picker.find("thead .datepicker-title").text(this.o.title).css("display", "string" == typeof this.o.title && "" !== this.o.title ? "table-cell" : "none"), this.updateNavArrows(), this.fillMonths();
				var p = c(g, h, 0),
					s = p.getUTCDate();
				p.setUTCDate(s - (p.getUTCDay() - this.o.weekStart + 7) % 7);
				var t = new Date(p);
				p.getUTCFullYear() < 100 && t.setUTCFullYear(p.getUTCFullYear()), t.setUTCDate(t.getUTCDate() + 42), t = t.valueOf();
				for (var u, v, w = []; p.valueOf() < t;) {
					if (u = p.getUTCDay(), u === this.o.weekStart && (w.push("<tr>"), this.o.calendarWeeks)) {
						var x = new Date(+p + (this.o.weekStart - u - 7) % 7 * 864e5),
							y = new Date(Number(x) + (11 - x.getUTCDay()) % 7 * 864e5),
							z = new Date(Number(z = c(y.getUTCFullYear(), 0, 1)) + (11 - z.getUTCDay()) % 7 * 864e5),
							A = (y - z) / 864e5 / 7 + 1;
						w.push('<td class="cw">' + A + "</td>")
					}
					v = this.getClassNames(p), v.push("day");
					var B = p.getUTCDate();
					this.o.beforeShowDay !== a.noop && (e = this.o.beforeShowDay(this._utc_to_local(p)), e === b ? e = {} : "boolean" == typeof e ? e = {
						enabled: e
					} : "string" == typeof e && (e = {
						classes: e
					}), e.enabled === !1 && v.push("disabled"), e.classes && (v = v.concat(e.classes.split(/\s+/))), e.tooltip && (d = e.tooltip), e.content && (B = e.content)), v = a.isFunction(a.uniqueSort) ? a.uniqueSort(v) : a.unique(v), w.push('<td class="' + v.join(" ") + '"' + (d ? ' title="' + d + '"' : "") + ' data-date="' + p.getTime().toString() + '">' + B + "</td>"), d = null, u === this.o.weekEnd && w.push("</tr>"), p.setUTCDate(p.getUTCDate() + 1)
				}
				this.picker.find(".datepicker-days tbody").html(w.join(""));
				var C = q[this.o.language].monthsTitle || q.en.monthsTitle || "Months",
					D = this.picker.find(".datepicker-months").find(".datepicker-switch").text(this.o.maxViewMode < 2 ? C : g).end().find("tbody span").removeClass("active");
				if (a.each(this.dates, function (a, b) {
						b.getUTCFullYear() === g && D.eq(b.getUTCMonth()).addClass("active")
					}), (i > g || g > k) && D.addClass("disabled"), g === i && D.slice(0, j).addClass("disabled"), g === k && D.slice(l + 1).addClass("disabled"), this.o.beforeShowMonth !== a.noop) {
					var E = this;
					a.each(D, function (c, d) {
						var e = new Date(g, c, 1),
							f = E.o.beforeShowMonth(e);
						f === b ? f = {} : "boolean" == typeof f ? f = {
							enabled: f
						} : "string" == typeof f && (f = {
							classes: f
						}), f.enabled !== !1 || a(d).hasClass("disabled") || a(d).addClass("disabled"), f.classes && a(d).addClass(f.classes), f.tooltip && a(d).prop("title", f.tooltip)
					})
				}
				this._fill_yearsView(".datepicker-years", "year", 10, g, i, k, this.o.beforeShowYear), this._fill_yearsView(".datepicker-decades", "decade", 100, g, i, k, this.o.beforeShowDecade), this._fill_yearsView(".datepicker-centuries", "century", 1e3, g, i, k, this.o.beforeShowCentury)
			}
		},
		updateNavArrows: function () {
			if (this._allow_update) {
				var a, b, c = new Date(this.viewDate),
					d = c.getUTCFullYear(),
					e = c.getUTCMonth(),
					f = this.o.startDate !== -1 / 0 ? this.o.startDate.getUTCFullYear() : -1 / 0,
					g = this.o.startDate !== -1 / 0 ? this.o.startDate.getUTCMonth() : -1 / 0,
					h = 1 / 0 !== this.o.endDate ? this.o.endDate.getUTCFullYear() : 1 / 0,
					i = 1 / 0 !== this.o.endDate ? this.o.endDate.getUTCMonth() : 1 / 0,
					j = 1;
				switch (this.viewMode) {
					case 0:
						a = f >= d && g >= e, b = d >= h && e >= i;
						break;
					case 4:
						j *= 10;
					case 3:
						j *= 10;
					case 2:
						j *= 10;
					case 1:
						a = Math.floor(d / j) * j <= f, b = Math.floor(d / j) * j + j >= h
				}
				this.picker.find(".prev").toggleClass("disabled", a), this.picker.find(".next").toggleClass("disabled", b)
			}
		},
		click: function (b) {
			b.preventDefault(), b.stopPropagation();
			var e, f, g, h;
			e = a(b.target), e.hasClass("datepicker-switch") && this.viewMode !== this.o.maxViewMode && this.setViewMode(this.viewMode + 1), e.hasClass("today") && !e.hasClass("day") && (this.setViewMode(0), this._setDate(d(), "linked" === this.o.todayBtn ? null : "view")), e.hasClass("clear") && this.clearDates(), e.hasClass("disabled") || (e.hasClass("month") || e.hasClass("year") || e.hasClass("decade") || e.hasClass("century")) && (this.viewDate.setUTCDate(1), f = 1, 1 === this.viewMode ? (h = e.parent().find("span").index(e), g = this.viewDate.getUTCFullYear(), this.viewDate.setUTCMonth(h)) : (h = 0, g = Number(e.text()), this.viewDate.setUTCFullYear(g)), this._trigger(r.viewModes[this.viewMode - 1].e, this.viewDate), this.viewMode === this.o.minViewMode ? this._setDate(c(g, h, f)) : (this.setViewMode(this.viewMode - 1), this.fill())), this.picker.is(":visible") && this._focused_from && this._focused_from.focus(), delete this._focused_from
		},
		dayCellClick: function (b) {
			var c = a(b.currentTarget),
				d = c.data("date"),
				e = new Date(d);
			this.o.updateViewDate && (e.getUTCFullYear() !== this.viewDate.getUTCFullYear() && this._trigger("changeYear", this.viewDate), e.getUTCMonth() !== this.viewDate.getUTCMonth() && this._trigger("changeMonth", this.viewDate)), this._setDate(e)
		},
		navArrowsClick: function (b) {
			var c = a(b.currentTarget),
				d = c.hasClass("prev") ? -1 : 1;
			0 !== this.viewMode && (d *= 12 * r.viewModes[this.viewMode].navStep), this.viewDate = this.moveMonth(this.viewDate, d), this._trigger(r.viewModes[this.viewMode].e, this.viewDate), this.fill()
		},
		_toggle_multidate: function (a) {
			var b = this.dates.contains(a);
			if (a || this.dates.clear(), -1 !== b ? (this.o.multidate === !0 || this.o.multidate > 1 || this.o.toggleActive) && this.dates.remove(b) : this.o.multidate === !1 ? (this.dates.clear(), this.dates.push(a)) : this.dates.push(a), "number" == typeof this.o.multidate)
				for (; this.dates.length > this.o.multidate;) this.dates.remove(0)
		},
		_setDate: function (a, b) {
			b && "date" !== b || this._toggle_multidate(a && new Date(a)), (!b && this.o.updateViewDate || "view" === b) && (this.viewDate = a && new Date(a)), this.fill(), this.setValue(), b && "view" === b || this._trigger("changeDate"), this.inputField.trigger("change"), !this.o.autoclose || b && "date" !== b || this.hide()
		},
		moveDay: function (a, b) {
			var c = new Date(a);
			return c.setUTCDate(a.getUTCDate() + b), c
		},
		moveWeek: function (a, b) {
			return this.moveDay(a, 7 * b)
		},
		moveMonth: function (a, b) {
			if (!g(a)) return this.o.defaultViewDate;
			if (!b) return a;
			var c, d, e = new Date(a.valueOf()),
				f = e.getUTCDate(),
				h = e.getUTCMonth(),
				i = Math.abs(b);
			if (b = b > 0 ? 1 : -1, 1 === i) d = -1 === b ? function () {
				return e.getUTCMonth() === h
			} : function () {
				return e.getUTCMonth() !== c
			}, c = h + b, e.setUTCMonth(c), c = (c + 12) % 12;
			else {
				for (var j = 0; i > j; j++) e = this.moveMonth(e, b);
				c = e.getUTCMonth(), e.setUTCDate(f), d = function () {
					return c !== e.getUTCMonth()
				}
			}
			for (; d();) e.setUTCDate(--f), e.setUTCMonth(c);
			return e
		},
		moveYear: function (a, b) {
			return this.moveMonth(a, 12 * b)
		},
		moveAvailableDate: function (a, b, c) {
			do {
				if (a = this[c](a, b), !this.dateWithinRange(a)) return !1;
				c = "moveDay"
			} while (this.dateIsDisabled(a));
			return a
		},
		weekOfDateIsDisabled: function (b) {
			return -1 !== a.inArray(b.getUTCDay(), this.o.daysOfWeekDisabled)
		},
		dateIsDisabled: function (b) {
			return this.weekOfDateIsDisabled(b) || a.grep(this.o.datesDisabled, function (a) {
				return e(b, a)
			}).length > 0
		},
		dateWithinRange: function (a) {
			return a >= this.o.startDate && a <= this.o.endDate
		},
		keydown: function (a) {
			if (!this.picker.is(":visible")) return void((40 === a.keyCode || 27 === a.keyCode) && (this.show(), a.stopPropagation()));
			var b, c, d = !1,
				e = this.focusDate || this.viewDate;
			switch (a.keyCode) {
				case 27:
					this.focusDate ? (this.focusDate = null, this.viewDate = this.dates.get(-1) || this.viewDate, this.fill()) : this.hide(), a.preventDefault(), a.stopPropagation();
					break;
				case 37:
				case 38:
				case 39:
				case 40:
					if (!this.o.keyboardNavigation || 7 === this.o.daysOfWeekDisabled.length) break;
					b = 37 === a.keyCode || 38 === a.keyCode ? -1 : 1, 0 === this.viewMode ? a.ctrlKey ? (c = this.moveAvailableDate(e, b, "moveYear"), c && this._trigger("changeYear", this.viewDate)) : a.shiftKey ? (c = this.moveAvailableDate(e, b, "moveMonth"), c && this._trigger("changeMonth", this.viewDate)) : 37 === a.keyCode || 39 === a.keyCode ? c = this.moveAvailableDate(e, b, "moveDay") : this.weekOfDateIsDisabled(e) || (c = this.moveAvailableDate(e, b, "moveWeek")) : 1 === this.viewMode ? ((38 === a.keyCode || 40 === a.keyCode) && (b = 4 * b), c = this.moveAvailableDate(e, b, "moveMonth")) : 2 === this.viewMode && ((38 === a.keyCode || 40 === a.keyCode) && (b = 4 * b), c = this.moveAvailableDate(e, b, "moveYear")), c && (this.focusDate = this.viewDate = c, this.setValue(), this.fill(), a.preventDefault());
					break;
				case 13:
					if (!this.o.forceParse) break;
					e = this.focusDate || this.dates.get(-1) || this.viewDate, this.o.keyboardNavigation && (this._toggle_multidate(e), d = !0), this.focusDate = null, this.viewDate = this.dates.get(-1) || this.viewDate, this.setValue(), this.fill(), this.picker.is(":visible") && (a.preventDefault(), a.stopPropagation(), this.o.autoclose && this.hide());
					break;
				case 9:
					this.focusDate = null, this.viewDate = this.dates.get(-1) || this.viewDate, this.fill(), this.hide()
			}
			d && (this._trigger(this.dates.length ? "changeDate" : "clearDate"), this.inputField.trigger("change"))
		},
		setViewMode: function (a) {
			this.viewMode = a, this.picker.children("div").hide().filter(".datepicker-" + r.viewModes[this.viewMode].clsName).show(), this.updateNavArrows(), this._trigger("changeViewMode", new Date(this.viewDate))
		}
	};
	var l = function (b, c) {
		a.data(b, "datepicker", this), this.element = a(b), this.inputs = a.map(c.inputs, function (a) {
			return a.jquery ? a[0] : a
		}), delete c.inputs, this.keepEmptyValues = c.keepEmptyValues, delete c.keepEmptyValues, n.call(a(this.inputs), c).on("changeDate", a.proxy(this.dateUpdated, this)), this.pickers = a.map(this.inputs, function (b) {
			return a.data(b, "datepicker")
		}), this.updateDates()
	};
	l.prototype = {
		updateDates: function () {
			this.dates = a.map(this.pickers, function (a) {
				return a.getUTCDate()
			}), this.updateRanges()
		},
		updateRanges: function () {
			var b = a.map(this.dates, function (a) {
				return a.valueOf()
			});
			a.each(this.pickers, function (a, c) {
				c.setRange(b)
			})
		},
		dateUpdated: function (c) {
			if (!this.updating) {
				this.updating = !0;
				var d = a.data(c.target, "datepicker");
				if (d !== b) {
					var e = d.getUTCDate(),
						f = this.keepEmptyValues,
						g = a.inArray(c.target, this.inputs),
						h = g - 1,
						i = g + 1,
						j = this.inputs.length;
					if (-1 !== g) {
						if (a.each(this.pickers, function (a, b) {
								b.getUTCDate() || b !== d && f || b.setUTCDate(e)
							}), e < this.dates[h])
							for (; h >= 0 && e < this.dates[h];) this.pickers[h--].setUTCDate(e);
						else if (e > this.dates[i])
							for (; j > i && e > this.dates[i];) this.pickers[i++].setUTCDate(e);
						this.updateDates(), delete this.updating
					}
				}
			}
		},
		destroy: function () {
			a.map(this.pickers, function (a) {
				a.destroy()
			}), a(this.inputs).off("changeDate", this.dateUpdated), delete this.element.data().datepicker
		},
		remove: f("destroy", "Method `remove` is deprecated and will be removed in version 2.0. Use `destroy` instead")
	};
	var m = a.fn.datepicker,
		n = function (c) {
			var d = Array.apply(null, arguments);
			d.shift();
			var e;
			if (this.each(function () {
					var b = a(this),
						f = b.data("datepicker"),
						g = "object" == typeof c && c;
					if (!f) {
						var j = h(this, "date"),
							m = a.extend({}, o, j, g),
							n = i(m.language),
							p = a.extend({}, o, n, j, g);
						b.hasClass("input-daterange") || p.inputs ? (a.extend(p, {
							inputs: p.inputs || b.find("input").toArray()
						}), f = new l(this, p)) : f = new k(this, p), b.data("datepicker", f)
					}
					"string" == typeof c && "function" == typeof f[c] && (e = f[c].apply(f, d))
				}), e === b || e instanceof k || e instanceof l) return this;
			if (this.length > 1) throw new Error("Using only allowed for the collection of a single element (" + c + " function)");
			return e
		};
	a.fn.datepicker = n;
	var o = a.fn.datepicker.defaults = {
			assumeNearbyYear: !1,
			autoclose: !1,
			beforeShowDay: a.noop,
			beforeShowMonth: a.noop,
			beforeShowYear: a.noop,
			beforeShowDecade: a.noop,
			beforeShowCentury: a.noop,
			calendarWeeks: !1,
			clearBtn: !1,
			toggleActive: !1,
			daysOfWeekDisabled: [],
			daysOfWeekHighlighted: [],
			datesDisabled: [],
			endDate: 1 / 0,
			forceParse: !0,
			format: "mm/dd/yyyy",
			keepEmptyValues: !1,
			keyboardNavigation: !0,
			language: "en",
			minViewMode: 0,
			maxViewMode: 4,
			multidate: !1,
			multidateSeparator: ",",
			orientation: "auto",
			rtl: !1,
			startDate: -1 / 0,
			startView: 0,
			todayBtn: !1,
			todayHighlight: !1,
			updateViewDate: !0,
			weekStart: 0,
			disableTouchKeyboard: !1,
			enableOnReadonly: !0,
			showOnFocus: !0,
			zIndexOffset: 10,
			container: "body",
			immediateUpdates: !1,
			title: "",
			templates: {
				leftArrow: "&#x00AB;",
				rightArrow: "&#x00BB;"
			},
			showWeekDays: !0
		},
		p = a.fn.datepicker.locale_opts = ["format", "rtl", "weekStart"];
	a.fn.datepicker.Constructor = k;
	var q = a.fn.datepicker.dates = {
			en: {
				days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
				daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
				daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
				months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
				monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
				today: "Today",
				clear: "Clear",
				titleFormat: "MM yyyy"
			}
		},
		r = {
			viewModes: [{
				names: ["days", "month"],
				clsName: "days",
				e: "changeMonth"
			}, {
				names: ["months", "year"],
				clsName: "months",
				e: "changeYear",
				navStep: 1
			}, {
				names: ["years", "decade"],
				clsName: "years",
				e: "changeDecade",
				navStep: 10
			}, {
				names: ["decades", "century"],
				clsName: "decades",
				e: "changeCentury",
				navStep: 100
			}, {
				names: ["centuries", "millennium"],
				clsName: "centuries",
				e: "changeMillennium",
				navStep: 1e3
			}],
			validParts: /dd?|DD?|mm?|MM?|yy(?:yy)?/g,
			nonpunctuation: /[^ -\/:-@\u5e74\u6708\u65e5\[-`{-~\t\n\r]+/g,
			parseFormat: function (a) {
				if ("function" == typeof a.toValue && "function" == typeof a.toDisplay) return a;
				var b = a.replace(this.validParts, "\x00").split("\x00"),
					c = a.match(this.validParts);
				if (!b || !b.length || !c || 0 === c.length) throw new Error("Invalid date format.");
				return {
					separators: b,
					parts: c
				}
			},
			parseDate: function (c, e, f, g) {
				function h(a, b) {
					return b === !0 && (b = 10), 100 > a && (a += 2e3, a > (new Date).getFullYear() + b && (a -= 100)), a
				}

				function i() {
					var a = this.slice(0, j[n].length),
						b = j[n].slice(0, a.length);
					return a.toLowerCase() === b.toLowerCase()
				}
				if (!c) return b;
				if (c instanceof Date) return c;
				if ("string" == typeof e && (e = r.parseFormat(e)), e.toValue) return e.toValue(c, e, f);
				var j, l, m, n, o, p = {
						d: "moveDay",
						m: "moveMonth",
						w: "moveWeek",
						y: "moveYear"
					},
					s = {
						yesterday: "-1d",
						today: "+0d",
						tomorrow: "+1d"
					};
				if (c in s && (c = s[c]), /^[\-+]\d+[dmwy]([\s,]+[\-+]\d+[dmwy])*$/i.test(c)) {
					for (j = c.match(/([\-+]\d+)([dmwy])/gi), c = new Date, n = 0; n < j.length; n++) l = j[n].match(/([\-+]\d+)([dmwy])/i), m = Number(l[1]), o = p[l[2].toLowerCase()], c = k.prototype[o](c, m);
					return k.prototype._zero_utc_time(c)
				}
				j = c && c.match(this.nonpunctuation) || [];
				var t, u, v = {},
					w = ["yyyy", "yy", "M", "MM", "m", "mm", "d", "dd"],
					x = {
						yyyy: function (a, b) {
							return a.setUTCFullYear(g ? h(b, g) : b)
						},
						m: function (a, b) {
							if (isNaN(a)) return a;
							for (b -= 1; 0 > b;) b += 12;
							for (b %= 12, a.setUTCMonth(b); a.getUTCMonth() !== b;) a.setUTCDate(a.getUTCDate() - 1);
							return a
						},
						d: function (a, b) {
							return a.setUTCDate(b)
						}
					};
				x.yy = x.yyyy, x.M = x.MM = x.mm = x.m, x.dd = x.d, c = d();
				var y = e.parts.slice();
				if (j.length !== y.length && (y = a(y).filter(function (b, c) {
						return -1 !== a.inArray(c, w)
					}).toArray()), j.length === y.length) {
					var z;
					for (n = 0, z = y.length; z > n; n++) {
						if (t = parseInt(j[n], 10), l = y[n], isNaN(t)) switch (l) {
							case "MM":
								u = a(q[f].months).filter(i), t = a.inArray(u[0], q[f].months) + 1;
								break;
							case "M":
								u = a(q[f].monthsShort).filter(i), t = a.inArray(u[0], q[f].monthsShort) + 1
						}
						v[l] = t
					}
					var A, B;
					for (n = 0; n < w.length; n++) B = w[n], B in v && !isNaN(v[B]) && (A = new Date(c), x[B](A, v[B]), isNaN(A) || (c = A))
				}
				return c
			},
			formatDate: function (b, c, d) {
				if (!b) return "";
				if ("string" == typeof c && (c = r.parseFormat(c)), c.toDisplay) return c.toDisplay(b, c, d);
				var e = {
					d: b.getUTCDate(),
					D: q[d].daysShort[b.getUTCDay()],
					DD: q[d].days[b.getUTCDay()],
					m: b.getUTCMonth() + 1,
					M: q[d].monthsShort[b.getUTCMonth()],
					MM: q[d].months[b.getUTCMonth()],
					yy: b.getUTCFullYear().toString().substring(2),
					yyyy: b.getUTCFullYear()
				};
				e.dd = (e.d < 10 ? "0" : "") + e.d, e.mm = (e.m < 10 ? "0" : "") + e.m, b = [];
				for (var f = a.extend([], c.separators), g = 0, h = c.parts.length; h >= g; g++) f.length && b.push(f.shift()), b.push(e[c.parts[g]]);
				return b.join("")
			},
			headTemplate: '<thead><tr><th colspan="7" class="datepicker-title"></th></tr><tr><th class="prev">' + o.templates.leftArrow + '</th><th colspan="5" class="datepicker-switch"></th><th class="next">' + o.templates.rightArrow + "</th></tr></thead>",
			contTemplate: '<tbody><tr><td colspan="7"></td></tr></tbody>',
			footTemplate: '<tfoot><tr><th colspan="7" class="today"></th></tr><tr><th colspan="7" class="clear"></th></tr></tfoot>'
		};
	r.template = '<div class="datepicker"><div class="datepicker-days"><table class="table-condensed">' + r.headTemplate + "<tbody></tbody>" + r.footTemplate + '</table></div><div class="datepicker-months"><table class="table-condensed">' + r.headTemplate + r.contTemplate + r.footTemplate + '</table></div><div class="datepicker-years"><table class="table-condensed">' + r.headTemplate + r.contTemplate + r.footTemplate + '</table></div><div class="datepicker-decades"><table class="table-condensed">' + r.headTemplate + r.contTemplate + r.footTemplate + '</table></div><div class="datepicker-centuries"><table class="table-condensed">' + r.headTemplate + r.contTemplate + r.footTemplate + "</table></div></div>", a.fn.datepicker.DPGlobal = r, a.fn.datepicker.noConflict = function () {
		return a.fn.datepicker = m, this
	}, a.fn.datepicker.version = "1.7.1", a.fn.datepicker.deprecated = function (a) {
		var b = window.console;
		b && b.warn && b.warn("DEPRECATED: " + a)
	}, a(document).on("focus.datepicker.data-api click.datepicker.data-api", '[data-provide="datepicker"]', function (b) {
		var c = a(this);
		c.data("datepicker") || (b.preventDefault(), n.call(c, "show"))
	}), a(function () {
		n.call(a('[data-provide="datepicker-inline"]'))
	})
}),
function (a, b) {
	"function" == typeof define && define.amd ? define(["jquery"], function (a) {
		return b(a)
	}) : "object" == typeof exports ? module.exports = b(require("jquery")) : b(jQuery)
}(this, function () {
	! function (a) {
		"use strict";

		function b(b) {
			var c = [{
				re: /[\xC0-\xC6]/g,
				ch: "A"
			}, {
				re: /[\xE0-\xE6]/g,
				ch: "a"
			}, {
				re: /[\xC8-\xCB]/g,
				ch: "E"
			}, {
				re: /[\xE8-\xEB]/g,
				ch: "e"
			}, {
				re: /[\xCC-\xCF]/g,
				ch: "I"
			}, {
				re: /[\xEC-\xEF]/g,
				ch: "i"
			}, {
				re: /[\xD2-\xD6]/g,
				ch: "O"
			}, {
				re: /[\xF2-\xF6]/g,
				ch: "o"
			}, {
				re: /[\xD9-\xDC]/g,
				ch: "U"
			}, {
				re: /[\xF9-\xFC]/g,
				ch: "u"
			}, {
				re: /[\xC7-\xE7]/g,
				ch: "c"
			}, {
				re: /[\xD1]/g,
				ch: "N"
			}, {
				re: /[\xF1]/g,
				ch: "n"
			}];
			return a.each(c, function () {
				b = b.replace(this.re, this.ch)
			}), b
		}

		function c(a) {
			var b = {
					"&": "&amp;",
					"<": "&lt;",
					">": "&gt;",
					'"': "&quot;",
					"'": "&#x27;",
					"`": "&#x60;"
				},
				c = "(?:" + Object.keys(b).join("|") + ")",
				d = new RegExp(c),
				e = new RegExp(c, "g"),
				f = null == a ? "" : "" + a;
			return d.test(f) ? f.replace(e, function (a) {
				return b[a]
			}) : f
		}

		function d(b, c) {
			var d = arguments,
				f = b,
				g = c;
			[].shift.apply(d);
			var h, i = this.each(function () {
				var b = a(this);
				if (b.is("select")) {
					var c = b.data("selectpicker"),
						i = "object" == typeof f && f;
					if (c) {
						if (i)
							for (var j in i) i.hasOwnProperty(j) && (c.options[j] = i[j])
					} else {
						var k = a.extend({}, e.DEFAULTS, a.fn.selectpicker.defaults || {}, b.data(), i);
						b.data("selectpicker", c = new e(this, k, g))
					}
					"string" == typeof f && (h = c[f] instanceof Function ? c[f].apply(c, d) : c.options[f])
				}
			});
			return "undefined" != typeof h ? h : i
		}
		String.prototype.includes || ! function () {
			var a = {}.toString,
				b = function () {
					try {
						var a = {},
							b = Object.defineProperty,
							c = b(a, a, a) && b
					} catch (d) {}
					return c
				}(),
				c = "".indexOf,
				d = function (b) {
					if (null == this) throw TypeError();
					var d = String(this);
					if (b && "[object RegExp]" == a.call(b)) throw TypeError();
					var e = d.length,
						f = String(b),
						g = f.length,
						h = arguments.length > 1 ? arguments[1] : void 0,
						i = h ? Number(h) : 0;
					i != i && (i = 0);
					var j = Math.min(Math.max(i, 0), e);
					return g + j > e ? !1 : -1 != c.call(d, f, i)
				};
			b ? b(String.prototype, "includes", {
				value: d,
				configurable: !0,
				writable: !0
			}) : String.prototype.includes = d
		}(), String.prototype.startsWith || ! function () {
			var a = function () {
					try {
						var a = {},
							b = Object.defineProperty,
							c = b(a, a, a) && b
					} catch (d) {}
					return c
				}(),
				b = {}.toString,
				c = function (a) {
					if (null == this) throw TypeError();
					var c = String(this);
					if (a && "[object RegExp]" == b.call(a)) throw TypeError();
					var d = c.length,
						e = String(a),
						f = e.length,
						g = arguments.length > 1 ? arguments[1] : void 0,
						h = g ? Number(g) : 0;
					h != h && (h = 0);
					var i = Math.min(Math.max(h, 0), d);
					if (f + i > d) return !1;
					for (var j = -1; ++j < f;)
						if (c.charCodeAt(i + j) != e.charCodeAt(j)) return !1;
					return !0
				};
			a ? a(String.prototype, "startsWith", {
				value: c,
				configurable: !0,
				writable: !0
			}) : String.prototype.startsWith = c
		}(), Object.keys || (Object.keys = function (a, b, c) {
			c = [];
			for (b in a) c.hasOwnProperty.call(a, b) && c.push(b);
			return c
		}), a.expr[":"].icontains = function (b, c, d) {
			var e = a(b),
				f = (e.data("tokens") || e.text()).toUpperCase();
			return f.includes(d[3].toUpperCase())
		}, a.expr[":"].ibegins = function (b, c, d) {
			var e = a(b),
				f = (e.data("tokens") || e.text()).toUpperCase();
			return f.startsWith(d[3].toUpperCase())
		}, a.expr[":"].aicontains = function (b, c, d) {
			var e = a(b),
				f = (e.data("tokens") || e.data("normalizedText") || e.text()).toUpperCase();
			return f.includes(d[3].toUpperCase())
		}, a.expr[":"].aibegins = function (b, c, d) {
			var e = a(b),
				f = (e.data("tokens") || e.data("normalizedText") || e.text()).toUpperCase();
			return f.startsWith(d[3].toUpperCase())
		};
		var e = function (b, c, d) {
			d && (d.stopPropagation(), d.preventDefault()), this.$element = a(b), this.$newElement = null, this.$button = null, this.$menu = null, this.$lis = null, this.options = c, null === this.options.title && (this.options.title = this.$element.attr("title")), this.val = e.prototype.val, this.render = e.prototype.render, this.refresh = e.prototype.refresh, this.setStyle = e.prototype.setStyle, this.selectAll = e.prototype.selectAll, this.deselectAll = e.prototype.deselectAll, this.destroy = e.prototype.remove, this.remove = e.prototype.remove, this.show = e.prototype.show, this.hide = e.prototype.hide, this.init()
		};
		e.VERSION = "1.7.2", e.DEFAULTS = {
			noneSelectedText: "Nothing selected",
			noneResultsText: "No results matched {0}",
			countSelectedText: function (a) {
				return 1 == a ? "{0} item selected" : "{0} items"
			},
			maxOptionsText: function (a, b) {
				return [1 == a ? "Limit reached ({n} item max)" : "Limit reached ({n} items max)", 1 == b ? "Group limit reached ({n} item max)" : "Group limit reached ({n} items max)"]
			},
			selectAllText: "Select All",
			deselectAllText: "Deselect All",
			doneButton: !1,
			doneButtonText: "Close",
			multipleSeparator: ", ",
			styleBase: "btn",
			style: "btn-default",
			size: "auto",
			title: null,
			selectedTextFormat: "values",
			width: !1,
			container: !1,
			hideDisabled: !1,
			showSubtext: !1,
			showIcon: !0,
			showContent: !0,
			dropupAuto: !0,
			header: !1,
			liveSearch: !1,
			liveSearchPlaceholder: null,
			liveSearchNormalize: !1,
			liveSearchStyle: "contains",
			actionsBox: !1,
			iconBase: "glyphicon",
			tickIcon: "glyphicon-ok",
			maxOptions: !1,
			mobile: !1,
			selectOnTab: !1,
			dropdownAlignRight: !1
		}, e.prototype = {
			constructor: e,
			init: function () {
				var b = this,
					c = this.$element.attr("id");
				this.$element.addClass("bs-select-hidden"), this.liObj = {}, this.multiple = this.$element.prop("multiple"), this.autofocus = this.$element.prop("autofocus"), this.$newElement = this.createView(), this.$element.after(this.$newElement), this.$button = this.$newElement.children("button"), this.$menu = this.$newElement.children(".dropdown-menu"), this.$menuInner = this.$menu.children(".inner"), this.$searchbox = this.$menu.find("input"), this.options.dropdownAlignRight && this.$menu.addClass("dropdown-menu-right"), "undefined" != typeof c && (this.$button.attr("data-id", c), a('label[for="' + c + '"]').click(function (a) {
					a.preventDefault(), b.$button.focus()
				})), this.checkDisabled(), this.clickListener(), this.options.liveSearch && this.liveSearchListener(), this.render(), this.setStyle(), this.setWidth(), this.options.container && this.selectPosition(), this.$menu.data("this", this), this.$newElement.data("this", this), this.options.mobile && this.mobile(), this.$newElement.on("hide.bs.dropdown", function (a) {
					b.$element.trigger("hide.bs.select", a)
				}), this.$newElement.on("hidden.bs.dropdown", function (a) {
					b.$element.trigger("hidden.bs.select", a)
				}), this.$newElement.on("show.bs.dropdown", function (a) {
					b.$element.trigger("show.bs.select", a)
				}), this.$newElement.on("shown.bs.dropdown", function (a) {
					b.$element.trigger("shown.bs.select", a)
				}), setTimeout(function () {
					b.$element.trigger("loaded.bs.select")
				})
			},
			createDropdown: function () {
				var b = this.multiple ? " show-tick" : "",
					d = this.$element.parent().hasClass("input-group") ? " input-group-btn" : "",
					e = this.autofocus ? " autofocus" : "",
					f = this.options.header ? '<div class="popover-title"><button type="button" class="close" aria-hidden="true">&times;</button>' + this.options.header + "</div>" : "",
					g = this.options.liveSearch ? '<div class="bs-searchbox"><input type="text" class="form-control" autocomplete="off"' + (null === this.options.liveSearchPlaceholder ? "" : ' placeholder="' + c(this.options.liveSearchPlaceholder) + '"') + "></div>" : "",
					h = this.multiple && this.options.actionsBox ? '<div class="bs-actionsbox"><div class="btn-group btn-group-sm btn-block"><button type="button" class="actions-btn bs-select-all btn btn-default">' + this.options.selectAllText + '</button><button type="button" class="actions-btn bs-deselect-all btn btn-default">' + this.options.deselectAllText + "</button></div></div>" : "",
					i = this.multiple && this.options.doneButton ? '<div class="bs-donebutton"><div class="btn-group btn-block"><button type="button" class="btn btn-sm btn-default">' + this.options.doneButtonText + "</button></div></div>" : "",
					j = '<div class="btn-group bootstrap-select' + b + d + '"><button type="button" class="' + this.options.styleBase + ' dropdown-toggle" data-toggle="dropdown"' + e + '><span class="filter-option pull-left"></span>&nbsp;<i class="caret"></i></button><div class="dropdown-menu open">' + f + g + h + '<ul class="dropdown-menu inner" role="menu"></ul>' + i + "</div></div>";
				return a(j)
			},
			createView: function () {
				var a = this.createDropdown(),
					b = this.createLi();
				return a.find("ul")[0].innerHTML = b, a
			},
			reloadLi: function () {
				this.destroyLi();
				var a = this.createLi();
				this.$menuInner[0].innerHTML = a
			},
			destroyLi: function () {
				this.$menu.find("li").remove()
			},
			createLi: function () {
				var d = this,
					e = [],
					f = 0,
					g = document.createElement("option"),
					h = -1,
					i = function (a, b, c, d) {
						return "<li" + ("undefined" != typeof c & "" !== c ? ' class="' + c + '"' : "") + ("undefined" != typeof b & null !== b ? ' data-original-index="' + b + '"' : "") + ("undefined" != typeof d & null !== d ? 'data-optgroup="' + d + '"' : "") + ">" + a + "</li>"
					},
					j = function (a, e, f, g) {
						return '<a tabindex="0"' + ("undefined" != typeof e ? ' class="' + e + '"' : "") + ("undefined" != typeof f ? ' style="' + f + '"' : "") + (d.options.liveSearchNormalize ? ' data-normalized-text="' + b(c(a)) + '"' : "") + ("undefined" != typeof g || null !== g ? ' data-tokens="' + g + '"' : "") + '><div class="checkbox"><label></label></div><span class="checkbox-label">' + a + "</span></a>"
					};
				if (this.options.title && !this.multiple && (h--, !this.$element.find(".bs-title-option").length)) {
					var k = this.$element[0];
					g.className = "bs-title-option", g.appendChild(document.createTextNode(this.options.title)), g.value = "", k.insertBefore(g, k.firstChild), null === k.options[k.selectedIndex].getAttribute("selected") && (g.selected = !0)
				}
				return this.$element.find("option").each(function (b) {
					var c = a(this);
					if (h++, !c.hasClass("bs-title-option")) {
						var g = this.className || "",
							k = this.style.cssText,
							l = c.data("content") ? c.data("content") : c.html(),
							m = c.data("tokens") ? c.data("tokens") : null,
							n = "undefined" != typeof c.data("subtext") ? '<small class="text-muted">' + c.data("subtext") + "</small>" : "",
							o = "undefined" != typeof c.data("icon") ? '<span class="' + d.options.iconBase + " " + c.data("icon") + '"></span> ' : "",
							p = this.disabled || "OPTGROUP" === this.parentElement.tagName && this.parentElement.disabled;
						if ("" !== o && p && (o = "<span>" + o + "</span>"), d.options.hideDisabled && p) return void h--;
						if (c.data("content") || (l = o + '<span class="text">' + l + n + "</span>"), "OPTGROUP" === this.parentElement.tagName && c.data("divider") !== !0) {
							if (0 === c.index()) {
								f += 1;
								var q = this.parentElement.label,
									r = "undefined" != typeof c.parent().data("subtext") ? '<small class="text-muted">' + c.parent().data("subtext") + "</small>" : "",
									s = c.parent().data("icon") ? '<span class="' + d.options.iconBase + " " + c.parent().data("icon") + '"></span> ' : "",
									t = " " + this.parentElement.className || "";
								q = s + '<span class="text">' + q + r + "</span>", 0 !== b && e.length > 0 && (h++, e.push(i("", null, "divider", f + "div"))), h++, e.push(i(q, null, "dropdown-header" + t, f))
							}
							e.push(i(j(l, "opt " + g + t, k, m), b, "", f))
						} else c.data("divider") === !0 ? e.push(i("", b, "divider")) : c.data("hidden") === !0 ? e.push(i(j(l, g, k, m), b, "hidden is-hidden")) : (this.previousElementSibling && "OPTGROUP" === this.previousElementSibling.tagName && (h++, e.push(i("", null, "divider", f + "div"))), e.push(i(j(l, g, k, m), b)));
						d.liObj[b] = h
					}
				}), this.multiple || 0 !== this.$element.find("option:selected").length || this.options.title || this.$element.find("option").eq(0).prop("selected", !0).attr("selected", "selected"), e.join("")
			},
			findLis: function () {
				return null == this.$lis && (this.$lis = this.$menu.find("li")), this.$lis
			},
			render: function (b) {
				var c, d = this;
				b !== !1 && this.$element.find("option").each(function (a) {
					var b = d.findLis().eq(d.liObj[a]);
					d.setDisabled(a, this.disabled || "OPTGROUP" === this.parentElement.tagName && this.parentElement.disabled, b), d.setSelected(a, this.selected, b)
				}), this.tabIndex();
				var e = this.$element.find("option").map(function () {
						if (this.selected) {
							if (d.options.hideDisabled && (this.disabled || "OPTGROUP" === this.parentElement.tagName && this.parentElement.disabled)) return !1;
							var b, c = a(this),
								e = c.data("icon") && d.options.showIcon ? '<i class="' + d.options.iconBase + " " + c.data("icon") + '"></i> ' : "";
							return b = d.options.showSubtext && c.data("subtext") && !d.multiple ? ' <small class="text-muted">' + c.data("subtext") + "</small>" : "", "undefined" != typeof c.attr("title") ? c.attr("title") : c.data("content") && d.options.showContent ? c.data("content") : e + c.html() + b
						}
					}).toArray(),
					f = this.multiple ? e.join(this.options.multipleSeparator) : e[0];
				if (this.multiple && this.options.selectedTextFormat.indexOf("count") > -1) {
					var g = this.options.selectedTextFormat.split(">");
					if (g.length > 1 && e.length > g[1] || 1 == g.length && e.length >= 2) {
						c = this.options.hideDisabled ? ", [disabled]" : "";
						var h = this.$element.find("option").not('[data-divider="true"], [data-hidden="true"]' + c).length,
							i = "function" == typeof this.options.countSelectedText ? this.options.countSelectedText(e.length, h) : this.options.countSelectedText;
						f = i.replace("{0}", e.length.toString()).replace("{1}", h.toString())
					}
				}
				void 0 == this.options.title && (this.options.title = this.$element.attr("title")), "static" == this.options.selectedTextFormat && (f = this.options.title), f || (f = "undefined" != typeof this.options.title ? this.options.title : this.options.noneSelectedText), this.$button.attr("title", a.trim(f.replace(/<[^>]*>?/g, ""))), this.$button.children(".filter-option").html(f), this.$element.trigger("rendered.bs.select")
			},
			setStyle: function (a, b) {
				this.$element.attr("class") && this.$newElement.addClass(this.$element.attr("class").replace(/selectpicker|mobile-device|bs-select-hidden|validate\[.*\]/gi, ""));
				var c = a ? a : this.options.style;
				"add" == b ? this.$button.addClass(c) : "remove" == b ? this.$button.removeClass(c) : (this.$button.removeClass(this.options.style), this.$button.addClass(c))
			},
			liHeight: function (b) {
				if (b || this.options.size !== !1 && !this.sizeInfo) {
					var c = document.createElement("div"),
						d = document.createElement("div"),
						e = document.createElement("ul"),
						f = document.createElement("li"),
						g = document.createElement("li"),
						h = document.createElement("a"),
						i = document.createElement("span"),
						j = this.options.header ? this.$menu.find(".popover-title")[0].cloneNode(!0) : null,
						k = this.options.liveSearch ? document.createElement("div") : null,
						l = this.options.actionsBox && this.multiple ? this.$menu.find(".bs-actionsbox")[0].cloneNode(!0) : null,
						m = this.options.doneButton && this.multiple ? this.$menu.find(".bs-donebutton")[0].cloneNode(!0) : null;
					if (i.className = "text", c.className = this.$menu[0].parentNode.className + " open", d.className = "dropdown-menu open", e.className = "dropdown-menu inner", f.className = "divider", i.appendChild(document.createTextNode("Inner text")), h.appendChild(i), g.appendChild(h), e.appendChild(g), e.appendChild(f), j && d.appendChild(j), k) {
						var n = document.createElement("span");
						k.className = "bs-searchbox", n.className = "form-control", k.appendChild(n), d.appendChild(k)
					}
					l && d.appendChild(l), d.appendChild(e), m && d.appendChild(m), c.appendChild(d), document.body.appendChild(c);
					var o = h.offsetHeight,
						p = j ? j.offsetHeight : 0,
						q = k ? k.offsetHeight : 0,
						r = l ? l.offsetHeight : 0,
						s = m ? m.offsetHeight : 0,
						t = a(f).outerHeight(!0),
						u = getComputedStyle ? getComputedStyle(d) : !1,
						v = u ? a(d) : null,
						w = parseInt(u ? u.paddingTop : v.css("paddingTop")) + parseInt(u ? u.paddingBottom : v.css("paddingBottom")) + parseInt(u ? u.borderTopWidth : v.css("borderTopWidth")) + parseInt(u ? u.borderBottomWidth : v.css("borderBottomWidth")),
						x = w + parseInt(u ? u.marginTop : v.css("marginTop")) + parseInt(u ? u.marginBottom : v.css("marginBottom")) + 2;
					document.body.removeChild(c), this.sizeInfo = {
						liHeight: o,
						headerHeight: p,
						searchHeight: q,
						actionsHeight: r,
						doneButtonHeight: s,
						dividerHeight: t,
						menuPadding: w,
						menuExtras: x
					}
				}
			},
			setSize: function () {
				this.findLis(), this.liHeight();
				var b, c, d, e, f = this,
					g = this.$menu,
					h = this.$menuInner,
					i = a(window),
					j = this.$newElement[0].offsetHeight,
					k = this.sizeInfo.liHeight,
					l = this.sizeInfo.headerHeight,
					m = this.sizeInfo.searchHeight,
					n = this.sizeInfo.actionsHeight,
					o = this.sizeInfo.doneButtonHeight,
					p = this.sizeInfo.dividerHeight,
					q = this.sizeInfo.menuPadding,
					r = this.sizeInfo.menuExtras,
					s = this.options.hideDisabled ? ".disabled" : "",
					t = function () {
						d = f.$newElement.offset().top - i.scrollTop(), e = i.height() - d - j
					};
				if (t(), this.options.header && g.css("padding-top", 0), "auto" === this.options.size) {
					var u = function () {
						var i, j = function (b, c) {
								return function (d) {
									return c ? d.classList ? d.classList.contains(b) : a(d).hasClass(b) : !(d.classList ? d.classList.contains(b) : a(d).hasClass(b))
								}
							},
							p = f.$menuInner[0].getElementsByTagName("li"),
							s = Array.prototype.filter ? Array.prototype.filter.call(p, j("hidden", !1)) : f.$lis.not(".hidden"),
							u = Array.prototype.filter ? Array.prototype.filter.call(s, j("dropdown-header", !0)) : s.filter(".dropdown-header");
						t(), b = e - r, f.options.container ? (g.data("height") || g.data("height", g.height()), c = g.data("height")) : c = g.height(), f.options.dropupAuto && f.$newElement.toggleClass("dropup", d > e && c > b - r), f.$newElement.hasClass("dropup") && (b = d - r), i = s.length + u.length > 3 ? 3 * k + r - 2 : 0, g.css({
							"max-height": b + "px",
							overflow: "hidden",
							"min-height": i + l + m + n + o + "px"
						}), h.css({
							"max-height": b - l - m - n - o - q + "px",
							"overflow-y": "auto",
							"min-height": Math.max(i - q, 0) + "px"
						})
					};
					u(), this.$searchbox.off("input.getSize propertychange.getSize").on("input.getSize propertychange.getSize", u), i.off("resize.getSize scroll.getSize").on("resize.getSize scroll.getSize", u)
				} else if (this.options.size && "auto" != this.options.size && this.$lis.not(s).length > this.options.size) {
					var v = this.$lis.not(".divider").not(s).children().slice(0, this.options.size).last().parent().index(),
						w = this.$lis.slice(0, v + 1).filter(".divider").length;
					b = k * this.options.size + w * p + q, f.options.container ? (g.data("height") || g.data("height", g.height()), c = g.data("height")) : c = g.height(), f.options.dropupAuto && this.$newElement.toggleClass("dropup", d > e && c > b - r), g.css({
						"max-height": b + l + m + n + o + "px",
						overflow: "hidden",
						"min-height": ""
					}), h.css({
						"max-height": b - q + "px",
						"overflow-y": "auto",
						"min-height": ""
					})
				}
			},
			setWidth: function () {
				if ("auto" === this.options.width) {
					this.$menu.css("min-width", "0");
					var a = this.$menu.parent().clone().appendTo("body"),
						b = this.options.container ? this.$newElement.clone().appendTo("body") : a,
						c = a.children(".dropdown-menu").outerWidth(),
						d = b.css("width", "auto").children("button").outerWidth();
					a.remove(), b.remove(), this.$newElement.css("width", Math.max(c, d) + "px")
				} else "fit" === this.options.width ? (this.$menu.css("min-width", ""), this.$newElement.css("width", "").addClass("fit-width")) : this.options.width ? (this.$menu.css("min-width", ""), this.$newElement.css("width", this.options.width)) : (this.$menu.css("min-width", ""), this.$newElement.css("width", ""));
				this.$newElement.hasClass("fit-width") && "fit" !== this.options.width && this.$newElement.removeClass("fit-width")
			},
			selectPosition: function () {
				var b, c, d = this,
					e = "<div />",
					f = a(e),
					g = function (a) {
						f.addClass(a.attr("class").replace(/form-control|fit-width/gi, "")).toggleClass("dropup", a.hasClass("dropup")), b = a.offset(), c = a.hasClass("dropup") ? 0 : a[0].offsetHeight, f.css({
							top: b.top + c,
							left: b.left,
							width: a[0].offsetWidth,
							position: "absolute"
						})
					};
				this.$newElement.on("click", function () {
					d.isDisabled() || (g(a(this)), f.appendTo(d.options.container), f.toggleClass("open", !a(this).hasClass("open")), f.append(d.$menu))
				}), a(window).on("resize scroll", function () {
					g(d.$newElement)
				}), this.$element.on("hide.bs.select", function () {
					d.$menu.data("height", d.$menu.height()), f.detach()
				})
			},
			setSelected: function (a, b, c) {
				if (!c) var c = this.findLis().eq(this.liObj[a]);
				c.toggleClass("selected", b)
			},
			setDisabled: function (a, b, c) {
				if (!c) var c = this.findLis().eq(this.liObj[a]);
				b ? c.addClass("disabled").children("a").attr("href", "#").attr("tabindex", -1) : c.removeClass("disabled").children("a").removeAttr("href").attr("tabindex", 0)
			},
			isDisabled: function () {
				return this.$element[0].disabled
			},
			checkDisabled: function () {
				var a = this;
				this.isDisabled() ? (this.$newElement.addClass("disabled"), this.$button.addClass("disabled").attr("tabindex", -1)) : (this.$button.hasClass("disabled") && (this.$newElement.removeClass("disabled"), this.$button.removeClass("disabled")), -1 != this.$button.attr("tabindex") || this.$element.data("tabindex") || this.$button.removeAttr("tabindex")), this.$button.click(function () {
					return !a.isDisabled()
				})
			},
			tabIndex: function () {
				this.$element.is("[tabindex]") && (this.$element.data("tabindex", this.$element.attr("tabindex")), this.$button.attr("tabindex", this.$element.data("tabindex")))
			},
			clickListener: function () {
				var b = this,
					c = a(document);
				this.$newElement.on("touchstart.dropdown", ".dropdown-menu", function (a) {
					a.stopPropagation()
				}), c.data("spaceSelect", !1), this.$button.on("keyup", function (a) {
					/(32)/.test(a.keyCode.toString(10)) && c.data("spaceSelect") && (a.preventDefault(), c.data("spaceSelect", !1))
				}), this.$newElement.on("click", function () {
					b.setSize(), b.$element.on("shown.bs.select", function () {
						if (b.options.liveSearch || b.multiple) {
							if (!b.multiple) {
								var a = b.liObj[b.$element[0].selectedIndex];
								if ("number" != typeof a) return;
								var c = b.$lis.eq(a)[0].offsetTop - b.$menuInner[0].offsetTop;
								c = c - b.$menuInner[0].offsetHeight / 2 + b.sizeInfo.liHeight / 2, b.$menuInner[0].scrollTop = c
							}
						} else b.$menu.find(".selected a").focus()
					})
				}), this.$menu.on("click", "li a", function (c) {
					var d = a(this),
						e = d.parent().data("originalIndex"),
						f = b.$element.val(),
						g = b.$element.prop("selectedIndex");
					if (b.multiple && c.stopPropagation(), c.preventDefault(), !b.isDisabled() && !d.parent().hasClass("disabled")) {
						var h = b.$element.find("option"),
							i = h.eq(e),
							j = i.prop("selected"),
							k = i.parent("optgroup"),
							l = b.options.maxOptions,
							m = k.data("maxOptions") || !1;
						if (b.multiple) {
							if (i.prop("selected", !j), b.setSelected(e, !j), d.blur(), l !== !1 || m !== !1) {
								var n = l < h.filter(":selected").length,
									o = m < k.find("option:selected").length;
								if (l && n || m && o)
									if (l && 1 == l) h.prop("selected", !1), i.prop("selected", !0), b.$menu.find(".selected").removeClass("selected"), b.setSelected(e, !0);
									else if (m && 1 == m) {
									k.find("option:selected").prop("selected", !1), i.prop("selected", !0);
									var p = d.parent().data("optgroup");
									b.$menu.find('[data-optgroup="' + p + '"]').removeClass("selected"), b.setSelected(e, !0)
								} else {
									var q = "function" == typeof b.options.maxOptionsText ? b.options.maxOptionsText(l, m) : b.options.maxOptionsText,
										r = q[0].replace("{n}", l),
										s = q[1].replace("{n}", m),
										t = a('<div class="notify"></div>');
									q[2] && (r = r.replace("{var}", q[2][l > 1 ? 0 : 1]), s = s.replace("{var}", q[2][m > 1 ? 0 : 1])), i.prop("selected", !1), b.$menu.append(t), l && n && (t.append(a("<div>" + r + "</div>")), b.$element.trigger("maxReached.bs.select")), m && o && (t.append(a("<div>" + s + "</div>")), b.$element.trigger("maxReachedGrp.bs.select")), setTimeout(function () {
										b.setSelected(e, !1)
									}, 10), t.delay(750).fadeOut(300, function () {
										a(this).remove()
									})
								}
							}
						} else h.prop("selected", !1), i.prop("selected", !0), b.$menu.find(".selected").removeClass("selected"), b.setSelected(e, !0);
						b.multiple ? b.options.liveSearch && b.$searchbox.focus() : b.$button.focus(), (f != b.$element.val() && b.multiple || g != b.$element.prop("selectedIndex") && !b.multiple) && (b.$element.change(), b.$element.trigger("changed.bs.select", [e, i.prop("selected"), j]))
					}
				}), this.$menu.on("click", "li.disabled a, .popover-title, .popover-title :not(.close)", function (c) {
					c.currentTarget == this && (c.preventDefault(), c.stopPropagation(), b.options.liveSearch && !a(c.target).hasClass("close") ? b.$searchbox.focus() : b.$button.focus())
				}), this.$menu.on("click", "li.divider, li.dropdown-header", function (a) {
					a.preventDefault(), a.stopPropagation(), b.options.liveSearch ? b.$searchbox.focus() : b.$button.focus()
				}), this.$menu.on("click", ".popover-title .close", function () {
					b.$button.click()
				}), this.$searchbox.on("click", function (a) {
					a.stopPropagation()
				}), this.$menu.on("click", ".actions-btn", function (c) {
					b.options.liveSearch ? b.$searchbox.focus() : b.$button.focus(), c.preventDefault(), c.stopPropagation(), a(this).hasClass("bs-select-all") ? b.selectAll() : b.deselectAll(), b.$element.change()
				}), this.$element.change(function () {
					b.render(!1)
				})
			},
			liveSearchListener: function () {
				var d = this,
					e = a('<li class="no-results"></li>');
				this.$newElement.on("click.dropdown.data-api touchstart.dropdown.data-api", function () {
					d.$menuInner.find(".active").removeClass("active"), d.$searchbox.val() && (d.$searchbox.val(""), d.$lis.not(".is-hidden").removeClass("hidden"), e.parent().length && e.remove()), d.multiple || d.$menuInner.find(".selected").addClass("active"), setTimeout(function () {
						d.$searchbox.focus()
					}, 10)
				}), this.$searchbox.on("click.dropdown.data-api focus.dropdown.data-api touchend.dropdown.data-api", function (a) {
					a.stopPropagation()
				}), this.$searchbox.on("input propertychange", function () {
					if (d.$searchbox.val()) {
						var f = d.$lis.not(".is-hidden").removeClass("hidden").children("a");
						f = f.not(d.options.liveSearchNormalize ? ":a" + d._searchStyle() + "(" + b(d.$searchbox.val()) + ")" : ":" + d._searchStyle() + "(" + d.$searchbox.val() + ")"), f.parent().addClass("hidden"), d.$lis.filter(".dropdown-header").each(function () {
							var b = a(this),
								c = b.data("optgroup");
							0 === d.$lis.filter("[data-optgroup=" + c + "]").not(b).not(".hidden").length && (b.addClass("hidden"), d.$lis.filter("[data-optgroup=" + c + "div]").addClass("hidden"))
						});
						var g = d.$lis.not(".hidden");
						g.each(function (b) {
							var c = a(this);
							c.hasClass("divider") && (c.index() === g.eq(0).index() || c.index() === g.last().index() || g.eq(b + 1).hasClass("divider")) && c.addClass("hidden")
						}), d.$lis.not(".hidden, .no-results").length ? e.parent().length && e.remove() : (e.parent().length && e.remove(), e.html(d.options.noneResultsText.replace("{0}", '"' + c(d.$searchbox.val()) + '"')).show(), d.$menuInner.append(e))
					} else d.$lis.not(".is-hidden").removeClass("hidden"), e.parent().length && e.remove();
					d.$lis.filter(".active").removeClass("active"), d.$lis.not(".hidden, .divider, .dropdown-header").eq(0).addClass("active").children("a").focus(), a(this).focus()
				})
			},
			_searchStyle: function () {
				var a = "icontains";
				switch (this.options.liveSearchStyle) {
					case "begins":
					case "startsWith":
						a = "ibegins";
						break;
					case "contains":
				}
				return a
			},
			val: function (a) {
				return "undefined" != typeof a ? (this.$element.val(a), this.render(), this.$element) : this.$element.val()
			},
			selectAll: function () {
				this.findLis(), this.$element.find("option:enabled").not("[data-divider], [data-hidden]").prop("selected", !0), this.$lis.not(".divider, .dropdown-header, .disabled, .hidden").addClass("selected"), this.render(!1)
			},
			deselectAll: function () {
				this.findLis(), this.$element.find("option:enabled").not("[data-divider], [data-hidden]").prop("selected", !1), this.$lis.not(".divider, .dropdown-header, .disabled, .hidden").removeClass("selected"), this.render(!1)
			},
			keydown: function (c) {
				var d, e, f, g, h, i, j, k, l, m = a(this),
					n = m.is("input") ? m.parent().parent() : m.parent(),
					o = n.data("this"),
					p = ":not(.disabled, .hidden, .dropdown-header, .divider)",
					q = {
						32: " ",
						48: "0",
						49: "1",
						50: "2",
						51: "3",
						52: "4",
						53: "5",
						54: "6",
						55: "7",
						56: "8",
						57: "9",
						59: ";",
						65: "a",
						66: "b",
						67: "c",
						68: "d",
						69: "e",
						70: "f",
						71: "g",
						72: "h",
						73: "i",
						74: "j",
						75: "k",
						76: "l",
						77: "m",
						78: "n",
						79: "o",
						80: "p",
						81: "q",
						82: "r",
						83: "s",
						84: "t",
						85: "u",
						86: "v",
						87: "w",
						88: "x",
						89: "y",
						90: "z",
						96: "0",
						97: "1",
						98: "2",
						99: "3",
						100: "4",
						101: "5",
						102: "6",
						103: "7",
						104: "8",
						105: "9"
					};
				if (o.options.liveSearch && (n = m.parent().parent()), o.options.container && (n = o.$menu), d = a("[role=menu] li a", n), l = o.$menu.parent().hasClass("open"), !l && (c.keyCode >= 48 && c.keyCode <= 57 || event.keyCode >= 65 && event.keyCode <= 90) && (o.options.container ? o.$newElement.trigger("click") : (o.setSize(), o.$menu.parent().addClass("open"), l = !0), o.$searchbox.focus()), o.options.liveSearch && (/(^9$|27)/.test(c.keyCode.toString(10)) && l && 0 === o.$menu.find(".active").length && (c.preventDefault(), o.$menu.parent().removeClass("open"), o.options.container && o.$newElement.removeClass("open"), o.$button.focus()), d = a("[role=menu] li:not(.disabled, .hidden, .dropdown-header, .divider)", n), m.val() || /(38|40)/.test(c.keyCode.toString(10)) || 0 === d.filter(".active").length && (d = o.$newElement.find("li"), d = d.filter(o.options.liveSearchNormalize ? ":a" + o._searchStyle() + "(" + b(q[c.keyCode]) + ")" : ":" + o._searchStyle() + "(" + q[c.keyCode] + ")"))), d.length) {
					if (/(38|40)/.test(c.keyCode.toString(10))) e = d.index(d.filter(":focus")), g = d.parent(p).first().data("originalIndex"), h = d.parent(p).last().data("originalIndex"), f = d.eq(e).parent().nextAll(p).eq(0).data("originalIndex"), i = d.eq(e).parent().prevAll(p).eq(0).data("originalIndex"), j = d.eq(f).parent().prevAll(p).eq(0).data("originalIndex"), o.options.liveSearch && (d.each(function (b) {
						a(this).hasClass("disabled") || a(this).data("index", b)
					}), e = d.index(d.filter(".active")), g = d.first().data("index"), h = d.last().data("index"), f = d.eq(e).nextAll().eq(0).data("index"), i = d.eq(e).prevAll().eq(0).data("index"), j = d.eq(f).prevAll().eq(0).data("index")), k = m.data("prevIndex"), 38 == c.keyCode ? (o.options.liveSearch && (e -= 1), e != j && e > i && (e = i), g > e && (e = g), e == k && (e = h)) : 40 == c.keyCode && (o.options.liveSearch && (e += 1), -1 == e && (e = 0), e != j && f > e && (e = f), e > h && (e = h), e == k && (e = g)), m.data("prevIndex", e), o.options.liveSearch ? (c.preventDefault(), m.hasClass("dropdown-toggle") || (d.removeClass("active").eq(e).addClass("active").children("a").focus(), m.focus())) : d.eq(e).focus();
					else if (!m.is("input")) {
						var r, s, t = [];
						d.each(function () {
							a(this).parent().hasClass("disabled") || a.trim(a(this).text().toLowerCase()).substring(0, 1) == q[c.keyCode] && t.push(a(this).parent().index())
						}), r = a(document).data("keycount"), r++, a(document).data("keycount", r), s = a.trim(a(":focus").text().toLowerCase()).substring(0, 1), s != q[c.keyCode] ? (r = 1, a(document).data("keycount", r)) : r >= t.length && (a(document).data("keycount", 0), r > t.length && (r = 1)), d.eq(t[r - 1]).focus()
					}
					if ((/(13|32)/.test(c.keyCode.toString(10)) || /(^9$)/.test(c.keyCode.toString(10)) && o.options.selectOnTab) && l) {
						if (/(32)/.test(c.keyCode.toString(10)) || c.preventDefault(), o.options.liveSearch) /(32)/.test(c.keyCode.toString(10)) || (o.$menu.find(".active a").click(), m.focus());
						else {
							var u = a(":focus");
							u.click(), u.focus(), c.preventDefault(), a(document).data("spaceSelect", !0)
						}
						a(document).data("keycount", 0)
					}(/(^9$|27)/.test(c.keyCode.toString(10)) && l && (o.multiple || o.options.liveSearch) || /(27)/.test(c.keyCode.toString(10)) && !l) && (o.$menu.parent().removeClass("open"), o.options.container && o.$newElement.removeClass("open"), o.$button.focus())
				}
			},
			mobile: function () {
				this.$element.addClass("mobile-device").appendTo(this.$newElement), this.options.container && this.$menu.hide()
			},
			refresh: function () {
				this.$lis = null, this.reloadLi(), this.render(), this.checkDisabled(), this.liHeight(!0), this.setStyle(), this.setWidth(), this.$lis && this.$searchbox.trigger("propertychange"), this.$element.trigger("refreshed.bs.select")
			},
			hide: function () {
				this.$newElement.hide()
			},
			show: function () {
				this.$newElement.show()
			},
			remove: function () {
				this.$newElement.remove(), this.$element.remove()
			}
		};
		var f = a.fn.selectpicker;
		a.fn.selectpicker = d, a.fn.selectpicker.Constructor = e, a.fn.selectpicker.noConflict = function () {
			return a.fn.selectpicker = f, this
		}, a(document).data("keycount", 0).on("keydown", '.bootstrap-select [data-toggle=dropdown], .bootstrap-select [role="menu"], .bs-searchbox input', e.prototype.keydown).on("focusin.modal", '.bootstrap-select [data-toggle=dropdown], .bootstrap-select [role="menu"], .bs-searchbox input', function (a) {
			a.stopPropagation()
		}), a(window).on("load.bs.select.data-api", function () {
			a(".selectpicker").each(function () {
				var b = a(this);
				d.call(b, b.data())
			})
		})
	}(jQuery)
}),
function () {
	var a = [].slice;
	! function (b, c) {
		"use strict";
		var d;
		return d = function () {
			function a(a, c) {
				null == c && (c = {}), this.$element = b(a), this.options = b.extend({}, b.fn.bootstrapSwitch.defaults, {
					state: this.$element.is(":checked"),
					size: this.$element.data("size"),
					animate: this.$element.data("animate"),
					disabled: this.$element.is(":disabled"),
					readonly: this.$element.is("[readonly]"),
					indeterminate: this.$element.data("indeterminate"),
					inverse: this.$element.data("inverse"),
					radioAllOff: this.$element.data("radio-all-off"),
					onColor: this.$element.data("on-color"),
					offColor: this.$element.data("off-color"),
					onText: this.$element.data("on-text"),
					offText: this.$element.data("off-text"),
					labelText: this.$element.data("label-text"),
					handleWidth: this.$element.data("handle-width"),
					labelWidth: this.$element.data("label-width"),
					baseClass: this.$element.data("base-class"),
					wrapperClass: this.$element.data("wrapper-class")
				}, c), this.prevOptions = {}, this.$wrapper = b("<div>", {
					"class": function (a) {
						return function () {
							var b;
							return b = ["" + a.options.baseClass].concat(a._getClasses(a.options.wrapperClass)), b.push(a.options.state ? a.options.baseClass + "-on" : a.options.baseClass + "-off"), null != a.options.size && b.push(a.options.baseClass + "-" + a.options.size), a.options.disabled && b.push(a.options.baseClass + "-disabled"), a.options.readonly && b.push(a.options.baseClass + "-readonly"), a.options.indeterminate && b.push(a.options.baseClass + "-indeterminate"), a.options.inverse && b.push(a.options.baseClass + "-inverse"), a.$element.attr("id") && b.push(a.options.baseClass + "-id-" + a.$element.attr("id")), b.join(" ")
						}
					}(this)()
				}), this.$container = b("<div>", {
					"class": this.options.baseClass + "-container"
				}), this.$on = b("<span>", {
					html: this.options.onText,
					"class": this.options.baseClass + "-handle-on " + this.options.baseClass + "-" + this.options.onColor
				}), this.$off = b("<span>", {
					html: this.options.offText,
					"class": this.options.baseClass + "-handle-off " + this.options.baseClass + "-" + this.options.offColor
				}), this.$label = b("<span>", {
					html: this.options.labelText,
					"class": this.options.baseClass + "-label"
				}), this.$element.on("init.bootstrapSwitch", function (b) {
					return function () {
						return b.options.onInit.apply(a, arguments)
					}
				}(this)), this.$element.on("switchChange.bootstrapSwitch", function (c) {
					return function () {
						return !1 === c.options.onSwitchChange.apply(a, arguments) ? c.$element.is(":radio") ? b("[name='" + c.$element.attr("name") + "']").trigger("previousState.bootstrapSwitch", !0) : c.$element.trigger("previousState.bootstrapSwitch", !0) : void 0
					}
				}(this)), this.$container = this.$element.wrap(this.$container).parent(), this.$wrapper = this.$container.wrap(this.$wrapper).parent(), this.$element.before(this.options.inverse ? this.$off : this.$on).before(this.$label).before(this.options.inverse ? this.$on : this.$off), this.options.indeterminate && this.$element.prop("indeterminate", !0), this._init(), this._elementHandlers(), this._handleHandlers(), this._labelHandlers(), this._formHandler(), this._externalLabelHandler(), this.$element.trigger("init.bootstrapSwitch", this.options.state)
			}
			return a.prototype._constructor = a, a.prototype.setPrevOptions = function () {
				return this.prevOptions = b.extend(!0, {}, this.options)
			}, a.prototype.state = function (a, c) {
				return "undefined" == typeof a ? this.options.state : this.options.disabled || this.options.readonly ? this.$element : this.options.state && !this.options.radioAllOff && this.$element.is(":radio") ? this.$element : (this.$element.is(":radio") ? b("[name='" + this.$element.attr("name") + "']").trigger("setPreviousOptions.bootstrapSwitch") : this.$element.trigger("setPreviousOptions.bootstrapSwitch"), this.options.indeterminate && this.indeterminate(!1), a = !!a, this.$element.prop("checked", a).trigger("change.bootstrapSwitch", c), this.$element)
			}, a.prototype.toggleState = function (a) {
				return this.options.disabled || this.options.readonly ? this.$element : this.options.indeterminate ? (this.indeterminate(!1), this.state(!0)) : this.$element.prop("checked", !this.options.state).trigger("change.bootstrapSwitch", a)
			}, a.prototype.size = function (a) {
				return "undefined" == typeof a ? this.options.size : (null != this.options.size && this.$wrapper.removeClass(this.options.baseClass + "-" + this.options.size), a && this.$wrapper.addClass(this.options.baseClass + "-" + a), this._width(), this._containerPosition(), this.options.size = a, this.$element)
			}, a.prototype.animate = function (a) {
				return "undefined" == typeof a ? this.options.animate : (a = !!a, a === this.options.animate ? this.$element : this.toggleAnimate())
			}, a.prototype.toggleAnimate = function () {
				return this.options.animate = !this.options.animate, this.$wrapper.toggleClass(this.options.baseClass + "-animate"), this.$element
			}, a.prototype.disabled = function (a) {
				return "undefined" == typeof a ? this.options.disabled : (a = !!a, a === this.options.disabled ? this.$element : this.toggleDisabled())
			}, a.prototype.toggleDisabled = function () {
				return this.options.disabled = !this.options.disabled, this.$element.prop("disabled", this.options.disabled), this.$wrapper.toggleClass(this.options.baseClass + "-disabled"), this.$element
			}, a.prototype.readonly = function (a) {
				return "undefined" == typeof a ? this.options.readonly : (a = !!a, a === this.options.readonly ? this.$element : this.toggleReadonly())
			}, a.prototype.toggleReadonly = function () {
				return this.options.readonly = !this.options.readonly, this.$element.prop("readonly", this.options.readonly), this.$wrapper.toggleClass(this.options.baseClass + "-readonly"), this.$element
			}, a.prototype.indeterminate = function (a) {
				return "undefined" == typeof a ? this.options.indeterminate : (a = !!a, a === this.options.indeterminate ? this.$element : this.toggleIndeterminate())
			}, a.prototype.toggleIndeterminate = function () {
				return this.options.indeterminate = !this.options.indeterminate, this.$element.prop("indeterminate", this.options.indeterminate), this.$wrapper.toggleClass(this.options.baseClass + "-indeterminate"), this._containerPosition(), this.$element
			}, a.prototype.inverse = function (a) {
				return "undefined" == typeof a ? this.options.inverse : (a = !!a, a === this.options.inverse ? this.$element : this.toggleInverse())
			}, a.prototype.toggleInverse = function () {
				var a, b;
				return this.$wrapper.toggleClass(this.options.baseClass + "-inverse"), b = this.$on.clone(!0), a = this.$off.clone(!0), this.$on.replaceWith(a), this.$off.replaceWith(b), this.$on = a, this.$off = b, this.options.inverse = !this.options.inverse, this.$element
			}, a.prototype.onColor = function (a) {
				var b;
				return b = this.options.onColor, "undefined" == typeof a ? b : (null != b && this.$on.removeClass(this.options.baseClass + "-" + b), this.$on.addClass(this.options.baseClass + "-" + a), this.options.onColor = a, this.$element)
			}, a.prototype.offColor = function (a) {
				var b;
				return b = this.options.offColor, "undefined" == typeof a ? b : (null != b && this.$off.removeClass(this.options.baseClass + "-" + b), this.$off.addClass(this.options.baseClass + "-" + a), this.options.offColor = a, this.$element)
			}, a.prototype.onText = function (a) {
				return "undefined" == typeof a ? this.options.onText : (this.$on.html(a), this._width(), this._containerPosition(), this.options.onText = a, this.$element)
			}, a.prototype.offText = function (a) {
				return "undefined" == typeof a ? this.options.offText : (this.$off.html(a), this._width(), this._containerPosition(), this.options.offText = a, this.$element)
			}, a.prototype.labelText = function (a) {
				return "undefined" == typeof a ? this.options.labelText : (this.$label.html(a), this._width(), this.options.labelText = a, this.$element)
			}, a.prototype.handleWidth = function (a) {
				return "undefined" == typeof a ? this.options.handleWidth : (this.options.handleWidth = a, this._width(), this._containerPosition(), this.$element)
			}, a.prototype.labelWidth = function (a) {
				return "undefined" == typeof a ? this.options.labelWidth : (this.options.labelWidth = a, this._width(), this._containerPosition(), this.$element)
			}, a.prototype.baseClass = function () {
				return this.options.baseClass
			}, a.prototype.wrapperClass = function (a) {
				return "undefined" == typeof a ? this.options.wrapperClass : (a || (a = b.fn.bootstrapSwitch.defaults.wrapperClass), this.$wrapper.removeClass(this._getClasses(this.options.wrapperClass).join(" ")), this.$wrapper.addClass(this._getClasses(a).join(" ")), this.options.wrapperClass = a, this.$element)
			}, a.prototype.radioAllOff = function (a) {
				return "undefined" == typeof a ? this.options.radioAllOff : (a = !!a, a === this.options.radioAllOff ? this.$element : (this.options.radioAllOff = a, this.$element))
			}, a.prototype.onInit = function (a) {
				return "undefined" == typeof a ? this.options.onInit : (a || (a = b.fn.bootstrapSwitch.defaults.onInit), this.options.onInit = a, this.$element)
			}, a.prototype.onSwitchChange = function (a) {
				return "undefined" == typeof a ? this.options.onSwitchChange : (a || (a = b.fn.bootstrapSwitch.defaults.onSwitchChange), this.options.onSwitchChange = a, this.$element)
			}, a.prototype.destroy = function () {
				var a;
				return a = this.$element.closest("form"), a.length && a.off("reset.bootstrapSwitch").removeData("bootstrap-switch"), this.$container.children().not(this.$element).remove(), this.$element.unwrap().unwrap().off(".bootstrapSwitch").removeData("bootstrap-switch"), this.$element
			}, a.prototype._width = function () {
				var a, b;
				return a = this.$on.add(this.$off), a.add(this.$label).css("width", ""), b = "auto" === this.options.handleWidth ? Math.max(this.$on.width(), this.$off.width()) : this.options.handleWidth, a.width(b), this.$label.width(function (a) {
					return function (c, d) {
						return "auto" !== a.options.labelWidth ? a.options.labelWidth : b > d ? b : d
					}
				}(this)), this._handleWidth = this.$on.outerWidth(), this._labelWidth = this.$label.outerWidth(), this.$container.width(2 * this._handleWidth + this._labelWidth), this.$wrapper.width(this._handleWidth + this._labelWidth)
			}, a.prototype._containerPosition = function (a, b) {
				return null == a && (a = this.options.state), this.$container.css("margin-left", function (b) {
					return function () {
						var c;
						return c = [0, "-" + b._handleWidth + "px"], b.options.indeterminate ? "-" + b._handleWidth / 2 + "px" : a ? b.options.inverse ? c[1] : c[0] : b.options.inverse ? c[0] : c[1]
					}
				}(this)), b ? setTimeout(function () {
					return b()
				}, 50) : void 0
			}, a.prototype._init = function () {
				var a, b;
				return a = function (a) {
					return function () {
						return a.setPrevOptions(), a._width(), a._containerPosition(null, function () {
							return a.options.animate ? a.$wrapper.addClass(a.options.baseClass + "-animate") : void 0
						})
					}
				}(this), this.$wrapper.is(":visible") ? a() : b = c.setInterval(function (d) {
					return function () {
						return d.$wrapper.is(":visible") ? (a(), c.clearInterval(b)) : void 0
					}
				}(this), 50)
			}, a.prototype._elementHandlers = function () {
				return this.$element.on({
					"setPreviousOptions.bootstrapSwitch": function (a) {
						return function () {
							return a.setPrevOptions()
						}
					}(this),
					"previousState.bootstrapSwitch": function (a) {
						return function () {
							return a.options = a.prevOptions, a.options.indeterminate && a.$wrapper.addClass(a.options.baseClass + "-indeterminate"), a.$element.prop("checked", a.options.state).trigger("change.bootstrapSwitch", !0)
						}
					}(this),
					"change.bootstrapSwitch": function (a) {
						return function (c, d) {
							var e;
							return c.preventDefault(), c.stopImmediatePropagation(), e = a.$element.is(":checked"), a._containerPosition(e), e !== a.options.state ? (a.options.state = e, a.$wrapper.toggleClass(a.options.baseClass + "-off").toggleClass(a.options.baseClass + "-on"), d ? void 0 : (a.$element.is(":radio") && b("[name='" + a.$element.attr("name") + "']").not(a.$element).prop("checked", !1).trigger("change.bootstrapSwitch", !0), a.$element.trigger("switchChange.bootstrapSwitch", [e]))) : void 0
						}
					}(this),
					"focus.bootstrapSwitch": function (a) {
						return function (b) {
							return b.preventDefault(), a.$wrapper.addClass(a.options.baseClass + "-focused")
						}
					}(this),
					"blur.bootstrapSwitch": function (a) {
						return function (b) {
							return b.preventDefault(), a.$wrapper.removeClass(a.options.baseClass + "-focused")
						}
					}(this),
					"keydown.bootstrapSwitch": function (a) {
						return function (b) {
							if (b.which && !a.options.disabled && !a.options.readonly) switch (b.which) {
								case 37:
									return b.preventDefault(), b.stopImmediatePropagation(), a.state(!1);
								case 39:
									return b.preventDefault(), b.stopImmediatePropagation(), a.state(!0)
							}
						}
					}(this)
				})
			}, a.prototype._handleHandlers = function () {
				return this.$on.on("click.bootstrapSwitch", function (a) {
					return function (b) {
						return b.preventDefault(), b.stopPropagation(), a.state(!1), a.$element.trigger("focus.bootstrapSwitch")
					}
				}(this)), this.$off.on("click.bootstrapSwitch", function (a) {
					return function (b) {
						return b.preventDefault(), b.stopPropagation(), a.state(!0), a.$element.trigger("focus.bootstrapSwitch")
					}
				}(this))
			}, a.prototype._labelHandlers = function () {
				return this.$label.on({
					click: function (a) {
						return a.stopPropagation()
					},
					"mousedown.bootstrapSwitch touchstart.bootstrapSwitch": function (a) {
						return function (b) {
							return a._dragStart || a.options.disabled || a.options.readonly ? void 0 : (b.preventDefault(), b.stopPropagation(), a._dragStart = (b.pageX || b.originalEvent.touches[0].pageX) - parseInt(a.$container.css("margin-left"), 10), a.options.animate && a.$wrapper.removeClass(a.options.baseClass + "-animate"), a.$element.trigger("focus.bootstrapSwitch"))
						}
					}(this),
					"mousemove.bootstrapSwitch touchmove.bootstrapSwitch": function (a) {
						return function (b) {
							var c;
							if (null != a._dragStart && (b.preventDefault(), c = (b.pageX || b.originalEvent.touches[0].pageX) - a._dragStart, !(c < -a._handleWidth || c > 0))) return a._dragEnd = c, a.$container.css("margin-left", a._dragEnd + "px")
						}
					}(this),
					"mouseup.bootstrapSwitch touchend.bootstrapSwitch": function (a) {
						return function (b) {
							var c;
							if (a._dragStart) return b.preventDefault(), a.options.animate && a.$wrapper.addClass(a.options.baseClass + "-animate"), a._dragEnd ? (c = a._dragEnd > -(a._handleWidth / 2), a._dragEnd = !1, a.state(a.options.inverse ? !c : c)) : a.state(!a.options.state), a._dragStart = !1
						}
					}(this),
					"mouseleave.bootstrapSwitch": function (a) {
						return function () {
							return a.$label.trigger("mouseup.bootstrapSwitch")
						}
					}(this)
				})
			}, a.prototype._externalLabelHandler = function () {
				var a;
				return a = this.$element.closest("label"), a.on("click", function (b) {
					return function (c) {
						return c.preventDefault(), c.stopImmediatePropagation(), c.target === a[0] ? b.toggleState() : void 0
					}
				}(this))
			}, a.prototype._formHandler = function () {
				var a;
				return a = this.$element.closest("form"), a.data("bootstrap-switch") ? void 0 : a.on("reset.bootstrapSwitch", function () {
					return c.setTimeout(function () {
						return a.find("input").filter(function () {
							return b(this).data("bootstrap-switch")
						}).each(function () {
							return b(this).bootstrapSwitch("state", this.checked)
						})
					}, 1)
				}).data("bootstrap-switch", !0)
			}, a.prototype._getClasses = function (a) {
				var c, d, e, f;
				if (!b.isArray(a)) return [this.options.baseClass + "-" + a];
				for (d = [], e = 0, f = a.length; f > e; e++) c = a[e], d.push(this.options.baseClass + "-" + c);
				return d
			}, a
		}(), b.fn.bootstrapSwitch = function () {
			var c, e, f;
			return e = arguments[0], c = 2 <= arguments.length ? a.call(arguments, 1) : [], f = this, this.each(function () {
				var a, g;
				return a = b(this), g = a.data("bootstrap-switch"), g || a.data("bootstrap-switch", g = new d(this, e)), "string" == typeof e ? f = g[e].apply(g, c) : void 0
			}), f
		}, b.fn.bootstrapSwitch.Constructor = d, b.fn.bootstrapSwitch.defaults = {
			state: !0,
			size: null,
			animate: !0,
			disabled: !1,
			readonly: !1,
			indeterminate: !1,
			inverse: !1,
			radioAllOff: !1,
			onColor: "primary",
			offColor: "default",
			onText: "ON",
			offText: "OFF",
			labelText: "&nbsp;",
			handleWidth: "auto",
			labelWidth: "auto",
			baseClass: "bootstrap-switch",
			wrapperClass: "wrapper",
			onInit: function () {},
			onSwitchChange: function () {}
		}
	}(window.jQuery, window)
}.call(this),
	function (a) {
		"function" == typeof define && define.amd ? define(["jquery"], a) : a(jQuery)
	}(function (a) {
		function b() {
			var a = document.getElementsByTagName("script"),
				b = a[a.length - 1].src.split("?")[0];
			return b.split("/").length > 0 ? b.split("/").slice(0, -1).join("/") + "/" : ""
		}

		function c(a, b, c) {
			for (var d = 0; d < b.length; d++) c(a, b[d])
		}
		var d = !1,
			e = !1,
			f = 5e3,
			g = 2e3,
			h = 0,
			i = a,
			j = ["ms", "moz", "webkit", "o"],
			k = window.requestAnimationFrame || !1,
			l = window.cancelAnimationFrame || !1;
		if (!k)
			for (var m in j) {
				var n = j[m];
				k || (k = window[n + "RequestAnimationFrame"]), l || (l = window[n + "CancelAnimationFrame"] || window[n + "CancelRequestAnimationFrame"])
			}
		var o = window.MutationObserver || window.WebKitMutationObserver || !1,
			p = {
				zindex: "auto",
				cursoropacitymin: 0,
				cursoropacitymax: 1,
				cursorcolor: "#424242",
				cursorwidth: "5px",
				cursorborder: "1px solid #fff",
				cursorborderradius: "5px",
				scrollspeed: 40,
				mousescrollstep: 24,
				touchbehavior: !1,
				hwacceleration: !0,
				usetransition: !0,
				boxzoom: !1,
				dblclickzoom: !0,
				gesturezoom: !0,
				grabcursorenabled: !0,
				autohidemode: !0,
				background: "",
				iframeautoresize: !0,
				cursorminheight: 32,
				preservenativescrolling: !0,
				railoffset: !1,
				bouncescroll: !0,
				spacebarenabled: !0,
				railpadding: {
					top: 0,
					right: 0,
					left: 0,
					bottom: 0
				},
				disableoutline: !0,
				horizrailenabled: !0,
				railalign: "right",
				railvalign: "bottom",
				enabletranslate3d: !0,
				enablemousewheel: !0,
				enablekeyboard: !0,
				smoothscroll: !0,
				sensitiverail: !0,
				enablemouselockapi: !0,
				cursorfixedheight: !1,
				directionlockdeadzone: 6,
				hidecursordelay: 400,
				nativeparentscrolling: !0,
				enablescrollonselection: !0,
				overflowx: !0,
				overflowy: !0,
				cursordragspeed: .3,
				rtlmode: "auto",
				cursordragontouch: !1,
				oneaxismousemode: "auto",
				scriptpath: b()
			},
			q = !1,
			r = function () {
				function a() {
					var a = ["-moz-grab", "-webkit-grab", "grab"];
					(c.ischrome && !c.ischrome22 || c.isie) && (a = []);
					for (var d = 0; d < a.length; d++) {
						var e = a[d];
						if (b.style.cursor = e, b.style.cursor == e) return e
					}
					return "url(http://www.google.com/intl/en_ALL/mapfiles/openhand.cur),n-resize"
				}
				if (q) return q;
				var b = document.createElement("DIV"),
					c = {};
				c.haspointerlock = "pointerLockElement" in document || "mozPointerLockElement" in document || "webkitPointerLockElement" in document, c.isopera = "opera" in window, c.isopera12 = c.isopera && "getUserMedia" in navigator, c.isoperamini = "[object OperaMini]" === Object.prototype.toString.call(window.operamini), c.isie = "all" in document && "attachEvent" in b && !c.isopera, c.isieold = c.isie && !("msInterpolationMode" in b.style), c.isie7 = !(!c.isie || c.isieold || "documentMode" in document && 7 != document.documentMode), c.isie8 = c.isie && "documentMode" in document && 8 == document.documentMode, c.isie9 = c.isie && "performance" in window && document.documentMode >= 9, c.isie10 = c.isie && "performance" in window && document.documentMode >= 10, c.isie9mobile = /iemobile.9/i.test(navigator.userAgent), c.isie9mobile && (c.isie9 = !1), c.isie7mobile = !c.isie9mobile && c.isie7 && /iemobile/i.test(navigator.userAgent), c.ismozilla = "MozAppearance" in b.style, c.iswebkit = "WebkitAppearance" in b.style, c.ischrome = "chrome" in window, c.ischrome22 = c.ischrome && c.haspointerlock, c.ischrome26 = c.ischrome && "transition" in b.style, c.cantouch = "ontouchstart" in document.documentElement || "ontouchstart" in window, c.hasmstouch = window.navigator.msPointerEnabled || !1, c.ismac = /^mac$/i.test(navigator.platform), c.isios = c.cantouch && /iphone|ipad|ipod/i.test(navigator.platform), c.isios4 = c.isios && !("seal" in Object), c.isandroid = /android/i.test(navigator.userAgent), c.trstyle = !1, c.hastransform = !1, c.hastranslate3d = !1, c.transitionstyle = !1, c.hastransition = !1, c.transitionend = !1;
				for (var d = ["transform", "msTransform", "webkitTransform", "MozTransform", "OTransform"], e = 0; e < d.length; e++)
					if ("undefined" != typeof b.style[d[e]]) {
						c.trstyle = d[e];
						break
					}
				c.hastransform = 0 != c.trstyle, c.hastransform && (b.style[c.trstyle] = "translate3d(1px,2px,3px)", c.hastranslate3d = /translate3d/.test(b.style[c.trstyle])), c.transitionstyle = !1, c.prefixstyle = "", c.transitionend = !1;
				for (var d = ["transition", "webkitTransition", "MozTransition", "OTransition", "OTransition", "msTransition", "KhtmlTransition"], f = ["", "-webkit-", "-moz-", "-o-", "-o", "-ms-", "-khtml-"], g = ["transitionend", "webkitTransitionEnd", "transitionend", "otransitionend", "oTransitionEnd", "msTransitionEnd", "KhtmlTransitionEnd"], e = 0; e < d.length; e++)
					if (d[e] in b.style) {
						c.transitionstyle = d[e], c.prefixstyle = f[e], c.transitionend = g[e];
						break
					}
				return c.ischrome26 && (c.prefixstyle = f[1]), c.hastransition = c.transitionstyle, c.cursorgrabvalue = a(), c.hasmousecapture = "setCapture" in b, c.hasMutationObserver = o !== !1, b = null, q = c, c
			},
			s = function (a, b) {
				function c() {
					var a = s.doc.css(v.trstyle);
					return a && "matrix" == a.substr(0, 6) ? a.replace(/^.*\((.*)\)$/g, "$1").replace(/px/g, "").split(/, +/) : !1
				}

				function j() {
					var a = s.win;
					if ("zIndex" in a) return a.zIndex();
					for (; a.length > 0;) {
						if (9 == a[0].nodeType) return !1;
						var b = a.css("zIndex");
						if (!isNaN(b) && 0 != b) return parseInt(b);
						a = a.parent()
					}
					return !1
				}

				function m(a, b, c) {
					var d = a.css(b),
						e = parseFloat(d);
					if (isNaN(e)) {
						e = y[d] || 0;
						var f = 3 == e ? c ? s.win.outerHeight() - s.win.innerHeight() : s.win.outerWidth() - s.win.innerWidth() : 1;
						return s.isie8 && e && (e += 1), f ? e : 0
					}
					return e
				}

				function n(a, b, c, d) {
					s._bind(a, b, function (d) {
						var d = d ? d : window.event,
							e = {
								original: d,
								target: d.target || d.srcElement,
								type: "wheel",
								deltaMode: "MozMousePixelScroll" == d.type ? 0 : 1,
								deltaX: 0,
								deltaZ: 0,
								preventDefault: function () {
									return d.preventDefault ? d.preventDefault() : d.returnValue = !1, !1
								},
								stopImmediatePropagation: function () {
									d.stopImmediatePropagation ? d.stopImmediatePropagation() : d.cancelBubble = !0
								}
							};
						return "mousewheel" == b ? (e.deltaY = -1 / 40 * d.wheelDelta, d.wheelDeltaX && (e.deltaX = -1 / 40 * d.wheelDeltaX)) : e.deltaY = d.detail, c.call(a, e)
					}, d)
				}

				function q(a, b, c) {
					var d, e;
					if (0 == a.deltaMode ? (d = -Math.floor(a.deltaX * (s.opt.mousescrollstep / 54)), e = -Math.floor(a.deltaY * (s.opt.mousescrollstep / 54))) : 1 == a.deltaMode && (d = -Math.floor(a.deltaX * s.opt.mousescrollstep), e = -Math.floor(a.deltaY * s.opt.mousescrollstep)), b && s.opt.oneaxismousemode && 0 == d && e && (d = e, e = 0), d && (s.scrollmom && s.scrollmom.stop(), s.lastdeltax += d, s.debounced("mousewheelx", function () {
							var a = s.lastdeltax;
							s.lastdeltax = 0, s.rail.drag || s.doScrollLeftBy(a)
						}, 15)), e) {
						if (s.opt.nativeparentscrolling && c && !s.ispage && !s.zoomactive)
							if (0 > e) {
								if (s.getScrollTop() >= s.page.maxh) return !0
							} else if (s.getScrollTop() <= 0) return !0;
						s.scrollmom && s.scrollmom.stop(), s.lastdeltay += e, s.debounced("mousewheely", function () {
							var a = s.lastdeltay;
							s.lastdeltay = 0, s.rail.drag || s.doScrollBy(a)
						}, 15)
					}
					return a.stopImmediatePropagation(), a.preventDefault()
				}
				var s = this;
				if (this.version = "3.5.4", this.name = "nicescroll", this.me = b, this.opt = {
						doc: i("body"),
						win: !1
					}, i.extend(this.opt, p), this.opt.snapbackspeed = 80, a)
					for (var u in s.opt) "undefined" != typeof a[u] && (s.opt[u] = a[u]);
				this.doc = s.opt.doc, this.iddoc = this.doc && this.doc[0] ? this.doc[0].id || "" : "", this.ispage = /^BODY|HTML/.test(s.opt.win ? s.opt.win[0].nodeName : this.doc[0].nodeName), this.haswrapper = s.opt.win !== !1, this.win = s.opt.win || (this.ispage ? i(window) : this.doc), this.docscroll = this.ispage && !this.haswrapper ? i(window) : this.win, this.body = i("body"), this.viewport = !1, this.isfixed = !1, this.iframe = !1, this.isiframe = "IFRAME" == this.doc[0].nodeName && "IFRAME" == this.win[0].nodeName, this.istextarea = "TEXTAREA" == this.win[0].nodeName, this.forcescreen = !1, this.canshowonmouseevent = "scroll" != s.opt.autohidemode, this.onmousedown = !1, this.onmouseup = !1, this.onmousemove = !1, this.onmousewheel = !1, this.onkeypress = !1, this.ongesturezoom = !1, this.onclick = !1, this.onscrollstart = !1, this.onscrollend = !1, this.onscrollcancel = !1, this.onzoomin = !1, this.onzoomout = !1, this.view = !1, this.page = !1, this.scroll = {
					x: 0,
					y: 0
				}, this.scrollratio = {
					x: 0,
					y: 0
				}, this.cursorheight = 20, this.scrollvaluemax = 0, this.isrtlmode = !1, this.scrollrunning = !1, this.scrollmom = !1, this.observer = !1, this.observerremover = !1;
				do this.id = "ascrail" + g++; while (document.getElementById(this.id));
				this.rail = !1, this.cursor = !1, this.cursorfreezed = !1, this.selectiondrag = !1, this.zoom = !1, this.zoomactive = !1, this.hasfocus = !1, this.hasmousefocus = !1, this.visibility = !0, this.locked = !1, this.hidden = !1, this.cursoractive = !0, this.wheelprevented = !1, this.overflowx = s.opt.overflowx, this.overflowy = s.opt.overflowy, this.nativescrollingarea = !1, this.checkarea = 0, this.events = [], this.saved = {}, this.delaylist = {}, this.synclist = {}, this.lastdeltax = 0, this.lastdeltay = 0, this.detected = r();
				var v = i.extend({}, this.detected);
				this.canhwscroll = v.hastransform && s.opt.hwacceleration, this.ishwscroll = this.canhwscroll && s.haswrapper, this.istouchcapable = !1, v.cantouch && v.ischrome && !v.isios && !v.isandroid && (this.istouchcapable = !0, v.cantouch = !1), v.cantouch && v.ismozilla && !v.isios && !v.isandroid && (this.istouchcapable = !0, v.cantouch = !1), s.opt.enablemouselockapi || (v.hasmousecapture = !1, v.haspointerlock = !1), this.delayed = function (a, b, c, d) {
					var e = s.delaylist[a],
						f = (new Date).getTime();
					return !d && e && e.tt ? !1 : (e && e.tt && clearTimeout(e.tt), void(e && e.last + c > f && !e.tt ? s.delaylist[a] = {
						last: f + c,
						tt: setTimeout(function () {
							s && (s.delaylist[a].tt = 0, b.call())
						}, c)
					} : e && e.tt || (s.delaylist[a] = {
						last: f,
						tt: 0
					}, setTimeout(function () {
						b.call()
					}, 0))))
				}, this.debounced = function (a, b, c) {
					{
						var d = s.delaylist[a];
						(new Date).getTime()
					}
					s.delaylist[a] = b, d || setTimeout(function () {
						var b = s.delaylist[a];
						s.delaylist[a] = !1, b.call()
					}, c)
				};
				var w = !1;
				if (this.synched = function (a, b) {
						function c() {
							w || (k(function () {
								w = !1;
								for (a in s.synclist) {
									var b = s.synclist[a];
									b && b.call(s), s.synclist[a] = !1
								}
							}), w = !0)
						}
						return s.synclist[a] = b, c(), a
					}, this.unsynched = function (a) {
						s.synclist[a] && (s.synclist[a] = !1)
					}, this.css = function (a, b) {
						for (var c in b) s.saved.css.push([a, c, a.css(c)]), a.css(c, b[c])
					}, this.scrollTop = function (a) {
						return "undefined" == typeof a ? s.getScrollTop() : s.setScrollTop(a)
					}, this.scrollLeft = function (a) {
						return "undefined" == typeof a ? s.getScrollLeft() : s.setScrollLeft(a)
					}, BezierClass = function (a, b, c, d, e, f, g) {
						this.st = a, this.ed = b, this.spd = c, this.p1 = d || 0, this.p2 = e || 1, this.p3 = f || 0, this.p4 = g || 1, this.ts = (new Date).getTime(), this.df = this.ed - this.st
					}, BezierClass.prototype = {
						B2: function (a) {
							return 3 * a * a * (1 - a)
						},
						B3: function (a) {
							return 3 * a * (1 - a) * (1 - a)
						},
						B4: function (a) {
							return (1 - a) * (1 - a) * (1 - a)
						},
						getNow: function () {
							var a = (new Date).getTime(),
								b = 1 - (a - this.ts) / this.spd,
								c = this.B2(b) + this.B3(b) + this.B4(b);
							return 0 > b ? this.ed : this.st + Math.round(this.df * c)
						},
						update: function (a, b) {
							return this.st = this.getNow(), this.ed = a, this.spd = b, this.ts = (new Date).getTime(), this.df = this.ed - this.st, this
						}
					}, this.ishwscroll) {
					this.doc.translate = {
						x: 0,
						y: 0,
						tx: "0px",
						ty: "0px"
					}, v.hastranslate3d && v.isios && this.doc.css("-webkit-backface-visibility", "hidden"), this.getScrollTop = function (a) {
						if (!a) {
							var b = c();
							if (b) return 16 == b.length ? -b[13] : -b[5];
							if (s.timerscroll && s.timerscroll.bz) return s.timerscroll.bz.getNow()
						}
						return s.doc.translate.y
					}, this.getScrollLeft = function (a) {
						if (!a) {
							var b = c();
							if (b) return 16 == b.length ? -b[12] : -b[4];
							if (s.timerscroll && s.timerscroll.bh) return s.timerscroll.bh.getNow()
						}
						return s.doc.translate.x
					}, this.notifyScrollEvent = document.createEvent ? function (a) {
						var b = document.createEvent("UIEvents");
						b.initUIEvent("scroll", !1, !0, window, 1), a.dispatchEvent(b)
					} : document.fireEvent ? function (a) {
						var b = document.createEventObject();
						a.fireEvent("onscroll"), b.cancelBubble = !0
					} : function () {};
					var x = -1;
					v.hastranslate3d && s.opt.enabletranslate3d ? (this.setScrollTop = function (a, b) {
						s.doc.translate.y = a, s.doc.translate.ty = -1 * a + "px", s.doc.css(v.trstyle, "translate3d(" + s.doc.translate.tx + "," + s.doc.translate.ty + ",0px)"), b || s.notifyScrollEvent(s.win[0])
					}, this.setScrollLeft = function (a, b) {
						s.doc.translate.x = a, s.doc.translate.tx = a * x + "px", s.doc.css(v.trstyle, "translate3d(" + s.doc.translate.tx + "," + s.doc.translate.ty + ",0px)"), b || s.notifyScrollEvent(s.win[0])
					}) : (this.setScrollTop = function (a, b) {
						s.doc.translate.y = a, s.doc.translate.ty = -1 * a + "px", s.doc.css(v.trstyle, "translate(" + s.doc.translate.tx + "," + s.doc.translate.ty + ")"), b || s.notifyScrollEvent(s.win[0])
					}, this.setScrollLeft = function (a, b) {
						s.doc.translate.x = a, s.doc.translate.tx = a * x + "px", s.doc.css(v.trstyle, "translate(" + s.doc.translate.tx + "," + s.doc.translate.ty + ")"), b || s.notifyScrollEvent(s.win[0])
					})
				} else this.getScrollTop = function () {
					return s.docscroll.scrollTop()
				}, this.setScrollTop = function (a) {
					return s.docscroll.scrollTop(a)
				}, this.getScrollLeft = function () {
					return s.docscroll.scrollLeft()
				}, this.setScrollLeft = function (a) {
					return s.docscroll.scrollLeft(a)
				};
				this.getTarget = function (a) {
					return a ? a.target ? a.target : a.srcElement ? a.srcElement : !1 : !1
				}, this.hasParent = function (a, b) {
					if (!a) return !1;
					for (var c = a.target || a.srcElement || a || !1; c && c.id != b;) c = c.parentNode || !1;
					return c !== !1
				};
				var y = {
					thin: 1,
					medium: 3,
					thick: 5
				};
				this.getOffset = function () {
					if (s.isfixed) return {
						top: parseFloat(s.win.css("top")),
						left: parseFloat(s.win.css("left"))
					};
					if (!s.viewport) return s.win.offset();
					var a = s.win.offset(),
						b = s.viewport.offset();
					return {
						top: a.top - b.top + s.viewport.scrollTop(),
						left: a.left - b.left + s.viewport.scrollLeft()
					}
				}, this.updateScrollBar = function (a) {
					if (s.ishwscroll) s.rail.css({
						height: s.win.innerHeight()
					}), s.railh && s.railh.css({
						width: s.win.innerWidth()
					});
					else {
						var b = s.getOffset(),
							c = {
								top: b.top,
								left: b.left
							};
						c.top += m(s.win, "border-top-width", !0); {
							(s.win.outerWidth() - s.win.innerWidth()) / 2
						}
						c.left += s.rail.align ? s.win.outerWidth() - m(s.win, "border-right-width") - s.rail.width : m(s.win, "border-left-width");
						var d = s.opt.railoffset;
						if (d && (d.top && (c.top += d.top), s.rail.align && d.left && (c.left += d.left)), s.locked || s.rail.css({
								top: c.top,
								left: c.left,
								height: a ? a.h : s.win.innerHeight()
							}), s.zoom && s.zoom.css({
								top: c.top + 1,
								left: 1 == s.rail.align ? c.left - 20 : c.left + s.rail.width + 4
							}), s.railh && !s.locked) {
							var c = {
									top: b.top,
									left: b.left
								},
								e = s.railh.align ? c.top + m(s.win, "border-top-width", !0) + s.win.innerHeight() - s.railh.height : c.top + m(s.win, "border-top-width", !0),
								f = c.left + m(s.win, "border-left-width");
							s.railh.css({
								top: e,
								left: f,
								width: s.railh.width
							})
						}
					}
				}, this.doRailClick = function (a, b, c) {
					var d, e, f, g;
					s.locked || (s.cancelEvent(a), b ? (d = c ? s.doScrollLeft : s.doScrollTop, f = c ? (a.pageX - s.railh.offset().left - s.cursorwidth / 2) * s.scrollratio.x : (a.pageY - s.rail.offset().top - s.cursorheight / 2) * s.scrollratio.y, d(f)) : (d = c ? s.doScrollLeftBy : s.doScrollBy, f = c ? s.scroll.x : s.scroll.y, g = c ? a.pageX - s.railh.offset().left : a.pageY - s.rail.offset().top, e = c ? s.view.w : s.view.h, d(f >= g ? e : -e)))
				}, s.hasanimationframe = k, s.hascancelanimationframe = l, s.hasanimationframe ? s.hascancelanimationframe || (l = function () {
					s.cancelAnimationFrame = !0
				}) : (k = function (a) {
					return setTimeout(a, 15 - Math.floor(+new Date / 1e3) % 16)
				}, l = clearInterval), this.init = function () {
					function a(b) {
						if (s.selectiondrag) {
							if (b) {
								var c = s.win.outerHeight(),
									d = b.pageY - s.selectiondrag.top;
								d > 0 && c > d && (d = 0), d >= c && (d -= c), s.selectiondrag.df = d
							}
							if (0 != s.selectiondrag.df) {
								var e = 2 * -Math.floor(s.selectiondrag.df / 6);
								s.doScrollBy(e), s.debounced("doselectionscroll", function () {
									a()
								}, 50)
							}
						}
					}

					function b() {
						s.iframexd = !1;
						try {
							{
								var a = "contentDocument" in this ? this.contentDocument : this.contentWindow.document;
								a.domain
							}
						} catch (b) {
							s.iframexd = !0, a = !1
						}
						if (s.iframexd) return "console" in window && console.log("NiceScroll error: policy restriced iframe"), !0;
						if (s.forcescreen = !0, s.isiframe && (s.iframe = {
								doc: i(a),
								html: s.doc.contents().find("html")[0],
								body: s.doc.contents().find("body")[0]
							}, s.getContentSize = function () {
								return {
									w: Math.max(s.iframe.html.scrollWidth, s.iframe.body.scrollWidth),
									h: Math.max(s.iframe.html.scrollHeight, s.iframe.body.scrollHeight)
								}
							}, s.docscroll = i(s.iframe.body)), !v.isios && s.opt.iframeautoresize && !s.isiframe) {
							s.win.scrollTop(0), s.doc.height("");
							var c = Math.max(a.getElementsByTagName("html")[0].scrollHeight, a.body.scrollHeight);
							s.doc.height(c)
						}
						s.lazyResize(30), v.isie7 && s.css(i(s.iframe.html), {
							"overflow-y": "hidden"
						}), s.css(i(s.iframe.body), {
							"overflow-y": "hidden"
						}), v.isios && s.haswrapper && s.css(i(a.body), {
							"-webkit-transform": "translate3d(0,0,0)"
						}), "contentWindow" in this ? s.bind(this.contentWindow, "scroll", s.onscroll) : s.bind(a, "scroll", s.onscroll), s.opt.enablemousewheel && s.bind(a, "mousewheel", s.onmousewheel), s.opt.enablekeyboard && s.bind(a, v.isopera ? "keypress" : "keydown", s.onkeypress), (v.cantouch || s.opt.touchbehavior) && (s.bind(a, "mousedown", s.ontouchstart), s.bind(a, "mousemove", function (a) {
							s.ontouchmove(a, !0)
						}), s.opt.grabcursorenabled && v.cursorgrabvalue && s.css(i(a.body), {
							cursor: v.cursorgrabvalue
						})), s.bind(a, "mouseup", s.ontouchend), s.zoom && (s.opt.dblclickzoom && s.bind(a, "dblclick", s.doZoom), s.ongesturezoom && s.bind(a, "gestureend", s.ongesturezoom))
					}
					if (s.saved.css = [], v.isie7mobile) return !0;
					if (v.isoperamini) return !0;
					if (v.hasmstouch && s.css(s.ispage ? i("html") : s.win, {
							"-ms-touch-action": "none"
						}), s.zindex = "auto", s.zindex = s.ispage || "auto" != s.opt.zindex ? s.opt.zindex : j() || "auto", s.ispage || "auto" == s.zindex || s.zindex > h && (h = s.zindex), s.isie && 0 == s.zindex && "auto" == s.opt.zindex && (s.zindex = "auto"), !s.ispage || !v.cantouch && !v.isieold && !v.isie9mobile) {
						var c = s.docscroll;
						s.ispage && (c = s.haswrapper ? s.win : s.doc), v.isie9mobile || s.css(c, {
							"overflow-y": "hidden"
						}), s.ispage && v.isie7 && ("BODY" == s.doc[0].nodeName ? s.css(i("html"), {
							"overflow-y": "hidden"
						}) : "HTML" == s.doc[0].nodeName && s.css(i("body"), {
							"overflow-y": "hidden"
						})), !v.isios || s.ispage || s.haswrapper || s.css(i("body"), {
							"-webkit-overflow-scrolling": "touch"
						});
						var g = i(document.createElement("div"));
						g.css({
							position: "relative",
							top: 0,
							"float": "right",
							width: s.opt.cursorwidth,
							height: "0px",
							"background-color": s.opt.cursorcolor,
							border: s.opt.cursorborder,
							"background-clip": "padding-box",
							"-webkit-border-radius": s.opt.cursorborderradius,
							"-moz-border-radius": s.opt.cursorborderradius,
							"border-radius": s.opt.cursorborderradius
						}), g.hborder = parseFloat(g.outerHeight() - g.innerHeight()), s.cursor = g;
						var k = i(document.createElement("div"));
						k.attr("id", s.id), k.addClass("nicescroll-rails");
						var l, m, n = ["left", "right"];
						for (var p in n) m = n[p], l = s.opt.railpadding[m], l ? k.css("padding-" + m, l + "px") : s.opt.railpadding[m] = 0;
						k.append(g), k.width = Math.max(parseFloat(s.opt.cursorwidth), g.outerWidth()) + s.opt.railpadding.left + s.opt.railpadding.right, k.css({
							width: k.width + "px",
							zIndex: s.zindex,
							background: s.opt.background,
							cursor: "default"
						}), k.visibility = !0, k.scrollable = !0, k.align = "left" == s.opt.railalign ? 0 : 1, s.rail = k, s.rail.drag = !1;
						var q = !1;
						if (!s.opt.boxzoom || s.ispage || v.isieold || (q = document.createElement("div"), s.bind(q, "click", s.doZoom), s.zoom = i(q), s.zoom.css({
								cursor: "pointer",
								"z-index": s.zindex,
								height: 18,
								width: 18,
								backgroundPosition: "0px 0px"
							}), s.opt.dblclickzoom && s.bind(s.win, "dblclick", s.doZoom), v.cantouch && s.opt.gesturezoom && (s.ongesturezoom = function (a) {
								return a.scale > 1.5 && s.doZoomIn(a), a.scale < .8 && s.doZoomOut(a), s.cancelEvent(a)
							}, s.bind(s.win, "gestureend", s.ongesturezoom))), s.railh = !1, s.opt.horizrailenabled) {
							s.css(c, {
								"overflow-x": "hidden"
							});
							var g = i(document.createElement("div"));
							g.css({
								position: "relative",
								top: 0,
								height: s.opt.cursorwidth,
								width: "0px",
								"background-color": s.opt.cursorcolor,
								border: s.opt.cursorborder,
								"background-clip": "padding-box",
								"-webkit-border-radius": s.opt.cursorborderradius,
								"-moz-border-radius": s.opt.cursorborderradius,
								"border-radius": s.opt.cursorborderradius
							}), g.wborder = parseFloat(g.outerWidth() - g.innerWidth()), s.cursorh = g;
							var r = i(document.createElement("div"));
							r.attr("id", s.id + "-hr"), r.addClass("nicescroll-rails"), r.height = Math.max(parseFloat(s.opt.cursorwidth), g.outerHeight()), r.css({
								height: r.height + "px",
								zIndex: s.zindex,
								background: s.opt.background
							}), r.append(g), r.visibility = !0, r.scrollable = !0, r.align = "top" == s.opt.railvalign ? 0 : 1, s.railh = r, s.railh.drag = !1
						}
						if (s.ispage) k.css({
							position: "fixed",
							top: "0px",
							height: "100%"
						}), k.css(k.align ? {
							right: "0px"
						} : {
							left: "0px"
						}), s.body.append(k), s.railh && (r.css({
							position: "fixed",
							left: "0px",
							width: "100%"
						}), r.css(r.align ? {
							bottom: "0px"
						} : {
							top: "0px"
						}), s.body.append(r));
						else {
							if (s.ishwscroll) {
								"static" == s.win.css("position") && s.css(s.win, {
									position: "relative"
								});
								var u = "HTML" == s.win[0].nodeName ? s.body : s.win;
								s.zoom && (s.zoom.css({
									position: "absolute",
									top: 1,
									right: 0,
									"margin-right": k.width + 4
								}), u.append(s.zoom)), k.css({
									position: "absolute",
									top: 0
								}), k.css(k.align ? {
									right: 0
								} : {
									left: 0
								}), u.append(k), r && (r.css({
									position: "absolute",
									left: 0,
									bottom: 0
								}), r.css(r.align ? {
									bottom: 0
								} : {
									top: 0
								}), u.append(r))
							} else {
								s.isfixed = "fixed" == s.win.css("position");
								var w = s.isfixed ? "fixed" : "absolute";
								s.isfixed || (s.viewport = s.getViewport(s.win[0])), s.viewport && (s.body = s.viewport, 0 == /fixed|relative|absolute/.test(s.viewport.css("position")) && s.css(s.viewport, {
									position: "relative"
								})), k.css({
									position: w
								}), s.zoom && s.zoom.css({
									position: w
								}), s.updateScrollBar(), s.body.append(k), s.zoom && s.body.append(s.zoom), s.railh && (r.css({
									position: w
								}), s.body.append(r))
							}
							v.isios && s.css(s.win, {
								"-webkit-tap-highlight-color": "rgba(0,0,0,0)",
								"-webkit-touch-callout": "none"
							}), v.isie && s.opt.disableoutline && s.win.attr("hideFocus", "true"), v.iswebkit && s.opt.disableoutline && s.win.css({
								outline: "none"
							})
						}
						if (s.opt.autohidemode === !1 ? (s.autohidedom = !1, s.rail.css({
								opacity: s.opt.cursoropacitymax
							}), s.railh && s.railh.css({
								opacity: s.opt.cursoropacitymax
							})) : s.opt.autohidemode === !0 || "leave" === s.opt.autohidemode ? (s.autohidedom = i().add(s.rail), v.isie8 && (s.autohidedom = s.autohidedom.add(s.cursor)), s.railh && (s.autohidedom = s.autohidedom.add(s.railh)), s.railh && v.isie8 && (s.autohidedom = s.autohidedom.add(s.cursorh))) : "scroll" == s.opt.autohidemode ? (s.autohidedom = i().add(s.rail), s.railh && (s.autohidedom = s.autohidedom.add(s.railh))) : "cursor" == s.opt.autohidemode ? (s.autohidedom = i().add(s.cursor), s.railh && (s.autohidedom = s.autohidedom.add(s.cursorh))) : "hidden" == s.opt.autohidemode && (s.autohidedom = !1, s.hide(), s.locked = !1), v.isie9mobile) {
							s.scrollmom = new t(s), s.onmangotouch = function () {
								var a = s.getScrollTop(),
									b = s.getScrollLeft();
								if (a == s.scrollmom.lastscrolly && b == s.scrollmom.lastscrollx) return !0;
								var c = a - s.mangotouch.sy,
									d = b - s.mangotouch.sx,
									e = Math.round(Math.sqrt(Math.pow(d, 2) + Math.pow(c, 2)));
								if (0 != e) {
									var f = 0 > c ? -1 : 1,
										g = 0 > d ? -1 : 1,
										h = +new Date;
									if (s.mangotouch.lazy && clearTimeout(s.mangotouch.lazy), h - s.mangotouch.tm > 80 || s.mangotouch.dry != f || s.mangotouch.drx != g) s.scrollmom.stop(), s.scrollmom.reset(b, a), s.mangotouch.sy = a, s.mangotouch.ly = a, s.mangotouch.sx = b, s.mangotouch.lx = b, s.mangotouch.dry = f, s.mangotouch.drx = g, s.mangotouch.tm = h;
									else {
										s.scrollmom.stop(), s.scrollmom.update(s.mangotouch.sx - d, s.mangotouch.sy - c); {
											h - s.mangotouch.tm
										}
										s.mangotouch.tm = h;
										var i = Math.max(Math.abs(s.mangotouch.ly - a), Math.abs(s.mangotouch.lx - b));
										s.mangotouch.ly = a, s.mangotouch.lx = b, i > 2 && (s.mangotouch.lazy = setTimeout(function () {
											s.mangotouch.lazy = !1, s.mangotouch.dry = 0, s.mangotouch.drx = 0, s.mangotouch.tm = 0, s.scrollmom.doMomentum(30)
										}, 100))
									}
								}
							};
							var x = s.getScrollTop(),
								y = s.getScrollLeft();
							s.mangotouch = {
								sy: x,
								ly: x,
								dry: 0,
								sx: y,
								lx: y,
								drx: 0,
								lazy: !1,
								tm: 0
							}, s.bind(s.docscroll, "scroll", s.onmangotouch)
						} else {
							if (v.cantouch || s.istouchcapable || s.opt.touchbehavior || v.hasmstouch) {
								s.scrollmom = new t(s), s.ontouchstart = function (a) {
									if (a.pointerType && 2 != a.pointerType) return !1;
									if (s.hasmoving = !1, !s.locked) {
										if (v.hasmstouch)
											for (var b = a.target ? a.target : !1; b;) {
												var c = i(b).getNiceScroll();
												if (c.length > 0 && c[0].me == s.me) break;
												if (c.length > 0) return !1;
												if ("DIV" == b.nodeName && b.id == s.id) break;
												b = b.parentNode ? b.parentNode : !1
											}
										s.cancelScroll();
										var b = s.getTarget(a);
										if (b) {
											var d = /INPUT/i.test(b.nodeName) && /range/i.test(b.type);
											if (d) return s.stopPropagation(a)
										}
										if (!("clientX" in a) && "changedTouches" in a && (a.clientX = a.changedTouches[0].clientX, a.clientY = a.changedTouches[0].clientY), s.forcescreen) {
											var e = a,
												a = {
													original: a.original ? a.original : a
												};
											a.clientX = e.screenX, a.clientY = e.screenY
										}
										if (s.rail.drag = {
												x: a.clientX,
												y: a.clientY,
												sx: s.scroll.x,
												sy: s.scroll.y,
												st: s.getScrollTop(),
												sl: s.getScrollLeft(),
												pt: 2,
												dl: !1
											}, s.ispage || !s.opt.directionlockdeadzone) s.rail.drag.dl = "f";
										else {
											var f = {
													w: i(window).width(),
													h: i(window).height()
												},
												g = {
													w: Math.max(document.body.scrollWidth, document.documentElement.scrollWidth),
													h: Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)
												},
												h = Math.max(0, g.h - f.h),
												j = Math.max(0, g.w - f.w);
											s.rail.drag.ck = !s.rail.scrollable && s.railh.scrollable ? h > 0 ? "v" : !1 : s.rail.scrollable && !s.railh.scrollable && j > 0 ? "h" : !1, s.rail.drag.ck || (s.rail.drag.dl = "f")
										}
										if (s.opt.touchbehavior && s.isiframe && v.isie) {
											var k = s.win.position();
											s.rail.drag.x += k.left, s.rail.drag.y += k.top
										}
										if (s.hasmoving = !1, s.lastmouseup = !1, s.scrollmom.reset(a.clientX, a.clientY), !v.cantouch && !this.istouchcapable && !v.hasmstouch) {
											var l = b ? /INPUT|SELECT|TEXTAREA/i.test(b.nodeName) : !1;
											if (!l) return !s.ispage && v.hasmousecapture && b.setCapture(), s.opt.touchbehavior ? (b.onclick && !b._onclick && (b._onclick = b.onclick, b.onclick = function (a) {
												return s.hasmoving ? !1 : void b._onclick.call(this, a)
											}), s.cancelEvent(a)) : s.stopPropagation(a);
											/SUBMIT|CANCEL|BUTTON/i.test(i(b).attr("type")) && (pc = {
												tg: b,
												click: !1
											}, s.preventclick = pc)
										}
									}
								}, s.ontouchend = function (a) {
									return a.pointerType && 2 != a.pointerType ? !1 : s.rail.drag && 2 == s.rail.drag.pt && (s.scrollmom.doMomentum(), s.rail.drag = !1, s.hasmoving && (s.lastmouseup = !0, s.hideCursor(), v.hasmousecapture && document.releaseCapture(), !v.cantouch)) ? s.cancelEvent(a) : void 0
								};
								var z = s.opt.touchbehavior && s.isiframe && !v.hasmousecapture;
								s.ontouchmove = function (a, b) {
									if (a.pointerType && 2 != a.pointerType) return !1;
									if (s.rail.drag && 2 == s.rail.drag.pt) {
										if (v.cantouch && "undefined" == typeof a.original) return !0;
										s.hasmoving = !0, s.preventclick && !s.preventclick.click && (s.preventclick.click = s.preventclick.tg.onclick || !1, s.preventclick.tg.onclick = s.onpreventclick);
										var c = i.extend({
											original: a
										}, a);
										if (a = c, "changedTouches" in a && (a.clientX = a.changedTouches[0].clientX, a.clientY = a.changedTouches[0].clientY), s.forcescreen) {
											var d = a,
												a = {
													original: a.original ? a.original : a
												};
											a.clientX = d.screenX, a.clientY = d.screenY
										}
										var e = ofy = 0;
										if (z && !b) {
											var f = s.win.position();
											e = -f.left, ofy = -f.top
										}
										var g = a.clientY + ofy,
											h = g - s.rail.drag.y,
											j = a.clientX + e,
											k = j - s.rail.drag.x,
											l = s.rail.drag.st - h;
										if (s.ishwscroll && s.opt.bouncescroll ? 0 > l ? l = Math.round(l / 2) : l > s.page.maxh && (l = s.page.maxh + Math.round((l - s.page.maxh) / 2)) : (0 > l && (l = 0, g = 0), l > s.page.maxh && (l = s.page.maxh, g = 0)), s.railh && s.railh.scrollable) {
											var m = s.rail.drag.sl - k;
											s.ishwscroll && s.opt.bouncescroll ? 0 > m ? m = Math.round(m / 2) : m > s.page.maxw && (m = s.page.maxw + Math.round((m - s.page.maxw) / 2)) : (0 > m && (m = 0, j = 0), m > s.page.maxw && (m = s.page.maxw, j = 0))
										}
										var n = !1;
										if (s.rail.drag.dl) n = !0, "v" == s.rail.drag.dl ? m = s.rail.drag.sl : "h" == s.rail.drag.dl && (l = s.rail.drag.st);
										else {
											var o = Math.abs(h),
												p = Math.abs(k),
												q = s.opt.directionlockdeadzone;
											if ("v" == s.rail.drag.ck) {
												if (o > q && .3 * o >= p) return s.rail.drag = !1, !0;
												p > q && (s.rail.drag.dl = "f", i("body").scrollTop(i("body").scrollTop()))
											} else if ("h" == s.rail.drag.ck) {
												if (p > q && .3 * p >= o) return s.rail.drag = !1, !0;
												o > q && (s.rail.drag.dl = "f", i("body").scrollLeft(i("body").scrollLeft()))
											}
										}
										if (s.synched("touchmove", function () {
												s.rail.drag && 2 == s.rail.drag.pt && (s.prepareTransition && s.prepareTransition(0), s.rail.scrollable && s.setScrollTop(l), s.scrollmom.update(j, g), s.railh && s.railh.scrollable ? (s.setScrollLeft(m), s.showCursor(l, m)) : s.showCursor(l), v.isie10 && document.selection.clear())
											}), v.ischrome && s.istouchcapable && (n = !1), n) return s.cancelEvent(a)
									}
								}
							}
							s.onmousedown = function (a, b) {
								if (!s.rail.drag || 1 == s.rail.drag.pt) {
									if (s.locked) return s.cancelEvent(a);
									s.cancelScroll(), s.rail.drag = {
										x: a.clientX,
										y: a.clientY,
										sx: s.scroll.x,
										sy: s.scroll.y,
										pt: 1,
										hr: !!b
									};
									var c = s.getTarget(a);
									return !s.ispage && v.hasmousecapture && c.setCapture(), s.isiframe && !v.hasmousecapture && (s.saved.csspointerevents = s.doc.css("pointer-events"), s.css(s.doc, {
										"pointer-events": "none"
									})), s.hasmoving = !1, s.cancelEvent(a)
								}
							}, s.onmouseup = function (a) {
								if (s.rail.drag) {
									if (v.hasmousecapture && document.releaseCapture(), s.isiframe && !v.hasmousecapture && s.doc.css("pointer-events", s.saved.csspointerevents), 1 != s.rail.drag.pt) return;
									return s.rail.drag = !1, s.hasmoving && s.triggerScrollEnd(), s.cancelEvent(a)
								}
							}, s.onmousemove = function (a) {
								if (s.rail.drag) {
									if (1 != s.rail.drag.pt) return;
									if (v.ischrome && 0 == a.which) return s.onmouseup(a);
									if (s.cursorfreezed = !0, s.hasmoving = !0, s.rail.drag.hr) {
										s.scroll.x = s.rail.drag.sx + (a.clientX - s.rail.drag.x), s.scroll.x < 0 && (s.scroll.x = 0);
										var b = s.scrollvaluemaxw;
										s.scroll.x > b && (s.scroll.x = b)
									} else {
										s.scroll.y = s.rail.drag.sy + (a.clientY - s.rail.drag.y), s.scroll.y < 0 && (s.scroll.y = 0);
										var c = s.scrollvaluemax;
										s.scroll.y > c && (s.scroll.y = c)
									}
									return s.synched("mousemove", function () {
										s.rail.drag && 1 == s.rail.drag.pt && (s.showCursor(), s.rail.drag.hr ? s.doScrollLeft(Math.round(s.scroll.x * s.scrollratio.x), s.opt.cursordragspeed) : s.doScrollTop(Math.round(s.scroll.y * s.scrollratio.y), s.opt.cursordragspeed))
									}), s.cancelEvent(a)
								}
							}, v.cantouch || s.opt.touchbehavior ? (s.onpreventclick = function (a) {
								return s.preventclick ? (s.preventclick.tg.onclick = s.preventclick.click, s.preventclick = !1, s.cancelEvent(a)) : void 0
							}, s.bind(s.win, "mousedown", s.ontouchstart), s.onclick = v.isios ? !1 : function (a) {
								return s.lastmouseup ? (s.lastmouseup = !1, s.cancelEvent(a)) : !0
							}, s.opt.grabcursorenabled && v.cursorgrabvalue && (s.css(s.ispage ? s.doc : s.win, {
								cursor: v.cursorgrabvalue
							}), s.css(s.rail, {
								cursor: v.cursorgrabvalue
							}))) : (s.hasTextSelected = "getSelection" in document ? function () {
								return document.getSelection().rangeCount > 0
							} : "selection" in document ? function () {
								return "None" != document.selection.type
							} : function () {
								return !1
							}, s.onselectionstart = function () {
								s.ispage || (s.selectiondrag = s.win.offset())
							}, s.onselectionend = function () {
								s.selectiondrag = !1
							}, s.onselectiondrag = function (b) {
								s.selectiondrag && s.hasTextSelected() && s.debounced("selectionscroll", function () {
									a(b)
								}, 250)
							}), v.hasmstouch && (s.css(s.rail, {
								"-ms-touch-action": "none"
							}), s.css(s.cursor, {
								"-ms-touch-action": "none"
							}), s.bind(s.win, "MSPointerDown", s.ontouchstart), s.bind(document, "MSPointerUp", s.ontouchend), s.bind(document, "MSPointerMove", s.ontouchmove), s.bind(s.cursor, "MSGestureHold", function (a) {
								a.preventDefault()
							}), s.bind(s.cursor, "contextmenu", function (a) {
								a.preventDefault()
							})), this.istouchcapable && (s.bind(s.win, "touchstart", s.ontouchstart), s.bind(document, "touchend", s.ontouchend), s.bind(document, "touchcancel", s.ontouchend), s.bind(document, "touchmove", s.ontouchmove)), s.bind(s.cursor, "mousedown", s.onmousedown), s.bind(s.cursor, "mouseup", s.onmouseup), s.railh && (s.bind(s.cursorh, "mousedown", function (a) {
								s.onmousedown(a, !0)
							}), s.bind(s.cursorh, "mouseup", s.onmouseup)), (s.opt.cursordragontouch || !v.cantouch && !s.opt.touchbehavior) && (s.rail.css({
								cursor: "default"
							}), s.railh && s.railh.css({
								cursor: "default"
							}), s.jqbind(s.rail, "mouseenter", function () {
								return s.win.is(":visible") ? (s.canshowonmouseevent && s.showCursor(), void(s.rail.active = !0)) : !1
							}), s.jqbind(s.rail, "mouseleave", function () {
								s.rail.active = !1, s.rail.drag || s.hideCursor()
							}), s.opt.sensitiverail && (s.bind(s.rail, "click", function (a) {
								s.doRailClick(a, !1, !1)
							}), s.bind(s.rail, "dblclick", function (a) {
								s.doRailClick(a, !0, !1)
							}), s.bind(s.cursor, "click", function (a) {
								s.cancelEvent(a)
							}), s.bind(s.cursor, "dblclick", function (a) {
								s.cancelEvent(a)
							})), s.railh && (s.jqbind(s.railh, "mouseenter", function () {
								return s.win.is(":visible") ? (s.canshowonmouseevent && s.showCursor(), void(s.rail.active = !0)) : !1
							}), s.jqbind(s.railh, "mouseleave", function () {
								s.rail.active = !1, s.rail.drag || s.hideCursor()
							}), s.opt.sensitiverail && (s.bind(s.railh, "click", function (a) {
								s.doRailClick(a, !1, !0)
							}), s.bind(s.railh, "dblclick", function (a) {
								s.doRailClick(a, !0, !0)
							}), s.bind(s.cursorh, "click", function (a) {
								s.cancelEvent(a)
							}), s.bind(s.cursorh, "dblclick", function (a) {
								s.cancelEvent(a)
							})))), v.cantouch || s.opt.touchbehavior ? (s.bind(v.hasmousecapture ? s.win : document, "mouseup", s.ontouchend), s.bind(document, "mousemove", s.ontouchmove), s.onclick && s.bind(document, "click", s.onclick), s.opt.cursordragontouch && (s.bind(s.cursor, "mousedown", s.onmousedown), s.bind(s.cursor, "mousemove", s.onmousemove), s.cursorh && s.bind(s.cursorh, "mousedown", function (a) {
								s.onmousedown(a, !0)
							}), s.cursorh && s.bind(s.cursorh, "mousemove", s.onmousemove))) : (s.bind(v.hasmousecapture ? s.win : document, "mouseup", s.onmouseup), s.bind(document, "mousemove", s.onmousemove), s.onclick && s.bind(document, "click", s.onclick), !s.ispage && s.opt.enablescrollonselection && (s.bind(s.win[0], "mousedown", s.onselectionstart), s.bind(document, "mouseup", s.onselectionend), s.bind(s.cursor, "mouseup", s.onselectionend), s.cursorh && s.bind(s.cursorh, "mouseup", s.onselectionend), s.bind(document, "mousemove", s.onselectiondrag)), s.zoom && (s.jqbind(s.zoom, "mouseenter", function () {
								s.canshowonmouseevent && s.showCursor(), s.rail.active = !0
							}), s.jqbind(s.zoom, "mouseleave", function () {
								s.rail.active = !1, s.rail.drag || s.hideCursor()
							}))), s.opt.enablemousewheel && (s.isiframe || s.bind(v.isie && s.ispage ? document : s.win, "mousewheel", s.onmousewheel), s.bind(s.rail, "mousewheel", s.onmousewheel), s.railh && s.bind(s.railh, "mousewheel", s.onmousewheelhr)), s.ispage || v.cantouch || /HTML|^BODY/.test(s.win[0].nodeName) || (s.win.attr("tabindex") || s.win.attr({
								tabindex: f++
							}), s.jqbind(s.win, "focus", function (a) {
								d = s.getTarget(a).id || !0, s.hasfocus = !0, s.canshowonmouseevent && s.noticeCursor()
							}), s.jqbind(s.win, "blur", function () {
								d = !1, s.hasfocus = !1
							}), s.jqbind(s.win, "mouseenter", function (a) {
								e = s.getTarget(a).id || !0, s.hasmousefocus = !0, s.canshowonmouseevent && s.noticeCursor()
							}), s.jqbind(s.win, "mouseleave", function () {
								e = !1, s.hasmousefocus = !1, s.rail.drag || s.hideCursor()
							}))
						}
						if (s.onkeypress = function (a) {
								if (s.locked && 0 == s.page.maxh) return !0;
								a = a ? a : window.e;
								var b = s.getTarget(a);
								if (b && /INPUT|TEXTAREA|SELECT|OPTION/.test(b.nodeName)) {
									var c = b.getAttribute("type") || b.type || !1;
									if (!c || !/submit|button|cancel/i.tp) return !0
								}
								if (i(b).attr("contenteditable")) return !0;
								if (s.hasfocus || s.hasmousefocus && !d || s.ispage && !d && !e) {
									var f = a.keyCode;
									if (s.locked && 27 != f) return s.cancelEvent(a);
									var g = a.ctrlKey || !1,
										h = a.shiftKey || !1,
										j = !1;
									switch (f) {
										case 38:
										case 63233:
											s.doScrollBy(72), j = !0;
											break;
										case 40:
										case 63235:
											s.doScrollBy(-72), j = !0;
											break;
										case 37:
										case 63232:
											s.railh && (g ? s.doScrollLeft(0) : s.doScrollLeftBy(72), j = !0);
											break;
										case 39:
										case 63234:
											s.railh && (g ? s.doScrollLeft(s.page.maxw) : s.doScrollLeftBy(-72), j = !0);
											break;
										case 33:
										case 63276:
											s.doScrollBy(s.view.h), j = !0;
											break;
										case 34:
										case 63277:
											s.doScrollBy(-s.view.h), j = !0;
											break;
										case 36:
										case 63273:
											s.railh && g ? s.doScrollPos(0, 0) : s.doScrollTo(0), j = !0;
											break;
										case 35:
										case 63275:
											s.railh && g ? s.doScrollPos(s.page.maxw, s.page.maxh) : s.doScrollTo(s.page.maxh), j = !0;
											break;
										case 32:
											s.opt.spacebarenabled && (s.doScrollBy(h ? s.view.h : -s.view.h), j = !0);
											break;
										case 27:
											s.zoomactive && (s.doZoom(), j = !0)
									}
									if (j) return s.cancelEvent(a)
								}
							}, s.opt.enablekeyboard && s.bind(document, v.isopera && !v.isopera12 ? "keypress" : "keydown", s.onkeypress), s.bind(document, "keydown", function (a) {
								var b = a.ctrlKey || !1;
								b && (s.wheelprevented = !0)
							}), s.bind(document, "keyup", function (a) {
								var b = a.ctrlKey || !1;
								b || (s.wheelprevented = !1)
							}), s.bind(window, "resize", s.lazyResize), s.bind(window, "orientationchange", s.lazyResize), s.bind(window, "load", s.lazyResize), v.ischrome && !s.ispage && !s.haswrapper) {
							var A = s.win.attr("style"),
								B = parseFloat(s.win.css("width")) + 1;
							s.win.css("width", B), s.synched("chromefix", function () {
								s.win.attr("style", A)
							})
						}
						s.onAttributeChange = function () {
							s.lazyResize(250)
						}, s.ispage || s.haswrapper || (o !== !1 ? (s.observer = new o(function (a) {
							a.forEach(s.onAttributeChange)
						}), s.observer.observe(s.win[0], {
							childList: !0,
							characterData: !1,
							attributes: !0,
							subtree: !1
						}), s.observerremover = new o(function (a) {
							a.forEach(function (a) {
								if (a.removedNodes.length > 0)
									for (var b in a.removedNodes)
										if (a.removedNodes[b] == s.win[0]) return s.remove()
							})
						}), s.observerremover.observe(s.win[0].parentNode, {
							childList: !0,
							characterData: !1,
							attributes: !1,
							subtree: !1
						})) : (s.bind(s.win, v.isie && !v.isie9 ? "propertychange" : "DOMAttrModified", s.onAttributeChange), v.isie9 && s.win[0].attachEvent("onpropertychange", s.onAttributeChange), s.bind(s.win, "DOMNodeRemoved", function (a) {
							a.target == s.win[0] && s.remove()
						}))), !s.ispage && s.opt.boxzoom && s.bind(window, "resize", s.resizeZoom), s.istextarea && s.bind(s.win, "mouseup", s.lazyResize), s.lazyResize(30)
					}
					"IFRAME" == this.doc[0].nodeName && (this.doc[0].readyState && "complete" == this.doc[0].readyState && setTimeout(function () {
						b.call(s.doc[0], !1)
					}, 500), s.bind(this.doc, "load", b))
				}, this.showCursor = function (a, b) {
					s.cursortimeout && (clearTimeout(s.cursortimeout), s.cursortimeout = 0), s.rail && (s.autohidedom && (s.autohidedom.stop().css({
						opacity: s.opt.cursoropacitymax
					}), s.cursoractive = !0), s.rail.drag && 1 == s.rail.drag.pt || ("undefined" != typeof a && a !== !1 && (s.scroll.y = Math.round(1 * a / s.scrollratio.y)), "undefined" != typeof b && (s.scroll.x = Math.round(1 * b / s.scrollratio.x))), s.cursor.css({
						height: s.cursorheight,
						top: s.scroll.y
					}), s.cursorh && (s.cursorh.css(!s.rail.align && s.rail.visibility ? {
						width: s.cursorwidth,
						left: s.scroll.x + s.rail.width
					} : {
						width: s.cursorwidth,
						left: s.scroll.x
					}), s.cursoractive = !0), s.zoom && s.zoom.stop().css({
						opacity: s.opt.cursoropacitymax
					}))
				}, this.hideCursor = function (a) {
					s.cursortimeout || s.rail && s.autohidedom && (s.hasmousefocus && "leave" == s.opt.autohidemode || (s.cursortimeout = setTimeout(function () {
						s.rail.active && s.showonmouseevent || (s.autohidedom.stop().animate({
							opacity: s.opt.cursoropacitymin
						}), s.zoom && s.zoom.stop().animate({
							opacity: s.opt.cursoropacitymin
						}), s.cursoractive = !1), s.cursortimeout = 0
					}, a || s.opt.hidecursordelay)))
				}, this.noticeCursor = function (a, b, c) {
					s.showCursor(b, c), s.rail.active || s.hideCursor(a)
				}, this.getContentSize = s.ispage ? function () {
					return {
						w: Math.max(document.body.scrollWidth, document.documentElement.scrollWidth),
						h: Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)
					}
				} : s.haswrapper ? function () {
					return {
						w: s.doc.outerWidth() + parseInt(s.win.css("paddingLeft")) + parseInt(s.win.css("paddingRight")),
						h: s.doc.outerHeight() + parseInt(s.win.css("paddingTop")) + parseInt(s.win.css("paddingBottom"))
					}
				} : function () {
					return {
						w: s.docscroll[0].scrollWidth,
						h: s.docscroll[0].scrollHeight
					}
				}, this.onResize = function (a, b) {
					if (!s || !s.win) return !1;
					if (!s.haswrapper && !s.ispage) {
						if ("none" == s.win.css("display")) return s.visibility && s.hideRail().hideRailHr(), !1;
						s.hidden || s.visibility || s.showRail().showRailHr()
					}
					var c = s.page.maxh,
						d = s.page.maxw,
						e = {
							h: s.view.h,
							w: s.view.w
						};
					if (s.view = {
							w: s.ispage ? s.win.width() : parseInt(s.win[0].clientWidth),
							h: s.ispage ? s.win.height() : parseInt(s.win[0].clientHeight)
						}, s.page = b ? b : s.getContentSize(), s.page.maxh = Math.max(0, s.page.h - s.view.h), s.page.maxw = Math.max(0, s.page.w - s.view.w), s.page.maxh == c && s.page.maxw == d && s.view.w == e.w) {
						if (s.ispage) return s;
						var f = s.win.offset();
						if (s.lastposition) {
							var g = s.lastposition;
							if (g.top == f.top && g.left == f.left) return s
						}
						s.lastposition = f
					}
					if (0 == s.page.maxh ? (s.hideRail(), s.scrollvaluemax = 0, s.scroll.y = 0, s.scrollratio.y = 0, s.cursorheight = 0, s.setScrollTop(0), s.rail.scrollable = !1) : s.rail.scrollable = !0, 0 == s.page.maxw ? (s.hideRailHr(), s.scrollvaluemaxw = 0, s.scroll.x = 0, s.scrollratio.x = 0, s.cursorwidth = 0, s.setScrollLeft(0), s.railh.scrollable = !1) : s.railh.scrollable = !0, s.locked = 0 == s.page.maxh && 0 == s.page.maxw, s.locked) return s.ispage || s.updateScrollBar(s.view), !1;
					s.hidden || s.visibility ? s.hidden || s.railh.visibility || s.showRailHr() : s.showRail().showRailHr(), s.istextarea && s.win.css("resize") && "none" != s.win.css("resize") && (s.view.h -= 20), s.cursorheight = Math.min(s.view.h, Math.round(s.view.h * (s.view.h / s.page.h))), s.cursorheight = s.opt.cursorfixedheight ? s.opt.cursorfixedheight : Math.max(s.opt.cursorminheight, s.cursorheight), s.cursorwidth = Math.min(s.view.w, Math.round(s.view.w * (s.view.w / s.page.w))), s.cursorwidth = s.opt.cursorfixedheight ? s.opt.cursorfixedheight : Math.max(s.opt.cursorminheight, s.cursorwidth), s.scrollvaluemax = s.view.h - s.cursorheight - s.cursor.hborder, s.railh && (s.railh.width = s.page.maxh > 0 ? s.view.w - s.rail.width : s.view.w, s.scrollvaluemaxw = s.railh.width - s.cursorwidth - s.cursorh.wborder), s.ispage || s.updateScrollBar(s.view), s.scrollratio = {
						x: s.page.maxw / s.scrollvaluemaxw,
						y: s.page.maxh / s.scrollvaluemax
					};
					var h = s.getScrollTop();
					return h > s.page.maxh ? s.doScrollTop(s.page.maxh) : (s.scroll.y = Math.round(s.getScrollTop() * (1 / s.scrollratio.y)), s.scroll.x = Math.round(s.getScrollLeft() * (1 / s.scrollratio.x)), s.cursoractive && s.noticeCursor()), s.scroll.y && 0 == s.getScrollTop() && s.doScrollTo(Math.floor(s.scroll.y * s.scrollratio.y)), s
				}, this.resize = s.onResize, this.lazyResize = function (a) {
					return a = isNaN(a) ? 30 : a, s.delayed("resize", s.resize, a), s
				}, this._bind = function (a, b, c, d) {
					s.events.push({
						e: a,
						n: b,
						f: c,
						b: d,
						q: !1
					}), a.addEventListener ? a.addEventListener(b, c, d || !1) : a.attachEvent ? a.attachEvent("on" + b, c) : a["on" + b] = c
				}, this.jqbind = function (a, b, c) {
					s.events.push({
						e: a,
						n: b,
						f: c,
						q: !0
					}), i(a).bind(b, c)
				}, this.bind = function (a, b, c, d) {
					var e = "jquery" in a ? a[0] : a;
					if ("mousewheel" == b)
						if ("onwheel" in s.win) s._bind(e, "wheel", c, d || !1);
						else {
							var f = "undefined" != typeof document.onmousewheel ? "mousewheel" : "DOMMouseScroll";
							n(e, f, c, d || !1), "DOMMouseScroll" == f && n(e, "MozMousePixelScroll", c, d || !1)
						}
					else if (e.addEventListener) {
						if (v.cantouch && /mouseup|mousedown|mousemove/.test(b)) {
							var g = "mousedown" == b ? "touchstart" : "mouseup" == b ? "touchend" : "touchmove";
							s._bind(e, g, function (a) {
								if (a.touches) {
									if (a.touches.length < 2) {
										var b = a.touches.length ? a.touches[0] : a;
										b.original = a, c.call(this, b)
									}
								} else if (a.changedTouches) {
									var b = a.changedTouches[0];
									b.original = a, c.call(this, b)
								}
							}, d || !1)
						}
						s._bind(e, b, c, d || !1), v.cantouch && "mouseup" == b && s._bind(e, "touchcancel", c, d || !1)
					} else s._bind(e, b, function (a) {
						return a = a || window.event || !1, a && a.srcElement && (a.target = a.srcElement), "pageY" in a || (a.pageX = a.clientX + document.documentElement.scrollLeft, a.pageY = a.clientY + document.documentElement.scrollTop), c.call(e, a) === !1 || d === !1 ? s.cancelEvent(a) : !0
					})
				}, this._unbind = function (a, b, c, d) {
					a.removeEventListener ? a.removeEventListener(b, c, d) : a.detachEvent ? a.detachEvent("on" + b, c) : a["on" + b] = !1
				}, this.unbindAll = function () {
					for (var a = 0; a < s.events.length; a++) {
						var b = s.events[a];
						b.q ? b.e.unbind(b.n, b.f) : s._unbind(b.e, b.n, b.f, b.b)
					}
				}, this.cancelEvent = function (a) {
					var a = a.original ? a.original : a ? a : window.event || !1;
					return a ? (a.preventDefault && a.preventDefault(), a.stopPropagation && a.stopPropagation(), a.preventManipulation && a.preventManipulation(), a.cancelBubble = !0, a.cancel = !0, a.returnValue = !1, !1) : !1
				}, this.stopPropagation = function (a) {
					var a = a.original ? a.original : a ? a : window.event || !1;
					return a ? a.stopPropagation ? a.stopPropagation() : (a.cancelBubble && (a.cancelBubble = !0), !1) : !1
				}, this.showRail = function () {
					return 0 == s.page.maxh || !s.ispage && "none" == s.win.css("display") || (s.visibility = !0, s.rail.visibility = !0, s.rail.css("display", "block")), s
				}, this.showRailHr = function () {
					return s.railh ? (0 == s.page.maxw || !s.ispage && "none" == s.win.css("display") || (s.railh.visibility = !0, s.railh.css("display", "block")), s) : s
				}, this.hideRail = function () {
					return s.visibility = !1, s.rail.visibility = !1, s.rail.css("display", "none"), s
				}, this.hideRailHr = function () {
					return s.railh ? (s.railh.visibility = !1, s.railh.css("display", "none"), s) : s
				}, this.show = function () {
					return s.hidden = !1, s.locked = !1, s.showRail().showRailHr()
				}, this.hide = function () {
					return s.hidden = !0, s.locked = !0, s.hideRail().hideRailHr()
				}, this.toggle = function () {
					return s.hidden ? s.show() : s.hide()
				}, this.remove = function () {
					s.stop(), s.cursortimeout && clearTimeout(s.cursortimeout), s.doZoomOut(), s.unbindAll(), v.isie9 && s.win[0].detachEvent("onpropertychange", s.onAttributeChange), s.observer !== !1 && s.observer.disconnect(), s.observerremover !== !1 && s.observerremover.disconnect(), s.events = null, s.cursor && s.cursor.remove(), s.cursorh && s.cursorh.remove(), s.rail && s.rail.remove(), s.railh && s.railh.remove(), s.zoom && s.zoom.remove();
					for (var a = 0; a < s.saved.css.length; a++) {
						var b = s.saved.css[a];
						b[0].css(b[1], "undefined" == typeof b[2] ? "" : b[2])
					}
					s.saved = !1, s.me.data("__nicescroll", "");
					var c = i.nicescroll;
					c.each(function (a) {
						if (this && this.id === s.id) {
							delete c[a];
							for (var b = ++a; b < c.length; b++, a++) c[a] = c[b];
							c.length--, c.length && delete c[c.length]
						}
					});
					for (var d in s) s[d] = null, delete s[d];
					s = null
				}, this.scrollstart = function (a) {
					return this.onscrollstart = a, s
				}, this.scrollend = function (a) {
					return this.onscrollend = a, s
				}, this.scrollcancel = function (a) {
					return this.onscrollcancel = a, s
				}, this.zoomin = function (a) {
					return this.onzoomin = a, s
				}, this.zoomout = function (a) {
					return this.onzoomout = a, s
				}, this.isScrollable = function (a) {
					var b = a.target ? a.target : a;
					if ("OPTION" == b.nodeName) return !0;
					for (; b && 1 == b.nodeType && !/^BODY|HTML/.test(b.nodeName);) {
						var c = i(b),
							d = c.css("overflowY") || c.css("overflowX") || c.css("overflow") || "";
						if (/scroll|auto/.test(d)) return b.clientHeight != b.scrollHeight;
						b = b.parentNode ? b.parentNode : !1
					}
					return !1
				}, this.getViewport = function (a) {
					for (var b = a && a.parentNode ? a.parentNode : !1; b && 1 == b.nodeType && !/^BODY|HTML/.test(b.nodeName);) {
						var c = i(b);
						if (/fixed|absolute/.test(c.css("position"))) return c;
						var d = c.css("overflowY") || c.css("overflowX") || c.css("overflow") || "";
						if (/scroll|auto/.test(d) && b.clientHeight != b.scrollHeight) return c;
						if (c.getNiceScroll().length > 0) return c;
						b = b.parentNode ? b.parentNode : !1
					}
					return b ? i(b) : !1
				}, this.triggerScrollEnd = function () {
					if (s.onscrollend) {
						var a = s.getScrollLeft(),
							b = s.getScrollTop(),
							c = {
								type: "scrollend",
								current: {
									x: a,
									y: b
								},
								end: {
									x: a,
									y: b
								}
							};
						s.onscrollend.call(s, c)
					}
				}, this.onmousewheel = function (a) {
					if (!s.wheelprevented) {
						if (s.locked) return s.debounced("checkunlock", s.resize, 250), !0;
						if (s.rail.drag) return s.cancelEvent(a);
						if ("auto" == s.opt.oneaxismousemode && 0 != a.deltaX && (s.opt.oneaxismousemode = !1), s.opt.oneaxismousemode && 0 == a.deltaX && !s.rail.scrollable) return s.railh && s.railh.scrollable ? s.onmousewheelhr(a) : !0;
						var b = +new Date,
							c = !1;
						if (s.opt.preservenativescrolling && s.checkarea + 600 < b && (s.nativescrollingarea = s.isScrollable(a), c = !0), s.checkarea = b, s.nativescrollingarea) return !0;
						var d = q(a, !1, c);
						return d && (s.checkarea = 0), d
					}
				}, this.onmousewheelhr = function (a) {
					if (!s.wheelprevented) {
						if (s.locked || !s.railh.scrollable) return !0;
						if (s.rail.drag) return s.cancelEvent(a);
						var b = +new Date,
							c = !1;
						return s.opt.preservenativescrolling && s.checkarea + 600 < b && (s.nativescrollingarea = s.isScrollable(a), c = !0), s.checkarea = b, s.nativescrollingarea ? !0 : s.locked ? s.cancelEvent(a) : q(a, !0, c)
					}
				}, this.stop = function () {
					return s.cancelScroll(), s.scrollmon && s.scrollmon.stop(), s.cursorfreezed = !1, s.scroll.y = Math.round(s.getScrollTop() * (1 / s.scrollratio.y)), s.noticeCursor(), s
				}, this.getTransitionSpeed = function (a) {
					var b = Math.round(10 * s.opt.scrollspeed),
						c = Math.min(b, Math.round(a / 20 * s.opt.scrollspeed));
					return c > 20 ? c : 0
				}, s.opt.smoothscroll ? s.ishwscroll && v.hastransition && s.opt.usetransition ? (this.prepareTransition = function (a, b) {
					var c = b ? a > 20 ? a : 0 : s.getTransitionSpeed(a),
						d = c ? v.prefixstyle + "transform " + c + "ms ease-out" : "";
					return s.lasttransitionstyle && s.lasttransitionstyle == d || (s.lasttransitionstyle = d, s.doc.css(v.transitionstyle, d)), c
				}, this.doScrollLeft = function (a, b) {
					var c = s.scrollrunning ? s.newscrolly : s.getScrollTop();
					s.doScrollPos(a, c, b)
				}, this.doScrollTop = function (a, b) {
					var c = s.scrollrunning ? s.newscrollx : s.getScrollLeft();
					s.doScrollPos(c, a, b)
				}, this.doScrollPos = function (a, b, c) {
					var d = s.getScrollTop(),
						e = s.getScrollLeft();
					return ((s.newscrolly - d) * (b - d) < 0 || (s.newscrollx - e) * (a - e) < 0) && s.cancelScroll(), 0 == s.opt.bouncescroll && (0 > b ? b = 0 : b > s.page.maxh && (b = s.page.maxh), 0 > a ? a = 0 : a > s.page.maxw && (a = s.page.maxw)), s.scrollrunning && a == s.newscrollx && b == s.newscrolly ? !1 : (s.newscrolly = b, s.newscrollx = a, s.newscrollspeed = c || !1, s.timer ? !1 : void(s.timer = setTimeout(function () {
						var c = s.getScrollTop(),
							d = s.getScrollLeft(),
							e = {};
						e.x = a - d, e.y = b - c, e.px = d, e.py = c;
						var f = Math.round(Math.sqrt(Math.pow(e.x, 2) + Math.pow(e.y, 2))),
							g = s.newscrollspeed && s.newscrollspeed > 1 ? s.newscrollspeed : s.getTransitionSpeed(f);
						if (s.newscrollspeed && s.newscrollspeed <= 1 && (g *= s.newscrollspeed), s.prepareTransition(g, !0), s.timerscroll && s.timerscroll.tm && clearInterval(s.timerscroll.tm), g > 0) {
							if (!s.scrollrunning && s.onscrollstart) {
								var h = {
									type: "scrollstart",
									current: {
										x: d,
										y: c
									},
									request: {
										x: a,
										y: b
									},
									end: {
										x: s.newscrollx,
										y: s.newscrolly
									},
									speed: g
								};
								s.onscrollstart.call(s, h)
							}
							v.transitionend ? s.scrollendtrapped || (s.scrollendtrapped = !0, s.bind(s.doc, v.transitionend, s.onScrollTransitionEnd, !1)) : (s.scrollendtrapped && clearTimeout(s.scrollendtrapped), s.scrollendtrapped = setTimeout(s.onScrollTransitionEnd, g));
							var i = c,
								j = d;
							s.timerscroll = {
								bz: new BezierClass(i, s.newscrolly, g, 0, 0, .58, 1),
								bh: new BezierClass(j, s.newscrollx, g, 0, 0, .58, 1)
							}, s.cursorfreezed || (s.timerscroll.tm = setInterval(function () {
								s.showCursor(s.getScrollTop(), s.getScrollLeft())
							}, 60))
						}
						s.synched("doScroll-set", function () {
							s.timer = 0, s.scrollendtrapped && (s.scrollrunning = !0), s.setScrollTop(s.newscrolly), s.setScrollLeft(s.newscrollx), s.scrollendtrapped || s.onScrollTransitionEnd()
						})
					}, 50)))
				}, this.cancelScroll = function () {
					if (!s.scrollendtrapped) return !0;
					var a = s.getScrollTop(),
						b = s.getScrollLeft();
					return s.scrollrunning = !1, v.transitionend || clearTimeout(v.transitionend), s.scrollendtrapped = !1, s._unbind(s.doc, v.transitionend, s.onScrollTransitionEnd), s.prepareTransition(0), s.setScrollTop(a), s.railh && s.setScrollLeft(b), s.timerscroll && s.timerscroll.tm && clearInterval(s.timerscroll.tm), s.timerscroll = !1, s.cursorfreezed = !1, s.showCursor(a, b), s
				}, this.onScrollTransitionEnd = function () {
					s.scrollendtrapped && s._unbind(s.doc, v.transitionend, s.onScrollTransitionEnd), s.scrollendtrapped = !1, s.prepareTransition(0), s.timerscroll && s.timerscroll.tm && clearInterval(s.timerscroll.tm), s.timerscroll = !1;
					var a = s.getScrollTop(),
						b = s.getScrollLeft();
					return s.setScrollTop(a), s.railh && s.setScrollLeft(b), s.noticeCursor(!1, a, b), s.cursorfreezed = !1, 0 > a ? a = 0 : a > s.page.maxh && (a = s.page.maxh), 0 > b ? b = 0 : b > s.page.maxw && (b = s.page.maxw), a != s.newscrolly || b != s.newscrollx ? s.doScrollPos(b, a, s.opt.snapbackspeed) : (s.onscrollend && s.scrollrunning && s.triggerScrollEnd(), void(s.scrollrunning = !1))
				}) : (this.doScrollLeft = function (a, b) {
					var c = s.scrollrunning ? s.newscrolly : s.getScrollTop();
					s.doScrollPos(a, c, b)
				}, this.doScrollTop = function (a, b) {
					var c = s.scrollrunning ? s.newscrollx : s.getScrollLeft();
					s.doScrollPos(c, a, b)
				}, this.doScrollPos = function (a, b, c) {
					function d() {
						if (s.cancelAnimationFrame) return !0;
						if (s.scrollrunning = !0, m = 1 - m) return s.timer = k(d) || 1;
						var a = 0,
							b = sy = s.getScrollTop();
						if (s.dst.ay) {
							b = s.bzscroll ? s.dst.py + s.bzscroll.getNow() * s.dst.ay : s.newscrolly;
							var c = b - sy;
							(0 > c && b < s.newscrolly || c > 0 && b > s.newscrolly) && (b = s.newscrolly), s.setScrollTop(b), b == s.newscrolly && (a = 1)
						} else a = 1;
						var e = sx = s.getScrollLeft();
						if (s.dst.ax) {
							e = s.bzscroll ? s.dst.px + s.bzscroll.getNow() * s.dst.ax : s.newscrollx;
							var c = e - sx;
							(0 > c && e < s.newscrollx || c > 0 && e > s.newscrollx) && (e = s.newscrollx), s.setScrollLeft(e), e == s.newscrollx && (a += 1)
						} else a += 1;
						2 == a ? (s.timer = 0, s.cursorfreezed = !1, s.bzscroll = !1, s.scrollrunning = !1, 0 > b ? b = 0 : b > s.page.maxh && (b = s.page.maxh), 0 > e ? e = 0 : e > s.page.maxw && (e = s.page.maxw), e != s.newscrollx || b != s.newscrolly ? s.doScrollPos(e, b) : s.onscrollend && s.triggerScrollEnd()) : s.timer = k(d) || 1
					}
					var b = "undefined" == typeof b || b === !1 ? s.getScrollTop(!0) : b;
					if (s.timer && s.newscrolly == b && s.newscrollx == a) return !0;
					s.timer && l(s.timer), s.timer = 0;
					var e = s.getScrollTop(),
						f = s.getScrollLeft();
					((s.newscrolly - e) * (b - e) < 0 || (s.newscrollx - f) * (a - f) < 0) && s.cancelScroll(), s.newscrolly = b, s.newscrollx = a, s.bouncescroll && s.rail.visibility || (s.newscrolly < 0 ? s.newscrolly = 0 : s.newscrolly > s.page.maxh && (s.newscrolly = s.page.maxh)), s.bouncescroll && s.railh.visibility || (s.newscrollx < 0 ? s.newscrollx = 0 : s.newscrollx > s.page.maxw && (s.newscrollx = s.page.maxw)), s.dst = {}, s.dst.x = a - f, s.dst.y = b - e, s.dst.px = f, s.dst.py = e;
					var g = Math.round(Math.sqrt(Math.pow(s.dst.x, 2) + Math.pow(s.dst.y, 2)));
					s.dst.ax = s.dst.x / g, s.dst.ay = s.dst.y / g;
					var h = 0,
						i = g;
					0 == s.dst.x ? (h = e, i = b, s.dst.ay = 1, s.dst.py = 0) : 0 == s.dst.y && (h = f, i = a, s.dst.ax = 1, s.dst.px = 0);
					var j = s.getTransitionSpeed(g);
					if (c && 1 >= c && (j *= c), s.bzscroll = j > 0 ? s.bzscroll ? s.bzscroll.update(i, j) : new BezierClass(h, i, j, 0, 1, 0, 1) : !1, !s.timer) {
						(e == s.page.maxh && b >= s.page.maxh || f == s.page.maxw && a >= s.page.maxw) && s.checkContentSize();
						var m = 1;
						if (s.cancelAnimationFrame = !1, s.timer = 1, s.onscrollstart && !s.scrollrunning) {
							var n = {
								type: "scrollstart",
								current: {
									x: f,
									y: e
								},
								request: {
									x: a,
									y: b
								},
								end: {
									x: s.newscrollx,
									y: s.newscrolly
								},
								speed: j
							};
							s.onscrollstart.call(s, n)
						}
						d(), (e == s.page.maxh && b >= e || f == s.page.maxw && a >= f) && s.checkContentSize(), s.noticeCursor()
					}
				}, this.cancelScroll = function () {
					return s.timer && l(s.timer), s.timer = 0, s.bzscroll = !1, s.scrollrunning = !1, s
				}) : (this.doScrollLeft = function (a, b) {
					var c = s.getScrollTop();
					s.doScrollPos(a, c, b)
				}, this.doScrollTop = function (a, b) {
					var c = s.getScrollLeft();
					s.doScrollPos(c, a, b)
				}, this.doScrollPos = function (a, b) {
					var c = a > s.page.maxw ? s.page.maxw : a;
					0 > c && (c = 0);
					var d = b > s.page.maxh ? s.page.maxh : b;
					0 > d && (d = 0), s.synched("scroll", function () {
						s.setScrollTop(d), s.setScrollLeft(c)
					})
				}, this.cancelScroll = function () {}), this.doScrollBy = function (a, b) {
					var c = 0;
					if (b) c = Math.floor((s.scroll.y - a) * s.scrollratio.y);
					else {
						var d = s.timer ? s.newscrolly : s.getScrollTop(!0);
						c = d - a
					}
					if (s.bouncescroll) {
						var e = Math.round(s.view.h / 2); - e > c ? c = -e : c > s.page.maxh + e && (c = s.page.maxh + e)
					}
					return s.cursorfreezed = !1, py = s.getScrollTop(!0), 0 > c && py <= 0 ? s.noticeCursor() : c > s.page.maxh && py >= s.page.maxh ? (s.checkContentSize(), s.noticeCursor()) : void s.doScrollTop(c)
				}, this.doScrollLeftBy = function (a, b) {
					var c = 0;
					if (b) c = Math.floor((s.scroll.x - a) * s.scrollratio.x);
					else {
						var d = s.timer ? s.newscrollx : s.getScrollLeft(!0);
						c = d - a
					}
					if (s.bouncescroll) {
						var e = Math.round(s.view.w / 2); - e > c ? c = -e : c > s.page.maxw + e && (c = s.page.maxw + e)
					}
					return s.cursorfreezed = !1, px = s.getScrollLeft(!0), 0 > c && px <= 0 ? s.noticeCursor() : c > s.page.maxw && px >= s.page.maxw ? s.noticeCursor() : void s.doScrollLeft(c)
				}, this.doScrollTo = function (a, b) {
					var c = b ? Math.round(a * s.scrollratio.y) : a;
					0 > c ? c = 0 : c > s.page.maxh && (c = s.page.maxh), s.cursorfreezed = !1, s.doScrollTop(a)
				}, this.checkContentSize = function () {
					var a = s.getContentSize();
					(a.h != s.page.h || a.w != s.page.w) && s.resize(!1, a)
				}, s.onscroll = function () {
					s.rail.drag || s.cursorfreezed || s.synched("scroll", function () {
						s.scroll.y = Math.round(s.getScrollTop() * (1 / s.scrollratio.y)), s.railh && (s.scroll.x = Math.round(s.getScrollLeft() * (1 / s.scrollratio.x))), s.noticeCursor()
					})
				}, s.bind(s.docscroll, "scroll", s.onscroll), this.doZoomIn = function (a) {
					if (!s.zoomactive) {
						s.zoomactive = !0, s.zoomrestore = {
							style: {}
						};
						var b = ["position", "top", "left", "zIndex", "backgroundColor", "marginTop", "marginBottom", "marginLeft", "marginRight"],
							c = s.win[0].style;
						for (var d in b) {
							var e = b[d];
							s.zoomrestore.style[e] = "undefined" != typeof c[e] ? c[e] : ""
						}
						s.zoomrestore.style.width = s.win.css("width"), s.zoomrestore.style.height = s.win.css("height"), s.zoomrestore.padding = {
							w: s.win.outerWidth() - s.win.width(),
							h: s.win.outerHeight() - s.win.height()
						}, v.isios4 && (s.zoomrestore.scrollTop = i(window).scrollTop(), i(window).scrollTop(0)), s.win.css({
							position: v.isios4 ? "absolute" : "fixed",
							top: 0,
							left: 0,
							"z-index": h + 100,
							margin: "0px"
						});
						var f = s.win.css("backgroundColor");
						return ("" == f || /transparent|rgba\(0, 0, 0, 0\)|rgba\(0,0,0,0\)/.test(f)) && s.win.css("backgroundColor", "#fff"), s.rail.css({
							"z-index": h + 101
						}), s.zoom.css({
							"z-index": h + 102
						}), s.zoom.css("backgroundPosition", "0px -18px"), s.resizeZoom(), s.onzoomin && s.onzoomin.call(s), s.cancelEvent(a)
					}
				}, this.doZoomOut = function (a) {
					return s.zoomactive ? (s.zoomactive = !1, s.win.css("margin", ""), s.win.css(s.zoomrestore.style), v.isios4 && i(window).scrollTop(s.zoomrestore.scrollTop), s.rail.css({
						"z-index": s.zindex
					}), s.zoom.css({
						"z-index": s.zindex
					}), s.zoomrestore = !1, s.zoom.css("backgroundPosition", "0px 0px"), s.onResize(), s.onzoomout && s.onzoomout.call(s), s.cancelEvent(a)) : void 0
				}, this.doZoom = function (a) {
					return s.zoomactive ? s.doZoomOut(a) : s.doZoomIn(a)
				}, this.resizeZoom = function () {
					if (s.zoomactive) {
						var a = s.getScrollTop();
						s.win.css({
							width: i(window).width() - s.zoomrestore.padding.w + "px",
							height: i(window).height() - s.zoomrestore.padding.h + "px"
						}), s.onResize(), s.setScrollTop(Math.min(s.page.maxh, a))
					}
				}, this.init(), i.nicescroll.push(this)
			},
			t = function (a) {
				var b = this;
				this.nc = a, this.lastx = 0, this.lasty = 0, this.speedx = 0, this.speedy = 0, this.lasttime = 0, this.steptime = 0, this.snapx = !1, this.snapy = !1, this.demulx = 0, this.demuly = 0, this.lastscrollx = -1, this.lastscrolly = -1, this.chkx = 0, this.chky = 0, this.timer = 0, this.time = function () {
					return +new Date
				}, this.reset = function (a, c) {
					b.stop();
					var d = b.time();
					b.steptime = 0, b.lasttime = d, b.speedx = 0, b.speedy = 0, b.lastx = a, b.lasty = c, b.lastscrollx = -1, b.lastscrolly = -1
				}, this.update = function (a, c) {
					var d = b.time();
					b.steptime = d - b.lasttime, b.lasttime = d;
					var e = c - b.lasty,
						f = a - b.lastx,
						g = b.nc.getScrollTop(),
						h = b.nc.getScrollLeft(),
						i = g + e,
						j = h + f;
					b.snapx = 0 > j || j > b.nc.page.maxw, b.snapy = 0 > i || i > b.nc.page.maxh, b.speedx = f, b.speedy = e, b.lastx = a, b.lasty = c
				}, this.stop = function () {
					b.nc.unsynched("domomentum2d"), b.timer && clearTimeout(b.timer), b.timer = 0, b.lastscrollx = -1, b.lastscrolly = -1
				}, this.doSnapy = function (a, c) {
					var d = !1;
					0 > c ? (c = 0, d = !0) : c > b.nc.page.maxh && (c = b.nc.page.maxh, d = !0), 0 > a ? (a = 0, d = !0) : a > b.nc.page.maxw && (a = b.nc.page.maxw, d = !0), d ? b.nc.doScrollPos(a, c, b.nc.opt.snapbackspeed) : b.nc.triggerScrollEnd()
				}, this.doMomentum = function (a) {
					var c = b.time(),
						d = a ? c + a : b.lasttime,
						e = b.nc.getScrollLeft(),
						f = b.nc.getScrollTop(),
						g = b.nc.page.maxh,
						h = b.nc.page.maxw;
					b.speedx = h > 0 ? Math.min(60, b.speedx) : 0, b.speedy = g > 0 ? Math.min(60, b.speedy) : 0;
					var i = d && 60 >= c - d;
					(0 > f || f > g || 0 > e || e > h) && (i = !1);
					var j = b.speedy && i ? b.speedy : !1,
						k = b.speedx && i ? b.speedx : !1;
					if (j || k) {
						var l = Math.max(16, b.steptime);
						if (l > 50) {
							var m = l / 50;
							b.speedx *= m, b.speedy *= m, l = 50
						}
						b.demulxy = 0, b.lastscrollx = b.nc.getScrollLeft(), b.chkx = b.lastscrollx, b.lastscrolly = b.nc.getScrollTop(), b.chky = b.lastscrolly;
						var n = b.lastscrollx,
							o = b.lastscrolly,
							p = function () {
								var a = b.time() - c > 600 ? .04 : .02;
								b.speedx && (n = Math.floor(b.lastscrollx - b.speedx * (1 - b.demulxy)), b.lastscrollx = n, (0 > n || n > h) && (a = .1)), b.speedy && (o = Math.floor(b.lastscrolly - b.speedy * (1 - b.demulxy)), b.lastscrolly = o, (0 > o || o > g) && (a = .1)), b.demulxy = Math.min(1, b.demulxy + a), b.nc.synched("domomentum2d", function () {
									if (b.speedx) {
										var a = b.nc.getScrollLeft();
										a != b.chkx && b.stop(), b.chkx = n, b.nc.setScrollLeft(n)
									}
									if (b.speedy) {
										var c = b.nc.getScrollTop();
										c != b.chky && b.stop(), b.chky = o, b.nc.setScrollTop(o)
									}
									b.timer || (b.nc.hideCursor(), b.doSnapy(n, o))
								}), b.demulxy < 1 ? b.timer = setTimeout(p, l) : (b.stop(), b.nc.hideCursor(), b.doSnapy(n, o))
							};
						p()
					} else b.doSnapy(b.nc.getScrollLeft(), b.nc.getScrollTop())
				}
			},
			u = a.fn.scrollTop;
		a.cssHooks.pageYOffset = {
			get: function (a) {
				var b = i.data(a, "__nicescroll") || !1;
				return b && b.ishwscroll ? b.getScrollTop() : u.call(a)
			},
			set: function (a, b) {
				var c = i.data(a, "__nicescroll") || !1;
				return c && c.ishwscroll ? c.setScrollTop(parseInt(b)) : u.call(a, b), this
			}
		}, a.fn.scrollTop = function (a) {
			if ("undefined" == typeof a) {
				var b = this[0] ? i.data(this[0], "__nicescroll") || !1 : !1;
				return b && b.ishwscroll ? b.getScrollTop() : u.call(this)
			}
			return this.each(function () {
				var b = i.data(this, "__nicescroll") || !1;
				b && b.ishwscroll ? b.setScrollTop(parseInt(a)) : u.call(i(this), a)
			})
		};
		var v = a.fn.scrollLeft;
		i.cssHooks.pageXOffset = {
			get: function (a) {
				var b = i.data(a, "__nicescroll") || !1;
				return b && b.ishwscroll ? b.getScrollLeft() : v.call(a)
			},
			set: function (a, b) {
				var c = i.data(a, "__nicescroll") || !1;
				return c && c.ishwscroll ? c.setScrollLeft(parseInt(b)) : v.call(a, b), this
			}
		}, a.fn.scrollLeft = function (a) {
			if ("undefined" == typeof a) {
				var b = this[0] ? i.data(this[0], "__nicescroll") || !1 : !1;
				return b && b.ishwscroll ? b.getScrollLeft() : v.call(this)
			}
			return this.each(function () {
				var b = i.data(this, "__nicescroll") || !1;
				b && b.ishwscroll ? b.setScrollLeft(parseInt(a)) : v.call(i(this), a)
			})
		};
		var w = function (a) {
			var b = this;
			if (this.length = 0, this.name = "nicescrollarray", this.each = function (a) {
					for (var c = 0, d = 0; c < b.length; c++) a.call(b[c], d++);
					return b
				}, this.push = function (a) {
					b[b.length] = a, b.length++
				}, this.eq = function (a) {
					return b[a]
				}, a)
				for (var c = 0; c < a.length; c++) {
					var d = i.data(a[c], "__nicescroll") || !1;
					d && (this[this.length] = d, this.length++)
				}
			return this
		};
		c(w.prototype, ["show", "hide", "toggle", "onResize", "resize", "remove", "stop", "doScrollPos"], function (a, b) {
			a[b] = function () {
				var a = arguments;
				return this.each(function () {
					this[b].apply(this, a)
				})
			}
		}), a.fn.getNiceScroll = function (a) {
			if ("undefined" == typeof a) return new w(this);
			var b = this[a] && i.data(this[a], "__nicescroll") || !1;
			return b
		}, a.extend(a.expr[":"], {
			nicescroll: function (a) {
				return i.data(a, "__nicescroll") ? !0 : !1
			}
		}), i.fn.niceScroll = function (a, b) {
			"undefined" == typeof b && ("object" != typeof a || "jquery" in a || (b = a, a = !1));
			var c = new w;
			"undefined" == typeof b && (b = {}), a && (b.doc = i(a), b.win = i(this));
			var d = !("doc" in b);
			return d || "win" in b || (b.win = i(this)), this.each(function () {
				var a = i(this).data("__nicescroll") || !1;
				a || (b.doc = d ? i(this) : b.doc, a = new s(b, i(this)), i(this).data("__nicescroll", a)), c.push(a)
			}), 1 == c.length ? c[0] : c
		}, window.NiceScroll = {
			getjQuery: function () {
				return a
			}
		}, i.nicescroll || (i.nicescroll = new w, i.nicescroll.options = p)
	}),
	function (a) {
		a.fn.dropit = function (b) {
			var c = {
				init: function (b) {
					return this.dropit.settings = a.extend({}, this.dropit.defaults, b), this.each(function () {
						var b = a(this),
							c = a.fn.dropit.settings;
						b.on(c.action, c["this"], function () {
							return a(this).hasClass("active-drop") ? (a(this).removeClass("active-drop"), !1) : (c.beforeHide.call(this), a(".active-drop").removeClass(""), c.afterHide.call(this), c.beforeShow.call(this), a(this).addClass("active-drop"), c.afterShow.call(this), !1)
						}), a(document).on("click", function () {
							c.beforeHide.call(this), a(".active-drop").removeClass("activH-drop").find(".dropit-submenu").hide(), c.afterHide.call(this)
						}), c.afterLoad.call(this)
					})
				}
			};
			return c[b] ? c[b].apply(this, Array.prototype.slice.call(arguments, 1)) : "object" != typeof b && b ? void a.error('Method "' + b + '" does not exist in dropit plugin!') : c.init.apply(this, arguments)
		}, a.fn.dropit.defaults = {
			action: "click",
			submenuEl: "ul",
			triggerEl: "a",
			triggerParentEl: "li",
			afterLoad: function () {},
			beforeShow: function () {},
			afterShow: function () {},
			beforeHide: function () {},
			afterHide: function () {}
		}, a.fn.dropit.settings = {}
	}(jQuery),
	function () {
		var a, b, c, d, e, f = function (a, b) {
				return function () {
					return a.apply(b, arguments)
				}
			},
			g = [].indexOf || function (a) {
				for (var b = 0, c = this.length; c > b; b++)
					if (b in this && this[b] === a) return b;
				return -1
			};
		b = function () {
			function a() {}
			return a.prototype.extend = function (a, b) {
				var c, d;
				for (c in b) d = b[c], null == a[c] && (a[c] = d);
				return a
			}, a.prototype.isMobile = function (a) {
				return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(a)
			}, a.prototype.createEvent = function (a, b, c, d) {
				var e;
				return null == b && (b = !1), null == c && (c = !1), null == d && (d = null), null != document.createEvent ? (e = document.createEvent("CustomEvent"), e.initCustomEvent(a, b, c, d)) : null != document.createEventObject ? (e = document.createEventObject(), e.eventType = a) : e.eventName = a, e
			}, a.prototype.emitEvent = function (a, b) {
				return null != a.dispatchEvent ? a.dispatchEvent(b) : b in (null != a) ? a[b]() : "on" + b in (null != a) ? a["on" + b]() : void 0
			}, a.prototype.addEvent = function (a, b, c) {
				return null != a.addEventListener ? a.addEventListener(b, c, !1) : null != a.attachEvent ? a.attachEvent("on" + b, c) : a[b] = c
			}, a.prototype.removeEvent = function (a, b, c) {
				return null != a.removeEventListener ? a.removeEventListener(b, c, !1) : null != a.detachEvent ? a.detachEvent("on" + b, c) : delete a[b]
			}, a.prototype.innerHeight = function () {
				return "innerHeight" in window ? window.innerHeight : document.documentElement.clientHeight
			}, a
		}(), c = this.WeakMap || this.MozWeakMap || (c = function () {
			function a() {
				this.keys = [], this.values = []
			}
			return a.prototype.get = function (a) {
				var b, c, d, e, f;
				for (f = this.keys, b = d = 0, e = f.length; e > d; b = ++d)
					if (c = f[b], c === a) return this.values[b]
			}, a.prototype.set = function (a, b) {
				var c, d, e, f, g;
				for (g = this.keys, c = e = 0, f = g.length; f > e; c = ++e)
					if (d = g[c], d === a) return void(this.values[c] = b);
				return this.keys.push(a), this.values.push(b)
			}, a
		}()), a = this.MutationObserver || this.WebkitMutationObserver || this.MozMutationObserver || (a = function () {
			function a() {
				"undefined" != typeof console && null !== console && console.warn("MutationObserver is not supported by your browser."), "undefined" != typeof console && null !== console && console.warn("WOW.js cannot detect dom mutations, please call .sync() after loading new content.")
			}
			return a.notSupported = !0, a.prototype.observe = function () {}, a
		}()), d = this.getComputedStyle || function (a) {
			return this.getPropertyValue = function (b) {
				var c;
				return "float" === b && (b = "styleFloat"), e.test(b) && b.replace(e, function (a, b) {
					return b.toUpperCase()
				}), (null != (c = a.currentStyle) ? c[b] : void 0) || null
			}, this
		}, e = /(\-([a-z]){1})/g, this.WOW = function () {
			function e(a) {
				null == a && (a = {}), this.scrollCallback = f(this.scrollCallback, this), this.scrollHandler = f(this.scrollHandler, this), this.resetAnimation = f(this.resetAnimation, this), this.start = f(this.start, this), this.scrolled = !0, this.config = this.util().extend(a, this.defaults), this.animationNameCache = new c, this.wowEvent = this.util().createEvent(this.config.boxClass)
			}
			return e.prototype.defaults = {
				boxClass: "wow",
				animateClass: "animated",
				offset: 0,
				mobile: !0,
				live: !0,
				callback: null
			}, e.prototype.init = function () {
				var a;
				return this.element = window.document.documentElement, "interactive" === (a = document.readyState) || "complete" === a ? this.start() : this.util().addEvent(document, "DOMContentLoaded", this.start), this.finished = []
			}, e.prototype.start = function () {
				var b, c, d, e;
				if (this.stopped = !1, this.boxes = function () {
						var a, c, d, e;
						for (d = this.element.querySelectorAll("." + this.config.boxClass), e = [], a = 0, c = d.length; c > a; a++) b = d[a], e.push(b);
						return e
					}.call(this), this.all = function () {
						var a, c, d, e;
						for (d = this.boxes, e = [], a = 0, c = d.length; c > a; a++) b = d[a], e.push(b);
						return e
					}.call(this), this.boxes.length)
					if (this.disabled()) this.resetStyle();
					else
						for (e = this.boxes, c = 0, d = e.length; d > c; c++) b = e[c], this.applyStyle(b, !0);
				return this.disabled() || (this.util().addEvent(window, "scroll", this.scrollHandler), this.util().addEvent(window, "resize", this.scrollHandler), this.interval = setInterval(this.scrollCallback, 50)), this.config.live ? new a(function (a) {
					return function (b) {
						var c, d, e, f, g;
						for (g = [], c = 0, d = b.length; d > c; c++) f = b[c], g.push(function () {
							var a, b, c, d;
							for (c = f.addedNodes || [], d = [], a = 0, b = c.length; b > a; a++) e = c[a], d.push(this.doSync(e));
							return d
						}.call(a));
						return g
					}
				}(this)).observe(document.body, {
					childList: !0,
					subtree: !0
				}) : void 0
			}, e.prototype.stop = function () {
				return this.stopped = !0, this.util().removeEvent(window, "scroll", this.scrollHandler), this.util().removeEvent(window, "resize", this.scrollHandler), null != this.interval ? clearInterval(this.interval) : void 0
			}, e.prototype.sync = function () {
				return a.notSupported ? this.doSync(this.element) : void 0
			}, e.prototype.doSync = function (a) {
				var b, c, d, e, f;
				if (null == a && (a = this.element), 1 === a.nodeType) {
					for (a = a.parentNode || a, e = a.querySelectorAll("." + this.config.boxClass), f = [], c = 0, d = e.length; d > c; c++) b = e[c], g.call(this.all, b) < 0 ? (this.boxes.push(b), this.all.push(b), this.stopped || this.disabled() ? this.resetStyle() : this.applyStyle(b, !0), f.push(this.scrolled = !0)) : f.push(void 0);
					return f
				}
			}, e.prototype.show = function (a) {
				return this.applyStyle(a), a.className = a.className + " " + this.config.animateClass, null != this.config.callback && this.config.callback(a), this.util().emitEvent(a, this.wowEvent), this.util().addEvent(a, "animationend", this.resetAnimation), this.util().addEvent(a, "oanimationend", this.resetAnimation), this.util().addEvent(a, "webkitAnimationEnd", this.resetAnimation), this.util().addEvent(a, "MSAnimationEnd", this.resetAnimation), a
			}, e.prototype.applyStyle = function (a, b) {
				var c, d, e;
				return d = a.getAttribute("data-wow-duration"), c = a.getAttribute("data-wow-delay"), e = a.getAttribute("data-wow-iteration"), this.animate(function (f) {
					return function () {
						return f.customStyle(a, b, d, c, e)
					}
				}(this))
			}, e.prototype.animate = function () {
				return "requestAnimationFrame" in window ? function (a) {
					return window.requestAnimationFrame(a)
				} : function (a) {
					return a()
				}
			}(), e.prototype.resetStyle = function () {
				var a, b, c, d, e;
				for (d = this.boxes, e = [], b = 0, c = d.length; c > b; b++) a = d[b], e.push(a.style.visibility = "visible");
				return e
			}, e.prototype.resetAnimation = function (a) {
				var b;
				return a.type.toLowerCase().indexOf("animationend") >= 0 ? (b = a.target || a.srcElement, b.className = b.className.replace(this.config.animateClass, "").trim()) : void 0
			}, e.prototype.customStyle = function (a, b, c, d, e) {
				return b && this.cacheAnimationName(a), a.style.visibility = b ? "hidden" : "visible", c && this.vendorSet(a.style, {
					animationDuration: c
				}), d && this.vendorSet(a.style, {
					animationDelay: d
				}), e && this.vendorSet(a.style, {
					animationIterationCount: e
				}), this.vendorSet(a.style, {
					animationName: b ? "none" : this.cachedAnimationName(a)
				}), a
			}, e.prototype.vendors = ["moz", "webkit"], e.prototype.vendorSet = function (a, b) {
				var c, d, e, f;
				d = [];
				for (c in b) e = b[c], a["" + c] = e, d.push(function () {
					var b, d, g, h;
					for (g = this.vendors, h = [], b = 0, d = g.length; d > b; b++) f = g[b], h.push(a["" + f + c.charAt(0).toUpperCase() + c.substr(1)] = e);
					return h
				}.call(this));
				return d
			}, e.prototype.vendorCSS = function (a, b) {
				var c, e, f, g, h, i;
				for (h = d(a), g = h.getPropertyCSSValue(b), f = this.vendors, c = 0, e = f.length; e > c; c++) i = f[c], g = g || h.getPropertyCSSValue("-" + i + "-" + b);
				return g
			}, e.prototype.animationName = function (a) {
				var b;
				try {
					b = this.vendorCSS(a, "animation-name").cssText
				} catch (c) {
					b = d(a).getPropertyValue("animation-name")
				}
				return "none" === b ? "" : b
			}, e.prototype.cacheAnimationName = function (a) {
				return this.animationNameCache.set(a, this.animationName(a))
			}, e.prototype.cachedAnimationName = function (a) {
				return this.animationNameCache.get(a)
			}, e.prototype.scrollHandler = function () {
				return this.scrolled = !0
			}, e.prototype.scrollCallback = function () {
				var a;
				return !this.scrolled || (this.scrolled = !1, this.boxes = function () {
					var b, c, d, e;
					for (d = this.boxes, e = [], b = 0, c = d.length; c > b; b++) a = d[b], a && (this.isVisible(a) ? this.show(a) : e.push(a));
					return e
				}.call(this), this.boxes.length || this.config.live) ? void 0 : this.stop()
			}, e.prototype.offsetTop = function (a) {
				for (var b; void 0 === a.offsetTop;) a = a.parentNode;
				for (b = a.offsetTop; a = a.offsetParent;) b += a.offsetTop;
				return b
			}, e.prototype.isVisible = function (a) {
				var b, c, d, e, f;
				return c = a.getAttribute("data-wow-offset") || this.config.offset, f = window.pageYOffset, e = f + Math.min(this.element.clientHeight, this.util().innerHeight()) - c, d = this.offsetTop(a), b = d + a.clientHeight, e >= d && b >= f
			}, e.prototype.util = function () {
				return null != this._util ? this._util : this._util = new b
			}, e.prototype.disabled = function () {
				return !this.config.mobile && this.util().isMobile(navigator.userAgent)
			}, e
		}()
	}.call(this), + function (a) {
		"use strict";
		var b = function (c, d) {
			var e = this;
			this.$element = a(c), this.options = a.extend({}, b.DEFAULTS, this.$element.data(), d);
			var f = new Number(this.$element.val());
			isNaN(f) && this.$element.val(this.options.min), 1 == this.options.strict && (this.$element.on("keypress", function (b) {
				if (45 == b.which || 40 == b.keyCode) return e.decrease(), !1;
				if (43 == b.which || 38 == b.keyCode) return e.increase(), !1;
				if (!(-1 !== a.inArray(b.keyCode, [8, 46, 9, 27, 13, 36, 35, 37, 39]) || 65 == b.which && b.ctrlKey === !0 || e.options.precision > 0 && -1 == e.$element.val().indexOf(".") && 46 == b.which)) return b.which < 48 || b.which > 57 ? !1 : void 0
			}), this.$element.on("blur", function () {
				e.change(e.$element.val())
			}))
		};
		b.DEFAULTS = {
			step: 1,
			min: 0,
			max: 1 / 0,
			precision: 0,
			strict: !0
		}, b.prototype.increase = function () {
			this.step(this.options.step)
		}, b.prototype.decrease = function () {
			this.step(-this.options.step)
		}, b.prototype.step = function (a) {
			if ("number" != typeof a && (a = new Number(a)), !isNaN(a)) {
				var b = new Number(this.$element.val());
				isNaN(b) && (b = this.options.min), this.change(b + a)
			}
		}, b.prototype.change = function (b) {
			"number" != typeof b && (b = new Number(b)), isNaN(b) && (b = this.options.min), b < this.options.min && (b = this.options.min), b > this.options.max && (b = this.options.max);
			var c = a.Event("change.bs.spinner", {
				value: b
			});
			this.$element.trigger(c), c = a.Event("changed.bs.spinner"), this.$element.val(b.toFixed(this.options.precision)).change().trigger(c)
		}, b.prototype.setOptions = function (b) {
			"object" == typeof b && (this.options = a.extend({}, this.options, b))
		};
		var c = a.fn.spinner;
		a.fn.spinner = function (c, d) {
			return this.each(function () {
				var e = a(this),
					f = e.data("bs.spinner"),
					g = "object" == typeof f,
					h = "object" == typeof c && c;
				f || e.data("bs.spinner", f = new b(this, h)), "object" == typeof c && 0 == g ? f.setOptions(c) : "number" == typeof c ? f.step(c) : "string" == typeof c && f[c](d)
			})
		}, a.fn.spinner.Constructor = b;
		var d = function (b) {
			var c = a(this),
				d = c.attr("href"),
				e = a(c.attr("data-target") || d && d.replace(/.*(?=#[^\s]+$)/, "")),
				f = c.data("value");
			c.is("a") && b.preventDefault(), e.spinner(f)
		};
		a.fn.spinner.noConflict = function () {
			return a.fn.spinner = c, this
		}, a(document).on("click.bs.spinner.data-api", '[data-toggle="spinner"][data-on!="mousehold"]', d).on("mousehold.bs.spinner.data-api", '[data-toggle="spinner"]', d), a(window).on("load", function () {
			a('[data-ride="spinner"]').each(function () {
				a(this).spinner()
			})
		})
	}(jQuery), + function (a) {
		"use strict";
		a.fn.mousehold = function (b) {
			b = "undefined" != typeof b ? b : 100;
			var c = 0,
				d = 0,
				e = void 0,
				f = a.Event("mousehold", {
					counter: 0
				});
			return this.each(function () {
				a(this).mousedown(function () {
					d = 1;
					var e = this;
					c = setInterval(function () {
						f.counter++, a(e).trigger(f), d = 2
					}, b)
				}), e = function () {
					clearInterval(c), 1 == d && (f.counter = 1, a(this).trigger(f)), d = 0
				}, a(this).mouseout(e), a(this).mouseup(e)
			})
		}, a(window).on("load", function () {
			a('[data-on="mousehold"]').each(function () {
				var b = a(this);
				b.mousehold(b.data("timeout"))
			})
		})
	}(jQuery),
	function () {
		var a, b, c, d, e = [].slice,
			f = function (a, b) {
				return function () {
					return a.apply(b, arguments)
				}
			},
			g = {}.hasOwnProperty,
			h = function (a, b) {
				function c() {
					this.constructor = a
				}
				for (var d in b) g.call(b, d) && (a[d] = b[d]);
				return c.prototype = b.prototype, a.prototype = new c, a.__super__ = b.prototype, a
			},
			i = [].indexOf || function (a) {
				for (var b = 0, c = this.length; c > b; b++)
					if (b in this && this[b] === a) return b;
				return -1
			};
		b = window.Morris = {}, a = jQuery, b.EventEmitter = function () {
			function a() {}
			return a.prototype.on = function (a, b) {
				return null == this.handlers && (this.handlers = {}), null == this.handlers[a] && (this.handlers[a] = []), this.handlers[a].push(b), this
			}, a.prototype.fire = function () {
				var a, b, c, d, f, g, h;
				if (c = arguments[0], a = 2 <= arguments.length ? e.call(arguments, 1) : [], null != this.handlers && null != this.handlers[c]) {
					for (g = this.handlers[c], h = [], d = 0, f = g.length; f > d; d++) b = g[d], h.push(b.apply(null, a));
					return h
				}
			}, a
		}(), b.commas = function (a) {
			var b, c, d, e;
			return null != a ? (d = 0 > a ? "-" : "", b = Math.abs(a), c = Math.floor(b).toFixed(0), d += c.replace(/(?=(?:\d{3})+$)(?!^)/g, ","), e = b.toString(), e.length > c.length && (d += e.slice(c.length)), d) : "-"
		}, b.pad2 = function (a) {
			return (10 > a ? "0" : "") + a
		}, b.Grid = function (c) {
			function d(b) {
				this.resizeHandler = f(this.resizeHandler, this);
				var c = this;
				if (this.el = a("string" == typeof b.element ? document.getElementById(b.element) : b.element), null == this.el || 0 === this.el.length) throw new Error("Graph container element not found " + b.element);
				"static" === this.el.css("position") && this.el.css("position", "relative"), this.options = a.extend({}, this.gridDefaults, this.defaults || {}, b), "string" == typeof this.options.units && (this.options.postUnits = b.units), this.raphael = new Raphael(this.el[0]), this.elementWidth = null, this.elementHeight = null, this.dirty = !1, this.selectFrom = null, this.init && this.init(), this.setData(this.options.data), this.el.bind("mousemove", function (a) {
					var b, d, e, f, g;
					return d = c.el.offset(), g = a.pageX - d.left, c.selectFrom ? (b = c.data[c.hitTest(Math.min(g, c.selectFrom))]._x, e = c.data[c.hitTest(Math.max(g, c.selectFrom))]._x, f = e - b, c.selectionRect.attr({
						x: b,
						width: f
					})) : c.fire("hovermove", g, a.pageY - d.top)
				}), this.el.bind("mouseleave", function () {
					return c.selectFrom && (c.selectionRect.hide(), c.selectFrom = null), c.fire("hoverout")
				}), this.el.bind("touchstart touchmove touchend", function (a) {
					var b, d;
					return d = a.originalEvent.touches[0] || a.originalEvent.changedTouches[0], b = c.el.offset(), c.fire("hovermove", d.pageX - b.left, d.pageY - b.top)
				}), this.el.bind("click", function (a) {
					var b;
					return b = c.el.offset(), c.fire("gridclick", a.pageX - b.left, a.pageY - b.top)
				}), this.options.rangeSelect && (this.selectionRect = this.raphael.rect(0, 0, 0, this.el.innerHeight()).attr({
					fill: this.options.rangeSelectColor,
					stroke: !1
				}).toBack().hide(), this.el.bind("mousedown", function (a) {
					var b;
					return b = c.el.offset(), c.startRange(a.pageX - b.left)
				}), this.el.bind("mouseup", function (a) {
					var b;
					return b = c.el.offset(), c.endRange(a.pageX - b.left), c.fire("hovermove", a.pageX - b.left, a.pageY - b.top)
				})), this.options.resize && a(window).bind("resize", function () {
					return null != c.timeoutId && window.clearTimeout(c.timeoutId), c.timeoutId = window.setTimeout(c.resizeHandler, 100)
				}), this.el.css("-webkit-tap-highlight-color", "rgba(0,0,0,0)"), this.postInit && this.postInit()
			}
			return h(d, c), d.prototype.gridDefaults = {
				dateFormat: null,
				axes: !0,
				grid: !0,
				gridLineColor: "#aaa",
				gridStrokeWidth: .5,
				gridTextColor: "#888",
				gridTextSize: 12,
				gridTextFamily: "sans-serif",
				gridTextWeight: "normal",
				hideHover: !1,
				yLabelFormat: null,
				xLabelAngle: 0,
				numLines: 5,
				padding: 25,
				parseTime: !0,
				postUnits: "",
				preUnits: "",
				ymax: "auto",
				ymin: "auto 0",
				goals: [],
				goalStrokeWidth: 1,
				goalLineColors: ["#666633", "#999966", "#cc6666", "#663333"],
				events: [],
				eventStrokeWidth: 1,
				eventLineColors: ["#005a04", "#ccffbb", "#3a5f0b", "#005502"],
				rangeSelect: null,
				rangeSelectColor: "#eef",
				resize: !1
			}, d.prototype.setData = function (a, c) {
				var d, e, f, g, h, i, j, k, l, m, n, o, p, q, r;
				return null == c && (c = !0), this.options.data = a, null == a || 0 === a.length ? (this.data = [], this.raphael.clear(), void(null != this.hover && this.hover.hide())) : (o = this.cumulative ? 0 : null, p = this.cumulative ? 0 : null, this.options.goals.length > 0 && (h = Math.min.apply(Math, this.options.goals), g = Math.max.apply(Math, this.options.goals), p = null != p ? Math.min(p, h) : h, o = null != o ? Math.max(o, g) : g), this.data = function () {
					var c, d, g;
					for (g = [], f = c = 0, d = a.length; d > c; f = ++c) j = a[f], i = {
						src: j
					}, i.label = j[this.options.xkey], this.options.parseTime ? (i.x = b.parseDate(i.label), this.options.dateFormat ? i.label = this.options.dateFormat(i.x) : "number" == typeof i.label && (i.label = new Date(i.label).toString())) : (i.x = f, this.options.xLabelFormat && (i.label = this.options.xLabelFormat(i))), l = 0, i.y = function () {
						var a, b, c, d;
						for (c = this.options.ykeys, d = [], e = a = 0, b = c.length; b > a; e = ++a) n = c[e], q = j[n], "string" == typeof q && (q = parseFloat(q)), null != q && "number" != typeof q && (q = null), null != q && (this.cumulative ? l += q : null != o ? (o = Math.max(q, o), p = Math.min(q, p)) : o = p = q), this.cumulative && null != l && (o = Math.max(l, o), p = Math.min(l, p)), d.push(q);
						return d
					}.call(this), g.push(i);
					return g
				}.call(this), this.options.parseTime && (this.data = this.data.sort(function (a, b) {
					return (a.x > b.x) - (b.x > a.x)
				})), this.xmin = this.data[0].x, this.xmax = this.data[this.data.length - 1].x, this.events = [], this.options.events.length > 0 && (this.events = this.options.parseTime ? function () {
					var a, c, e, f;
					for (e = this.options.events, f = [], a = 0, c = e.length; c > a; a++) d = e[a], f.push(b.parseDate(d));
					return f
				}.call(this) : this.options.events, this.xmax = Math.max(this.xmax, Math.max.apply(Math, this.events)), this.xmin = Math.min(this.xmin, Math.min.apply(Math, this.events))), this.xmin === this.xmax && (this.xmin -= 1, this.xmax += 1), this.ymin = this.yboundary("min", p), this.ymax = this.yboundary("max", o), this.ymin === this.ymax && (p && (this.ymin -= 1), this.ymax += 1), ((r = this.options.axes) === !0 || "both" === r || "y" === r || this.options.grid === !0) && (this.options.ymax === this.gridDefaults.ymax && this.options.ymin === this.gridDefaults.ymin ? (this.grid = this.autoGridLines(this.ymin, this.ymax, this.options.numLines), this.ymin = Math.min(this.ymin, this.grid[0]), this.ymax = Math.max(this.ymax, this.grid[this.grid.length - 1])) : (k = (this.ymax - this.ymin) / (this.options.numLines - 1), this.grid = function () {
					var a, b, c, d;
					for (d = [], m = a = b = this.ymin, c = this.ymax; k > 0 ? c >= a : a >= c; m = a += k) d.push(m);
					return d
				}.call(this))), this.dirty = !0, c ? this.redraw() : void 0)
			}, d.prototype.yboundary = function (a, b) {
				var c, d;
				return c = this.options["y" + a], "string" == typeof c ? "auto" === c.slice(0, 4) ? c.length > 5 ? (d = parseInt(c.slice(5), 10), null == b ? d : Math[a](b, d)) : null != b ? b : 0 : parseInt(c, 10) : c
			}, d.prototype.autoGridLines = function (a, b, c) {
				var d, e, f, g, h, i, j, k, l;
				return h = b - a, l = Math.floor(Math.log(h) / Math.log(10)), j = Math.pow(10, l), e = Math.floor(a / j) * j, d = Math.ceil(b / j) * j, i = (d - e) / (c - 1), 1 === j && i > 1 && Math.ceil(i) !== i && (i = Math.ceil(i), d = e + i * (c - 1)), 0 > e && d > 0 && (e = Math.floor(a / i) * i, d = Math.ceil(b / i) * i), 1 > i ? (g = Math.floor(Math.log(i) / Math.log(10)), f = function () {
					var a, b;
					for (b = [], k = a = e; i > 0 ? d >= a : a >= d; k = a += i) b.push(parseFloat(k.toFixed(1 - g)));
					return b
				}()) : f = function () {
					var a, b;
					for (b = [], k = a = e; i > 0 ? d >= a : a >= d; k = a += i) b.push(k);
					return b
				}(), f
			}, d.prototype._calc = function () {
				var a, b, c, d, e, f, g, h;
				return e = this.el.width(), c = this.el.height(), (this.elementWidth !== e || this.elementHeight !== c || this.dirty) && (this.elementWidth = e, this.elementHeight = c, this.dirty = !1, this.left = this.options.padding, this.right = this.elementWidth - this.options.padding, this.top = this.options.padding, this.bottom = this.elementHeight - this.options.padding, ((g = this.options.axes) === !0 || "both" === g || "y" === g) && (f = function () {
					var a, c, d, e;
					for (d = this.grid, e = [], a = 0, c = d.length; c > a; a++) b = d[a], e.push(this.measureText(this.yAxisFormat(b)).width);
					return e
				}.call(this), this.left += Math.max.apply(Math, f)), ((h = this.options.axes) === !0 || "both" === h || "x" === h) && (a = function () {
					var a, b, c;
					for (c = [], d = a = 0, b = this.data.length; b >= 0 ? b > a : a > b; d = b >= 0 ? ++a : --a) c.push(this.measureText(this.data[d].text, -this.options.xLabelAngle).height);
					return c
				}.call(this), this.bottom -= Math.max.apply(Math, a)), this.width = Math.max(1, this.right - this.left), this.height = Math.max(1, this.bottom - this.top), this.dx = this.width / (this.xmax - this.xmin), this.dy = this.height / (this.ymax - this.ymin), this.calc) ? this.calc() : void 0
			}, d.prototype.transY = function (a) {
				return this.bottom - (a - this.ymin) * this.dy
			}, d.prototype.transX = function (a) {
				return 1 === this.data.length ? (this.left + this.right) / 2 : this.left + (a - this.xmin) * this.dx
			}, d.prototype.redraw = function () {
				return this.raphael.clear(), this._calc(), this.drawGrid(), this.drawGoals(), this.drawEvents(), this.draw ? this.draw() : void 0
			}, d.prototype.measureText = function (a, b) {
				var c, d;
				return null == b && (b = 0), d = this.raphael.text(100, 100, a).attr("font-size", this.options.gridTextSize).attr("font-family", this.options.gridTextFamily).attr("font-weight", this.options.gridTextWeight).rotate(b), c = d.getBBox(), d.remove(), c
			}, d.prototype.yAxisFormat = function (a) {
				return this.yLabelFormat(a)
			}, d.prototype.yLabelFormat = function (a) {
				return "function" == typeof this.options.yLabelFormat ? this.options.yLabelFormat(a) : "" + this.options.preUnits + b.commas(a) + this.options.postUnits
			}, d.prototype.drawGrid = function () {
				var a, b, c, d, e, f, g, h;
				if (this.options.grid !== !1 || (e = this.options.axes) === !0 || "both" === e || "y" === e) {
					for (f = this.grid, h = [], c = 0, d = f.length; d > c; c++) a = f[c], b = this.transY(a), ((g = this.options.axes) === !0 || "both" === g || "y" === g) && this.drawYAxisLabel(this.left - this.options.padding / 2, b, this.yAxisFormat(a)), h.push(this.options.grid ? this.drawGridLine("M" + this.left + "," + b + "H" + (this.left + this.width)) : void 0);
					return h
				}
			}, d.prototype.drawGoals = function () {
				var a, b, c, d, e, f, g;
				for (f = this.options.goals, g = [], c = d = 0, e = f.length; e > d; c = ++d) b = f[c], a = this.options.goalLineColors[c % this.options.goalLineColors.length], g.push(this.drawGoal(b, a));
				return g
			}, d.prototype.drawEvents = function () {
				var a, b, c, d, e, f, g;
				for (f = this.events, g = [], c = d = 0, e = f.length; e > d; c = ++d) b = f[c], a = this.options.eventLineColors[c % this.options.eventLineColors.length], g.push(this.drawEvent(b, a));
				return g
			}, d.prototype.drawGoal = function (a, b) {
				return this.raphael.path("M" + this.left + "," + this.transY(a) + "H" + this.right).attr("stroke", b).attr("stroke-width", this.options.goalStrokeWidth)
			}, d.prototype.drawEvent = function (a, b) {
				return this.raphael.path("M" + this.transX(a) + "," + this.bottom + "V" + this.top).attr("stroke", b).attr("stroke-width", this.options.eventStrokeWidth)
			}, d.prototype.drawYAxisLabel = function (a, b, c) {
				return this.raphael.text(a, b, c).attr("font-size", this.options.gridTextSize).attr("font-family", this.options.gridTextFamily).attr("font-weight", this.options.gridTextWeight).attr("fill", this.options.gridTextColor).attr("text-anchor", "end")
			}, d.prototype.drawGridLine = function (a) {
				return this.raphael.path(a).attr("stroke", this.options.gridLineColor).attr("stroke-width", this.options.gridStrokeWidth)
			}, d.prototype.startRange = function (a) {
				return this.hover.hide(), this.selectFrom = a, this.selectionRect.attr({
					x: a,
					width: 0
				}).show()
			}, d.prototype.endRange = function (a) {
				var b, c;
				return this.selectFrom ? (c = Math.min(this.selectFrom, a), b = Math.max(this.selectFrom, a), this.options.rangeSelect.call(this.el, {
					start: this.data[this.hitTest(c)].x,
					end: this.data[this.hitTest(b)].x
				}), this.selectFrom = null) : void 0
			}, d.prototype.resizeHandler = function () {
				return this.timeoutId = null, this.raphael.setSize(this.el.width(), this.el.height()), this.redraw()
			}, d
		}(b.EventEmitter), b.parseDate = function (a) {
			var b, c, d, e, f, g, h, i, j, k, l;
			return "number" == typeof a ? a : (c = a.match(/^(\d+) Q(\d)$/), e = a.match(/^(\d+)-(\d+)$/), f = a.match(/^(\d+)-(\d+)-(\d+)$/), h = a.match(/^(\d+) W(\d+)$/), i = a.match(/^(\d+)-(\d+)-(\d+)[ T](\d+):(\d+)(Z|([+-])(\d\d):?(\d\d))?$/), j = a.match(/^(\d+)-(\d+)-(\d+)[ T](\d+):(\d+):(\d+(\.\d+)?)(Z|([+-])(\d\d):?(\d\d))?$/), c ? new Date(parseInt(c[1], 10), 3 * parseInt(c[2], 10) - 1, 1).getTime() : e ? new Date(parseInt(e[1], 10), parseInt(e[2], 10) - 1, 1).getTime() : f ? new Date(parseInt(f[1], 10), parseInt(f[2], 10) - 1, parseInt(f[3], 10)).getTime() : h ? (k = new Date(parseInt(h[1], 10), 0, 1), 4 !== k.getDay() && k.setMonth(0, 1 + (4 - k.getDay() + 7) % 7), k.getTime() + 6048e5 * parseInt(h[2], 10)) : i ? i[6] ? (g = 0, "Z" !== i[6] && (g = 60 * parseInt(i[8], 10) + parseInt(i[9], 10), "+" === i[7] && (g = 0 - g)), Date.UTC(parseInt(i[1], 10), parseInt(i[2], 10) - 1, parseInt(i[3], 10), parseInt(i[4], 10), parseInt(i[5], 10) + g)) : new Date(parseInt(i[1], 10), parseInt(i[2], 10) - 1, parseInt(i[3], 10), parseInt(i[4], 10), parseInt(i[5], 10)).getTime() : j ? (l = parseFloat(j[6]), b = Math.floor(l), d = Math.round(1e3 * (l - b)), j[8] ? (g = 0, "Z" !== j[8] && (g = 60 * parseInt(j[10], 10) + parseInt(j[11], 10), "+" === j[9] && (g = 0 - g)), Date.UTC(parseInt(j[1], 10), parseInt(j[2], 10) - 1, parseInt(j[3], 10), parseInt(j[4], 10), parseInt(j[5], 10) + g, b, d)) : new Date(parseInt(j[1], 10), parseInt(j[2], 10) - 1, parseInt(j[3], 10), parseInt(j[4], 10), parseInt(j[5], 10), b, d).getTime()) : new Date(parseInt(a, 10), 0, 1).getTime())
		}, b.Hover = function () {
			function c(c) {
				null == c && (c = {}), this.options = a.extend({}, b.Hover.defaults, c), this.el = a("<div class='" + this.options["class"] + "'></div>"), this.el.hide(), this.options.parent.append(this.el)
			}
			return c.defaults = {
				"class": "morris-hover morris-default-style"
			}, c.prototype.update = function (a, b, c) {
				return a ? (this.html(a), this.show(), this.moveTo(b, c)) : this.hide()
			}, c.prototype.html = function (a) {
				return this.el.html(a)
			}, c.prototype.moveTo = function (a, b) {
				var c, d, e, f, g, h;
				return g = this.options.parent.innerWidth(), f = this.options.parent.innerHeight(), d = this.el.outerWidth(), c = this.el.outerHeight(), e = Math.min(Math.max(0, a - d / 2), g - d), null != b ? (h = b - c - 10, 0 > h && (h = b + 10, h + c > f && (h = f / 2 - c / 2))) : h = f / 2 - c / 2, this.el.css({
					left: e + "px",
					top: parseInt(h) + "px"
				})
			}, c.prototype.show = function () {
				return this.el.show()
			}, c.prototype.hide = function () {
				return this.el.hide()
			}, c
		}(), b.Line = function (a) {
			function c(a) {
				return this.hilight = f(this.hilight, this), this.onHoverOut = f(this.onHoverOut, this), this.onHoverMove = f(this.onHoverMove, this), this.onGridClick = f(this.onGridClick, this), this instanceof b.Line ? void c.__super__.constructor.call(this, a) : new b.Line(a)
			}
			return h(c, a), c.prototype.init = function () {
				return "always" !== this.options.hideHover ? (this.hover = new b.Hover({
					parent: this.el
				}), this.on("hovermove", this.onHoverMove), this.on("hoverout", this.onHoverOut), this.on("gridclick", this.onGridClick)) : void 0
			}, c.prototype.defaults = {
				lineWidth: 3,
				pointSize: 4,
				lineColors: ["#0b62a4", "#7A92A3", "#4da74d", "#afd8f8", "#edc240", "#cb4b4b", "#9440ed"],
				pointStrokeWidths: [1],
				pointStrokeColors: ["#ffffff"],
				pointFillColors: [],
				smooth: !0,
				xLabels: "auto",
				xLabelFormat: null,
				xLabelMargin: 24,
				hideHover: !1
			}, c.prototype.calc = function () {
				return this.calcPoints(), this.generatePaths()
			}, c.prototype.calcPoints = function () {
				var a, b, c, d, e, f;
				for (e = this.data, f = [], c = 0, d = e.length; d > c; c++) a = e[c], a._x = this.transX(a.x), a._y = function () {
					var c, d, e, f;
					for (e = a.y, f = [], c = 0, d = e.length; d > c; c++) b = e[c], f.push(null != b ? this.transY(b) : b);
					return f
				}.call(this), f.push(a._ymax = Math.min.apply(Math, [this.bottom].concat(function () {
					var c, d, e, f;
					for (e = a._y, f = [], c = 0, d = e.length; d > c; c++) b = e[c], null != b && f.push(b);
					return f
				}())));
				return f
			}, c.prototype.hitTest = function (a) {
				var b, c, d, e, f;
				if (0 === this.data.length) return null;
				for (f = this.data.slice(1), b = d = 0, e = f.length; e > d && (c = f[b], !(a < (c._x + this.data[b]._x) / 2)); b = ++d);
				return b
			}, c.prototype.onGridClick = function (a, b) {
				var c;
				return c = this.hitTest(a), this.fire("click", c, this.data[c].src, a, b)
			}, c.prototype.onHoverMove = function (a) {
				var b;
				return b = this.hitTest(a), this.displayHoverForRow(b)
			}, c.prototype.onHoverOut = function () {
				return this.options.hideHover !== !1 ? this.displayHoverForRow(null) : void 0
			}, c.prototype.displayHoverForRow = function (a) {
				var b;
				return null != a ? ((b = this.hover).update.apply(b, this.hoverContentForRow(a)), this.hilight(a)) : (this.hover.hide(), this.hilight())
			}, c.prototype.hoverContentForRow = function (a) {
				var b, c, d, e, f, g, h;
				for (d = this.data[a], b = "<div class='morris-hover-row-label'>" + d.label + "</div>", h = d.y, c = f = 0, g = h.length; g > f; c = ++f) e = h[c], b += "<div class='morris-hover-point' style='color: " + this.colorFor(d, c, "label") + "'>\n  " + this.options.labels[c] + ":\n  " + this.yLabelFormat(e) + "\n</div>";
				return "function" == typeof this.options.hoverCallback && (b = this.options.hoverCallback(a, this.options, b, d.src)), [b, d._x, d._ymax]
			}, c.prototype.generatePaths = function () {
				var a, c, d, e;
				return this.paths = function () {
					var f, g, h, j;
					for (j = [], c = f = 0, g = this.options.ykeys.length; g >= 0 ? g > f : f > g; c = g >= 0 ? ++f : --f) e = "boolean" == typeof this.options.smooth ? this.options.smooth : (h = this.options.ykeys[c], i.call(this.options.smooth, h) >= 0), a = function () {
						var a, b, e, f;
						for (e = this.data, f = [], a = 0, b = e.length; b > a; a++) d = e[a], void 0 !== d._y[c] && f.push({
							x: d._x,
							y: d._y[c]
						});
						return f
					}.call(this), j.push(a.length > 1 ? b.Line.createPath(a, e, this.bottom) : null);
					return j
				}.call(this)
			}, c.prototype.draw = function () {
				var a;
				return ((a = this.options.axes) === !0 || "both" === a || "x" === a) && this.drawXAxis(), this.drawSeries(), this.options.hideHover === !1 ? this.displayHoverForRow(this.data.length - 1) : void 0
			}, c.prototype.drawXAxis = function () {
				var a, c, d, e, f, g, h, i, j, k, l = this;
				for (h = this.bottom + this.options.padding / 2, f = null, e = null, a = function (a, b) {
						var c, d, g, i, j;
						return c = l.drawXAxisLabel(l.transX(b), h, a), j = c.getBBox(), c.transform("r" + -l.options.xLabelAngle), d = c.getBBox(), c.transform("t0," + d.height / 2 + "..."), 0 !== l.options.xLabelAngle && (i = -.5 * j.width * Math.cos(l.options.xLabelAngle * Math.PI / 180), c.transform("t" + i + ",0...")), d = c.getBBox(), (null == f || f >= d.x + d.width || null != e && e >= d.x) && d.x >= 0 && d.x + d.width < l.el.width() ? (0 !== l.options.xLabelAngle && (g = 1.25 * l.options.gridTextSize / Math.sin(l.options.xLabelAngle * Math.PI / 180), e = d.x - g), f = d.x - l.options.xLabelMargin) : c.remove()
					}, d = this.options.parseTime ? 1 === this.data.length && "auto" === this.options.xLabels ? [
						[this.data[0].label, this.data[0].x]
					] : b.labelSeries(this.xmin, this.xmax, this.width, this.options.xLabels, this.options.xLabelFormat) : function () {
						var a, b, c, d;
						for (c = this.data, d = [], a = 0, b = c.length; b > a; a++) g = c[a], d.push([g.label, g.x]);
						return d
					}.call(this), d.reverse(), k = [], i = 0, j = d.length; j > i; i++) c = d[i], k.push(a(c[0], c[1]));
				return k
			}, c.prototype.drawSeries = function () {
				var a, b, c, d, e, f;
				for (this.seriesPoints = [], a = b = d = this.options.ykeys.length - 1; 0 >= d ? 0 >= b : b >= 0; a = 0 >= d ? ++b : --b) this._drawLineFor(a);
				for (f = [], a = c = e = this.options.ykeys.length - 1; 0 >= e ? 0 >= c : c >= 0; a = 0 >= e ? ++c : --c) f.push(this._drawPointFor(a));
				return f
			}, c.prototype._drawPointFor = function (a) {
				var b, c, d, e, f, g;
				for (this.seriesPoints[a] = [], f = this.data, g = [], d = 0, e = f.length; e > d; d++) c = f[d], b = null, null != c._y[a] && (b = this.drawLinePoint(c._x, c._y[a], this.colorFor(c, a, "point"), a)), g.push(this.seriesPoints[a].push(b));
				return g
			}, c.prototype._drawLineFor = function (a) {
				var b;
				return b = this.paths[a], null !== b ? this.drawLinePath(b, this.colorFor(null, a, "line"), a) : void 0
			}, c.createPath = function (a, c, d) {
				var e, f, g, h, i, j, k, l, m, n, o, p, q, r;
				for (k = "", c && (g = b.Line.gradients(a)), l = {
						y: null
					}, h = q = 0, r = a.length; r > q; h = ++q) e = a[h], null != e.y && (null != l.y ? c ? (f = g[h], j = g[h - 1], i = (e.x - l.x) / 4, m = l.x + i, o = Math.min(d, l.y + i * j), n = e.x - i, p = Math.min(d, e.y - i * f), k += "C" + m + "," + o + "," + n + "," + p + "," + e.x + "," + e.y) : k += "L" + e.x + "," + e.y : c && null == g[h] || (k += "M" + e.x + "," + e.y)), l = e;
				return k
			}, c.gradients = function (a) {
				var b, c, d, e, f, g, h, i;
				for (c = function (a, b) {
						return (a.y - b.y) / (a.x - b.x)
					}, i = [], d = g = 0, h = a.length; h > g; d = ++g) b = a[d], null != b.y ? (e = a[d + 1] || {
					y: null
				}, f = a[d - 1] || {
					y: null
				}, i.push(null != f.y && null != e.y ? c(f, e) : null != f.y ? c(f, b) : null != e.y ? c(b, e) : null)) : i.push(null);
				return i
			}, c.prototype.hilight = function (a) {
				var b, c, d, e, f;
				if (null !== this.prevHilight && this.prevHilight !== a)
					for (b = c = 0, e = this.seriesPoints.length - 1; e >= 0 ? e >= c : c >= e; b = e >= 0 ? ++c : --c) this.seriesPoints[b][this.prevHilight] && this.seriesPoints[b][this.prevHilight].animate(this.pointShrinkSeries(b));
				if (null !== a && this.prevHilight !== a)
					for (b = d = 0, f = this.seriesPoints.length - 1; f >= 0 ? f >= d : d >= f; b = f >= 0 ? ++d : --d) this.seriesPoints[b][a] && this.seriesPoints[b][a].animate(this.pointGrowSeries(b));
				return this.prevHilight = a
			}, c.prototype.colorFor = function (a, b, c) {
				return "function" == typeof this.options.lineColors ? this.options.lineColors.call(this, a, b, c) : "point" === c ? this.options.pointFillColors[b % this.options.pointFillColors.length] || this.options.lineColors[b % this.options.lineColors.length] : this.options.lineColors[b % this.options.lineColors.length]
			}, c.prototype.drawXAxisLabel = function (a, b, c) {
				return this.raphael.text(a, b, c).attr("font-size", this.options.gridTextSize).attr("font-family", this.options.gridTextFamily).attr("font-weight", this.options.gridTextWeight).attr("fill", this.options.gridTextColor)
			}, c.prototype.drawLinePath = function (a, b, c) {
				return this.raphael.path(a).attr("stroke", b).attr("stroke-width", this.lineWidthForSeries(c))
			}, c.prototype.drawLinePoint = function (a, b, c, d) {
				return this.raphael.circle(a, b, this.pointSizeForSeries(d)).attr("fill", c).attr("stroke-width", this.pointStrokeWidthForSeries(d)).attr("stroke", this.pointStrokeColorForSeries(d))
			}, c.prototype.pointStrokeWidthForSeries = function (a) {
				return this.options.pointStrokeWidths[a % this.options.pointStrokeWidths.length]
			}, c.prototype.pointStrokeColorForSeries = function (a) {
				return this.options.pointStrokeColors[a % this.options.pointStrokeColors.length]
			}, c.prototype.lineWidthForSeries = function (a) {
				return this.options.lineWidth instanceof Array ? this.options.lineWidth[a % this.options.lineWidth.length] : this.options.lineWidth
			}, c.prototype.pointSizeForSeries = function (a) {
				return this.options.pointSize instanceof Array ? this.options.pointSize[a % this.options.pointSize.length] : this.options.pointSize
			}, c.prototype.pointGrowSeries = function (a) {
				return Raphael.animation({
					r: this.pointSizeForSeries(a) + 3
				}, 25, "linear")
			}, c.prototype.pointShrinkSeries = function (a) {
				return Raphael.animation({
					r: this.pointSizeForSeries(a)
				}, 25, "linear")
			}, c
		}(b.Grid), b.labelSeries = function (c, d, e, f, g) {
			var h, i, j, k, l, m, n, o, p, q, r;
			if (j = 200 * (d - c) / e, i = new Date(c), n = b.LABEL_SPECS[f], void 0 === n)
				for (r = b.AUTO_LABEL_ORDER, p = 0, q = r.length; q > p; p++)
					if (k = r[p], m = b.LABEL_SPECS[k], j >= m.span) {
						n = m;
						break
					}
			for (void 0 === n && (n = b.LABEL_SPECS.second), g && (n = a.extend({}, n, {
					fmt: g
				})), h = n.start(i), l = [];
				(o = h.getTime()) <= d;) o >= c && l.push([n.fmt(h), o]), n.incr(h);
			return l
		}, c = function (a) {
			return {
				span: 60 * a * 1e3,
				start: function (a) {
					return new Date(a.getFullYear(), a.getMonth(), a.getDate(), a.getHours())
				},
				fmt: function (a) {
					return "" + b.pad2(a.getHours()) + ":" + b.pad2(a.getMinutes())
				},
				incr: function (b) {
					return b.setUTCMinutes(b.getUTCMinutes() + a)
				}
			}
		}, d = function (a) {
			return {
				span: 1e3 * a,
				start: function (a) {
					return new Date(a.getFullYear(), a.getMonth(), a.getDate(), a.getHours(), a.getMinutes())
				},
				fmt: function (a) {
					return "" + b.pad2(a.getHours()) + ":" + b.pad2(a.getMinutes()) + ":" + b.pad2(a.getSeconds())
				},
				incr: function (b) {
					return b.setUTCSeconds(b.getUTCSeconds() + a)
				}
			}
		}, b.LABEL_SPECS = {
			decade: {
				span: 1728e8,
				start: function (a) {
					return new Date(a.getFullYear() - a.getFullYear() % 10, 0, 1)
				},
				fmt: function (a) {
					return "" + a.getFullYear()
				},
				incr: function (a) {
					return a.setFullYear(a.getFullYear() + 10)
				}
			},
			year: {
				span: 1728e7,
				start: function (a) {
					return new Date(a.getFullYear(), 0, 1)
				},
				fmt: function (a) {
					return "" + a.getFullYear()
				},
				incr: function (a) {
					return a.setFullYear(a.getFullYear() + 1)
				}
			},
			month: {
				span: 24192e5,
				start: function (a) {
					return new Date(a.getFullYear(), a.getMonth(), 1)
				},
				fmt: function (a) {
					return "" + a.getFullYear() + "-" + b.pad2(a.getMonth() + 1)
				},
				incr: function (a) {
					return a.setMonth(a.getMonth() + 1)
				}
			},
			week: {
				span: 6048e5,
				start: function (a) {
					return new Date(a.getFullYear(), a.getMonth(), a.getDate())
				},
				fmt: function (a) {
					return "" + a.getFullYear() + "-" + b.pad2(a.getMonth() + 1) + "-" + b.pad2(a.getDate())
				},
				incr: function (a) {
					return a.setDate(a.getDate() + 7)
				}
			},
			day: {
				span: 864e5,
				start: function (a) {
					return new Date(a.getFullYear(), a.getMonth(), a.getDate())
				},
				fmt: function (a) {
					return "" + a.getFullYear() + "-" + b.pad2(a.getMonth() + 1) + "-" + b.pad2(a.getDate())
				},
				incr: function (a) {
					return a.setDate(a.getDate() + 1)
				}
			},
			hour: c(60),
			"30min": c(30),
			"15min": c(15),
			"10min": c(10),
			"5min": c(5),
			minute: c(1),
			"30sec": d(30),
			"15sec": d(15),
			"10sec": d(10),
			"5sec": d(5),
			second: d(1)
		}, b.AUTO_LABEL_ORDER = ["decade", "year", "month", "week", "day", "hour", "30min", "15min", "10min", "5min", "minute", "30sec", "15sec", "10sec", "5sec", "second"], b.Area = function (c) {
			function d(c) {
				var f;
				return this instanceof b.Area ? (f = a.extend({}, e, c), this.cumulative = !f.behaveLikeLine, "auto" === f.fillOpacity && (f.fillOpacity = f.behaveLikeLine ? .8 : 1), void d.__super__.constructor.call(this, f)) : new b.Area(c)
			}
			var e;
			return h(d, c), e = {
				fillOpacity: "auto",
				behaveLikeLine: !1
			}, d.prototype.calcPoints = function () {
				var a, b, c, d, e, f, g;
				for (f = this.data, g = [], d = 0, e = f.length; e > d; d++) a = f[d], a._x = this.transX(a.x), b = 0, a._y = function () {
					var d, e, f, g;
					for (f = a.y, g = [], d = 0, e = f.length; e > d; d++) c = f[d], this.options.behaveLikeLine ? g.push(this.transY(c)) : (b += c || 0, g.push(this.transY(b)));
					return g
				}.call(this), g.push(a._ymax = Math.max.apply(Math, a._y));
				return g
			}, d.prototype.drawSeries = function () {
				var a, b, c, d, e, f, g, h;
				for (this.seriesPoints = [], b = this.options.behaveLikeLine ? function () {
						f = [];
						for (var a = 0, b = this.options.ykeys.length - 1; b >= 0 ? b >= a : a >= b; b >= 0 ? a++ : a--) f.push(a);
						return f
					}.apply(this) : function () {
						g = [];
						for (var a = e = this.options.ykeys.length - 1; 0 >= e ? 0 >= a : a >= 0; 0 >= e ? a++ : a--) g.push(a);
						return g
					}.apply(this), h = [], c = 0, d = b.length; d > c; c++) a = b[c], this._drawFillFor(a), this._drawLineFor(a), h.push(this._drawPointFor(a));
				return h
			}, d.prototype._drawFillFor = function (a) {
				var b;
				return b = this.paths[a], null !== b ? (b += "L" + this.transX(this.xmax) + "," + this.bottom + "L" + this.transX(this.xmin) + "," + this.bottom + "Z", this.drawFilledPath(b, this.fillForSeries(a))) : void 0
			}, d.prototype.fillForSeries = function (a) {
				var b;
				return b = Raphael.rgb2hsl(this.colorFor(this.data[a], a, "line")), Raphael.hsl(b.h, this.options.behaveLikeLine ? .9 * b.s : .75 * b.s, Math.min(.98, this.options.behaveLikeLine ? 1.2 * b.l : 1.25 * b.l))
			}, d.prototype.drawFilledPath = function (a, b) {
				return this.raphael.path(a).attr("fill", b).attr("fill-opacity", this.options.fillOpacity).attr("stroke", "none")
			}, d
		}(b.Line), b.Bar = function (c) {
			function d(c) {
				return this.onHoverOut = f(this.onHoverOut, this), this.onHoverMove = f(this.onHoverMove, this), this.onGridClick = f(this.onGridClick, this), this instanceof b.Bar ? void d.__super__.constructor.call(this, a.extend({}, c, {
					parseTime: !1
				})) : new b.Bar(c)
			}
			return h(d, c), d.prototype.init = function () {
				return this.cumulative = this.options.stacked, "always" !== this.options.hideHover ? (this.hover = new b.Hover({
					parent: this.el
				}), this.on("hovermove", this.onHoverMove), this.on("hoverout", this.onHoverOut), this.on("gridclick", this.onGridClick)) : void 0
			}, d.prototype.defaults = {
				barSizeRatio: .75,
				barGap: 3,
				barColors: ["#0b62a4", "#7a92a3", "#4da74d", "#afd8f8", "#edc240", "#cb4b4b", "#9440ed"],
				barOpacity: 1,
				barRadius: [0, 0, 0, 0],
				xLabelMargin: 50
			}, d.prototype.calc = function () {
				var a;
				return this.calcBars(), this.options.hideHover === !1 ? (a = this.hover).update.apply(a, this.hoverContentForRow(this.data.length - 1)) : void 0
			}, d.prototype.calcBars = function () {
				var a, b, c, d, e, f, g;
				for (f = this.data, g = [], a = d = 0, e = f.length; e > d; a = ++d) b = f[a], b._x = this.left + this.width * (a + .5) / this.data.length, g.push(b._y = function () {
					var a, d, e, f;
					for (e = b.y, f = [], a = 0, d = e.length; d > a; a++) c = e[a], f.push(null != c ? this.transY(c) : null);
					return f
				}.call(this));
				return g
			}, d.prototype.draw = function () {
				var a;
				return ((a = this.options.axes) === !0 || "both" === a || "x" === a) && this.drawXAxis(), this.drawSeries()
			}, d.prototype.drawXAxis = function () {
				var a, b, c, d, e, f, g, h, i, j, k, l, m;
				for (j = this.bottom + (this.options.xAxisLabelTopPadding || this.options.padding / 2), g = null, f = null, m = [], a = k = 0, l = this.data.length; l >= 0 ? l > k : k > l; a = l >= 0 ? ++k : --k) h = this.data[this.data.length - 1 - a], b = this.drawXAxisLabel(h._x, j, h.label), i = b.getBBox(), b.transform("r" + -this.options.xLabelAngle), c = b.getBBox(), b.transform("t0," + c.height / 2 + "..."), 0 !== this.options.xLabelAngle && (e = -.5 * i.width * Math.cos(this.options.xLabelAngle * Math.PI / 180), b.transform("t" + e + ",0...")), (null == g || g >= c.x + c.width || null != f && f >= c.x) && c.x >= 0 && c.x + c.width < this.el.width() ? (0 !== this.options.xLabelAngle && (d = 1.25 * this.options.gridTextSize / Math.sin(this.options.xLabelAngle * Math.PI / 180), f = c.x - d), m.push(g = c.x - this.options.xLabelMargin)) : m.push(b.remove());
				return m
			}, d.prototype.drawSeries = function () {
				var a, b, c, d, e, f, g, h, i, j, k, l, m, n, o;
				return c = this.width / this.options.data.length, h = this.options.stacked ? 1 : this.options.ykeys.length, a = (c * this.options.barSizeRatio - this.options.barGap * (h - 1)) / h, this.options.barSize && (a = Math.min(a, this.options.barSize)), l = c - a * h - this.options.barGap * (h - 1), g = l / 2, o = this.ymin <= 0 && this.ymax >= 0 ? this.transY(0) : null, this.bars = function () {
					var h, l, p, q;
					for (p = this.data, q = [], d = h = 0, l = p.length; l > h; d = ++h) i = p[d], e = 0, q.push(function () {
						var h, l, p, q;
						for (p = i._y, q = [], j = h = 0, l = p.length; l > h; j = ++h) n = p[j], null !== n ? (o ? (m = Math.min(n, o), b = Math.max(n, o)) : (m = n, b = this.bottom), f = this.left + d * c + g, this.options.stacked || (f += j * (a + this.options.barGap)), k = b - m, this.options.verticalGridCondition && this.options.verticalGridCondition(i.x) && this.drawBar(this.left + d * c, this.top, c, Math.abs(this.top - this.bottom), this.options.verticalGridColor, this.options.verticalGridOpacity, this.options.barRadius), this.options.stacked && (m -= e), this.drawBar(f, m, a, k, this.colorFor(i, j, "bar"), this.options.barOpacity, this.options.barRadius), q.push(e += k)) : q.push(null);
						return q
					}.call(this));
					return q
				}.call(this)
			}, d.prototype.colorFor = function (a, b, c) {
				var d, e;
				return "function" == typeof this.options.barColors ? (d = {
					x: a.x,
					y: a.y[b],
					label: a.label
				}, e = {
					index: b,
					key: this.options.ykeys[b],
					label: this.options.labels[b]
				}, this.options.barColors.call(this, d, e, c)) : this.options.barColors[b % this.options.barColors.length]
			}, d.prototype.hitTest = function (a) {
				return 0 === this.data.length ? null : (a = Math.max(Math.min(a, this.right), this.left), Math.min(this.data.length - 1, Math.floor((a - this.left) / (this.width / this.data.length))))
			}, d.prototype.onGridClick = function (a, b) {
				var c;
				return c = this.hitTest(a), this.fire("click", c, this.data[c].src, a, b)
			}, d.prototype.onHoverMove = function (a) {
				var b, c;
				return b = this.hitTest(a), (c = this.hover).update.apply(c, this.hoverContentForRow(b))
			}, d.prototype.onHoverOut = function () {
				return this.options.hideHover !== !1 ? this.hover.hide() : void 0
			}, d.prototype.hoverContentForRow = function (a) {
				var b, c, d, e, f, g, h, i;
				for (d = this.data[a], b = "<div class='morris-hover-row-label'>" + d.label + "</div>", i = d.y, c = g = 0, h = i.length; h > g; c = ++g) f = i[c], b += "<div class='morris-hover-point' style='color: " + this.colorFor(d, c, "label") + "'>\n  " + this.options.labels[c] + ":\n  " + this.yLabelFormat(f) + "\n</div>";
				return "function" == typeof this.options.hoverCallback && (b = this.options.hoverCallback(a, this.options, b, d.src)), e = this.left + (a + .5) * this.width / this.data.length, [b, e]
			}, d.prototype.drawXAxisLabel = function (a, b, c) {
				var d;
				return d = this.raphael.text(a, b, c).attr("font-size", this.options.gridTextSize).attr("font-family", this.options.gridTextFamily).attr("font-weight", this.options.gridTextWeight).attr("fill", this.options.gridTextColor)
			}, d.prototype.drawBar = function (a, b, c, d, e, f, g) {
				var h, i;
				return h = Math.max.apply(Math, g), i = 0 === h || h > d ? this.raphael.rect(a, b, c, d) : this.raphael.path(this.roundedRect(a, b, c, d, g)), i.attr("fill", e).attr("fill-opacity", f).attr("stroke", "none")
			}, d.prototype.roundedRect = function (a, b, c, d, e) {
				return null == e && (e = [0, 0, 0, 0]), ["M", a, e[0] + b, "Q", a, b, a + e[0], b, "L", a + c - e[1], b, "Q", a + c, b, a + c, b + e[1], "L", a + c, b + d - e[2], "Q", a + c, b + d, a + c - e[2], b + d, "L", a + e[3], b + d, "Q", a, b + d, a, b + d - e[3], "Z"]
			}, d
		}(b.Grid), b.Donut = function (c) {
			function d(c) {
				this.resizeHandler = f(this.resizeHandler, this), this.select = f(this.select, this), this.click = f(this.click, this);
				var d = this;
				if (!(this instanceof b.Donut)) return new b.Donut(c);
				if (this.options = a.extend({}, this.defaults, c), this.el = a("string" == typeof c.element ? document.getElementById(c.element) : c.element), null === this.el || 0 === this.el.length) throw new Error("Graph placeholder not found " + c.element);
				void 0 !== c.data && 0 !== c.data.length && (this.raphael = new Raphael(this.el[0]), this.options.resize && a(window).bind("resize", function () {
					return null != d.timeoutId && window.clearTimeout(d.timeoutId), d.timeoutId = window.setTimeout(d.resizeHandler, 100)
				}), this.setData(c.data))
			}
			return h(d, c), d.prototype.defaults = {
				colors: ["#0B62A4", "#3980B5", "#679DC6", "#95BBD7", "#B0CCE1", "#095791", "#095085", "#083E67", "#052C48", "#042135"],
				backgroundColor: "#FFFFFF",
				labelColor: "#000000",
				formatter: b.commas,
				resize: !1
			}, d.prototype.redraw = function () {
				var a, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x;
				for (this.raphael.clear(), c = this.el.width() / 2, d = this.el.height() / 2, n = (Math.min(c, d) - 10) / 3, l = 0, u = this.values, o = 0, r = u.length; r > o; o++) m = u[o], l += m;
				for (i = 5 / (2 * n), a = 1.9999 * Math.PI - i * this.data.length, g = 0, f = 0, this.segments = [], v = this.values, e = p = 0, s = v.length; s > p; e = ++p) m = v[e], j = g + i + a * (m / l), k = new b.DonutSegment(c, d, 2 * n, n, g, j, this.data[e].color || this.options.colors[f % this.options.colors.length], this.options.backgroundColor, f, this.raphael), k.render(), this.segments.push(k), k.on("hover", this.select), k.on("click", this.click), g = j, f += 1;
				for (this.text1 = this.drawEmptyDonutLabel(c, d - 10, this.options.labelColor, 15, 800), this.text2 = this.drawEmptyDonutLabel(c, d + 10, this.options.labelColor, 14), h = Math.max.apply(Math, this.values), f = 0, w = this.values, x = [], q = 0, t = w.length; t > q; q++) {
					if (m = w[q], m === h) {
						this.select(f);
						break
					}
					x.push(f += 1)
				}
				return x
			}, d.prototype.setData = function (a) {
				var b;
				return this.data = a, this.values = function () {
					var a, c, d, e;
					for (d = this.data, e = [], a = 0, c = d.length; c > a; a++) b = d[a], e.push(parseFloat(b.value));
					return e
				}.call(this), this.redraw()
			}, d.prototype.click = function (a) {
				return this.fire("click", a, this.data[a])
			}, d.prototype.select = function (a) {
				var b, c, d, e, f, g;
				for (g = this.segments, e = 0, f = g.length; f > e; e++) c = g[e], c.deselect();
				return d = this.segments[a], d.select(), b = this.data[a], this.setLabels(b.label, this.options.formatter(b.value, b))
			}, d.prototype.setLabels = function (a, b) {
				var c, d, e, f, g, h, i, j;
				return c = 2 * (Math.min(this.el.width() / 2, this.el.height() / 2) - 10) / 3, f = 1.8 * c, e = c / 2, d = c / 3, this.text1.attr({
					text: a,
					transform: ""
				}), g = this.text1.getBBox(), h = Math.min(f / g.width, e / g.height), this.text1.attr({
					transform: "S" + h + "," + h + "," + (g.x + g.width / 2) + "," + (g.y + g.height)
				}), this.text2.attr({
					text: b,
					transform: ""
				}), i = this.text2.getBBox(), j = Math.min(f / i.width, d / i.height), this.text2.attr({
					transform: "S" + j + "," + j + "," + (i.x + i.width / 2) + "," + i.y
				})
			}, d.prototype.drawEmptyDonutLabel = function (a, b, c, d, e) {
				var f;
				return f = this.raphael.text(a, b, "").attr("font-size", d).attr("fill", c), null != e && f.attr("font-weight", e), f
			}, d.prototype.resizeHandler = function () {
				return this.timeoutId = null, this.raphael.setSize(this.el.width(), this.el.height()), this.redraw()
			}, d
		}(b.EventEmitter), b.DonutSegment = function (a) {
			function b(a, b, c, d, e, g, h, i, j, k) {
				this.cx = a, this.cy = b, this.inner = c, this.outer = d, this.color = h, this.backgroundColor = i, this.index = j, this.raphael = k, this.deselect = f(this.deselect, this), this.select = f(this.select, this), this.sin_p0 = Math.sin(e), this.cos_p0 = Math.cos(e), this.sin_p1 = Math.sin(g), this.cos_p1 = Math.cos(g), this.is_long = g - e > Math.PI ? 1 : 0, this.path = this.calcSegment(this.inner + 3, this.inner + this.outer - 5), this.selectedPath = this.calcSegment(this.inner + 3, this.inner + this.outer), this.hilight = this.calcArc(this.inner)
			}
			return h(b, a), b.prototype.calcArcPoints = function (a) {
				return [this.cx + a * this.sin_p0, this.cy + a * this.cos_p0, this.cx + a * this.sin_p1, this.cy + a * this.cos_p1]
			}, b.prototype.calcSegment = function (a, b) {
				var c, d, e, f, g, h, i, j, k, l;
				return k = this.calcArcPoints(a), c = k[0], e = k[1], d = k[2], f = k[3], l = this.calcArcPoints(b), g = l[0], i = l[1], h = l[2], j = l[3], "M" + c + "," + e + ("A" + a + "," + a + ",0," + this.is_long + ",0," + d + "," + f) + ("L" + h + "," + j) + ("A" + b + "," + b + ",0," + this.is_long + ",1," + g + "," + i) + "Z"
			}, b.prototype.calcArc = function (a) {
				var b, c, d, e, f;
				return f = this.calcArcPoints(a), b = f[0], d = f[1], c = f[2], e = f[3], "M" + b + "," + d + ("A" + a + "," + a + ",0," + this.is_long + ",0," + c + "," + e)
			}, b.prototype.render = function () {
				var a = this;
				return this.arc = this.drawDonutArc(this.hilight, this.color), this.seg = this.drawDonutSegment(this.path, this.color, this.backgroundColor, function () {
					return a.fire("hover", a.index)
				}, function () {
					return a.fire("click", a.index)
				})
			}, b.prototype.drawDonutArc = function (a, b) {
				return this.raphael.path(a).attr({
					stroke: b,
					"stroke-width": 2,
					opacity: 0
				})
			}, b.prototype.drawDonutSegment = function (a, b, c, d, e) {
				return this.raphael.path(a).attr({
					fill: b,
					stroke: c,
					"stroke-width": 3
				}).hover(d).click(e)
			}, b.prototype.select = function () {
				return this.selected ? void 0 : (this.seg.animate({
					path: this.selectedPath
				}, 150, "<>"), this.arc.animate({
					opacity: 1
				}, 150, "<>"), this.selected = !0)
			}, b.prototype.deselect = function () {
				return this.selected ? (this.seg.animate({
					path: this.path
				}, 150, "<>"), this.arc.animate({
					opacity: 0
				}, 150, "<>"), this.selected = !1) : void 0
			}, b
		}(b.EventEmitter)
	}.call(this), ! function (a, b) {
		"object" == typeof exports && "object" == typeof module ? module.exports = b() : "function" == typeof define && define.amd ? define("Raphael", [], b) : "object" == typeof exports ? exports.Raphael = b() : a.Raphael = b()
	}(this, function () {
		return function (a) {
			function b(d) {
				if (c[d]) return c[d].exports;
				var e = c[d] = {
					exports: {},
					id: d,
					loaded: !1
				};
				return a[d].call(e.exports, e, e.exports, b), e.loaded = !0, e.exports
			}
			var c = {};
			return b.m = a, b.c = c, b.p = "", b(0)
		}([function (a, b, c) {
			var d, e;
			d = [c(1), c(3), c(4)], e = function (a) {
				return a
			}.apply(b, d), !(void 0 !== e && (a.exports = e))
		}, function (a, b, c) {
			var d, e;
			d = [c(2)], e = function (a) {
				function b(c) {
					if (b.is(c, "function")) return t ? c() : a.on("raphael.DOMload", c);
					if (b.is(c, U)) return b._engine.create[C](b, c.splice(0, 3 + b.is(c[0], S))).add(c);
					var d = Array.prototype.slice.call(arguments, 0);
					if (b.is(d[d.length - 1], "function")) {
						var e = d.pop();
						return t ? e.call(b._engine.create[C](b, d)) : a.on("raphael.DOMload", function () {
							e.call(b._engine.create[C](b, d))
						})
					}
					return b._engine.create[C](b, arguments)
				}

				function c(a) {
					if ("function" == typeof a || Object(a) !== a) return a;
					var b = new a.constructor;
					for (var d in a) a[y](d) && (b[d] = c(a[d]));
					return b
				}

				function d(a, b) {
					for (var c = 0, d = a.length; d > c; c++)
						if (a[c] === b) return a.push(a.splice(c, 1)[0])
				}

				function e(a, b, c) {
					function e() {
						var f = Array.prototype.slice.call(arguments, 0),
							g = f.join("␀"),
							h = e.cache = e.cache || {},
							i = e.count = e.count || [];
						return h[y](g) ? (d(i, g), c ? c(h[g]) : h[g]) : (i.length >= 1e3 && delete h[i.shift()], i.push(g), h[g] = a[C](b, f), c ? c(h[g]) : h[g])
					}
					return e
				}

				function f() {
					return this.hex
				}

				function g(a, b) {
					for (var c = [], d = 0, e = a.length; e - 2 * !b > d; d += 2) {
						var f = [{
							x: +a[d - 2],
							y: +a[d - 1]
						}, {
							x: +a[d],
							y: +a[d + 1]
						}, {
							x: +a[d + 2],
							y: +a[d + 3]
						}, {
							x: +a[d + 4],
							y: +a[d + 5]
						}];
						b ? d ? e - 4 == d ? f[3] = {
							x: +a[0],
							y: +a[1]
						} : e - 2 == d && (f[2] = {
							x: +a[0],
							y: +a[1]
						}, f[3] = {
							x: +a[2],
							y: +a[3]
						}) : f[0] = {
							x: +a[e - 2],
							y: +a[e - 1]
						} : e - 4 == d ? f[3] = f[2] : d || (f[0] = {
							x: +a[d],
							y: +a[d + 1]
						}), c.push(["C", (-f[0].x + 6 * f[1].x + f[2].x) / 6, (-f[0].y + 6 * f[1].y + f[2].y) / 6, (f[1].x + 6 * f[2].x - f[3].x) / 6, (f[1].y + 6 * f[2].y - f[3].y) / 6, f[2].x, f[2].y])
					}
					return c
				}

				function h(a, b, c, d, e) {
					var f = -3 * b + 9 * c - 9 * d + 3 * e,
						g = a * f + 6 * b - 12 * c + 6 * d;
					return a * g - 3 * b + 3 * c
				}

				function i(a, b, c, d, e, f, g, i, j) {
					null == j && (j = 1), j = j > 1 ? 1 : 0 > j ? 0 : j;
					for (var k = j / 2, l = 12, m = [-.1252, .1252, -.3678, .3678, -.5873, .5873, -.7699, .7699, -.9041, .9041, -.9816, .9816], n = [.2491, .2491, .2335, .2335, .2032, .2032, .1601, .1601, .1069, .1069, .0472, .0472], o = 0, p = 0; l > p; p++) {
						var q = k * m[p] + k,
							r = h(q, a, c, e, g),
							s = h(q, b, d, f, i),
							t = r * r + s * s;
						o += n[p] * M.sqrt(t)
					}
					return k * o
				}

				function j(a, b, c, d, e, f, g, h, j) {
					if (!(0 > j || i(a, b, c, d, e, f, g, h) < j)) {
						var k, l = 1,
							m = l / 2,
							n = l - m,
							o = .01;
						for (k = i(a, b, c, d, e, f, g, h, n); P(k - j) > o;) m /= 2, n += (j > k ? 1 : -1) * m, k = i(a, b, c, d, e, f, g, h, n);
						return n
					}
				}

				function k(a, b, c, d, e, f, g, h) {
					if (!(N(a, c) < O(e, g) || O(a, c) > N(e, g) || N(b, d) < O(f, h) || O(b, d) > N(f, h))) {
						var i = (a * d - b * c) * (e - g) - (a - c) * (e * h - f * g),
							j = (a * d - b * c) * (f - h) - (b - d) * (e * h - f * g),
							k = (a - c) * (f - h) - (b - d) * (e - g);
						if (k) {
							var l = i / k,
								m = j / k,
								n = +l.toFixed(2),
								o = +m.toFixed(2);
							if (!(n < +O(a, c).toFixed(2) || n > +N(a, c).toFixed(2) || n < +O(e, g).toFixed(2) || n > +N(e, g).toFixed(2) || o < +O(b, d).toFixed(2) || o > +N(b, d).toFixed(2) || o < +O(f, h).toFixed(2) || o > +N(f, h).toFixed(2))) return {
								x: l,
								y: m
							}
						}
					}
				}

				function l(a, c, d) {
					var e = b.bezierBBox(a),
						f = b.bezierBBox(c);
					if (!b.isBBoxIntersect(e, f)) return d ? 0 : [];
					for (var g = i.apply(0, a), h = i.apply(0, c), j = N(~~(g / 5), 1), l = N(~~(h / 5), 1), m = [], n = [], o = {}, p = d ? 0 : [], q = 0; j + 1 > q; q++) {
						var r = b.findDotsAtSegment.apply(b, a.concat(q / j));
						m.push({
							x: r.x,
							y: r.y,
							t: q / j
						})
					}
					for (q = 0; l + 1 > q; q++) r = b.findDotsAtSegment.apply(b, c.concat(q / l)), n.push({
						x: r.x,
						y: r.y,
						t: q / l
					});
					for (q = 0; j > q; q++)
						for (var s = 0; l > s; s++) {
							var t = m[q],
								u = m[q + 1],
								v = n[s],
								w = n[s + 1],
								x = P(u.x - t.x) < .001 ? "y" : "x",
								y = P(w.x - v.x) < .001 ? "y" : "x",
								z = k(t.x, t.y, u.x, u.y, v.x, v.y, w.x, w.y);
							if (z) {
								if (o[z.x.toFixed(4)] == z.y.toFixed(4)) continue;
								o[z.x.toFixed(4)] = z.y.toFixed(4);
								var A = t.t + P((z[x] - t[x]) / (u[x] - t[x])) * (u.t - t.t),
									B = v.t + P((z[y] - v[y]) / (w[y] - v[y])) * (w.t - v.t);
								A >= 0 && 1.001 >= A && B >= 0 && 1.001 >= B && (d ? p++ : p.push({
									x: z.x,
									y: z.y,
									t1: O(A, 1),
									t2: O(B, 1)
								}))
							}
						}
					return p
				}

				function m(a, c, d) {
					a = b._path2curve(a), c = b._path2curve(c);
					for (var e, f, g, h, i, j, k, m, n, o, p = d ? 0 : [], q = 0, r = a.length; r > q; q++) {
						var s = a[q];
						if ("M" == s[0]) e = i = s[1], f = j = s[2];
						else {
							"C" == s[0] ? (n = [e, f].concat(s.slice(1)), e = n[6], f = n[7]) : (n = [e, f, e, f, i, j, i, j], e = i, f = j);
							for (var t = 0, u = c.length; u > t; t++) {
								var v = c[t];
								if ("M" == v[0]) g = k = v[1], h = m = v[2];
								else {
									"C" == v[0] ? (o = [g, h].concat(v.slice(1)), g = o[6], h = o[7]) : (o = [g, h, g, h, k, m, k, m], g = k, h = m);
									var w = l(n, o, d);
									if (d) p += w;
									else {
										for (var x = 0, y = w.length; y > x; x++) w[x].segment1 = q, w[x].segment2 = t, w[x].bez1 = n, w[x].bez2 = o;
										p = p.concat(w)
									}
								}
							}
						}
					}
					return p
				}

				function n(a, b, c, d, e, f) {
					null != a ? (this.a = +a, this.b = +b, this.c = +c, this.d = +d, this.e = +e, this.f = +f) : (this.a = 1, this.b = 0, this.c = 0, this.d = 1, this.e = 0, this.f = 0)
				}

				function o() {
					return this.x + G + this.y + G + this.width + " × " + this.height
				}

				function p(a, b, c, d, e, f) {
					function g(a) {
						return ((l * a + k) * a + j) * a
					}

					function h(a, b) {
						var c = i(a, b);
						return ((o * c + n) * c + m) * c
					}

					function i(a, b) {
						var c, d, e, f, h, i;
						for (e = a, i = 0; 8 > i; i++) {
							if (f = g(e) - a, P(f) < b) return e;
							if (h = (3 * l * e + 2 * k) * e + j, P(h) < 1e-6) break;
							e -= f / h
						}
						if (c = 0, d = 1, e = a, c > e) return c;
						if (e > d) return d;
						for (; d > c;) {
							if (f = g(e), P(f - a) < b) return e;
							a > f ? c = e : d = e, e = (d - c) / 2 + c
						}
						return e
					}
					var j = 3 * b,
						k = 3 * (d - b) - j,
						l = 1 - j - k,
						m = 3 * c,
						n = 3 * (e - c) - m,
						o = 1 - m - n;
					return h(a, 1 / (200 * f))
				}

				function q(a, b) {
					var c = [],
						d = {};
					if (this.ms = b, this.times = 1, a) {
						for (var e in a) a[y](e) && (d[$(e)] = a[e], c.push($(e)));
						c.sort(kb)
					}
					this.anim = d, this.top = c[c.length - 1], this.percents = c
				}

				function r(c, d, e, f, g, h) {
					e = $(e);
					var i, j, k, l, m, o, q = c.ms,
						r = {},
						s = {},
						t = {};
					if (f)
						for (w = 0, x = fc.length; x > w; w++) {
							var u = fc[w];
							if (u.el.id == d.id && u.anim == c) {
								u.percent != e ? (fc.splice(w, 1), k = 1) : j = u, d.attr(u.totalOrigin);
								break
							}
						} else f = +s;
					for (var w = 0, x = c.percents.length; x > w; w++) {
						if (c.percents[w] == e || c.percents[w] > f * c.top) {
							e = c.percents[w], m = c.percents[w - 1] || 0, q = q / c.top * (e - m), l = c.percents[w + 1], i = c.anim[e];
							break
						}
						f && d.attr(c.anim[c.percents[w]])
					}
					if (i) {
						if (j) j.initstatus = f, j.start = new Date - j.ms * f;
						else {
							for (var z in i)
								if (i[y](z) && (cb[y](z) || d.paper.customAttributes[y](z))) switch (r[z] = d.attr(z), null == r[z] && (r[z] = bb[z]), s[z] = i[z], cb[z]) {
									case S:
										t[z] = (s[z] - r[z]) / q;
										break;
									case "colour":
										r[z] = b.getRGB(r[z]);
										var A = b.getRGB(s[z]);
										t[z] = {
											r: (A.r - r[z].r) / q,
											g: (A.g - r[z].g) / q,
											b: (A.b - r[z].b) / q
										};
										break;
									case "path":
										var B = Ib(r[z], s[z]),
											C = B[1];
										for (r[z] = B[0], t[z] = [], w = 0, x = r[z].length; x > w; w++) {
											t[z][w] = [0];
											for (var E = 1, F = r[z][w].length; F > E; E++) t[z][w][E] = (C[w][E] - r[z][w][E]) / q
										}
										break;
									case "transform":
										var G = d._,
											J = Nb(G[z], s[z]);
										if (J)
											for (r[z] = J.from, s[z] = J.to, t[z] = [], t[z].real = !0, w = 0, x = r[z].length; x > w; w++)
												for (t[z][w] = [r[z][w][0]], E = 1, F = r[z][w].length; F > E; E++) t[z][w][E] = (s[z][w][E] - r[z][w][E]) / q;
										else {
											var K = d.matrix || new n,
												L = {
													_: {
														transform: G.transform
													},
													getBBox: function () {
														return d.getBBox(1)
													}
												};
											r[z] = [K.a, K.b, K.c, K.d, K.e, K.f], Lb(L, s[z]), s[z] = L._.transform, t[z] = [(L.matrix.a - K.a) / q, (L.matrix.b - K.b) / q, (L.matrix.c - K.c) / q, (L.matrix.d - K.d) / q, (L.matrix.e - K.e) / q, (L.matrix.f - K.f) / q]
										}
										break;
									case "csv":
										var M = H(i[z])[I](v),
											N = H(r[z])[I](v);
										if ("clip-rect" == z)
											for (r[z] = N, t[z] = [], w = N.length; w--;) t[z][w] = (M[w] - r[z][w]) / q;
										s[z] = M;
										break;
									default:
										for (M = [][D](i[z]), N = [][D](r[z]), t[z] = [], w = d.paper.customAttributes[z].length; w--;) t[z][w] = ((M[w] || 0) - (N[w] || 0)) / q
								}
							var O = i.easing,
								P = b.easing_formulas[O];
							if (!P)
								if (P = H(O).match(Y), P && 5 == P.length) {
									var Q = P;
									P = function (a) {
										return p(a, +Q[1], +Q[2], +Q[3], +Q[4], q)
									}
								} else P = lb;
							if (o = i.start || c.start || +new Date, u = {
									anim: c,
									percent: e,
									timestamp: o,
									start: o + (c.del || 0),
									status: 0,
									initstatus: f || 0,
									stop: !1,
									ms: q,
									easing: P,
									from: r,
									diff: t,
									to: s,
									el: d,
									callback: i.callback,
									prev: m,
									next: l,
									repeat: h || c.times,
									origin: d.attr(),
									totalOrigin: g
								}, fc.push(u), f && !j && !k && (u.stop = !0, u.start = new Date - q * f, 1 == fc.length)) return hc();
							k && (u.start = new Date - u.ms * f), 1 == fc.length && gc(hc)
						}
						a("raphael.anim.start." + d.id, d, c)
					}
				}

				function s(a) {
					for (var b = 0; b < fc.length; b++) fc[b].el.paper == a && fc.splice(b--, 1)
				}
				b.version = "2.2.0", b.eve = a;
				var t, u, v = /[, ]+/,
					w = {
						circle: 1,
						rect: 1,
						path: 1,
						ellipse: 1,
						text: 1,
						image: 1
					},
					x = /\{(\d+)\}/g,
					y = "hasOwnProperty",
					z = {
						doc: document,
						win: window
					},
					A = {
						was: Object.prototype[y].call(z.win, "Raphael"),
						is: z.win.Raphael
					},
					B = function () {
						this.ca = this.customAttributes = {}
					},
					C = "apply",
					D = "concat",
					E = "ontouchstart" in z.win || z.win.DocumentTouch && z.doc instanceof DocumentTouch,
					F = "",
					G = " ",
					H = String,
					I = "split",
					J = "click dblclick mousedown mousemove mouseout mouseover mouseup touchstart touchmove touchend touchcancel" [I](G),
					K = {
						mousedown: "touchstart",
						mousemove: "touchmove",
						mouseup: "touchend"
					},
					L = H.prototype.toLowerCase,
					M = Math,
					N = M.max,
					O = M.min,
					P = M.abs,
					Q = M.pow,
					R = M.PI,
					S = "number",
					T = "string",
					U = "array",
					V = Object.prototype.toString,
					W = (b._ISURL = /^url\(['"]?(.+?)['"]?\)$/i, /^\s*((#[a-f\d]{6})|(#[a-f\d]{3})|rgba?\(\s*([\d\.]+%?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+%?(?:\s*,\s*[\d\.]+%?)?)\s*\)|hsba?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?)%?\s*\)|hsla?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?)%?\s*\))\s*$/i),
					X = {
						NaN: 1,
						Infinity: 1,
						"-Infinity": 1
					},
					Y = /^(?:cubic-)?bezier\(([^,]+),([^,]+),([^,]+),([^\)]+)\)/,
					Z = M.round,
					$ = parseFloat,
					_ = parseInt,
					ab = H.prototype.toUpperCase,
					bb = b._availableAttrs = {
						"arrow-end": "none",
						"arrow-start": "none",
						blur: 0,
						"clip-rect": "0 0 1e9 1e9",
						cursor: "default",
						cx: 0,
						cy: 0,
						fill: "#fff",
						"fill-opacity": 1,
						font: '10px "Arial"',
						"font-family": '"Arial"',
						"font-size": "10",
						"font-style": "normal",
						"font-weight": 400,
						gradient: 0,
						height: 0,
						href: "http://raphaeljs.com/",
						"letter-spacing": 0,
						opacity: 1,
						path: "M0,0",
						r: 0,
						rx: 0,
						ry: 0,
						src: "",
						stroke: "#000",
						"stroke-dasharray": "",
						"stroke-linecap": "butt",
						"stroke-linejoin": "butt",
						"stroke-miterlimit": 0,
						"stroke-opacity": 1,
						"stroke-width": 1,
						target: "_blank",
						"text-anchor": "middle",
						title: "Raphael",
						transform: "",
						width: 0,
						x: 0,
						y: 0,
						"class": ""
					},
					cb = b._availableAnimAttrs = {
						blur: S,
						"clip-rect": "csv",
						cx: S,
						cy: S,
						fill: "colour",
						"fill-opacity": S,
						"font-size": S,
						height: S,
						opacity: S,
						path: "path",
						r: S,
						rx: S,
						ry: S,
						stroke: "colour",
						"stroke-opacity": S,
						"stroke-width": S,
						transform: "transform",
						width: S,
						x: S,
						y: S
					},
					db = /[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*/,
					eb = {
						hs: 1,
						rg: 1
					},
					fb = /,?([achlmqrstvxz]),?/gi,
					gb = /([achlmrqstvz])[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029,]*((-?\d*\.?\d*(?:e[\-+]?\d+)?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*)+)/gi,
					hb = /([rstm])[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029,]*((-?\d*\.?\d*(?:e[\-+]?\d+)?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*)+)/gi,
					ib = /(-?\d*\.?\d*(?:e[\-+]?\d+)?)[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*/gi,
					jb = (b._radial_gradient = /^r(?:\(([^,]+?)[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*([^\)]+?)\))?/, {}),
					kb = function (a, b) {
						return $(a) - $(b)
					},
					lb = function (a) {
						return a
					},
					mb = b._rectPath = function (a, b, c, d, e) {
						return e ? [
							["M", a + e, b],
							["l", c - 2 * e, 0],
							["a", e, e, 0, 0, 1, e, e],
							["l", 0, d - 2 * e],
							["a", e, e, 0, 0, 1, -e, e],
							["l", 2 * e - c, 0],
							["a", e, e, 0, 0, 1, -e, -e],
							["l", 0, 2 * e - d],
							["a", e, e, 0, 0, 1, e, -e],
							["z"]
						] : [
							["M", a, b],
							["l", c, 0],
							["l", 0, d],
							["l", -c, 0],
							["z"]
						]
					},
					nb = function (a, b, c, d) {
						return null == d && (d = c), [
							["M", a, b],
							["m", 0, -d],
							["a", c, d, 0, 1, 1, 0, 2 * d],
							["a", c, d, 0, 1, 1, 0, -2 * d],
							["z"]
						]
					},
					ob = b._getPath = {
						path: function (a) {
							return a.attr("path")
						},
						circle: function (a) {
							var b = a.attrs;
							return nb(b.cx, b.cy, b.r)
						},
						ellipse: function (a) {
							var b = a.attrs;
							return nb(b.cx, b.cy, b.rx, b.ry)
						},
						rect: function (a) {
							var b = a.attrs;
							return mb(b.x, b.y, b.width, b.height, b.r)
						},
						image: function (a) {
							var b = a.attrs;
							return mb(b.x, b.y, b.width, b.height)
						},
						text: function (a) {
							var b = a._getBBox();
							return mb(b.x, b.y, b.width, b.height)
						},
						set: function (a) {
							var b = a._getBBox();
							return mb(b.x, b.y, b.width, b.height)
						}
					},
					pb = b.mapPath = function (a, b) {
						if (!b) return a;
						var c, d, e, f, g, h, i;
						for (a = Ib(a), e = 0, g = a.length; g > e; e++)
							for (i = a[e], f = 1, h = i.length; h > f; f += 2) c = b.x(i[f], i[f + 1]), d = b.y(i[f], i[f + 1]), i[f] = c, i[f + 1] = d;
						return a
					};
				if (b._g = z, b.type = z.win.SVGAngle || z.doc.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1") ? "SVG" : "VML", "VML" == b.type) {
					var qb, rb = z.doc.createElement("div");
					if (rb.innerHTML = '<v:shape adj="1"/>', qb = rb.firstChild, qb.style.behavior = "url(#default#VML)", !qb || "object" != typeof qb.adj) return b.type = F;
					rb = null
				}
				b.svg = !(b.vml = "VML" == b.type), b._Paper = B, b.fn = u = B.prototype = b.prototype, b._id = 0, b._oid = 0, b.is = function (a, b) {
					return b = L.call(b), "finite" == b ? !X[y](+a) : "array" == b ? a instanceof Array : "null" == b && null === a || b == typeof a && null !== a || "object" == b && a === Object(a) || "array" == b && Array.isArray && Array.isArray(a) || V.call(a).slice(8, -1).toLowerCase() == b
				}, b.angle = function (a, c, d, e, f, g) {
					if (null == f) {
						var h = a - d,
							i = c - e;
						return h || i ? (180 + 180 * M.atan2(-i, -h) / R + 360) % 360 : 0
					}
					return b.angle(a, c, f, g) - b.angle(d, e, f, g)
				}, b.rad = function (a) {
					return a % 360 * R / 180
				}, b.deg = function (a) {
					return Math.round(180 * a / R % 360 * 1e3) / 1e3
				}, b.snapTo = function (a, c, d) {
					if (d = b.is(d, "finite") ? d : 10, b.is(a, U)) {
						for (var e = a.length; e--;)
							if (P(a[e] - c) <= d) return a[e]
					} else {
						a = +a;
						var f = c % a;
						if (d > f) return c - f;
						if (f > a - d) return c - f + a
					}
					return c
				};
				b.createUUID = function (a, b) {
					return function () {
						return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(a, b).toUpperCase()
					}
				}(/[xy]/g, function (a) {
					var b = 16 * M.random() | 0,
						c = "x" == a ? b : 3 & b | 8;
					return c.toString(16)
				});
				b.setWindow = function (c) {
					a("raphael.setWindow", b, z.win, c), z.win = c, z.doc = z.win.document, b._engine.initWin && b._engine.initWin(z.win)
				};
				var sb = function (a) {
						if (b.vml) {
							var c, d = /^\s+|\s+$/g;
							try {
								var f = new ActiveXObject("htmlfile");
								f.write("<body>"), f.close(), c = f.body
							} catch (g) {
								c = createPopup().document.body
							}
							var h = c.createTextRange();
							sb = e(function (a) {
								try {
									c.style.color = H(a).replace(d, F);
									var b = h.queryCommandValue("ForeColor");
									return b = (255 & b) << 16 | 65280 & b | (16711680 & b) >>> 16, "#" + ("000000" + b.toString(16)).slice(-6)
								} catch (e) {
									return "none"
								}
							})
						} else {
							var i = z.doc.createElement("i");
							i.title = "Raphaël Colour Picker", i.style.display = "none", z.doc.body.appendChild(i), sb = e(function (a) {
								return i.style.color = a, z.doc.defaultView.getComputedStyle(i, F).getPropertyValue("color")
							})
						}
						return sb(a)
					},
					tb = function () {
						return "hsb(" + [this.h, this.s, this.b] + ")"
					},
					ub = function () {
						return "hsl(" + [this.h, this.s, this.l] + ")"
					},
					vb = function () {
						return this.hex
					},
					wb = function (a, c, d) {
						if (null == c && b.is(a, "object") && "r" in a && "g" in a && "b" in a && (d = a.b, c = a.g, a = a.r), null == c && b.is(a, T)) {
							var e = b.getRGB(a);
							a = e.r, c = e.g, d = e.b
						}
						return (a > 1 || c > 1 || d > 1) && (a /= 255, c /= 255, d /= 255), [a, c, d]
					},
					xb = function (a, c, d, e) {
						a *= 255, c *= 255, d *= 255;
						var f = {
							r: a,
							g: c,
							b: d,
							hex: b.rgb(a, c, d),
							toString: vb
						};
						return b.is(e, "finite") && (f.opacity = e), f
					};
				b.color = function (a) {
					var c;
					return b.is(a, "object") && "h" in a && "s" in a && "b" in a ? (c = b.hsb2rgb(a), a.r = c.r, a.g = c.g, a.b = c.b, a.hex = c.hex) : b.is(a, "object") && "h" in a && "s" in a && "l" in a ? (c = b.hsl2rgb(a), a.r = c.r, a.g = c.g, a.b = c.b, a.hex = c.hex) : (b.is(a, "string") && (a = b.getRGB(a)), b.is(a, "object") && "r" in a && "g" in a && "b" in a ? (c = b.rgb2hsl(a), a.h = c.h, a.s = c.s, a.l = c.l, c = b.rgb2hsb(a), a.v = c.b) : (a = {
						hex: "none"
					}, a.r = a.g = a.b = a.h = a.s = a.v = a.l = -1)), a.toString = vb, a
				}, b.hsb2rgb = function (a, b, c, d) {
					this.is(a, "object") && "h" in a && "s" in a && "b" in a && (c = a.b, b = a.s, d = a.o, a = a.h), a *= 360;
					var e, f, g, h, i;
					return a = a % 360 / 60, i = c * b, h = i * (1 - P(a % 2 - 1)), e = f = g = c - i, a = ~~a, e += [i, h, 0, 0, h, i][a], f += [h, i, i, h, 0, 0][a], g += [0, 0, h, i, i, h][a], xb(e, f, g, d)
				}, b.hsl2rgb = function (a, b, c, d) {
					this.is(a, "object") && "h" in a && "s" in a && "l" in a && (c = a.l, b = a.s, a = a.h), (a > 1 || b > 1 || c > 1) && (a /= 360, b /= 100, c /= 100), a *= 360;
					var e, f, g, h, i;
					return a = a % 360 / 60, i = 2 * b * (.5 > c ? c : 1 - c), h = i * (1 - P(a % 2 - 1)), e = f = g = c - i / 2, a = ~~a, e += [i, h, 0, 0, h, i][a], f += [h, i, i, h, 0, 0][a], g += [0, 0, h, i, i, h][a], xb(e, f, g, d)
				}, b.rgb2hsb = function (a, b, c) {
					c = wb(a, b, c), a = c[0], b = c[1], c = c[2];
					var d, e, f, g;
					return f = N(a, b, c), g = f - O(a, b, c), d = 0 == g ? null : f == a ? (b - c) / g : f == b ? (c - a) / g + 2 : (a - b) / g + 4, d = (d + 360) % 6 * 60 / 360, e = 0 == g ? 0 : g / f, {
						h: d,
						s: e,
						b: f,
						toString: tb
					}
				}, b.rgb2hsl = function (a, b, c) {
					c = wb(a, b, c), a = c[0], b = c[1], c = c[2];
					var d, e, f, g, h, i;
					return g = N(a, b, c), h = O(a, b, c), i = g - h, d = 0 == i ? null : g == a ? (b - c) / i : g == b ? (c - a) / i + 2 : (a - b) / i + 4, d = (d + 360) % 6 * 60 / 360, f = (g + h) / 2, e = 0 == i ? 0 : .5 > f ? i / (2 * f) : i / (2 - 2 * f), {
						h: d,
						s: e,
						l: f,
						toString: ub
					}
				}, b._path2string = function () {
					return this.join(",").replace(fb, "$1")
				};
				b._preload = function (a, b) {
					var c = z.doc.createElement("img");
					c.style.cssText = "position:absolute;left:-9999em;top:-9999em", c.onload = function () {
						b.call(this), this.onload = null, z.doc.body.removeChild(this)
					}, c.onerror = function () {
						z.doc.body.removeChild(this)
					}, z.doc.body.appendChild(c), c.src = a
				};
				b.getRGB = e(function (a) {
					if (!a || (a = H(a)).indexOf("-") + 1) return {
						r: -1,
						g: -1,
						b: -1,
						hex: "none",
						error: 1,
						toString: f
					};
					if ("none" == a) return {
						r: -1,
						g: -1,
						b: -1,
						hex: "none",
						toString: f
					};
					!(eb[y](a.toLowerCase().substring(0, 2)) || "#" == a.charAt()) && (a = sb(a));
					var c, d, e, g, h, i, j = a.match(W);
					return j ? (j[2] && (e = _(j[2].substring(5), 16), d = _(j[2].substring(3, 5), 16), c = _(j[2].substring(1, 3), 16)), j[3] && (e = _((h = j[3].charAt(3)) + h, 16), d = _((h = j[3].charAt(2)) + h, 16), c = _((h = j[3].charAt(1)) + h, 16)), j[4] && (i = j[4][I](db), c = $(i[0]), "%" == i[0].slice(-1) && (c *= 2.55), d = $(i[1]), "%" == i[1].slice(-1) && (d *= 2.55), e = $(i[2]), "%" == i[2].slice(-1) && (e *= 2.55), "rgba" == j[1].toLowerCase().slice(0, 4) && (g = $(i[3])), i[3] && "%" == i[3].slice(-1) && (g /= 100)), j[5] ? (i = j[5][I](db), c = $(i[0]), "%" == i[0].slice(-1) && (c *= 2.55), d = $(i[1]), "%" == i[1].slice(-1) && (d *= 2.55), e = $(i[2]), "%" == i[2].slice(-1) && (e *= 2.55), ("deg" == i[0].slice(-3) || "°" == i[0].slice(-1)) && (c /= 360), "hsba" == j[1].toLowerCase().slice(0, 4) && (g = $(i[3])), i[3] && "%" == i[3].slice(-1) && (g /= 100), b.hsb2rgb(c, d, e, g)) : j[6] ? (i = j[6][I](db), c = $(i[0]), "%" == i[0].slice(-1) && (c *= 2.55), d = $(i[1]), "%" == i[1].slice(-1) && (d *= 2.55), e = $(i[2]), "%" == i[2].slice(-1) && (e *= 2.55), ("deg" == i[0].slice(-3) || "°" == i[0].slice(-1)) && (c /= 360), "hsla" == j[1].toLowerCase().slice(0, 4) && (g = $(i[3])), i[3] && "%" == i[3].slice(-1) && (g /= 100), b.hsl2rgb(c, d, e, g)) : (j = {
						r: c,
						g: d,
						b: e,
						toString: f
					}, j.hex = "#" + (16777216 | e | d << 8 | c << 16).toString(16).slice(1), b.is(g, "finite") && (j.opacity = g), j)) : {
						r: -1,
						g: -1,
						b: -1,
						hex: "none",
						error: 1,
						toString: f
					}
				}, b), b.hsb = e(function (a, c, d) {
					return b.hsb2rgb(a, c, d).hex
				}), b.hsl = e(function (a, c, d) {
					return b.hsl2rgb(a, c, d).hex
				}), b.rgb = e(function (a, b, c) {
					function d(a) {
						return a + .5 | 0
					}
					return "#" + (16777216 | d(c) | d(b) << 8 | d(a) << 16).toString(16).slice(1)
				}), b.getColor = function (a) {
					var b = this.getColor.start = this.getColor.start || {
							h: 0,
							s: 1,
							b: a || .75
						},
						c = this.hsb2rgb(b.h, b.s, b.b);
					return b.h += .075, b.h > 1 && (b.h = 0, b.s -= .2, b.s <= 0 && (this.getColor.start = {
						h: 0,
						s: 1,
						b: b.b
					})), c.hex
				}, b.getColor.reset = function () {
					delete this.start
				}, b.parsePathString = function (a) {
					if (!a) return null;
					var c = yb(a);
					if (c.arr) return Ab(c.arr);
					var d = {
							a: 7,
							c: 6,
							h: 1,
							l: 2,
							m: 2,
							r: 4,
							q: 4,
							s: 4,
							t: 2,
							v: 1,
							z: 0
						},
						e = [];
					return b.is(a, U) && b.is(a[0], U) && (e = Ab(a)), e.length || H(a).replace(gb, function (a, b, c) {
						var f = [],
							g = b.toLowerCase();
						if (c.replace(ib, function (a, b) {
								b && f.push(+b)
							}), "m" == g && f.length > 2 && (e.push([b][D](f.splice(0, 2))), g = "l", b = "m" == b ? "l" : "L"), "r" == g) e.push([b][D](f));
						else
							for (; f.length >= d[g] && (e.push([b][D](f.splice(0, d[g]))), d[g]););
					}), e.toString = b._path2string, c.arr = Ab(e), e
				}, b.parseTransformString = e(function (a) {
					if (!a) return null;
					var c = [];
					return b.is(a, U) && b.is(a[0], U) && (c = Ab(a)), c.length || H(a).replace(hb, function (a, b, d) {
						{
							var e = [];
							L.call(b)
						}
						d.replace(ib, function (a, b) {
							b && e.push(+b)
						}), c.push([b][D](e))
					}), c.toString = b._path2string, c
				});
				var yb = function (a) {
					var b = yb.ps = yb.ps || {};
					return b[a] ? b[a].sleep = 100 : b[a] = {
						sleep: 100
					}, setTimeout(function () {
						for (var c in b) b[y](c) && c != a && (b[c].sleep--, !b[c].sleep && delete b[c])
					}), b[a]
				};
				b.findDotsAtSegment = function (a, b, c, d, e, f, g, h, i) {
					var j = 1 - i,
						k = Q(j, 3),
						l = Q(j, 2),
						m = i * i,
						n = m * i,
						o = k * a + 3 * l * i * c + 3 * j * i * i * e + n * g,
						p = k * b + 3 * l * i * d + 3 * j * i * i * f + n * h,
						q = a + 2 * i * (c - a) + m * (e - 2 * c + a),
						r = b + 2 * i * (d - b) + m * (f - 2 * d + b),
						s = c + 2 * i * (e - c) + m * (g - 2 * e + c),
						t = d + 2 * i * (f - d) + m * (h - 2 * f + d),
						u = j * a + i * c,
						v = j * b + i * d,
						w = j * e + i * g,
						x = j * f + i * h,
						y = 90 - 180 * M.atan2(q - s, r - t) / R;
					return (q > s || t > r) && (y += 180), {
						x: o,
						y: p,
						m: {
							x: q,
							y: r
						},
						n: {
							x: s,
							y: t
						},
						start: {
							x: u,
							y: v
						},
						end: {
							x: w,
							y: x
						},
						alpha: y
					}
				}, b.bezierBBox = function (a, c, d, e, f, g, h, i) {
					b.is(a, "array") || (a = [a, c, d, e, f, g, h, i]);
					var j = Hb.apply(null, a);
					return {
						x: j.min.x,
						y: j.min.y,
						x2: j.max.x,
						y2: j.max.y,
						width: j.max.x - j.min.x,
						height: j.max.y - j.min.y
					}
				}, b.isPointInsideBBox = function (a, b, c) {
					return b >= a.x && b <= a.x2 && c >= a.y && c <= a.y2
				}, b.isBBoxIntersect = function (a, c) {
					var d = b.isPointInsideBBox;
					return d(c, a.x, a.y) || d(c, a.x2, a.y) || d(c, a.x, a.y2) || d(c, a.x2, a.y2) || d(a, c.x, c.y) || d(a, c.x2, c.y) || d(a, c.x, c.y2) || d(a, c.x2, c.y2) || (a.x < c.x2 && a.x > c.x || c.x < a.x2 && c.x > a.x) && (a.y < c.y2 && a.y > c.y || c.y < a.y2 && c.y > a.y)
				}, b.pathIntersection = function (a, b) {
					return m(a, b)
				}, b.pathIntersectionNumber = function (a, b) {
					return m(a, b, 1)
				}, b.isPointInsidePath = function (a, c, d) {
					var e = b.pathBBox(a);
					return b.isPointInsideBBox(e, c, d) && m(a, [
						["M", c, d],
						["H", e.x2 + 10]
					], 1) % 2 == 1
				}, b._removedFactory = function (b) {
					return function () {
						a("raphael.log", null, "Raphaël: you are calling to method “" + b + "” of removed object", b)
					}
				};
				var zb = b.pathBBox = function (a) {
						var b = yb(a);
						if (b.bbox) return c(b.bbox);
						if (!a) return {
							x: 0,
							y: 0,
							width: 0,
							height: 0,
							x2: 0,
							y2: 0
						};
						a = Ib(a);
						for (var d, e = 0, f = 0, g = [], h = [], i = 0, j = a.length; j > i; i++)
							if (d = a[i], "M" == d[0]) e = d[1], f = d[2], g.push(e), h.push(f);
							else {
								var k = Hb(e, f, d[1], d[2], d[3], d[4], d[5], d[6]);
								g = g[D](k.min.x, k.max.x), h = h[D](k.min.y, k.max.y), e = d[5], f = d[6]
							}
						var l = O[C](0, g),
							m = O[C](0, h),
							n = N[C](0, g),
							o = N[C](0, h),
							p = n - l,
							q = o - m,
							r = {
								x: l,
								y: m,
								x2: n,
								y2: o,
								width: p,
								height: q,
								cx: l + p / 2,
								cy: m + q / 2
							};
						return b.bbox = c(r), r
					},
					Ab = function (a) {
						var d = c(a);
						return d.toString = b._path2string, d
					},
					Bb = b._pathToRelative = function (a) {
						var c = yb(a);
						if (c.rel) return Ab(c.rel);
						b.is(a, U) && b.is(a && a[0], U) || (a = b.parsePathString(a));
						var d = [],
							e = 0,
							f = 0,
							g = 0,
							h = 0,
							i = 0;
						"M" == a[0][0] && (e = a[0][1], f = a[0][2], g = e, h = f, i++, d.push(["M", e, f]));
						for (var j = i, k = a.length; k > j; j++) {
							var l = d[j] = [],
								m = a[j];
							if (m[0] != L.call(m[0])) switch (l[0] = L.call(m[0]), l[0]) {
								case "a":
									l[1] = m[1], l[2] = m[2], l[3] = m[3], l[4] = m[4], l[5] = m[5], l[6] = +(m[6] - e).toFixed(3), l[7] = +(m[7] - f).toFixed(3);
									break;
								case "v":
									l[1] = +(m[1] - f).toFixed(3);
									break;
								case "m":
									g = m[1], h = m[2];
								default:
									for (var n = 1, o = m.length; o > n; n++) l[n] = +(m[n] - (n % 2 ? e : f)).toFixed(3)
							} else {
								l = d[j] = [], "m" == m[0] && (g = m[1] + e, h = m[2] + f);
								for (var p = 0, q = m.length; q > p; p++) d[j][p] = m[p]
							}
							var r = d[j].length;
							switch (d[j][0]) {
								case "z":
									e = g, f = h;
									break;
								case "h":
									e += +d[j][r - 1];
									break;
								case "v":
									f += +d[j][r - 1];
									break;
								default:
									e += +d[j][r - 2], f += +d[j][r - 1]
							}
						}
						return d.toString = b._path2string, c.rel = Ab(d), d
					},
					Cb = b._pathToAbsolute = function (a) {
						var c = yb(a);
						if (c.abs) return Ab(c.abs);
						if (b.is(a, U) && b.is(a && a[0], U) || (a = b.parsePathString(a)), !a || !a.length) return [
							["M", 0, 0]
						];
						var d = [],
							e = 0,
							f = 0,
							h = 0,
							i = 0,
							j = 0;
						"M" == a[0][0] && (e = +a[0][1], f = +a[0][2], h = e, i = f, j++, d[0] = ["M", e, f]);
						for (var k, l, m = 3 == a.length && "M" == a[0][0] && "R" == a[1][0].toUpperCase() && "Z" == a[2][0].toUpperCase(), n = j, o = a.length; o > n; n++) {
							if (d.push(k = []), l = a[n], l[0] != ab.call(l[0])) switch (k[0] = ab.call(l[0]), k[0]) {
									case "A":
										k[1] = l[1], k[2] = l[2], k[3] = l[3], k[4] = l[4], k[5] = l[5], k[6] = +(l[6] + e), k[7] = +(l[7] + f);
										break;
									case "V":
										k[1] = +l[1] + f;
										break;
									case "H":
										k[1] = +l[1] + e;
										break;
									case "R":
										for (var p = [e, f][D](l.slice(1)), q = 2, r = p.length; r > q; q++) p[q] = +p[q] + e, p[++q] = +p[q] + f;
										d.pop(), d = d[D](g(p, m));
										break;
									case "M":
										h = +l[1] + e, i = +l[2] + f;
									default:
										for (q = 1, r = l.length; r > q; q++) k[q] = +l[q] + (q % 2 ? e : f)
								} else if ("R" == l[0]) p = [e, f][D](l.slice(1)), d.pop(), d = d[D](g(p, m)), k = ["R"][D](l.slice(-2));
								else
									for (var s = 0, t = l.length; t > s; s++) k[s] = l[s];
							switch (k[0]) {
								case "Z":
									e = h, f = i;
									break;
								case "H":
									e = k[1];
									break;
								case "V":
									f = k[1];
									break;
								case "M":
									h = k[k.length - 2], i = k[k.length - 1];
								default:
									e = k[k.length - 2], f = k[k.length - 1]
							}
						}
						return d.toString = b._path2string, c.abs = Ab(d), d
					},
					Db = function (a, b, c, d) {
						return [a, b, c, d, c, d]
					},
					Eb = function (a, b, c, d, e, f) {
						var g = 1 / 3,
							h = 2 / 3;
						return [g * a + h * c, g * b + h * d, g * e + h * c, g * f + h * d, e, f]
					},
					Fb = function (a, b, c, d, f, g, h, i, j, k) {
						var l, m = 120 * R / 180,
							n = R / 180 * (+f || 0),
							o = [],
							p = e(function (a, b, c) {
								var d = a * M.cos(c) - b * M.sin(c),
									e = a * M.sin(c) + b * M.cos(c);
								return {
									x: d,
									y: e
								}
							});
						if (k) y = k[0], z = k[1], w = k[2], x = k[3];
						else {
							l = p(a, b, -n), a = l.x, b = l.y, l = p(i, j, -n), i = l.x, j = l.y;
							var q = (M.cos(R / 180 * f), M.sin(R / 180 * f), (a - i) / 2),
								r = (b - j) / 2,
								s = q * q / (c * c) + r * r / (d * d);
							s > 1 && (s = M.sqrt(s), c = s * c, d = s * d);
							var t = c * c,
								u = d * d,
								v = (g == h ? -1 : 1) * M.sqrt(P((t * u - t * r * r - u * q * q) / (t * r * r + u * q * q))),
								w = v * c * r / d + (a + i) / 2,
								x = v * -d * q / c + (b + j) / 2,
								y = M.asin(((b - x) / d).toFixed(9)),
								z = M.asin(((j - x) / d).toFixed(9));
							y = w > a ? R - y : y, z = w > i ? R - z : z, 0 > y && (y = 2 * R + y), 0 > z && (z = 2 * R + z), h && y > z && (y -= 2 * R), !h && z > y && (z -= 2 * R)
						}
						var A = z - y;
						if (P(A) > m) {
							var B = z,
								C = i,
								E = j;
							z = y + m * (h && z > y ? 1 : -1), i = w + c * M.cos(z), j = x + d * M.sin(z), o = Fb(i, j, c, d, f, 0, h, C, E, [z, B, w, x])
						}
						A = z - y;
						var F = M.cos(y),
							G = M.sin(y),
							H = M.cos(z),
							J = M.sin(z),
							K = M.tan(A / 4),
							L = 4 / 3 * c * K,
							N = 4 / 3 * d * K,
							O = [a, b],
							Q = [a + L * G, b - N * F],
							S = [i + L * J, j - N * H],
							T = [i, j];
						if (Q[0] = 2 * O[0] - Q[0], Q[1] = 2 * O[1] - Q[1], k) return [Q, S, T][D](o);
						o = [Q, S, T][D](o).join()[I](",");
						for (var U = [], V = 0, W = o.length; W > V; V++) U[V] = V % 2 ? p(o[V - 1], o[V], n).y : p(o[V], o[V + 1], n).x;
						return U
					},
					Gb = function (a, b, c, d, e, f, g, h, i) {
						var j = 1 - i;
						return {
							x: Q(j, 3) * a + 3 * Q(j, 2) * i * c + 3 * j * i * i * e + Q(i, 3) * g,
							y: Q(j, 3) * b + 3 * Q(j, 2) * i * d + 3 * j * i * i * f + Q(i, 3) * h
						}
					},
					Hb = e(function (a, b, c, d, e, f, g, h) {
						var i, j = e - 2 * c + a - (g - 2 * e + c),
							k = 2 * (c - a) - 2 * (e - c),
							l = a - c,
							m = (-k + M.sqrt(k * k - 4 * j * l)) / 2 / j,
							n = (-k - M.sqrt(k * k - 4 * j * l)) / 2 / j,
							o = [b, h],
							p = [a, g];
						return P(m) > "1e12" && (m = .5), P(n) > "1e12" && (n = .5), m > 0 && 1 > m && (i = Gb(a, b, c, d, e, f, g, h, m), p.push(i.x), o.push(i.y)), n > 0 && 1 > n && (i = Gb(a, b, c, d, e, f, g, h, n), p.push(i.x), o.push(i.y)), j = f - 2 * d + b - (h - 2 * f + d), k = 2 * (d - b) - 2 * (f - d), l = b - d, m = (-k + M.sqrt(k * k - 4 * j * l)) / 2 / j, n = (-k - M.sqrt(k * k - 4 * j * l)) / 2 / j, P(m) > "1e12" && (m = .5), P(n) > "1e12" && (n = .5), m > 0 && 1 > m && (i = Gb(a, b, c, d, e, f, g, h, m), p.push(i.x), o.push(i.y)), n > 0 && 1 > n && (i = Gb(a, b, c, d, e, f, g, h, n), p.push(i.x), o.push(i.y)), {
							min: {
								x: O[C](0, p),
								y: O[C](0, o)
							},
							max: {
								x: N[C](0, p),
								y: N[C](0, o)
							}
						}
					}),
					Ib = b._path2curve = e(function (a, b) {
						var c = !b && yb(a);
						if (!b && c.curve) return Ab(c.curve);
						for (var d = Cb(a), e = b && Cb(b), f = {
								x: 0,
								y: 0,
								bx: 0,
								by: 0,
								X: 0,
								Y: 0,
								qx: null,
								qy: null
							}, g = {
								x: 0,
								y: 0,
								bx: 0,
								by: 0,
								X: 0,
								Y: 0,
								qx: null,
								qy: null
							}, h = (function (a, b, c) {
								var d, e, f = {
									T: 1,
									Q: 1
								};
								if (!a) return ["C", b.x, b.y, b.x, b.y, b.x, b.y];
								switch (!(a[0] in f) && (b.qx = b.qy = null), a[0]) {
									case "M":
										b.X = a[1], b.Y = a[2];
										break;
									case "A":
										a = ["C"][D](Fb[C](0, [b.x, b.y][D](a.slice(1))));
										break;
									case "S":
										"C" == c || "S" == c ? (d = 2 * b.x - b.bx, e = 2 * b.y - b.by) : (d = b.x, e = b.y), a = ["C", d, e][D](a.slice(1));
										break;
									case "T":
										"Q" == c || "T" == c ? (b.qx = 2 * b.x - b.qx, b.qy = 2 * b.y - b.qy) : (b.qx = b.x, b.qy = b.y), a = ["C"][D](Eb(b.x, b.y, b.qx, b.qy, a[1], a[2]));
										break;
									case "Q":
										b.qx = a[1], b.qy = a[2], a = ["C"][D](Eb(b.x, b.y, a[1], a[2], a[3], a[4]));
										break;
									case "L":
										a = ["C"][D](Db(b.x, b.y, a[1], a[2]));
										break;
									case "H":
										a = ["C"][D](Db(b.x, b.y, a[1], b.y));
										break;
									case "V":
										a = ["C"][D](Db(b.x, b.y, b.x, a[1]));
										break;
									case "Z":
										a = ["C"][D](Db(b.x, b.y, b.X, b.Y))
								}
								return a
							}), i = function (a, b) {
								if (a[b].length > 7) {
									a[b].shift();
									for (var c = a[b]; c.length;) k[b] = "A", e && (l[b] = "A"), a.splice(b++, 0, ["C"][D](c.splice(0, 6)));
									a.splice(b, 1), p = N(d.length, e && e.length || 0)
								}
							}, j = function (a, b, c, f, g) {
								a && b && "M" == a[g][0] && "M" != b[g][0] && (b.splice(g, 0, ["M", f.x, f.y]), c.bx = 0, c.by = 0, c.x = a[g][1], c.y = a[g][2], p = N(d.length, e && e.length || 0))
							}, k = [], l = [], m = "", n = "", o = 0, p = N(d.length, e && e.length || 0); p > o; o++) {
							d[o] && (m = d[o][0]), "C" != m && (k[o] = m, o && (n = k[o - 1])), d[o] = h(d[o], f, n), "A" != k[o] && "C" == m && (k[o] = "C"), i(d, o), e && (e[o] && (m = e[o][0]), "C" != m && (l[o] = m, o && (n = l[o - 1])), e[o] = h(e[o], g, n), "A" != l[o] && "C" == m && (l[o] = "C"), i(e, o)), j(d, e, f, g, o), j(e, d, g, f, o);
							var q = d[o],
								r = e && e[o],
								s = q.length,
								t = e && r.length;
							f.x = q[s - 2], f.y = q[s - 1], f.bx = $(q[s - 4]) || f.x, f.by = $(q[s - 3]) || f.y, g.bx = e && ($(r[t - 4]) || g.x), g.by = e && ($(r[t - 3]) || g.y), g.x = e && r[t - 2], g.y = e && r[t - 1]
						}
						return e || (c.curve = Ab(d)), e ? [d, e] : d
					}, null, Ab),
					Jb = (b._parseDots = e(function (a) {
						for (var c = [], d = 0, e = a.length; e > d; d++) {
							var f = {},
								g = a[d].match(/^([^:]*):?([\d\.]*)/);
							if (f.color = b.getRGB(g[1]), f.color.error) return null;
							f.opacity = f.color.opacity, f.color = f.color.hex, g[2] && (f.offset = g[2] + "%"), c.push(f)
						}
						for (d = 1, e = c.length - 1; e > d; d++)
							if (!c[d].offset) {
								for (var h = $(c[d - 1].offset || 0), i = 0, j = d + 1; e > j; j++)
									if (c[j].offset) {
										i = c[j].offset;
										break
									}
								i || (i = 100, j = e), i = $(i);
								for (var k = (i - h) / (j - d + 1); j > d; d++) h += k, c[d].offset = h + "%"
							}
						return c
					}), b._tear = function (a, b) {
						a == b.top && (b.top = a.prev), a == b.bottom && (b.bottom = a.next), a.next && (a.next.prev = a.prev), a.prev && (a.prev.next = a.next)
					}),
					Kb = (b._tofront = function (a, b) {
						b.top !== a && (Jb(a, b), a.next = null, a.prev = b.top, b.top.next = a, b.top = a)
					}, b._toback = function (a, b) {
						b.bottom !== a && (Jb(a, b), a.next = b.bottom, a.prev = null, b.bottom.prev = a, b.bottom = a)
					}, b._insertafter = function (a, b, c) {
						Jb(a, c), b == c.top && (c.top = a), b.next && (b.next.prev = a), a.next = b.next, a.prev = b, b.next = a
					}, b._insertbefore = function (a, b, c) {
						Jb(a, c), b == c.bottom && (c.bottom = a), b.prev && (b.prev.next = a), a.prev = b.prev, b.prev = a, a.next = b
					}, b.toMatrix = function (a, b) {
						var c = zb(a),
							d = {
								_: {
									transform: F
								},
								getBBox: function () {
									return c
								}
							};
						return Lb(d, b), d.matrix
					}),
					Lb = (b.transformPath = function (a, b) {
						return pb(a, Kb(a, b))
					}, b._extractTransform = function (a, c) {
						if (null == c) return a._.transform;
						c = H(c).replace(/\.{3}|\u2026/g, a._.transform || F);
						var d = b.parseTransformString(c),
							e = 0,
							f = 0,
							g = 0,
							h = 1,
							i = 1,
							j = a._,
							k = new n;
						if (j.transform = d || [], d)
							for (var l = 0, m = d.length; m > l; l++) {
								var o, p, q, r, s, t = d[l],
									u = t.length,
									v = H(t[0]).toLowerCase(),
									w = t[0] != v,
									x = w ? k.invert() : 0;
								"t" == v && 3 == u ? w ? (o = x.x(0, 0), p = x.y(0, 0), q = x.x(t[1], t[2]), r = x.y(t[1], t[2]), k.translate(q - o, r - p)) : k.translate(t[1], t[2]) : "r" == v ? 2 == u ? (s = s || a.getBBox(1), k.rotate(t[1], s.x + s.width / 2, s.y + s.height / 2), e += t[1]) : 4 == u && (w ? (q = x.x(t[2], t[3]), r = x.y(t[2], t[3]), k.rotate(t[1], q, r)) : k.rotate(t[1], t[2], t[3]), e += t[1]) : "s" == v ? 2 == u || 3 == u ? (s = s || a.getBBox(1), k.scale(t[1], t[u - 1], s.x + s.width / 2, s.y + s.height / 2), h *= t[1], i *= t[u - 1]) : 5 == u && (w ? (q = x.x(t[3], t[4]), r = x.y(t[3], t[4]), k.scale(t[1], t[2], q, r)) : k.scale(t[1], t[2], t[3], t[4]), h *= t[1], i *= t[2]) : "m" == v && 7 == u && k.add(t[1], t[2], t[3], t[4], t[5], t[6]), j.dirtyT = 1, a.matrix = k
							}
						a.matrix = k, j.sx = h, j.sy = i, j.deg = e, j.dx = f = k.e, j.dy = g = k.f, 1 == h && 1 == i && !e && j.bbox ? (j.bbox.x += +f, j.bbox.y += +g) : j.dirtyT = 1
					}),
					Mb = function (a) {
						var b = a[0];
						switch (b.toLowerCase()) {
							case "t":
								return [b, 0, 0];
							case "m":
								return [b, 1, 0, 0, 1, 0, 0];
							case "r":
								return 4 == a.length ? [b, 0, a[2], a[3]] : [b, 0];
							case "s":
								return 5 == a.length ? [b, 1, 1, a[3], a[4]] : 3 == a.length ? [b, 1, 1] : [b, 1]
						}
					},
					Nb = b._equaliseTransform = function (a, c) {
						c = H(c).replace(/\.{3}|\u2026/g, a), a = b.parseTransformString(a) || [], c = b.parseTransformString(c) || [];
						for (var d, e, f, g, h = N(a.length, c.length), i = [], j = [], k = 0; h > k; k++) {
							if (f = a[k] || Mb(c[k]), g = c[k] || Mb(f), f[0] != g[0] || "r" == f[0].toLowerCase() && (f[2] != g[2] || f[3] != g[3]) || "s" == f[0].toLowerCase() && (f[3] != g[3] || f[4] != g[4])) return;
							for (i[k] = [], j[k] = [], d = 0, e = N(f.length, g.length); e > d; d++) d in f && (i[k][d] = f[d]), d in g && (j[k][d] = g[d])
						}
						return {
							from: i,
							to: j
						}
					};
				b._getContainer = function (a, c, d, e) {
						var f;
						return f = null != e || b.is(a, "object") ? a : z.doc.getElementById(a), null != f ? f.tagName ? null == c ? {
							container: f,
							width: f.style.pixelWidth || f.offsetWidth,
							height: f.style.pixelHeight || f.offsetHeight
						} : {
							container: f,
							width: c,
							height: d
						} : {
							container: 1,
							x: a,
							y: c,
							width: d,
							height: e
						} : void 0
					}, b.pathToRelative = Bb, b._engine = {}, b.path2curve = Ib, b.matrix = function (a, b, c, d, e, f) {
						return new n(a, b, c, d, e, f)
					},
					function (a) {
						function c(a) {
							return a[0] * a[0] + a[1] * a[1]
						}

						function d(a) {
							var b = M.sqrt(c(a));
							a[0] && (a[0] /= b), a[1] && (a[1] /= b)
						}
						a.add = function (a, b, c, d, e, f) {
							var g, h, i, j, k = [
									[],
									[],
									[]
								],
								l = [
									[this.a, this.c, this.e],
									[this.b, this.d, this.f],
									[0, 0, 1]
								],
								m = [
									[a, c, e],
									[b, d, f],
									[0, 0, 1]
								];
							for (a && a instanceof n && (m = [
									[a.a, a.c, a.e],
									[a.b, a.d, a.f],
									[0, 0, 1]
								]), g = 0; 3 > g; g++)
								for (h = 0; 3 > h; h++) {
									for (j = 0, i = 0; 3 > i; i++) j += l[g][i] * m[i][h];
									k[g][h] = j
								}
							this.a = k[0][0], this.b = k[1][0], this.c = k[0][1], this.d = k[1][1], this.e = k[0][2], this.f = k[1][2]
						}, a.invert = function () {
							var a = this,
								b = a.a * a.d - a.b * a.c;
							return new n(a.d / b, -a.b / b, -a.c / b, a.a / b, (a.c * a.f - a.d * a.e) / b, (a.b * a.e - a.a * a.f) / b)
						}, a.clone = function () {
							return new n(this.a, this.b, this.c, this.d, this.e, this.f)
						}, a.translate = function (a, b) {
							this.add(1, 0, 0, 1, a, b)
						}, a.scale = function (a, b, c, d) {
							null == b && (b = a), (c || d) && this.add(1, 0, 0, 1, c, d), this.add(a, 0, 0, b, 0, 0), (c || d) && this.add(1, 0, 0, 1, -c, -d)
						}, a.rotate = function (a, c, d) {
							a = b.rad(a), c = c || 0, d = d || 0;
							var e = +M.cos(a).toFixed(9),
								f = +M.sin(a).toFixed(9);
							this.add(e, f, -f, e, c, d), this.add(1, 0, 0, 1, -c, -d)
						}, a.x = function (a, b) {
							return a * this.a + b * this.c + this.e
						}, a.y = function (a, b) {
							return a * this.b + b * this.d + this.f
						}, a.get = function (a) {
							return +this[H.fromCharCode(97 + a)].toFixed(4)
						}, a.toString = function () {
							return b.svg ? "matrix(" + [this.get(0), this.get(1), this.get(2), this.get(3), this.get(4), this.get(5)].join() + ")" : [this.get(0), this.get(2), this.get(1), this.get(3), 0, 0].join()
						}, a.toFilter = function () {
							return "progid:DXImageTransform.Microsoft.Matrix(M11=" + this.get(0) + ", M12=" + this.get(2) + ", M21=" + this.get(1) + ", M22=" + this.get(3) + ", Dx=" + this.get(4) + ", Dy=" + this.get(5) + ", sizingmethod='auto expand')"
						}, a.offset = function () {
							return [this.e.toFixed(4), this.f.toFixed(4)]
						}, a.split = function () {
							var a = {};
							a.dx = this.e, a.dy = this.f;
							var e = [
								[this.a, this.c],
								[this.b, this.d]
							];
							a.scalex = M.sqrt(c(e[0])), d(e[0]), a.shear = e[0][0] * e[1][0] + e[0][1] * e[1][1], e[1] = [e[1][0] - e[0][0] * a.shear, e[1][1] - e[0][1] * a.shear], a.scaley = M.sqrt(c(e[1])), d(e[1]), a.shear /= a.scaley;
							var f = -e[0][1],
								g = e[1][1];
							return 0 > g ? (a.rotate = b.deg(M.acos(g)), 0 > f && (a.rotate = 360 - a.rotate)) : a.rotate = b.deg(M.asin(f)), a.isSimple = !(+a.shear.toFixed(9) || a.scalex.toFixed(9) != a.scaley.toFixed(9) && a.rotate), a.isSuperSimple = !+a.shear.toFixed(9) && a.scalex.toFixed(9) == a.scaley.toFixed(9) && !a.rotate, a.noRotation = !+a.shear.toFixed(9) && !a.rotate, a
						}, a.toTransformString = function (a) {
							var b = a || this[I]();
							return b.isSimple ? (b.scalex = +b.scalex.toFixed(4), b.scaley = +b.scaley.toFixed(4), b.rotate = +b.rotate.toFixed(4), (b.dx || b.dy ? "t" + [b.dx, b.dy] : F) + (1 != b.scalex || 1 != b.scaley ? "s" + [b.scalex, b.scaley, 0, 0] : F) + (b.rotate ? "r" + [b.rotate, 0, 0] : F)) : "m" + [this.get(0), this.get(1), this.get(2), this.get(3), this.get(4), this.get(5)]
						}
					}(n.prototype);
				for (var Ob = function () {
						this.returnValue = !1
					}, Pb = function () {
						return this.originalEvent.preventDefault()
					}, Qb = function () {
						this.cancelBubble = !0
					}, Rb = function () {
						return this.originalEvent.stopPropagation()
					}, Sb = function (a) {
						var b = z.doc.documentElement.scrollTop || z.doc.body.scrollTop,
							c = z.doc.documentElement.scrollLeft || z.doc.body.scrollLeft;
						return {
							x: a.clientX + c,
							y: a.clientY + b
						}
					}, Tb = function () {
						return z.doc.addEventListener ? function (a, b, c, d) {
							var e = function (a) {
								var b = Sb(a);
								return c.call(d, a, b.x, b.y)
							};
							if (a.addEventListener(b, e, !1), E && K[b]) {
								var f = function (b) {
									for (var e = Sb(b), f = b, g = 0, h = b.targetTouches && b.targetTouches.length; h > g; g++)
										if (b.targetTouches[g].target == a) {
											b = b.targetTouches[g], b.originalEvent = f, b.preventDefault = Pb, b.stopPropagation = Rb;
											break
										}
									return c.call(d, b, e.x, e.y)
								};
								a.addEventListener(K[b], f, !1)
							}
							return function () {
								return a.removeEventListener(b, e, !1), E && K[b] && a.removeEventListener(K[b], f, !1), !0
							}
						} : z.doc.attachEvent ? function (a, b, c, d) {
							var e = function (a) {
								a = a || z.win.event;
								var b = z.doc.documentElement.scrollTop || z.doc.body.scrollTop,
									e = z.doc.documentElement.scrollLeft || z.doc.body.scrollLeft,
									f = a.clientX + e,
									g = a.clientY + b;
								return a.preventDefault = a.preventDefault || Ob, a.stopPropagation = a.stopPropagation || Qb, c.call(d, a, f, g)
							};
							a.attachEvent("on" + b, e);
							var f = function () {
								return a.detachEvent("on" + b, e), !0
							};
							return f
						} : void 0
					}(), Ub = [], Vb = function (b) {
						for (var c, d = b.clientX, e = b.clientY, f = z.doc.documentElement.scrollTop || z.doc.body.scrollTop, g = z.doc.documentElement.scrollLeft || z.doc.body.scrollLeft, h = Ub.length; h--;) {
							if (c = Ub[h], E && b.touches) {
								for (var i, j = b.touches.length; j--;)
									if (i = b.touches[j], i.identifier == c.el._drag.id) {
										d = i.clientX, e = i.clientY, (b.originalEvent ? b.originalEvent : b).preventDefault();
										break
									}
							} else b.preventDefault();
							var k, l = c.el.node,
								m = l.nextSibling,
								n = l.parentNode,
								o = l.style.display;
							z.win.opera && n.removeChild(l), l.style.display = "none", k = c.el.paper.getElementByPoint(d, e), l.style.display = o, z.win.opera && (m ? n.insertBefore(l, m) : n.appendChild(l)), k && a("raphael.drag.over." + c.el.id, c.el, k), d += g, e += f, a("raphael.drag.move." + c.el.id, c.move_scope || c.el, d - c.el._drag.x, e - c.el._drag.y, d, e, b)
						}
					}, Wb = function (c) {
						b.unmousemove(Vb).unmouseup(Wb);
						for (var d, e = Ub.length; e--;) d = Ub[e], d.el._drag = {}, a("raphael.drag.end." + d.el.id, d.end_scope || d.start_scope || d.move_scope || d.el, c);
						Ub = []
					}, Xb = b.el = {}, Yb = J.length; Yb--;) ! function (a) {
					b[a] = Xb[a] = function (c, d) {
						return b.is(c, "function") && (this.events = this.events || [], this.events.push({
							name: a,
							f: c,
							unbind: Tb(this.shape || this.node || z.doc, a, c, d || this)
						})), this
					}, b["un" + a] = Xb["un" + a] = function (c) {
						for (var d = this.events || [], e = d.length; e--;) d[e].name != a || !b.is(c, "undefined") && d[e].f != c || (d[e].unbind(), d.splice(e, 1), !d.length && delete this.events);
						return this
					}
				}(J[Yb]);
				Xb.data = function (c, d) {
					var e = jb[this.id] = jb[this.id] || {};
					if (0 == arguments.length) return e;
					if (1 == arguments.length) {
						if (b.is(c, "object")) {
							for (var f in c) c[y](f) && this.data(f, c[f]);
							return this
						}
						return a("raphael.data.get." + this.id, this, e[c], c), e[c]
					}
					return e[c] = d, a("raphael.data.set." + this.id, this, d, c), this
				}, Xb.removeData = function (a) {
					return null == a ? jb[this.id] = {} : jb[this.id] && delete jb[this.id][a], this
				}, Xb.getData = function () {
					return c(jb[this.id] || {})
				}, Xb.hover = function (a, b, c, d) {
					return this.mouseover(a, c).mouseout(b, d || c)
				}, Xb.unhover = function (a, b) {
					return this.unmouseover(a).unmouseout(b)
				};
				var Zb = [];
				Xb.drag = function (c, d, e, f, g, h) {
					function i(i) {
						(i.originalEvent || i).preventDefault();
						var j = i.clientX,
							k = i.clientY,
							l = z.doc.documentElement.scrollTop || z.doc.body.scrollTop,
							m = z.doc.documentElement.scrollLeft || z.doc.body.scrollLeft;
						if (this._drag.id = i.identifier, E && i.touches)
							for (var n, o = i.touches.length; o--;)
								if (n = i.touches[o], this._drag.id = n.identifier, n.identifier == this._drag.id) {
									j = n.clientX, k = n.clientY;
									break
								}
						this._drag.x = j + m, this._drag.y = k + l, !Ub.length && b.mousemove(Vb).mouseup(Wb), Ub.push({
							el: this,
							move_scope: f,
							start_scope: g,
							end_scope: h
						}), d && a.on("raphael.drag.start." + this.id, d), c && a.on("raphael.drag.move." + this.id, c), e && a.on("raphael.drag.end." + this.id, e), a("raphael.drag.start." + this.id, g || f || this, i.clientX + m, i.clientY + l, i)
					}
					return this._drag = {}, Zb.push({
						el: this,
						start: i
					}), this.mousedown(i), this
				}, Xb.onDragOver = function (b) {
					b ? a.on("raphael.drag.over." + this.id, b) : a.unbind("raphael.drag.over." + this.id)
				}, Xb.undrag = function () {
					for (var c = Zb.length; c--;) Zb[c].el == this && (this.unmousedown(Zb[c].start), Zb.splice(c, 1), a.unbind("raphael.drag.*." + this.id));
					!Zb.length && b.unmousemove(Vb).unmouseup(Wb), Ub = []
				}, u.circle = function (a, c, d) {
					var e = b._engine.circle(this, a || 0, c || 0, d || 0);
					return this.__set__ && this.__set__.push(e), e
				}, u.rect = function (a, c, d, e, f) {
					var g = b._engine.rect(this, a || 0, c || 0, d || 0, e || 0, f || 0);
					return this.__set__ && this.__set__.push(g), g
				}, u.ellipse = function (a, c, d, e) {
					var f = b._engine.ellipse(this, a || 0, c || 0, d || 0, e || 0);
					return this.__set__ && this.__set__.push(f), f
				}, u.path = function (a) {
					a && !b.is(a, T) && !b.is(a[0], U) && (a += F);
					var c = b._engine.path(b.format[C](b, arguments), this);
					return this.__set__ && this.__set__.push(c), c
				}, u.image = function (a, c, d, e, f) {
					var g = b._engine.image(this, a || "about:blank", c || 0, d || 0, e || 0, f || 0);
					return this.__set__ && this.__set__.push(g), g
				}, u.text = function (a, c, d) {
					var e = b._engine.text(this, a || 0, c || 0, H(d));
					return this.__set__ && this.__set__.push(e), e
				}, u.set = function (a) {
					!b.is(a, "array") && (a = Array.prototype.splice.call(arguments, 0, arguments.length));
					var c = new jc(a);
					return this.__set__ && this.__set__.push(c), c.paper = this, c.type = "set", c
				}, u.setStart = function (a) {
					this.__set__ = a || this.set()
				}, u.setFinish = function () {
					var a = this.__set__;
					return delete this.__set__, a
				}, u.getSize = function () {
					var a = this.canvas.parentNode;
					return {
						width: a.offsetWidth,
						height: a.offsetHeight
					}
				}, u.setSize = function (a, c) {
					return b._engine.setSize.call(this, a, c)
				}, u.setViewBox = function (a, c, d, e, f) {
					return b._engine.setViewBox.call(this, a, c, d, e, f)
				}, u.top = u.bottom = null, u.raphael = b;
				var $b = function (a) {
					var b = a.getBoundingClientRect(),
						c = a.ownerDocument,
						d = c.body,
						e = c.documentElement,
						f = e.clientTop || d.clientTop || 0,
						g = e.clientLeft || d.clientLeft || 0,
						h = b.top + (z.win.pageYOffset || e.scrollTop || d.scrollTop) - f,
						i = b.left + (z.win.pageXOffset || e.scrollLeft || d.scrollLeft) - g;
					return {
						y: h,
						x: i
					}
				};
				u.getElementByPoint = function (a, b) {
					var c = this,
						d = c.canvas,
						e = z.doc.elementFromPoint(a, b);
					if (z.win.opera && "svg" == e.tagName) {
						var f = $b(d),
							g = d.createSVGRect();
						g.x = a - f.x, g.y = b - f.y, g.width = g.height = 1;
						var h = d.getIntersectionList(g, null);
						h.length && (e = h[h.length - 1])
					}
					if (!e) return null;
					for (; e.parentNode && e != d.parentNode && !e.raphael;) e = e.parentNode;
					return e == c.canvas.parentNode && (e = d), e = e && e.raphael ? c.getById(e.raphaelid) : null
				}, u.getElementsByBBox = function (a) {
					var c = this.set();
					return this.forEach(function (d) {
						b.isBBoxIntersect(d.getBBox(), a) && c.push(d)
					}), c
				}, u.getById = function (a) {
					for (var b = this.bottom; b;) {
						if (b.id == a) return b;
						b = b.next
					}
					return null
				}, u.forEach = function (a, b) {
					for (var c = this.bottom; c;) {
						if (a.call(b, c) === !1) return this;
						c = c.next
					}
					return this
				}, u.getElementsByPoint = function (a, b) {
					var c = this.set();
					return this.forEach(function (d) {
						d.isPointInside(a, b) && c.push(d)
					}), c
				}, Xb.isPointInside = function (a, c) {
					var d = this.realPath = ob[this.type](this);
					return this.attr("transform") && this.attr("transform").length && (d = b.transformPath(d, this.attr("transform"))), b.isPointInsidePath(d, a, c)
				}, Xb.getBBox = function (a) {
					if (this.removed) return {};
					var b = this._;
					return a ? (!b.dirty && b.bboxwt || (this.realPath = ob[this.type](this), b.bboxwt = zb(this.realPath), b.bboxwt.toString = o, b.dirty = 0), b.bboxwt) : ((b.dirty || b.dirtyT || !b.bbox) && (!b.dirty && this.realPath || (b.bboxwt = 0, this.realPath = ob[this.type](this)), b.bbox = zb(pb(this.realPath, this.matrix)), b.bbox.toString = o, b.dirty = b.dirtyT = 0), b.bbox)
				}, Xb.clone = function () {
					if (this.removed) return null;
					var a = this.paper[this.type]().attr(this.attr());
					return this.__set__ && this.__set__.push(a), a
				}, Xb.glow = function (a) {
					if ("text" == this.type) return null;
					a = a || {};
					var b = {
							width: (a.width || 10) + (+this.attr("stroke-width") || 1),
							fill: a.fill || !1,
							opacity: null == a.opacity ? .5 : a.opacity,
							offsetx: a.offsetx || 0,
							offsety: a.offsety || 0,
							color: a.color || "#000"
						},
						c = b.width / 2,
						d = this.paper,
						e = d.set(),
						f = this.realPath || ob[this.type](this);
					f = this.matrix ? pb(f, this.matrix) : f;
					for (var g = 1; c + 1 > g; g++) e.push(d.path(f).attr({
						stroke: b.color,
						fill: b.fill ? b.color : "none",
						"stroke-linejoin": "round",
						"stroke-linecap": "round",
						"stroke-width": +(b.width / c * g).toFixed(3),
						opacity: +(b.opacity / c).toFixed(3)
					}));
					return e.insertBefore(this).translate(b.offsetx, b.offsety)
				};
				var _b = function (a, c, d, e, f, g, h, k, l) {
						return null == l ? i(a, c, d, e, f, g, h, k) : b.findDotsAtSegment(a, c, d, e, f, g, h, k, j(a, c, d, e, f, g, h, k, l))
					},
					ac = function (a, c) {
						return function (d, e, f) {
							d = Ib(d);
							for (var g, h, i, j, k, l = "", m = {}, n = 0, o = 0, p = d.length; p > o; o++) {
								if (i = d[o], "M" == i[0]) g = +i[1], h = +i[2];
								else {
									if (j = _b(g, h, i[1], i[2], i[3], i[4], i[5], i[6]), n + j > e) {
										if (c && !m.start) {
											if (k = _b(g, h, i[1], i[2], i[3], i[4], i[5], i[6], e - n), l += ["C" + k.start.x, k.start.y, k.m.x, k.m.y, k.x, k.y], f) return l;
											m.start = l, l = ["M" + k.x, k.y + "C" + k.n.x, k.n.y, k.end.x, k.end.y, i[5], i[6]].join(), n += j, g = +i[5], h = +i[6];
											continue
										}
										if (!a && !c) return k = _b(g, h, i[1], i[2], i[3], i[4], i[5], i[6], e - n), {
											x: k.x,
											y: k.y,
											alpha: k.alpha
										}
									}
									n += j, g = +i[5], h = +i[6]
								}
								l += i.shift() + i
							}
							return m.end = l, k = a ? n : c ? m : b.findDotsAtSegment(g, h, i[0], i[1], i[2], i[3], i[4], i[5], 1), k.alpha && (k = {
								x: k.x,
								y: k.y,
								alpha: k.alpha
							}), k
						}
					},
					bc = ac(1),
					cc = ac(),
					dc = ac(0, 1);
				b.getTotalLength = bc, b.getPointAtLength = cc, b.getSubpath = function (a, b, c) {
					if (this.getTotalLength(a) - c < 1e-6) return dc(a, b).end;
					var d = dc(a, c, 1);
					return b ? dc(d, b).end : d
				}, Xb.getTotalLength = function () {
					var a = this.getPath();
					return a ? this.node.getTotalLength ? this.node.getTotalLength() : bc(a) : void 0
				}, Xb.getPointAtLength = function (a) {
					var b = this.getPath();
					return b ? cc(b, a) : void 0
				}, Xb.getPath = function () {
					var a, c = b._getPath[this.type];
					return "text" != this.type && "set" != this.type ? (c && (a = c(this)), a) : void 0
				}, Xb.getSubpath = function (a, c) {
					var d = this.getPath();
					return d ? b.getSubpath(d, a, c) : void 0
				};
				var ec = b.easing_formulas = {
					linear: function (a) {
						return a
					},
					"<": function (a) {
						return Q(a, 1.7)
					},
					">": function (a) {
						return Q(a, .48)
					},
					"<>": function (a) {
						var b = .48 - a / 1.04,
							c = M.sqrt(.1734 + b * b),
							d = c - b,
							e = Q(P(d), 1 / 3) * (0 > d ? -1 : 1),
							f = -c - b,
							g = Q(P(f), 1 / 3) * (0 > f ? -1 : 1),
							h = e + g + .5;
						return 3 * (1 - h) * h * h + h * h * h
					},
					backIn: function (a) {
						var b = 1.70158;
						return a * a * ((b + 1) * a - b)
					},
					backOut: function (a) {
						a -= 1;
						var b = 1.70158;
						return a * a * ((b + 1) * a + b) + 1
					},
					elastic: function (a) {
						return a == !!a ? a : Q(2, -10 * a) * M.sin(2 * (a - .075) * R / .3) + 1
					},
					bounce: function (a) {
						var b, c = 7.5625,
							d = 2.75;
						return 1 / d > a ? b = c * a * a : 2 / d > a ? (a -= 1.5 / d, b = c * a * a + .75) : 2.5 / d > a ? (a -= 2.25 / d, b = c * a * a + .9375) : (a -= 2.625 / d, b = c * a * a + .984375), b
					}
				};
				ec.easeIn = ec["ease-in"] = ec["<"], ec.easeOut = ec["ease-out"] = ec[">"], ec.easeInOut = ec["ease-in-out"] = ec["<>"], ec["back-in"] = ec.backIn, ec["back-out"] = ec.backOut;
				var fc = [],
					gc = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (a) {
						setTimeout(a, 16)
					},
					hc = function () {
						for (var c = +new Date, d = 0; d < fc.length; d++) {
							var e = fc[d];
							if (!e.el.removed && !e.paused) {
								var f, g, h = c - e.start,
									i = e.ms,
									j = e.easing,
									k = e.from,
									l = e.diff,
									m = e.to,
									n = (e.t, e.el),
									o = {},
									p = {};
								if (e.initstatus ? (h = (e.initstatus * e.anim.top - e.prev) / (e.percent - e.prev) * i, e.status = e.initstatus, delete e.initstatus, e.stop && fc.splice(d--, 1)) : e.status = (e.prev + (e.percent - e.prev) * (h / i)) / e.anim.top, !(0 > h))
									if (i > h) {
										var q = j(h / i);
										for (var s in k)
											if (k[y](s)) {
												switch (cb[s]) {
													case S:
														f = +k[s] + q * i * l[s];
														break;
													case "colour":
														f = "rgb(" + [ic(Z(k[s].r + q * i * l[s].r)), ic(Z(k[s].g + q * i * l[s].g)), ic(Z(k[s].b + q * i * l[s].b))].join(",") + ")";
														break;
													case "path":
														f = [];
														for (var t = 0, u = k[s].length; u > t; t++) {
															f[t] = [k[s][t][0]];
															for (var v = 1, w = k[s][t].length; w > v; v++) f[t][v] = +k[s][t][v] + q * i * l[s][t][v];
															f[t] = f[t].join(G)
														}
														f = f.join(G);
														break;
													case "transform":
														if (l[s].real)
															for (f = [], t = 0, u = k[s].length; u > t; t++)
																for (f[t] = [k[s][t][0]], v = 1, w = k[s][t].length; w > v; v++) f[t][v] = k[s][t][v] + q * i * l[s][t][v];
														else {
															var x = function (a) {
																return +k[s][a] + q * i * l[s][a]
															};
															f = [
																["m", x(0), x(1), x(2), x(3), x(4), x(5)]
															]
														}
														break;
													case "csv":
														if ("clip-rect" == s)
															for (f = [], t = 4; t--;) f[t] = +k[s][t] + q * i * l[s][t];
														break;
													default:
														var z = [][D](k[s]);
														for (f = [], t = n.paper.customAttributes[s].length; t--;) f[t] = +z[t] + q * i * l[s][t]
												}
												o[s] = f
											}
										n.attr(o),
											function (b, c, d) {
												setTimeout(function () {
													a("raphael.anim.frame." + b, c, d)
												})
											}(n.id, n, e.anim)
									} else {
										if (function (c, d, e) {
												setTimeout(function () {
													a("raphael.anim.frame." + d.id, d, e), a("raphael.anim.finish." + d.id, d, e), b.is(c, "function") && c.call(d)
												})
											}(e.callback, n, e.anim), n.attr(m), fc.splice(d--, 1), e.repeat > 1 && !e.next) {
											for (g in m) m[y](g) && (p[g] = e.totalOrigin[g]);
											e.el.attr(p), r(e.anim, e.el, e.anim.percents[0], null, e.totalOrigin, e.repeat - 1)
										}
										e.next && !e.stop && r(e.anim, e.el, e.next, null, e.totalOrigin, e.repeat)
									}
							}
						}
						fc.length && gc(hc)
					},
					ic = function (a) {
						return a > 255 ? 255 : 0 > a ? 0 : a
					};
				Xb.animateWith = function (a, c, d, e, f, g) {
					var h = this;
					if (h.removed) return g && g.call(h), h;
					var i = d instanceof q ? d : b.animation(d, e, f, g);
					r(i, h, i.percents[0], null, h.attr());
					for (var j = 0, k = fc.length; k > j; j++)
						if (fc[j].anim == c && fc[j].el == a) {
							fc[k - 1].start = fc[j].start;
							break
						}
					return h
				}, Xb.onAnimation = function (b) {
					return b ? a.on("raphael.anim.frame." + this.id, b) : a.unbind("raphael.anim.frame." + this.id), this
				}, q.prototype.delay = function (a) {
					var b = new q(this.anim, this.ms);
					return b.times = this.times, b.del = +a || 0, b
				}, q.prototype.repeat = function (a) {
					var b = new q(this.anim, this.ms);
					return b.del = this.del, b.times = M.floor(N(a, 0)) || 1, b
				}, b.animation = function (a, c, d, e) {
					if (a instanceof q) return a;
					!b.is(d, "function") && d || (e = e || d || null, d = null), a = Object(a), c = +c || 0;
					var f, g, h = {};
					for (g in a) a[y](g) && $(g) != g && $(g) + "%" != g && (f = !0, h[g] = a[g]);
					if (f) return d && (h.easing = d), e && (h.callback = e), new q({
						100: h
					}, c);
					if (e) {
						var i = 0;
						for (var j in a) {
							var k = _(j);
							a[y](j) && k > i && (i = k)
						}
						i += "%", !a[i].callback && (a[i].callback = e)
					}
					return new q(a, c)
				}, Xb.animate = function (a, c, d, e) {
					var f = this;
					if (f.removed) return e && e.call(f), f;
					var g = a instanceof q ? a : b.animation(a, c, d, e);
					return r(g, f, g.percents[0], null, f.attr()), f
				}, Xb.setTime = function (a, b) {
					return a && null != b && this.status(a, O(b, a.ms) / a.ms), this
				}, Xb.status = function (a, b) {
					var c, d, e = [],
						f = 0;
					if (null != b) return r(a, this, -1, O(b, 1)), this;
					for (c = fc.length; c > f; f++)
						if (d = fc[f], d.el.id == this.id && (!a || d.anim == a)) {
							if (a) return d.status;
							e.push({
								anim: d.anim,
								status: d.status
							})
						}
					return a ? 0 : e
				}, Xb.pause = function (b) {
					for (var c = 0; c < fc.length; c++) fc[c].el.id != this.id || b && fc[c].anim != b || a("raphael.anim.pause." + this.id, this, fc[c].anim) !== !1 && (fc[c].paused = !0);
					return this
				}, Xb.resume = function (b) {
					for (var c = 0; c < fc.length; c++)
						if (fc[c].el.id == this.id && (!b || fc[c].anim == b)) {
							var d = fc[c];
							a("raphael.anim.resume." + this.id, this, d.anim) !== !1 && (delete d.paused, this.status(d.anim, d.status))
						}
					return this
				}, Xb.stop = function (b) {
					for (var c = 0; c < fc.length; c++) fc[c].el.id != this.id || b && fc[c].anim != b || a("raphael.anim.stop." + this.id, this, fc[c].anim) !== !1 && fc.splice(c--, 1);
					return this
				}, a.on("raphael.remove", s), a.on("raphael.clear", s), Xb.toString = function () {
					return "Raphaël’s object"
				};
				var jc = function (a) {
						if (this.items = [], this.length = 0, this.type = "set", a)
							for (var b = 0, c = a.length; c > b; b++) !a[b] || a[b].constructor != Xb.constructor && a[b].constructor != jc || (this[this.items.length] = this.items[this.items.length] = a[b], this.length++)
					},
					kc = jc.prototype;
				kc.push = function () {
					for (var a, b, c = 0, d = arguments.length; d > c; c++) a = arguments[c], !a || a.constructor != Xb.constructor && a.constructor != jc || (b = this.items.length, this[b] = this.items[b] = a, this.length++);
					return this
				}, kc.pop = function () {
					return this.length && delete this[this.length--], this.items.pop()
				}, kc.forEach = function (a, b) {
					for (var c = 0, d = this.items.length; d > c; c++)
						if (a.call(b, this.items[c], c) === !1) return this;
					return this
				};
				for (var lc in Xb) Xb[y](lc) && (kc[lc] = function (a) {
					return function () {
						var b = arguments;
						return this.forEach(function (c) {
							c[a][C](c, b)
						})
					}
				}(lc));
				return kc.attr = function (a, c) {
						if (a && b.is(a, U) && b.is(a[0], "object"))
							for (var d = 0, e = a.length; e > d; d++) this.items[d].attr(a[d]);
						else
							for (var f = 0, g = this.items.length; g > f; f++) this.items[f].attr(a, c);
						return this
					}, kc.clear = function () {
						for (; this.length;) this.pop()
					}, kc.splice = function (a, b) {
						a = 0 > a ? N(this.length + a, 0) : a, b = N(0, O(this.length - a, b));
						var c, d = [],
							e = [],
							f = [];
						for (c = 2; c < arguments.length; c++) f.push(arguments[c]);
						for (c = 0; b > c; c++) e.push(this[a + c]);
						for (; c < this.length - a; c++) d.push(this[a + c]);
						var g = f.length;
						for (c = 0; c < g + d.length; c++) this.items[a + c] = this[a + c] = g > c ? f[c] : d[c - g];
						for (c = this.items.length = this.length -= b - g; this[c];) delete this[c++];
						return new jc(e)
					}, kc.exclude = function (a) {
						for (var b = 0, c = this.length; c > b; b++)
							if (this[b] == a) return this.splice(b, 1), !0
					}, kc.animate = function (a, c, d, e) {
						(b.is(d, "function") || !d) && (e = d || null);
						var f, g, h = this.items.length,
							i = h,
							j = this;
						if (!h) return this;
						e && (g = function () {
							!--h && e.call(j)
						}), d = b.is(d, T) ? d : g;
						var k = b.animation(a, c, d, g);
						for (f = this.items[--i].animate(k); i--;) this.items[i] && !this.items[i].removed && this.items[i].animateWith(f, k, k), this.items[i] && !this.items[i].removed || h--;
						return this
					}, kc.insertAfter = function (a) {
						for (var b = this.items.length; b--;) this.items[b].insertAfter(a);
						return this
					}, kc.getBBox = function () {
						for (var a = [], b = [], c = [], d = [], e = this.items.length; e--;)
							if (!this.items[e].removed) {
								var f = this.items[e].getBBox();
								a.push(f.x), b.push(f.y), c.push(f.x + f.width), d.push(f.y + f.height)
							}
						return a = O[C](0, a), b = O[C](0, b), c = N[C](0, c), d = N[C](0, d), {
							x: a,
							y: b,
							x2: c,
							y2: d,
							width: c - a,
							height: d - b
						}
					}, kc.clone = function (a) {
						a = this.paper.set();
						for (var b = 0, c = this.items.length; c > b; b++) a.push(this.items[b].clone());
						return a
					}, kc.toString = function () {
						return "Raphaël‘s set"
					}, kc.glow = function (a) {
						var b = this.paper.set();
						return this.forEach(function (c) {
							var d = c.glow(a);
							null != d && d.forEach(function (a) {
								b.push(a)
							})
						}), b
					}, kc.isPointInside = function (a, b) {
						var c = !1;
						return this.forEach(function (d) {
							return d.isPointInside(a, b) ? (c = !0, !1) : void 0
						}), c
					}, b.registerFont = function (a) {
						if (!a.face) return a;
						this.fonts = this.fonts || {};
						var b = {
								w: a.w,
								face: {},
								glyphs: {}
							},
							c = a.face["font-family"];
						for (var d in a.face) a.face[y](d) && (b.face[d] = a.face[d]);
						if (this.fonts[c] ? this.fonts[c].push(b) : this.fonts[c] = [b], !a.svg) {
							b.face["units-per-em"] = _(a.face["units-per-em"], 10);
							for (var e in a.glyphs)
								if (a.glyphs[y](e)) {
									var f = a.glyphs[e];
									if (b.glyphs[e] = {
											w: f.w,
											k: {},
											d: f.d && "M" + f.d.replace(/[mlcxtrv]/g, function (a) {
												return {
													l: "L",
													c: "C",
													x: "z",
													t: "m",
													r: "l",
													v: "c"
												}[a] || "M"
											}) + "z"
										}, f.k)
										for (var g in f.k) f[y](g) && (b.glyphs[e].k[g] = f.k[g])
								}
						}
						return a
					}, u.getFont = function (a, c, d, e) {
						if (e = e || "normal", d = d || "normal", c = +c || {
								normal: 400,
								bold: 700,
								lighter: 300,
								bolder: 800
							}[c] || 400, b.fonts) {
							var f = b.fonts[a];
							if (!f) {
								var g = new RegExp("(^|\\s)" + a.replace(/[^\w\d\s+!~.:_-]/g, F) + "(\\s|$)", "i");
								for (var h in b.fonts)
									if (b.fonts[y](h) && g.test(h)) {
										f = b.fonts[h];
										break
									}
							}
							var i;
							if (f)
								for (var j = 0, k = f.length; k > j && (i = f[j], i.face["font-weight"] != c || i.face["font-style"] != d && i.face["font-style"] || i.face["font-stretch"] != e); j++);
							return i
						}
					}, u.print = function (a, c, d, e, f, g, h, i) {
						g = g || "middle", h = N(O(h || 0, 1), -1), i = N(O(i || 1, 3), 1);
						var j, k = H(d)[I](F),
							l = 0,
							m = 0,
							n = F;
						if (b.is(e, "string") && (e = this.getFont(e)), e) {
							j = (f || 16) / e.face["units-per-em"];
							for (var o = e.face.bbox[I](v), p = +o[0], q = o[3] - o[1], r = 0, s = +o[1] + ("baseline" == g ? q + +e.face.descent : q / 2), t = 0, u = k.length; u > t; t++) {
								if ("\n" == k[t]) l = 0, x = 0, m = 0, r += q * i;
								else {
									var w = m && e.glyphs[k[t - 1]] || {},
										x = e.glyphs[k[t]];
									l += m ? (w.w || e.w) + (w.k && w.k[k[t]] || 0) + e.w * h : 0, m = 1
								}
								x && x.d && (n += b.transformPath(x.d, ["t", l * j, r * j, "s", j, j, p, s, "t", (a - p) / j, (c - s) / j]))
							}
						}
						return this.path(n).attr({
							fill: "#000",
							stroke: "none"
						})
					}, u.add = function (a) {
						if (b.is(a, "array"))
							for (var c, d = this.set(), e = 0, f = a.length; f > e; e++) c = a[e] || {}, w[y](c.type) && d.push(this[c.type]().attr(c));
						return d
					}, b.format = function (a, c) {
						var d = b.is(c, U) ? [0][D](c) : arguments;
						return a && b.is(a, T) && d.length - 1 && (a = a.replace(x, function (a, b) {
							return null == d[++b] ? F : d[b]
						})), a || F
					}, b.fullfill = function () {
						var a = /\{([^\}]+)\}/g,
							b = /(?:(?:^|\.)(.+?)(?=\[|\.|$|\()|\[('|")(.+?)\2\])(\(\))?/g,
							c = function (a, c, d) {
								var e = d;
								return c.replace(b, function (a, b, c, d, f) {
									b = b || d, e && (b in e && (e = e[b]), "function" == typeof e && f && (e = e()))
								}), e = (null == e || e == d ? a : e) + ""
							};
						return function (b, d) {
							return String(b).replace(a, function (a, b) {
								return c(a, b, d)
							})
						}
					}(), b.ninja = function () {
						if (A.was) z.win.Raphael = A.is;
						else {
							window.Raphael = void 0;
							try {
								delete window.Raphael
							} catch (a) {}
						}
						return b
					}, b.st = kc, a.on("raphael.DOMload", function () {
						t = !0
					}),
					function (a, c, d) {
						function e() {
							/in/.test(a.readyState) ? setTimeout(e, 9) : b.eve("raphael.DOMload")
						}
						null == a.readyState && a.addEventListener && (a.addEventListener(c, d = function () {
							a.removeEventListener(c, d, !1), a.readyState = "complete"
						}, !1), a.readyState = "loading"), e()
					}(document, "DOMContentLoaded"), b
			}.apply(b, d), !(void 0 !== e && (a.exports = e))
		}, function (a, b) {
			var c, d;
			! function () {
				var e, f, g = "0.4.2",
					h = "hasOwnProperty",
					i = /[\.\/]/,
					j = "*",
					k = function () {},
					l = function (a, b) {
						return a - b
					},
					m = {
						n: {}
					},
					n = function (a, b) {
						a = String(a);
						var c, d = f,
							g = Array.prototype.slice.call(arguments, 2),
							h = n.listeners(a),
							i = 0,
							j = [],
							k = {},
							m = [],
							o = e;
						e = a, f = 0;
						for (var p = 0, q = h.length; q > p; p++) "zIndex" in h[p] && (j.push(h[p].zIndex), h[p].zIndex < 0 && (k[h[p].zIndex] = h[p]));
						for (j.sort(l); j[i] < 0;)
							if (c = k[j[i++]], m.push(c.apply(b, g)), f) return f = d, m;
						for (p = 0; q > p; p++)
							if (c = h[p], "zIndex" in c)
								if (c.zIndex == j[i]) {
									if (m.push(c.apply(b, g)), f) break;
									do
										if (i++, c = k[j[i]], c && m.push(c.apply(b, g)), f) break; while (c)
								} else k[c.zIndex] = c;
						else if (m.push(c.apply(b, g)), f) break;
						return f = d, e = o, m.length ? m : null
					};
				n._events = m, n.listeners = function (a) {
					var b, c, d, e, f, g, h, k, l = a.split(i),
						n = m,
						o = [n],
						p = [];
					for (e = 0, f = l.length; f > e; e++) {
						for (k = [], g = 0, h = o.length; h > g; g++)
							for (n = o[g].n, c = [n[l[e]], n[j]], d = 2; d--;) b = c[d], b && (k.push(b), p = p.concat(b.f || []));
						o = k
					}
					return p
				}, n.on = function (a, b) {
					if (a = String(a), "function" != typeof b) return function () {};
					for (var c = a.split(i), d = m, e = 0, f = c.length; f > e; e++) d = d.n, d = d.hasOwnProperty(c[e]) && d[c[e]] || (d[c[e]] = {
						n: {}
					});
					for (d.f = d.f || [], e = 0, f = d.f.length; f > e; e++)
						if (d.f[e] == b) return k;
					return d.f.push(b),
						function (a) {
							+a == +a && (b.zIndex = +a)
						}
				}, n.f = function (a) {
					var b = [].slice.call(arguments, 1);
					return function () {
						n.apply(null, [a, null].concat(b).concat([].slice.call(arguments, 0)))
					}
				}, n.stop = function () {
					f = 1
				}, n.nt = function (a) {
					return a ? new RegExp("(?:\\.|\\/|^)" + a + "(?:\\.|\\/|$)").test(e) : e
				}, n.nts = function () {
					return e.split(i)
				}, n.off = n.unbind = function (a, b) {
					if (!a) return void(n._events = m = {
						n: {}
					});
					var c, d, e, f, g, k, l, o = a.split(i),
						p = [m];
					for (f = 0, g = o.length; g > f; f++)
						for (k = 0; k < p.length; k += e.length - 2) {
							if (e = [k, 1], c = p[k].n, o[f] != j) c[o[f]] && e.push(c[o[f]]);
							else
								for (d in c) c[h](d) && e.push(c[d]);
							p.splice.apply(p, e)
						}
					for (f = 0, g = p.length; g > f; f++)
						for (c = p[f]; c.n;) {
							if (b) {
								if (c.f) {
									for (k = 0, l = c.f.length; l > k; k++)
										if (c.f[k] == b) {
											c.f.splice(k, 1);
											break
										}!c.f.length && delete c.f
								}
								for (d in c.n)
									if (c.n[h](d) && c.n[d].f) {
										var q = c.n[d].f;
										for (k = 0, l = q.length; l > k; k++)
											if (q[k] == b) {
												q.splice(k, 1);
												break
											}!q.length && delete c.n[d].f
									}
							} else {
								delete c.f;
								for (d in c.n) c.n[h](d) && c.n[d].f && delete c.n[d].f
							}
							c = c.n
						}
				}, n.once = function (a, b) {
					var c = function () {
						return n.unbind(a, c), b.apply(this, arguments)
					};
					return n.on(a, c)
				}, n.version = g, n.toString = function () {
					return "You are running Eve " + g
				}, "undefined" != typeof a && a.exports ? a.exports = n : (c = [], d = function () {
					return n
				}.apply(b, c), !(void 0 !== d && (a.exports = d)))
			}(this)
		}, function (a, b, c) {
			var d, e;
			d = [c(1)], e = function (a) {
				if (!a || a.svg) {
					var b = "hasOwnProperty",
						c = String,
						d = parseFloat,
						e = parseInt,
						f = Math,
						g = f.max,
						h = f.abs,
						i = f.pow,
						j = /[, ]+/,
						k = a.eve,
						l = "",
						m = " ",
						n = "http://www.w3.org/1999/xlink",
						o = {
							block: "M5,0 0,2.5 5,5z",
							classic: "M5,0 0,2.5 5,5 3.5,3 3.5,2z",
							diamond: "M2.5,0 5,2.5 2.5,5 0,2.5z",
							open: "M6,1 1,3.5 6,6",
							oval: "M2.5,0A2.5,2.5,0,0,1,2.5,5 2.5,2.5,0,0,1,2.5,0z"
						},
						p = {};
					a.toString = function () {
						return "Your browser supports SVG.\nYou are running Raphaël " + this.version
					};
					var q = function (d, e) {
							if (e) {
								"string" == typeof d && (d = q(d));
								for (var f in e) e[b](f) && ("xlink:" == f.substring(0, 6) ? d.setAttributeNS(n, f.substring(6), c(e[f])) : d.setAttribute(f, c(e[f])))
							} else d = a._g.doc.createElementNS("http://www.w3.org/2000/svg", d), d.style && (d.style.webkitTapHighlightColor = "rgba(0,0,0,0)");
							return d
						},
						r = function (b, e) {
							var j = "linear",
								k = b.id + e,
								m = .5,
								n = .5,
								o = b.node,
								p = b.paper,
								r = o.style,
								s = a._g.doc.getElementById(k);
							if (!s) {
								if (e = c(e).replace(a._radial_gradient, function (a, b, c) {
										if (j = "radial", b && c) {
											m = d(b), n = d(c);
											var e = 2 * (n > .5) - 1;
											i(m - .5, 2) + i(n - .5, 2) > .25 && (n = f.sqrt(.25 - i(m - .5, 2)) * e + .5) && .5 != n && (n = n.toFixed(5) - 1e-5 * e)
										}
										return l
									}), e = e.split(/\s*\-\s*/), "linear" == j) {
									var u = e.shift();
									if (u = -d(u), isNaN(u)) return null;
									var v = [0, 0, f.cos(a.rad(u)), f.sin(a.rad(u))],
										w = 1 / (g(h(v[2]), h(v[3])) || 1);
									v[2] *= w, v[3] *= w, v[2] < 0 && (v[0] = -v[2], v[2] = 0), v[3] < 0 && (v[1] = -v[3], v[3] = 0)
								}
								var x = a._parseDots(e);
								if (!x) return null;
								if (k = k.replace(/[\(\)\s,\xb0#]/g, "_"), b.gradient && k != b.gradient.id && (p.defs.removeChild(b.gradient), delete b.gradient), !b.gradient) {
									s = q(j + "Gradient", {
										id: k
									}), b.gradient = s, q(s, "radial" == j ? {
										fx: m,
										fy: n
									} : {
										x1: v[0],
										y1: v[1],
										x2: v[2],
										y2: v[3],
										gradientTransform: b.matrix.invert()
									}), p.defs.appendChild(s);
									for (var y = 0, z = x.length; z > y; y++) s.appendChild(q("stop", {
										offset: x[y].offset ? x[y].offset : y ? "100%" : "0%",
										"stop-color": x[y].color || "#fff",
										"stop-opacity": isFinite(x[y].opacity) ? x[y].opacity : 1
									}))
								}
							}
							return q(o, {
								fill: t(k),
								opacity: 1,
								"fill-opacity": 1
							}), r.fill = l, r.opacity = 1, r.fillOpacity = 1, 1
						},
						s = function () {
							var a = document.documentMode;
							return a && (9 === a || 10 === a)
						},
						t = function (a) {
							if (s()) return "url('#" + a + "')";
							var b = document.location,
								c = b.protocol + "//" + b.host + b.pathname + b.search;
							return "url('" + c + "#" + a + "')"
						},
						u = function (a) {
							var b = a.getBBox(1);
							q(a.pattern, {
								patternTransform: a.matrix.invert() + " translate(" + b.x + "," + b.y + ")"
							})
						},
						v = function (d, e, f) {
							if ("path" == d.type) {
								for (var g, h, i, j, k, m = c(e).toLowerCase().split("-"), n = d.paper, r = f ? "end" : "start", s = d.node, t = d.attrs, u = t["stroke-width"], v = m.length, w = "classic", x = 3, y = 3, z = 5; v--;) switch (m[v]) {
									case "block":
									case "classic":
									case "oval":
									case "diamond":
									case "open":
									case "none":
										w = m[v];
										break;
									case "wide":
										y = 5;
										break;
									case "narrow":
										y = 2;
										break;
									case "long":
										x = 5;
										break;
									case "short":
										x = 2
								}
								if ("open" == w ? (x += 2, y += 2, z += 2, i = 1, j = f ? 4 : 1, k = {
										fill: "none",
										stroke: t.stroke
									}) : (j = i = x / 2, k = {
										fill: t.stroke,
										stroke: "none"
									}), d._.arrows ? f ? (d._.arrows.endPath && p[d._.arrows.endPath]--, d._.arrows.endMarker && p[d._.arrows.endMarker]--) : (d._.arrows.startPath && p[d._.arrows.startPath]--, d._.arrows.startMarker && p[d._.arrows.startMarker]--) : d._.arrows = {}, "none" != w) {
									var A = "raphael-marker-" + w,
										B = "raphael-marker-" + r + w + x + y + "-obj" + d.id;
									a._g.doc.getElementById(A) ? p[A]++ : (n.defs.appendChild(q(q("path"), {
										"stroke-linecap": "round",
										d: o[w],
										id: A
									})), p[A] = 1);
									var C, D = a._g.doc.getElementById(B);
									D ? (p[B]++, C = D.getElementsByTagName("use")[0]) : (D = q(q("marker"), {
										id: B,
										markerHeight: y,
										markerWidth: x,
										orient: "auto",
										refX: j,
										refY: y / 2
									}), C = q(q("use"), {
										"xlink:href": "#" + A,
										transform: (f ? "rotate(180 " + x / 2 + " " + y / 2 + ") " : l) + "scale(" + x / z + "," + y / z + ")",
										"stroke-width": (1 / ((x / z + y / z) / 2)).toFixed(4)
									}), D.appendChild(C), n.defs.appendChild(D), p[B] = 1), q(C, k);
									var E = i * ("diamond" != w && "oval" != w);
									f ? (g = d._.arrows.startdx * u || 0, h = a.getTotalLength(t.path) - E * u) : (g = E * u, h = a.getTotalLength(t.path) - (d._.arrows.enddx * u || 0)), k = {}, k["marker-" + r] = "url(#" + B + ")", (h || g) && (k.d = a.getSubpath(t.path, g, h)), q(s, k), d._.arrows[r + "Path"] = A, d._.arrows[r + "Marker"] = B, d._.arrows[r + "dx"] = E, d._.arrows[r + "Type"] = w, d._.arrows[r + "String"] = e
								} else f ? (g = d._.arrows.startdx * u || 0, h = a.getTotalLength(t.path) - g) : (g = 0, h = a.getTotalLength(t.path) - (d._.arrows.enddx * u || 0)), d._.arrows[r + "Path"] && q(s, {
									d: a.getSubpath(t.path, g, h)
								}), delete d._.arrows[r + "Path"], delete d._.arrows[r + "Marker"], delete d._.arrows[r + "dx"], delete d._.arrows[r + "Type"], delete d._.arrows[r + "String"];
								for (k in p)
									if (p[b](k) && !p[k]) {
										var F = a._g.doc.getElementById(k);
										F && F.parentNode.removeChild(F)
									}
							}
						},
						w = {
							"-": [3, 1],
							".": [1, 1],
							"-.": [3, 1, 1, 1],
							"-..": [3, 1, 1, 1, 1, 1],
							". ": [1, 3],
							"- ": [4, 3],
							"--": [8, 3],
							"- .": [4, 3, 1, 3],
							"--.": [8, 3, 1, 3],
							"--..": [8, 3, 1, 3, 1, 3]
						},
						x = function (a, b, d) {
							if (b = w[c(b).toLowerCase()]) {
								for (var e = a.attrs["stroke-width"] || "1", f = {
										round: e,
										square: e,
										butt: 0
									}[a.attrs["stroke-linecap"] || d["stroke-linecap"]] || 0, g = [], h = b.length; h--;) g[h] = b[h] * e + (h % 2 ? 1 : -1) * f;
								q(a.node, {
									"stroke-dasharray": g.join(",")
								})
							} else q(a.node, {
								"stroke-dasharray": "none"
							})
						},
						y = function (d, f) {
							var i = d.node,
								k = d.attrs,
								m = i.style.visibility;
							i.style.visibility = "hidden";
							for (var o in f)
								if (f[b](o)) {
									if (!a._availableAttrs[b](o)) continue;
									var p = f[o];
									switch (k[o] = p, o) {
										case "blur":
											d.blur(p);
											break;
										case "title":
											var s = i.getElementsByTagName("title");
											if (s.length && (s = s[0])) s.firstChild.nodeValue = p;
											else {
												s = q("title");
												var t = a._g.doc.createTextNode(p);
												s.appendChild(t), i.appendChild(s)
											}
											break;
										case "href":
										case "target":
											var w = i.parentNode;
											if ("a" != w.tagName.toLowerCase()) {
												var y = q("a");
												w.insertBefore(y, i), y.appendChild(i), w = y
											}
											"target" == o ? w.setAttributeNS(n, "show", "blank" == p ? "new" : p) : w.setAttributeNS(n, o, p);
											break;
										case "cursor":
											i.style.cursor = p;
											break;
										case "transform":
											d.transform(p);
											break;
										case "arrow-start":
											v(d, p);
											break;
										case "arrow-end":
											v(d, p, 1);
											break;
										case "clip-rect":
											var z = c(p).split(j);
											if (4 == z.length) {
												d.clip && d.clip.parentNode.parentNode.removeChild(d.clip.parentNode);
												var B = q("clipPath"),
													C = q("rect");
												B.id = a.createUUID(), q(C, {
													x: z[0],
													y: z[1],
													width: z[2],
													height: z[3]
												}), B.appendChild(C), d.paper.defs.appendChild(B), q(i, {
													"clip-path": "url(#" + B.id + ")"
												}), d.clip = C
											}
											if (!p) {
												var D = i.getAttribute("clip-path");
												if (D) {
													var E = a._g.doc.getElementById(D.replace(/(^url\(#|\)$)/g, l));
													E && E.parentNode.removeChild(E), q(i, {
														"clip-path": l
													}), delete d.clip
												}
											}
											break;
										case "path":
											"path" == d.type && (q(i, {
												d: p ? k.path = a._pathToAbsolute(p) : "M0,0"
											}), d._.dirty = 1, d._.arrows && ("startString" in d._.arrows && v(d, d._.arrows.startString), "endString" in d._.arrows && v(d, d._.arrows.endString, 1)));
											break;
										case "width":
											if (i.setAttribute(o, p), d._.dirty = 1, !k.fx) break;
											o = "x", p = k.x;
										case "x":
											k.fx && (p = -k.x - (k.width || 0));
										case "rx":
											if ("rx" == o && "rect" == d.type) break;
										case "cx":
											i.setAttribute(o, p), d.pattern && u(d), d._.dirty = 1;
											break;
										case "height":
											if (i.setAttribute(o, p), d._.dirty = 1, !k.fy) break;
											o = "y", p = k.y;
										case "y":
											k.fy && (p = -k.y - (k.height || 0));
										case "ry":
											if ("ry" == o && "rect" == d.type) break;
										case "cy":
											i.setAttribute(o, p), d.pattern && u(d), d._.dirty = 1;
											break;
										case "r":
											"rect" == d.type ? q(i, {
												rx: p,
												ry: p
											}) : i.setAttribute(o, p), d._.dirty = 1;
											break;
										case "src":
											"image" == d.type && i.setAttributeNS(n, "href", p);
											break;
										case "stroke-width":
											1 == d._.sx && 1 == d._.sy || (p /= g(h(d._.sx), h(d._.sy)) || 1), i.setAttribute(o, p), k["stroke-dasharray"] && x(d, k["stroke-dasharray"], f), d._.arrows && ("startString" in d._.arrows && v(d, d._.arrows.startString), "endString" in d._.arrows && v(d, d._.arrows.endString, 1));
											break;
										case "stroke-dasharray":
											x(d, p, f);
											break;
										case "fill":
											var F = c(p).match(a._ISURL);
											if (F) {
												B = q("pattern");
												var G = q("image");
												B.id = a.createUUID(), q(B, {
														x: 0,
														y: 0,
														patternUnits: "userSpaceOnUse",
														height: 1,
														width: 1
													}), q(G, {
														x: 0,
														y: 0,
														"xlink:href": F[1]
													}), B.appendChild(G),
													function (b) {
														a._preload(F[1], function () {
															var a = this.offsetWidth,
																c = this.offsetHeight;
															q(b, {
																width: a,
																height: c
															}), q(G, {
																width: a,
																height: c
															})
														})
													}(B), d.paper.defs.appendChild(B), q(i, {
														fill: "url(#" + B.id + ")"
													}), d.pattern = B, d.pattern && u(d);
												break
											}
											var H = a.getRGB(p);
											if (H.error) {
												if (("circle" == d.type || "ellipse" == d.type || "r" != c(p).charAt()) && r(d, p)) {
													if ("opacity" in k || "fill-opacity" in k) {
														var I = a._g.doc.getElementById(i.getAttribute("fill").replace(/^url\(#|\)$/g, l));
														if (I) {
															var J = I.getElementsByTagName("stop");
															q(J[J.length - 1], {
																"stop-opacity": ("opacity" in k ? k.opacity : 1) * ("fill-opacity" in k ? k["fill-opacity"] : 1)
															})
														}
													}
													k.gradient = p, k.fill = "none";
													break
												}
											} else delete f.gradient, delete k.gradient, !a.is(k.opacity, "undefined") && a.is(f.opacity, "undefined") && q(i, {
												opacity: k.opacity
											}), !a.is(k["fill-opacity"], "undefined") && a.is(f["fill-opacity"], "undefined") && q(i, {
												"fill-opacity": k["fill-opacity"]
											});
											H[b]("opacity") && q(i, {
												"fill-opacity": H.opacity > 1 ? H.opacity / 100 : H.opacity
											});
										case "stroke":
											H = a.getRGB(p), i.setAttribute(o, H.hex), "stroke" == o && H[b]("opacity") && q(i, {
												"stroke-opacity": H.opacity > 1 ? H.opacity / 100 : H.opacity
											}), "stroke" == o && d._.arrows && ("startString" in d._.arrows && v(d, d._.arrows.startString), "endString" in d._.arrows && v(d, d._.arrows.endString, 1));
											break;
										case "gradient":
											("circle" == d.type || "ellipse" == d.type || "r" != c(p).charAt()) && r(d, p);
											break;
										case "opacity":
											k.gradient && !k[b]("stroke-opacity") && q(i, {
												"stroke-opacity": p > 1 ? p / 100 : p
											});
										case "fill-opacity":
											if (k.gradient) {
												I = a._g.doc.getElementById(i.getAttribute("fill").replace(/^url\(#|\)$/g, l)), I && (J = I.getElementsByTagName("stop"), q(J[J.length - 1], {
													"stop-opacity": p
												}));
												break
											}
										default:
											"font-size" == o && (p = e(p, 10) + "px");
											var K = o.replace(/(\-.)/g, function (a) {
												return a.substring(1).toUpperCase()
											});
											i.style[K] = p, d._.dirty = 1, i.setAttribute(o, p)
									}
								}
							A(d, f), i.style.visibility = m
						},
						z = 1.2,
						A = function (d, f) {
							if ("text" == d.type && (f[b]("text") || f[b]("font") || f[b]("font-size") || f[b]("x") || f[b]("y"))) {
								var g = d.attrs,
									h = d.node,
									i = h.firstChild ? e(a._g.doc.defaultView.getComputedStyle(h.firstChild, l).getPropertyValue("font-size"), 10) : 10;
								if (f[b]("text")) {
									for (g.text = f.text; h.firstChild;) h.removeChild(h.firstChild);
									for (var j, k = c(f.text).split("\n"), m = [], n = 0, o = k.length; o > n; n++) j = q("tspan"), n && q(j, {
										dy: i * z,
										x: g.x
									}), j.appendChild(a._g.doc.createTextNode(k[n])), h.appendChild(j), m[n] = j
								} else
									for (m = h.getElementsByTagName("tspan"), n = 0, o = m.length; o > n; n++) n ? q(m[n], {
										dy: i * z,
										x: g.x
									}) : q(m[0], {
										dy: 0
									});
								q(h, {
									x: g.x,
									y: g.y
								}), d._.dirty = 1;
								var p = d._getBBox(),
									r = g.y - (p.y + p.height / 2);
								r && a.is(r, "finite") && q(m[0], {
									dy: r
								})
							}
						},
						B = function (a) {
							return a.parentNode && "a" === a.parentNode.tagName.toLowerCase() ? a.parentNode : a
						},
						C = function (b, c) {
							this[0] = this.node = b, b.raphael = !0, this.id = a._oid++, b.raphaelid = this.id, this.matrix = a.matrix(), this.realPath = null, this.paper = c, this.attrs = this.attrs || {}, this._ = {
								transform: [],
								sx: 1,
								sy: 1,
								deg: 0,
								dx: 0,
								dy: 0,
								dirty: 1
							}, !c.bottom && (c.bottom = this), this.prev = c.top, c.top && (c.top.next = this), c.top = this, this.next = null
						},
						D = a.el;
					C.prototype = D, D.constructor = C, a._engine.path = function (a, b) {
						var c = q("path");
						b.canvas && b.canvas.appendChild(c);
						var d = new C(c, b);
						return d.type = "path", y(d, {
							fill: "none",
							stroke: "#000",
							path: a
						}), d
					}, D.rotate = function (a, b, e) {
						if (this.removed) return this;
						if (a = c(a).split(j), a.length - 1 && (b = d(a[1]), e = d(a[2])), a = d(a[0]), null == e && (b = e), null == b || null == e) {
							var f = this.getBBox(1);
							b = f.x + f.width / 2, e = f.y + f.height / 2
						}
						return this.transform(this._.transform.concat([
							["r", a, b, e]
						])), this
					}, D.scale = function (a, b, e, f) {
						if (this.removed) return this;
						if (a = c(a).split(j), a.length - 1 && (b = d(a[1]), e = d(a[2]), f = d(a[3])), a = d(a[0]), null == b && (b = a), null == f && (e = f), null == e || null == f) var g = this.getBBox(1);
						return e = null == e ? g.x + g.width / 2 : e, f = null == f ? g.y + g.height / 2 : f, this.transform(this._.transform.concat([
							["s", a, b, e, f]
						])), this
					}, D.translate = function (a, b) {
						return this.removed ? this : (a = c(a).split(j), a.length - 1 && (b = d(a[1])), a = d(a[0]) || 0, b = +b || 0, this.transform(this._.transform.concat([
							["t", a, b]
						])), this)
					}, D.transform = function (c) {
						var d = this._;
						if (null == c) return d.transform;
						if (a._extractTransform(this, c), this.clip && q(this.clip, {
								transform: this.matrix.invert()
							}), this.pattern && u(this), this.node && q(this.node, {
								transform: this.matrix
							}), 1 != d.sx || 1 != d.sy) {
							var e = this.attrs[b]("stroke-width") ? this.attrs["stroke-width"] : 1;
							this.attr({
								"stroke-width": e
							})
						}
						return d.transform = this.matrix.toTransformString(), this
					}, D.hide = function () {
						return this.removed || (this.node.style.display = "none"), this
					}, D.show = function () {
						return this.removed || (this.node.style.display = ""), this
					}, D.remove = function () {
						var b = B(this.node);
						if (!this.removed && b.parentNode) {
							var c = this.paper;
							c.__set__ && c.__set__.exclude(this), k.unbind("raphael.*.*." + this.id), this.gradient && c.defs.removeChild(this.gradient), a._tear(this, c), b.parentNode.removeChild(b), this.removeData();
							for (var d in this) this[d] = "function" == typeof this[d] ? a._removedFactory(d) : null;
							this.removed = !0
						}
					}, D._getBBox = function () {
						if ("none" == this.node.style.display) {
							this.show();
							var a = !0
						}
						var b, c = !1;
						this.paper.canvas.parentElement ? b = this.paper.canvas.parentElement.style : this.paper.canvas.parentNode && (b = this.paper.canvas.parentNode.style), b && "none" == b.display && (c = !0, b.display = "");
						var d = {};
						try {
							d = this.node.getBBox()
						} catch (e) {
							d = {
								x: this.node.clientLeft,
								y: this.node.clientTop,
								width: this.node.clientWidth,
								height: this.node.clientHeight
							}
						} finally {
							d = d || {}, c && (b.display = "none")
						}
						return a && this.hide(), d
					}, D.attr = function (c, d) {
						if (this.removed) return this;
						if (null == c) {
							var e = {};
							for (var f in this.attrs) this.attrs[b](f) && (e[f] = this.attrs[f]);
							return e.gradient && "none" == e.fill && (e.fill = e.gradient) && delete e.gradient, e.transform = this._.transform, e
						}
						if (null == d && a.is(c, "string")) {
							if ("fill" == c && "none" == this.attrs.fill && this.attrs.gradient) return this.attrs.gradient;
							if ("transform" == c) return this._.transform;
							for (var g = c.split(j), h = {}, i = 0, l = g.length; l > i; i++) c = g[i], h[c] = c in this.attrs ? this.attrs[c] : a.is(this.paper.customAttributes[c], "function") ? this.paper.customAttributes[c].def : a._availableAttrs[c];
							return l - 1 ? h : h[g[0]]
						}
						if (null == d && a.is(c, "array")) {
							for (h = {}, i = 0, l = c.length; l > i; i++) h[c[i]] = this.attr(c[i]);
							return h
						}
						if (null != d) {
							var m = {};
							m[c] = d
						} else null != c && a.is(c, "object") && (m = c);
						for (var n in m) k("raphael.attr." + n + "." + this.id, this, m[n]);
						for (n in this.paper.customAttributes)
							if (this.paper.customAttributes[b](n) && m[b](n) && a.is(this.paper.customAttributes[n], "function")) {
								var o = this.paper.customAttributes[n].apply(this, [].concat(m[n]));
								this.attrs[n] = m[n];
								for (var p in o) o[b](p) && (m[p] = o[p])
							}
						return y(this, m), this
					}, D.toFront = function () {
						if (this.removed) return this;
						var b = B(this.node);
						b.parentNode.appendChild(b);
						var c = this.paper;
						return c.top != this && a._tofront(this, c), this
					}, D.toBack = function () {
						if (this.removed) return this;
						var b = B(this.node),
							c = b.parentNode;
						c.insertBefore(b, c.firstChild), a._toback(this, this.paper);
						this.paper;
						return this
					}, D.insertAfter = function (b) {
						if (this.removed || !b) return this;
						var c = B(this.node),
							d = B(b.node || b[b.length - 1].node);
						return d.nextSibling ? d.parentNode.insertBefore(c, d.nextSibling) : d.parentNode.appendChild(c), a._insertafter(this, b, this.paper), this
					}, D.insertBefore = function (b) {
						if (this.removed || !b) return this;
						var c = B(this.node),
							d = B(b.node || b[0].node);
						return d.parentNode.insertBefore(c, d), a._insertbefore(this, b, this.paper), this
					}, D.blur = function (b) {
						var c = this;
						if (0 !== +b) {
							var d = q("filter"),
								e = q("feGaussianBlur");
							c.attrs.blur = b, d.id = a.createUUID(), q(e, {
								stdDeviation: +b || 1.5
							}), d.appendChild(e), c.paper.defs.appendChild(d), c._blur = d, q(c.node, {
								filter: "url(#" + d.id + ")"
							})
						} else c._blur && (c._blur.parentNode.removeChild(c._blur), delete c._blur, delete c.attrs.blur), c.node.removeAttribute("filter");
						return c
					}, a._engine.circle = function (a, b, c, d) {
						var e = q("circle");
						a.canvas && a.canvas.appendChild(e);
						var f = new C(e, a);
						return f.attrs = {
							cx: b,
							cy: c,
							r: d,
							fill: "none",
							stroke: "#000"
						}, f.type = "circle", q(e, f.attrs), f
					}, a._engine.rect = function (a, b, c, d, e, f) {
						var g = q("rect");
						a.canvas && a.canvas.appendChild(g);
						var h = new C(g, a);
						return h.attrs = {
							x: b,
							y: c,
							width: d,
							height: e,
							rx: f || 0,
							ry: f || 0,
							fill: "none",
							stroke: "#000"
						}, h.type = "rect", q(g, h.attrs), h
					}, a._engine.ellipse = function (a, b, c, d, e) {
						var f = q("ellipse");
						a.canvas && a.canvas.appendChild(f);
						var g = new C(f, a);
						return g.attrs = {
							cx: b,
							cy: c,
							rx: d,
							ry: e,
							fill: "none",
							stroke: "#000"
						}, g.type = "ellipse", q(f, g.attrs), g
					}, a._engine.image = function (a, b, c, d, e, f) {
						var g = q("image");
						q(g, {
							x: c,
							y: d,
							width: e,
							height: f,
							preserveAspectRatio: "none"
						}), g.setAttributeNS(n, "href", b), a.canvas && a.canvas.appendChild(g);
						var h = new C(g, a);
						return h.attrs = {
							x: c,
							y: d,
							width: e,
							height: f,
							src: b
						}, h.type = "image", h
					}, a._engine.text = function (b, c, d, e) {
						var f = q("text");
						b.canvas && b.canvas.appendChild(f);
						var g = new C(f, b);
						return g.attrs = {
							x: c,
							y: d,
							"text-anchor": "middle",
							text: e,
							"font-family": a._availableAttrs["font-family"],
							"font-size": a._availableAttrs["font-size"],
							stroke: "none",
							fill: "#000"
						}, g.type = "text", y(g, g.attrs), g
					}, a._engine.setSize = function (a, b) {
						return this.width = a || this.width, this.height = b || this.height, this.canvas.setAttribute("width", this.width), this.canvas.setAttribute("height", this.height), this._viewBox && this.setViewBox.apply(this, this._viewBox), this
					}, a._engine.create = function () {
						var b = a._getContainer.apply(0, arguments),
							c = b && b.container,
							d = b.x,
							e = b.y,
							f = b.width,
							g = b.height;
						if (!c) throw new Error("SVG container not found.");
						var h, i = q("svg"),
							j = "overflow:hidden;";
						return d = d || 0, e = e || 0, f = f || 512, g = g || 342, q(i, {
							height: g,
							version: 1.1,
							width: f,
							xmlns: "http://www.w3.org/2000/svg",
							"xmlns:xlink": "http://www.w3.org/1999/xlink"
						}), 1 == c ? (i.style.cssText = j + "position:absolute;left:" + d + "px;top:" + e + "px", a._g.doc.body.appendChild(i), h = 1) : (i.style.cssText = j + "position:relative", c.firstChild ? c.insertBefore(i, c.firstChild) : c.appendChild(i)), c = new a._Paper, c.width = f, c.height = g, c.canvas = i, c.clear(), c._left = c._top = 0, h && (c.renderfix = function () {}), c.renderfix(), c
					}, a._engine.setViewBox = function (a, b, c, d, e) {
						k("raphael.setViewBox", this, this._viewBox, [a, b, c, d, e]);
						var f, h, i = this.getSize(),
							j = g(c / i.width, d / i.height),
							l = this.top,
							n = e ? "xMidYMid meet" : "xMinYMin";
						for (null == a ? (this._vbSize && (j = 1), delete this._vbSize, f = "0 0 " + this.width + m + this.height) : (this._vbSize = j, f = a + m + b + m + c + m + d), q(this.canvas, {
								viewBox: f,
								preserveAspectRatio: n
							}); j && l;) h = "stroke-width" in l.attrs ? l.attrs["stroke-width"] : 1, l.attr({
							"stroke-width": h
						}), l._.dirty = 1, l._.dirtyT = 1, l = l.prev;
						return this._viewBox = [a, b, c, d, !!e], this
					}, a.prototype.renderfix = function () {
						var a, b = this.canvas,
							c = b.style;
						try {
							a = b.getScreenCTM() || b.createSVGMatrix()
						} catch (d) {
							a = b.createSVGMatrix()
						}
						var e = -a.e % 1,
							f = -a.f % 1;
						(e || f) && (e && (this._left = (this._left + e) % 1, c.left = this._left + "px"), f && (this._top = (this._top + f) % 1, c.top = this._top + "px"))
					}, a.prototype.clear = function () {
						a.eve("raphael.clear", this);
						for (var b = this.canvas; b.firstChild;) b.removeChild(b.firstChild);
						this.bottom = this.top = null, (this.desc = q("desc")).appendChild(a._g.doc.createTextNode("Created with Raphaël " + a.version)), b.appendChild(this.desc), b.appendChild(this.defs = q("defs"))
					}, a.prototype.remove = function () {
						k("raphael.remove", this), this.canvas.parentNode && this.canvas.parentNode.removeChild(this.canvas);
						for (var b in this) this[b] = "function" == typeof this[b] ? a._removedFactory(b) : null
					};
					var E = a.st;
					for (var F in D) D[b](F) && !E[b](F) && (E[F] = function (a) {
						return function () {
							var b = arguments;
							return this.forEach(function (c) {
								c[a].apply(c, b)
							})
						}
					}(F))
				}
			}.apply(b, d), !(void 0 !== e && (a.exports = e))
		}, function (a, b, c) {
			var d, e;
			d = [c(1)], e = function (a) {
				if (!a || a.vml) {
					var b = "hasOwnProperty",
						c = String,
						d = parseFloat,
						e = Math,
						f = e.round,
						g = e.max,
						h = e.min,
						i = e.abs,
						j = "fill",
						k = /[, ]+/,
						l = a.eve,
						m = " progid:DXImageTransform.Microsoft",
						n = " ",
						o = "",
						p = {
							M: "m",
							L: "l",
							C: "c",
							Z: "x",
							m: "t",
							l: "r",
							c: "v",
							z: "x"
						},
						q = /([clmz]),?([^clmz]*)/gi,
						r = / progid:\S+Blur\([^\)]+\)/g,
						s = /-?[^,\s-]+/g,
						t = "position:absolute;left:0;top:0;width:1px;height:1px;behavior:url(#default#VML)",
						u = 21600,
						v = {
							path: 1,
							rect: 1,
							image: 1
						},
						w = {
							circle: 1,
							ellipse: 1
						},
						x = function (b) {
							var d = /[ahqstv]/gi,
								e = a._pathToAbsolute;
							if (c(b).match(d) && (e = a._path2curve), d = /[clmz]/g, e == a._pathToAbsolute && !c(b).match(d)) {
								var g = c(b).replace(q, function (a, b, c) {
									var d = [],
										e = "m" == b.toLowerCase(),
										g = p[b];
									return c.replace(s, function (a) {
										e && 2 == d.length && (g += d + p["m" == b ? "l" : "L"], d = []), d.push(f(a * u))
									}), g + d
								});
								return g
							}
							var h, i, j = e(b);
							g = [];
							for (var k = 0, l = j.length; l > k; k++) {
								h = j[k], i = j[k][0].toLowerCase(), "z" == i && (i = "x");
								for (var m = 1, r = h.length; r > m; m++) i += f(h[m] * u) + (m != r - 1 ? "," : o);
								g.push(i)
							}
							return g.join(n)
						},
						y = function (b, c, d) {
							var e = a.matrix();
							return e.rotate(-b, .5, .5), {
								dx: e.x(c, d),
								dy: e.y(c, d)
							}
						},
						z = function (a, b, c, d, e, f) {
							var g = a._,
								h = a.matrix,
								k = g.fillpos,
								l = a.node,
								m = l.style,
								o = 1,
								p = "",
								q = u / b,
								r = u / c;
							if (m.visibility = "hidden", b && c) {
								if (l.coordsize = i(q) + n + i(r), m.rotation = f * (0 > b * c ? -1 : 1), f) {
									var s = y(f, d, e);
									d = s.dx, e = s.dy
								}
								if (0 > b && (p += "x"), 0 > c && (p += " y") && (o = -1), m.flip = p, l.coordorigin = d * -q + n + e * -r, k || g.fillsize) {
									var t = l.getElementsByTagName(j);
									t = t && t[0], l.removeChild(t), k && (s = y(f, h.x(k[0], k[1]), h.y(k[0], k[1])), t.position = s.dx * o + n + s.dy * o), g.fillsize && (t.size = g.fillsize[0] * i(b) + n + g.fillsize[1] * i(c)), l.appendChild(t)
								}
								m.visibility = "visible"
							}
						};
					a.toString = function () {
						return "Your browser doesn’t support SVG. Falling down to VML.\nYou are running Raphaël " + this.version
					};
					var A = function (a, b, d) {
							for (var e = c(b).toLowerCase().split("-"), f = d ? "end" : "start", g = e.length, h = "classic", i = "medium", j = "medium"; g--;) switch (e[g]) {
								case "block":
								case "classic":
								case "oval":
								case "diamond":
								case "open":
								case "none":
									h = e[g];
									break;
								case "wide":
								case "narrow":
									j = e[g];
									break;
								case "long":
								case "short":
									i = e[g]
							}
							var k = a.node.getElementsByTagName("stroke")[0];
							k[f + "arrow"] = h, k[f + "arrowlength"] = i, k[f + "arrowwidth"] = j
						},
						B = function (e, i) {
							e.attrs = e.attrs || {};
							var l = e.node,
								m = e.attrs,
								p = l.style,
								q = v[e.type] && (i.x != m.x || i.y != m.y || i.width != m.width || i.height != m.height || i.cx != m.cx || i.cy != m.cy || i.rx != m.rx || i.ry != m.ry || i.r != m.r),
								r = w[e.type] && (m.cx != i.cx || m.cy != i.cy || m.r != i.r || m.rx != i.rx || m.ry != i.ry),
								s = e;
							for (var t in i) i[b](t) && (m[t] = i[t]);
							if (q && (m.path = a._getPath[e.type](e), e._.dirty = 1), i.href && (l.href = i.href), i.title && (l.title = i.title), i.target && (l.target = i.target), i.cursor && (p.cursor = i.cursor), "blur" in i && e.blur(i.blur), (i.path && "path" == e.type || q) && (l.path = x(~c(m.path).toLowerCase().indexOf("r") ? a._pathToAbsolute(m.path) : m.path), e._.dirty = 1, "image" == e.type && (e._.fillpos = [m.x, m.y], e._.fillsize = [m.width, m.height], z(e, 1, 1, 0, 0, 0))), "transform" in i && e.transform(i.transform), r) {
								var y = +m.cx,
									B = +m.cy,
									D = +m.rx || +m.r || 0,
									E = +m.ry || +m.r || 0;
								l.path = a.format("ar{0},{1},{2},{3},{4},{1},{4},{1}x", f((y - D) * u), f((B - E) * u), f((y + D) * u), f((B + E) * u), f(y * u)), e._.dirty = 1
							}
							if ("clip-rect" in i) {
								var G = c(i["clip-rect"]).split(k);
								if (4 == G.length) {
									G[2] = +G[2] + +G[0], G[3] = +G[3] + +G[1];
									var H = l.clipRect || a._g.doc.createElement("div"),
										I = H.style;
									I.clip = a.format("rect({1}px {2}px {3}px {0}px)", G), l.clipRect || (I.position = "absolute", I.top = 0, I.left = 0, I.width = e.paper.width + "px", I.height = e.paper.height + "px", l.parentNode.insertBefore(H, l), H.appendChild(l), l.clipRect = H)
								}
								i["clip-rect"] || l.clipRect && (l.clipRect.style.clip = "auto")
							}
							if (e.textpath) {
								var J = e.textpath.style;
								i.font && (J.font = i.font), i["font-family"] && (J.fontFamily = '"' + i["font-family"].split(",")[0].replace(/^['"]+|['"]+$/g, o) + '"'), i["font-size"] && (J.fontSize = i["font-size"]), i["font-weight"] && (J.fontWeight = i["font-weight"]), i["font-style"] && (J.fontStyle = i["font-style"])
							}
							if ("arrow-start" in i && A(s, i["arrow-start"]), "arrow-end" in i && A(s, i["arrow-end"], 1), null != i.opacity || null != i["stroke-width"] || null != i.fill || null != i.src || null != i.stroke || null != i["stroke-width"] || null != i["stroke-opacity"] || null != i["fill-opacity"] || null != i["stroke-dasharray"] || null != i["stroke-miterlimit"] || null != i["stroke-linejoin"] || null != i["stroke-linecap"]) {
								var K = l.getElementsByTagName(j),
									L = !1;
								if (K = K && K[0], !K && (L = K = F(j)), "image" == e.type && i.src && (K.src = i.src), i.fill && (K.on = !0), null != K.on && "none" != i.fill && null !== i.fill || (K.on = !1), K.on && i.fill) {
									var M = c(i.fill).match(a._ISURL);
									if (M) {
										K.parentNode == l && l.removeChild(K), K.rotate = !0, K.src = M[1], K.type = "tile";
										var N = e.getBBox(1);
										K.position = N.x + n + N.y, e._.fillpos = [N.x, N.y], a._preload(M[1], function () {
											e._.fillsize = [this.offsetWidth, this.offsetHeight]
										})
									} else K.color = a.getRGB(i.fill).hex, K.src = o, K.type = "solid", a.getRGB(i.fill).error && (s.type in {
										circle: 1,
										ellipse: 1
									} || "r" != c(i.fill).charAt()) && C(s, i.fill, K) && (m.fill = "none", m.gradient = i.fill, K.rotate = !1)
								}
								if ("fill-opacity" in i || "opacity" in i) {
									var O = ((+m["fill-opacity"] + 1 || 2) - 1) * ((+m.opacity + 1 || 2) - 1) * ((+a.getRGB(i.fill).o + 1 || 2) - 1);
									O = h(g(O, 0), 1), K.opacity = O, K.src && (K.color = "none")
								}
								l.appendChild(K);
								var P = l.getElementsByTagName("stroke") && l.getElementsByTagName("stroke")[0],
									Q = !1;
								!P && (Q = P = F("stroke")), (i.stroke && "none" != i.stroke || i["stroke-width"] || null != i["stroke-opacity"] || i["stroke-dasharray"] || i["stroke-miterlimit"] || i["stroke-linejoin"] || i["stroke-linecap"]) && (P.on = !0), ("none" == i.stroke || null === i.stroke || null == P.on || 0 == i.stroke || 0 == i["stroke-width"]) && (P.on = !1);
								var R = a.getRGB(i.stroke);
								P.on && i.stroke && (P.color = R.hex), O = ((+m["stroke-opacity"] + 1 || 2) - 1) * ((+m.opacity + 1 || 2) - 1) * ((+R.o + 1 || 2) - 1);
								var S = .75 * (d(i["stroke-width"]) || 1);
								if (O = h(g(O, 0), 1), null == i["stroke-width"] && (S = m["stroke-width"]), i["stroke-width"] && (P.weight = S), S && 1 > S && (O *= S) && (P.weight = 1), P.opacity = O, i["stroke-linejoin"] && (P.joinstyle = i["stroke-linejoin"] || "miter"), P.miterlimit = i["stroke-miterlimit"] || 8, i["stroke-linecap"] && (P.endcap = "butt" == i["stroke-linecap"] ? "flat" : "square" == i["stroke-linecap"] ? "square" : "round"), "stroke-dasharray" in i) {
									var T = {
										"-": "shortdash",
										".": "shortdot",
										"-.": "shortdashdot",
										"-..": "shortdashdotdot",
										". ": "dot",
										"- ": "dash",
										"--": "longdash",
										"- .": "dashdot",
										"--.": "longdashdot",
										"--..": "longdashdotdot"
									};
									P.dashstyle = T[b](i["stroke-dasharray"]) ? T[i["stroke-dasharray"]] : o
								}
								Q && l.appendChild(P)
							}
							if ("text" == s.type) {
								s.paper.canvas.style.display = o;
								var U = s.paper.span,
									V = 100,
									W = m.font && m.font.match(/\d+(?:\.\d*)?(?=px)/);
								p = U.style, m.font && (p.font = m.font), m["font-family"] && (p.fontFamily = m["font-family"]), m["font-weight"] && (p.fontWeight = m["font-weight"]), m["font-style"] && (p.fontStyle = m["font-style"]), W = d(m["font-size"] || W && W[0]) || 10, p.fontSize = W * V + "px", s.textpath.string && (U.innerHTML = c(s.textpath.string).replace(/</g, "&#60;").replace(/&/g, "&#38;").replace(/\n/g, "<br>"));
								var X = U.getBoundingClientRect();
								s.W = m.w = (X.right - X.left) / V, s.H = m.h = (X.bottom - X.top) / V, s.X = m.x, s.Y = m.y + s.H / 2, ("x" in i || "y" in i) && (s.path.v = a.format("m{0},{1}l{2},{1}", f(m.x * u), f(m.y * u), f(m.x * u) + 1));
								for (var Y = ["x", "y", "text", "font", "font-family", "font-weight", "font-style", "font-size"], Z = 0, $ = Y.length; $ > Z; Z++)
									if (Y[Z] in i) {
										s._.dirty = 1;
										break
									}
								switch (m["text-anchor"]) {
									case "start":
										s.textpath.style["v-text-align"] = "left", s.bbx = s.W / 2;
										break;
									case "end":
										s.textpath.style["v-text-align"] = "right", s.bbx = -s.W / 2;
										break;
									default:
										s.textpath.style["v-text-align"] = "center", s.bbx = 0
								}
								s.textpath.style["v-text-kern"] = !0
							}
						},
						C = function (b, f, g) {
							b.attrs = b.attrs || {};
							var h = (b.attrs, Math.pow),
								i = "linear",
								j = ".5 .5";
							if (b.attrs.gradient = f, f = c(f).replace(a._radial_gradient, function (a, b, c) {
									return i = "radial", b && c && (b = d(b), c = d(c), h(b - .5, 2) + h(c - .5, 2) > .25 && (c = e.sqrt(.25 - h(b - .5, 2)) * (2 * (c > .5) - 1) + .5), j = b + n + c), o
								}), f = f.split(/\s*\-\s*/), "linear" == i) {
								var k = f.shift();
								if (k = -d(k), isNaN(k)) return null
							}
							var l = a._parseDots(f);
							if (!l) return null;
							if (b = b.shape || b.node, l.length) {
								b.removeChild(g), g.on = !0, g.method = "none", g.color = l[0].color, g.color2 = l[l.length - 1].color;
								for (var m = [], p = 0, q = l.length; q > p; p++) l[p].offset && m.push(l[p].offset + n + l[p].color);
								g.colors = m.length ? m.join() : "0% " + g.color, "radial" == i ? (g.type = "gradientTitle", g.focus = "100%", g.focussize = "0 0", g.focusposition = j, g.angle = 0) : (g.type = "gradient", g.angle = (270 - k) % 360), b.appendChild(g)
							}
							return 1
						},
						D = function (b, c) {
							this[0] = this.node = b, b.raphael = !0, this.id = a._oid++, b.raphaelid = this.id, this.X = 0, this.Y = 0, this.attrs = {}, this.paper = c, this.matrix = a.matrix(), this._ = {
								transform: [],
								sx: 1,
								sy: 1,
								dx: 0,
								dy: 0,
								deg: 0,
								dirty: 1,
								dirtyT: 1
							}, !c.bottom && (c.bottom = this), this.prev = c.top, c.top && (c.top.next = this), c.top = this, this.next = null
						},
						E = a.el;
					D.prototype = E, E.constructor = D, E.transform = function (b) {
						if (null == b) return this._.transform;
						var d, e = this.paper._viewBoxShift,
							f = e ? "s" + [e.scale, e.scale] + "-1-1t" + [e.dx, e.dy] : o;
						e && (d = b = c(b).replace(/\.{3}|\u2026/g, this._.transform || o)), a._extractTransform(this, f + b);
						var g, h = this.matrix.clone(),
							i = this.skew,
							j = this.node,
							k = ~c(this.attrs.fill).indexOf("-"),
							l = !c(this.attrs.fill).indexOf("url(");
						if (h.translate(1, 1), l || k || "image" == this.type)
							if (i.matrix = "1 0 0 1", i.offset = "0 0", g = h.split(), k && g.noRotation || !g.isSimple) {
								j.style.filter = h.toFilter();
								var m = this.getBBox(),
									p = this.getBBox(1),
									q = m.x - p.x,
									r = m.y - p.y;
								j.coordorigin = q * -u + n + r * -u, z(this, 1, 1, q, r, 0)
							} else j.style.filter = o, z(this, g.scalex, g.scaley, g.dx, g.dy, g.rotate);
						else j.style.filter = o, i.matrix = c(h), i.offset = h.offset();
						return null !== d && (this._.transform = d, a._extractTransform(this, d)), this
					}, E.rotate = function (a, b, e) {
						if (this.removed) return this;
						if (null != a) {
							if (a = c(a).split(k), a.length - 1 && (b = d(a[1]), e = d(a[2])), a = d(a[0]), null == e && (b = e), null == b || null == e) {
								var f = this.getBBox(1);
								b = f.x + f.width / 2, e = f.y + f.height / 2
							}
							return this._.dirtyT = 1, this.transform(this._.transform.concat([
								["r", a, b, e]
							])), this
						}
					}, E.translate = function (a, b) {
						return this.removed ? this : (a = c(a).split(k), a.length - 1 && (b = d(a[1])), a = d(a[0]) || 0, b = +b || 0, this._.bbox && (this._.bbox.x += a, this._.bbox.y += b), this.transform(this._.transform.concat([
							["t", a, b]
						])), this)
					}, E.scale = function (a, b, e, f) {
						if (this.removed) return this;
						if (a = c(a).split(k), a.length - 1 && (b = d(a[1]), e = d(a[2]), f = d(a[3]), isNaN(e) && (e = null), isNaN(f) && (f = null)), a = d(a[0]), null == b && (b = a), null == f && (e = f), null == e || null == f) var g = this.getBBox(1);
						return e = null == e ? g.x + g.width / 2 : e, f = null == f ? g.y + g.height / 2 : f, this.transform(this._.transform.concat([
							["s", a, b, e, f]
						])), this._.dirtyT = 1, this
					}, E.hide = function () {
						return !this.removed && (this.node.style.display = "none"), this
					}, E.show = function () {
						return !this.removed && (this.node.style.display = o), this
					}, E.auxGetBBox = a.el.getBBox, E.getBBox = function () {
						var a = this.auxGetBBox();
						if (this.paper && this.paper._viewBoxShift) {
							var b = {},
								c = 1 / this.paper._viewBoxShift.scale;
							return b.x = a.x - this.paper._viewBoxShift.dx, b.x *= c, b.y = a.y - this.paper._viewBoxShift.dy, b.y *= c, b.width = a.width * c, b.height = a.height * c, b.x2 = b.x + b.width, b.y2 = b.y + b.height, b
						}
						return a
					}, E._getBBox = function () {
						return this.removed ? {} : {
							x: this.X + (this.bbx || 0) - this.W / 2,
							y: this.Y - this.H,
							width: this.W,
							height: this.H
						}
					}, E.remove = function () {
						if (!this.removed && this.node.parentNode) {
							this.paper.__set__ && this.paper.__set__.exclude(this), a.eve.unbind("raphael.*.*." + this.id), a._tear(this, this.paper), this.node.parentNode.removeChild(this.node), this.shape && this.shape.parentNode.removeChild(this.shape);
							for (var b in this) this[b] = "function" == typeof this[b] ? a._removedFactory(b) : null;
							this.removed = !0
						}
					}, E.attr = function (c, d) {
						if (this.removed) return this;
						if (null == c) {
							var e = {};
							for (var f in this.attrs) this.attrs[b](f) && (e[f] = this.attrs[f]);
							return e.gradient && "none" == e.fill && (e.fill = e.gradient) && delete e.gradient, e.transform = this._.transform, e
						}
						if (null == d && a.is(c, "string")) {
							if (c == j && "none" == this.attrs.fill && this.attrs.gradient) return this.attrs.gradient;
							for (var g = c.split(k), h = {}, i = 0, m = g.length; m > i; i++) c = g[i], h[c] = c in this.attrs ? this.attrs[c] : a.is(this.paper.customAttributes[c], "function") ? this.paper.customAttributes[c].def : a._availableAttrs[c];
							return m - 1 ? h : h[g[0]]
						}
						if (this.attrs && null == d && a.is(c, "array")) {
							for (h = {}, i = 0, m = c.length; m > i; i++) h[c[i]] = this.attr(c[i]);
							return h
						}
						var n;
						null != d && (n = {}, n[c] = d), null == d && a.is(c, "object") && (n = c);
						for (var o in n) l("raphael.attr." + o + "." + this.id, this, n[o]);
						if (n) {
							for (o in this.paper.customAttributes)
								if (this.paper.customAttributes[b](o) && n[b](o) && a.is(this.paper.customAttributes[o], "function")) {
									var p = this.paper.customAttributes[o].apply(this, [].concat(n[o]));
									this.attrs[o] = n[o];
									for (var q in p) p[b](q) && (n[q] = p[q])
								}
							n.text && "text" == this.type && (this.textpath.string = n.text), B(this, n)
						}
						return this
					}, E.toFront = function () {
						return !this.removed && this.node.parentNode.appendChild(this.node), this.paper && this.paper.top != this && a._tofront(this, this.paper), this
					}, E.toBack = function () {
						return this.removed ? this : (this.node.parentNode.firstChild != this.node && (this.node.parentNode.insertBefore(this.node, this.node.parentNode.firstChild), a._toback(this, this.paper)), this)
					}, E.insertAfter = function (b) {
						return this.removed ? this : (b.constructor == a.st.constructor && (b = b[b.length - 1]), b.node.nextSibling ? b.node.parentNode.insertBefore(this.node, b.node.nextSibling) : b.node.parentNode.appendChild(this.node), a._insertafter(this, b, this.paper), this)
					}, E.insertBefore = function (b) {
						return this.removed ? this : (b.constructor == a.st.constructor && (b = b[0]), b.node.parentNode.insertBefore(this.node, b.node), a._insertbefore(this, b, this.paper), this)
					}, E.blur = function (b) {
						var c = this.node.runtimeStyle,
							d = c.filter;
						return d = d.replace(r, o), 0 !== +b ? (this.attrs.blur = b, c.filter = d + n + m + ".Blur(pixelradius=" + (+b || 1.5) + ")", c.margin = a.format("-{0}px 0 0 -{0}px", f(+b || 1.5))) : (c.filter = d, c.margin = 0, delete this.attrs.blur), this
					}, a._engine.path = function (a, b) {
						var c = F("shape");
						c.style.cssText = t, c.coordsize = u + n + u, c.coordorigin = b.coordorigin;
						var d = new D(c, b),
							e = {
								fill: "none",
								stroke: "#000"
							};
						a && (e.path = a), d.type = "path", d.path = [], d.Path = o, B(d, e), b.canvas && b.canvas.appendChild(c);
						var f = F("skew");
						return f.on = !0, c.appendChild(f), d.skew = f, d.transform(o), d
					}, a._engine.rect = function (b, c, d, e, f, g) {
						var h = a._rectPath(c, d, e, f, g),
							i = b.path(h),
							j = i.attrs;
						return i.X = j.x = c, i.Y = j.y = d, i.W = j.width = e, i.H = j.height = f, j.r = g, j.path = h, i.type = "rect", i
					}, a._engine.ellipse = function (a, b, c, d, e) {
						{
							var f = a.path();
							f.attrs
						}
						return f.X = b - d, f.Y = c - e, f.W = 2 * d, f.H = 2 * e, f.type = "ellipse", B(f, {
							cx: b,
							cy: c,
							rx: d,
							ry: e
						}), f
					}, a._engine.circle = function (a, b, c, d) {
						{
							var e = a.path();
							e.attrs
						}
						return e.X = b - d, e.Y = c - d, e.W = e.H = 2 * d, e.type = "circle", B(e, {
							cx: b,
							cy: c,
							r: d
						}), e
					}, a._engine.image = function (b, c, d, e, f, g) {
						var h = a._rectPath(d, e, f, g),
							i = b.path(h).attr({
								stroke: "none"
							}),
							k = i.attrs,
							l = i.node,
							m = l.getElementsByTagName(j)[0];
						return k.src = c, i.X = k.x = d, i.Y = k.y = e, i.W = k.width = f, i.H = k.height = g, k.path = h, i.type = "image", m.parentNode == l && l.removeChild(m), m.rotate = !0, m.src = c, m.type = "tile", i._.fillpos = [d, e], i._.fillsize = [f, g], l.appendChild(m), z(i, 1, 1, 0, 0, 0), i
					}, a._engine.text = function (b, d, e, g) {
						var h = F("shape"),
							i = F("path"),
							j = F("textpath");
						d = d || 0, e = e || 0, g = g || "", i.v = a.format("m{0},{1}l{2},{1}", f(d * u), f(e * u), f(d * u) + 1), i.textpathok = !0, j.string = c(g), j.on = !0, h.style.cssText = t, h.coordsize = u + n + u, h.coordorigin = "0 0";
						var k = new D(h, b),
							l = {
								fill: "#000",
								stroke: "none",
								font: a._availableAttrs.font,
								text: g
							};
						k.shape = h, k.path = i, k.textpath = j, k.type = "text", k.attrs.text = c(g), k.attrs.x = d, k.attrs.y = e, k.attrs.w = 1, k.attrs.h = 1, B(k, l), h.appendChild(j), h.appendChild(i), b.canvas.appendChild(h);
						var m = F("skew");
						return m.on = !0, h.appendChild(m), k.skew = m, k.transform(o), k
					}, a._engine.setSize = function (b, c) {
						var d = this.canvas.style;
						return this.width = b, this.height = c, b == +b && (b += "px"), c == +c && (c += "px"), d.width = b, d.height = c, d.clip = "rect(0 " + b + " " + c + " 0)", this._viewBox && a._engine.setViewBox.apply(this, this._viewBox), this
					}, a._engine.setViewBox = function (b, c, d, e, f) {
						a.eve("raphael.setViewBox", this, this._viewBox, [b, c, d, e, f]);
						var g, h, i = this.getSize(),
							j = i.width,
							k = i.height;
						return f && (g = k / e, h = j / d, j > d * g && (b -= (j - d * g) / 2 / g), k > e * h && (c -= (k - e * h) / 2 / h)), this._viewBox = [b, c, d, e, !!f], this._viewBoxShift = {
							dx: -b,
							dy: -c,
							scale: i
						}, this.forEach(function (a) {
							a.transform("...")
						}), this
					};
					var F;
					a._engine.initWin = function (a) {
						var b = a.document;
						b.styleSheets.length < 31 ? b.createStyleSheet().addRule(".rvml", "behavior:url(#default#VML)") : b.styleSheets[0].addRule(".rvml", "behavior:url(#default#VML)");
						try {
							!b.namespaces.rvml && b.namespaces.add("rvml", "urn:schemas-microsoft-com:vml"), F = function (a) {
								return b.createElement("<rvml:" + a + ' class="rvml">')
							}
						} catch (c) {
							F = function (a) {
								return b.createElement("<" + a + ' xmlns="urn:schemas-microsoft.com:vml" class="rvml">')
							}
						}
					}, a._engine.initWin(a._g.win), a._engine.create = function () {
						var b = a._getContainer.apply(0, arguments),
							c = b.container,
							d = b.height,
							e = b.width,
							f = b.x,
							g = b.y;
						if (!c) throw new Error("VML container not found.");
						var h = new a._Paper,
							i = h.canvas = a._g.doc.createElement("div"),
							j = i.style;
						return f = f || 0, g = g || 0, e = e || 512, d = d || 342, h.width = e, h.height = d, e == +e && (e += "px"), d == +d && (d += "px"), h.coordsize = 1e3 * u + n + 1e3 * u, h.coordorigin = "0 0", h.span = a._g.doc.createElement("span"), h.span.style.cssText = "position:absolute;left:-9999em;top:-9999em;padding:0;margin:0;line-height:1;", i.appendChild(h.span), j.cssText = a.format("top:0;left:0;width:{0};height:{1};display:inline-block;position:relative;clip:rect(0 {0} {1} 0);overflow:hidden", e, d), 1 == c ? (a._g.doc.body.appendChild(i), j.left = f + "px", j.top = g + "px", j.position = "absolute") : c.firstChild ? c.insertBefore(i, c.firstChild) : c.appendChild(i), h.renderfix = function () {}, h
					}, a.prototype.clear = function () {
						a.eve("raphael.clear", this), this.canvas.innerHTML = o, this.span = a._g.doc.createElement("span"), this.span.style.cssText = "position:absolute;left:-9999em;top:-9999em;padding:0;margin:0;line-height:1;display:inline;", this.canvas.appendChild(this.span), this.bottom = this.top = null
					}, a.prototype.remove = function () {
						a.eve("raphael.remove", this), this.canvas.parentNode.removeChild(this.canvas);
						for (var b in this) this[b] = "function" == typeof this[b] ? a._removedFactory(b) : null;
						return !0
					};
					var G = a.st;
					for (var H in E) E[b](H) && !G[b](H) && (G[H] = function (a) {
						return function () {
							var b = arguments;
							return this.forEach(function (c) {
								c[a].apply(c, b)
							})
						}
					}(H))
				}
			}.apply(b, d), !(void 0 !== e && (a.exports = e))
		}])
	}), ! function (a, b) {
		"function" == typeof define && define.amd ? define("bloodhound", ["jquery"], function (c) {
			return a.Bloodhound = b(c)
		}) : "object" == typeof exports ? module.exports = b(require("jquery")) : a.Bloodhound = b(jQuery)
	}(this, function (a) {
		var b = function () {
				"use strict";
				return {
					isMsie: function () {
						return /(msie|trident)/i.test(navigator.userAgent) ? navigator.userAgent.match(/(msie |rv:)(\d+(.\d+)?)/i)[2] : !1
					},
					isBlankString: function (a) {
						return !a || /^\s*$/.test(a)
					},
					escapeRegExChars: function (a) {
						return a.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&")
					},
					isString: function (a) {
						return "string" == typeof a
					},
					isNumber: function (a) {
						return "number" == typeof a
					},
					isArray: a.isArray,
					isFunction: a.isFunction,
					isObject: a.isPlainObject,
					isUndefined: function (a) {
						return "undefined" == typeof a
					},
					isElement: function (a) {
						return !(!a || 1 !== a.nodeType)
					},
					isJQuery: function (b) {
						return b instanceof a
					},
					toStr: function (a) {
						return b.isUndefined(a) || null === a ? "" : a + ""
					},
					bind: a.proxy,
					each: function (b, c) {
						function d(a, b) {
							return c(b, a)
						}
						a.each(b, d)
					},
					map: a.map,
					filter: a.grep,
					every: function (b, c) {
						var d = !0;
						return b ? (a.each(b, function (a, e) {
							return (d = c.call(null, e, a, b)) ? void 0 : !1
						}), !!d) : d
					},
					some: function (b, c) {
						var d = !1;
						return b ? (a.each(b, function (a, e) {
							return (d = c.call(null, e, a, b)) ? !1 : void 0
						}), !!d) : d
					},
					mixin: a.extend,
					identity: function (a) {
						return a
					},
					clone: function (b) {
						return a.extend(!0, {}, b)
					},
					getIdGenerator: function () {
						var a = 0;
						return function () {
							return a++
						}
					},
					templatify: function (b) {
						function c() {
							return String(b)
						}
						return a.isFunction(b) ? b : c
					},
					defer: function (a) {
						setTimeout(a, 0)
					},
					debounce: function (a, b, c) {
						var d, e;
						return function () {
							var f, g, h = this,
								i = arguments;
							return f = function () {
								d = null, c || (e = a.apply(h, i))
							}, g = c && !d, clearTimeout(d), d = setTimeout(f, b), g && (e = a.apply(h, i)), e
						}
					},
					throttle: function (a, b) {
						var c, d, e, f, g, h;
						return g = 0, h = function () {
								g = new Date, e = null, f = a.apply(c, d)
							},
							function () {
								var i = new Date,
									j = b - (i - g);
								return c = this, d = arguments, 0 >= j ? (clearTimeout(e), e = null, g = i, f = a.apply(c, d)) : e || (e = setTimeout(h, j)), f
							}
					},
					stringify: function (a) {
						return b.isString(a) ? a : JSON.stringify(a)
					},
					noop: function () {}
				}
			}(),
			c = "0.11.1",
			d = function () {
				"use strict";

				function a(a) {
					return a = b.toStr(a), a ? a.split(/\s+/) : []
				}

				function c(a) {
					return a = b.toStr(a), a ? a.split(/\W+/) : []
				}

				function d(a) {
					return function (c) {
						return c = b.isArray(c) ? c : [].slice.call(arguments, 0),
							function (d) {
								var e = [];
								return b.each(c, function (c) {
									e = e.concat(a(b.toStr(d[c])))
								}), e
							}
					}
				}
				return {
					nonword: c,
					whitespace: a,
					obj: {
						nonword: d(c),
						whitespace: d(a)
					}
				}
			}(),
			e = function () {
				"use strict";

				function c(c) {
					this.maxSize = b.isNumber(c) ? c : 100, this.reset(), this.maxSize <= 0 && (this.set = this.get = a.noop)
				}

				function d() {
					this.head = this.tail = null
				}

				function e(a, b) {
					this.key = a, this.val = b, this.prev = this.next = null
				}
				return b.mixin(c.prototype, {
					set: function (a, b) {
						var c, d = this.list.tail;
						this.size >= this.maxSize && (this.list.remove(d), delete this.hash[d.key], this.size--), (c = this.hash[a]) ? (c.val = b, this.list.moveToFront(c)) : (c = new e(a, b), this.list.add(c), this.hash[a] = c, this.size++)
					},
					get: function (a) {
						var b = this.hash[a];
						return b ? (this.list.moveToFront(b), b.val) : void 0
					},
					reset: function () {
						this.size = 0, this.hash = {}, this.list = new d
					}
				}), b.mixin(d.prototype, {
					add: function (a) {
						this.head && (a.next = this.head, this.head.prev = a), this.head = a, this.tail = this.tail || a
					},
					remove: function (a) {
						a.prev ? a.prev.next = a.next : this.head = a.next, a.next ? a.next.prev = a.prev : this.tail = a.prev
					},
					moveToFront: function (a) {
						this.remove(a), this.add(a)
					}
				}), c
			}(),
			f = function () {
				"use strict";

				function c(a, c) {
					this.prefix = ["__", a, "__"].join(""), this.ttlKey = "__ttl__", this.keyMatcher = new RegExp("^" + b.escapeRegExChars(this.prefix)), this.ls = c || h, !this.ls && this._noop()
				}

				function d() {
					return (new Date).getTime()
				}

				function e(a) {
					return JSON.stringify(b.isUndefined(a) ? null : a)
				}

				function f(b) {
					return a.parseJSON(b)
				}

				function g(a) {
					var b, c, d = [],
						e = h.length;
					for (b = 0; e > b; b++)(c = h.key(b)).match(a) && d.push(c.replace(a, ""));
					return d
				}
				var h;
				try {
					h = window.localStorage, h.setItem("~~~", "!"), h.removeItem("~~~")
				} catch (i) {
					h = null
				}
				return b.mixin(c.prototype, {
					_prefix: function (a) {
						return this.prefix + a
					},
					_ttlKey: function (a) {
						return this._prefix(a) + this.ttlKey
					},
					_noop: function () {
						this.get = this.set = this.remove = this.clear = this.isExpired = b.noop
					},
					_safeSet: function (a, b) {
						try {
							this.ls.setItem(a, b)
						} catch (c) {
							"QuotaExceededError" === c.name && (this.clear(), this._noop())
						}
					},
					get: function (a) {
						return this.isExpired(a) && this.remove(a), f(this.ls.getItem(this._prefix(a)))
					},
					set: function (a, c, f) {
						return b.isNumber(f) ? this._safeSet(this._ttlKey(a), e(d() + f)) : this.ls.removeItem(this._ttlKey(a)), this._safeSet(this._prefix(a), e(c))
					},
					remove: function (a) {
						return this.ls.removeItem(this._ttlKey(a)), this.ls.removeItem(this._prefix(a)), this
					},
					clear: function () {
						var a, b = g(this.keyMatcher);
						for (a = b.length; a--;) this.remove(b[a]);
						return this
					},
					isExpired: function (a) {
						var c = f(this.ls.getItem(this._ttlKey(a)));
						return b.isNumber(c) && d() > c ? !0 : !1
					}
				}), c
			}(),
			g = function () {
				"use strict";

				function c(a) {
					a = a || {}, this.cancelled = !1, this.lastReq = null, this._send = a.transport, this._get = a.limiter ? a.limiter(this._get) : this._get, this._cache = a.cache === !1 ? new e(0) : h
				}
				var d = 0,
					f = {},
					g = 6,
					h = new e(10);
				return c.setMaxPendingRequests = function (a) {
					g = a
				}, c.resetCache = function () {
					h.reset()
				}, b.mixin(c.prototype, {
					_fingerprint: function (b) {
						return b = b || {}, b.url + b.type + a.param(b.data || {})
					},
					_get: function (a, b) {
						function c(a) {
							b(null, a), k._cache.set(i, a)
						}

						function e() {
							b(!0)
						}

						function h() {
							d--, delete f[i], k.onDeckRequestArgs && (k._get.apply(k, k.onDeckRequestArgs), k.onDeckRequestArgs = null)
						}
						var i, j, k = this;
						i = this._fingerprint(a), this.cancelled || i !== this.lastReq || ((j = f[i]) ? j.done(c).fail(e) : g > d ? (d++, f[i] = this._send(a).done(c).fail(e).always(h)) : this.onDeckRequestArgs = [].slice.call(arguments, 0))
					},
					get: function (c, d) {
						var e, f;
						d = d || a.noop, c = b.isString(c) ? {
							url: c
						} : c || {}, f = this._fingerprint(c), this.cancelled = !1, this.lastReq = f, (e = this._cache.get(f)) ? d(null, e) : this._get(c, d)
					},
					cancel: function () {
						this.cancelled = !0
					}
				}), c
			}(),
			h = window.SearchIndex = function () {
				"use strict";

				function c(c) {
					c = c || {}, c.datumTokenizer && c.queryTokenizer || a.error("datumTokenizer and queryTokenizer are both required"), this.identify = c.identify || b.stringify, this.datumTokenizer = c.datumTokenizer, this.queryTokenizer = c.queryTokenizer, this.reset()
				}

				function d(a) {
					return a = b.filter(a, function (a) {
						return !!a
					}), a = b.map(a, function (a) {
						return a.toLowerCase()
					})
				}

				function e() {
					var a = {};
					return a[i] = [], a[h] = {}, a
				}

				function f(a) {
					for (var b = {}, c = [], d = 0, e = a.length; e > d; d++) b[a[d]] || (b[a[d]] = !0, c.push(a[d]));
					return c
				}

				function g(a, b) {
					var c = 0,
						d = 0,
						e = [];
					a = a.sort(), b = b.sort();
					for (var f = a.length, g = b.length; f > c && g > d;) a[c] < b[d] ? c++ : a[c] > b[d] ? d++ : (e.push(a[c]), c++, d++);
					return e
				}
				var h = "c",
					i = "i";
				return b.mixin(c.prototype, {
					bootstrap: function (a) {
						this.datums = a.datums, this.trie = a.trie
					},
					add: function (a) {
						var c = this;
						a = b.isArray(a) ? a : [a], b.each(a, function (a) {
							var f, g;
							c.datums[f = c.identify(a)] = a, g = d(c.datumTokenizer(a)), b.each(g, function (a) {
								var b, d, g;
								for (b = c.trie, d = a.split(""); g = d.shift();) b = b[h][g] || (b[h][g] = e()), b[i].push(f)
							})
						})
					},
					get: function (a) {
						var c = this;
						return b.map(a, function (a) {
							return c.datums[a]
						})
					},
					search: function (a) {
						var c, e, j = this;
						return c = d(this.queryTokenizer(a)), b.each(c, function (a) {
							var b, c, d, f;
							if (e && 0 === e.length) return !1;
							for (b = j.trie, c = a.split(""); b && (d = c.shift());) b = b[h][d];
							return b && 0 === c.length ? (f = b[i].slice(0), void(e = e ? g(e, f) : f)) : (e = [], !1)
						}), e ? b.map(f(e), function (a) {
							return j.datums[a]
						}) : []
					},
					all: function () {
						var a = [];
						for (var b in this.datums) a.push(this.datums[b]);
						return a
					},
					reset: function () {
						this.datums = {}, this.trie = e()
					},
					serialize: function () {
						return {
							datums: this.datums,
							trie: this.trie
						}
					}
				}), c
			}(),
			i = function () {
				"use strict";

				function a(a) {
					this.url = a.url, this.ttl = a.ttl, this.cache = a.cache, this.prepare = a.prepare, this.transform = a.transform, this.transport = a.transport, this.thumbprint = a.thumbprint, this.storage = new f(a.cacheKey)
				}
				var c;
				return c = {
					data: "data",
					protocol: "protocol",
					thumbprint: "thumbprint"
				}, b.mixin(a.prototype, {
					_settings: function () {
						return {
							url: this.url,
							type: "GET",
							dataType: "json"
						}
					},
					store: function (a) {
						this.cache && (this.storage.set(c.data, a, this.ttl), this.storage.set(c.protocol, location.protocol, this.ttl), this.storage.set(c.thumbprint, this.thumbprint, this.ttl))
					},
					fromCache: function () {
						var a, b = {};
						return this.cache ? (b.data = this.storage.get(c.data), b.protocol = this.storage.get(c.protocol), b.thumbprint = this.storage.get(c.thumbprint), a = b.thumbprint !== this.thumbprint || b.protocol !== location.protocol, b.data && !a ? b.data : null) : null
					},
					fromNetwork: function (a) {
						function b() {
							a(!0)
						}

						function c(b) {
							a(null, e.transform(b))
						}
						var d, e = this;
						a && (d = this.prepare(this._settings()), this.transport(d).fail(b).done(c))
					},
					clear: function () {
						return this.storage.clear(), this
					}
				}), a
			}(),
			j = function () {
				"use strict";

				function a(a) {
					this.url = a.url, this.prepare = a.prepare, this.transform = a.transform, this.transport = new g({
						cache: a.cache,
						limiter: a.limiter,
						transport: a.transport
					})
				}
				return b.mixin(a.prototype, {
					_settings: function () {
						return {
							url: this.url,
							type: "GET",
							dataType: "json"
						}
					},
					get: function (a, b) {
						function c(a, c) {
							b(a ? [] : e.transform(c))
						}
						var d, e = this;
						return b ? (a = a || "", d = this.prepare(a, this._settings()), this.transport.get(d, c)) : void 0
					},
					cancelLastRequest: function () {
						this.transport.cancel()
					}
				}), a
			}(),
			k = function () {
				"use strict";

				function d(d) {
					var e;
					return d ? (e = {
						url: null,
						ttl: 864e5,
						cache: !0,
						cacheKey: null,
						thumbprint: "",
						prepare: b.identity,
						transform: b.identity,
						transport: null
					}, d = b.isString(d) ? {
						url: d
					} : d, d = b.mixin(e, d), !d.url && a.error("prefetch requires url to be set"), d.transform = d.filter || d.transform, d.cacheKey = d.cacheKey || d.url, d.thumbprint = c + d.thumbprint, d.transport = d.transport ? h(d.transport) : a.ajax, d) : null
				}

				function e(c) {
					var d;
					return c ? (d = {
						url: null,
						cache: !0,
						prepare: null,
						replace: null,
						wildcard: null,
						limiter: null,
						rateLimitBy: "debounce",
						rateLimitWait: 300,
						transform: b.identity,
						transport: null
					}, c = b.isString(c) ? {
						url: c
					} : c, c = b.mixin(d, c), !c.url && a.error("remote requires url to be set"), c.transform = c.filter || c.transform, c.prepare = f(c), c.limiter = g(c), c.transport = c.transport ? h(c.transport) : a.ajax, delete c.replace, delete c.wildcard, delete c.rateLimitBy, delete c.rateLimitWait, c) : void 0
				}

				function f(a) {
					function b(a, b) {
						return b.url = f(b.url, a), b
					}

					function c(a, b) {
						return b.url = b.url.replace(g, encodeURIComponent(a)), b
					}

					function d(a, b) {
						return b
					}
					var e, f, g;
					return e = a.prepare, f = a.replace, g = a.wildcard, e ? e : e = f ? b : a.wildcard ? c : d
				}

				function g(a) {
					function c(a) {
						return function (c) {
							return b.debounce(c, a)
						}
					}

					function d(a) {
						return function (c) {
							return b.throttle(c, a)
						}
					}
					var e, f, g;
					return e = a.limiter, f = a.rateLimitBy, g = a.rateLimitWait, e || (e = /^throttle$/i.test(f) ? d(g) : c(g)), e
				}

				function h(c) {
					return function (d) {
						function e(a) {
							b.defer(function () {
								g.resolve(a)
							})
						}

						function f(a) {
							b.defer(function () {
								g.reject(a)
							})
						}
						var g = a.Deferred();
						return c(d, e, f), g
					}
				}
				return function (c) {
					var f, g;
					return f = {
						initialize: !0,
						identify: b.stringify,
						datumTokenizer: null,
						queryTokenizer: null,
						sufficient: 5,
						sorter: null,
						local: [],
						prefetch: null,
						remote: null
					}, c = b.mixin(f, c || {}), !c.datumTokenizer && a.error("datumTokenizer is required"), !c.queryTokenizer && a.error("queryTokenizer is required"), g = c.sorter, c.sorter = g ? function (a) {
						return a.sort(g)
					} : b.identity, c.local = b.isFunction(c.local) ? c.local() : c.local, c.prefetch = d(c.prefetch), c.remote = e(c.remote), c
				}
			}(),
			l = function () {
				"use strict";

				function c(a) {
					a = k(a), this.sorter = a.sorter, this.identify = a.identify, this.sufficient = a.sufficient, this.local = a.local, this.remote = a.remote ? new j(a.remote) : null, this.prefetch = a.prefetch ? new i(a.prefetch) : null, this.index = new h({
						identify: this.identify,
						datumTokenizer: a.datumTokenizer,
						queryTokenizer: a.queryTokenizer
					}), a.initialize !== !1 && this.initialize()
				}
				var e;
				return e = window && window.Bloodhound, c.noConflict = function () {
					return window && (window.Bloodhound = e), c
				}, c.tokenizers = d, b.mixin(c.prototype, {
					__ttAdapter: function () {
						function a(a, b, d) {
							return c.search(a, b, d)
						}

						function b(a, b) {
							return c.search(a, b)
						}
						var c = this;
						return this.remote ? a : b
					},
					_loadPrefetch: function () {
						function b(a, b) {
							return a ? c.reject() : (e.add(b), e.prefetch.store(e.index.serialize()), void c.resolve())
						}
						var c, d, e = this;
						return c = a.Deferred(), this.prefetch ? (d = this.prefetch.fromCache()) ? (this.index.bootstrap(d), c.resolve()) : this.prefetch.fromNetwork(b) : c.resolve(), c.promise()
					},
					_initialize: function () {
						function a() {
							b.add(b.local)
						}
						var b = this;
						return this.clear(), (this.initPromise = this._loadPrefetch()).done(a), this.initPromise
					},
					initialize: function (a) {
						return !this.initPromise || a ? this._initialize() : this.initPromise
					},
					add: function (a) {
						return this.index.add(a), this
					},
					get: function (a) {
						return a = b.isArray(a) ? a : [].slice.call(arguments), this.index.get(a)
					},
					search: function (a, c, d) {
						function e(a) {
							var c = [];
							b.each(a, function (a) {
								!b.some(f, function (b) {
									return g.identify(a) === g.identify(b)
								}) && c.push(a)
							}), d && d(c)
						}
						var f, g = this;
						return f = this.sorter(this.index.search(a)), c(this.remote ? f.slice() : f), this.remote && f.length < this.sufficient ? this.remote.get(a, e) : this.remote && this.remote.cancelLastRequest(), this
					},
					all: function () {
						return this.index.all()
					},
					clear: function () {
						return this.index.reset(), this
					},
					clearPrefetchCache: function () {
						return this.prefetch && this.prefetch.clear(), this
					},
					clearRemoteCache: function () {
						return g.resetCache(), this
					},
					ttAdapter: function () {
						return this.__ttAdapter()
					}
				}), c
			}();
		return l
	}),
	function (a, b) {
		"function" == typeof define && define.amd ? define("typeahead.js", ["jquery"], function (a) {
			return b(a)
		}) : "object" == typeof exports ? module.exports = b(require("jquery")) : b(jQuery)
	}(this, function (a) {
		var b = function () {
				"use strict";
				return {
					isMsie: function () {
						return /(msie|trident)/i.test(navigator.userAgent) ? navigator.userAgent.match(/(msie |rv:)(\d+(.\d+)?)/i)[2] : !1
					},
					isBlankString: function (a) {
						return !a || /^\s*$/.test(a)
					},
					escapeRegExChars: function (a) {
						return a.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&")
					},
					isString: function (a) {
						return "string" == typeof a
					},
					isNumber: function (a) {
						return "number" == typeof a
					},
					isArray: a.isArray,
					isFunction: a.isFunction,
					isObject: a.isPlainObject,
					isUndefined: function (a) {
						return "undefined" == typeof a
					},
					isElement: function (a) {
						return !(!a || 1 !== a.nodeType)
					},
					isJQuery: function (b) {
						return b instanceof a
					},
					toStr: function (a) {
						return b.isUndefined(a) || null === a ? "" : a + ""
					},
					bind: a.proxy,
					each: function (b, c) {
						function d(a, b) {
							return c(b, a)
						}
						a.each(b, d)
					},
					map: a.map,
					filter: a.grep,
					every: function (b, c) {
						var d = !0;
						return b ? (a.each(b, function (a, e) {
							return (d = c.call(null, e, a, b)) ? void 0 : !1
						}), !!d) : d
					},
					some: function (b, c) {
						var d = !1;
						return b ? (a.each(b, function (a, e) {
							return (d = c.call(null, e, a, b)) ? !1 : void 0
						}), !!d) : d
					},
					mixin: a.extend,
					identity: function (a) {
						return a
					},
					clone: function (b) {
						return a.extend(!0, {}, b)
					},
					getIdGenerator: function () {
						var a = 0;
						return function () {
							return a++
						}
					},
					templatify: function (b) {
						function c() {
							return String(b)
						}
						return a.isFunction(b) ? b : c
					},
					defer: function (a) {
						setTimeout(a, 0)
					},
					debounce: function (a, b, c) {
						var d, e;
						return function () {
							var f, g, h = this,
								i = arguments;
							return f = function () {
								d = null, c || (e = a.apply(h, i))
							}, g = c && !d, clearTimeout(d), d = setTimeout(f, b), g && (e = a.apply(h, i)), e
						}
					},
					throttle: function (a, b) {
						var c, d, e, f, g, h;
						return g = 0, h = function () {
								g = new Date, e = null, f = a.apply(c, d)
							},
							function () {
								var i = new Date,
									j = b - (i - g);
								return c = this, d = arguments, 0 >= j ? (clearTimeout(e), e = null, g = i, f = a.apply(c, d)) : e || (e = setTimeout(h, j)), f
							}
					},
					stringify: function (a) {
						return b.isString(a) ? a : JSON.stringify(a)
					},
					noop: function () {}
				}
			}(),
			c = function () {
				"use strict";

				function a(a) {
					var g, h;
					return h = b.mixin({}, f, a), g = {
						css: e(),
						classes: h,
						html: c(h),
						selectors: d(h)
					}, {
						css: g.css,
						html: g.html,
						classes: g.classes,
						selectors: g.selectors,
						mixin: function (a) {
							b.mixin(a, g)
						}
					}
				}

				function c(a) {
					return {
						wrapper: '<span class="' + a.wrapper + '"></span>',
						menu: '<div class="' + a.menu + '"></div>'
					}
				}

				function d(a) {
					var c = {};
					return b.each(a, function (a, b) {
						c[b] = "." + a
					}), c
				}

				function e() {
					var a = {
						wrapper: {
							position: "relative",
							display: "inline-block"
						},
						hint: {
							position: "absolute",
							top: "0",
							left: "0",
							borderColor: "transparent",
							boxShadow: "none",
							opacity: "1"
						},
						input: {
							position: "relative",
							verticalAlign: "top",
							backgroundColor: "transparent"
						},
						inputWithNoHint: {
							position: "relative",
							verticalAlign: "top"
						},
						menu: {
							position: "absolute",
							top: "100%",
							left: "0",
							zIndex: "100",
							display: "none"
						},
						ltr: {
							left: "0",
							right: "auto"
						},
						rtl: {
							left: "auto",
							right: " 0"
						}
					};
					return b.isMsie() && b.mixin(a.input, {
						backgroundImage: "url(data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7)"
					}), a
				}
				var f = {
					wrapper: "twitter-typeahead",
					input: "tt-input",
					hint: "tt-hint",
					menu: "tt-menu",
					dataset: "tt-dataset",
					suggestion: "tt-suggestion",
					selectable: "tt-selectable",
					empty: "tt-empty",
					open: "tt-open",
					cursor: "tt-cursor",
					highlight: "tt-highlight"
				};
				return a
			}(),
			d = function () {
				"use strict";

				function c(b) {
					b && b.el || a.error("EventBus initialized without el"), this.$el = a(b.el)
				}
				var d, e;
				return d = "typeahead:", e = {
					render: "rendered",
					cursorchange: "cursorchanged",
					select: "selected",
					autocomplete: "autocompleted"
				}, b.mixin(c.prototype, {
					_trigger: function (b, c) {
						var e;
						return e = a.Event(d + b), (c = c || []).unshift(e), this.$el.trigger.apply(this.$el, c), e
					},
					before: function (a) {
						var b, c;
						return b = [].slice.call(arguments, 1), c = this._trigger("before" + a, b), c.isDefaultPrevented()
					},
					trigger: function (a) {
						var b;
						this._trigger(a, [].slice.call(arguments, 1)), (b = e[a]) && this._trigger(b, [].slice.call(arguments, 1))
					}
				}), c
			}(),
			e = function () {
				"use strict";

				function a(a, b, c, d) {
					var e;
					if (!c) return this;
					for (b = b.split(i), c = d ? h(c, d) : c, this._callbacks = this._callbacks || {}; e = b.shift();) this._callbacks[e] = this._callbacks[e] || {
						sync: [],
						async: []
					}, this._callbacks[e][a].push(c);
					return this
				}

				function b(b, c, d) {
					return a.call(this, "async", b, c, d)
				}

				function c(b, c, d) {
					return a.call(this, "sync", b, c, d)
				}

				function d(a) {
					var b;
					if (!this._callbacks) return this;
					for (a = a.split(i); b = a.shift();) delete this._callbacks[b];
					return this
				}

				function e(a) {
					var b, c, d, e, g;
					if (!this._callbacks) return this;
					for (a = a.split(i), d = [].slice.call(arguments, 1);
						(b = a.shift()) && (c = this._callbacks[b]);) e = f(c.sync, this, [b].concat(d)), g = f(c.async, this, [b].concat(d)), e() && j(g);
					return this
				}

				function f(a, b, c) {
					function d() {
						for (var d, e = 0, f = a.length; !d && f > e; e += 1) d = a[e].apply(b, c) === !1;
						return !d
					}
					return d
				}

				function g() {
					var a;
					return a = window.setImmediate ? function (a) {
						setImmediate(function () {
							a()
						})
					} : function (a) {
						setTimeout(function () {
							a()
						}, 0)
					}
				}

				function h(a, b) {
					return a.bind ? a.bind(b) : function () {
						a.apply(b, [].slice.call(arguments, 0))
					}
				}
				var i = /\s+/,
					j = g();
				return {
					onSync: c,
					onAsync: b,
					off: d,
					trigger: e
				}
			}(),
			f = function (a) {
				"use strict";

				function c(a, c, d) {
					for (var e, f = [], g = 0, h = a.length; h > g; g++) f.push(b.escapeRegExChars(a[g]));
					return e = d ? "\\b(" + f.join("|") + ")\\b" : "(" + f.join("|") + ")", c ? new RegExp(e) : new RegExp(e, "i")
				}
				var d = {
					node: null,
					pattern: null,
					tagName: "strong",
					className: null,
					wordsOnly: !1,
					caseSensitive: !1
				};
				return function (e) {
					function f(b) {
						var c, d, f;
						return (c = h.exec(b.data)) && (f = a.createElement(e.tagName), e.className && (f.className = e.className), d = b.splitText(c.index), d.splitText(c[0].length), f.appendChild(d.cloneNode(!0)), b.parentNode.replaceChild(f, d)), !!c
					}

					function g(a, b) {
						for (var c, d = 3, e = 0; e < a.childNodes.length; e++) c = a.childNodes[e], c.nodeType === d ? e += b(c) ? 1 : 0 : g(c, b)
					}
					var h;
					e = b.mixin({}, d, e), e.node && e.pattern && (e.pattern = b.isArray(e.pattern) ? e.pattern : [e.pattern], h = c(e.pattern, e.caseSensitive, e.wordsOnly), g(e.node, f))
				}
			}(window.document),
			g = function () {
				"use strict";

				function c(c, e) {
					c = c || {}, c.input || a.error("input is missing"), e.mixin(this), this.$hint = a(c.hint), this.$input = a(c.input), this.query = this.$input.val(), this.queryWhenFocused = this.hasFocus() ? this.query : null, this.$overflowHelper = d(this.$input), this._checkLanguageDirection(), 0 === this.$hint.length && (this.setHint = this.getHint = this.clearHint = this.clearHintIfInvalid = b.noop)
				}

				function d(b) {
					return a('<pre aria-hidden="true"></pre>').css({
						position: "absolute",
						visibility: "hidden",
						whiteSpace: "pre",
						fontFamily: b.css("font-family"),
						fontSize: b.css("font-size"),
						fontStyle: b.css("font-style"),
						fontVariant: b.css("font-variant"),
						fontWeight: b.css("font-weight"),
						wordSpacing: b.css("word-spacing"),
						letterSpacing: b.css("letter-spacing"),
						textIndent: b.css("text-indent"),
						textRendering: b.css("text-rendering"),
						textTransform: b.css("text-transform")
					}).insertAfter(b)
				}

				function f(a, b) {
					return c.normalizeQuery(a) === c.normalizeQuery(b)
				}

				function g(a) {
					return a.altKey || a.ctrlKey || a.metaKey || a.shiftKey
				}
				var h;
				return h = {
					9: "tab",
					27: "esc",
					37: "left",
					39: "right",
					13: "enter",
					38: "up",
					40: "down"
				}, c.normalizeQuery = function (a) {
					return b.toStr(a).replace(/^\s*/g, "").replace(/\s{2,}/g, " ")
				}, b.mixin(c.prototype, e, {
					_onBlur: function () {
						this.resetInputValue(), this.trigger("blurred")
					},
					_onFocus: function () {
						this.queryWhenFocused = this.query, this.trigger("focused")
					},
					_onKeydown: function (a) {
						var b = h[a.which || a.keyCode];
						this._managePreventDefault(b, a), b && this._shouldTrigger(b, a) && this.trigger(b + "Keyed", a)
					},
					_onInput: function () {
						this._setQuery(this.getInputValue()), this.clearHintIfInvalid(), this._checkLanguageDirection()
					},
					_managePreventDefault: function (a, b) {
						var c;
						switch (a) {
							case "up":
							case "down":
								c = !g(b);
								break;
							default:
								c = !1
						}
						c && b.preventDefault()
					},
					_shouldTrigger: function (a, b) {
						var c;
						switch (a) {
							case "tab":
								c = !g(b);
								break;
							default:
								c = !0
						}
						return c
					},
					_checkLanguageDirection: function () {
						var a = (this.$input.css("direction") || "ltr").toLowerCase();
						this.dir !== a && (this.dir = a, this.$hint.attr("dir", a), this.trigger("langDirChanged", a))
					},
					_setQuery: function (a, b) {
						var c, d;
						c = f(a, this.query), d = c ? this.query.length !== a.length : !1, this.query = a, b || c ? !b && d && this.trigger("whitespaceChanged", this.query) : this.trigger("queryChanged", this.query)
					},
					bind: function () {
						var a, c, d, e, f = this;
						return a = b.bind(this._onBlur, this), c = b.bind(this._onFocus, this), d = b.bind(this._onKeydown, this), e = b.bind(this._onInput, this), this.$input.on("blur.tt", a).on("focus.tt", c).on("keydown.tt", d), !b.isMsie() || b.isMsie() > 9 ? this.$input.on("input.tt", e) : this.$input.on("keydown.tt keypress.tt cut.tt paste.tt", function (a) {
							h[a.which || a.keyCode] || b.defer(b.bind(f._onInput, f, a))
						}), this
					},
					focus: function () {
						this.$input.focus()
					},
					blur: function () {
						this.$input.blur()
					},
					getLangDir: function () {
						return this.dir
					},
					getQuery: function () {
						return this.query || ""
					},
					setQuery: function (a, b) {
						this.setInputValue(a), this._setQuery(a, b)
					},
					hasQueryChangedSinceLastFocus: function () {
						return this.query !== this.queryWhenFocused
					},
					getInputValue: function () {
						return this.$input.val()
					},
					setInputValue: function (a) {
						this.$input.val(a), this.clearHintIfInvalid(), this._checkLanguageDirection()
					},
					resetInputValue: function () {
						this.setInputValue(this.query)
					},
					getHint: function () {
						return this.$hint.val()
					},
					setHint: function (a) {
						this.$hint.val(a)
					},
					clearHint: function () {
						this.setHint("")
					},
					clearHintIfInvalid: function () {
						var a, b, c, d;
						a = this.getInputValue(), b = this.getHint(), c = a !== b && 0 === b.indexOf(a), d = "" !== a && c && !this.hasOverflow(), !d && this.clearHint()
					},
					hasFocus: function () {
						return this.$input.is(":focus")
					},
					hasOverflow: function () {
						var a = this.$input.width() - 2;
						return this.$overflowHelper.text(this.getInputValue()), this.$overflowHelper.width() >= a
					},
					isCursorAtEnd: function () {
						var a, c, d;
						return a = this.$input.val().length, c = this.$input[0].selectionStart, b.isNumber(c) ? c === a : document.selection ? (d = document.selection.createRange(), d.moveStart("character", -a), a === d.text.length) : !0
					},
					destroy: function () {
						this.$hint.off(".tt"), this.$input.off(".tt"), this.$overflowHelper.remove(), this.$hint = this.$input = this.$overflowHelper = a("<div>")
					}
				}), c
			}(),
			h = function () {
				"use strict";

				function c(c, e) {
					c = c || {}, c.templates = c.templates || {}, c.templates.notFound = c.templates.notFound || c.templates.empty, c.source || a.error("missing source"), c.node || a.error("missing node"), c.name && !h(c.name) && a.error("invalid dataset name: " + c.name), e.mixin(this), this.highlight = !!c.highlight, this.name = c.name || j(), this.limit = c.limit || 5, this.displayFn = d(c.display || c.displayKey), this.templates = g(c.templates, this.displayFn), this.source = c.source.__ttAdapter ? c.source.__ttAdapter() : c.source, this.async = b.isUndefined(c.async) ? this.source.length > 2 : !!c.async, this._resetLastSuggestion(), this.$el = a(c.node).addClass(this.classes.dataset).addClass(this.classes.dataset + "-" + this.name)
				}

				function d(a) {
					function c(b) {
						return b[a]
					}
					return a = a || b.stringify, b.isFunction(a) ? a : c
				}

				function g(c, d) {
					function e(b) {
						return a("<div>").text(d(b))
					}
					return {
						notFound: c.notFound && b.templatify(c.notFound),
						pending: c.pending && b.templatify(c.pending),
						header: c.header && b.templatify(c.header),
						footer: c.footer && b.templatify(c.footer),
						suggestion: c.suggestion || e
					}
				}

				function h(a) {
					return /^[_a-zA-Z0-9-]+$/.test(a)
				}
				var i, j;
				return i = {
					val: "tt-selectable-display",
					obj: "tt-selectable-object"
				}, j = b.getIdGenerator(), c.extractData = function (b) {
					var c = a(b);
					return c.data(i.obj) ? {
						val: c.data(i.val) || "",
						obj: c.data(i.obj) || null
					} : null
				}, b.mixin(c.prototype, e, {
					_overwrite: function (a, b) {
						b = b || [], b.length ? this._renderSuggestions(a, b) : this.async && this.templates.pending ? this._renderPending(a) : !this.async && this.templates.notFound ? this._renderNotFound(a) : this._empty(), this.trigger("rendered", this.name, b, !1)
					},
					_append: function (a, b) {
						b = b || [], b.length && this.$lastSuggestion.length ? this._appendSuggestions(a, b) : b.length ? this._renderSuggestions(a, b) : !this.$lastSuggestion.length && this.templates.notFound && this._renderNotFound(a), this.trigger("rendered", this.name, b, !0)
					},
					_renderSuggestions: function (a, b) {
						var c;
						c = this._getSuggestionsFragment(a, b), this.$lastSuggestion = c.children().last(), this.$el.html(c).prepend(this._getHeader(a, b)).append(this._getFooter(a, b))
					},
					_appendSuggestions: function (a, b) {
						var c, d;
						c = this._getSuggestionsFragment(a, b), d = c.children().last(), this.$lastSuggestion.after(c), this.$lastSuggestion = d
					},
					_renderPending: function (a) {
						var b = this.templates.pending;
						this._resetLastSuggestion(), b && this.$el.html(b({
							query: a,
							dataset: this.name
						}))
					},
					_renderNotFound: function (a) {
						var b = this.templates.notFound;
						this._resetLastSuggestion(), b && this.$el.html(b({
							query: a,
							dataset: this.name
						}))
					},
					_empty: function () {
						this.$el.empty(), this._resetLastSuggestion()
					},
					_getSuggestionsFragment: function (c, d) {
						var e, g = this;
						return e = document.createDocumentFragment(), b.each(d, function (b) {
							var d, f;
							f = g._injectQuery(c, b), d = a(g.templates.suggestion(f)).data(i.obj, b).data(i.val, g.displayFn(b)).addClass(g.classes.suggestion + " " + g.classes.selectable), e.appendChild(d[0])
						}), this.highlight && f({
							className: this.classes.highlight,
							node: e,
							pattern: c
						}), a(e)
					},
					_getFooter: function (a, b) {
						return this.templates.footer ? this.templates.footer({
							query: a,
							suggestions: b,
							dataset: this.name
						}) : null
					},
					_getHeader: function (a, b) {
						return this.templates.header ? this.templates.header({
							query: a,
							suggestions: b,
							dataset: this.name
						}) : null
					},
					_resetLastSuggestion: function () {
						this.$lastSuggestion = a()
					},
					_injectQuery: function (a, c) {
						return b.isObject(c) ? b.mixin({
							_query: a
						}, c) : c
					},
					update: function (b) {
						function c(a) {
							g || (g = !0, a = (a || []).slice(0, e.limit), h = a.length, e._overwrite(b, a), h < e.limit && e.async && e.trigger("asyncRequested", b))
						}

						function d(c) {
							c = c || [], !f && h < e.limit && (e.cancel = a.noop, h += c.length, e._append(b, c.slice(0, e.limit - h)), e.async && e.trigger("asyncReceived", b))
						}
						var e = this,
							f = !1,
							g = !1,
							h = 0;
						this.cancel(), this.cancel = function () {
							f = !0, e.cancel = a.noop, e.async && e.trigger("asyncCanceled", b)
						}, this.source(b, c, d), !g && c([])
					},
					cancel: a.noop,
					clear: function () {
						this._empty(), this.cancel(), this.trigger("cleared")
					},
					isEmpty: function () {
						return this.$el.is(":empty")
					},
					destroy: function () {
						this.$el = a("<div>")
					}
				}), c
			}(),
			i = function () {
				"use strict";

				function c(c, d) {
					function e(b) {
						var c = f.$node.find(b.node).first();
						return b.node = c.length ? c : a("<div>").appendTo(f.$node), new h(b, d)
					}
					var f = this;
					c = c || {}, c.node || a.error("node is required"), d.mixin(this), this.$node = a(c.node), this.query = null, this.datasets = b.map(c.datasets, e)
				}
				return b.mixin(c.prototype, e, {
					_onSelectableClick: function (b) {
						this.trigger("selectableClicked", a(b.currentTarget))
					},
					_onRendered: function (a, b, c, d) {
						this.$node.toggleClass(this.classes.empty, this._allDatasetsEmpty()), this.trigger("datasetRendered", b, c, d)
					},
					_onCleared: function () {
						this.$node.toggleClass(this.classes.empty, this._allDatasetsEmpty()), this.trigger("datasetCleared")
					},
					_propagate: function () {
						this.trigger.apply(this, arguments)
					},
					_allDatasetsEmpty: function () {
						function a(a) {
							return a.isEmpty()
						}
						return b.every(this.datasets, a)
					},
					_getSelectables: function () {
						return this.$node.find(this.selectors.selectable)
					},
					_removeCursor: function () {
						var a = this.getActiveSelectable();
						a && a.removeClass(this.classes.cursor)
					},
					_ensureVisible: function (a) {
						var b, c, d, e;
						b = a.position().top, c = b + a.outerHeight(!0), d = this.$node.scrollTop(), e = this.$node.height() + parseInt(this.$node.css("paddingTop"), 10) + parseInt(this.$node.css("paddingBottom"), 10), 0 > b ? this.$node.scrollTop(d + b) : c > e && this.$node.scrollTop(d + (c - e))
					},
					bind: function () {
						var a, c = this;
						return a = b.bind(this._onSelectableClick, this), this.$node.on("click.tt", this.selectors.selectable, a), b.each(this.datasets, function (a) {
							a.onSync("asyncRequested", c._propagate, c).onSync("asyncCanceled", c._propagate, c).onSync("asyncReceived", c._propagate, c).onSync("rendered", c._onRendered, c).onSync("cleared", c._onCleared, c)
						}), this
					},
					isOpen: function () {
						return this.$node.hasClass(this.classes.open)
					},
					open: function () {
						this.$node.addClass(this.classes.open)
					},
					close: function () {
						this.$node.removeClass(this.classes.open), this._removeCursor()
					},
					setLanguageDirection: function (a) {
						this.$node.attr("dir", a)
					},
					selectableRelativeToCursor: function (a) {
						var b, c, d, e;
						return c = this.getActiveSelectable(), b = this._getSelectables(), d = c ? b.index(c) : -1, e = d + a, e = (e + 1) % (b.length + 1) - 1, e = -1 > e ? b.length - 1 : e, -1 === e ? null : b.eq(e)
					},
					setCursor: function (a) {
						this._removeCursor(), (a = a && a.first()) && (a.addClass(this.classes.cursor), this._ensureVisible(a))
					},
					getSelectableData: function (a) {
						return a && a.length ? h.extractData(a) : null
					},
					getActiveSelectable: function () {
						var a = this._getSelectables().filter(this.selectors.cursor).first();
						return a.length ? a : null
					},
					getTopSelectable: function () {
						var a = this._getSelectables().first();
						return a.length ? a : null
					},
					update: function (a) {
						function c(b) {
							b.update(a)
						}
						var d = a !== this.query;
						return d && (this.query = a, b.each(this.datasets, c)), d
					},
					empty: function () {
						function a(a) {
							a.clear()
						}
						b.each(this.datasets, a), this.query = null, this.$node.addClass(this.classes.empty)
					},
					destroy: function () {
						function c(a) {
							a.destroy()
						}
						this.$node.off(".tt"), this.$node = a("<div>"), b.each(this.datasets, c)
					}
				}), c
			}(),
			j = function () {
				"use strict";

				function a() {
					i.apply(this, [].slice.call(arguments, 0))
				}
				var c = i.prototype;
				return b.mixin(a.prototype, i.prototype, {
					open: function () {
						return !this._allDatasetsEmpty() && this._show(), c.open.apply(this, [].slice.call(arguments, 0))
					},
					close: function () {
						return this._hide(), c.close.apply(this, [].slice.call(arguments, 0))
					},
					_onRendered: function () {
						return this._allDatasetsEmpty() ? this._hide() : this.isOpen() && this._show(), c._onRendered.apply(this, [].slice.call(arguments, 0))
					},
					_onCleared: function () {
						return this._allDatasetsEmpty() ? this._hide() : this.isOpen() && this._show(), c._onCleared.apply(this, [].slice.call(arguments, 0))
					},
					setLanguageDirection: function (a) {
						return this.$node.css("ltr" === a ? this.css.ltr : this.css.rtl), c.setLanguageDirection.apply(this, [].slice.call(arguments, 0))
					},
					_hide: function () {
						this.$node.hide()
					},
					_show: function () {
						this.$node.css("display", "block")
					}
				}), a
			}(),
			k = function () {
				"use strict";

				function c(c, e) {
					var f, g, h, i, j, k, l, m, n, o, p;
					c = c || {}, c.input || a.error("missing input"), c.menu || a.error("missing menu"), c.eventBus || a.error("missing event bus"), e.mixin(this), this.eventBus = c.eventBus, this.minLength = b.isNumber(c.minLength) ? c.minLength : 1, this.input = c.input, this.menu = c.menu, this.enabled = !0, this.active = !1, this.input.hasFocus() && this.activate(), this.dir = this.input.getLangDir(), this._hacks(), this.menu.bind().onSync("selectableClicked", this._onSelectableClicked, this).onSync("asyncRequested", this._onAsyncRequested, this).onSync("asyncCanceled", this._onAsyncCanceled, this).onSync("asyncReceived", this._onAsyncReceived, this).onSync("datasetRendered", this._onDatasetRendered, this).onSync("datasetCleared", this._onDatasetCleared, this), f = d(this, "activate", "open", "_onFocused"), g = d(this, "deactivate", "_onBlurred"), h = d(this, "isActive", "isOpen", "_onEnterKeyed"), i = d(this, "isActive", "isOpen", "_onTabKeyed"), j = d(this, "isActive", "_onEscKeyed"), k = d(this, "isActive", "open", "_onUpKeyed"), l = d(this, "isActive", "open", "_onDownKeyed"), m = d(this, "isActive", "isOpen", "_onLeftKeyed"), n = d(this, "isActive", "isOpen", "_onRightKeyed"), o = d(this, "_openIfActive", "_onQueryChanged"), p = d(this, "_openIfActive", "_onWhitespaceChanged"), this.input.bind().onSync("focused", f, this).onSync("blurred", g, this).onSync("enterKeyed", h, this).onSync("tabKeyed", i, this).onSync("escKeyed", j, this).onSync("upKeyed", k, this).onSync("downKeyed", l, this).onSync("leftKeyed", m, this).onSync("rightKeyed", n, this).onSync("queryChanged", o, this).onSync("whitespaceChanged", p, this).onSync("langDirChanged", this._onLangDirChanged, this)
				}

				function d(a) {
					var c = [].slice.call(arguments, 1);
					return function () {
						var d = [].slice.call(arguments);
						b.each(c, function (b) {
							return a[b].apply(a, d)
						})
					}
				}
				return b.mixin(c.prototype, {
					_hacks: function () {
						var c, d;
						c = this.input.$input || a("<div>"), d = this.menu.$node || a("<div>"), c.on("blur.tt", function (a) {
							var e, f, g;
							e = document.activeElement, f = d.is(e), g = d.has(e).length > 0, b.isMsie() && (f || g) && (a.preventDefault(), a.stopImmediatePropagation(), b.defer(function () {
								c.focus()
							}))
						}), d.on("mousedown.tt", function (a) {
							a.preventDefault()
						})
					},
					_onSelectableClicked: function (a, b) {
						this.select(b)
					},
					_onDatasetCleared: function () {
						this._updateHint()
					},
					_onDatasetRendered: function (a, b, c, d) {
						this._updateHint(), this.eventBus.trigger("render", c, d, b)
					},
					_onAsyncRequested: function (a, b, c) {
						this.eventBus.trigger("asyncrequest", c, b)
					},
					_onAsyncCanceled: function (a, b, c) {
						this.eventBus.trigger("asynccancel", c, b)
					},
					_onAsyncReceived: function (a, b, c) {
						this.eventBus.trigger("asyncreceive", c, b)
					},
					_onFocused: function () {
						this._minLengthMet() && this.menu.update(this.input.getQuery())
					},
					_onBlurred: function () {
						this.input.hasQueryChangedSinceLastFocus() && this.eventBus.trigger("change", this.input.getQuery())
					},
					_onEnterKeyed: function (a, b) {
						var c;
						(c = this.menu.getActiveSelectable()) && this.select(c) && b.preventDefault()
					},
					_onTabKeyed: function (a, b) {
						var c;
						(c = this.menu.getActiveSelectable()) ? this.select(c) && b.preventDefault(): (c = this.menu.getTopSelectable()) && this.autocomplete(c) && b.preventDefault()
					},
					_onEscKeyed: function () {
						this.close()
					},
					_onUpKeyed: function () {
						this.moveCursor(-1)
					},
					_onDownKeyed: function () {
						this.moveCursor(1)
					},
					_onLeftKeyed: function () {
						"rtl" === this.dir && this.input.isCursorAtEnd() && this.autocomplete(this.menu.getTopSelectable())
					},
					_onRightKeyed: function () {
						"ltr" === this.dir && this.input.isCursorAtEnd() && this.autocomplete(this.menu.getTopSelectable())
					},
					_onQueryChanged: function (a, b) {
						this._minLengthMet(b) ? this.menu.update(b) : this.menu.empty()
					},
					_onWhitespaceChanged: function () {
						this._updateHint()
					},
					_onLangDirChanged: function (a, b) {
						this.dir !== b && (this.dir = b, this.menu.setLanguageDirection(b))
					},
					_openIfActive: function () {
						this.isActive() && this.open()
					},
					_minLengthMet: function (a) {
						return a = b.isString(a) ? a : this.input.getQuery() || "", a.length >= this.minLength
					},
					_updateHint: function () {
						var a, c, d, e, f, h, i;
						a = this.menu.getTopSelectable(), c = this.menu.getSelectableData(a), d = this.input.getInputValue(), !c || b.isBlankString(d) || this.input.hasOverflow() ? this.input.clearHint() : (e = g.normalizeQuery(d), f = b.escapeRegExChars(e), h = new RegExp("^(?:" + f + ")(.+$)", "i"), i = h.exec(c.val), i && this.input.setHint(d + i[1]))
					},
					isEnabled: function () {
						return this.enabled
					},
					enable: function () {
						this.enabled = !0
					},
					disable: function () {
						this.enabled = !1
					},
					isActive: function () {
						return this.active
					},
					activate: function () {
						return this.isActive() ? !0 : !this.isEnabled() || this.eventBus.before("active") ? !1 : (this.active = !0, this.eventBus.trigger("active"), !0)
					},
					deactivate: function () {
						return this.isActive() ? this.eventBus.before("idle") ? !1 : (this.active = !1, this.close(), this.eventBus.trigger("idle"), !0) : !0
					},
					isOpen: function () {
						return this.menu.isOpen()
					},
					open: function () {
						return this.isOpen() || this.eventBus.before("open") || (this.menu.open(), this._updateHint(), this.eventBus.trigger("open")), this.isOpen()
					},
					close: function () {
						return this.isOpen() && !this.eventBus.before("close") && (this.menu.close(), this.input.clearHint(), this.input.resetInputValue(), this.eventBus.trigger("close")), !this.isOpen()
					},
					setVal: function (a) {
						this.input.setQuery(b.toStr(a))
					},
					getVal: function () {
						return this.input.getQuery()
					},
					select: function (a) {
						var b = this.menu.getSelectableData(a);
						return b && !this.eventBus.before("select", b.obj) ? (this.input.setQuery(b.val, !0), this.eventBus.trigger("select", b.obj), this.close(), !0) : !1
					},
					autocomplete: function (a) {
						var b, c, d;
						return b = this.input.getQuery(), c = this.menu.getSelectableData(a), d = c && b !== c.val, d && !this.eventBus.before("autocomplete", c.obj) ? (this.input.setQuery(c.val), this.eventBus.trigger("autocomplete", c.obj), !0) : !1
					},
					moveCursor: function (a) {
						var b, c, d, e, f;
						return b = this.input.getQuery(), c = this.menu.selectableRelativeToCursor(a), d = this.menu.getSelectableData(c), e = d ? d.obj : null, f = this._minLengthMet() && this.menu.update(b), f || this.eventBus.before("cursorchange", e) ? !1 : (this.menu.setCursor(c), d ? this.input.setInputValue(d.val) : (this.input.resetInputValue(), this._updateHint()), this.eventBus.trigger("cursorchange", e), !0)
					},
					destroy: function () {
						this.input.destroy(), this.menu.destroy()
					}
				}), c
			}();
		! function () {
			"use strict";

			function e(b, c) {
				b.each(function () {
					var b, d = a(this);
					(b = d.data(p.typeahead)) && c(b, d)
				})
			}

			function f(a, b) {
				return a.clone().addClass(b.classes.hint).removeData().css(b.css.hint).css(l(a)).prop("readonly", !0).removeAttr("id name placeholder required").attr({
					autocomplete: "off",
					spellcheck: "false",
					tabindex: -1
				})
			}

			function h(a, b) {
				a.data(p.attrs, {
					dir: a.attr("dir"),
					autocomplete: a.attr("autocomplete"),
					spellcheck: a.attr("spellcheck"),
					style: a.attr("style")
				}), a.addClass(b.classes.input).attr({
					autocomplete: "off",
					spellcheck: !1
				});
				try {
					!a.attr("dir") && a.attr("dir", "auto")
				} catch (c) {}
				return a
			}

			function l(a) {
				return {
					backgroundAttachment: a.css("background-attachment"),
					backgroundClip: a.css("background-clip"),
					backgroundColor: a.css("background-color"),
					backgroundImage: a.css("background-image"),
					backgroundOrigin: a.css("background-origin"),
					backgroundPosition: a.css("background-position"),
					backgroundRepeat: a.css("background-repeat"),
					backgroundSize: a.css("background-size")
				}
			}

			function m(a) {
				var c, d;
				c = a.data(p.www), d = a.parent().filter(c.selectors.wrapper), b.each(a.data(p.attrs), function (c, d) {
					b.isUndefined(c) ? a.removeAttr(d) : a.attr(d, c)
				}), a.removeData(p.typeahead).removeData(p.www).removeData(p.attr).removeClass(c.classes.input), d.length && (a.detach().insertAfter(d), d.remove())
			}

			function n(c) {
				var d, e;
				return d = b.isJQuery(c) || b.isElement(c), e = d ? a(c).first() : [], e.length ? e : null
			}
			var o, p, q;
			o = a.fn.typeahead, p = {
				www: "tt-www",
				attrs: "tt-attrs",
				typeahead: "tt-typeahead"
			}, q = {
				initialize: function (e, l) {
					function m() {
						var c, m, q, r, s, t, u, v, w, x, y;
						b.each(l, function (a) {
							a.highlight = !!e.highlight
						}), c = a(this), m = a(o.html.wrapper), q = n(e.hint), r = n(e.menu), s = e.hint !== !1 && !q, t = e.menu !== !1 && !r, s && (q = f(c, o)), t && (r = a(o.html.menu).css(o.css.menu)), q && q.val(""), c = h(c, o), (s || t) && (m.css(o.css.wrapper), c.css(s ? o.css.input : o.css.inputWithNoHint), c.wrap(m).parent().prepend(s ? q : null).append(t ? r : null)), y = t ? j : i, u = new d({
							el: c
						}), v = new g({
							hint: q,
							input: c
						}, o), w = new y({
							node: r,
							datasets: l
						}, o), x = new k({
							input: v,
							menu: w,
							eventBus: u,
							minLength: e.minLength
						}, o), c.data(p.www, o), c.data(p.typeahead, x)
					}
					var o;
					return l = b.isArray(l) ? l : [].slice.call(arguments, 1), e = e || {}, o = c(e.classNames), this.each(m)
				},
				isEnabled: function () {
					var a;
					return e(this.first(), function (b) {
						a = b.isEnabled()
					}), a
				},
				enable: function () {
					return e(this, function (a) {
						a.enable()
					}), this
				},
				disable: function () {
					return e(this, function (a) {
						a.disable()
					}), this
				},
				isActive: function () {
					var a;
					return e(this.first(), function (b) {
						a = b.isActive()
					}), a
				},
				activate: function () {
					return e(this, function (a) {
						a.activate()
					}), this
				},
				deactivate: function () {
					return e(this, function (a) {
						a.deactivate()
					}), this
				},
				isOpen: function () {
					var a;
					return e(this.first(), function (b) {
						a = b.isOpen()
					}), a
				},
				open: function () {
					return e(this, function (a) {
						a.open()
					}), this
				},
				close: function () {
					return e(this, function (a) {
						a.close()
					}), this
				},
				select: function (b) {
					var c = !1,
						d = a(b);
					return e(this.first(), function (a) {
						c = a.select(d)
					}), c
				},
				autocomplete: function (b) {
					var c = !1,
						d = a(b);
					return e(this.first(), function (a) {
						c = a.autocomplete(d)
					}), c
				},
				moveCursor: function (a) {
					var b = !1;
					return e(this.first(), function (c) {
						b = c.moveCursor(a)
					}), b
				},
				val: function (a) {
					var b;
					return arguments.length ? (e(this, function (b) {
						b.setVal(a)
					}), this) : (e(this.first(), function (a) {
						b = a.getVal()
					}), b)
				},
				destroy: function () {
					return e(this, function (a, b) {
						m(b), a.destroy()
					}), this
				}
			}, a.fn.typeahead = function (a) {
				return q[a] ? q[a].apply(this, [].slice.call(arguments, 1)) : q.initialize.apply(this, arguments)
			}, a.fn.typeahead.noConflict = function () {
				return a.fn.typeahead = o, this
			}
		}()
	}),
	function (a) {
		"use strict";

		function b(b) {
			var c = b.data;
			b.isDefaultPrevented() || (b.preventDefault(), a(b.target).ajaxSubmit(c))
		}

		function c(b) {
			var c = b.target,
				d = a(c);
			if (!d.is("[type=submit],[type=image]")) {
				var e = d.closest("[type=submit]");
				if (0 === e.length) return;
				c = e[0]
			}
			var f = this;
			if (f.clk = c, "image" == c.type)
				if (void 0 !== b.offsetX) f.clk_x = b.offsetX, f.clk_y = b.offsetY;
				else if ("function" == typeof a.fn.offset) {
				var g = d.offset();
				f.clk_x = b.pageX - g.left, f.clk_y = b.pageY - g.top
			} else f.clk_x = b.pageX - c.offsetLeft, f.clk_y = b.pageY - c.offsetTop;
			setTimeout(function () {
				f.clk = f.clk_x = f.clk_y = null
			}, 100)
		}

		function d() {
			if (a.fn.ajaxSubmit.debug) {
				var b = "[jquery.form] " + Array.prototype.join.call(arguments, "");
				window.console && window.console.log ? window.console.log(b) : window.opera && window.opera.postError && window.opera.postError(b)
			}
		}
		var e = {};
		e.fileapi = void 0 !== a("<input type='file'/>").get(0).files, e.formdata = void 0 !== window.FormData;
		var f = !!a.fn.prop;
		a.fn.attr2 = function () {
			if (!f) return this.attr.apply(this, arguments);
			var a = this.prop.apply(this, arguments);
			return a && a.jquery || "string" == typeof a ? a : this.attr.apply(this, arguments)
		}, a.fn.ajaxSubmit = function (b) {
			function c(c) {
				var d, e, f = a.param(c, b.traditional).split("&"),
					g = f.length,
					h = [];
				for (d = 0; g > d; d++) f[d] = f[d].replace(/\+/g, " "), e = f[d].split("="), h.push([decodeURIComponent(e[0]), decodeURIComponent(e[1])]);
				return h
			}

			function g(d) {
				for (var e = new FormData, f = 0; d.length > f; f++) e.append(d[f].name, d[f].value);
				if (b.extraData) {
					var g = c(b.extraData);
					for (f = 0; g.length > f; f++) g[f] && e.append(g[f][0], g[f][1])
				}
				b.data = null;
				var h = a.extend(!0, {}, a.ajaxSettings, b, {
					contentType: !1,
					processData: !1,
					cache: !1,
					type: i || "POST"
				});
				b.uploadProgress && (h.xhr = function () {
					var c = a.ajaxSettings.xhr();
					return c.upload && c.upload.addEventListener("progress", function (a) {
						var c = 0,
							d = a.loaded || a.position,
							e = a.total;
						a.lengthComputable && (c = Math.ceil(100 * (d / e))), b.uploadProgress(a, d, e, c)
					}, !1), c
				}), h.data = null;
				var j = h.beforeSend;
				return h.beforeSend = function (a, b) {
					b.data = e, j && j.call(this, a, b)
				}, a.ajax(h)
			}

			function h(c) {
				function e(a) {
					var b = null;
					try {
						a.contentWindow && (b = a.contentWindow.document)
					} catch (c) {
						d("cannot get iframe.contentWindow document: " + c)
					}
					if (b) return b;
					try {
						b = a.contentDocument ? a.contentDocument : a.document
					} catch (c) {
						d("cannot get iframe.contentDocument: " + c), b = a.document
					}
					return b
				}

				function g() {
					function b() {
						try {
							var a = e(r).readyState;
							d("state = " + a), a && "uninitialized" == a.toLowerCase() && setTimeout(b, 50)
						} catch (c) {
							d("Server abort: ", c, " (", c.name, ")"), h(A), w && clearTimeout(w), w = void 0
						}
					}
					var c = l.attr2("target"),
						f = l.attr2("action");
					x.setAttribute("target", o), (!i || /post/i.test(i)) && x.setAttribute("method", "POST"), f != m.url && x.setAttribute("action", m.url), m.skipEncodingOverride || i && !/post/i.test(i) || l.attr({
						encoding: "multipart/form-data",
						enctype: "multipart/form-data"
					}), m.timeout && (w = setTimeout(function () {
						v = !0, h(z)
					}, m.timeout));
					var g = [];
					try {
						if (m.extraData)
							for (var j in m.extraData) m.extraData.hasOwnProperty(j) && g.push(a.isPlainObject(m.extraData[j]) && m.extraData[j].hasOwnProperty("name") && m.extraData[j].hasOwnProperty("value") ? a('<input type="hidden" name="' + m.extraData[j].name + '">').val(m.extraData[j].value).appendTo(x)[0] : a('<input type="hidden" name="' + j + '">').val(m.extraData[j]).appendTo(x)[0]);
						m.iframeTarget || q.appendTo("body"), r.attachEvent ? r.attachEvent("onload", h) : r.addEventListener("load", h, !1), setTimeout(b, 15);
						try {
							x.submit()
						} catch (k) {
							var n = document.createElement("form").submit;
							n.apply(x)
						}
					} finally {
						x.setAttribute("action", f), c ? x.setAttribute("target", c) : l.removeAttr("target"), a(g).remove()
					}
				}

				function h(b) {
					if (!s.aborted && !F) {
						if (E = e(r), E || (d("cannot access response document"), b = A), b === z && s) return s.abort("timeout"), void y.reject(s, "timeout");
						if (b == A && s) return s.abort("server abort"), void y.reject(s, "error", "server abort");
						if (E && E.location.href != m.iframeSrc || v) {
							r.detachEvent ? r.detachEvent("onload", h) : r.removeEventListener("load", h, !1);
							var c, f = "success";
							try {
								if (v) throw "timeout";
								var g = "xml" == m.dataType || E.XMLDocument || a.isXMLDoc(E);
								if (d("isXml=" + g), !g && window.opera && (null === E.body || !E.body.innerHTML) && --G) return d("requeing onLoad callback, DOM not available"), void setTimeout(h, 250);
								var i = E.body ? E.body : E.documentElement;
								s.responseText = i ? i.innerHTML : null, s.responseXML = E.XMLDocument ? E.XMLDocument : E, g && (m.dataType = "xml"), s.getResponseHeader = function (a) {
									var b = {
										"content-type": m.dataType
									};
									return b[a.toLowerCase()]
								}, i && (s.status = Number(i.getAttribute("status")) || s.status, s.statusText = i.getAttribute("statusText") || s.statusText);
								var j = (m.dataType || "").toLowerCase(),
									k = /(json|script|text)/.test(j);
								if (k || m.textarea) {
									var l = E.getElementsByTagName("textarea")[0];
									if (l) s.responseText = l.value, s.status = Number(l.getAttribute("status")) || s.status, s.statusText = l.getAttribute("statusText") || s.statusText;
									else if (k) {
										var o = E.getElementsByTagName("pre")[0],
											p = E.getElementsByTagName("body")[0];
										o ? s.responseText = o.textContent ? o.textContent : o.innerText : p && (s.responseText = p.textContent ? p.textContent : p.innerText)
									}
								} else "xml" == j && !s.responseXML && s.responseText && (s.responseXML = H(s.responseText));
								try {
									D = J(s, j, m)
								} catch (t) {
									f = "parsererror", s.error = c = t || f
								}
							} catch (t) {
								d("error caught: ", t), f = "error", s.error = c = t || f
							}
							s.aborted && (d("upload aborted"), f = null), s.status && (f = s.status >= 200 && 300 > s.status || 304 === s.status ? "success" : "error"), "success" === f ? (m.success && m.success.call(m.context, D, "success", s), y.resolve(s.responseText, "success", s), n && a.event.trigger("ajaxSuccess", [s, m])) : f && (void 0 === c && (c = s.statusText), m.error && m.error.call(m.context, s, f, c), y.reject(s, "error", c), n && a.event.trigger("ajaxError", [s, m, c])), n && a.event.trigger("ajaxComplete", [s, m]), n && !--a.active && a.event.trigger("ajaxStop"), m.complete && m.complete.call(m.context, s, f), F = !0, m.timeout && clearTimeout(w), setTimeout(function () {
								m.iframeTarget ? q.attr("src", m.iframeSrc) : q.remove(), s.responseXML = null
							}, 100)
						}
					}
				}
				var j, k, m, n, o, q, r, s, t, u, v, w, x = l[0],
					y = a.Deferred();
				if (y.abort = function (a) {
						s.abort(a)
					}, c)
					for (k = 0; p.length > k; k++) j = a(p[k]), f ? j.prop("disabled", !1) : j.removeAttr("disabled");
				if (m = a.extend(!0, {}, a.ajaxSettings, b), m.context = m.context || m, o = "jqFormIO" + (new Date).getTime(), m.iframeTarget ? (q = a(m.iframeTarget), u = q.attr2("name"), u ? o = u : q.attr2("name", o)) : (q = a('<iframe name="' + o + '" src="' + m.iframeSrc + '" />'), q.css({
						position: "absolute",
						top: "-1000px",
						left: "-1000px"
					})), r = q[0], s = {
						aborted: 0,
						responseText: null,
						responseXML: null,
						status: 0,
						statusText: "n/a",
						getAllResponseHeaders: function () {},
						getResponseHeader: function () {},
						setRequestHeader: function () {},
						abort: function (b) {
							var c = "timeout" === b ? "timeout" : "aborted";
							d("aborting upload... " + c), this.aborted = 1;
							try {
								r.contentWindow.document.execCommand && r.contentWindow.document.execCommand("Stop")
							} catch (e) {}
							q.attr("src", m.iframeSrc), s.error = c, m.error && m.error.call(m.context, s, c, b), n && a.event.trigger("ajaxError", [s, m, c]), m.complete && m.complete.call(m.context, s, c)
						}
					}, n = m.global, n && 0 === a.active++ && a.event.trigger("ajaxStart"), n && a.event.trigger("ajaxSend", [s, m]), m.beforeSend && m.beforeSend.call(m.context, s, m) === !1) return m.global && a.active--, y.reject(), y;
				if (s.aborted) return y.reject(), y;
				t = x.clk, t && (u = t.name, u && !t.disabled && (m.extraData = m.extraData || {}, m.extraData[u] = t.value, "image" == t.type && (m.extraData[u + ".x"] = x.clk_x, m.extraData[u + ".y"] = x.clk_y)));
				var z = 1,
					A = 2,
					B = a("meta[name=csrf-token]").attr("content"),
					C = a("meta[name=csrf-param]").attr("content");
				C && B && (m.extraData = m.extraData || {}, m.extraData[C] = B), m.forceSync ? g() : setTimeout(g, 10);
				var D, E, F, G = 50,
					H = a.parseXML || function (a, b) {
						return window.ActiveXObject ? (b = new ActiveXObject("Microsoft.XMLDOM"), b.async = "false", b.loadXML(a)) : b = (new DOMParser).parseFromString(a, "text/xml"), b && b.documentElement && "parsererror" != b.documentElement.nodeName ? b : null
					},
					I = a.parseJSON || function (a) {
						return window.eval("(" + a + ")")
					},
					J = function (b, c, d) {
						var e = b.getResponseHeader("content-type") || "",
							f = "xml" === c || !c && e.indexOf("xml") >= 0,
							g = f ? b.responseXML : b.responseText;
						return f && "parsererror" === g.documentElement.nodeName && a.error && a.error("parsererror"), d && d.dataFilter && (g = d.dataFilter(g, c)), "string" == typeof g && ("json" === c || !c && e.indexOf("json") >= 0 ? g = I(g) : ("script" === c || !c && e.indexOf("javascript") >= 0) && a.globalEval(g)), g
					};
				return y
			}
			if (!this.length) return d("ajaxSubmit: skipping submit process - no element selected"), this;
			var i, j, k, l = this;
			"function" == typeof b ? b = {
				success: b
			} : void 0 === b && (b = {}), i = b.type || this.attr2("method"), j = b.url || this.attr2("action"), k = "string" == typeof j ? a.trim(j) : "", k = k || window.location.href || "", k && (k = (k.match(/^([^#]+)/) || [])[1]), b = a.extend(!0, {
				url: k,
				success: a.ajaxSettings.success,
				type: i || a.ajaxSettings.type,
				iframeSrc: /^https/i.test(window.location.href || "") ? "javascript:false" : "about:blank"
			}, b);
			var m = {};
			if (this.trigger("form-pre-serialize", [this, b, m]), m.veto) return d("ajaxSubmit: submit vetoed via form-pre-serialize trigger"), this;
			if (b.beforeSerialize && b.beforeSerialize(this, b) === !1) return d("ajaxSubmit: submit aborted via beforeSerialize callback"), this;
			var n = b.traditional;
			void 0 === n && (n = a.ajaxSettings.traditional);
			var o, p = [],
				q = this.formToArray(b.semantic, p);
			if (b.data && (b.extraData = b.data, o = a.param(b.data, n)), b.beforeSubmit && b.beforeSubmit(q, this, b) === !1) return d("ajaxSubmit: submit aborted via beforeSubmit callback"), this;
			if (this.trigger("form-submit-validate", [q, this, b, m]), m.veto) return d("ajaxSubmit: submit vetoed via form-submit-validate trigger"), this;
			var r = a.param(q, n);
			o && (r = r ? r + "&" + o : o), "GET" == b.type.toUpperCase() ? (b.url += (b.url.indexOf("?") >= 0 ? "&" : "?") + r, b.data = null) : b.data = r;
			var s = [];
			if (b.resetForm && s.push(function () {
					l.resetForm()
				}), b.clearForm && s.push(function () {
					l.clearForm(b.includeHidden)
				}), !b.dataType && b.target) {
				var t = b.success || function () {};
				s.push(function (c) {
					var d = b.replaceTarget ? "replaceWith" : "html";
					a(b.target)[d](c).each(t, arguments)
				})
			} else b.success && s.push(b.success);
			if (b.success = function (a, c, d) {
					for (var e = b.context || this, f = 0, g = s.length; g > f; f++) s[f].apply(e, [a, c, d || l, l])
				}, b.error) {
				var u = b.error;
				b.error = function (a, c, d) {
					var e = b.context || this;
					u.apply(e, [a, c, d, l])
				}
			}
			if (b.complete) {
				var v = b.complete;
				b.complete = function (a, c) {
					var d = b.context || this;
					v.apply(d, [a, c, l])
				}
			}
			var w = a("input[type=file]:enabled", this).filter(function () {
					return "" !== a(this).val()
				}),
				x = w.length > 0,
				y = "multipart/form-data",
				z = l.attr("enctype") == y || l.attr("encoding") == y,
				A = e.fileapi && e.formdata;
			d("fileAPI :" + A);
			var B, C = (x || z) && !A;
			b.iframe !== !1 && (b.iframe || C) ? b.closeKeepAlive ? a.get(b.closeKeepAlive, function () {
				B = h(q)
			}) : B = h(q) : B = (x || z) && A ? g(q) : a.ajax(b), l.removeData("jqxhr").data("jqxhr", B);
			for (var D = 0; p.length > D; D++) p[D] = null;
			return this.trigger("form-submit-notify", [this, b]), this
		}, a.fn.ajaxForm = function (e) {
			if (e = e || {}, e.delegation = e.delegation && a.isFunction(a.fn.on), !e.delegation && 0 === this.length) {
				var f = {
					s: this.selector,
					c: this.context
				};
				return !a.isReady && f.s ? (d("DOM not ready, queuing ajaxForm"), a(function () {
					a(f.s, f.c).ajaxForm(e)
				}), this) : (d("terminating; zero elements found by selector" + (a.isReady ? "" : " (DOM not ready)")), this)
			}
			return e.delegation ? (a(document).off("submit.form-plugin", this.selector, b).off("click.form-plugin", this.selector, c).on("submit.form-plugin", this.selector, e, b).on("click.form-plugin", this.selector, e, c), this) : this.ajaxFormUnbind().bind("submit.form-plugin", e, b).bind("click.form-plugin", e, c)
		}, a.fn.ajaxFormUnbind = function () {
			return this.unbind("submit.form-plugin click.form-plugin")
		}, a.fn.formToArray = function (b, c) {
			var d = [];
			if (0 === this.length) return d;
			var f = this[0],
				g = b ? f.getElementsByTagName("*") : f.elements;
			if (!g) return d;
			var h, i, j, k, l, m, n;
			for (h = 0, m = g.length; m > h; h++)
				if (l = g[h], j = l.name, j && !l.disabled)
					if (b && f.clk && "image" == l.type) f.clk == l && (d.push({
						name: j,
						value: a(l).val(),
						type: l.type
					}), d.push({
						name: j + ".x",
						value: f.clk_x
					}, {
						name: j + ".y",
						value: f.clk_y
					}));
					else if (k = a.fieldValue(l, !0), k && k.constructor == Array)
				for (c && c.push(l), i = 0, n = k.length; n > i; i++) d.push({
					name: j,
					value: k[i]
				});
			else if (e.fileapi && "file" == l.type) {
				c && c.push(l);
				var o = l.files;
				if (o.length)
					for (i = 0; o.length > i; i++) d.push({
						name: j,
						value: o[i],
						type: l.type
					});
				else d.push({
					name: j,
					value: "",
					type: l.type
				})
			} else null !== k && void 0 !== k && (c && c.push(l), d.push({
				name: j,
				value: k,
				type: l.type,
				required: l.required
			}));
			if (!b && f.clk) {
				var p = a(f.clk),
					q = p[0];
				j = q.name, j && !q.disabled && "image" == q.type && (d.push({
					name: j,
					value: p.val()
				}), d.push({
					name: j + ".x",
					value: f.clk_x
				}, {
					name: j + ".y",
					value: f.clk_y
				}))
			}
			return d
		}, a.fn.formSerialize = function (b) {
			return a.param(this.formToArray(b))
		}, a.fn.fieldSerialize = function (b) {
			var c = [];
			return this.each(function () {
				var d = this.name;
				if (d) {
					var e = a.fieldValue(this, b);
					if (e && e.constructor == Array)
						for (var f = 0, g = e.length; g > f; f++) c.push({
							name: d,
							value: e[f]
						});
					else null !== e && void 0 !== e && c.push({
						name: this.name,
						value: e
					})
				}
			}), a.param(c)
		}, a.fn.fieldValue = function (b) {
			for (var c = [], d = 0, e = this.length; e > d; d++) {
				var f = this[d],
					g = a.fieldValue(f, b);
				null === g || void 0 === g || g.constructor == Array && !g.length || (g.constructor == Array ? a.merge(c, g) : c.push(g))
			}
			return c
		}, a.fieldValue = function (b, c) {
			var d = b.name,
				e = b.type,
				f = b.tagName.toLowerCase();
			if (void 0 === c && (c = !0), c && (!d || b.disabled || "reset" == e || "button" == e || ("checkbox" == e || "radio" == e) && !b.checked || ("submit" == e || "image" == e) && b.form && b.form.clk != b || "select" == f && -1 == b.selectedIndex)) return null;
			if ("select" == f) {
				var g = b.selectedIndex;
				if (0 > g) return null;
				for (var h = [], i = b.options, j = "select-one" == e, k = j ? g + 1 : i.length, l = j ? g : 0; k > l; l++) {
					var m = i[l];
					if (m.selected) {
						var n = m.value;
						if (n || (n = m.attributes && m.attributes.value && !m.attributes.value.specified ? m.text : m.value), j) return n;
						h.push(n)
					}
				}
				return h
			}
			return a(b).val()
		}, a.fn.clearForm = function (b) {
			return this.each(function () {
				a("input,select,textarea", this).clearFields(b)
			})
		}, a.fn.clearFields = a.fn.clearInputs = function (b) {
			var c = /^(?:color|date|datetime|email|month|number|password|range|search|tel|text|time|url|week)$/i;
			return this.each(function () {
				var d = this.type,
					e = this.tagName.toLowerCase();
				c.test(d) || "textarea" == e ? this.value = "" : "checkbox" == d || "radio" == d ? this.checked = !1 : "select" == e ? this.selectedIndex = -1 : "file" == d ? /MSIE/.test(navigator.userAgent) ? a(this).replaceWith(a(this).clone(!0)) : a(this).val("") : b && (b === !0 && /hidden/.test(d) || "string" == typeof b && a(this).is(b)) && (this.value = "")
			})
		}, a.fn.resetForm = function () {
			return this.each(function () {
				("function" == typeof this.reset || "object" == typeof this.reset && !this.reset.nodeType) && this.reset()
			})
		}, a.fn.enable = function (a) {
			return void 0 === a && (a = !0), this.each(function () {
				this.disabled = !a
			})
		}, a.fn.selected = function (b) {
			return void 0 === b && (b = !0), this.each(function () {
				var c = this.type;
				if ("checkbox" == c || "radio" == c) this.checked = b;
				else if ("option" == this.tagName.toLowerCase()) {
					var d = a(this).parent("select");
					b && d[0] && "select-one" == d[0].type && d.find("option").selected(!1), this.selected = b
				}
			})
		}, a.fn.ajaxSubmit.debug = !1
	}("undefined" != typeof jQuery ? jQuery : window.Zepto), ! function (a, b) {
		var c = b(a, a.document);
		a.lazySizes = c, "object" == typeof module && module.exports && (module.exports = c)
	}(window, function (a, b) {
		"use strict";
		if (b.getElementsByClassName) {
			var c, d, e = b.documentElement,
				f = a.Date,
				g = a.HTMLPictureElement,
				h = "addEventListener",
				i = "getAttribute",
				j = a[h],
				k = a.setTimeout,
				l = a.requestAnimationFrame || k,
				m = a.requestIdleCallback,
				n = /^picture$/i,
				o = ["load", "error", "lazyincluded", "_lazyloaded"],
				p = {},
				q = Array.prototype.forEach,
				r = function (a, b) {
					return p[b] || (p[b] = new RegExp("(\\s|^)" + b + "(\\s|$)")), p[b].test(a[i]("class") || "") && p[b]
				},
				s = function (a, b) {
					r(a, b) || a.setAttribute("class", (a[i]("class") || "").trim() + " " + b)
				},
				t = function (a, b) {
					var c;
					(c = r(a, b)) && a.setAttribute("class", (a[i]("class") || "").replace(c, " "))
				},
				u = function (a, b, c) {
					var d = c ? h : "removeEventListener";
					c && u(a, b), o.forEach(function (c) {
						a[d](c, b)
					})
				},
				v = function (a, d, e, f, g) {
					var h = b.createEvent("CustomEvent");
					return e || (e = {}), e.instance = c, h.initCustomEvent(d, !f, !g, e), a.dispatchEvent(h), h
				},
				w = function (b, c) {
					var e;
					!g && (e = a.picturefill || d.pf) ? e({
						reevaluate: !0,
						elements: [b]
					}) : c && c.src && (b.src = c.src)
				},
				x = function (a, b) {
					return (getComputedStyle(a, null) || {})[b]
				},
				y = function (a, b, c) {
					for (c = c || a.offsetWidth; c < d.minSize && b && !a._lazysizesWidth;) c = b.offsetWidth, b = b.parentNode;
					return c
				},
				z = function () {
					var a, c, d = [],
						e = [],
						f = d,
						g = function () {
							var b = f;
							for (f = d.length ? e : d, a = !0, c = !1; b.length;) b.shift()();
							a = !1
						},
						h = function (d, e) {
							a && !e ? d.apply(this, arguments) : (f.push(d), c || (c = !0, (b.hidden ? k : l)(g)))
						};
					return h._lsFlush = g, h
				}(),
				A = function (a, b) {
					return b ? function () {
						z(a)
					} : function () {
						var b = this,
							c = arguments;
						z(function () {
							a.apply(b, c)
						})
					}
				},
				B = function (a) {
					var b, c = 0,
						d = 125,
						e = 666,
						g = e,
						h = function () {
							b = !1, c = f.now(), a()
						},
						i = m ? function () {
							m(h, {
								timeout: g
							}), g !== e && (g = e)
						} : A(function () {
							k(h)
						}, !0);
					return function (a) {
						var e;
						(a = a === !0) && (g = 44), b || (b = !0, e = d - (f.now() - c), 0 > e && (e = 0), a || 9 > e && m ? i() : k(i, e))
					}
				},
				C = function (a) {
					var b, c, d = 99,
						e = function () {
							b = null, a()
						},
						g = function () {
							var a = f.now() - c;
							d > a ? k(g, d - a) : (m || e)(e)
						};
					return function () {
						c = f.now(), b || (b = k(g, d))
					}
				},
				D = function () {
					var c, g, l, m, o, p, y, D, F, G, H, I, J, K, L, M = /^img$/i,
						N = /^iframe$/i,
						O = "onscroll" in a && !/glebot/.test(navigator.userAgent),
						P = 0,
						Q = 0,
						R = 0,
						S = -1,
						T = function (a) {
							R--, a && a.target && u(a.target, T), (!a || 0 > R || !a.target) && (R = 0)
						},
						U = function (a, c) {
							var d, f = a,
								g = "hidden" == x(b.body, "visibility") || "hidden" != x(a, "visibility");
							for (F -= c, I += c, G -= c, H += c; g && (f = f.offsetParent) && f != b.body && f != e;) g = (x(f, "opacity") || 1) > 0, g && "visible" != x(f, "overflow") && (d = f.getBoundingClientRect(), g = H > d.left && G < d.right && I > d.top - 1 && F < d.bottom + 1);
							return g
						},
						V = function () {
							var a, f, h, j, k, m, n, p, q;
							if ((o = d.loadMode) && 8 > R && (a = c.length)) {
								f = 0, S++, null == K && ("expand" in d || (d.expand = e.clientHeight > 500 && e.clientWidth > 500 ? 500 : 370), J = d.expand, K = J * d.expFactor), K > Q && 1 > R && S > 2 && o > 2 && !b.hidden ? (Q = K, S = 0) : Q = o > 1 && S > 1 && 6 > R ? J : P;
								for (; a > f; f++)
									if (c[f] && !c[f]._lazyRace)
										if (O)
											if ((p = c[f][i]("data-expand")) && (m = 1 * p) || (m = Q), q !== m && (y = innerWidth + m * L, D = innerHeight + m, n = -1 * m, q = m), h = c[f].getBoundingClientRect(), (I = h.bottom) >= n && (F = h.top) <= D && (H = h.right) >= n * L && (G = h.left) <= y && (I || H || G || F) && (d.loadHidden || "hidden" != x(c[f], "visibility")) && (l && 3 > R && !p && (3 > o || 4 > S) || U(c[f], m))) {
												if (bb(c[f]), k = !0, R > 9) break
											} else !k && l && !j && 4 > R && 4 > S && o > 2 && (g[0] || d.preloadAfterLoad) && (g[0] || !p && (I || H || G || F || "auto" != c[f][i](d.sizesAttr))) && (j = g[0] || c[f]);
								else bb(c[f]);
								j && !k && bb(j)
							}
						},
						W = B(V),
						X = function (a) {
							s(a.target, d.loadedClass), t(a.target, d.loadingClass), u(a.target, Z)
						},
						Y = A(X),
						Z = function (a) {
							Y({
								target: a.target
							})
						},
						$ = function (a, b) {
							try {
								a.contentWindow.location.replace(b)
							} catch (c) {
								a.src = b
							}
						},
						_ = function (a) {
							var b, c = a[i](d.srcsetAttr);
							(b = d.customMedia[a[i]("data-media") || a[i]("media")]) && a.setAttribute("media", b), c && a.setAttribute("srcset", c)
						},
						ab = A(function (a, b, c, e, f) {
							var g, h, j, l, o, p;
							(o = v(a, "lazybeforeunveil", b)).defaultPrevented || (e && (c ? s(a, d.autosizesClass) : a.setAttribute("sizes", e)), h = a[i](d.srcsetAttr), g = a[i](d.srcAttr), f && (j = a.parentNode, l = j && n.test(j.nodeName || "")), p = b.firesLoad || "src" in a && (h || g || l), o = {
								target: a
							}, p && (u(a, T, !0), clearTimeout(m), m = k(T, 2500), s(a, d.loadingClass), u(a, Z, !0)), l && q.call(j.getElementsByTagName("source"), _), h ? a.setAttribute("srcset", h) : g && !l && (N.test(a.nodeName) ? $(a, g) : a.src = g), f && (h || l) && w(a, {
								src: g
							})), a._lazyRace && delete a._lazyRace, t(a, d.lazyClass), z(function () {
								(!p || a.complete && a.naturalWidth > 1) && (p ? T(o) : R--, X(o))
							}, !0)
						}),
						bb = function (a) {
							var b, c = M.test(a.nodeName),
								e = c && (a[i](d.sizesAttr) || a[i]("sizes")),
								f = "auto" == e;
							(!f && l || !c || !a.src && !a.srcset || a.complete || r(a, d.errorClass)) && (b = v(a, "lazyunveilread").detail, f && E.updateElem(a, !0, a.offsetWidth), a._lazyRace = !0, R++, ab(a, b, f, e, c))
						},
						cb = function () {
							if (!l) {
								if (f.now() - p < 999) return void k(cb, 999);
								var a = C(function () {
									d.loadMode = 3, W()
								});
								l = !0, d.loadMode = 3, W(), j("scroll", function () {
									3 == d.loadMode && (d.loadMode = 2), a()
								}, !0)
							}
						};
					return {
						_: function () {
							p = f.now(), c = b.getElementsByClassName(d.lazyClass), g = b.getElementsByClassName(d.lazyClass + " " + d.preloadClass), L = d.hFac, j("scroll", W, !0), j("resize", W, !0), a.MutationObserver ? new MutationObserver(W).observe(e, {
								childList: !0,
								subtree: !0,
								attributes: !0
							}) : (e[h]("DOMNodeInserted", W, !0), e[h]("DOMAttrModified", W, !0), setInterval(W, 999)), j("hashchange", W, !0), ["focus", "mouseover", "click", "load", "transitionend", "animationend", "webkitAnimationEnd"].forEach(function (a) {
								b[h](a, W, !0)
							}), /d$|^c/.test(b.readyState) ? cb() : (j("load", cb), b[h]("DOMContentLoaded", W), k(cb, 2e4)), c.length ? (V(), z._lsFlush()) : W()
						},
						checkElems: W,
						unveil: bb
					}
				}(),
				E = function () {
					var a, c = A(function (a, b, c, d) {
							var e, f, g;
							if (a._lazysizesWidth = d, d += "px", a.setAttribute("sizes", d), n.test(b.nodeName || ""))
								for (e = b.getElementsByTagName("source"), f = 0, g = e.length; g > f; f++) e[f].setAttribute("sizes", d);
							c.detail.dataAttr || w(a, c.detail)
						}),
						e = function (a, b, d) {
							var e, f = a.parentNode;
							f && (d = y(a, f, d), e = v(a, "lazybeforesizes", {
								width: d,
								dataAttr: !!b
							}), e.defaultPrevented || (d = e.detail.width, d && d !== a._lazysizesWidth && c(a, f, e, d)))
						},
						f = function () {
							var b, c = a.length;
							if (c)
								for (b = 0; c > b; b++) e(a[b])
						},
						g = C(f);
					return {
						_: function () {
							a = b.getElementsByClassName(d.autosizesClass), j("resize", g)
						},
						checkElems: g,
						updateElem: e
					}
				}(),
				F = function () {
					F.i || (F.i = !0, E._(), D._())
				};
			return function () {
				var b, c = {
					lazyClass: "lazyload",
					loadedClass: "lazyloaded",
					loadingClass: "lazyloading",
					preloadClass: "lazypreload",
					errorClass: "lazyerror",
					autosizesClass: "lazyautosizes",
					srcAttr: "data-src",
					srcsetAttr: "data-srcset",
					sizesAttr: "data-sizes",
					minSize: 40,
					customMedia: {},
					init: !0,
					expFactor: 1.5,
					hFac: .8,
					loadMode: 2,
					loadHidden: !0
				};
				d = a.lazySizesConfig || a.lazysizesConfig || {};
				for (b in c) b in d || (d[b] = c[b]);
				a.lazySizesConfig = d, k(function () {
					d.init && F()
				})
			}(), c = {
				cfg: d,
				autoSizer: E,
				loader: D,
				init: F,
				uP: w,
				aC: s,
				rC: t,
				hC: r,
				fire: v,
				gW: y,
				rAF: z
			}
		}
	}), ! function (a, b) {
		var c = function () {
			b(a.lazySizes), a.removeEventListener("lazyunveilread", c, !0)
		};
		b = b.bind(null, a, a.document), "object" == typeof module && module.exports ? b(require("lazysizes")) : a.lazySizes ? c() : a.addEventListener("lazyunveilread", c, !0)
	}(window, function (a, b, c) {
		"use strict";

		function d(a, c) {
			if (!g[a]) {
				var d = b.createElement(c ? "link" : "script"),
					e = b.getElementsByTagName("script")[0];
				c ? (d.rel = "stylesheet", d.href = a) : d.src = a, g[a] = !0, g[d.src || d.href] = !0, e.parentNode.insertBefore(d, e)
			}
		}
		var e, f, g = {};
		b.addEventListener && (f = /\(|\)|\s|'/, e = function (a, c) {
			var d = b.createElement("img");
			d.onload = function () {
				d.onload = null, d.onerror = null, d = null, c()
			}, d.onerror = d.onload, d.src = a, d && d.complete && d.onload && d.onload()
		}, addEventListener("lazybeforeunveil", function (a) {
			if (a.detail.instance == c) {
				var b, g, h, i;
				a.defaultPrevented || ("none" == a.target.preload && (a.target.preload = "auto"), b = a.target.getAttribute("data-link"), b && d(b, !0), b = a.target.getAttribute("data-script"), b && d(b), b = a.target.getAttribute("data-require"), b && (c.cfg.requireJs ? c.cfg.requireJs([b]) : d(b)), h = a.target.getAttribute("data-bg"), h && (a.detail.firesLoad = !0, g = function () {
					a.target.style.backgroundImage = "url(" + (f.test(h) ? JSON.stringify(h) : h) + ")", a.detail.firesLoad = !1, c.fire(a.target, "_lazyloaded", {}, !0, !0)
				}, e(h, g)), i = a.target.getAttribute("data-poster"), i && (a.detail.firesLoad = !0, g = function () {
					a.target.poster = i, a.detail.firesLoad = !1, c.fire(a.target, "_lazyloaded", {}, !0, !0)
				}, e(i, g)))
			}
		}, !1))
	}), ! function (a, b, c, d) {
		function e(b, c) {
			this.settings = null, this.options = a.extend({}, e.Defaults, c), this.$element = a(b), this._handlers = {}, this._plugins = {}, this._supress = {}, this._current = null, this._speed = null, this._coordinates = [], this._breakpoint = null, this._width = null, this._items = [], this._clones = [], this._mergers = [], this._widths = [], this._invalidated = {}, this._pipe = [], this._drag = {
				time: null,
				target: null,
				pointer: null,
				stage: {
					start: null,
					current: null
				},
				direction: null
			}, this._states = {
				current: {},
				tags: {
					initializing: ["busy"],
					animating: ["busy"],
					dragging: ["interacting"]
				}
			}, a.each(["onResize", "onThrottledResize"], a.proxy(function (b, c) {
				this._handlers[c] = a.proxy(this[c], this)
			}, this)), a.each(e.Plugins, a.proxy(function (a, b) {
				this._plugins[a.charAt(0).toLowerCase() + a.slice(1)] = new b(this)
			}, this)), a.each(e.Workers, a.proxy(function (b, c) {
				this._pipe.push({
					filter: c.filter,
					run: a.proxy(c.run, this)
				})
			}, this)), this.setup(), this.initialize()
		}
		e.Defaults = {
			items: 3,
			loop: !1,
			center: !1,
			rewind: !1,
			mouseDrag: !0,
			touchDrag: !0,
			pullDrag: !0,
			freeDrag: !1,
			margin: 0,
			stagePadding: 0,
			merge: !1,
			mergeFit: !0,
			autoWidth: !1,
			startPosition: 0,
			rtl: !1,
			smartSpeed: 250,
			fluidSpeed: !1,
			dragEndSpeed: !1,
			responsive: {},
			responsiveRefreshRate: 200,
			responsiveBaseElement: b,
			fallbackEasing: "swing",
			info: !1,
			nestedItemSelector: !1,
			itemElement: "div",
			stageElement: "div",
			refreshClass: "owl-refresh",
			loadedClass: "owl-loaded",
			loadingClass: "owl-loading",
			rtlClass: "owl-rtl",
			responsiveClass: "owl-responsive",
			dragClass: "owl-drag",
			itemClass: "owl-item",
			stageClass: "owl-stage",
			stageOuterClass: "owl-stage-outer",
			grabClass: "owl-grab"
		}, e.Width = {
			Default: "default",
			Inner: "inner",
			Outer: "outer"
		}, e.Type = {
			Event: "event",
			State: "state"
		}, e.Plugins = {}, e.Workers = [{
			filter: ["width", "settings"],
			run: function () {
				this._width = this.$element.width()
			}
		}, {
			filter: ["width", "items", "settings"],
			run: function (a) {
				a.current = this._items && this._items[this.relative(this._current)]
			}
		}, {
			filter: ["items", "settings"],
			run: function () {
				this.$stage.children(".cloned").remove()
			}
		}, {
			filter: ["width", "items", "settings"],
			run: function (a) {
				var b = this.settings.margin || "",
					c = !this.settings.autoWidth,
					d = this.settings.rtl,
					e = {
						width: "auto",
						"margin-left": d ? b : "",
						"margin-right": d ? "" : b
					};
				!c && this.$stage.children().css(e), a.css = e
			}
		}, {
			filter: ["width", "items", "settings"],
			run: function (a) {
				var b = (this.width() / this.settings.items).toFixed(3) - this.settings.margin,
					c = null,
					d = this._items.length,
					e = !this.settings.autoWidth,
					f = [];
				for (a.items = {
						merge: !1,
						width: b
					}; d--;) c = this._mergers[d], c = this.settings.mergeFit && Math.min(c, this.settings.items) || c, a.items.merge = c > 1 || a.items.merge, f[d] = e ? b * c : this._items[d].width();
				this._widths = f
			}
		}, {
			filter: ["items", "settings"],
			run: function () {
				var b = [],
					c = this._items,
					d = this.settings,
					e = Math.max(2 * d.items, 4),
					f = 2 * Math.ceil(c.length / 2),
					g = d.loop && c.length ? d.rewind ? e : Math.max(e, f) : 0,
					h = "",
					i = "";
				for (g /= 2; g--;) b.push(this.normalize(b.length / 2, !0)), h += c[b[b.length - 1]][0].outerHTML, b.push(this.normalize(c.length - 1 - (b.length - 1) / 2, !0)), i = c[b[b.length - 1]][0].outerHTML + i;
				this._clones = b, a(h).addClass("cloned").appendTo(this.$stage), a(i).addClass("cloned").prependTo(this.$stage)
			}
		}, {
			filter: ["width", "items", "settings"],
			run: function () {
				for (var a = this.settings.rtl ? 1 : -1, b = this._clones.length + this._items.length, c = -1, d = 0, e = 0, f = []; ++c < b;) d = f[c - 1] || 0, e = this._widths[this.relative(c)] + this.settings.margin, f.push(d + e * a);
				this._coordinates = f
			}
		}, {
			filter: ["width", "items", "settings"],
			run: function () {
				var a = this.settings.stagePadding,
					b = this._coordinates,
					c = {
						width: Math.ceil(Math.abs(b[b.length - 1])) + 2 * a,
						"padding-left": a || "",
						"padding-right": a || ""
					};
				this.$stage.css(c)
			}
		}, {
			filter: ["width", "items", "settings"],
			run: function (a) {
				var b = this._coordinates.length,
					c = !this.settings.autoWidth,
					d = this.$stage.children();
				if (c && a.items.merge)
					for (; b--;) a.css.width = this._widths[this.relative(b)], d.eq(b).css(a.css);
				else c && (a.css.width = a.items.width, d.css(a.css))
			}
		}, {
			filter: ["items"],
			run: function () {
				this._coordinates.length < 1 && this.$stage.removeAttr("style")
			}
		}, {
			filter: ["width", "items", "settings"],
			run: function (a) {
				a.current = a.current ? this.$stage.children().index(a.current) : 0, a.current = Math.max(this.minimum(), Math.min(this.maximum(), a.current)), this.reset(a.current)
			}
		}, {
			filter: ["position"],
			run: function () {
				this.animate(this.coordinates(this._current))
			}
		}, {
			filter: ["width", "position", "items", "settings"],
			run: function () {
				var a, b, c, d, e = this.settings.rtl ? 1 : -1,
					f = 2 * this.settings.stagePadding,
					g = this.coordinates(this.current()) + f,
					h = g + this.width() * e,
					i = [];
				for (c = 0, d = this._coordinates.length; d > c; c++) a = this._coordinates[c - 1] || 0, b = Math.abs(this._coordinates[c]) + f * e, (this.op(a, "<=", g) && this.op(a, ">", h) || this.op(b, "<", g) && this.op(b, ">", h)) && i.push(c);
				this.$stage.children(".active").removeClass("active"), this.$stage.children(":eq(" + i.join("), :eq(") + ")").addClass("active"), this.settings.center && (this.$stage.children(".center").removeClass("center"), this.$stage.children().eq(this.current()).addClass("center"))
			}
		}], e.prototype.initialize = function () {
			if (this.enter("initializing"), this.trigger("initialize"), this.$element.toggleClass(this.settings.rtlClass, this.settings.rtl), this.settings.autoWidth && !this.is("pre-loading")) {
				var b, c, e;
				b = this.$element.find("img"), c = this.settings.nestedItemSelector ? "." + this.settings.nestedItemSelector : d, e = this.$element.children(c).width(), b.length && 0 >= e && this.preloadAutoWidthImages(b)
			}
			this.$element.addClass(this.options.loadingClass), this.$stage = a("<" + this.settings.stageElement + ' class="' + this.settings.stageClass + '"/>').wrap('<div class="' + this.settings.stageOuterClass + '"/>'), this.$element.append(this.$stage.parent()), this.replace(this.$element.children().not(this.$stage.parent())), this.$element.is(":visible") ? this.refresh() : this.invalidate("width"), this.$element.removeClass(this.options.loadingClass).addClass(this.options.loadedClass), this.registerEventHandlers(), this.leave("initializing"), this.trigger("initialized")
		}, e.prototype.setup = function () {
			var b = this.viewport(),
				c = this.options.responsive,
				d = -1,
				e = null;
			c ? (a.each(c, function (a) {
				b >= a && a > d && (d = Number(a))
			}), e = a.extend({}, this.options, c[d]), "function" == typeof e.stagePadding && (e.stagePadding = e.stagePadding()), delete e.responsive, e.responsiveClass && this.$element.attr("class", this.$element.attr("class").replace(new RegExp("(" + this.options.responsiveClass + "-)\\S+\\s", "g"), "$1" + d))) : e = a.extend({}, this.options), this.trigger("change", {
				property: {
					name: "settings",
					value: e
				}
			}), this._breakpoint = d, this.settings = e, this.invalidate("settings"), this.trigger("changed", {
				property: {
					name: "settings",
					value: this.settings
				}
			})
		}, e.prototype.optionsLogic = function () {
			this.settings.autoWidth && (this.settings.stagePadding = !1, this.settings.merge = !1)
		}, e.prototype.prepare = function (b) {
			var c = this.trigger("prepare", {
				content: b
			});
			return c.data || (c.data = a("<" + this.settings.itemElement + "/>").addClass(this.options.itemClass).append(b)), this.trigger("prepared", {
				content: c.data
			}), c.data
		}, e.prototype.update = function () {
			for (var b = 0, c = this._pipe.length, d = a.proxy(function (a) {
					return this[a]
				}, this._invalidated), e = {}; c > b;)(this._invalidated.all || a.grep(this._pipe[b].filter, d).length > 0) && this._pipe[b].run(e), b++;
			this._invalidated = {}, !this.is("valid") && this.enter("valid")
		}, e.prototype.width = function (a) {
			switch (a = a || e.Width.Default) {
				case e.Width.Inner:
				case e.Width.Outer:
					return this._width;
				default:
					return this._width - 2 * this.settings.stagePadding + this.settings.margin
			}
		}, e.prototype.refresh = function () {
			this.enter("refreshing"), this.trigger("refresh"), this.setup(), this.optionsLogic(), this.$element.addClass(this.options.refreshClass), this.update(), this.$element.removeClass(this.options.refreshClass), this.leave("refreshing"), this.trigger("refreshed")
		}, e.prototype.onThrottledResize = function () {
			b.clearTimeout(this.resizeTimer), this.resizeTimer = b.setTimeout(this._handlers.onResize, this.settings.responsiveRefreshRate)
		}, e.prototype.onResize = function () {
			return !!this._items.length && this._width !== this.$element.width() && !!this.$element.is(":visible") && (this.enter("resizing"), this.trigger("resize").isDefaultPrevented() ? (this.leave("resizing"), !1) : (this.invalidate("width"), this.refresh(), this.leave("resizing"), void this.trigger("resized")))
		}, e.prototype.registerEventHandlers = function () {
			a.support.transition && this.$stage.on(a.support.transition.end + ".owl.core", a.proxy(this.onTransitionEnd, this)), this.settings.responsive !== !1 && this.on(b, "resize", this._handlers.onThrottledResize), this.settings.mouseDrag && (this.$element.addClass(this.options.dragClass), this.$stage.on("mousedown.owl.core", a.proxy(this.onDragStart, this)), this.$stage.on("dragstart.owl.core selectstart.owl.core", function () {
				return !1
			})), this.settings.touchDrag && (this.$stage.on("touchstart.owl.core", a.proxy(this.onDragStart, this)), this.$stage.on("touchcancel.owl.core", a.proxy(this.onDragEnd, this)))
		}, e.prototype.onDragStart = function (b) {
			var d = null;
			3 !== b.which && (a.support.transform ? (d = this.$stage.css("transform").replace(/.*\(|\)| /g, "").split(","), d = {
				x: d[16 === d.length ? 12 : 4],
				y: d[16 === d.length ? 13 : 5]
			}) : (d = this.$stage.position(), d = {
				x: this.settings.rtl ? d.left + this.$stage.width() - this.width() + this.settings.margin : d.left,
				y: d.top
			}), this.is("animating") && (a.support.transform ? this.animate(d.x) : this.$stage.stop(), this.invalidate("position")), this.$element.toggleClass(this.options.grabClass, "mousedown" === b.type), this.speed(0), this._drag.time = (new Date).getTime(), this._drag.target = a(b.target), this._drag.stage.start = d, this._drag.stage.current = d, this._drag.pointer = this.pointer(b), a(c).on("mouseup.owl.core touchend.owl.core", a.proxy(this.onDragEnd, this)), a(c).one("mousemove.owl.core touchmove.owl.core", a.proxy(function (b) {
				var d = this.difference(this._drag.pointer, this.pointer(b));
				a(c).on("mousemove.owl.core touchmove.owl.core", a.proxy(this.onDragMove, this)), Math.abs(d.x) < Math.abs(d.y) && this.is("valid") || (b.preventDefault(), this.enter("dragging"), this.trigger("drag"))
			}, this)))
		}, e.prototype.onDragMove = function (a) {
			var b = null,
				c = null,
				d = null,
				e = this.difference(this._drag.pointer, this.pointer(a)),
				f = this.difference(this._drag.stage.start, e);
			this.is("dragging") && (a.preventDefault(), this.settings.loop ? (b = this.coordinates(this.minimum()), c = this.coordinates(this.maximum() + 1) - b, f.x = ((f.x - b) % c + c) % c + b) : (b = this.coordinates(this.settings.rtl ? this.maximum() : this.minimum()), c = this.coordinates(this.settings.rtl ? this.minimum() : this.maximum()), d = this.settings.pullDrag ? -1 * e.x / 5 : 0, f.x = Math.max(Math.min(f.x, b + d), c + d)), this._drag.stage.current = f, this.animate(f.x))
		}, e.prototype.onDragEnd = function (b) {
			var d = this.difference(this._drag.pointer, this.pointer(b)),
				e = this._drag.stage.current,
				f = d.x > 0 ^ this.settings.rtl ? "left" : "right";
			a(c).off(".owl.core"), this.$element.removeClass(this.options.grabClass), (0 !== d.x && this.is("dragging") || !this.is("valid")) && (this.speed(this.settings.dragEndSpeed || this.settings.smartSpeed), this.current(this.closest(e.x, 0 !== d.x ? f : this._drag.direction)), this.invalidate("position"), this.update(), this._drag.direction = f, (Math.abs(d.x) > 3 || (new Date).getTime() - this._drag.time > 300) && this._drag.target.one("click.owl.core", function () {
				return !1
			})), this.is("dragging") && (this.leave("dragging"), this.trigger("dragged"))
		}, e.prototype.closest = function (b, c) {
			var d = -1,
				e = 30,
				f = this.width(),
				g = this.coordinates();
			return this.settings.freeDrag || a.each(g, a.proxy(function (a, h) {
				return "left" === c && b > h - e && h + e > b ? d = a : "right" === c && b > h - f - e && h - f + e > b ? d = a + 1 : this.op(b, "<", h) && this.op(b, ">", g[a + 1] || h - f) && (d = "left" === c ? a + 1 : a), -1 === d
			}, this)), this.settings.loop || (this.op(b, ">", g[this.minimum()]) ? d = b = this.minimum() : this.op(b, "<", g[this.maximum()]) && (d = b = this.maximum())), d
		}, e.prototype.animate = function (b) {
			var c = this.speed() > 0;
			this.is("animating") && this.onTransitionEnd(), c && (this.enter("animating"), this.trigger("translate")), a.support.transform3d && a.support.transition ? this.$stage.css({
				transform: "translate3d(" + b + "px,0px,0px)",
				transition: this.speed() / 1e3 + "s"
			}) : c ? this.$stage.animate({
				left: b + "px"
			}, this.speed(), this.settings.fallbackEasing, a.proxy(this.onTransitionEnd, this)) : this.$stage.css({
				left: b + "px"
			})
		}, e.prototype.is = function (a) {
			return this._states.current[a] && this._states.current[a] > 0
		}, e.prototype.current = function (a) {
			if (a === d) return this._current;
			if (0 === this._items.length) return d;
			if (a = this.normalize(a), this._current !== a) {
				var b = this.trigger("change", {
					property: {
						name: "position",
						value: a
					}
				});
				b.data !== d && (a = this.normalize(b.data)), this._current = a, this.invalidate("position"), this.trigger("changed", {
					property: {
						name: "position",
						value: this._current
					}
				})
			}
			return this._current
		}, e.prototype.invalidate = function (b) {
			return "string" === a.type(b) && (this._invalidated[b] = !0, this.is("valid") && this.leave("valid")), a.map(this._invalidated, function (a, b) {
				return b
			})
		}, e.prototype.reset = function (a) {
			a = this.normalize(a), a !== d && (this._speed = 0, this._current = a, this.suppress(["translate", "translated"]), this.animate(this.coordinates(a)), this.release(["translate", "translated"]))
		}, e.prototype.normalize = function (a, b) {
			var c = this._items.length,
				e = b ? 0 : this._clones.length;
			return !this.isNumeric(a) || 1 > c ? a = d : (0 > a || a >= c + e) && (a = ((a - e / 2) % c + c) % c + e / 2), a
		}, e.prototype.relative = function (a) {
			return a -= this._clones.length / 2, this.normalize(a, !0)
		}, e.prototype.maximum = function (a) {
			var b, c, d, e = this.settings,
				f = this._coordinates.length;
			if (e.loop) f = this._clones.length / 2 + this._items.length - 1;
			else if (e.autoWidth || e.merge) {
				for (b = this._items.length, c = this._items[--b].width(), d = this.$element.width(); b-- && (c += this._items[b].width() + this.settings.margin, !(c > d)););
				f = b + 1
			} else f = e.center ? this._items.length - 1 : this._items.length - e.items;
			return a && (f -= this._clones.length / 2), Math.max(f, 0)
		}, e.prototype.minimum = function (a) {
			return a ? 0 : this._clones.length / 2
		}, e.prototype.items = function (a) {
			return a === d ? this._items.slice() : (a = this.normalize(a, !0), this._items[a])
		}, e.prototype.mergers = function (a) {
			return a === d ? this._mergers.slice() : (a = this.normalize(a, !0), this._mergers[a])
		}, e.prototype.clones = function (b) {
			var c = this._clones.length / 2,
				e = c + this._items.length,
				f = function (a) {
					return a % 2 === 0 ? e + a / 2 : c - (a + 1) / 2
				};
			return b === d ? a.map(this._clones, function (a, b) {
				return f(b)
			}) : a.map(this._clones, function (a, c) {
				return a === b ? f(c) : null
			})
		}, e.prototype.speed = function (a) {
			return a !== d && (this._speed = a), this._speed
		}, e.prototype.coordinates = function (b) {
			var c, e = 1,
				f = b - 1;
			return b === d ? a.map(this._coordinates, a.proxy(function (a, b) {
				return this.coordinates(b)
			}, this)) : (this.settings.center ? (this.settings.rtl && (e = -1, f = b + 1), c = this._coordinates[b], c += (this.width() - c + (this._coordinates[f] || 0)) / 2 * e) : c = this._coordinates[f] || 0, c = Math.ceil(c))
		}, e.prototype.duration = function (a, b, c) {
			return 0 === c ? 0 : Math.min(Math.max(Math.abs(b - a), 1), 6) * Math.abs(c || this.settings.smartSpeed)
		}, e.prototype.to = function (a, b) {
			var c = this.current(),
				d = null,
				e = a - this.relative(c),
				f = (e > 0) - (0 > e),
				g = this._items.length,
				h = this.minimum(),
				i = this.maximum();
			this.settings.loop ? (!this.settings.rewind && Math.abs(e) > g / 2 && (e += -1 * f * g), a = c + e, d = ((a - h) % g + g) % g + h, d !== a && i >= d - e && d - e > 0 && (c = d - e, a = d, this.reset(c))) : this.settings.rewind ? (i += 1, a = (a % i + i) % i) : a = Math.max(h, Math.min(i, a)), this.speed(this.duration(c, a, b)), this.current(a), this.$element.is(":visible") && this.update()
		}, e.prototype.next = function (a) {
			a = a || !1, this.to(this.relative(this.current()) + 1, a)
		}, e.prototype.prev = function (a) {
			a = a || !1, this.to(this.relative(this.current()) - 1, a)
		}, e.prototype.onTransitionEnd = function (a) {
			return a !== d && (a.stopPropagation(), (a.target || a.srcElement || a.originalTarget) !== this.$stage.get(0)) ? !1 : (this.leave("animating"), void this.trigger("translated"))
		}, e.prototype.viewport = function () {
			var d;
			return this.options.responsiveBaseElement !== b ? d = a(this.options.responsiveBaseElement).width() : b.innerWidth ? d = b.innerWidth : c.documentElement && c.documentElement.clientWidth ? d = c.documentElement.clientWidth : console.warn("Can not detect viewport width."), d
		}, e.prototype.replace = function (b) {
			this.$stage.empty(), this._items = [], b && (b = b instanceof jQuery ? b : a(b)), this.settings.nestedItemSelector && (b = b.find("." + this.settings.nestedItemSelector)), b.filter(function () {
				return 1 === this.nodeType
			}).each(a.proxy(function (a, b) {
				b = this.prepare(b), this.$stage.append(b), this._items.push(b), this._mergers.push(1 * b.find("[data-merge]").addBack("[data-merge]").attr("data-merge") || 1)
			}, this)), this.reset(this.isNumeric(this.settings.startPosition) ? this.settings.startPosition : 0), this.invalidate("items")
		}, e.prototype.add = function (b, c) {
			var e = this.relative(this._current);
			c = c === d ? this._items.length : this.normalize(c, !0), b = b instanceof jQuery ? b : a(b), this.trigger("add", {
				content: b,
				position: c
			}), b = this.prepare(b), 0 === this._items.length || c === this._items.length ? (0 === this._items.length && this.$stage.append(b), 0 !== this._items.length && this._items[c - 1].after(b), this._items.push(b), this._mergers.push(1 * b.find("[data-merge]").addBack("[data-merge]").attr("data-merge") || 1)) : (this._items[c].before(b), this._items.splice(c, 0, b), this._mergers.splice(c, 0, 1 * b.find("[data-merge]").addBack("[data-merge]").attr("data-merge") || 1)), this._items[e] && this.reset(this._items[e].index()), this.invalidate("items"), this.trigger("added", {
				content: b,
				position: c
			})
		}, e.prototype.remove = function (a) {
			a = this.normalize(a, !0), a !== d && (this.trigger("remove", {
				content: this._items[a],
				position: a
			}), this._items[a].remove(), this._items.splice(a, 1), this._mergers.splice(a, 1), this.invalidate("items"), this.trigger("removed", {
				content: null,
				position: a
			}))
		}, e.prototype.preloadAutoWidthImages = function (b) {
			b.each(a.proxy(function (b, c) {
				this.enter("pre-loading"), c = a(c), a(new Image).one("load", a.proxy(function (a) {
					c.attr("src", a.target.src), c.css("opacity", 1), this.leave("pre-loading"), !this.is("pre-loading") && !this.is("initializing") && this.refresh()
				}, this)).attr("src", c.attr("src") || c.attr("data-src") || c.attr("data-src-retina"))
			}, this))
		}, e.prototype.destroy = function () {
			this.$element.off(".owl.core"), this.$stage.off(".owl.core"), a(c).off(".owl.core"), this.settings.responsive !== !1 && (b.clearTimeout(this.resizeTimer), this.off(b, "resize", this._handlers.onThrottledResize));
			for (var d in this._plugins) this._plugins[d].destroy();
			this.$stage.children(".cloned").remove(), this.$stage.unwrap(), this.$stage.children().contents().unwrap(), this.$stage.children().unwrap(), this.$element.removeClass(this.options.refreshClass).removeClass(this.options.loadingClass).removeClass(this.options.loadedClass).removeClass(this.options.rtlClass).removeClass(this.options.dragClass).removeClass(this.options.grabClass).attr("class", this.$element.attr("class").replace(new RegExp(this.options.responsiveClass + "-\\S+\\s", "g"), "")).removeData("owl.carousel")
		}, e.prototype.op = function (a, b, c) {
			var d = this.settings.rtl;
			switch (b) {
				case "<":
					return d ? a > c : c > a;
				case ">":
					return d ? c > a : a > c;
				case ">=":
					return d ? c >= a : a >= c;
				case "<=":
					return d ? a >= c : c >= a
			}
		}, e.prototype.on = function (a, b, c, d) {
			a.addEventListener ? a.addEventListener(b, c, d) : a.attachEvent && a.attachEvent("on" + b, c)
		}, e.prototype.off = function (a, b, c, d) {
			a.removeEventListener ? a.removeEventListener(b, c, d) : a.detachEvent && a.detachEvent("on" + b, c)
		}, e.prototype.trigger = function (b, c, d) {
			var f = {
					item: {
						count: this._items.length,
						index: this.current()
					}
				},
				g = a.camelCase(a.grep(["on", b, d], function (a) {
					return a
				}).join("-").toLowerCase()),
				h = a.Event([b, "owl", d || "carousel"].join(".").toLowerCase(), a.extend({
					relatedTarget: this
				}, f, c));
			return this._supress[b] || (a.each(this._plugins, function (a, b) {
				b.onTrigger && b.onTrigger(h)
			}), this.register({
				type: e.Type.Event,
				name: b
			}), this.$element.trigger(h), this.settings && "function" == typeof this.settings[g] && this.settings[g].call(this, h)), h
		}, e.prototype.enter = function (b) {
			a.each([b].concat(this._states.tags[b] || []), a.proxy(function (a, b) {
				this._states.current[b] === d && (this._states.current[b] = 0), this._states.current[b]++
			}, this))
		}, e.prototype.leave = function (b) {
			a.each([b].concat(this._states.tags[b] || []), a.proxy(function (a, b) {
				this._states.current[b]--
			}, this))
		}, e.prototype.register = function (b) {
			if (b.type === e.Type.Event) {
				if (a.event.special[b.name] || (a.event.special[b.name] = {}), !a.event.special[b.name].owl) {
					var c = a.event.special[b.name]._default;
					a.event.special[b.name]._default = function (a) {
						return !c || !c.apply || a.namespace && -1 !== a.namespace.indexOf("owl") ? a.namespace && a.namespace.indexOf("owl") > -1 : c.apply(this, arguments)
					}, a.event.special[b.name].owl = !0
				}
			} else b.type === e.Type.State && (this._states.tags[b.name] = this._states.tags[b.name] ? this._states.tags[b.name].concat(b.tags) : b.tags, this._states.tags[b.name] = a.grep(this._states.tags[b.name], a.proxy(function (c, d) {
				return a.inArray(c, this._states.tags[b.name]) === d
			}, this)))
		}, e.prototype.suppress = function (b) {
			a.each(b, a.proxy(function (a, b) {
				this._supress[b] = !0
			}, this))
		}, e.prototype.release = function (b) {
			a.each(b, a.proxy(function (a, b) {
				delete this._supress[b]
			}, this))
		}, e.prototype.pointer = function (a) {
			var c = {
				x: null,
				y: null
			};
			return a = a.originalEvent || a || b.event, a = a.touches && a.touches.length ? a.touches[0] : a.changedTouches && a.changedTouches.length ? a.changedTouches[0] : a, a.pageX ? (c.x = a.pageX, c.y = a.pageY) : (c.x = a.clientX, c.y = a.clientY), c
		}, e.prototype.isNumeric = function (a) {
			return !isNaN(parseFloat(a))
		}, e.prototype.difference = function (a, b) {
			return {
				x: a.x - b.x,
				y: a.y - b.y
			}
		}, a.fn.owlCarousel = function (b) {
			var c = Array.prototype.slice.call(arguments, 1);
			return this.each(function () {
				var d = a(this),
					f = d.data("owl.carousel");
				f || (f = new e(this, "object" == typeof b && b), d.data("owl.carousel", f), a.each(["next", "prev", "to", "destroy", "refresh", "replace", "add", "remove"], function (b, c) {
					f.register({
						type: e.Type.Event,
						name: c
					}), f.$element.on(c + ".owl.carousel.core", a.proxy(function (a) {
						a.namespace && a.relatedTarget !== this && (this.suppress([c]), f[c].apply(this, [].slice.call(arguments, 1)), this.release([c]))
					}, f))
				})), "string" == typeof b && "_" !== b.charAt(0) && f[b].apply(f, c)
			})
		}, a.fn.owlCarousel.Constructor = e
	}(window.Zepto || window.jQuery, window, document),
	function (a, b) {
		var c = function (b) {
			this._core = b, this._interval = null, this._visible = null, this._handlers = {
				"initialized.owl.carousel": a.proxy(function (a) {
					a.namespace && this._core.settings.autoRefresh && this.watch()
				}, this)
			}, this._core.options = a.extend({}, c.Defaults, this._core.options), this._core.$element.on(this._handlers)
		};
		c.Defaults = {
			autoRefresh: !0,
			autoRefreshInterval: 500
		}, c.prototype.watch = function () {
			this._interval || (this._visible = this._core.$element.is(":visible"), this._interval = b.setInterval(a.proxy(this.refresh, this), this._core.settings.autoRefreshInterval))
		}, c.prototype.refresh = function () {
			this._core.$element.is(":visible") !== this._visible && (this._visible = !this._visible, this._core.$element.toggleClass("owl-hidden", !this._visible), this._visible && this._core.invalidate("width") && this._core.refresh())
		}, c.prototype.destroy = function () {
			var a, c;
			b.clearInterval(this._interval);
			for (a in this._handlers) this._core.$element.off(a, this._handlers[a]);
			for (c in Object.getOwnPropertyNames(this)) "function" != typeof this[c] && (this[c] = null)
		}, a.fn.owlCarousel.Constructor.Plugins.AutoRefresh = c
	}(window.Zepto || window.jQuery, window, document),
	function (a, b, c, d) {
		var e = function (b) {
			this._core = b, this._loaded = [], this._handlers = {
				"initialized.owl.carousel change.owl.carousel resized.owl.carousel": a.proxy(function (b) {
					if (b.namespace && this._core.settings && this._core.settings.lazyLoad && (b.property && "position" == b.property.name || "initialized" == b.type))
						for (var c = this._core.settings, e = c.center && Math.ceil(c.items / 2) || c.items, f = c.center && -1 * e || 0, g = (b.property && b.property.value !== d ? b.property.value : this._core.current()) + f, h = this._core.clones().length, i = a.proxy(function (a, b) {
								this.load(b)
							}, this); f++ < e;) this.load(h / 2 + this._core.relative(g)), h && a.each(this._core.clones(this._core.relative(g)), i), g++
				}, this)
			}, this._core.options = a.extend({}, e.Defaults, this._core.options), this._core.$element.on(this._handlers)
		};
		e.Defaults = {
			lazyLoad: !1
		}, e.prototype.load = function (c) {
			var d = this._core.$stage.children().eq(c),
				e = d && d.find(".owl-lazy");
			!e || a.inArray(d.get(0), this._loaded) > -1 || (e.each(a.proxy(function (c, d) {
				var e, f = a(d),
					g = b.devicePixelRatio > 1 && f.attr("data-src-retina") || f.attr("data-src");
				this._core.trigger("load", {
					element: f,
					url: g
				}, "lazy"), f.is("img") ? f.one("load.owl.lazy", a.proxy(function () {
					f.css("opacity", 1), this._core.trigger("loaded", {
						element: f,
						url: g
					}, "lazy")
				}, this)).attr("src", g) : (e = new Image, e.onload = a.proxy(function () {
					f.css({
						"background-image": 'url("' + g + '")',
						opacity: "1"
					}), this._core.trigger("loaded", {
						element: f,
						url: g
					}, "lazy")
				}, this), e.src = g)
			}, this)), this._loaded.push(d.get(0)))
		}, e.prototype.destroy = function () {
			var a, b;
			for (a in this.handlers) this._core.$element.off(a, this.handlers[a]);
			for (b in Object.getOwnPropertyNames(this)) "function" != typeof this[b] && (this[b] = null)
		}, a.fn.owlCarousel.Constructor.Plugins.Lazy = e
	}(window.Zepto || window.jQuery, window, document),
	function (a) {
		var b = function (c) {
			this._core = c, this._handlers = {
				"initialized.owl.carousel refreshed.owl.carousel": a.proxy(function (a) {
					a.namespace && this._core.settings.autoHeight && this.update()
				}, this),
				"changed.owl.carousel": a.proxy(function (a) {
					a.namespace && this._core.settings.autoHeight && "position" == a.property.name && this.update()
				}, this),
				"loaded.owl.lazy": a.proxy(function (a) {
					a.namespace && this._core.settings.autoHeight && a.element.closest("." + this._core.settings.itemClass).index() === this._core.current() && this.update()
				}, this)
			}, this._core.options = a.extend({}, b.Defaults, this._core.options), this._core.$element.on(this._handlers)
		};
		b.Defaults = {
			autoHeight: !1,
			autoHeightClass: "owl-height"
		}, b.prototype.update = function () {
			var b = this._core._current,
				c = b + this._core.settings.items,
				d = this._core.$stage.children().toArray().slice(b, c),
				e = [],
				f = 0;
			a.each(d, function (b, c) {
				e.push(a(c).height())
			}), f = Math.max.apply(null, e), this._core.$stage.parent().height(f).addClass(this._core.settings.autoHeightClass)
		}, b.prototype.destroy = function () {
			var a, b;
			for (a in this._handlers) this._core.$element.off(a, this._handlers[a]);
			for (b in Object.getOwnPropertyNames(this)) "function" != typeof this[b] && (this[b] = null)
		}, a.fn.owlCarousel.Constructor.Plugins.AutoHeight = b
	}(window.Zepto || window.jQuery, window, document),
	function (a, b, c) {
		var d = function (b) {
			this._core = b, this._videos = {}, this._playing = null, this._handlers = {
				"initialized.owl.carousel": a.proxy(function (a) {
					a.namespace && this._core.register({
						type: "state",
						name: "playing",
						tags: ["interacting"]
					})
				}, this),
				"resize.owl.carousel": a.proxy(function (a) {
					a.namespace && this._core.settings.video && this.isInFullScreen() && a.preventDefault()
				}, this),
				"refreshed.owl.carousel": a.proxy(function (a) {
					a.namespace && this._core.is("resizing") && this._core.$stage.find(".cloned .owl-video-frame").remove()
				}, this),
				"changed.owl.carousel": a.proxy(function (a) {
					a.namespace && "position" === a.property.name && this._playing && this.stop()
				}, this),
				"prepared.owl.carousel": a.proxy(function (b) {
					if (b.namespace) {
						var c = a(b.content).find(".owl-video");
						c.length && (c.css("display", "none"), this.fetch(c, a(b.content)))
					}
				}, this)
			}, this._core.options = a.extend({}, d.Defaults, this._core.options), this._core.$element.on(this._handlers), this._core.$element.on("click.owl.video", ".owl-video-play-icon", a.proxy(function (a) {
				this.play(a)
			}, this))
		};
		d.Defaults = {
			video: !1,
			videoHeight: !1,
			videoWidth: !1
		}, d.prototype.fetch = function (a, b) {
			var c = function () {
					return a.attr("data-vimeo-id") ? "vimeo" : a.attr("data-vzaar-id") ? "vzaar" : "youtube"
				}(),
				d = a.attr("data-vimeo-id") || a.attr("data-youtube-id") || a.attr("data-vzaar-id"),
				e = a.attr("data-width") || this._core.settings.videoWidth,
				f = a.attr("data-height") || this._core.settings.videoHeight,
				g = a.attr("href");
			if (!g) throw new Error("Missing video URL.");
			if (d = g.match(/(http:|https:|)\/\/(player.|www.|app.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com)|vzaar\.com)\/(video\/|videos\/|embed\/|channels\/.+\/|groups\/.+\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/), d[3].indexOf("youtu") > -1) c = "youtube";
			else if (d[3].indexOf("vimeo") > -1) c = "vimeo";
			else {
				if (!(d[3].indexOf("vzaar") > -1)) throw new Error("Video URL not supported.");
				c = "vzaar"
			}
			d = d[6], this._videos[g] = {
				type: c,
				id: d,
				width: e,
				height: f
			}, b.attr("data-video", g), this.thumbnail(a, this._videos[g])
		}, d.prototype.thumbnail = function (b, c) {
			var d, e, f, g = c.width && c.height ? 'style="width:' + c.width + "px;height:" + c.height + 'px;"' : "",
				h = b.find("img"),
				i = "src",
				j = "",
				k = this._core.settings,
				l = function (a) {
					e = '<div class="owl-video-play-icon"></div>', d = k.lazyLoad ? '<div class="owl-video-tn ' + j + '" ' + i + '="' + a + '"></div>' : '<div class="owl-video-tn" style="opacity:1;background-image:url(' + a + ')"></div>', b.after(d), b.after(e)
				};
			return b.wrap('<div class="owl-video-wrapper"' + g + "></div>"), this._core.settings.lazyLoad && (i = "data-src", j = "owl-lazy"), h.length ? (l(h.attr(i)), h.remove(), !1) : void("youtube" === c.type ? (f = "//img.youtube.com/vi/" + c.id + "/hqdefault.jpg", l(f)) : "vimeo" === c.type ? a.ajax({
				type: "GET",
				url: "//vimeo.com/api/v2/video/" + c.id + ".json",
				jsonp: "callback",
				dataType: "jsonp",
				success: function (a) {
					f = a[0].thumbnail_large, l(f)
				}
			}) : "vzaar" === c.type && a.ajax({
				type: "GET",
				url: "//vzaar.com/api/videos/" + c.id + ".json",
				jsonp: "callback",
				dataType: "jsonp",
				success: function (a) {
					f = a.framegrab_url, l(f)
				}
			}))
		}, d.prototype.stop = function () {
			this._core.trigger("stop", null, "video"), this._playing.find(".owl-video-frame").remove(), this._playing.removeClass("owl-video-playing"), this._playing = null, this._core.leave("playing"), this._core.trigger("stopped", null, "video")
		}, d.prototype.play = function (b) {
			var c, d = a(b.target),
				e = d.closest("." + this._core.settings.itemClass),
				f = this._videos[e.attr("data-video")],
				g = f.width || "100%",
				h = f.height || this._core.$stage.height();
			this._playing || (this._core.enter("playing"), this._core.trigger("play", null, "video"), e = this._core.items(this._core.relative(e.index())), this._core.reset(e.index()), "youtube" === f.type ? c = '<iframe width="' + g + '" height="' + h + '" src="//www.youtube.com/embed/' + f.id + "?autoplay=1&rel=0&v=" + f.id + '" frameborder="0" allowfullscreen></iframe>' : "vimeo" === f.type ? c = '<iframe src="//player.vimeo.com/video/' + f.id + '?autoplay=1" width="' + g + '" height="' + h + '" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>' : "vzaar" === f.type && (c = '<iframe frameborder="0"height="' + h + '"width="' + g + '" allowfullscreen mozallowfullscreen webkitAllowFullScreen src="//view.vzaar.com/' + f.id + '/player?autoplay=true"></iframe>'), a('<div class="owl-video-frame">' + c + "</div>").insertAfter(e.find(".owl-video")), this._playing = e.addClass("owl-video-playing"))
		}, d.prototype.isInFullScreen = function () {
			var b = c.fullscreenElement || c.mozFullScreenElement || c.webkitFullscreenElement;
			return b && a(b).parent().hasClass("owl-video-frame")
		}, d.prototype.destroy = function () {
			var a, b;
			this._core.$element.off("click.owl.video");
			for (a in this._handlers) this._core.$element.off(a, this._handlers[a]);
			for (b in Object.getOwnPropertyNames(this)) "function" != typeof this[b] && (this[b] = null)
		}, a.fn.owlCarousel.Constructor.Plugins.Video = d
	}(window.Zepto || window.jQuery, window, document),
	function (a, b, c, d) {
		var e = function (b) {
			this.core = b, this.core.options = a.extend({}, e.Defaults, this.core.options), this.swapping = !0, this.previous = d, this.next = d, this.handlers = {
				"change.owl.carousel": a.proxy(function (a) {
					a.namespace && "position" == a.property.name && (this.previous = this.core.current(), this.next = a.property.value)
				}, this),
				"drag.owl.carousel dragged.owl.carousel translated.owl.carousel": a.proxy(function (a) {
					a.namespace && (this.swapping = "translated" == a.type)
				}, this),
				"translate.owl.carousel": a.proxy(function (a) {
					a.namespace && this.swapping && (this.core.options.animateOut || this.core.options.animateIn) && this.swap()
				}, this)
			}, this.core.$element.on(this.handlers)
		};
		e.Defaults = {
			animateOut: !1,
			animateIn: !1
		}, e.prototype.swap = function () {
			if (1 === this.core.settings.items && a.support.animation && a.support.transition) {
				this.core.speed(0);
				var b, c = a.proxy(this.clear, this),
					d = this.core.$stage.children().eq(this.previous),
					e = this.core.$stage.children().eq(this.next),
					f = this.core.settings.animateIn,
					g = this.core.settings.animateOut;
				this.core.current() !== this.previous && (g && (b = this.core.coordinates(this.previous) - this.core.coordinates(this.next), d.one(a.support.animation.end, c).css({
					left: b + "px"
				}).addClass("animated owl-animated-out").addClass(g)), f && e.one(a.support.animation.end, c).addClass("animated owl-animated-in").addClass(f))
			}
		}, e.prototype.clear = function (b) {
			a(b.target).css({
				left: ""
			}).removeClass("animated owl-animated-out owl-animated-in").removeClass(this.core.settings.animateIn).removeClass(this.core.settings.animateOut), this.core.onTransitionEnd()
		}, e.prototype.destroy = function () {
			var a, b;
			for (a in this.handlers) this.core.$element.off(a, this.handlers[a]);
			for (b in Object.getOwnPropertyNames(this)) "function" != typeof this[b] && (this[b] = null)
		}, a.fn.owlCarousel.Constructor.Plugins.Animate = e
	}(window.Zepto || window.jQuery, window, document),
	function (a, b, c) {
		var d = function (b) {
			this._core = b, this._timeout = null, this._paused = !1, this._handlers = {
				"changed.owl.carousel": a.proxy(function (a) {
					a.namespace && "settings" === a.property.name ? this._core.settings.autoplay ? this.play() : this.stop() : a.namespace && "position" === a.property.name && this._core.settings.autoplay && this._setAutoPlayInterval()
				}, this),
				"initialized.owl.carousel": a.proxy(function (a) {
					a.namespace && this._core.settings.autoplay && this.play()
				}, this),
				"play.owl.autoplay": a.proxy(function (a, b, c) {
					a.namespace && this.play(b, c)
				}, this),
				"stop.owl.autoplay": a.proxy(function (a) {
					a.namespace && this.stop()
				}, this),
				"mouseover.owl.autoplay": a.proxy(function () {
					this._core.settings.autoplayHoverPause && this._core.is("rotating") && this.pause()
				}, this),
				"mouseleave.owl.autoplay": a.proxy(function () {
					this._core.settings.autoplayHoverPause && this._core.is("rotating") && this.play()
				}, this),
				"touchstart.owl.core": a.proxy(function () {
					this._core.settings.autoplayHoverPause && this._core.is("rotating") && this.pause()
				}, this),
				"touchend.owl.core": a.proxy(function () {
					this._core.settings.autoplayHoverPause && this.play()
				}, this)
			}, this._core.$element.on(this._handlers), this._core.options = a.extend({}, d.Defaults, this._core.options)
		};
		d.Defaults = {
			autoplay: !1,
			autoplayTimeout: 5e3,
			autoplayHoverPause: !1,
			autoplaySpeed: !1
		}, d.prototype.play = function () {
			this._paused = !1, this._core.is("rotating") || (this._core.enter("rotating"), this._setAutoPlayInterval())
		}, d.prototype._getNextTimeout = function (d, e) {
			return this._timeout && b.clearTimeout(this._timeout), b.setTimeout(a.proxy(function () {
				this._paused || this._core.is("busy") || this._core.is("interacting") || c.hidden || this._core.next(e || this._core.settings.autoplaySpeed)
			}, this), d || this._core.settings.autoplayTimeout)
		}, d.prototype._setAutoPlayInterval = function () {
			this._timeout = this._getNextTimeout()
		}, d.prototype.stop = function () {
			this._core.is("rotating") && (b.clearTimeout(this._timeout), this._core.leave("rotating"))
		}, d.prototype.pause = function () {
			this._core.is("rotating") && (this._paused = !0)
		}, d.prototype.destroy = function () {
			var a, b;
			this.stop();
			for (a in this._handlers) this._core.$element.off(a, this._handlers[a]);
			for (b in Object.getOwnPropertyNames(this)) "function" != typeof this[b] && (this[b] = null)
		}, a.fn.owlCarousel.Constructor.Plugins.autoplay = d
	}(window.Zepto || window.jQuery, window, document),
	function (a) {
		"use strict";
		var b = function (c) {
			this._core = c, this._initialized = !1, this._pages = [], this._controls = {}, this._templates = [], this.$element = this._core.$element, this._overrides = {
				next: this._core.next,
				prev: this._core.prev,
				to: this._core.to
			}, this._handlers = {
				"prepared.owl.carousel": a.proxy(function (b) {
					b.namespace && this._core.settings.dotsData && this._templates.push('<div class="' + this._core.settings.dotClass + '">' + a(b.content).find("[data-dot]").addBack("[data-dot]").attr("data-dot") + "</div>")
				}, this),
				"added.owl.carousel": a.proxy(function (a) {
					a.namespace && this._core.settings.dotsData && this._templates.splice(a.position, 0, this._templates.pop())
				}, this),
				"remove.owl.carousel": a.proxy(function (a) {
					a.namespace && this._core.settings.dotsData && this._templates.splice(a.position, 1)
				}, this),
				"changed.owl.carousel": a.proxy(function (a) {
					a.namespace && "position" == a.property.name && this.draw()
				}, this),
				"initialized.owl.carousel": a.proxy(function (a) {
					a.namespace && !this._initialized && (this._core.trigger("initialize", null, "navigation"), this.initialize(), this.update(), this.draw(), this._initialized = !0, this._core.trigger("initialized", null, "navigation"))
				}, this),
				"refreshed.owl.carousel": a.proxy(function (a) {
					a.namespace && this._initialized && (this._core.trigger("refresh", null, "navigation"), this.update(), this.draw(), this._core.trigger("refreshed", null, "navigation"))
				}, this)
			}, this._core.options = a.extend({}, b.Defaults, this._core.options), this.$element.on(this._handlers)
		};
		b.Defaults = {
			nav: !1,
			navText: ["prev", "next"],
			navSpeed: !1,
			navElement: "div",
			navContainer: !1,
			navContainerClass: "owl-nav",
			navClass: ["owl-prev", "owl-next"],
			slideBy: 1,
			dotClass: "owl-dot",
			dotsClass: "owl-dots",
			dots: !0,
			dotsEach: !1,
			dotsData: !1,
			dotsSpeed: !1,
			dotsContainer: !1
		}, b.prototype.initialize = function () {
			var b, c = this._core.settings;
			this._controls.$relative = (c.navContainer ? a(c.navContainer) : a("<div>").addClass(c.navContainerClass).appendTo(this.$element)).addClass("disabled"), this._controls.$previous = a("<" + c.navElement + ">").addClass(c.navClass[0]).html(c.navText[0]).prependTo(this._controls.$relative).on("click", a.proxy(function () {
				this.prev(c.navSpeed)
			}, this)), this._controls.$next = a("<" + c.navElement + ">").addClass(c.navClass[1]).html(c.navText[1]).appendTo(this._controls.$relative).on("click", a.proxy(function () {
				this.next(c.navSpeed)
			}, this)), c.dotsData || (this._templates = [a("<div>").addClass(c.dotClass).append(a("<span>")).prop("outerHTML")]), this._controls.$absolute = (c.dotsContainer ? a(c.dotsContainer) : a("<div>").addClass(c.dotsClass).appendTo(this.$element)).addClass("disabled"), this._controls.$absolute.on("click", "div", a.proxy(function (b) {
				var d = a(b.target).parent().is(this._controls.$absolute) ? a(b.target).index() : a(b.target).parent().index();
				b.preventDefault(), this.to(d, c.dotsSpeed)
			}, this));
			for (b in this._overrides) this._core[b] = a.proxy(this[b], this)
		}, b.prototype.destroy = function () {
			var a, b, c, d;
			for (a in this._handlers) this.$element.off(a, this._handlers[a]);
			for (b in this._controls) this._controls[b].remove();
			for (d in this.overides) this._core[d] = this._overrides[d];
			for (c in Object.getOwnPropertyNames(this)) "function" != typeof this[c] && (this[c] = null)
		}, b.prototype.update = function () {
			var a, b, c, d = this._core.clones().length / 2,
				e = d + this._core.items().length,
				f = this._core.maximum(!0),
				g = this._core.settings,
				h = g.center || g.autoWidth || g.dotsData ? 1 : g.dotsEach || g.items;
			if ("page" !== g.slideBy && (g.slideBy = Math.min(g.slideBy, g.items)), g.dots || "page" == g.slideBy)
				for (this._pages = [], a = d, b = 0, c = 0; e > a; a++) {
					if (b >= h || 0 === b) {
						if (this._pages.push({
								start: Math.min(f, a - d),
								end: a - d + h - 1
							}), Math.min(f, a - d) === f) break;
						b = 0, ++c
					}
					b += this._core.mergers(this._core.relative(a))
				}
		}, b.prototype.draw = function () {
			var b, c = this._core.settings,
				d = this._core.items().length <= c.items,
				e = this._core.relative(this._core.current()),
				f = c.loop || c.rewind;
			this._controls.$relative.toggleClass("disabled", !c.nav || d), c.nav && (this._controls.$previous.toggleClass("disabled", !f && e <= this._core.minimum(!0)), this._controls.$next.toggleClass("disabled", !f && e >= this._core.maximum(!0))), this._controls.$absolute.toggleClass("disabled", !c.dots || d), c.dots && (b = this._pages.length - this._controls.$absolute.children().length, c.dotsData && 0 !== b ? this._controls.$absolute.html(this._templates.join("")) : b > 0 ? this._controls.$absolute.append(new Array(b + 1).join(this._templates[0])) : 0 > b && this._controls.$absolute.children().slice(b).remove(), this._controls.$absolute.find(".active").removeClass("active"), this._controls.$absolute.children().eq(a.inArray(this.current(), this._pages)).addClass("active"))
		}, b.prototype.onTrigger = function (b) {
			var c = this._core.settings;
			b.page = {
				index: a.inArray(this.current(), this._pages),
				count: this._pages.length,
				size: c && (c.center || c.autoWidth || c.dotsData ? 1 : c.dotsEach || c.items)
			}
		}, b.prototype.current = function () {
			var b = this._core.relative(this._core.current());
			return a.grep(this._pages, a.proxy(function (a) {
				return a.start <= b && a.end >= b
			}, this)).pop()
		}, b.prototype.getPosition = function (b) {
			var c, d, e = this._core.settings;
			return "page" == e.slideBy ? (c = a.inArray(this.current(), this._pages), d = this._pages.length, b ? ++c : --c, c = this._pages[(c % d + d) % d].start) : (c = this._core.relative(this._core.current()), d = this._core.items().length, b ? c += e.slideBy : c -= e.slideBy), c
		}, b.prototype.next = function (b) {
			a.proxy(this._overrides.to, this._core)(this.getPosition(!0), b)
		}, b.prototype.prev = function (b) {
			a.proxy(this._overrides.to, this._core)(this.getPosition(!1), b)
		}, b.prototype.to = function (b, c, d) {
			var e;
			!d && this._pages.length ? (e = this._pages.length, a.proxy(this._overrides.to, this._core)(this._pages[(b % e + e) % e].start, c)) : a.proxy(this._overrides.to, this._core)(b, c)
		}, a.fn.owlCarousel.Constructor.Plugins.Navigation = b
	}(window.Zepto || window.jQuery, window, document),
	function (a, b, c, d) {
		"use strict";
		var e = function (c) {
			this._core = c, this._hashes = {}, this.$element = this._core.$element, this._handlers = {
				"initialized.owl.carousel": a.proxy(function (c) {
					c.namespace && "URLHash" === this._core.settings.startPosition && a(b).trigger("hashchange.owl.navigation")
				}, this),
				"prepared.owl.carousel": a.proxy(function (b) {
					if (b.namespace) {
						var c = a(b.content).find("[data-hash]").addBack("[data-hash]").attr("data-hash");
						if (!c) return;
						this._hashes[c] = b.content
					}
				}, this),
				"changed.owl.carousel": a.proxy(function (c) {
					if (c.namespace && "position" === c.property.name) {
						var d = this._core.items(this._core.relative(this._core.current())),
							e = a.map(this._hashes, function (a, b) {
								return a === d ? b : null
							}).join();
						if (!e || b.location.hash.slice(1) === e) return;
						b.location.hash = e
					}
				}, this)
			}, this._core.options = a.extend({}, e.Defaults, this._core.options), this.$element.on(this._handlers), a(b).on("hashchange.owl.navigation", a.proxy(function () {
				var a = b.location.hash.substring(1),
					c = this._core.$stage.children(),
					e = this._hashes[a] && c.index(this._hashes[a]);
				e !== d && e !== this._core.current() && this._core.to(this._core.relative(e), !1, !0)
			}, this))
		};
		e.Defaults = {
			URLhashListener: !1
		}, e.prototype.destroy = function () {
			var c, d;
			a(b).off("hashchange.owl.navigation");
			for (c in this._handlers) this._core.$element.off(c, this._handlers[c]);
			for (d in Object.getOwnPropertyNames(this)) "function" != typeof this[d] && (this[d] = null)
		}, a.fn.owlCarousel.Constructor.Plugins.Hash = e
	}(window.Zepto || window.jQuery, window, document),
	function (a, b, c, d) {
		function e(b, c) {
			var e = !1,
				f = b.charAt(0).toUpperCase() + b.slice(1);
			return a.each((b + " " + h.join(f + " ") + f).split(" "), function (a, b) {
				return g[b] !== d ? (e = !c || b, !1) : void 0
			}), e
		}

		function f(a) {
			return e(a, !0)
		}
		var g = a("<support>").get(0).style,
			h = "Webkit Moz O ms".split(" "),
			i = {
				transition: {
					end: {
						WebkitTransition: "webkitTransitionEnd",
						MozTransition: "transitionend",
						OTransition: "oTransitionEnd",
						transition: "transitionend"
					}
				},
				animation: {
					end: {
						WebkitAnimation: "webkitAnimationEnd",
						MozAnimation: "animationend",
						OAnimation: "oAnimationEnd",
						animation: "animationend"
					}
				}
			},
			j = {
				csstransforms: function () {
					return !!e("transform")
				},
				csstransforms3d: function () {
					return !!e("perspective")
				},
				csstransitions: function () {
					return !!e("transition")
				},
				cssanimations: function () {
					return !!e("animation")
				}
			};
		j.csstransitions() && (a.support.transition = new String(f("transition")), a.support.transition.end = i.transition.end[a.support.transition]), j.cssanimations() && (a.support.animation = new String(f("animation")), a.support.animation.end = i.animation.end[a.support.animation]), j.csstransforms() && (a.support.transform = new String(f("transform")), a.support.transform3d = j.csstransforms3d())
	}(window.Zepto || window.jQuery, window, document),
	function () {
		"use strict";

		function a(a, c) {
			if (this.el = a, this.$el = $(a), this.s = $.extend({}, b, c), this.s.dynamic && "undefined" !== this.s.dynamicEl && this.s.dynamicEl.constructor === Array && !this.s.dynamicEl.length) throw "When using dynamic mode, you must also define dynamicEl as an Array.";
			return this.modules = {}, this.lGalleryOn = !1, this.lgBusy = !1, this.hideBartimeout = !1, this.isTouch = "ontouchstart" in document.documentElement, this.s.slideEndAnimatoin && (this.s.hideControlOnEnd = !1), this.$items = this.s.dynamic ? this.s.dynamicEl : "this" === this.s.selector ? this.$el : "" !== this.s.selector ? this.s.selectWithin ? $(this.s.selectWithin).find(this.s.selector) : this.$el.find($(this.s.selector)) : this.$el.children(), this.$slide = "", this.$outer = "", this.init(), this
		}
		var b = {
			mode: "lg-slide",
			cssEasing: "ease",
			easing: "linear",
			speed: 600,
			height: "100%",
			width: "100%",
			addClass: "",
			startClass: "lg-start-zoom",
			backdropDuration: 150,
			hideBarsDelay: 6e3,
			useLeft: !1,
			closable: !0,
			loop: !0,
			escKey: !0,
			keyPress: !0,
			controls: !0,
			slideEndAnimatoin: !0,
			hideControlOnEnd: !1,
			mousewheel: !0,
			getCaptionFromTitleOrAlt: !0,
			appendSubHtmlTo: ".lg-sub-html",
			subHtmlSelectorRelative: !1,
			preload: 1,
			showAfterLoad: !0,
			selector: "",
			selectWithin: "",
			nextHtml: "",
			prevHtml: "",
			index: !1,
			iframeMaxWidth: "100%",
			download: !0,
			counter: !0,
			appendCounterTo: ".lg-toolbar",
			swipeThreshold: 50,
			enableSwipe: !0,
			enableDrag: !0,
			dynamic: !1,
			dynamicEl: [],
			galleryId: 1
		};
		a.prototype.init = function () {
			var a = this;
			a.s.preload > a.$items.length && (a.s.preload = a.$items.length);
			var b = window.location.hash;
			b.indexOf("lg=" + this.s.galleryId) > 0 && (a.index = parseInt(b.split("&slide=")[1], 10), $("body").addClass("lg-from-hash"), $("body").hasClass("lg-on") || (setTimeout(function () {
				a.build(a.index)
			}), $("body").addClass("lg-on"))), a.s.dynamic ? (a.$el.trigger("onBeforeOpen.lg"), a.index = a.s.index || 0, $("body").hasClass("lg-on") || setTimeout(function () {
				a.build(a.index), $("body").addClass("lg-on")
			})) : a.$items.on("click.lgcustom", function (b) {
				try {
					b.preventDefault(), b.preventDefault()
				} catch (c) {
					b.returnValue = !1
				}
				a.$el.trigger("onBeforeOpen.lg"), a.index = a.s.index || a.$items.index(this), $("body").hasClass("lg-on") || (a.build(a.index), $("body").addClass("lg-on"))
			})
		}, a.prototype.build = function (a) {
			var b = this;
			b.structure(), $.each($.fn.lightGallery.modules, function (a) {
				b.modules[a] = new $.fn.lightGallery.modules[a](b.el)
			}), b.slide(a, !1, !1, !1), b.s.keyPress && b.keyPress(), b.$items.length > 1 && (b.arrow(), setTimeout(function () {
				b.enableDrag(), b.enableSwipe()
			}, 50), b.s.mousewheel && b.mousewheel()), b.counter(), b.closeGallery(), b.$el.trigger("onAfterOpen.lg"), b.$outer.on("mousemove.lg click.lg touchstart.lg", function () {
				b.$outer.removeClass("lg-hide-items"), clearTimeout(b.hideBartimeout), b.hideBartimeout = setTimeout(function () {
					b.$outer.addClass("lg-hide-items")
				}, b.s.hideBarsDelay)
			}), b.$outer.trigger("mousemove.lg")
		}, a.prototype.structure = function () {
			var a, b = "",
				c = "",
				d = 0,
				e = "",
				f = this;
			for ($("body").append('<div class="lg-backdrop"></div>'), $(".lg-backdrop").css("transition-duration", this.s.backdropDuration + "ms"), d = 0; d < this.$items.length; d++) b += '<div class="lg-item"></div>';
			if (this.s.controls && this.$items.length > 1 && (c = '<div class="lg-actions"><div class="lg-prev lg-icon">' + this.s.prevHtml + '</div><div class="lg-next lg-icon">' + this.s.nextHtml + "</div></div>"), ".lg-sub-html" === this.s.appendSubHtmlTo && (e = '<div class="lg-sub-html"></div>'), a = '<div class="lg-outer ' + this.s.addClass + " " + this.s.startClass + '"><div class="lg" style="width:' + this.s.width + "; height:" + this.s.height + '"><div class="lg-inner">' + b + '</div><div class="lg-toolbar lg-group"><span class="lg-close lg-icon"></span></div>' + c + e + "</div></div>", $("body").append(a), this.$outer = $(".lg-outer"), this.$slide = this.$outer.find(".lg-item"), this.s.useLeft ? (this.$outer.addClass("lg-use-left"), this.s.mode = "lg-slide") : this.$outer.addClass("lg-use-css3"), f.setTop(), $(window).on("resize.lg orientationchange.lg", function () {
					setTimeout(function () {
						f.setTop()
					}, 100)
				}), this.$slide.eq(this.index).addClass("lg-current"), this.doCss() ? this.$outer.addClass("lg-css3") : (this.$outer.addClass("lg-css"), this.s.speed = 0), this.$outer.addClass(this.s.mode), this.s.enableDrag && this.$items.length > 1 && this.$outer.addClass("lg-grab"), this.s.showAfterLoad && this.$outer.addClass("lg-show-after-load"), this.doCss()) {
				var g = this.$outer.find(".lg-inner");
				g.css("transition-timing-function", this.s.cssEasing), g.css("transition-duration", this.s.speed + "ms")
			}
			setTimeout(function () {
				$(".lg-backdrop").addClass("in")
			}), setTimeout(function () {
				f.$outer.addClass("lg-visible")
			}, this.s.backdropDuration), this.s.download && this.$outer.find(".lg-toolbar").append('<a id="lg-download" target="_blank" download class="lg-download lg-icon"></a>'), this.prevScrollTop = $(window).scrollTop()
		}, a.prototype.setTop = function () {
			if ("100%" !== this.s.height) {
				var a = $(window).height(),
					b = (a - parseInt(this.s.height, 10)) / 2,
					c = this.$outer.find(".lg");
				a >= parseInt(this.s.height, 10) ? c.css("top", b + "px") : c.css("top", "0px")
			}
		}, a.prototype.doCss = function () {
			var a = function () {
				var a = ["transition", "MozTransition", "WebkitTransition", "OTransition", "msTransition", "KhtmlTransition"],
					b = document.documentElement,
					c = 0;
				for (c = 0; c < a.length; c++)
					if (a[c] in b.style) return !0
			};
			return a() ? !0 : !1
		}, a.prototype.isVideo = function (a, b) {
			var c;
			if (c = this.s.dynamic ? this.s.dynamicEl[b].html : this.$items.eq(b).attr("data-html"), !a && c) return {
				html5: !0
			};
			var d = a.match(/\/\/(?:www\.)?youtu(?:\.be|be\.com)\/(?:watch\?v=|embed\/)?([a-z0-9\-\_\%]+)/i),
				e = a.match(/\/\/(?:www\.)?vimeo.com\/([0-9a-z\-_]+)/i),
				f = a.match(/\/\/(?:www\.)?dai.ly\/([0-9a-z\-_]+)/i),
				g = a.match(/\/\/(?:www\.)?(?:vk\.com|vkontakte\.ru)\/(?:video_ext\.php\?)(.*)/i);
			return d ? {
				youtube: d
			} : e ? {
				vimeo: e
			} : f ? {
				dailymotion: f
			} : g ? {
				vk: g
			} : void 0
		}, a.prototype.counter = function () {
			this.s.counter && $(this.s.appendCounterTo).append('<div id="lg-counter"><span id="lg-counter-current">' + (parseInt(this.index, 10) + 1) + '</span> / <span id="lg-counter-all">' + this.$items.length + "</span></div>")
		}, a.prototype.addHtml = function (a) {
			var b, c, d = null;
			if (this.s.dynamic ? this.s.dynamicEl[a].subHtmlUrl ? b = this.s.dynamicEl[a].subHtmlUrl : d = this.s.dynamicEl[a].subHtml : (c = this.$items.eq(a), c.attr("data-sub-html-url") ? b = c.attr("data-sub-html-url") : (d = c.attr("data-sub-html"), this.s.getCaptionFromTitleOrAlt && !d && (d = c.attr("title") || c.find("img").first().attr("alt")))), !b)
				if ("undefined" != typeof d && null !== d) {
					var e = d.substring(0, 1);
					("." === e || "#" === e) && (d = this.s.subHtmlSelectorRelative && !this.s.dynamic ? c.find(d).html() : $(d).html())
				} else d = "";
			".lg-sub-html" === this.s.appendSubHtmlTo ? b ? this.$outer.find(this.s.appendSubHtmlTo).load(b) : this.$outer.find(this.s.appendSubHtmlTo).html(d) : b ? this.$slide.eq(a).load(b) : this.$slide.eq(a).append(d), "undefined" != typeof d && null !== d && ("" === d ? this.$outer.find(this.s.appendSubHtmlTo).addClass("lg-empty-html") : this.$outer.find(this.s.appendSubHtmlTo).removeClass("lg-empty-html")), this.$el.trigger("onAfterAppendSubHtml.lg", [a])
		}, a.prototype.preload = function (a) {
			var b = 1,
				c = 1;
			for (b = 1; b <= this.s.preload && !(b >= this.$items.length - a); b++) this.loadContent(a + b, !1, 0);
			for (c = 1; c <= this.s.preload && !(0 > a - c); c++) this.loadContent(a - c, !1, 0)
		}, a.prototype.loadContent = function (a, b, c) {
			var d, e, f, g, h, i, j = this,
				k = !1,
				l = function (a) {
					for (var b = [], c = [], d = 0; d < a.length; d++) {
						var f = a[d].split(" ");
						"" === f[0] && f.splice(0, 1), c.push(f[0]), b.push(f[1])
					}
					for (var g = $(window).width(), h = 0; h < b.length; h++)
						if (parseInt(b[h], 10) > g) {
							e = c[h];
							break
						}
				};
			if (j.s.dynamic) {
				if (j.s.dynamicEl[a].poster && (k = !0, f = j.s.dynamicEl[a].poster), i = j.s.dynamicEl[a].html, e = j.s.dynamicEl[a].src, j.s.dynamicEl[a].responsive) {
					var m = j.s.dynamicEl[a].responsive.split(",");
					l(m)
				}
				g = j.s.dynamicEl[a].srcset, h = j.s.dynamicEl[a].sizes
			} else {
				if (j.$items.eq(a).attr("data-poster") && (k = !0, f = j.$items.eq(a).attr("data-poster")), i = j.$items.eq(a).attr("data-html"), e = j.$items.eq(a).attr("href") || j.$items.eq(a).attr("data-src"), j.$items.eq(a).attr("data-responsive")) {
					var n = j.$items.eq(a).attr("data-responsive").split(",");
					l(n)
				}
				g = j.$items.eq(a).attr("data-srcset"), h = j.$items.eq(a).attr("data-sizes")
			}
			var o = !1;
			j.s.dynamic ? j.s.dynamicEl[a].iframe && (o = !0) : "true" === j.$items.eq(a).attr("data-iframe") && (o = !0);
			var p = j.isVideo(e, a);
			if (!j.$slide.eq(a).hasClass("lg-loaded")) {
				if (o) j.$slide.eq(a).prepend('<div class="lg-video-cont" style="max-width:' + j.s.iframeMaxWidth + '"><div class="lg-video"><iframe class="lg-object" frameborder="0" src="' + e + '"  allowfullscreen="true"></iframe></div></div>');
				else if (k) {
					var q = "";
					q = p && p.youtube ? "lg-has-youtube" : p && p.vimeo ? "lg-has-vimeo" : "lg-has-html5", j.$slide.eq(a).prepend('<div class="lg-video-cont ' + q + ' "><div class="lg-video"><span class="lg-video-play"></span><img class="lg-object lg-has-poster" src="' + f + '" /></div></div>')
				} else p ? (j.$slide.eq(a).prepend('<div class="lg-video-cont "><div class="lg-video"></div></div>'), j.$el.trigger("hasVideo.lg", [a, e, i])) : j.$slide.eq(a).prepend('<div class="lg-img-wrap"><img class="lg-object lg-image" src="' + e + '" /></div>');
				if (j.$el.trigger("onAferAppendSlide.lg", [a]), d = j.$slide.eq(a).find(".lg-object"), h && d.attr("sizes", h), g) {
					d.attr("srcset", g);
					try {
						picturefill({
							elements: [d[0]]
						})
					} catch (r) {
						console.error("Make sure you have included Picturefill version 2")
					}
				}
				".lg-sub-html" !== this.s.appendSubHtmlTo && j.addHtml(a), j.$slide.eq(a).addClass("lg-loaded")
			}
			j.$slide.eq(a).find(".lg-object").on("load.lg error.lg", function () {
				var b = 0;
				c && !$("body").hasClass("lg-from-hash") && (b = c), setTimeout(function () {
					j.$slide.eq(a).addClass("lg-complete"), j.$el.trigger("onSlideItemLoad.lg", [a, c || 0])
				}, b)
			}), p && p.html5 && !k && j.$slide.eq(a).addClass("lg-complete"), b === !0 && (j.$slide.eq(a).hasClass("lg-complete") ? j.preload(a) : j.$slide.eq(a).find(".lg-object").on("load.lg error.lg", function () {
				j.preload(a)
			}))
		}, a.prototype.slide = function (a, b, c, d) {
			var e = this.$outer.find(".lg-current").index(),
				f = this;
			if (!f.lGalleryOn || e !== a) {
				var g = this.$slide.length,
					h = f.lGalleryOn ? this.s.speed : 0;
				if (!f.lgBusy) {
					if (this.s.download) {
						var i;
						i = f.s.dynamic ? f.s.dynamicEl[a].downloadUrl !== !1 && (f.s.dynamicEl[a].downloadUrl || f.s.dynamicEl[a].src) : "false" !== f.$items.eq(a).attr("data-download-url") && (f.$items.eq(a).attr("data-download-url") || f.$items.eq(a).attr("href") || f.$items.eq(a).attr("data-src")), i ? ($("#lg-download").attr("href", i), f.$outer.removeClass("lg-hide-download")) : f.$outer.addClass("lg-hide-download")
					}
					if (this.$el.trigger("onBeforeSlide.lg", [e, a, b, c]), f.lgBusy = !0, clearTimeout(f.hideBartimeout), ".lg-sub-html" === this.s.appendSubHtmlTo && setTimeout(function () {
							f.addHtml(a)
						}, h), this.arrowDisable(a), d || (e > a ? d = "prev" : a > e && (d = "next")), b) {
						this.$slide.removeClass("lg-prev-slide lg-current lg-next-slide");
						var j, k;
						g > 2 ? (j = a - 1, k = a + 1, 0 === a && e === g - 1 ? (k = 0, j = g - 1) : a === g - 1 && 0 === e && (k = 0, j = g - 1)) : (j = 0, k = 1), "prev" === d ? f.$slide.eq(k).addClass("lg-next-slide") : f.$slide.eq(j).addClass("lg-prev-slide"), f.$slide.eq(a).addClass("lg-current")
					} else f.$outer.addClass("lg-no-trans"), this.$slide.removeClass("lg-prev-slide lg-next-slide"), "prev" === d ? (this.$slide.eq(a).addClass("lg-prev-slide"), this.$slide.eq(e).addClass("lg-next-slide")) : (this.$slide.eq(a).addClass("lg-next-slide"), this.$slide.eq(e).addClass("lg-prev-slide")), setTimeout(function () {
						f.$slide.removeClass("lg-current"), f.$slide.eq(a).addClass("lg-current"), f.$outer.removeClass("lg-no-trans")
					}, 50);
					f.lGalleryOn ? (setTimeout(function () {
						f.loadContent(a, !0, 0)
					}, this.s.speed + 50), setTimeout(function () {
						f.lgBusy = !1, f.$el.trigger("onAfterSlide.lg", [e, a, b, c])
					}, this.s.speed)) : (f.loadContent(a, !0, f.s.backdropDuration), f.lgBusy = !1, f.$el.trigger("onAfterSlide.lg", [e, a, b, c])), f.lGalleryOn = !0, this.s.counter && $("#lg-counter-current").text(a + 1)
				}
			}
		}, a.prototype.goToNextSlide = function (a) {
			var b = this,
				c = b.s.loop;
			a && b.$slide.length < 3 && (c = !1), b.lgBusy || (b.index + 1 < b.$slide.length ? (b.index++, b.$el.trigger("onBeforeNextSlide.lg", [b.index]), b.slide(b.index, a, !1, "next")) : c ? (b.index = 0, b.$el.trigger("onBeforeNextSlide.lg", [b.index]), b.slide(b.index, a, !1, "next")) : b.s.slideEndAnimatoin && !a && (b.$outer.addClass("lg-right-end"), setTimeout(function () {
				b.$outer.removeClass("lg-right-end")
			}, 400)))
		}, a.prototype.goToPrevSlide = function (a) {
			var b = this,
				c = b.s.loop;
			a && b.$slide.length < 3 && (c = !1), b.lgBusy || (b.index > 0 ? (b.index--, b.$el.trigger("onBeforePrevSlide.lg", [b.index, a]), b.slide(b.index, a, !1, "prev")) : c ? (b.index = b.$items.length - 1, b.$el.trigger("onBeforePrevSlide.lg", [b.index, a]), b.slide(b.index, a, !1, "prev")) : b.s.slideEndAnimatoin && !a && (b.$outer.addClass("lg-left-end"), setTimeout(function () {
				b.$outer.removeClass("lg-left-end")
			}, 400)))
		}, a.prototype.keyPress = function () {
			var a = this;
			this.$items.length > 1 && $(window).on("keyup.lg", function (b) {
				a.$items.length > 1 && (37 === b.keyCode && (b.preventDefault(), a.goToPrevSlide()), 39 === b.keyCode && (b.preventDefault(), a.goToNextSlide()))
			}), $(window).on("keydown.lg", function (b) {
				a.s.escKey === !0 && 27 === b.keyCode && (b.preventDefault(), a.$outer.hasClass("lg-thumb-open") ? a.$outer.removeClass("lg-thumb-open") : a.destroy())
			})
		}, a.prototype.arrow = function () {
			var a = this;
			this.$outer.find(".lg-prev").on("click.lg", function () {
				a.goToPrevSlide()
			}), this.$outer.find(".lg-next").on("click.lg", function () {
				a.goToNextSlide()
			})
		}, a.prototype.arrowDisable = function (a) {
			!this.s.loop && this.s.hideControlOnEnd && (a + 1 < this.$slide.length ? this.$outer.find(".lg-next").removeAttr("disabled").removeClass("disabled") : this.$outer.find(".lg-next").attr("disabled", "disabled").addClass("disabled"), a > 0 ? this.$outer.find(".lg-prev").removeAttr("disabled").removeClass("disabled") : this.$outer.find(".lg-prev").attr("disabled", "disabled").addClass("disabled"))
		}, a.prototype.setTranslate = function (a, b, c) {
			this.s.useLeft ? a.css("left", b) : a.css({
				transform: "translate3d(" + b + "px, " + c + "px, 0px)"
			})
		}, a.prototype.touchMove = function (a, b) {
			var c = b - a;
			Math.abs(c) > 15 && (this.$outer.addClass("lg-dragging"), this.setTranslate(this.$slide.eq(this.index), c, 0), this.setTranslate($(".lg-prev-slide"), -this.$slide.eq(this.index).width() + c, 0), this.setTranslate($(".lg-next-slide"), this.$slide.eq(this.index).width() + c, 0))
		}, a.prototype.touchEnd = function (a) {
			var b = this;
			"lg-slide" !== b.s.mode && b.$outer.addClass("lg-slide"), this.$slide.not(".lg-current, .lg-prev-slide, .lg-next-slide").css("opacity", "0"), setTimeout(function () {
				b.$outer.removeClass("lg-dragging"), 0 > a && Math.abs(a) > b.s.swipeThreshold ? b.goToNextSlide(!0) : a > 0 && Math.abs(a) > b.s.swipeThreshold ? b.goToPrevSlide(!0) : Math.abs(a) < 5 && b.$el.trigger("onSlideClick.lg"), b.$slide.removeAttr("style")
			}), setTimeout(function () {
				b.$outer.hasClass("lg-dragging") || "lg-slide" === b.s.mode || b.$outer.removeClass("lg-slide")
			}, b.s.speed + 100)
		}, a.prototype.enableSwipe = function () {
			var a = this,
				b = 0,
				c = 0,
				d = !1;
			a.s.enableSwipe && a.isTouch && a.doCss() && (a.$slide.on("touchstart.lg", function (c) {
				a.$outer.hasClass("lg-zoomed") || a.lgBusy || (c.preventDefault(), a.manageSwipeClass(), b = c.originalEvent.targetTouches[0].pageX)
			}), a.$slide.on("touchmove.lg", function (e) {
				a.$outer.hasClass("lg-zoomed") || (e.preventDefault(), c = e.originalEvent.targetTouches[0].pageX, a.touchMove(b, c), d = !0)
			}), a.$slide.on("touchend.lg", function () {
				a.$outer.hasClass("lg-zoomed") || (d ? (d = !1, a.touchEnd(c - b)) : a.$el.trigger("onSlideClick.lg"))
			}))
		}, a.prototype.enableDrag = function () {
			var a = this,
				b = 0,
				c = 0,
				d = !1,
				e = !1;
			a.s.enableDrag && !a.isTouch && a.doCss() && (a.$slide.on("mousedown.lg", function (c) {
				a.$outer.hasClass("lg-zoomed") || ($(c.target).hasClass("lg-object") || $(c.target).hasClass("lg-video-play")) && (c.preventDefault(), a.lgBusy || (a.manageSwipeClass(), b = c.pageX, d = !0, a.$outer.scrollLeft += 1, a.$outer.scrollLeft -= 1, a.$outer.removeClass("lg-grab").addClass("lg-grabbing"), a.$el.trigger("onDragstart.lg")))
			}), $(window).on("mousemove.lg", function (f) {
				d && (e = !0, c = f.pageX, a.touchMove(b, c), a.$el.trigger("onDragmove.lg"))
			}), $(window).on("mouseup.lg", function (f) {
				e ? (e = !1, a.touchEnd(c - b), a.$el.trigger("onDragend.lg")) : ($(f.target).hasClass("lg-object") || $(f.target).hasClass("lg-video-play")) && a.$el.trigger("onSlideClick.lg"), d && (d = !1, a.$outer.removeClass("lg-grabbing").addClass("lg-grab"))
			}))
		}, a.prototype.manageSwipeClass = function () {
			var a = this.index + 1,
				b = this.index - 1;
			this.s.loop && this.$slide.length > 2 && (0 === this.index ? b = this.$slide.length - 1 : this.index === this.$slide.length - 1 && (a = 0)), this.$slide.removeClass("lg-next-slide lg-prev-slide"), b > -1 && this.$slide.eq(b).addClass("lg-prev-slide"), this.$slide.eq(a).addClass("lg-next-slide")
		}, a.prototype.mousewheel = function () {
			var a = this;
			a.$outer.on("mousewheel.lg", function (b) {
				b.deltaY && (b.deltaY > 0 ? a.goToPrevSlide() : a.goToNextSlide(), b.preventDefault())
			})
		}, a.prototype.closeGallery = function () {
			var a = this,
				b = !1;
			this.$outer.find(".lg-close").on("click.lg", function () {
				a.destroy()
			}), a.s.closable && (a.$outer.on("mousedown.lg", function (a) {
				b = $(a.target).is(".lg-outer") || $(a.target).is(".lg-item ") || $(a.target).is(".lg-img-wrap") ? !0 : !1
			}), a.$outer.on("mouseup.lg", function (c) {
				($(c.target).is(".lg-outer") || $(c.target).is(".lg-item ") || $(c.target).is(".lg-img-wrap") && b) && (a.$outer.hasClass("lg-dragging") || a.destroy())
			}))
		}, a.prototype.destroy = function (a) {
			var b = this;
			a || (b.$el.trigger("onBeforeClose.lg"), $(window).scrollTop(b.prevScrollTop)), a && (b.s.dynamic || this.$items.off("click.lg click.lgcustom"), $.removeData(b.el, "lightGallery")), this.$el.off(".lg.tm"), $.each($.fn.lightGallery.modules, function (a) {
				b.modules[a] && b.modules[a].destroy()
			}), this.lGalleryOn = !1, clearTimeout(b.hideBartimeout), this.hideBartimeout = !1, $(window).off(".lg"), $("body").removeClass("lg-on lg-from-hash"), b.$outer && b.$outer.removeClass("lg-visible"), $(".lg-backdrop").removeClass("in"), setTimeout(function () {
				b.$outer && b.$outer.remove(), $(".lg-backdrop").remove(), a || b.$el.trigger("onCloseAfter.lg")
			}, b.s.backdropDuration + 50)
		}, $.fn.lightGallery = function (b) {
			return this.each(function () {
				if ($.data(this, "lightGallery")) try {
					$(this).data("lightGallery").init()
				} catch (c) {
					console.error("lightGallery has not initiated properly")
				} else $.data(this, "lightGallery", new a(this, b))
			})
		}, $.fn.lightGallery.modules = {}
	}();
var accent_map = {
		"ẚ": "a",
		"Á": "a",
		"á": "a",
		"À": "a",
		"à": "a",
		"Ă": "a",
		"ă": "a",
		"Ắ": "a",
		"ắ": "a",
		"Ằ": "a",
		"ằ": "a",
		"Ẵ": "a",
		"ẵ": "a",
		"Ẳ": "a",
		"ẳ": "a",
		"Â": "a",
		"â": "a",
		"Ấ": "a",
		"ấ": "a",
		"Ầ": "a",
		"ầ": "a",
		"Ẫ": "a",
		"ẫ": "a",
		"Ẩ": "a",
		"ẩ": "a",
		"Ǎ": "a",
		"ǎ": "a",
		"Å": "a",
		"å": "a",
		"Ǻ": "a",
		"ǻ": "a",
		"Ä": "a",
		"ä": "a",
		"Ǟ": "a",
		"ǟ": "a",
		"Ã": "a",
		"ã": "a",
		"Ȧ": "a",
		"ȧ": "a",
		"Ǡ": "a",
		"ǡ": "a",
		"Ą": "a",
		"ą": "a",
		"Ā": "a",
		"ā": "a",
		"Ả": "a",
		"ả": "a",
		"Ȁ": "a",
		"ȁ": "a",
		"Ȃ": "a",
		"ȃ": "a",
		"Ạ": "a",
		"ạ": "a",
		"Ặ": "a",
		"ặ": "a",
		"Ậ": "a",
		"ậ": "a",
		"Ḁ": "a",
		"ḁ": "a",
		"Ⱥ": "a",
		"ⱥ": "a",
		"Ǽ": "a",
		"ǽ": "a",
		"Ǣ": "a",
		"ǣ": "a",
		"Ḃ": "b",
		"ḃ": "b",
		"Ḅ": "b",
		"ḅ": "b",
		"Ḇ": "b",
		"ḇ": "b",
		"Ƀ": "b",
		"ƀ": "b",
		"ᵬ": "b",
		"Ɓ": "b",
		"ɓ": "b",
		"Ƃ": "b",
		"ƃ": "b",
		"Ć": "c",
		"ć": "c",
		"Ĉ": "c",
		"ĉ": "c",
		"Č": "c",
		"č": "c",
		"Ċ": "c",
		"ċ": "c",
		"Ç": "c",
		"ç": "c",
		"Ḉ": "c",
		"ḉ": "c",
		"Ȼ": "c",
		"ȼ": "c",
		"Ƈ": "c",
		"ƈ": "c",
		"ɕ": "c",
		"Ď": "d",
		"ď": "d",
		"Ḋ": "d",
		"ḋ": "d",
		"Ḑ": "d",
		"ḑ": "d",
		"Ḍ": "d",
		"ḍ": "d",
		"Ḓ": "d",
		"ḓ": "d",
		"Ḏ": "d",
		"ḏ": "d",
		"Đ": "d",
		"đ": "d",
		"ᵭ": "d",
		"Ɖ": "d",
		"ɖ": "d",
		"Ɗ": "d",
		"ɗ": "d",
		"Ƌ": "d",
		"ƌ": "d",
		"ȡ": "d",
		"ð": "d",
		"É": "e",
		"Ə": "e",
		"Ǝ": "e",
		"ǝ": "e",
		"é": "e",
		"È": "e",
		"è": "e",
		"Ĕ": "e",
		"ĕ": "e",
		"Ê": "e",
		"ê": "e",
		"Ế": "e",
		"ế": "e",
		"Ề": "e",
		"ề": "e",
		"Ễ": "e",
		"ễ": "e",
		"Ể": "e",
		"ể": "e",
		"Ě": "e",
		"ě": "e",
		"Ë": "e",
		"ë": "e",
		"Ẽ": "e",
		"ẽ": "e",
		"Ė": "e",
		"ė": "e",
		"Ȩ": "e",
		"ȩ": "e",
		"Ḝ": "e",
		"ḝ": "e",
		"Ę": "e",
		"ę": "e",
		"Ē": "e",
		"ē": "e",
		"Ḗ": "e",
		"ḗ": "e",
		"Ḕ": "e",
		"ḕ": "e",
		"Ẻ": "e",
		"ẻ": "e",
		"Ȅ": "e",
		"ȅ": "e",
		"Ȇ": "e",
		"ȇ": "e",
		"Ẹ": "e",
		"ẹ": "e",
		"Ệ": "e",
		"ệ": "e",
		"Ḙ": "e",
		"ḙ": "e",
		"Ḛ": "e",
		"ḛ": "e",
		"Ɇ": "e",
		"ɇ": "e",
		"ɚ": "e",
		"ɝ": "e",
		"Ḟ": "f",
		"ḟ": "f",
		"ᵮ": "f",
		"Ƒ": "f",
		"ƒ": "f",
		"Ǵ": "g",
		"ǵ": "g",
		"Ğ": "g",
		"ğ": "g",
		"Ĝ": "g",
		"ĝ": "g",
		"Ǧ": "g",
		"ǧ": "g",
		"Ġ": "g",
		"ġ": "g",
		"Ģ": "g",
		"ģ": "g",
		"Ḡ": "g",
		"ḡ": "g",
		"Ǥ": "g",
		"ǥ": "g",
		"Ɠ": "g",
		"ɠ": "g",
		"Ĥ": "h",
		"ĥ": "h",
		"Ȟ": "h",
		"ȟ": "h",
		"Ḧ": "h",
		"ḧ": "h",
		"Ḣ": "h",
		"ḣ": "h",
		"Ḩ": "h",
		"ḩ": "h",
		"Ḥ": "h",
		"ḥ": "h",
		"Ḫ": "h",
		"ḫ": "h",
		"̱": "h",
		"ẖ": "h",
		"Ħ": "h",
		"ħ": "h",
		"Ⱨ": "h",
		"ⱨ": "h",
		"Í": "i",
		"í": "i",
		"Ì": "i",
		"ì": "i",
		"Ĭ": "i",
		"ĭ": "i",
		"Î": "i",
		"î": "i",
		"Ǐ": "i",
		"ǐ": "i",
		"Ï": "i",
		"ï": "i",
		"Ḯ": "i",
		"ḯ": "i",
		"Ĩ": "i",
		"ĩ": "i",
		"İ": "i",
		i: "i",
		"Į": "i",
		"į": "i",
		"Ī": "i",
		"ī": "i",
		"Ỉ": "i",
		"ỉ": "i",
		"Ȉ": "i",
		"ȉ": "i",
		"Ȋ": "i",
		"ȋ": "i",
		"Ị": "i",
		"ị": "i",
		"Ḭ": "i",
		"ḭ": "i",
		"ı": "i",
		"Ɨ": "i",
		"ɨ": "i",
		"Ĵ": "j",
		"ĵ": "j",
		"̌": "j",
		"ǰ": "j",
		"ȷ": "j",
		"Ɉ": "j",
		"ɉ": "j",
		"ʝ": "j",
		"ɟ": "j",
		"ʄ": "j",
		"Ḱ": "k",
		"ḱ": "k",
		"Ǩ": "k",
		"ǩ": "k",
		"Ķ": "k",
		"ķ": "k",
		"Ḳ": "k",
		"ḳ": "k",
		"Ḵ": "k",
		"ḵ": "k",
		"Ƙ": "k",
		"ƙ": "k",
		"Ⱪ": "k",
		"ⱪ": "k",
		"Ĺ": "a",
		"ĺ": "l",
		"Ľ": "l",
		"ľ": "l",
		"Ļ": "l",
		"ļ": "l",
		"Ḷ": "l",
		"ḷ": "l",
		"Ḹ": "l",
		"ḹ": "l",
		"Ḽ": "l",
		"ḽ": "l",
		"Ḻ": "l",
		"ḻ": "l",
		"Ł": "l",
		"ł": "l",
		"Ł": "l",
		"̣": "l",
		"ł": "l",
		"̣": "l",
		"Ŀ": "l",
		"ŀ": "l",
		"Ƚ": "l",
		"ƚ": "l",
		"Ⱡ": "l",
		"ⱡ": "l",
		"Ɫ": "l",
		"ɫ": "l",
		"ɬ": "l",
		"ɭ": "l",
		"ȴ": "l",
		"Ḿ": "m",
		"ḿ": "m",
		"Ṁ": "m",
		"ṁ": "m",
		"Ṃ": "m",
		"ṃ": "m",
		"ɱ": "m",
		"Ń": "n",
		"ń": "n",
		"Ǹ": "n",
		"ǹ": "n",
		"Ň": "n",
		"ň": "n",
		"Ñ": "N",
		"ñ": "n",
		"Ṅ": "n",
		"ṅ": "n",
		"Ņ": "n",
		"ņ": "n",
		"Ṇ": "n",
		"ṇ": "n",
		"Ṋ": "n",
		"ṋ": "n",
		"Ṉ": "n",
		"ṉ": "n",
		"Ɲ": "n",
		"ɲ": "n",
		"Ƞ": "n",
		"ƞ": "n",
		"ɳ": "n",
		"ȵ": "n",
		"̈": "n",
		n: "n",
		"̈": "n",
		"Ó": "o",
		"ó": "o",
		"Ò": "o",
		"ò": "o",
		"Ŏ": "o",
		"ŏ": "o",
		"Ô": "o",
		"ô": "o",
		"Ố": "o",
		"ố": "o",
		"Ồ": "o",
		"ồ": "o",
		"Ỗ": "o",
		"ỗ": "o",
		"Ổ": "o",
		"ổ": "o",
		"Ǒ": "o",
		"ǒ": "o",
		"Ö": "o",
		"ö": "o",
		"Ȫ": "o",
		"ȫ": "o",
		"Ő": "o",
		"ő": "o",
		"Õ": "o",
		"õ": "o",
		"Ṍ": "o",
		"ṍ": "o",
		"Ṏ": "o",
		"ṏ": "o",
		"Ȭ": "o",
		"ȭ": "o",
		"Ȯ": "o",
		"ȯ": "o",
		"Ȱ": "o",
		"ȱ": "o",
		"Ø": "o",
		"ø": "o",
		"Ǿ": "o",
		"ǿ": "o",
		"Ǫ": "o",
		"ǫ": "o",
		"Ǭ": "o",
		"ǭ": "o",
		"Ō": "o",
		"ō": "o",
		"Ṓ": "o",
		"ṓ": "o",
		"Ṑ": "o",
		"ṑ": "o",
		"Ỏ": "o",
		"ỏ": "o",
		"Ȍ": "o",
		"ȍ": "o",
		"Ȏ": "o",
		"ȏ": "o",
		"Ơ": "o",
		"ơ": "o",
		"Ớ": "o",
		"ớ": "o",
		"Ờ": "o",
		"ờ": "o",
		"Ỡ": "o",
		"ỡ": "o",
		"Ở": "o",
		"ở": "o",
		"Ợ": "o",
		"ợ": "o",
		"Ọ": "o",
		"ọ": "o",
		"Ộ": "o",
		"ộ": "o",
		"Ɵ": "o",
		"ɵ": "o",
		"Ṕ": "p",
		"ṕ": "p",
		"Ṗ": "p",
		"ṗ": "p",
		"Ᵽ": "p",
		"Ƥ": "p",
		"ƥ": "p",
		"̃": "p",
		p: "p",
		"̃": "p",
		"ʠ": "q",
		"Ɋ": "q",
		"ɋ": "q",
		"Ŕ": "r",
		"ŕ": "r",
		"Ř": "r",
		"ř": "r",
		"Ṙ": "r",
		"ṙ": "r",
		"Ŗ": "r",
		"ŗ": "r",
		"Ȑ": "r",
		"ȑ": "r",
		"Ȓ": "r",
		"ȓ": "r",
		"Ṛ": "r",
		"ṛ": "r",
		"Ṝ": "r",
		"ṝ": "r",
		"Ṟ": "r",
		"ṟ": "r",
		"Ɍ": "r",
		"ɍ": "r",
		"ᵲ": "r",
		"ɼ": "r",
		"Ɽ": "r",
		"ɽ": "r",
		"ɾ": "r",
		"ᵳ": "r",
		"ß": "s",
		"Ś": "s",
		"ś": "s",
		"Ṥ": "s",
		"ṥ": "s",
		"Ŝ": "s",
		"ŝ": "s",
		"Š": "s",
		"š": "s",
		"Ṧ": "s",
		"ṧ": "s",
		"Ṡ": "s",
		"ṡ": "s",
		"ẛ": "s",
		"Ş": "s",
		"ş": "s",
		"Ṣ": "s",
		"ṣ": "s",
		"Ṩ": "s",
		"ṩ": "s",
		"Ș": "s",
		"ș": "s",
		"ʂ": "s",
		"̩": "s",
		s: "s",
		"̩": "s",
		"Þ": "t",
		"þ": "t",
		"Ť": "t",
		"ť": "t",
		"̈": "t",
		"ẗ": "t",
		"Ṫ": "t",
		"ṫ": "t",
		"Ţ": "t",
		"ţ": "t",
		"Ṭ": "t",
		"ṭ": "t",
		"Ț": "t",
		"ț": "t",
		"Ṱ": "t",
		"ṱ": "t",
		"Ṯ": "t",
		"ṯ": "t",
		"Ŧ": "t",
		"ŧ": "t",
		"Ⱦ": "t",
		"ⱦ": "t",
		"ᵵ": "t",
		"ƫ": "t",
		"Ƭ": "t",
		"ƭ": "t",
		"Ʈ": "t",
		"ʈ": "t",
		"ȶ": "t",
		"Ú": "u",
		"ú": "u",
		"Ù": "u",
		"ù": "u",
		"Ŭ": "u",
		"ŭ": "u",
		"Û": "u",
		"û": "u",
		"Ǔ": "u",
		"ǔ": "u",
		"Ů": "u",
		"ů": "u",
		"Ü": "u",
		"ü": "u",
		"Ǘ": "u",
		"ǘ": "u",
		"Ǜ": "u",
		"ǜ": "u",
		"Ǚ": "u",
		"ǚ": "u",
		"Ǖ": "u",
		"ǖ": "u",
		"Ű": "u",
		"ű": "u",
		"Ũ": "u",
		"ũ": "u",
		"Ṹ": "u",
		"ṹ": "u",
		"Ų": "u",
		"ų": "u",
		"Ū": "u",
		"ū": "u",
		"Ṻ": "u",
		"ṻ": "u",
		"Ủ": "u",
		"ủ": "u",
		"Ȕ": "u",
		"ȕ": "u",
		"Ȗ": "u",
		"ȗ": "u",
		"Ư": "u",
		"ư": "u",
		"Ứ": "u",
		"ứ": "u",
		"Ừ": "u",
		"ừ": "u",
		"Ữ": "u",
		"ữ": "u",
		"Ử": "u",
		"ử": "u",
		"Ự": "u",
		"ự": "u",
		"Ụ": "u",
		"ụ": "u",
		"Ṳ": "u",
		"ṳ": "u",
		"Ṷ": "u",
		"ṷ": "u",
		"Ṵ": "u",
		"ṵ": "u",
		"Ʉ": "u",
		"ʉ": "u",
		"Ṽ": "v",
		"ṽ": "v",
		"Ṿ": "v",
		"ṿ": "v",
		"Ʋ": "v",
		"ʋ": "v",
		"Ẃ": "w",
		"ẃ": "w",
		"Ẁ": "w",
		"ẁ": "w",
		"Ŵ": "w",
		"ŵ": "w",
		"̊": "w",
		"ẘ": "w",
		"Ẅ": "w",
		"ẅ": "w",
		"Ẇ": "w",
		"ẇ": "w",
		"Ẉ": "w",
		"ẉ": "w",
		"Ẍ": "x",
		"ẍ": "x",
		"Ẋ": "x",
		"ẋ": "x",
		"Ý": "y",
		"ý": "y",
		"Ỳ": "y",
		"ỳ": "y",
		"Ŷ": "y",
		"ŷ": "y",
		"̊": "y",
		"ẙ": "y",
		"Ÿ": "y",
		"ÿ": "y",
		"Ỹ": "y",
		"ỹ": "y",
		"Ẏ": "y",
		"ẏ": "y",
		"Ȳ": "y",
		"ȳ": "y",
		"Ỷ": "y",
		"ỷ": "y",
		"Ỵ": "y",
		"ỵ": "y",
		"ʏ": "y",
		"Ɏ": "y",
		"ɏ": "y",
		"Ƴ": "y",
		"ƴ": "y",
		"Ź": "z",
		"ź": "z",
		"Ẑ": "z",
		"ẑ": "z",
		"Ž": "z",
		"ž": "z",
		"Ż": "z",
		"ż": "z",
		"Ẓ": "z",
		"ẓ": "z",
		"Ẕ": "z",
		"ẕ": "z",
		"Ƶ": "z",
		"ƶ": "z",
		"Ȥ": "z",
		"ȥ": "z",
		"ʐ": "z",
		"ʑ": "z",
		"Ⱬ": "z",
		"ⱬ": "z",
		"Ǯ": "z",
		"ǯ": "z",
		"ƺ": "z",
		"２": "2",
		"６": "6",
		"Ｂ": "B",
		"Ｆ": "F",
		"Ｊ": "J",
		"Ｎ": "N",
		"Ｒ": "R",
		"Ｖ": "V",
		"Ｚ": "Z",
		"ｂ": "b",
		"ｆ": "f",
		"ｊ": "j",
		"ｎ": "n",
		"ｒ": "r",
		"ｖ": "v",
		"ｚ": "z",
		"１": "1",
		"５": "5",
		"９": "9",
		"Ａ": "A",
		"Ｅ": "E",
		"Ｉ": "I",
		"Ｍ": "M",
		"Ｑ": "Q",
		"Ｕ": "U",
		"Ｙ": "Y",
		"ａ": "a",
		"ｅ": "e",
		"ｉ": "i",
		"ｍ": "m",
		"ｑ": "q",
		"ｕ": "u",
		"ｙ": "y",
		"０": "0",
		"４": "4",
		"８": "8",
		"Ｄ": "D",
		"Ｈ": "H",
		"Ｌ": "L",
		"Ｐ": "P",
		"Ｔ": "T",
		"Ｘ": "X",
		"ｄ": "d",
		"ｈ": "h",
		"ｌ": "l",
		"ｐ": "p",
		"ｔ": "t",
		"ｘ": "x",
		"３": "3",
		"７": "7",
		"Ｃ": "C",
		"Ｇ": "G",
		"Ｋ": "K",
		"Ｏ": "O",
		"Ｓ": "S",
		"Ｗ": "W",
		"ｃ": "c",
		"ｇ": "g",
		"ｋ": "k",
		"ｏ": "o",
		"ｓ": "s",
		"ｗ": "w"
	},
	accentMap = {
		"á": "a",
		"é": "e",
		"í": "i",
		"ó": "o",
		"ú": "u"
	};
$(function () {
		function centerModal(a, b) {
			"undefined" != typeof b && b instanceof jQuery || (b = $(this)), b.css("display", "block");
			var c = b.find(".modal-dialog"),
				d = ($window.height() - c.height()) / 2,
				e = parseInt(c.css("marginBottom"), 10);
			e > d && (d = e), c.css("margin-top", d)
		}

		function hideMenu() {
			$(".side-nav").removeClass("open"), $("body").removeClass("open left right"), $("#menu_overlay").fadeOut(), $(".mobile-nav-links > ul").removeClass("open"), $(".mobileNavWrapper, .wrapper, .header, .footer").hasClass("showNav") && $(".mobileNavWrapper, .wrapper, .header, .footer").removeClass("showNav")
		}

		function initBookingLang() {
			sendAjax({
				url: "https://booking.baolau.com/" + lang,
				with_credentials: !0
			})
		}

		function initHomepage() {
			"#contact" == window.location.hash && $("#Contact_popup").modal(), $window.load(function () {
				var a = 0;
				$("#js_landing_cs_reviews__carousel.js_3col_carousel .card__item__content").each(function () {
					$(this).height() > a && (a = $(this).height())
				}).height(a)
			}), $("#carto-iframe .btn-tab > a").click(function () {
				var a = $(this).attr("frame"),
					b = $("#" + a),
					c = b.find("iframe"),
					d = c.attr("src");
				if ("" == d) {
					var e = "";
					"map-plane" == a ? e = "https://carto.baolau.com/user/mapsbaolau/builder/ad423b39-ef6b-4ffd-9c25-d1fc56b00e3f/embed" : "map-train" == a ? e = "https://carto.baolau.com/user/mapsbaolau/builder/b19a17e8-8034-49f9-9427-ccc12b2a64ba/embed" : "map-bus" == a ? e = "https://carto.baolau.com/user/mapsbaolau/builder/139b06ec-aeac-4778-b8b5-c386bc049c34/embed" : "map-boat" == a && (e = "https://carto.baolau.com/user/mapsbaolau/builder/29a5b6bc-020e-4d0c-b14c-00c8188a2a22/embed"), c.attr("src", e)
				}
			}), $(window).on("scroll", function () {
				var a = $(".js-carto-scroll:visible").position();
				if (a) {
					var b = a.top - 800;
					$(window).scrollTop() > b && !$(".js-carto-scroll:visible").hasClass("carto_triggered") && ($(".js-carto-scroll:visible").addClass("carto_triggered"), $("#carto-iframe .btn-tab.active > a").trigger("click"))
				}
			})
		}

		function initLandingBanner() {
			var a = !1,
				b = function () {
					a || (a = !0, $("#js-banner-carousel").addClass("owl-carousel owl-theme landing-banner__carousel"), $(".js-landing-banner .item").show(), $("#js-banner-carousel").owlCarousel({
						items: 1,
						autoplay: !0,
						dots: !0,
						loop: !0,
						autoplayTimeout: 5e3,
						autoplaySpeed: 500
					}))
				};
			$(".js-landing-banner .item").eq(0).find("img").load(b), isMobile() || setTimeout(b, 2e3), $window.resize(function () {
				var a = 1280 / 720,
					b = 200,
					c = $window.height() - $(".js-landing-banner__footer").height() - 50,
					d = $window.width() / a,
					e = $(".js-landing-banner--size .video:visible");
				if (b > c && (c = b), d > c) e.css({
					top: -(d - c) / 2,
					left: 0,
					width: "100%",
					height: ""
				});
				else {
					var f = a * c;
					e.css({
						top: 0,
						left: -(f - $window.width()) / 2,
						width: f,
						height: "100%"
					})
				}
				$(".js-landing-banner, .js-landing-banner .item img").height(c)
			}), $(".js-btn--srcolldown").click(function () {
				scrollToElement($(".js-scrollto-section"), -30)
			})
		}

		function initOwlCarousel() {
			$(".js_3col_carousel").owlCarousel({
				items: 3,
				autoplay: !0,
				margin: 15,
				dots: !0,
				rewind: !0,
				responsiveClass: !0,
				responsive: {
					0: {
						items: 1
					},
					768: {
						items: 2
					},
					1024: {
						items: 3
					},
					1700: {
						items: 4
					}
				}
			}), $(".js_3col_carousel_no_autoplay").owlCarousel({
				items: 3,
				autoplay: !1,
				margin: 15,
				dots: !0,
				rewind: !0,
				responsiveClass: !0,
				responsive: {
					0: {
						items: 1
					},
					768: {
						items: 2
					},
					1024: {
						items: 3
					},
					1700: {
						items: 4
					}
				}
			}), $(".js_single_carousel").owlCarousel({
				items: 1,
				autoplay: !1,
				dots: !0,
				loop: !0
			})
		}

		function inittransport() {
			var a = location.hash;
			if ("" != a) {
				var b = $('[href="' + a + '"]').closest(".tab-pane-transport-detail");
				if (1 == b.length) {
					$(".tab-pane-transport-detail").removeClass("active"), $('[href="' + a + '"]').closest(".tab-pane-transport-detail").addClass("active"), $("#transport-types-link > li").removeClass("active");
					var c = b.attr("id");
					$('[href="#' + c + '"]').closest("li").addClass("active")
				}
			}
			$(".carousel-grid").owlCarousel({
				items: 3,
				margin: 15,
				dots: !0,
				rewind: !0,
				responsiveClass: !0,
				responsive: {
					0: {
						items: 1
					},
					768: {
						items: 2
					},
					1024: {
						items: 3
					}
				}
			})
		}

		function inittransportation() {
			$("#js-carto-transportation-iframe .btn-tab > a").click(function () {
				var a = $(this).attr("frame"),
					b = $("#" + a),
					c = b.find("iframe"),
					d = c.attr("src");
				if ("" == d) {
					var e = "";
					"map-plane-asia" == a ? e = "https://carto.baolau.com/user/mapsbaolau/builder/ad423b39-ef6b-4ffd-9c25-d1fc56b00e3f/embed" : "map-train-asia" == a ? e = "https://carto.baolau.com/user/mapsbaolau/builder/b19a17e8-8034-49f9-9427-ccc12b2a64ba/embed" : "map-bus-asia" == a ? e = "https://carto.baolau.com/user/mapsbaolau/builder/139b06ec-aeac-4778-b8b5-c386bc049c34/embed" : "map-boat-asia" == a ? e = "https://carto.baolau.com/user/mapsbaolau/builder/29a5b6bc-020e-4d0c-b14c-00c8188a2a22/embed" : "map-plane-vn" == a ? e = "https://carto.baolau.com/user/mapsbaolau/builder/139b06ec-aeac-4778-b8b5-c386bc049c34/embed" : "map-train-vn" == a ? e = "https://carto.baolau.com/user/mapsbaolau/builder/551edc66-60be-4a1f-b1ae-39a691df2965/embed" : "map-bus-vn" == a ? e = "https://carto.baolau.com/user/mapsbaolau/builder/8eb844b8-6d97-46e1-9839-b15ef36ea2f7/embed" : "map-boat-vn" == a ? e = "https://carto.baolau.com/user/mapsbaolau/builder/14027b32-caf3-46f3-93ac-7389c8724f4b/embed" : "map-plane-cn" == a ? e = "https://carto.baolau.com/user/mapsbaolau/builder/d59bed40-1ae5-4118-bc86-c1f030ef76b2/embed" : "map-train-cn" == a ? e = "https://carto.baolau.com/user/mapsbaolau/builder/72fab6ce-8569-4fa0-8887-5af7cb4b04ef/embed" : "map-bus-cn" == a ? e = "https://carto.baolau.com/user/mapsbaolau/builder/d9dfa52c-7ce6-4900-8848-b089486e29cb/embed" : "map-plane-tw" == a ? e = "" : "map-train-tw" == a ? e = "" : "map-plane-kh" == a ? e = "https://carto.baolau.com/user/mapsbaolau/builder/4d9be86c-30b4-49aa-906c-59c217c7d7e2/embed" : "map-train-kh" == a ? e = "https://carto.baolau.com/user/mapsbaolau/builder/f08c62c2-d8c3-4a5a-b9e3-8f002d958c0b/embed" : "map-bus-kh" == a ? e = "https://carto.baolau.com/user/mapsbaolau/builder/0075b14c-0bc5-4db9-8e2f-dbaa5aacb6b3/embed" : "map-boat-kh" == a ? e = "https://carto.baolau.com/user/mapsbaolau/builder/4ea1bea2-9b4c-4988-b7ce-d2d6b9326c8b/embed" : "map-plane-la" == a ? e = "https://carto.baolau.com/user/mapsbaolau/builder/6f8db4e9-bd44-4a5d-aacf-c1143ca1ee2d/embed" : "map-bus-la" == a ? e = "https://carto.baolau.com/user/mapsbaolau/builder/cedc6622-2b8b-41f7-880b-b3d69348a8d0/embed" : "map-boat-la" == a ? e = "" : "map-plane-jp" == a ? e = "" : "map-train-jp" == a ? e = "" : "map-plane-kr" == a ? e = "" : "map-plane-th" == a ? e = "https://carto.baolau.com/user/mapsbaolau/builder/19a8bef8-c28a-4aec-b4f9-44e249d78ce7/embed" : "map-train-th" == a ? e = "https://carto.baolau.com/user/mapsbaolau/builder/0f5c1355-db87-4858-9aa0-d21522f53e46/embed" : "map-bus-th" == a ? e = "https://carto.baolau.com/user/mapsbaolau/builder/9d239a6c-666b-4c5f-8df1-51eaff314c4f/embed" : "map-boat-th" == a ? e = "https://carto.baolau.com/user/mapsbaolau/builder/cbf415b0-04d1-4566-9769-7e562ae25431/embed" : "map-plane-mm" == a ? e = "https://carto.baolau.com/user/mapsbaolau/builder/96760b84-1598-4d46-bb4f-38fcacb8befa/embed" : "map-bus-mm" == a ? e = "https://carto.baolau.com/user/mapsbaolau/builder/db2eeb13-8fb4-40a9-af1a-cee7840379ee/embed" : "map-plane-my" == a ? e = "https://carto.baolau.com/user/mapsbaolau/builder/8dabaa37-8327-441f-a5d5-c587ae60cc3b/embed" : "map-train-my" == a ? e = "https://carto.baolau.com/user/mapsbaolau/builder/cd21683e-5329-45ef-aa4d-7e83096f1008/embed" : "map-bus-my" == a ? e = "" : "map-plane-id" == a ? e = "" : "map-plane-ph" == a && (e = "https://carto.baolau.com/user/mapsbaolau/builder/8914b969-1357-4b98-af70-12e5e39acea5/embed"), c.attr("src", e)
				}
			}), $("#map_plane_asia").length && $("#map_plane_asia").attr("src", "https://carto.baolau.com/user/mapsbaolau/builder/ad423b39-ef6b-4ffd-9c25-d1fc56b00e3f/embed"), $("#map_train_asia").length && $("#map_train_asia").attr("src", "https://carto.baolau.com/user/mapsbaolau/builder/b19a17e8-8034-49f9-9427-ccc12b2a64ba/embed"), $("#map_bus_asia").length && $("#map_bus_asia").attr("src", "https://carto.baolau.com/user/mapsbaolau/builder/139b06ec-aeac-4778-b8b5-c386bc049c34/embed"), $("#map_boat_asia").length && $("#map_boat_asia").attr("src", "https://carto.baolau.com/user/mapsbaolau/builder/29a5b6bc-020e-4d0c-b14c-00c8188a2a22/embed"), $("#map_plane_vn").length && $("#map_plane_vn").attr("src", "https://carto.baolau.com/user/mapsbaolau/builder/8ab2e5bf-eaad-4839-8372-66729284886f/embed"), $("#map_train_vn").length && $("#map_train_vn").attr("src", "https://carto.baolau.com/user/mapsbaolau/builder/551edc66-60be-4a1f-b1ae-39a691df2965/embed"), $("#map_bus_vn").length && $("#map_bus_vn").attr("src", "https://carto.baolau.com/user/mapsbaolau/builder/8eb844b8-6d97-46e1-9839-b15ef36ea2f7/embed"), $("#map_boat_vn").length && $("#map_boat_vn").attr("src", "https://carto.baolau.com/user/mapsbaolau/builder/14027b32-caf3-46f3-93ac-7389c8724f4b/embed"), $("#map_plane_cn").length && $("#map_plane_cn").attr("src", "https://carto.baolau.com/user/mapsbaolau/builder/d59bed40-1ae5-4118-bc86-c1f030ef76b2/embed"), $("#map_train_cn").length && $("#map_train_cn").attr("src", "https://carto.baolau.com/user/mapsbaolau/builder/72fab6ce-8569-4fa0-8887-5af7cb4b04ef/embed"), $("#map_bus_cn").length && $("#map_bus_cn").attr("src", "https://carto.baolau.com/user/mapsbaolau/builder/d9dfa52c-7ce6-4900-8848-b089486e29cb/embed"), $("#map_plane_tw").length && $("#map_plane_tw").attr("src", ""), $("#map_train_tw").length && $("#map_train_tw").attr("src", ""), $("#map_plane_kh").length && $("#map_plane_kh").attr("src", "https://carto.baolau.com/user/mapsbaolau/builder/4d9be86c-30b4-49aa-906c-59c217c7d7e2/embed"), $("#map_train_kh").length && $("#map_train_kh").attr("src", "https://carto.baolau.com/user/mapsbaolau/builder/f08c62c2-d8c3-4a5a-b9e3-8f002d958c0b/embed"), $("#map_bus_kh").length && $("#map_bus_kh").attr("src", "https://carto.baolau.com/user/mapsbaolau/builder/0075b14c-0bc5-4db9-8e2f-dbaa5aacb6b3/embed"), $("#map_boat_kh").length && $("#map_boat_kh").attr("src", "https://carto.baolau.com/user/mapsbaolau/builder/4ea1bea2-9b4c-4988-b7ce-d2d6b9326c8b/embed"), $("#map_plane_la").length && $("#map_plane_la").attr("src", "https://carto.baolau.com/user/mapsbaolau/builder/6f8db4e9-bd44-4a5d-aacf-c1143ca1ee2d/embed"), $("#map_bus_la").length && $("#map_bus_la").attr("src", "https://carto.baolau.com/user/mapsbaolau/builder/cedc6622-2b8b-41f7-880b-b3d69348a8d0/embed"), $("#map_plane_jp").length && $("#map_plane_jp").attr("src", ""), $("#map_train_jp").length && $("#map_train_jp").attr("src", ""), $("#map_plane_kr").length && $("#map_plane_kr").attr("src", ""), $("#map_plane_th").length && $("#map_plane_th").attr("src", "https://carto.baolau.com/user/mapsbaolau/builder/19a8bef8-c28a-4aec-b4f9-44e249d78ce7/embed"), $("#map_bus_th").length && $("#map_bus_th").attr("src", "https://carto.baolau.com/user/mapsbaolau/builder/9d239a6c-666b-4c5f-8df1-51eaff314c4f/embed"), $("#map_boat_th").length && $("#map_boat_th").attr("src", "https://carto.baolau.com/user/mapsbaolau/builder/cbf415b0-04d1-4566-9769-7e562ae25431/embed"), $("#map_train_th").length && $("#map_train_th").attr("src", "https://carto.baolau.com/user/mapsbaolau/builder/0f5c1355-db87-4858-9aa0-d21522f53e46/embed"), $("#map_plane_mm").length && $("#map_plane_mm").attr("src", "https://carto.baolau.com/user/mapsbaolau/builder/96760b84-1598-4d46-bb4f-38fcacb8befa/embed"), $("#map_bus_mm").length && $("#map_bus_mm").attr("src", "https://carto.baolau.com/user/mapsbaolau/builder/db2eeb13-8fb4-40a9-af1a-cee7840379ee/embed"), $("#map_plane_my").length && $("#map_plane_my").attr("src", "https://carto.baolau.com/user/mapsbaolau/builder/8dabaa37-8327-441f-a5d5-c587ae60cc3b/embed"), $("#map_train_my").length && $("#map_train_my").attr("src", "https://carto.baolau.com/user/mapsbaolau/builder/cd21683e-5329-45ef-aa4d-7e83096f1008/embed"), $("#map_bus_my").length && $("#map_bus_my").attr("src", ""), $("#map_boat_my").length && $("#map_boat_my").attr("src", ""), $("#map_plane_id").length && $("#map_plane_id").attr("src", ""), $("#map_plane_ph").length && $("#map_plane_ph").attr("src", "https://carto.baolau.com/user/mapsbaolau/builder/8914b969-1357-4b98-af70-12e5e39acea5/embed"), $(window).on("scroll", function () {
				var a = $(".js-carto-scroll:visible").position();
				if (a) {
					var b = a.top - 800;
					$(window).scrollTop() > b && !$(".js-carto-scroll:visible").hasClass("carto_triggered") && ($(".js-carto-scroll:visible").addClass("carto_triggered"), $("#js-carto-transportation-iframe .btn-tab.active > a").trigger("click"))
				}
			})
		}

		function inittransport_old() {
			var a = location.hash;
			if ("" != a) {
				var b = $('[href="' + a + '"]').closest(".tab-pane-transport-detail");
				if (1 == b.length) {
					$(".tab-pane-transport-detail").removeClass("active"), $('[href="' + a + '"]').closest(".tab-pane-transport-detail").addClass("active"), $("#transport-types-link > li").removeClass("active");
					var c = b.attr("id");
					$('[href="#' + c + '"]').closest("li").addClass("active")
				}
			}
		}

		function initVetautet() {
			function a() {
				$("input.birthdate").datepicker({
					autoclose: !0,
					format: date_format,
					language: lang,
					startView: "decade",
					weekStart: 1,
					endDate: new Date
				}).on("show", function () {
					CustomDatePicker.hideOtherMonthDays()
				}).each(function () {
					var a = $(this).attr("data-value");
					a ? $(this).datepicker("setDate", a) : $(this).datepicker("clearDates")
				})
			}

			function b() {
				$("input.child").change(function () {
					var a = $(this).parents(".passenger-info");
					$(this).is(":checked") ? a.find(".birthdate").show() : a.find("div.birthdate").hasClass("mandatory") || a.find(".birthdate").hide().find("input.birthdate").val(""), $window.trigger("resize")
				})
			}

			function c() {
				var a = validateAllFields(),
					b = !0;
				return $("#checkbox_hard_seat").is(":checked") || $("#checkbox_soft_seat").is(":checked") || $("#checkbox_hard_bed").is(":checked") || $("#checkbox_soft_bed").is(":checked") || ($('[name="seat_type[]"]').addClass("invalid"), b = !1), "" == $("#origin").val().trim() && ($("#origin").addClass("invalid"), b = !1), "" == $("#destination").val().trim() && ($("#destination").addClass("invalid"), b = !1), $("#origin").val().trim() == $("#destination").val().trim() && ($("#origin").addClass("invalid"), $("#destination").addClass("invalid"), b = !1), b && a ? !0 : !1
			}
			var d = new Bloodhound({
				initialize: !1,
				datumTokenizer: function (a) {
					var b = Bloodhound.tokenizers.whitespace(accent_fold(a.name.replace("(", ""))),
						c = Bloodhound.tokenizers.whitespace(a.name.replace("(", ""));
					return b.concat(c)
				},
				queryTokenizer: Bloodhound.tokenizers.whitespace,
				prefetch: site_url + "ajax/get_vn_train_nodes",
				sorter: function (a, b) {
					var c = {
						town: 1,
						plane: 2,
						train: 3,
						bus: 4,
						boat: 5
					};
					if (a.town != b.town) {
						var e = a.town.toLowerCase().indexOf(d.current_query) > -1 || d.current_query.indexOf(a.town.toLowerCase()) > -1,
							f = b.town.toLowerCase().indexOf(d.current_query) > -1 || d.current_query.indexOf(b.town.toLowerCase()) > -1;
						if (e && !f) return -1;
						if (f && !e) return 1
					}
					return c[a.type] < c[b.type] ? -1 : c[a.type] > c[b.type] ? 1 : a.score < b.score ? 1 : a.score > b.score ? -1 : a.node_name < b.node_name ? -1 : a.node_name > b.node_name ? 1 : 0
				}
			});
			d.current_query = "", $("input.typeahead").each(function () {
				var a = $(this);
				a.typeahead({
					highlight: "vi" != lang_db
				}, {
					displayKey: "node_name",
					limit: 8,
					source: function (a, b) {
						d.search(a, function (a) {
							b(a)
						})
					},
					templates: {
						suggestion: function (a) {
							return '<div class="inner capitalize ' + a.type + " " + a.country + '"><span>' + a.name + "</span></div>"
						}
					}
				})
			}).on("typeahead:selected", function (a, b) {
				$(this).data("datum", b), $(this).val(b.node_name);
				var c = $(this).attr("name");
				$("#" + c + "_id").val(b.id), $("#" + c + "_town").val(b.town), $("#" + c + "_town_lang").val(b.town_lang), $("#" + c + "_type").val(b.type), $("#search_form").hasClass("widget") || $("#transports").val("")
			}).on("typeahead:autocompleted", function (a, b) {
				$(this).data("datum", b), $(this).val(b.node_name);
				var c = $(this).attr("name");
				$("#" + c + "_id").val(b.id), $("#" + c + "_town").val(b.town), $("#" + c + "_town_lang").val(b.town_lang), $("#" + c + "_type").val(b.type), $("#search_form").hasClass("widget") || $("#transports").val("")
			}).on("blur", function () {
				var a = $(this).data("datum");
				if (!a || "" != $(this).val() && $(this).val() != a.node_name) {
					var b = $(this),
						c = accent_fold(b.val().toLowerCase());
					d.search(c, function (d) {
						if (d.length) {
							var e = d[0];
							for (var f in d)
								if (accent_fold(d[f].node_name.toLowerCase()) == c) {
									e = d[f];
									break
								}
							b.typeahead("val", e.node_name), b.trigger("typeahead:selected", [e])
						} else a ? b.typeahead("val", a.node_name) : b.typeahead("val", "")
					})
				} else a && "" == $(this).val() && $(this).typeahead("val", a.node_name)
			}).on("focus", function () {
				$(this).typeahead("val", ""), isXS() && scrollToElement($(this))
			}).on("keydown", function (a) {
				return 13 == a.keyCode ? (a.preventDefault(), $(this).blur(), !1) : void 0
			}).on("keyup", function () {
				d.current_query = $(this).val().toLowerCase()
			});
			d.initialize();
			$(".typeahead-icon").click(function () {
				var a = $($(this).attr("data-target"));
				"" == a.val() && a.typeahead("val", $(this).attr("data-default")), a.typeahead("open")
			}), $(".input-daterange").datepicker({
				autoclose: !0,
				language: lang,
				format: date_format,
				startDate: new Date(tet_campaign_start_date),
				endDate: new Date(tet_campaign_end_date)
			}).on("show", function () {
				CustomDatePicker.hideOtherMonthDays()
			}), $("button.fa-calendar").click(function () {
				$(this).prev().datepicker("show")
			}), $window.resize(function () {
				isXS() || isSM() ? $(".passenger-fields, .passenger-input-col").css("width", "") : $(".passenger-fields").css("width", $(".passenger-input").width() - $(".passenger-label").outerWidth() - $(".gender-selector").outerWidth() - 5).each(function () {
					$(this).find(".passenger-input-col").css("width", 100 / $(this).find(".passenger-input-col:visible").length + "%")
				})
			}), a(), b(), $("#passengers_count").change(function () {
				var c = $(this).val(),
					d = $(".passenger-info").length;
				if (c > d) {
					var e = c,
						f = '<div class="panel-light passenger-info" data-passenger="' + e + '"><div style="padding: 14px 3% 5px 3%" class="padded-heading relative border-bottom"><div style="line-height: 40px;" class="row"><div class="col-md-6 col-xs-6"><span class="bold">' + lang_strings.booking_form_input_passenger_label + '</span></div><div class="col-md-6 col-xs-6"><div class="checkbox pull-right"><input id="child_' + e + '" class="child optional" type="checkbox" name="child_' + e + '" value="1"  /><label class="inline" for="child_' + e + '">' + lang_strings.booking_form_input_passenger_child_infant_label + '</label></div></div></div></div><div class="padded-heading relative"><div class="row passenger-input"><div class="passenger-fields pull-left"><div class="pull-left passenger-name passenger-input-col passenger-input-col-left"><div class="form-group"><input class="form-control english"  name="passenger_' + e + '_first_name" type="text" placeholder="' + lang_strings.booking_form_input_passenger_first_name_placeholder + '" value="" /></div></div><div class="pull-left passenger-name passenger-input-col passenger-input-col-right"><div class="form-group"><input class="form-control english"  name="passenger_' + e + '_last_name" type="text" placeholder="' + lang_strings.booking_form_input_passenger_last_name_placeholder + '" value="" /></div></div><div class="pull-left passenger-input-col passenger-input-col-right"><div class="form-group"><input class="form-control"  name="passenger_' + e + '_passport" type="text" placeholder="' + lang_strings.booking_form_input_passenger_passport_placeholder + '" value="" /></div></div><div class="pull-left passenger-input-col passenger-input-col-left birthdate" style="display:none"><div class="form-group"><input  name="passenger_' + e + '_birthdate" class="form-control birthdate" type="text" placeholder="date of birth" value="" readonly /></div></div></div></div></div></div>';
					$("#passengers-info").append(f), b(), $window.trigger("resize"), a()
				} else d > 1 && $('[data-passenger="' + d + '"]').remove()
			}), $("#register_ticket").click(function () {
				c() ? ($body.addClass("blur"), $("#vetautet_form").ajaxSubmit({
					dataType: "json",
					success: function (a) {
						grecaptcha.reset(), "OK" == a.status ? ($body.removeClass("blur"), window.location.href = site_url + "vetautet/xacnhan") : (showError(a.msg), $body.removeClass("blur"))
					}
				})) : showError(lang_strings.error_form_contains_errors)
			}), $("#passenger_1_first_name").change(function () {
				$("#book_first_name").val($(this).val())
			}), $("#passenger_1_last_name").change(function () {
				$("#book_last_name").val($(this).val())
			}), $("input.english").on("blur", function () {
				validateField($(this)), "passenger_1_first_name" == $(this).attr("id") ? validateField($("#book_first_name")) : "passenger_1_last_name" == $(this).attr("id") && validateField($("#book_last_name"))
			}), load_recaptcha()
		}

		function initSearchVetautet() {
			function a() {
				var a = validateAllFields(),
					b = !0;
				return "" == $("#origin").val().trim() && ($("#origin").addClass("invalid"), b = !1), "" == $("#destination").val().trim() && ($("#destination").addClass("invalid"), b = !1), b && a ? !0 : (showError(lang_strings.error_form_contains_errors), !1)
			}
			var b = new Bloodhound({
				initialize: !1,
				datumTokenizer: function (a) {
					var b = Bloodhound.tokenizers.whitespace(accent_fold(a.name.replace("(", ""))),
						c = Bloodhound.tokenizers.whitespace(a.name.replace("(", ""));
					return b.concat(c)
				},
				queryTokenizer: Bloodhound.tokenizers.whitespace,
				prefetch: site_url + "ajax/get_vn_train_nodes",
				sorter: function (a, c) {
					var d = {
						town: 1,
						plane: 2,
						train: 3,
						bus: 4,
						boat: 5
					};
					if (a.town != c.town) {
						var e = a.town.toLowerCase().indexOf(b.current_query) > -1 || b.current_query.indexOf(a.town.toLowerCase()) > -1,
							f = c.town.toLowerCase().indexOf(b.current_query) > -1 || b.current_query.indexOf(c.town.toLowerCase()) > -1;
						if (e && !f) return -1;
						if (f && !e) return 1
					}
					return d[a.type] < d[c.type] ? -1 : d[a.type] > d[c.type] ? 1 : a.score < c.score ? 1 : a.score > c.score ? -1 : a.node_name < c.node_name ? -1 : a.node_name > c.node_name ? 1 : 0
				}
			});
			b.current_query = "", $("input.typeahead").each(function () {
				var a = $(this);
				a.typeahead({
					highlight: "vi" != lang_db
				}, {
					displayKey: "node_name",
					limit: 8,
					source: function (a, c) {
						b.search(a, function (a) {
							c(a)
						})
					},
					templates: {
						suggestion: function (a) {
							return '<div class="inner capitalize ' + a.type + " " + a.country + '"><span>' + a.name + "</span></div>"
						}
					}
				})
			}).on("typeahead:selected", function (a, b) {
				$(this).data("datum", b), $(this).val(b.node_name);
				var c = $(this).attr("name");
				$("#" + c + "_id").val(b.id), $("#" + c + "_town").val(b.town), $("#" + c + "_town_lang").val(b.town_lang), $("#" + c + "_type").val(b.type), $("#search_form").hasClass("widget") || $("#transports").val("")
			}).on("blur", function () {
				var a = $(this).data("datum");
				if (!a || "" != $(this).val() && $(this).val() != a.node_name) {
					var c = $(this),
						d = accent_fold(c.val().toLowerCase());
					b.search(d, function (b) {
						if (b.length) {
							var e = b[0];
							for (var f in b)
								if (accent_fold(b[f].node_name.toLowerCase()) == d) {
									e = b[f];
									break
								}
							c.typeahead("val", e.node_name), c.trigger("typeahead:selected", [e])
						} else a ? c.typeahead("val", a.node_name) : c.typeahead("val", "")
					})
				} else a && "" == $(this).val() && $(this).typeahead("val", a.node_name)
			}).on("focus", function () {
				$(this).typeahead("val", ""), isXS() && scrollToElement($(this))
			}).on("keydown", function (a) {
				return 13 == a.keyCode ? (a.preventDefault(), $(this).blur(), !1) : void 0
			}).on("keyup", function () {
				b.current_query = $(this).val().toLowerCase()
			});
			var c = b.initialize();
			c.done(function () {
				$("input.typeahead").trigger("blur")
			}), $(".typeahead-icon").click(function () {
				var a = $($(this).attr("data-target"));
				"" == a.val() && a.typeahead("val", $(this).attr("data-default")), a.typeahead("open")
			}), $(".input-daterange").datepicker({
				autoclose: !0,
				todayHighlight: !0,
				format: date_format,
				language: lang,
				startDate: new Date(tet_campaign_start_date),
				endDate: new Date(tet_campaign_end_date)
			}).on("show", function () {
				CustomDatePicker.hideOtherMonthDays()
			}), $("#departure_date").on("changeDate", function () {
				if ("no" == $("input[name=roundtrip]:checked").val()) $("#return_date").datepicker("clearDates");
				else if ($("#return_date").length) {
					var a = $("#departure_date").datepicker("getDate"),
						b = $("#return_date").datepicker("getDate");
					b && a.getTime() == b.getTime() && (b.setDate(b.getDate() + 7), $("#return_date").datepicker("setDate", b))
				}
			}), $("button.fa-calendar").click(function () {
				$(this).prev().datepicker("show")
			}), $("a.roundtrip_selector").click(function () {
				$($(this).attr("href")).trigger("click")
			}), $("input[name=roundtrip]").change(function () {
				var a = "yes" == $("input[name=roundtrip]:checked").val();
				$("#return_group").toggleClass("disabled", !a), a ? ($("#return_date").removeClass("optional"), $("#return_date").datepicker("setDate", tet_campaign_end_date.split("-").reverse().join("/"))) : ($("#return_date").addClass("optional"), $("#return_date").datepicker("clearDates"))
			}), $("#search_form").submit(function () {
				return a()
			})
		}

		function initSearchForm() {
			var a = new Bloodhound({
				initialize: !1,
				datumTokenizer: function (a) {
					var b = Bloodhound.tokenizers.whitespace(accent_fold(a.name.replace("(", ""))),
						c = Bloodhound.tokenizers.whitespace(a.name.replace("(", ""));
					return b.concat(c)
				},
				queryTokenizer: Bloodhound.tokenizers.whitespace,
				prefetch: site_url + "ajax/nodes",
				sorter: function (b, c) {
					var d = {
						town: 1,
						plane: 2,
						train: 3,
						bus: 4,
						boat: 5
					};
					if (b.town != c.town) {
						var e = b.town.toLowerCase().indexOf(a.current_query) > -1 || a.current_query.indexOf(b.town.toLowerCase()) > -1,
							f = c.town.toLowerCase().indexOf(a.current_query) > -1 || a.current_query.indexOf(c.town.toLowerCase()) > -1;
						if (e && !f) return -1;
						if (f && !e) return 1
					}
					return d[b.type] < d[c.type] ? -1 : d[b.type] > d[c.type] ? 1 : b.score < c.score ? 1 : b.score > c.score ? -1 : b.node_name < c.node_name ? -1 : b.node_name > c.node_name ? 1 : 0
				}
			});
			a.current_query = "", $("input.typeahead").each(function () {
				var b = $(this);
				b.typeahead({
					highlight: "vi" != lang_db
				}, {
					displayKey: "node_name",
					limit: 8,
					source: function (b, c) {
						a.search(b, function (a) {
							c(a)
						})
					},
					templates: {
						suggestion: function (a) {
							return '<div class="inner capitalize ' + a.type + " " + a.country + '"><span>' + a.name + "</span></div>"
						}
					}
				})
			}).on("typeahead:selected", function (a, b) {
				$(this).data("datum", b), $(this).val(b.node_name);
				var c = $(this).attr("name");
				$("#" + c + "_id").val(b.id), $("#" + c + "_town").val(b.town), $("#" + c + "_town_lang").val(b.town_lang), $("#" + c + "_type").val(b.type), $("#search_form").hasClass("widget") || $("#transports").val("")
			}).on("typeahead:autocompleted", function (a, b) {
				$(this).data("datum", b), $(this).val(b.node_name);
				var c = $(this).attr("name");
				$("#" + c + "_id").val(b.id), $("#" + c + "_town").val(b.town), $("#" + c + "_town_lang").val(b.town_lang), $("#" + c + "_type").val(b.type), $("#search_form").hasClass("widget") || $("#transports").val("")
			}).on("blur", function () {
				var b = $(this).data("datum");
				if (!b || "" != $(this).val() && $(this).val() != b.node_name) {
					var c = $(this),
						d = accent_fold(c.val().toLowerCase());
					a.search(d, function (a) {
						if (a.length) {
							var e = a[0];
							for (var f in a)
								if (accent_fold(a[f].node_name.toLowerCase()) == d) {
									e = a[f];
									break
								}
							c.typeahead("val", e.node_name), c.trigger("typeahead:selected", [e])
						} else b ? c.typeahead("val", b.node_name) : c.typeahead("val", "")
					})
				} else b && "" == $(this).val() && $(this).typeahead("val", b.node_name)
			}).on("focus", function () {
				$(this).typeahead("val", ""), isXS() && scrollToElement($(this))
			}).on("keydown", function (a) {
				return 13 == a.keyCode ? (a.preventDefault(), $(this).blur(), !1) : void 0
			}).on("keyup", function () {
				a.current_query = $(this).val().toLowerCase()
			});
			var b = a.initialize();
			$(".search_result_page").length || b.done(function () {
				$("input.typeahead").trigger("blur")
			}), $(".typeahead-icon").click(function () {
				var a = $($(this).attr("data-target"));
				"" == a.val() && a.typeahead("val", $(this).attr("data-default")), a.typeahead("open")
			}), $(".input-daterange").datepicker({
				autoclose: !0,
				todayHighlight: !0,
				format: date_format,
				language: lang,
				startDate: "today",
				weekStart: 1,
				orientation: $("#search_form").hasClass("widget") ? "top" : "auto"
			}).on("show", function () {
				CustomDatePicker.hideOtherMonthDays()
			}), $("button.fa-calendar").click(function () {
				$(this).prev().datepicker("show")
			}), $("a.roundtrip_selector").click(function () {
				$($(this).attr("href")).trigger("click")
			}), $("input[name=roundtrip]").change(function () {
				var a = "yes" == $("input[name=roundtrip]:checked").val();
				if ($("#return_group").toggleClass("disabled", !a), a) {
					var b = $("#departure_date").datepicker("getDate");
					b.setDate(b.getDate() + 7), $("#return_date").datepicker("setDate", b)
				} else $("#return_date").datepicker("clearDates")
			}), $("#departure_date").on("changeDate", function () {
				if ("no" == $("input[name=roundtrip]:checked").val()) $("#return_date").datepicker("clearDates");
				else if ($("#return_date").length) {
					var a = $("#departure_date").datepicker("getDate"),
						b = $("#return_date").datepicker("getDate");
					b && a.getTime() == b.getTime() && (b.setDate(b.getDate() + 7), $("#return_date").datepicker("setDate", b))
				}
			}), $("#search_form").submit(function () {
				return cancelAjax(), $(this).hasClass("widget") || $main.addClass("blur"), !0
			})
		}

		function initYourSearch() {
			var a = $(".btn-modifysearch").html();
			$("#searchmodify-collapse").on("show.bs.collapse", function () {
				$(".btn-modifysearch").html(lang_strings.CLOSE).addClass("active fa-caret-up").removeClass("fa-caret-down")
			}).on("hide.bs.collapse", function () {
				$(".btn-modifysearch").html(a).removeClass("active fa-caret-up").addClass("fa-caret-down")
			})
		}

		function initSearchResults() {
			function a(a) {
				var b = Math.floor(a / 60).toString(),
					c = (a - 60 * b).toString();
				return 1 == b.length && (b = "0" + b), 1 == c.length && (c = "0" + c), 0 == c && (c = "00"), 24 == b && (b = "00"), [b, c]
			}

			function b() {
				$("#table-companies").empty();
				var a = new Array;
				$(".result").each(function () {
					if ($(this).is(":visible")) {
						var b = $(this).attr("data-step").split(",");
						a = jQuery.unique($.merge(b, a))
					}
				}), $.each(a, function (a, b) {
					$("#table-companies").append("<tr><td> <span class='filter-text' style='float: left;'>" + b + "</span></td> <td><input id='" + b + "' type='checkbox' name='checkbox_companies' value='" + b + "' checked style='display: inline; margin-left: 40px;'></td></tr>")
				})
			}
			var c = $("#search_results > tbody"),
				d = $(".progress"),
				e = !1;
			if (initRoutes(), $window.on("scroll resize", function () {
					if (isXS() || isSM()) {
						var a = $("#search_results").offset().top,
							b = $("#search_results").height(),
							c = $window.scrollTop() + $window.height(),
							d = c >= a && a + b > c;
						$(".mobile-filter-bar").toggle(d)
					} else $(".mobile-filter-bar").hide()
				}), $window.resize(function () {
					fixTableCells(c)
				}), $main.removeClass("blur"), $("a.logo").click(function () {
					return cancelAjax(), !0
				}), $(document).ready(function () {
					var b = $(this).find("input[id=slider-departure-lower]").val(),
						c = a(b);
					$("#time-lower").html(c[0] + ":" + c[1]);
					var d = $(this).find("input[id=slider-departure-upper]").val(),
						e = a(d);
					$("#time-upper").html(e[0] + ":" + e[1]);
					var f = $(this).find("input[id=slider-duration]").val();
					$("#duration").html(f + ":00h")
				}), $("#slider-departure-lower").on("input", function (b) {
					var c = $(b.target).val(),
						d = a(c);
					$("#time-lower").html(d[0] + ":" + d[1])
				}), $("#slider-departure-upper").on("input", function (b) {
					var c = $(b.target).val(),
						d = a(c);
					$("#time-upper").html(d[0] + ":" + d[1])
				}), $("#slider-duration").on("input", function (a) {
					var b = $(a.target).val();
					$("#duration").html(b + ":00h")
				}), $("form[id=search_results_filter_form]").on("change", function () {
					var a = $(this).find("input[id=slider-departure-lower]").val(),
						c = $(this).find("input[id=slider-departure-upper]").val(),
						d = $(this).find("input[id=slider-duration]").val(),
						e = $("input[name=checkbox_stops]:checked"),
						f = new Array;
					e.each(function () {
						f.push($(this).val())
					}), $($(".result")).each(function () {
						{
							var b = $(this).children("td.text-right:first").children("div.super-bold").text(),
								e = 60 * parseInt(b.split(":")[0]) + parseInt(b.split(":")[1]),
								g = $(this).children("td.text-center").text(),
								h = 60 * parseInt(g.split("h")[0]) + parseInt(g.split("h")[1].slice(0, -1)),
								i = $(this).attr("data-itinerary");
							f.includes(i)
						}
						a > e || e > c || h > 60 * d || !f.includes(i) ? ($(this).hide(), $($(this).attr("data-target")).hide()) : ($(this).show(), $($(this).attr("data-target")).show())
					}), "hide" == $("#btnSeeCompanies").val() && b(), $("#results_disclaimer").css("opacity", 1), $("#results_headers, #results_disclaimer, .progress").toggle($(".result:visible").length > 0), $("#no_results").toggle(0 == $(".result:visible").length), iea && $("#btnLoadMore").toggle($(".result:visible").length > 0)
				}), $("#btnSeeCompanies").on("click", function () {
					"see" == $("#btnSeeCompanies").val() ? (b(), $("#div-companies").show(), $("#btnSeeCompanies").html("Hide Companies"), $("#btnSeeCompanies").val("hide")) : ($("#table-companies").html(""), $("#btnSeeCompanies").html("See Companies"), $("#btnSeeCompanies").val("see"))
				}), $("#div-companies").change(function () {
					var a = $("input[name=checkbox_companies]:checked"),
						b = new Array;
					a.each(function () {
						b.push($(this).val())
					});
					var c = new Array;
					$(".result").each(function () {
						var a = $(this),
							d = $(this).attr("data-step").split(",");
						$.each(d, function (d, e) {
							b.includes(e) || c.push(a.attr("id"))
						})
					}), $(".result").each(function () {
						c.includes($(this).attr("id")) ? ($(this).hide(), $($(this).attr("data-target")).hide()) : ($(this).show(), $($(this).attr("data-target")).show())
					}), $("#results_disclaimer").css("opacity", 1), $("#results_headers, #results_disclaimer, .progress").toggle($(".result:visible").length > 0), $("#no_results").toggle(0 == $(".result:visible").length), iea && $("#btnLoadMore").toggle($(".result:visible").length > 0)
				}), $("input[name=transport_filter], input[name=mobile_transport_filter]").change(function () {
					var a = new Array,
						b = $("input[name=" + $(this).attr("name") + "]:checked");
					b.each(function () {
						a.push($(this).val())
					}), $("#transports").val(a.join("-"));
					var c = $(this).val();
					if ($(this).is(":checked")) {
						if (!$(this).attr("data-checked")) return $("#origin").typeahead("val", $("#origin_town").val().capitalize()), $("#destination").typeahead("val", $("#destination_town").val().capitalize()), $("#origin_type").val("town"), $("#destination_type").val("town"), $("#departure_reload").attr("name", "departure"), void $("#search_form").submit();
						$(".result." + c).show()
					} else $(".result." + c).each(function () {
						$(this).hide(), $($(this).attr("data-target")).hide()
					});
					$.post(site_url + "ajax/set_transports_filter/" + $("#sess_key").val() + "/" + $("#transports").val());
					var d = "transport_filter" == $(this).attr("name") ? "mobile_transport_filter" : "transport_filter";
					$("input[name=" + d + "][value=" + $(this).val() + "]").prop("checked", $(this).is(":checked")), $("#results_disclaimer").css("opacity", 1), $("#results_headers, #results_disclaimer, .progress").toggle($(".result:visible").length > 0), $("#no_results").toggle(0 == $(".result:visible").length), iea && $("#btnLoadMore").toggle($(".result:visible").length > 0)
				}), 0 == $("#complete_result").val() || iea) var f = 0,
				g = 1,
				h = 2,
				i = 0,
				j = new Array,
				k = function (a, b, f) {
					var g = 0;
					for (var h in a)
						for (var i in a[h]) r++, d.css({
							width: Math.round(100 * q / r) + "%"
						}), g++, sendAjax({
							url: site_url + "api/update_routes/" + $("#sess_key").val() + "/" + h + "/" + a[h][i] + "/" + b,
							with_credentials: !0,
							common: function (a) {
								"abort" != a && (g--, q++, d.css({
									width: Math.round(100 * q / r) + "%"
								}))
							},
							success: function (d) {
								var h = 0 == $(".result").length;
								if (d.error) {
									if (e = !0, b && 1 == a[d.transport_code].length)
										for (var i in d.transport_codes) $("#search_results .direct." + d.transport_codes[i]).each(function () {
											make_result_record_unavailable($(this).attr("id"))
										})
								} else b && updateResults(d.results, {
									transport_codes: d.transport_codes
								});
								h && fixTableCells(c), 0 == g && (sortResultsBy(c, "score", "asc"), "function" == typeof f && f())
							}
						})
				},
				l = function (a) {
					fixTableCells(c), "undefined" == typeof a && (a = e ? 0 : 1);
					var b = site_url + "api/combined_results/" + $("#sess_key").val() + "/" + a;
					iea && (b += "/" + f + "/" + g + "/" + h), r++, d.css({
						width: Math.round(100 * q / r) + "%"
					}), sendAjax({
						url: b,
						success: function (a) {
							if (!a.error) {
								if (iea) {
									if (f += Object.keys(a.results).length, updateResults(a.results), a.endOfIter && 0 == a.id_scraping && ($("#btnLoadMore").hide(), $("#loadingGif").hide()), a.id_scraping && 0 != a.new_carriers.length) {
										var b = new Array;
										for (var d in a.new_carriers)
											for (var e in a.new_carriers[d]) "undefined" == typeof j[a.new_carriers[d][e]] && (j[a.new_carriers[d][e]] = !0, b[d] || (b[d] = new Array), b[d].push(a.new_carriers[d][e]));
										g = a.id_scraping, h = a.level, k(b, 0, l)
									}
								} else updateResults(a.results);
								fixTableCells(c)
							}
							q == r && m()
						},
						error: function () {
							q == r && m()
						},
						common: function () {
							q++, d.css({
								width: Math.round(100 * q / r) + "%"
							})
						}
					}), 1 != g || i || (g = 0, h = 2, l())
				},
				m = function () {
					if (d.css({
							width: "100%"
						}), clearInterval(progress_interval), $("#check_availability_carriers").val() && $(".result").length) {
						var a = $.parseJSON(atob($("#check_availability_carriers").val()));
						for (var b in a) sendAjax({
							url: site_url + "api/check_availability",
							data: {
								sess_key: $("#sess_key").val(),
								transport_code: b
							},
							method: "POST",
							success: function (a) {
								if (a.error) "REMOVE" == a.error ? remove_result(b) : make_result_record_unavailable(b);
								else {
									updateResults(a.results, {
										transport_codes: a.transport_codes
									});
									for (var b in a.results) $("#" + b).data("verified", !0)
								}
							}
						})
					}
					$("#results_disclaimer").css("opacity", 1), $("#results_headers, #results_disclaimer, .progress").toggle($(".result:visible").length > 0), $("#loading_results").hide(), $("#no_results").toggle(0 == $(".result:visible").length)
				},
				n = function () {
					p ? $(".result").length < 10 ? k(p, 0, l) : (e || $.get(site_url + "api/commit_results/" + $("#sess_key").val()), m()) : $(".result").length < 5 ? l(1) : m()
				};
			if (!iea || 0 == $("#complete_result").val()) {
				var o = $("#update_carriers").val() ? $.parseJSON(atob($("#update_carriers").val())) : !1,
					p = $("#pivot_carriers").val() ? $.parseJSON(atob($("#pivot_carriers").val())) : !1,
					q = 0,
					r = 1;
				d.css({
					width: Math.round(100 * q / r) + "%"
				}), progress_interval = setInterval(function () {
					var a = d.width() + 2;
					a <= d.parent().width() ? d.css({
						width: a
					}) : clearInterval(progress_interval)
				}, 600), o ? k(o, 1, n) : n(), q++
			}
			$("#results_headers th[data-sort]").click(function () {
				var a = $(this).attr("data-sort"),
					b = $(this).hasClass("asc") ? "desc" : "asc";
				$(this).removeClass("asc desc").addClass(b), $(this).find(".caret").toggleClass("caret-reversed", "desc" == b), sortResultsBy(c, a, b), $("#results_headers th").removeClass("selected"), $(this).addClass("selected")
			}), iea && ($("#btnLoadMore").toggle($(".result:visible").length > 0), $("#btnLoadMore").on("click", function () {
				$(this).hide(), $("#loadingGif").show(), i = 1, l()
			})), sortResultsBy(c, "score")
		}

		function initRoutes() {
			function a(a, b) {
				if (unfixTableCells(a), b.find("td").css({
						width: "",
						height: ""
					}), isXS() || isSM()) {
					var c = $(".scrolling-section:visible");
					c.hide().width(c.eq(0).parent().width()).show().each(function () {
						var a = $(this).find(".fare-content");
						a.width() > $(this).width() ? a.css("margin", 0) : a.css("margin", "auto")
					})
				} else {
					for (var d = 1; 4 > d; d++) b.find("td:nth-child(" + d + ")").outerWidth(a.find("td:nth-child(" + d + ")").outerWidth());
					for (var d = 4; 8 > d; d += 2) {
						for (var e = 0, f = d; d + 2 > f; f++) e += a.find("td:nth-child(" + f + ")").outerWidth();
						b.find("td:nth-child(" + (2 + d / 2) + ")").outerWidth(e)
					}
					fixTableCells(a), b.find(".desktop-fares").each(function () {
						var a = $(this).height() / 3;
						$(this).parents(".route_details").find("tr td:first-child").height(a)
					})
				}
			}
			$("#search_results > tbody");
			$('[data-toggle="popover"]').popover({
				template: '<span class="popover-style"><span></span><span class="popover-content"></span></span>'
			}), $(".popover-address.origin-address").popover({
				template: '<span class="popover-style"><i class="fa fa-map-marker"></i><span class="popover-content small-text"></span></span>'
			}), $(".popover-address.destination-address").popover({
				template: '<span class="popover-style"><span class="popover-content small-text"></span><i class="fa fa-map-marker"></i></span>'
			}), $(".popover-fare-rule").popover(), $window.off("resize.initRoute").on("resize.initRoute", function () {
				$(".clickable_tr.expanded").each(function () {
					var b = $($(this).attr("data-target"));
					a($(this), b)
				})
			}).trigger("resize.initRoute"), initLogoSlideshows(5), updateCurrency();
			var b = function (b) {
				b.toggleClass("expanded"), b.removeClass("checking clicked");
				var c = $(b.attr("data-target"));
				c.is(":visible") ? b.data("no-animation") ? (c.find(".route_details").hide(), c.hide(), b.prevAll("tr.result:first").hasClass("expanded") || c.prevAll(".result-gap:first").hide(), b.nextAll("tr.result:first").hasClass("expanded") || c.next(".result-gap").hide()) : (c.find(".route_details").slideUp(), c.fadeOut(), b.prevAll("tr.result:first").hasClass("expanded") || c.prevAll(".result-gap:first").slideUp(), b.nextAll("tr.result:first").hasClass("expanded") || c.next(".result-gap").slideUp()) : (c.show(), b.data("no-animation") ? (c.find(".route_details").show(), c.prevAll(".result-gap:first").show(), c.next(".result-gap").show()) : (c.find(".route_details").slideDown(), c.prevAll(".result-gap:first").slideDown(), c.next(".result-gap").slideDown()), a(b, c)), b.removeData("no-animation"), c.find(".thumbnail-gallery").each(function () {
					var a = $(this);
					a.lightGallery();
					var b = function (a) {
						var b = a.next(),
							c = a.find("li").length,
							d = a.parent().outerWidth(),
							e = Math.ceil(d / 4),
							f = 0,
							g = 0,
							h = 0,
							i = function (c) {
								a.animate({
									left: c
								}), b.find(".prev-thumbnail").toggleClass("hidden", 0 == h), b.find(".next-thumbnail").toggleClass("hidden", h == g)
							};
						a.find("li").outerWidth(e), f = a.width(c * e).outerWidth(), g = Math.floor((f - d) / e), 0 != g && (b.removeClass("hidden"), b.find(".next-thumbnail").unbind("click"), b.find(".next-thumbnail").on("click", function () {
							var a = 0;
							h++, a = e * h, a + d > f && (a = f - d), h > g && (h = g), i(-a)
						}), b.find(".prev-thumbnail").unbind("click"), b.find(".prev-thumbnail").on("click", function () {
							h--, 0 > h && (h = 0), i(-e * h)
						}))
					};
					b(a), $(window).on("resize", function () {
						b(a)
					})
				})
			};
			$(".result").off("click").on("click", function () {
				function a(e, f) {
					var g = e.eq(f);
					sendAjax({
						url: site_url + "api/check_availability",
						data: {
							sess_key: $("#sess_key").val(),
							transport_code: g.attr("data-transport"),
							vessel: g.attr("data-vessel"),
							result_id: d
						},
						method: "POST",
						success: function (d) {
							if (f++, d.error) make_result_record_unavailable(c.attr("id")), "undefined" != typeof d.redirect && (window.location = d.redirect);
							else if (e.length == f) {
								c.removeClass("checking clicked"), updateResults(d.results);
								for (var g in d.results) $("#" + g).data("verified", !0);
								b($("#" + c.attr("id"))), d.warning && showModalMessage(lang_strings.attention, d.warning)
							} else a(e, f)
						},
						error: function () {
							make_result_record_unavailable(c.attr("id"))
						},
						critical: !0
					})
				}
				var c = $(this);
				if (!c.hasClass("clicked") && !c.hasClass("checking"))
					if (c.addClass("clicked"), c.hasClass("expanded") || c.data("verified")) b(c);
					else {
						var d = c.attr("id");
						c.addClass("checking").removeClass("unavailable-book");
						var e = $(c.attr("data-target")).find(".route_details");
						a(e, 0)
					}
			}).each(function () {
				var a = $(this).attr("id"),
					b = {
						id: a,
						score: $(this).attr("data-score"),
						departure: $(this).attr("data-departure"),
						arrival: $(this).attr("data-arrival"),
						duration: $(this).attr("data-duration"),
						itinerary: $(this).attr("data-itinerary"),
						price: $(this).attr("data-price"),
						price_breakdown: $.parseJSON(atob($(this).find(".price_breakdown").val())),
						coordinates: $.parseJSON(atob($(this).find(".coordinates").val())),
						allow_price_zero: $(this).attr("data-allow-price-zero")
					};
				"undefined" != typeof results_index[a] ? results[results_index[a]] = b : (results.push(b), results_index[a] = results.length - 1)
			}), $("input.fare_radio").off("click.initRoute").on("click.initRoute", function () {
				var a = $("input[name=" + $(this).attr("name") + "]:checked"),
					b = $(this).parents(".fares").attr("data-route"),
					c = results_index[$(this).parents(".result-collapse").attr("data-id")],
					d = a.attr("data-fare"),
					e = Number(a.attr("data-price")),
					f = $(this).parents(".result-collapse").prev();
				results[c].price_breakdown[b].price = e, results[c].price_breakdown[b].fare = d, results[c].price_breakdown[b].base_fare = a.attr("data-basefare") ? Number(a.attr("data-basefare")) : e, updateTotals(f);
				var g = a.attr("id"),
					h = "mobile_" == g.substr(0, 7) ? g.substr(7) : "mobile_" + g;
				$("#" + h).prop("checked", !0), $(".selected_fare[data-route=" + b + "]").html($(this).attr("data-label"))
			}), $("input.fare_radio:checked").trigger("click.initRoute"), $(".fare-info-button").off("click").on("click", function (a) {
				var b = $(this).attr("data-transport"),
					c = $(this).attr("data-fare"),
					d = $(this).attr("data-status"),
					e = $(this).attr("data-alert"),
					f = $(this).attr("data-overwrites"),
					g = $(this).attr("data-origin"),
					h = $(this).attr("data-destination"),
					i = $(this).attr("data-origin_country_code"),
					j = $(this).attr("data-destination_country_code"),
					k = $("#sess_key").length ? $("#sess_key").val() : 0;
				$("#fare_rules").remove(), $.post(site_url.replace("op", "www") + "ajax/fare_rules/" + b + "/" + c + "/" + d + "/" + k, {
					overwrites: f,
					alert_details: e,
					origin: g,
					destination: h,
					origin_country_code: i,
					destination_country_code: j
				}, function (a) {
					a && ($body.append(a), $("#fare_rules").on("show.bs.modal", centerModal).modal(), $("#form_alerts").ajaxForm({
						beforeSubmit: function () {
							return validateField($("#form_alerts input[name=email]")) ? ($body.addClass("blur"), !0) : !1
						},
						success: function (a) {
							$body.removeClass("blur"), "OK" == a.status ? $("#fare_rules .modal-body").html($("#form_alerts_success").html()) : ($("#fare_rules").modal("hide"), showError(a.error))
						},
						error: function () {
							$body.removeClass("blur"), $("#fare_rules").modal("hide"), showError("Sorry. There was an error. Please try again")
						},
						dataType: "json"
					}))
				}), a.preventDefault(), a.stopPropagation()
			}), load_gmaps(), $(".btn-map").off("click").on("click", function () {
				$("#map").modal();
				var a = results[results_index[$(this).attr("data-result")]].coordinates;
				initGoogleMap($("#map_canvas"), a)
			}), $(".btn-select").off("click").on("click", function () {
				var a = $(this).attr("href"),
					b = $(this).attr("data-way"),
					c = $(this).attr("data-result");
				return b && c && (a += collectFares(b, c)), $(this).attr("href", a), $main.addClass("blur"), cancelAjax(), !0
			})
		}

		function initSelectedResults() {
			initRoutes(), $(".result").each(function () {
				$(this).data("verified", !0)
			}), $("input.js-promotion_radio").change(function () {
				var a = $("input[name=" + $(this).attr("name") + "]:checked"),
					b = a.attr("data-result_id"),
					c = $(this).parents(".js-selected_result"),
					d = results[results_index[c.find(".result").attr("id")]].price_breakdown;
				c.find(".fare_radio").each(function () {
					if ($(this).attr("data-promo_price")) {
						var b = $(this).attr("standard" == a.val() ? "data-original_price" : "data-promo_price");
						$(this).attr("data-price", b).attr("data-has_promotion", "standard" == a.val() ? 0 : 1).attr("data-base_fare", b), $(this).parents(".mobile-fare,.fares-choose-items").find(".js-fare_price").attr("data-amount", b);
						var c = $(this).parents(".fares").attr("data-route");
						d[c].price = d[c].base_fare = Number(b)
					}
				}), updateCurrency(), updateTotals($("#" + b)), c.find(".fa-tag").not(".js-no-toggle").toggle("promotion" == a.val());
				var e = a.attr("id"),
					f = "mobile_" == e.substr(0, 7) ? e.substr(7) : "mobile_" + e;
				$("#" + f).prop("checked", !0)
			}).trigger("change")
		}

		function initSummary() {
			$(".btn-book").click(function () {
				var a = $(this).attr("href") + collectFares("departure", results[0].id);
				return results.length > 1 && (a += collectFares("return", results[1].id)), $(this).attr("href", a), !0
			})
		}

		function initPriceSummary() {
			$(".passenger_row[data-target]").click(function () {
				$(this).find(".caret").toggleClass("caret-reversed"), $("[data-row=" + $(this).attr("data-target") + "]").slideToggle()
			}), $("#charged_currency_info").click(function () {
				showModalMessage(lang_strings.notice, lang_strings.booking_price_total_charged_VND_disclaimer)
			}), $("#btn_apply_promo").on("click", function () {
				var a = /^([A-Z0-9])*$/,
					b = $("#promo_code").val().trim();
				if ("" !== b) {
					if (!a.test(b)) return void showError(lang_strings.error_promo_code_invalid);
					$("#btn_apply_promo").addClass("hidden"), $("#discount_spinner").removeClass("hidden"), sendAjax({
						url: site_url + "ajax/check_promo_code/" + b,
						success: function (a) {
							$("#discount_spinner").addClass("hidden"), "OK" === a.status ? ($("#discount_amount").removeClass("hidden").attr("data-amount", -a.discount).html(number2money(exchange(-a.discount, "VND"))), $("#promo_code").next().html(b), $("#promo_code").remove(), $("#total_after_discount").removeClass("hidden"), updateTotals()) : ($("#btn_apply_promo").removeClass("hidden"), showError(a.error))
						}
					})
				}
			})
		}

		function initBookingForm() {
			function a(a) {
				var b = !1,
					c = a.data("datepicker").getFormattedDate("dd/mm/yyyy");
				if (c) {
					var d = c.split("/");
					3 == d.length && (c = d[2] + "/" + d[1] + "/" + d[0], b = getAge(c, $("#first_travel_date").val()))
				}
				b === !1 && (b = 99);
				var e = a.parents(".passenger-info").attr("data-passenger"),
					f = $(".baggage_details_" + e);
				f.find(".bag_allowed").toggle(b >= 2), f.find(".bag_not_allowed").toggle(2 > b), 2 > b && f.find("select").selectpicker("val", "")
			}
			var b = {
				autoclose: !0,
				format: date_format,
				language: lang,
				startView: "decade",
				weekStart: 1,
				endDate: new Date,
				defaultViewDate: {
					year: default_year
				}
			};
			$window.resize(function () {
				isXS() || isSM() ? $(".passenger-fields, .passenger-input-col").css("width", "") : $(".passenger-fields").css("width", $(".passenger-input").width() - $(".passenger-label").outerWidth() - $(".gender-selector").outerWidth() - 5).each(function () {
					$(this).find(".passenger-input-col").css("width", 100 / $(this).find(".passenger-input-col:visible").length + "%")
				}), $(".ss_train_direct").each(function () {
					if ($window.width() <= 991) {
						var a = $(this).find(".train_row:first-child .train_cell");
						$(this).width(a.eq(0).outerWidth(!0) * a.length);
						var b = $(this).width(),
							c = $(this).height(),
							d = $(this).parent().width(),
							e = b / 2 - c / 2,
							f = b > d ? (b - d) / 2 : 0;
						$(this).css("transform", "rotate(-90deg) translateX(" + -e + "px) translateY(" + -f + "px)"), $(this).parent().height($(this).width())
					} else $(this).css({
						transform: "",
						width: ""
					}), $(this).parent().css("height", "")
				})
			});
			var c = Number($("#booking_form").attr("data-passengers"));
			$("#passenger_1_first_name").change(function () {
				$("#book_first_name").val($(this).val()).trigger("change")
			}), $("#passenger_1_last_name").change(function () {
				$("#book_last_name").val($(this).val()).trigger("change")
			}), $("#hotel_book_last_name").length && ($("#book_first_name").change(function () {
				$("#hotel_book_first_name, #workplace_book_first_name").val($(this).val())
			}), $("#book_last_name").change(function () {
				$("#hotel_book_last_name, #workplace_book_last_name").val($(this).val())
			}), $("input[name=check_ticket_delivery]").click(function () {
				$("#book_first_name, #book_last_name").trigger("change")
			})), $("input.english").on("blur", function () {
				validateField($(this)), "passenger_1_first_name" == $(this).attr("id") ? validateField($("#book_first_name")) : "passenger_1_last_name" == $(this).attr("id") && validateField($("#book_last_name"))
			}).on("blur keyup", function (a) {
				var b = a.keyCode,
					c = [8, 16, 17, 18, 32, 46],
					d = -1 != $.inArray(b, c);
				!d && (35 > b || b > 40) && $(this).val(accent_fold($(this).val()).replace(/[^A-Za-z ]/g, ""))
			}), $("input.chinese").on("blur", function () {
				validateField($(this)), "passenger_1_first_name" == $(this).attr("id") ? validateField($("#book_first_name")) : "passenger_1_last_name" == $(this).attr("id") && validateField($("#book_last_name"))
			}), $("#check_profile").change(function () {
				$("#profile_tab").trigger("click")
			}), $("#check_invoice").change(function () {
				1 == $('#invoice [name="company_name"]').length ? ($("#invoice_tab").trigger("click"), $("#check_invoice").is(":checked") ? ($("#electronic_invoice").attr("checked", "checked"), $('#invoice input[type="text"]').attr("disabled", !1).removeClass("invalid optional optional_field").val("")) : ($('#invoice input[type="text"]').attr("disabled", "disabled").addClass("optional optional_field").val(""), $("#electronic_invoice").attr("checked", !1))) : ($("#invoice_tab").trigger("click"), $(this).is(":checked") || ($('#invoice input[type="text"]').attr("disabled", "disabled").addClass("optional optional_field").removeClass("invalid").val(""), $("#invoice select").attr("disabled", "disabled").addClass("optional optional_field").removeClass("invalid"), $('[name="company_province"]').selectpicker("val", ""), $("#invoice .bootstrap-select").removeClass("invalid"), $("#electronic_invoice, #red_invoice").attr("checked", !1)))
			}), $(".red_invoice").change(function () {
				$('#invoice input[type="text"]').attr("disabled", "disabled").addClass("optional optional_field").removeClass("invalid").val(""), $("#invoice select").attr("disabled", "disabled").addClass("optional optional_field").removeClass("invalid"), $('[name="company_province"]').selectpicker("val", ""), $("#invoice .bootstrap-select").removeClass("invalid");
				var a = $(this).closest(".inter-card");
				a.find('input[type="text"]').removeClass("optional optional_field").attr("disabled", !1), a.find("select").removeClass("optional optional_field").attr("disabled", !1), a.find(".btn.dropdown-toggle").removeClass("disabled")
			}), $("select.baggage").change(function () {
				var a = $(this).attr("name"),
					b = "mobile_" == a.substr(0, 7) ? a.substr(7) : "mobile_" + a;
				$("select[name=" + b + "]").selectpicker("val", $(this).val())
			}), fixTableCells($("#baggage_selection")), $("#children_disclaimer").toggle($("input.child:checked").length ? !0 : !1), $("input.child").change(function () {
				$("#children_disclaimer").toggle($("input.child:checked").length ? !0 : !1);
				var c = $(this).parents(".passenger-info"),
					d = default_year;
				$(this).is(":checked") ? (c.find(".birthdate").show(), d = 2e3) : c.find("div.birthdate").hasClass("mandatory") || c.find(".birthdate").hide().find("input.birthdate").val(""), b.defaultViewDate.year = d, c.find("input.birthdate").datepicker("destroy").datepicker(b), $window.trigger("resize"), a(c.find("input.birthdate"))
			}), $("input.birthdate").datepicker(b).on("changeDate", function () {
				a($(this))
			}).on("show", function () {
				CustomDatePicker.hideOtherMonthDays()
			}).each(function () {
				var a = $(this).attr("data-value");
				a ? $(this).datepicker("setDate", a) : $(this).datepicker("clearDates")
			}), $("input.passport_expiration").datepicker({
				autoclose: !0,
				format: date_format,
				language: lang,
				startView: "decade",
				weekStart: 1,
				startDate: new Date
			}).on("show", function () {
				CustomDatePicker.hideOtherMonthDays()
			}).each(function () {
				var a = $(this).attr("data-value");
				a ? $(this).datepicker("setDate", a) : $(this).datepicker("clearDates")
			}), $("input.js_ticket_delivery_date").datepicker({
				autoclose: !0,
				format: date_format,
				language: lang,
				weekStart: 1
			}), $("button.fa-calendar").click(function () {
				$(this).prev().datepicker("show")
			}), $("input, select").each(function () {
				$(this).data("dirty", !1)
			}).focus(function () {
				validateField($(this), !0), $(this).data("dirty", !0)
			}).on("keyup blur change", function (a) {
				if ($(this).hasClass("optional_field")) {
					var b = $(this).parents(".row").find(".optional_field"),
						c = b.filter(function () {
							return "" === $(this).val().trim()
						}).length;
					c == b.length ? (b.removeClass("invalid").addClass("optional"), $("#profile_email").removeClass("invalid").addClass("no_precheck")) : (b.removeClass("optional"), $("#profile_email").removeClass("no_precheck"))
				}
				"book_email" != $(this).attr("id") && "verify_email" != $(this).attr("id") || "blur" != a.type || ($(this).val($(this).val().toLowerCase().replace(" ", "")), $("#book_email").val() == $("#verify_email").val() && $("#profile_email").val($("#book_email").val())), 9 != a.which && validateField($(this), !0)
			}), $("#password2, #book_email, #verify_email").blur(function () {
				$("#profile_email").hasClass("no_precheck") || $("#password").val() != $("#password2").val() || $("#book_email").val() != $("#verify_email").val() || $.get(site_url + "user/check_user_exists_booking?email=" + $("#profile_email").val(), function (a) {
					"OK" != a ? ($("#profile_email").addClass("invalid"), showError(lang_strings.error_email_profile_exists), scrollToElement($("#profile_email"))) : $("#profile_email").removeClass("invalid")
				})
			}), $(".seat_selection").length && $(".seat, .bed").click(function () {
				var a = $(this);
				if (a.hasClass("available") && a.parents(".seat_selection").find(".seat.selected, .bed.selected").length < c || a.hasClass("selected")) {
					if (a.hasClass("can_block")) {
						var b = a.parents(".seat_selection").attr("data-route"),
							d = a.hasClass("selected") ? 0 : 1,
							e = site_url + "ajax/toggle_seat/" + $("#sess_key").val() + "/" + b + "/" + a.attr("data-seat-id") + "/" + d;
						if (a.hasClass("blocking")) return;
						a.addClass("blocking"), sendAjax({
							url: e,
							success: function (b) {
								"OK" === b.status ? a.removeClass("selected available").addClass(b.seat_status) : (a.toggleClass("selected available"), "undefined" != typeof b.seat_status && a.removeClass("selected available").addClass(b.seat_status), showError(b.error, function () {
									"undefined" != typeof b.redirect && (window.location = b.redirect)
								}))
							},
							common: function () {
								a.removeClass("blocking")
							}
						})
					}
					a.toggleClass("selected available")
				}
			}), $(".train_row").each(function () {
				"" == $(this).text().trim() && $(this).addClass("blank")
			}), $(".seat_carousel .item").show();
			var d = $(".seat_carousel");
			if (d.on("initialized.owl.carousel changed.owl.carousel refreshed.owl.carousel", function (a) {
					if (a.namespace) {
						var b = a.relatedTarget,
							c = a.target,
							d = b.current();
						$(".owl-next", c).toggleClass("hidden", d === b.maximum()), $(".owl-prev", c).toggleClass("hidden", d === b.minimum())
					}
				}).owlCarousel({
					items: 1,
					nav: !0,
					navText: ["<i class='fa fa-chevron-circle-left'</i>", "<i class='fa fa-chevron-circle-right'</i>"],
					lazyLoad: !0,
					navSpeed: 800,
					touchDrag: !1,
					mouseDrag: !1,
					freeDrag: !1,
					pullDrag: !1
				}), $(".fa.fa-chevron-circle-right").on("click touchstart", function () {
					var a = $(".diagram-train").find(".selected");
					a.removeClass("selected").addClass("available"), a.next().hasClass("selectable") ? a.next().addClass("selected") : $(".diagram-train .selectable").first().addClass("selected")
				}), $(".fa.fa-chevron-circle-left").on("click touchstart", function () {
					var a = $(".diagram-train").find(".selected");
					a.removeClass("selected").addClass("available"), a.prev().hasClass("selectable") ? a.prev().addClass("selected") : $(".diagram-train .selectable").last().addClass("selected")
				}), $("input.fare_radio").on("change", function () {
					var a = site_url + "passengers/?sess_key=" + $("#sess_key").val() + collectFares("departure", results[0].id);
					results.length > 1 && (a += collectFares("return", results[1].id)), window.location = a
				}), $(".diagram_cell.selectable").on("click", function () {
					$(".diagram-train").find(".selected").removeClass("selected").addClass("available"), $(this).addClass("selected"), d.trigger("to.owl.carousel", [$(this).index() - 1, 800, !0])
				}), isXS() || isSM()) {
				var e = $(".seat_map"),
					f = e.data("col-num"),
					g = e.find("[data-seat-id]", 0).outerWidth();
				e.width((g + 8) * f)
			}
			$("#booking_form").submit(function () {
				if ($main.addClass("blur"), validateAllFields()) {
					var a = (new Date, !0);
					$("input.birthdate:visible").each(function () {
						var b = $(this).attr("data-max-age"),
							c = $(this).data("datepicker").getFormattedDate("dd/mm/yyyy"),
							d = c.split("/"),
							e = d[2] + "/" + d[1] + "/" + d[0],
							f = getAge(e, $("#first_travel_date").val());
						(f === !1 || f >= b) && (a && showError(f === !1 ? lang_strings.error_form_date_format : lang_strings.error_form_children_discount + ": " + b), $(this).parents("tr").find(".validation").html('<i class="icon-cancel-circled" style="color:red"></i>'), a = !1)
					});
					var b = !0;
					$(".seat_selection").length && $(".seat_selection").each(function () {
						if ($(this).is(":visible")) {
							var a = $(this).attr("data-route"),
								d = [];
							$(this).find(".seat.selected, .bed.selected").each(function () {
								d.push($(this).attr("data-seat-id"))
							}), d.length == c ? $("#seats_" + a).val(d.join(",")) : (showError(lang_strings.error_form_seat_passengers), b = !1, scrollToElement($(this)))
						}
					}), $(".accept_private_train").each(function () {
						if ($(this).is(":checked")) {
							var a = "" != $("#remarks").val() ? $("#remarks").val() + "<br>" : "";
							a += "Private train " + $(this).val() + ": customer accepts changing to different carrier if not available.", $("#remarks").val(a)
						}
					});
					var d = !0;
					if ($("#vn_company_tax_code").length > 0) {
						var e = $("#vn_company_tax_code").val().trim();
						if (!$("#vn_company_tax_code").hasClass("optional") && "" != e) {
							var f = /^([0-9])*$/;
							(!f.test(e) || 11 != e.length && 10 != e.length) && ($("#vn_company_tax_code").addClass("invalid"), d = !1, showError(lang_strings.error_invalid_vn_tax_code))
						}
					}
					var g = b && a && d;
					return g || $main.removeClass("blur"), g
				}
				return $main.removeClass("blur"), !1
			})
		}

		function initPayment() {
			var a, b, c = !1,
				d = !1,
				e = function () {
					var c = Number($("#payment_form").attr("data-book-time"));
					$main.addClass("blur"), showWaitingOverlay(lang_strings.booking_form_waiting_book_itinerary_title, lang_strings.booking_form_waiting_book_itinerary_sub), "STRIPE" != $("input[name=payment_type]:checked").val() && (a = setTimeout(function () {
						showWaitingOverlay(lang_strings.booking_form_waiting_payment_gateway_title, lang_strings.booking_form_waiting_payment_gateway_sub)
					}, .75 * c)), c > 0 && (b = setTimeout(function () {
						$.get(site_url + "ajax/prebook_longwait/" + $("#payment_form").attr("data-sess_key") + "/" + 3 * c)
					}, 3 * c))
				},
				f = function () {
					$(".payment_checkbox:checked").length === $(".payment_checkbox").length ? $("#submit_payment").removeAttr("disabled") : $("#submit_payment").attr("disabled", "disabled")
				};
			f(), $("input[name=payment_type]").change(function () {
				updateTotals(), $("#submit_payment").html(lang_strings["booking_form_button_" + ($("#radio_payment_deposit").is(":checked") ? "booking" : "pay")])
			}).trigger("change"), $("#yes_insurance").click(function () {
				$("#insurance_description").slideDown()
			}), $("#no_insurance").click(function () {
				$("#insurance_description").slideUp()
			}), $("input[type=checkbox]").change(function () {
				$(this).is(":checked") && $(this).removeClass("invalid"), f()
			}), $("#collapse_payment_stripe_link").on("click", function () {
				$("#collapse_payment_stripe_select").show(), $("#radio_payment_stripe").prop("checked", !0).trigger("change"), $("#collapse_payment_stripe_link").hide()
			}), $("a.currency").click(updateTotals), $("#payment_form").submit(function () {
				var f = [];
				if ($("#check-confirm-termofuse").is(":checked") || f.push(lang_strings.error_form_accept_terms_conditions), $("#check-confirm-cancellation").is(":checked") || f.push(lang_strings.error_form_accept_change_cancellation), validateAllFields(f.join("<br><br>"))) {
					var g = $("input[name=payment_type]:checked").val(),
						h = "STRIPE" == g;
					if (!c) {
						h || ("BANK_TCB" != g && "BANK_VCB" != g && "CASH_TCB" != g && "CASH_VCB" != g && "CASH" != g || "" != $("#prebook").val() ? e() : $main.addClass("blur"));
						var i = $("#prebook").val() ? $("#prebook").val().split(",") : [];
						if (0 == i.length) {
							if (!h) return !0;
							c = !0
						} else if (!d) {
							var j = 0;
							d = !0;
							var k = 0,
								l = setInterval(function () {
									sendAjax({
										url: site_url + "ajax/prebook/" + $("#payment_form").attr("data-sess_key") + "/" + i[k] + "/?payment_type=" + g,
										dataType: "html",
										success: function (e) {
											"OK" == e ? (j++, j >= i.length && (c = !0, d = !1, h || $("#payment_form")[0].submit())) : (clearTimeout(b), "SEAT_NOT_AVAILABLE" == e ? showError(lang_strings.error_book_bus_seat_not_available, function () {
												$main.addClass("blur"), window.location = site_url + "passengers?refresh_seats=1&sess_key=" + $("#payment_form").attr("data-sess_key")
											}) : "PRICE_CHANGE" == e ? showError(lang_strings.error_price_has_changed, function () {
												$main.addClass("blur"), window.location = site_url + "payment/?sess_key=" + $("#payment_form").attr("data-sess_key")
											}) : "SOLD_OUT" == e ? showError(lang_strings.error_fare_sold_out, function () {
												$main.addClass("blur"), window.location = site_url + "results/?departure=&sess_key=" + $("#payment_form").attr("data-sess_key")
											}) : "ERROR_VERIFY" == e ? showError(lang_strings.error_price_verification, function () {
												$main.addClass("blur"), window.location = site_url + "results/?departure=&sess_key=" + $("#payment_form").attr("data-sess_key")
											}) : "PARALLEL_PREBOOK" == e ? setTimeout(function () {
												d = !1, h || $("#payment_form").trigger("submit")
											}, 1e4) : (clearTimeout(a), hideWaitingOverlay(), showError(e), d = !1))
										},
										error: function () {
											j++, j >= i.length && (c = !0, d = !1, h || $("#payment_form")[0].submit())
										}
									}), k++, k >= i.length && clearInterval(l)
								}, 2e3)
						}
					}
					if (h) showStripeForm($("#total_booking").html().replace("&nbsp;", ""), function (a) {
						$("input[name=stripeSource]").val(a), h = !1, e(), c && $("#payment_form")[0].submit()
					});
					else if (c) return !0
				}
				return !1
			}), $(".payment_radio").change(function () {
				$(this).prop("checked") && ($(".payment_radio_collapse_panel").collapse("hide"), $(this).closest(".payment-card").find("a.collapsed:first").trigger("click"), $(this).hasClass("payment_bank") && $(this).closest(".payment-card").find(".bank_provinces").trigger("change"), "radio_payment_stripe" == $(this).attr("id") && $("#collapse_payment_stripe_select").show(), "radio_payment_stripe_alipay" == $(this).attr("id") ? ($("#total_charged_row_vnd").hide(), $("#total_charged_row_sgd").toggle("SGD" != currency)) : "radio_payment_onepay" == $(this).attr("id") || "radio_payment_amex" == $(this).attr("id") || "radio_payment_domestic" == $(this).attr("id") ? ($("#total_charged_row_vnd").toggle("VND" != currency), $("#total_charged_row_sgd").hide()) : ($("#total_charged_row_vnd").hide(), $("#total_charged_row_sgd").hide()))
			}).change(), $("#payment_group_tabs a").on("shown.bs.tab", function () {
				var a = $("#tab_content_payment").find(".tab-pane.active");
				a.find(".payment_radio:first").prop("checked", !0).trigger("change")
			}), $(".bank_provinces").change(function () {
				if ("" != $(this).val()) {
					var a = new String($(this).val()).toLowerCase().replace("_", "%20"),
						b = $(this).attr("bank"),
						c = b + "%20ở%20" + a.split("_").join("%20"),
						d = "https://www.google.com/maps/embed/v1/search?q=" + c + "&key=AIzaSyAPmAU86AzF1DqdBw_MfN8jD03gSKR3pbg";
					$("#" + b + "_map").prop("src", d)
				}
			})
		}

		function initConfirmation() {
			$(".bank_provinces").change(function () {
				if ("" != $(this).val()) {
					var a = new String($(this).val()).replace("_", "%20"),
						b = $(this).attr("bank"),
						c = b + "%20" + a.split("_").join("%20"),
						d = "https://www.google.com/maps/embed/v1/search?q=" + c + "&key=AIzaSyAPmAU86AzF1DqdBw_MfN8jD03gSKR3pbg";
					$("#" + b + "_map").prop("src", d)
				}
			}).change(), redirect_url && setTimeout(function () {
				window.location = redirect_url
			}, 3e4)
		}

		function showStripeForm(a, b) {
			var c = stripe.elements({
					fonts: [{
						family: "Panton",
						src: 'url(https://www.baolau.com/fonts/Panton.ttf) format("truetype")'
					}]
				}),
				d = {
					base: {
						color: "rgba(115, 121, 127, 1)",
						fontSmoothing: "antialiased",
						fontWeight: 400,
						fontSize: $window.width() < 992 ? "14px" : "16px",
						fontFamily: '"Panton"',
						"::placeholder": {
							color: "rgba(115, 121, 127, .7)",
							fontStyle: "italic",
							fontFamily: '"Panton"',
							fontWeight: 400
						},
						":-webkit-autofill": {
							color: "#fce883"
						}
					},
					invalid: {
						color: "#c9302c"
					}
				},
				e = c.create("cardNumber", {
					placeholder: lang_strings.stripe_form_card_number,
					style: d
				});
			e.mount("#card-number");
			var f = c.create("cardExpiry", {
				placeholder: lang_strings.stripe_form_expiry,
				style: d
			});
			f.mount("#card-expiry");
			var g = c.create("cardCvc", {
				placeholder: "CVC",
				style: d
			});
			g.mount("#card-cvc"), $("#payment_popup").modal("show"), $("#stripe_btn").val(lang_strings.stripe_form_button_pay + " " + a);
			var h = $("#stripe_form");
			h.submit(function () {
				h.find(".submit").prop("disabled", !0), $("input[name=stripeSource]").val("");
				var a = {
					owner: {
						name: $("#cardholder_name").val()
					}
				};
				return stripe.createSource(e, a).then(function (a) {
					var c = $("#stripe_form"),
						d = !1;
					a ? "undefined" != typeof a.error && a.error ? d = a.error.message : "undefined" == typeof a.source && (d = "Payment gateway did not respond as expected. Please refresh this page and try again.") : d = "There was a problem connecting to the payment gateway. Please refresh this page and try again.", d ? (log_message(a ? $("#payment_popup .booking_code").html() + ": Stripe source had error - response: " + JSON.stringify(a) : $("#payment_popup .booking_code").html() + ": Stripe source had error - No response from Stripe"), c.find(".error").text(a.error.message), c.find(".submit").prop("disabled", !1)) : processStripe3D(a.source).then(function (a) {
						$("#iframe_form").attr("src", ""), "function" == typeof b ? b(a) : ($("input[name=stripeSource]").val(a), c.get(0).submit())
					})["catch"](function (a) {
						"undefined" != typeof a.message && (a = a.message), log_message($("#payment_popup .booking_code").html() + ": Stripe 3D caught error - " + a), $("#iframe_form").attr("src", ""), setTimeout(function () {
							$("#payment_popup").modal("show"), c.find(".error").text(a), c.find(".submit").prop("disabled", !1), $main.removeClass("blur")
						}, 1e3)
					})
				}), !1
			})
		}

		function processStripe3D(a) {
			return $("#payment_popup").modal("hide"), $("#stripe_form").find(".submit").prop("disabled", !1), $main.addClass("blur"), new Promise(function (b, c) {
				var d = !0,
					e = $("#payment_form").attr("data-sess_key") ? $("#payment_form").attr("data-sess_key") : $("#payment_popup .booking_code").html(),
					f = $("#refund_due").length ? str2number($("#refund_due").attr("data-amount")) : $("#total_booking").attr("data-amount");
				"VND" != currency && (f = exchange(f, "VND", currency)), $.post(site_url + "ajax/risk_assessment/" + e, {
					amount: f,
					currency: currency
				}, function (e) {
					"undefined" != typeof e && "" != e && 5 > e && (d = !1), d || "required" == a.card.three_d_secure ? "not_supported" == a.card.three_d_secure ? ($main.removeClass("blur"), c(lang_strings.error_3D_verification), log_message($("#payment_popup .booking_code").html() + ": Stripe payment rejected because 3d_secure is not supported")) : (($.inArray(currency, int_currencies) < 0 || $.inArray(currency, stripe_float_currencies) >= 0) && (f = Math.round(100 * f)), stripe.createSource({
						type: "three_d_secure",
						amount: f,
						currency: currency,
						three_d_secure: {
							card: a.id
						},
						redirect: {
							return_url: site_url + "payment/spinner/STRIPE"
						},
						owner: {
							name: $("#cardholder_name").val()
						}
					}).then(function (a) {
						$("#iframe_form").attr("src", ""), "undefined" != typeof a.error ? c(a.error) : "undefined" != typeof a.source.error ? c(a.source.error) : "failed" == a.source.status ? c(lang_strings.error_3D_verification) : ($("#iframe_form").attr("src", a.source.redirect.url), $(".stripe-verification-title").html(lang_strings.stripe3d_modal_title), $("#iframe_popup").modal({}), $("#login_form_ajax").remove(), stripePoll(b, c, a.source.id), $main.removeClass("blur"))
					})["catch"](function (a) {
						"undefined" != typeof a.message && (a = a.message), log_message($("#payment_popup .booking_code").html() + ": Error creating source for 3D - " + a), $("#iframe_form").attr("src", ""), setTimeout(function () {
							$("#payment_popup").modal("show"), $form.find(".error").text(a), $form.find(".submit").prop("disabled", !1), $main.removeClass("blur")
						}, 1e3)
					})) : b(a.id)
				})
			})
		}

		function stripePoll(a, b, c) {
			setTimeout(function () {
				$.get(site_url + "ajax/stripe_polling_source/" + c + "/" + stripe_account, function (d) {
					"chargeable" == d ? ($("#iframe_popup").modal("hide"), a(c)) : "canceled" == d || "consumed" == d || "failed" == d ? ($("#iframe_popup").modal("hide"), "STRIPE" == $("input[name=payment_type]:checked").val() && b(lang_strings.error_3D_verification)) : stripePoll(a, b, c)
				})
			}, 1200)
		}

		function initTabs() {
			if ($("#mobile_tabs").change(function () {
					a = $('#tabs-menu-style ul a[href="' + $(this).val() + '"]'), a.length && a.tab("show")
				}), $("#tabs-menu-style ul a").click(function () {
					$("#mobile_tabs").selectpicker("val", $(this).attr("href"))
				}), window.location.hash) {
				var a = $('#tabs-menu-style ul a[href="#tab-' + window.location.hash.substr(1) + '"]');
				a.length ? a.trigger("click") : $('a[href="' + window.location.hash + '"]')[0].click()
			}
		}

		function initRedirect() {
			redirect_params = JSON.parse(atob(redirect_params)), eval("book" + redirect_params.transport_code)(redirect_params)
		}

		function initManage() {
			var a = function () {
				$(".check-cancel-ticket:checked").length > 0 ? ($("#submit_cancellation").removeAttr("disabled"), $("#submit_cancellation").unbind("click").bind("click", function () {})) : ($("#submit_cancellation").attr("disabled", "disabled"), $("#submit_cancellation").bind("click", function () {
					return !1
				}))
			};
			a(), $("input[type=file]").change(function () {
				var a = "" === $(this).val() ? "No file" : $(this).val().split("\\").pop();
				$(this).parents("form").find(".filename").html(a)
			}), $("#btn_pay").click(function () {}), setTimeout(function () {
				$("#btn_pay_stripe").click(function () {
					var a = $("#refund_due").length ? $("#refund_due").html() : $("#total_booking").html();
					showStripeForm(a.replace("&nbsp;", ""), function (a) {
						$main.addClass("blur"), window.location = site_url + "manage/pay/" + $("#btn_pay_stripe").attr("data-booking") + "/" + a
					})
				})
			}, 50), $(".check-cancel-ticket").change(function () {
				var b = $(this),
					c = b.parents(".passenger").find(".upload-form .btn.btn-file");
				c.find('input[type="file"]').attr("disabled", !b.is(":checked")), b.is(":checked") ? ($(".check-cancel-ticket").removeClass("invalid"), c.parent().removeClass("btn-upload")) : (c.find("input").val(""), c.next().html("No file"), c.parent().addClass("btn-upload")), a()
			});
			var b = function () {
				var a = [];
				$(".check-cancel-ticket:checked").each(function () {
					a.push($(this).val())
				}), $("#cancellation_itineraries").val(a.join("***")), $("#cancel_booking_form").ajaxSubmit(function (a) {
					hideWaitingOverlay(), "OK" == a ? $("#cancellation_message").fadeIn() : ($("#cancellation_request").show(), showError(a))
				})
			};
			$("#submit_cancellation_confirm").click(function () {
				if (validateAllFields()) {
					var a = 0,
						c = !0,
						d = "online";
					if ($("#cancellation_request").hide(), $(".cancel-" + d).each(function () {
							var e = [];
							$(this).find(".upload-form").each(function () {
								if (c) {
									var f = $(this).find("input").val();
									"" != f && (a++, $(this).ajaxSubmit({
										dataType: "json",
										success: function (f) {
											"OK" == f.status && -1 == $.inArray(f.filename, e) ? (e.push(f.filename), a--, !a && $main.hasClass("blur") && ($("#filenames").val($("#filenames").val() + e.join("***")), $("#cancellation_method").val(d), b())) : (hideWaitingOverlay(), $("#cancellation_request").show(), "OK" == f.status ? (showError(lang_strings.error_same_file), c = !1) : showError(f.error))
										}
									}))
								}
							})
						}), a) {
						var e = $(".check-cancel-passport:checked").length,
							f = $('input[type="file"]').filter(function () {
								return "" !== $(this).val()
							}).length;
						e === f ? showWaitingOverlay("Uploading your documents", "Please wait...") : ($("#cancellation_request").show(), showError(lang_strings.error_fullfill_documents))
					} else {
						var g = $('.upload-form input[type="file"]').filter(function () {
							return !$(this).attr("disabled")
						}).length;
						g ? ($("#cancellation_request").show(), showError(lang_strings.error_select_documents)) : (showWaitingOverlay("Submitting your cancellation request", "Please wait..."), b())
					}
				}
				return !1
			}), $("#submit_cancellation_confirm").on("click", function () {
				$("#cancellation_pop_up, .modal-backdrop").addClass("hidden")
			})
		}

		function initReview() {
			$(":disabled").removeAttr("disabled").addClass("disabled"), $(".rating span").on("mouseenter", function () {
				var a = $(this).parents(".rating_row");
				a.find(".rating span").removeClass("active"), $(this).prevAll().addClass("active"), $(this).addClass("active"), a.find(".rating_text").html(lang_strings["booking_review_rating_" + ($(this).index() + 1)])
			}).on("mouseleave", function () {
				var a = $(this).parents(".rating_row"),
					b = a.find(".rating span.selected");
				b.length ? (a.find(".rating span").removeClass("active"), b.prevAll().addClass("active"), b.addClass("active"), a.find(".rating_text").html(lang_strings["booking_review_rating_" + (b.index() + 1)])) : (a.find(".rating span").removeClass("active"), a.find(".rating_text").html(""))
			}), $(".rating span").on("click touchend", function () {
				$(this).parents(".rating_row").find(".rating span").removeClass("selected"), $(this).addClass("selected"), $(this).parent().data("selected") || $(this).parent().data("selected", !0), $("#submit_btn").removeClass("disabled")
			}), $("#review_form").submit(function () {
				if ($("#submit_btn").hasClass("disabled")) return showError(lang_strings.error_missing_rating), log_message("Button is disabled (" + $("#review_form").attr("action") + ")"), !1;
				var a = !0;
				return $main.addClass("blur"), $(".rating:visible").each(function () {
					var a = $(this).find("span.selected"),
						b = a.length ? a.index() + 1 : "";
					b > 0 && $("input[name=" + $(this).attr("data-target") + "]").val(b)
				}), a
			})
		}

		function initAgentRegistration() {
			load_recaptcha(), $("#username").blur(function () {
				$("#username").val($("#username").val().toLowerCase().replace(" ", "")), "" != $("#username").val() && $("#username").data("value") != $("#username").val() && $.get(site_url + "agent/check_username/" + $(this).val(), function (a) {
					$("#username").data("value", $("#username").val()), "OK" != a ? ($("#username").addClass("invalid").focus(), showError(lang_strings.error_username_exists)) : $("#username").removeClass("invalid")
				})
			}), $("#registration_form").submit(function () {
				return validateAllFields() ? $("#password").val() != $("#password2").val() ? ($("#password, #password2").addClass("invalid"), scrollToElement($("#password")), showError(lang_strings.error_passwords_match), !1) : !0 : !1
			})
		}

		function initAffiliateRegistration() {
			load_recaptcha(), $("#username, #email").blur(function () {
				var a = $(this);
				a.val(a.val().toLowerCase().replace(" ", "")), "" != a.val() && a.data("value") != a.val() && $.get(site_url + "affiliate/check_affiliate_exists/" + a.attr("id") + "/?val=" + a.val(), function (b) {
					a.data("value", a.val()), "OK" != b ? (a.addClass("invalid").focus(), showError(lang_strings["error_" + a.attr("id") + "_exists"])) : a.removeClass("invalid")
				})
			}), $("#registration_form").submit(function () {
				if (!validateAllFields()) return !1;
				if ($("#password").val() != $("#password2").val()) return $("#password, #password2").addClass("invalid"), scrollToElement($("#password")), showError(lang_strings.error_passwords_match), !1;
				var a = /^[a-zA-Z0-9]+$/;
				return a.test($("#username").val()) ? !0 : (scrollToElement($("#username")), $("#username").addClass("invalid").focus(), showError("Username can only contain alphanumeric characters only."), !1)
			})
		}

		function initUserRegistration() {
			load_recaptcha(), $("input, select").each(function () {
				$(this).data("dirty", !1)
			}).focus(function () {
				validateField($(this), !0), $(this).data("dirty", !0)
			}).on("keyup blur change", function (a) {
				if ("email" === $(this).attr("id")) {
					var b = $(this);
					b.val(b.val().toLowerCase().replace(" ", "")), "" !== b.val() && b.data("value") !== b.val() && $.get(site_url + "user/check_user_exists/" + b.attr("id") + "/?val=" + b.val(), function (a) {
						b.data("value", b.val()), "OK" !== a ? (b.addClass("invalid"), showError(lang_strings["error_" + b.attr("id") + "_exists"])) : b.removeClass("invalid")
					})
				}
				9 !== a.which && validateField($(this), !0)
			}), $("#registration_form").submit(function () {
				return validateAllFields() ? !0 : !1
			})
		}

		function initUserBookings() {
			$(".fast_cancel_booking").click(function () {
				var a = $(this).attr("booking_code");
				$("#cancellation_pop_up").modal("show"), $("#submit_cancellation_confirm").unbind("click").bind("click", function (b) {
					return b.preventDefault(), $.ajax({
						url: site_url + "user/fast_fully_cancel_booking/" + a,
						dataType: "json",
						beforeSend: function () {
							$("#cancellation_pop_up").modal("hide")
						},
						success: function (a) {
							"relogin" == a.status ? window.location.reload() : "ERROR" == a.status ? showError(lang_strings.error_booking_not_validated) : window.location.reload()
						}
					}), !1
				})
			})
		}

		function initUserProfile() {
			function a(a) {
				a ? ($("#btn_update_profile").addClass("yellow"), $("#btn_update_profile").removeClass("disabled")) : ($("#btn_update_profile").removeClass("yellow"), $("#btn_update_profile").addClass("disabled"))
			}
			$(":disabled").removeAttr("disabled").addClass("disabled"), $(".user-trips").owlCarousel({
				autoplay: !1,
				margin: 15,
				dots: !0,
				responsiveClass: !0,
				responsive: {
					0: {
						items: 1
					},
					768: {
						items: 2
					},
					1024: {
						items: 3
					}
				}
			}), $(".filters-view input").change(function () {
				$body.addClass("blur"), $(this).parents(".filters-view").find("input").not(this).prop("checked", !1).parents(".btn-status-filter").removeClass("active"), $(this).parents(".btn-status-filter").addClass("active"), $(".user-trips:not(.hidden)").addClass("hidden"), $("." + $(this).val()).removeClass("hidden"), setTimeout(function () {
					$body.removeClass("blur")
				}, 1e3)
			}), a(!1), $("#profile_form input,#profile_form select").each(function () {
				$(this).data("dirty", !1)
			}).focus(function () {
				validateField($(this), !0), $(this).data("dirty", !0)
			}).on("keyup blur change", function (b) {
				if ($(this).hasClass("optional_field")) {
					var c = $(this).parents(".row").find(".optional_field"),
						d = c.filter(function () {
							return "" === $(this).val().trim()
						}).length;
					d == c.length ? c.removeClass("invalid").addClass("optional") : c.removeClass("optional")
				}
				9 != b.which && validateField($(this), !0), "change" == b.type && a(!0)
			}), $("#profile_form").ajaxForm({
				beforeSubmit: function () {
					if ($("#btn_update_profile").hasClass("disabled")) return showError(lang_strings.error_if_users_click_disabled_submit_button), !1;
					if (!validateAllFields()) return !1;
					if ($("#new_password").val() != $("#confirm_password").val()) return $("#new_password, #confirm_password").addClass("invalid"), scrollToElement($("#new_password")), showError(lang_strings.error_passwords_match), !1;
					if (("" != $("#new_password").val() || "" != $("#confirm_password").val()) && "" == $("#password").val()) return $("#password").addClass("invalid"), showError(lang_strings.form_errors), !1;
					if ("" != $("#password").val()) {
						var a = !1;
						if ("" == $("#new_password").val() && ($("#new_password").addClass("invalid"), a = !0), "" == $("#confirm_password").val() && ($("#confirm_password").addClass("invalid"), a = !0), a) return showError(lang_strings.form_errors), !1
					}
					return $body.addClass("blur"), !0
				},
				success: function (a) {
					"OK" == a.status ? "" != $("#new_password").val() ? ($body.removeClass("blur"), showModalMessage(lang_strings.successful, lang_strings.reset_password_success_message), $("#modal_message").on("hidden.bs.modal", function () {
						window.location.reload()
					})) : window.location.reload() : (showError(a.error), $body.removeClass("blur"))
				},
				error: function () {
					showError(lang_strings.user_profile_form_fail), $body.removeClass("blur")
				},
				dataType: "json"
			})
		}

		function initResetPassword() {
			$("#reset_password_form").submit(function () {
				return validateAllFields() ? $("#new_password").val() != $("#confirm_password").val() ? ($("#new_password, #confirm_password").addClass("invalid"), scrollToElement($("#new_password")), showError(lang_strings.error_passwords_match), !1) : !0 : !1
			})
		}

		function initWidget() {}

		function initAffiliateProfileDetails() {
			function a(a) {
				a ? ($("#btn_update_booking").addClass("yellow"), $("#btn_update_booking").removeAttr("disabled")) : ($("#btn_update_booking").removeClass("yellow"), $("#btn_update_booking").attr("disabled", "disabled"))
			}
			a(!1), validateField($("[name=account_holder]")), validateField($("[name=bank_name]")), validateField($("[name=IBAN]")), validateField($("[name=SWIFT]")), validateField($("[name=country]")), $("#affiliate_details_form input,#affiliate_details_form select").on("change", function () {
				validateField($(this)), a(!0)
			}), $("#btn_update_booking").click(function () {
				if ("disabled" == $("#btn_update_booking").attr("disabled")) return !1;
				if (!validateAllFields()) return !1;
				if ($("#new_password").val() != $("#confirm_password").val()) return $("#new_password, #confirm_password").addClass("invalid"), scrollToElement($("#new_password")), showError(lang_strings.error_passwords_match), !1;
				if (("" != $("#new_password").val() || "" != $("#confirm_password").val()) && "" == $("#old_password").val()) return $("#old_password").addClass("invalid"), showError(lang_strings.form_errors), !1;
				if ("" != $("#old_password").val()) {
					var a = !1;
					if ("" == $("#new_password").val() && ($("#new_password").addClass("invalid"), a = !0), "" == $("#confirm_password").val() && ($("#confirm_password").addClass("invalid"), a = !0), a) return showError(lang_strings.form_errors), !1
				}
				$body.addClass("blur"), $("#affiliate_details_form").ajaxSubmit(function (a) {
					"OK" == a ? "" != $("#new_password").val() ? ($body.removeClass("blur"), showModalMessage(lang_strings.successful, lang_strings.reset_password_success_message), $("#modal_message").on("hidden.bs.modal", function () {
						window.location.reload()
					})) : window.location.reload() : (showError(a), $body.removeClass("blur"))
				})
			})
		}

		function initAgentProfile() {
			function a(a) {
				a ? ($("#btn_update_agent").addClass("yellow"), $("#btn_update_agent").removeAttr("disabled")) : ($("#btn_update_agent").removeClass("yellow"), $("#btn_update_agent").attr("disabled", "disabled"))
			}
			a(!1), $("#agent_details_form input,#agent_details_form select").on("change", function () {
				validateField($(this)), a(!0)
			}), $("#btn_update_agent").click(function () {
				if ("disabled" == $("#btn_update_agent").attr("disabled")) return !1;
				if (!validateAllFields()) return !1;
				if ($("#new_password").val() != $("#confirm_password").val()) return $("#new_password, #confirm_password").addClass("invalid"), scrollToElement($("#new_password")), showError(lang_strings.error_passwords_match), !1;
				if (("" != $("#new_password").val() || "" != $("#confirm_password").val()) && "" == $("#old_password").val()) return $("#old_password").addClass("invalid"), showError(lang_strings.form_errors), !1;
				if ("" != $("#old_password").val()) {
					var a = !1;
					if ("" == $("#new_password").val() && ($("#new_password").addClass("invalid"), a = !0), "" == $("#confirm_password").val() && ($("#confirm_password").addClass("invalid"), a = !0), a) return showError(lang_strings.form_errors), !1
				}
				$body.addClass("blur"), $("#agent_details_form").ajaxSubmit(function (a) {
					"OK" == a ? "" != $("#new_password").val() ? ($body.removeClass("blur"), showModalMessage(lang_strings.successful, lang_strings.reset_password_success_message), $("#modal_message").on("hidden.bs.modal", function () {
						window.location.reload()
					})) : window.location.reload() : (showError(a), $body.removeClass("blur"))
				})
			}), $("#btn_change_agent_pwd").click(function () {
				var a = !1;
				return validateField($("#old_password")) || ($("#old_password").addClass("invalid"), a = !0), validateField($("#new_password")) || ($("#new_password").addClass("invalid"), a = !0), validateField($("#confirm_password")) || ($("#confirm_password").addClass("invalid"), a = !0), a ? (showError(lang_strings.form_errors), !1) : $("#new_password").val() != $("#confirm_password").val() ? ($("#new_password, #confirm_password").addClass("invalid"), showError(lang_strings.error_passwords_match), !1) : ($body.addClass("blur"), void $("#update_agent_detail").ajaxSubmit(function (a) {
					"OK" == a ? window.location.reload() : (showError(a), $body.removeClass("blur"))
				}))
			})
		}

		function initContactForm() {
			function a(a) {
				var b = $("#" + a);
				b.ajaxForm({
					beforeSubmit: function () {
						var a = b.find("[name='check-if-bookingid']").is(":checked");
						if ($main.hasClass("blur")) return !1;
						if (b.find("[name='name'], [name='email'], [name='message']").removeClass("invalid"), b.find("[name='subject']").next().removeClass("invalid"), a) {
							if ("" == b.find("[name='booking_code']").val()) return b.find("[name='booking_code']").addClass("invalid"), b.find(".contact_error .message").html(lang_strings.contact_form_no_booking_code), b.find(".contact_error").show(), !1
						} else if ("" == b.find("[name='name']").val()) return b.find("[name='name']").addClass("invalid"), b.find(".contact_error .message").html(lang_strings.contact_form_no_name), b.find(".contact_error").show(), !1;
						return "" == b.find("[name='email']").val() ? (b.find("[name='email']").addClass("invalid"), b.find(".contact_error .message").html(lang_strings.contact_form_no_email), b.find(".contact_error").show(), !1) : "" == b.find("[name='subject']").val() ? (b.find("[name='subject']").next().addClass("invalid"), b.find(".contact_error .message").html(lang_strings.contact_form_no_subject), b.find(".contact_error").show(), !1) : "" == b.find("[name='message']").val() ? (b.find("[name='message']").addClass("invalid"), b.find(".contact_error .message").html(lang_strings.contact_form_no_comment), b.find(".contact_errorr").show(), !1) : ($main.addClass("blur"), !0)
					},
					success: function (a) {
						$main.removeClass("blur"), grecaptcha.reset(), $window.trigger("resize"), "OK" == a.status ? (b.find("[name='name'], [name='email'], [name='message'], [name='booking_code']").val(""), b.find("[name='subject']").selectpicker("val", ""), b.find(".contact_error .message").html(""), b.find(".contact_error").hide(), "static_" == b.attr("id_prefix") ? showModalMessage(lang_strings.successful, lang_strings.contact_form_sent_line) : ($("#contact_form, #contact_send_line").hide(), $("#contact_sent_line").fadeIn())) : "static_" == b.attr("id_prefix") ? showError(a.error) : (b.find(".contact_error .message").html(a.error), b.find(".contact_error").show())
					},
					error: function () {
						"static_" == b.attr("id_prefix") ? showError(lang_strings.contact_form_fail) : (b.find(".contact_error .message").html(lang_strings.contact_form_fail), b.find(".contact_error").show()), $main.removeClass("blur"), grecaptcha.reset(), $window.trigger("resize")
					},
					dataType: "json"
				})
			}
			$window.resize(function () {
				var a = $(".g-recaptcha iframe"),
					b = $(".g-recaptcha > div > div"),
					c = $(".g-recaptcha"),
					d = $("#recaptcha_field");
				if (d.css({
						"padding-bottom": "10px"
					}), c.css({
						transform: ""
					}), d.width() && b.width()) {
					if (b.css({
							width: a.width() - 6,
							height: a.height() - 6
						}), d.width() < b.width()) {
						var e = d.width() / b.width();
						c.css({
							transform: "scale(" + e + ")",
							"padding-left": 0
						}), d.css({
							"padding-bottom": 0
						})
					}
					d.css({
						opacity: 1
					})
				}
			}), $("#Contact_popup").on("shown.bs.modal", function () {
				$window.trigger("resize"), $("#recaptcha_field").css({
					opacity: 1
				})
			}).on("hidden.bs.modal", function () {
				$("#contact_form,#contact_send_line").show(), $("#contact_sent_line").hide()
			}).on("show.bs.modal", function () {
				load_recaptcha()
			}), $('#help-page-tab a[data-toggle="tab"]').on("show.bs.tab", function (a) {
				"#tab-contact" == a.currentTarget.hash && (load_recaptcha(), $("#static_recaptcha_field").css({
					opacity: 1
				}))
			}), $(".check-if-bookingid").change(function () {
				var a = $(this).closest("form.ajax_contact_form"),
					b = a.find("[name='name']"),
					c = a.find("[name='booking_code']"),
					d = a.find(".booking_code_row"),
					e = a.find(".contact_name_row");
				$(this).is(":checked") ? (b.val("").addClass("optional").hide(), e.hide(), c.removeClass("optional").show(), d.show()) : (c.val("").addClass("optional").hide(), d.hide(), b.removeClass("optional").show(), e.show())
			}), $(".contact_form_submit_btn").click(function () {
				var b = $(this).closest(".ajax_contact_form");
				b.length > 0 && a(b[0].id)
			})
		}

		function initLoginForm() {
			$("#login_form_ajax").ajaxForm({
				beforeSubmit: function () {
					return $main.hasClass("blur") ? !1 : ($("#login_username, #login_email, #login_password").removeClass("invalid"), "" == $("#login_username").val() ? ($("#login_username").addClass("invalid"), $("#login_error .message").html(lang_strings.login_form_no_username), $("#login_error").show(), !1) : "" == $("#login_email").val() ? ($("#login_email").addClass("invalid"), $("#login_error .message").html(lang_strings.login_form_no_email), $("#login_error").show(), !1) : "" == $("#login_password").val() ? ($("#login_password").addClass("invalid"), $("#login_error .message").html(lang_strings.login_form_no_password), $("#login_error").show(), !1) : ($main.addClass("blur"), !0))
				},
				success: function (a) {
					"OK" == a.status ? window.location = a.location : ($("#login_error .message").html(a.error), $("#login_error").show(), $main.removeClass("blur"))
				},
				error: function () {
					$("#login_error .message").html(lang_strings.login_form_fail), $("#login_error").show(), $main.removeClass("blur")
				},
				dataType: "json"
			}), $("#forgot_password_form").ajaxForm({
				beforeSubmit: function () {
					return $main.hasClass("blur") ? !1 : ($("#forgot_password_email").removeClass("invalid"), "" == $("#forgot_password_email").val() ? ($("#forgot_password_email").addClass("invalid"), $("#forgot_password_error .message").html(lang_strings.forgot_password_form_no_email), $("#forgot_password_error").show(), !1) : "" == $("#forgot_password_username").val() ? ($("#forgot_password_username").addClass("invalid"), $("#forgot_password_error .message").html(lang_strings.forgot_password_form_no_username), $("#forgot_password_error").show(), !1) : ($main.addClass("blur"), !0))
				},
				success: function (a) {
					"OK" == a.status ? ($("#forgot_password_form").remove(), $("#forgot_password_success").show()) : ($("#forgot_password_error .message").html(a.error), $("#forgot_password_error").show()), $main.removeClass("blur")
				},
				error: function () {
					$("#forgot_password_error .message").html(lang_strings.forgot_password_form_fail), $("#forgot_password_error").show(), $main.removeClass("blur")
				},
				dataType: "json"
			})
		}

		function init_agent_bookings() {
			function a(a, b) {
				$body.addClass("blur"), $("#ajax_pagination_container").html(""), $.post(site_url + "agent/search_bookings", {
					search: a,
					filters_status: b,
					ajax: 1
				}, function (a) {
					for (var b in a.booking_counters) {
						var c = b.toLowerCase().replace(" ", "");
						$(".badge." + c).html(a.booking_counters[b]), $(".btn-status-filter." + c).toggle(Number(a.booking_counters[b]) > 0), Number(a.booking_counters[b]) > 0 && $(".btn-status-filter." + c).prop("checked", !1)
					}
					"ERROR" == a.status ? ($("#bookings tbody").html(""), showError("No bookings found for this search")) : a.status && "NO_RESULTS" == a.bookings ? ($("#bookings tbody").html(""), showError("No bookings found for this search")) : ($("#bookings tbody").html(a.bookings), e()), "" != $("#search").val() && $("#searchclear").show(), $body.removeClass("blur")
				}, "json")
			}
			$("#agent_info #bookings th[data-sort]").unbind("click"), $("#agent_info #bookings th[data-sort] > .caret").hide();
			var b = 10,
				c = "itinerary",
				d = [],
				e = function () {
					initLogoSlideshows(b), d = [], $("#bookings tr.booking").each(function () {
						d.push({
							id: $(this).attr("id"),
							submitted: $(this).attr("data-submitted"),
							departure: $(this).attr("data-departure")
						})
					}), $("." + c).show()
				},
				f = function () {
					$body.addClass("blur");
					var a = 1;
					void 0 !== $("#pagination_current_page").val() && (a = $("#pagination_current_page").val()), $("#search").val(""), $(".filters-view input").prop("checked", !1), $("#check-all-status").prop("checked", !0), $.post(site_url + "agent/agent_bookings", {
						current_page: a,
						ajax: 1
					}, function (a) {
						for (var b in a.booking_counters) {
							var c = b.toLowerCase().replace(" ", "");
							$(".badge." + c).html(a.booking_counters[b]), $(".btn-status-filter." + c + ", .btn-operation-filter." + c).toggle(Number(a.booking_counters[b]) > 0)
						}
						"ERROR" == a.status ? ($("#bookings tbody").html(""), $("#ajax_pagination_container").html("")) : ($("#bookings tbody").html(a.bookings), e()), $("#ajax_pagination_container").html(a.paginations_html), "" != a.paginations_html && $("#ajax_pagination.search_bookings a").unbind("click").bind("click", function (a) {
							a.preventDefault(), $(this).hasClass("disabled") || ($("#pagination_current_page").val($(this).attr("num_page")), f())
						}), $body.removeClass("blur")
					}, "json")
				},
				g = function () {
					$("#ajax_pagination_container").html("");
					var b = new Array,
						c = $("#filter-status input:checked");
					c.each(function () {
						b.push($(this).val())
					}), b = b.length > 0 ? b.join("-") : 0;
					$("#filter-operation input:checked");
					a($("#search").val(), b)
				};
			e(), $(".filters-view input").change(function () {
				if ("0" == $(this).val() || "radio" == $(this).attr("type")) {
					if (!$(this).is(":checked")) return void $(this).prop("checked", !1);
					$(this).parents(".filters-view").find("input").not(this).prop("checked", !1).parents(".btn-status-filter, .btn-operation-filter").removeClass("active")
				} else $(this).parents(".filters-view").find("input.check-all").prop("checked", !1).parents(".btn-status-filter, .btn-operation-filter").removeClass("active");
				$(this).parents(".btn-status-filter, .btn-operation-filter").toggleClass("active", $(this).is(":checked")), $(this).is(":checked") || $(this).parents(".filters-view").find("input:checked").length || $(this).parents(".filters-view").find("input.check-all").prop("checked", !0), $("#check-all-status").is(":checked") && "" == $("#search").val() ? ($body.addClass("blur"), $("#pagination_current_page").val(1), f()) : ($body.addClass("blur"), g())
			}), $("[data-collapse-group='manager-filter']").click(function () {
				var a = $(this);
				$("[data-collapse-group='manager-filter']:not([data-target='" + a.data("target") + "'])").each(function () {
					$($(this).data("target")).removeClass("in").addClass("collapse")
				})
			}), $("#btn_search").click(function () {
				"" != $("#search").val() ? ($("#btn_search").addClass("searching"), a($("#search").val(), 0)) : $("#searchclear").trigger("click")
			}), $("#searchclear").click(function () {
				$body.addClass("blur"), $("#search").val(""), $("#btn_search").removeClass("searching"), $("#pagination_current_page").val(1), f(), $(this).hide()
			}), $("#ajax_pagination.search_bookings a").click(function (a) {
				a.preventDefault(), $(this).hasClass("disabled") || ($("#pagination_current_page").val($(this).attr("num_page")), f())
			}), $("#search").on("keyup", function (a) {
				return 13 == a.which && $("#btn_search").trigger("click"), a.preventDefault(), !1
			}), $("#switch_itinerary_contact").click(function () {
				$("." + c).hide(), c = "itinerary" == c ? "contact" : "itinerary", $("." + c).show()
			})
		}

		function initYourTransactions() {
			function a() {
				$body.addClass("blur");
				var b = 1,
					c = $("#period").val();
				void 0 !== $("#pagination_current_page").val() && (b = $("#pagination_current_page").val()), $.ajax({
					type: "POST",
					url: site_url + "agent/ajax_query_transaction",
					data: {
						period: c,
						current_page: b
					},
					dataType: "json",
					success: function (b) {
						"SUCCESS" == b.code ? ($("#transaction_table tbody").html(b.list_transactions_html), $("#ajax_pagination_container").html(b.paginations_html), "" != b.paginations_html && $("#ajax_pagination.search_transaction a").unbind("click").bind("click", function (b) {
							b.preventDefault(), $(this).hasClass("disabled") || ($("#pagination_current_page").val($(this).attr("num_page")), a())
						})) : showError("Only PREPAID agent is allowed"), $body.removeClass("blur")
					},
					error: function () {
						showError("Invalid !")
					}
				})
			}
			$("#ajax_pagination.search_transaction a").click(function (b) {
				b.preventDefault(), $(this).hasClass("disabled") || ($("#pagination_current_page").val($(this).attr("num_page")), a())
			}), $("#period").change(function () {
				var a = $(this).val();
				window.location.href = site_url + "agent/agent_transactions/" + a
			})
		}

		function collectFares(a, b) {
			var c = "",
				d = results[results_index[b]].price_breakdown,
				e = new Array;
			for (var f in d) d[f].fare && e.push(f + ":" + d[f].fare);
			return c += "&" + a + "_fares=" + e.join(",")
		}

		function sortResultsBy(a, b, c) {
			var d = ["score", "itinerary", "departure", "arrival", "price", "duration"],
				e = [b];
			for (var f in d) d[f] != b && e.push(d[f]);
			"undefined" == typeof c && (c = "asc");
			var g = "asc" == c ? 1 : -1;
			results.sort(function (a, b) {
				for (var c in e)
					if (a[e[c]] != b[e[c]]) return g * (a[e[c]] - b[e[c]])
			});
			for (var f in results) {
				var h = $("#" + results[f].id);
				if (!h.hasClass("checking") || h.hasClass("clicked")) {
					var i = $("#collapse-" + results[f].id),
						j = $("#gap-" + results[f].id);
					h.appendTo(a), i.appendTo(a), j.appendTo(a)
				}
				results_index[results[f].id] = f
			}
			for (var f in results) {
				var h = $("#" + results[f].id);
				if (h.hasClass("checking") && !h.hasClass("clicked")) {
					var i = $("#collapse-" + results[f].id),
						j = $("#gap-" + results[f].id);
					h.appendTo(a), i.appendTo(a), j.appendTo(a)
				}
			}
		}

		function make_result_record_unavailable(a) {
			$("#" + a).removeClass("checking clicked").addClass("unavailable-book"), $("#" + a).find(".money").eq(0).html(lang_strings.price_not_available).removeAttr("data-amount"), $("#" + a).find(".js-result_promo_tag").hide(), $("#" + a).find(".button-direct").addClass("fa-repeat")
		}

		function remove_result(a) {
			$("#" + a + ", #collapse-" + a + ", #gap-" + a).remove()
		}

		function updateResults(a, b) {
			"undefined" == typeof b && (b = {
				reorder: !1
			});
			var c = $("#search_results > tbody"),
				d = {},
				e = [];
			for (var f in a) {
				var g = a[f],
					h = $("#" + f);
				if (h.length) {
					h.hasClass("expanded") && e.push(f);
					var i = h.index(".result"),
						j = h.data("verified");
					$("#" + f + ", #collapse-" + f + ", #gap-" + f).remove(), i < $(".result").length ? $(".result").eq(i).before(g) : c.append(g), $("#" + f).data("verified", j)
				} else c.append(g);
				d[f] = !0
			}
			if ("undefined" != typeof b.transport_codes)
				for (var k in b.transport_codes) $("#search_results .direct." + b.transport_codes[k]).each(function () {
					var a = $(this).attr("id");
					d[a] || ($(this).remove(), $("#collapse-" + a).remove(), $("#gap-" + a).remove())
				});
			$("input[name=transport_filter]").each(function () {
				if (!$(this).is(":checked")) {
					var a = $(this).val();
					$(".result." + a).each(function () {
						$(this).hide(), $($(this).attr("data-target")).hide()
					})
				}
			}), initRoutes(), b.reorder && sortResultsBy(c, "score", "asc");
			for (var k in e) $("#" + e[k]).data("no-animation", !0).trigger("click");
			$(".result:visible").length && ($("#results_headers").show(), $("#results_disclaimer").css("opacity", 1), $("#no_results, #loading_results").hide(), $("#btnLoadMore").show(), $("#btnLoadMore").attr("disabled", !1), $("#loadingGif").hide())
		}

		function updateTotals(a) {
			var b;
			b = "undefined" != typeof a && 0 == $("#total_booking").length ? a : $(".result");
			var c = $("#processing_fee").length > 0,
				d = 0,
				e = 0,
				f = 0,
				g = 0,
				h = 0,
				i = 0,
				j = 0,
				k = 0,
				l = 0,
				m = 0,
				n = !1;
			if (b.each(function () {
					var a = $(this),
						b = results_index[a.attr("id")],
						h = 0,
						i = 0,
						j = results[b].price_breakdown,
						k = results[b].allow_price_zero;
					for (var l in j)
						if ("taxi" != j[l].type && "walking" != j[l].type) {
							var m = Number(j[l].price);
							if (m >= SOLD_OUT || 0 >= m && !k) return $("#price_summary").hide(), m = lang_strings[m >= SOLD_OUT ? "sold_out" : "not_yet_open"], $("#total_booking").length && $("#total_booking").html(m), void a.find(".total_price").html(m);
							if (h += m, i += exchange(m, "VND"), "taxi" != j[l].type) {
								if (c) {
									var o = Number($(".service_fee_" + l).attr("data-amount"));
									f += o, g += exchange(o, "VND")
								}
								d += m, e += exchange(m, "VND"), $(".price_" + l).attr("data-amount", m).html(number2money(exchange(m, "VND"))), $(".fare_" + l).length && m < SOLD_OUT && j[l].base_fare != m ? ($(".fare_" + l).attr("data-amount", j[l].base_fare).html(number2money(exchange(j[l].base_fare, "VND"))).parents(".basefare_row").show(), $(".taxes_" + l).attr("data-amount", m - j[l].base_fare).html(number2money(exchange(m - j[l].base_fare, "VND"))).parents(".taxes_row").show()) : $(".fare_" + l).parents("[data-row]").hide();
								var p = $("#fare_" + a.attr("id") + "_" + l + "_" + j[l].fare);
								"1" == p.attr("data-has_promotion") && (n = !0)
							}
						}
					results[b].price = h, a.find(".total_price .money").attr("data-amount", h).html(number2money(i)), a.find(".js-result_promo_tag").toggle(n)
				}), $("#total_booking").length > 0) {
				if ($("#total_booking").html() == lang_strings.sold_out) return;
				var o = Number($("#price_summary").attr("data-passengers")),
					p = $("#subtotal").length ? Number($("#subtotal").attr("data-amount")) : (d + f) * o,
					q = $("#subtotal").length ? exchange(Number($("#subtotal").attr("data-amount")), "VND") : (e + g) * o,
					r = $($("input[name=payment_type]:checked").length ? "input[name=payment_type]:checked" : "#payment_type");
				h = c && r.attr("data-processing-fee") ? Number(r.attr("data-processing-fee")) : 0, i = exchange(h, "VND"), $("#discount_amount").length && (j = Number($("#discount_amount").attr("data-amount")), k = exchange(j, "VND")), $("#processing_fee").attr("data-amount", h).html(number2money(i)), $("#red_invoice_delivery_fee").length && (l = Number($("#red_invoice_delivery_fee").attr("data-amount")), m = exchange(l, "VND")), $("#total_booking_discount").length ? ($("#total_booking").attr("data-amount", p + h + l).html(number2money(q + i + m)), $("#total_booking_discount").attr("data-amount", p + h + j + l).html(number2money(q + i + k + m))) : $("#total_booking").attr("data-amount", p + h + j + l).html(number2money(q + i + k + m)); {
					$("#total_charged").attr("data-currency")
				}
				$("#total_charged_sgd").html(number2money(exchange(p + h + j + l, "VND", "SGD"), "SGD")), $("#total_charged_vnd").html(number2money(p + h + j + l, "VND")), $(".route_price_row").toggle(c), $(".subtotal_row, .processing_fee_row").toggle(h > 0)
			}
		}

		function validateField(a, b) {
			var c = !0,
				d = a.hasClass("bs-select-hidden") || "checkbox" == a.attr("type") || "radio" == a.attr("type") ? a.next().is(":visible") : a.is(":visible");
			if (b && d && !a.hasClass("optional") && !a.data("dirty")) c = !0;
			else if (a.hasClass("optional") || !d || "file" == a.attr("type")) c = !0, a.hasClass("check-cancel-ticket") && (c = $(".check-cancel-ticket:checked").length > 0), d || a.hasClass("also_submit_hidden") || "text" == a.attr("type") && a.val("");
			else {
				if ("" != a.val().trim() || a.hasClass("optional") || (c = !1), "email" == a.attr("type")) {
					var e = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
					e.test(a.val()) || (c = !1), "verify_email" == a.attr("id") && $("#book_email").val() != a.val() && (c = !1)
				}
				if ("tel" == a.attr("type")) {
					var e = /^[+]*[0-9]+$/;
					e.test(a.val()) || (c = !1), ("book_country_code" === a.attr("id") && a.val().trim().length > 3 || "book_phone" === a.attr("id") && a.val().trim().length > 11) && (c = !1)
				}
				if (a.hasClass("passport_number")) {
					var e = /^([A-Za-z0-9])*$/;
					e.test(a.val()) || (c = !1)
				}
				if (a.hasClass("english")) {
					var e = /^([A-Za-z ])*$/;
					e.test(a.val()) || (c = !1)
				}
				if (a.hasClass("chinese")) {
					var e = /^([\u4e00-\u9fa5A-Za-z ])*$/;
					e.test(a.val()) || (c = !1)
				}
				"checkbox" != a.attr("type") || a.is(":checked") || (c = !1), "radio" != a.attr("type") || $("input[name=" + a.attr("name") + "]:checked").length || (c = !1), "password2" == a.attr("id") && $("#password").val() != a.val() && (c = !1)
			}
			return a.hasClass("bs-select-hidden") ? a.next().toggleClass("invalid", !c) : a.toggleClass("invalid", !c), c
		}

		function validateAllFields(a) {
			var b = !1;
			return $("input, select").each(function () {
				validateField($(this)) || b || (b = $(this).hasClass("bs-select-hidden") || "checkbox" == $(this).attr("type") || "radio" == $(this).attr("type") ? $(this).next() : $(this))
			}), b && (b.focus(), scrollToElement(b), showError("undefined" == typeof a ? lang_strings.form_errors : a)), !b
		}

		function isMobile() {
			return $window.width() <= 768
		}

		function isXS() {
			return $window.width() <= 768
		}

		function isSM() {
			return $window.width() > 768 && $window.width() <= 992
		}

		function isMD() {
			return $window.width() > 992 && $window.width() <= 1200
		}

		function isLG() {
			return $window.width() > 1200 && $window.width() <= 1700
		}

		function isXL() {
			return $window.width() > 1700
		}

		function scrollToElement(a, b) {
			"undefined" == typeof b && (b = 30), $(".mobile-header").is(":visible") && (b += $(".mobile-header").height()), $("html,body").animate({
				scrollTop: $(a).offset().top - b
			}, 400, "swing")
		}

		function fixTableCells(a) {
			a.find("td").css("width", "").each(function () {
				$(this).width($(this).width())
			})
		}

		function unfixTableCells(a) {
			a.find("td").css("width", "")
		}

		function sendAjax(a) {
			var b = {
				id: ajaxCalls.length,
				method: "GET",
				data: [],
				dataType: "json",
				status: "pending",
				critical: !1
			};
			a = $.extend(b, a), a.xhr = $.ajax({
				url: a.url,
				method: a.method,
				data: a.data,
				dataType: a.dataType,
				success: function (b) {
					ajaxCalls[a.id].status = "success", "function" == typeof a.common && a.common("success"), "function" == typeof a.success && a.success(b)
				},
				error: function () {
					"pending" == ajaxCalls[a.id].status && (ajaxCalls[a.id].status = "error"), "function" == typeof a.common && a.common(ajaxCalls[a.id].status), "function" == typeof a.error && a.error()
				},
				xhrFields: {
					withCredentials: !0
				}
			}), ajaxCalls[a.id] = a
		}

		function cancelAjax(a) {
			for (var b in ajaxCalls) "pending" != ajaxCalls[b].status || "undefined" != typeof a && a && ajaxCalls[b].critical || (ajaxCalls[b].status = "abort", ajaxCalls[b].xhr.abort())
		}

		function resumeAjax() {
			for (var a in ajaxCalls)("abort" == ajaxCalls[a].status || "error" == ajaxCalls[a].status) && (ajaxCalls[a].status = "pending", sendAjax(ajaxCalls[a]))
		}

		function parseQueryString(a) {
			"undefined" == typeof a && (a = window.location.search.substring(1));
			for (var b = {}, c = a.split("&"), d = 0; d < c.length; d++) {
				var e = c[d].split("=");
				b[decodeURIComponent(e[0])] = decodeURIComponent(e[1])
			}
			return b
		}

		function composeQueryString(a) {
			var b = [];
			for (var c in a) b.push(c + "=" + a[c]);
			return b.join("&")
		}

		function getQueryStringParam(a, b) {
			for (var c = a.split("&"), d = 0; d < c.length; d++) {
				var e = c[d].split("=");
				if (decodeURIComponent(e[0]) == b) return decodeURIComponent(e[1])
			}
		}

		function updateQueryStringParam(a, b, c) {
			for (var d = a.split("&"), e = 0; e < d.length; e++) {
				var f = d[e].split("=");
				if (decodeURIComponent(f[0]) == b) return f[1] = c, d[e] = f.join("="), d.join("&")
			}
		}

		function getAge(a, b) {
			if ("" == a) return !1;
			var c = "undefined" == typeof b ? new Date : new Date(b.replace(/-/g, "/")),
				d = new Date(a.replace(/-/g, "/"));
			if (isNaN(d.getTime()) || isNaN(c.getTime()) || 10 != a.length) return !1;
			var e = c.getFullYear() - d.getFullYear(),
				f = c.getMonth() - d.getMonth();
			return (0 > f || 0 === f && c.getDate() < d.getDate()) && e--, e
		}

		function stringToDate(a) {
			return "today" == a ? new Date : (a = -1 != a.indexOf("/") ? a.split("/").reverse().join("/") : a.replace(/-/g, "/"), new Date(a))
		}

		function initGoogleMap(a, b) {
			delete window.map, a.find(".map").remove(), a.html('<div id="' + Math.random() + '" class="map"></div>'), a = a.find(".map");
			var c = new google.maps.LatLngBounds,
				d = [{
					featureType: "poi",
					elementType: "labels",
					stylers: [{
						visibility: "off"
					}]
				}, {
					featureType: "administrative.province",
					elementType: "all",
					stylers: [{
						visibility: "off"
					}]
				}];
			map = new google.maps.Map(a[0], {
				zoom: 5,
				center: {
					lat: 16.4564,
					lng: 107.57845
				},
				mapTypeId: "Custom"
			});
			var e = new google.maps.StyledMapType(d, {
				name: "Custom"
			});
			map.mapTypes.set("Custom", e);
			var f = new Array,
				g = new Array,
				h = new Array,
				i = {
					path: google.maps.SymbolPath.CIRCLE,
					fillColor: "#ff4500",
					scale: 2,
					strokeColor: "#ff4500",
					strokeWeight: 5
				},
				j = new google.maps.InfoWindow({
					content: "Town"
				}),
				k = new Array;
			for (var l in b) {
				var m;
				m = new google.maps.Marker("taxi" == b[l][3] && l > 0 ? {
					map: map,
					position: new google.maps.LatLng(b[l][0], b[l][1]),
					icon: i,
					title: '<div style="min-width:10em; font-family:Open Sans, Calibri, Arial, sans-serif;"><i class="icon-fontastic-' + b[l - 1][3] + '" style="vertical-align:middle;"></i> ' + b[l][2] + "</div>"
				} : {
					map: map,
					position: new google.maps.LatLng(b[l][0], b[l][1]),
					icon: i,
					title: '<div style="min-width:10em; font-family:Open Sans, Calibri, Arial, sans-serif;"><i class="icon-fontastic-' + b[l][3] + '" style="vertical-align:middle;"></i> ' + b[l][2] + "</div>"
				}), google.maps.event.addListener(m, "click", function () {
					j.setContent(this.title), j.open(map, this)
				}), k.push(m.getPosition()), c.extend(m.getPosition()), f.push(m)
			}
			for (var n, o = new google.maps.DirectionsService, l = 0; l < b.length; l++) "plane" == b[l][3] || "boat" == b[l][3] ? (n = new google.maps.Polyline({
				path: [k[l], k[l + 1]],
				strokeColor: "#ff4500",
				strokeOpacity: 1,
				strokeWeight: 3
			}), n.setMap(map), g.push(n)) : o.route({
				origin: k[l],
				destination: k[l + 1],
				travelMode: google.maps.DirectionsTravelMode.DRIVING
			}, function (a) {
				var b = new google.maps.DirectionsRenderer({
					polylineOptions: {
						strokeColor: "#ff4500",
						strokeOpacity: 1,
						strokeWeight: 3
					}
				});
				b.setMap(map), b.setOptions({
					suppressMarkers: !0,
					preserveViewport: !0
				}), b.setDirections(a), h.push(b)
			});
			map.fitBounds(c), map.panToBounds(c)
		}

		function initCarrierConfirmation() {
			var a = function () {
				0 === $("#confirmation_term").length || $("#confirmation_term").is(":checked") ? $("#btn_confirm_booking").removeAttr("disabled") : $("#btn_confirm_booking").attr("disabled", "disabled")
			};
			a(), $("#confirmation_term").change(function () {
				$(this).is(":checked") && $(this).removeClass("invalid"), a()
			}), $("input").each(function () {
				$(this).data("dirty", !1)
			}).focus(function () {
				validateField($(this), !0), $(this).data("dirty", !0)
			}).on("keyup blur change", function (a) {
				9 != a.which && validateField($(this), !0)
			}), $("input[type=file]").change(function () {
				$(this).parents("form").find(".filename").html($(this).val().split("\\").pop())
			}), $(".pnr").change(function () {
				var a = $(this).val().trim() && "-" != $(this).val(),
					b = $(this).parents(".ticket_leg").find(".form_upload_voucher");
				b.toggleClass("upload_disable", !a), b.find('input[type="file"]').attr("disabled", !a), b.find(".btn_upload_voucher").toggleClass("disable", !a)
			}), $(".btn_upload_voucher").click(function () {
				var a = $(this).parents(".ticket_leg"),
					b = a.find(".pnr");
				b.val(b.val().toUpperCase().replace(" ", "").replace(",", "-").replace("/", "-"));
				var c = b.val(),
					d = a.find(".tnr");
				d.val(d.val().toUpperCase().replace(" ", "").replace(",", "-").replace("/", "-"));
				var e = d.val();
				a.find(".btn_upload_voucher").hide(), a.find(".upload_spinner").show(), a.find(".form_upload_voucher input[name=pnr]").val(c), a.find(".form_upload_voucher input[name=tnr]").val(e), a.find(".form_upload_voucher").ajaxSubmit(function (b) {
					a.find(".btn_upload_voucher").show(), a.find(".upload_spinner").hide(), "OK" == b ? (a.find(".form_upload_voucher").hide(), a.find(".voucher_iframe iframe").attr("src", site_url + "carrier/download_file?key=" + $("#step").attr("data-key")), a.find(".voucher_iframe").show(), a.find(".btn_delete_voucher").attr("data-href", site_url + "carrier/delete_file?key=" + $("#step").attr("data-key")), a.find(".pnr").hide(), a.find(".pnr-text").html(a.find(".pnr").val()).show(), a.find(".tnr").hide(), a.find(".tnr-text").html(a.find(".tnr").val()).show()) : showError(b)
				})
			}), $(".btn_delete_voucher").click(function () {
				var a = $(this).parents(".ticket_leg");
				return confirm(lang_strings.remove_file_confirmation) && $.get($(this).attr("data-href"), function (b) {
					"OK" == b ? (a.find(".voucher_iframe").hide(), a.find(".form_upload_voucher").show(), a.find(".pnr").show(), a.find(".pnr-text").hide(), a.find(".tnr").show(), a.find(".tnr-text").hide()) : showError(b)
				}), !1
			}), $("#btn_confirm_booking").click(function () {
				if (!validateAllFields()) return !1;
				var a = "",
					c = "",
					d = "",
					e = [],
					f = [],
					g = 0,
					h = "",
					i = "";
				$(".confirm_by, .tnr, .pnr, .seat_c, .carriage, .vehicle_registration_number, .deposit_balance, .remarks").each(function () {
					$(this).val($(this).val().trim()), ($(this).hasClass("tnr") || $(this).hasClass("pnr") || $(this).hasClass("seat_c") || $(this).hasClass("carriage")) && $(this).val($(this).val().replace(/\s+/g, "").toUpperCase()), $(this).hasClass("confirm_by") ? a = $(this).val() : $(this).hasClass("tnr") ? d = $(this).val() : $(this).hasClass("pnr") ? c = $(this).val() ? $(this).val() : $(this).parent().find(".pnr-text").text().replace(/\s+/g, "").toUpperCase() : $(this).hasClass("seat_c") ? e.push($(this).val()) : $(this).hasClass("carriage") ? f.push($(this).val()) : $(this).hasClass("vehicle_registration_number") ? h = $(this).val() : $(this).hasClass("deposit_balance") ? g = $(this).val() : i = $(this).val()
				}), b(a, d, c, e, f, h, g, i)
			});
			var b = function (a, b, c, d, e, f, g, h) {
				var i = {},
					j = [site_url, "carrier/confirm_ticket?key=", $("#btn_confirm_booking").attr("data-key"), "&response=", $("#btn_confirm_booking").attr("data-response")].join("");
				"undefined" != typeof a && (i.confirm_by = a), "undefined" != typeof b && (i.tnr = b), "undefined" != typeof c && (i.pnr = c), "undefined" != typeof d && (i.seats = d), "undefined" != typeof e && (i.carriages = e), "undefined" != typeof f && (i.vehicleRegistrationNumber = f), "undefined" != typeof g && (i.depositBalance = g), "undefined" != typeof h && (i.remarks = h), $main.addClass("blur"), showWaitingOverlay(lang_strings.carrier_form_waiting_title, lang_strings.carrier_form_waiting_sub), $.post(j, i, function (a) {
					"OK" == a ? window.location = site_url + "carrier/thank_you" : (hideWaitingOverlay(), showError(lang_strings.carrier_form_error), $main.removeClass("blur"))
				})
			}
		}

		function initAffiliateInstruction() {
			$("#generate_btn").click(function () {
				var a = ["origin_id", "origin", "origin_town", "origin_town_lang", "origin_type", "destination", "destination_id", "destination_town", "destination_town_lang", "destination_type"],
					b = $("#search_form").find("input[name='source']").val(),
					c = $("#search_form").find("select[name='transports']").val(),
					d = site_url + "results?source=" + b + "&transports=" + c,
					e = site_url + "widget/?source=" + b + "&transports=" + c;
				"" != $("#origin_id").val() && "" != $("#destination_id").val() && (a.forEach(function (a) {
					var b = $("#search_form").find("input[name='" + a + "']").val();
					b = b ? b.replace(/ /g, "+") : "", d += "&" + a + "=" + b, e += "&" + a + "=" + b
				}), $("#link_div").html(d), $("#iframe_div").html('&lt;iframe src="' + e + '" width="250" height="340" frameborder="0" scrolling="no"&gt&lt;/iframe&gt'))
			})
		}
		var $window = $(window),
			$body = $("body"),
			$main = $("#main_container"),
			ajaxCalls = [],
			map, progress_interval, date_format, default_year = 1980,
			CustomDatePicker = {
				hideOldDays: function () {
					var a = $(".datepicker .datepicker-days tr td.old");
					a.length > 0 && (a.css("visibility", "hidden"), 7 === a.length && a.parent().hide())
				},
				hideNewDays: function () {
					var a = $(".datepicker .datepicker-days tr td.new");
					a.length > 0 && a.hide()
				},
				hideOtherMonthDays: function () {
					CustomDatePicker.hideOldDays(), CustomDatePicker.hideNewDays()
				}
			};
		date_format = "ja" == lang || "cn" == lang || "tw" == lang ? {
			toDisplay: function (a) {
				var b = a.getFullYear() + "年" + ("0" + (a.getMonth() + 1)).substr(-2) + "月" + ("0" + a.getDate()).substr(-2) + "日";
				return b
			},
			toValue: function (a) {
				var b;
				return "today" == a ? b = new Date : (b = new Date(a.substr(0, 4) + "/" + a.substr(5, 2) + "/" + a.substr(8, 2)), b.setTime(b.getTime() - 60 * b.getTimezoneOffset() * 1e3)), b
			}
		} : "dd/mm/yyyy";
		var initFunctions = {
			booking_lang: initBookingLang,
			homepage: initHomepage,
			landing_banner: initLandingBanner,
			owl_carousel: initOwlCarousel,
			search_form: initSearchForm,
			your_search: initYourSearch,
			search_results: initSearchResults,
			routes: initRoutes,
			selected_results: initSelectedResults,
			summary: initSummary,
			price_summary: initPriceSummary,
			booking_form: initBookingForm,
			payment: initPayment,
			confirmation: initConfirmation,
			tabs: initTabs,
			redirect: initRedirect,
			manage: initManage,
			review: initReview,
			agent_registration: initAgentRegistration,
			affiliate_registration: initAffiliateRegistration,
			user_registration: initUserRegistration,
			user_profile: initUserProfile,
			user_bookings: initUserBookings,
			reset_password: initResetPassword,
			widget: initWidget,
			show_error: showError,
			agent_bookings: init_agent_bookings,
			agent_transactions: initYourTransactions,
			initAffiliateProfileDetails: initAffiliateProfileDetails,
			initAgentProfile: initAgentProfile,
			carrier_confirmation: initCarrierConfirmation,
			vetautet: initVetautet,
			search_vetautet: initSearchVetautet,
			transport: inittransport,
			transportation: inittransportation,
			transport_old: inittransport_old,
			affiliate_instruction: initAffiliateInstruction
		};
		(new WOW).init(), $('[data-toggle="popover"]').popover({
			template: '<span class="popover-style"><span></span><span class="popover-content"></span></span>'
		}), $(".nospaces").on("keypress", function (a) {
			return 32 == a.which ? !1 : void 0
		});
		var niceScrollOptions = {
			cursorcolor: "#000",
			cursorborder: "0px solid #fff",
			railpadding: {
				top: 0,
				right: 0,
				left: 0,
				bottom: 0
			},
			cursorwidth: "10px",
			cursorborderradius: "0px",
			cursoropacitymin: .2,
			cursoropacitymax: .8,
			boxzoom: !0,
			horizrailenabled: !1,
			zindex: 9999
		};
		$body.niceScroll(niceScrollOptions), window.addEventListener("keydown", function (a) {
			(114 === a.keyCode || a.ctrlKey || a.metaKey && 70 === a.keyCode) && $body.css("overflow", "auto")
		}), $(".nav-drop").dropit(), $("select").selectpicker({
			dropupAuto: !1,
			size: 5
		}), initContactForm(), initLoginForm(), $window.load(function () {
			$window.trigger("resize"), $(".show-onload").css("opacity", 1)
		}), $window.on("scroll.first_time", function () {
			$("#message").is(":visible") && $("#message").slideUp("fast"), $window.off("scroll.first_time")
		}), $window.resize(function () {
			$(".mobile-nav-links > ul").width($(".right.side-nav").width()), parseInt($(".mobile-nav-links").css("left")) < 0 && $(".mobile-nav-links").css({
				left: -$(".right.side-nav").width()
			});
			var a = $(".mobile-nav-links").height() + $(".mobile-nav-footer").height();
			if ($(".nav-wrapper").height(a > $window.height() ? a : "100%"), $(".subpage").css("height", ""), $body.height() < $window.height()) {
				var b = $(".subpage").height();
				$(".subpage").height(b + $window.height() - $body.height())
			}
		});
		var currency_click = function () {
			var a = $(this).attr("data-symbol");
			return currency = $(this).attr("data-currency"), refresh_page_currency ? $.get(site_url + "ajax/change_currency/" + currency, function () {
				window.location.reload()
			}) : (updateCurrency(), $(".currency-selector").each(function () {
				var b = $(this).find("span"),
					c = b.attr("data-currency"),
					d = b.attr("data-symbol"),
					e = b.html(),
					f = $(this).find("a.currency[data-currency=" + currency + "]");
				b.attr("data-currency", currency).attr("data-symbol", a).html(f.html()), f.attr("data-currency", c).attr("data-symbol", d).html(e)
			}), $(this).parents(".currency-selector").removeClass("open"), hideMenu(), $.get(site_url + "ajax/change_currency/" + currency)), !1
		};
		$("a.currency").click(currency_click), updateCurrency();
		for (var i in inits) "function" == typeof initFunctions[inits[i]] && initFunctions[inits[i]]();
		$window.trigger("resize"), $window.unload(cancelAjax), $(".modal").on("show.bs.modal", centerModal), $window.resize(function () {
			$(".modal:visible").each(centerModal)
		});
		var backToTop = function () {
			var a = 300,
				b = 1200,
				c = 1e3,
				d = $(".cd-top");
			$window.scroll(function () {
				$(this).scrollTop() > a ? d.addClass("cd-is-visible") : d.removeClass("cd-is-visible cd-fade-out"), $(this).scrollTop() > b && d.addClass("cd-fade-out")
			}), d.on("click", function (a) {
				a.preventDefault(), $("body,html").animate({
					scrollTop: 0
				}, c)
			})
		}();
		$("a.btn-menu, #btn-left-menu, a.manager-menu").click(function () {
			var a = $(this).hasClass("btn-menu") ? "left" : "right",
				b = $("." + a + ".side-nav");
			return b.hasClass("open") ? hideMenu() : ($(".mobile-nav-links").css("left", 0), b.addClass("open"), $("body").addClass("open." + a), $("#menu_overlay").fadeIn(), $(".mobile-nav-links > ul").addClass("open").width(b.width())), !1
		}), $(".side-nav .close").click(hideMenu), $("#menu_overlay").click(function () {
			$("a.btn-menu, a.manager-menu").eq(0).trigger("click")
		}), $(".mobile-nav-links a.subnav").click(function () {
			$(".mobile-nav-links > ul:nth-child(2)").remove();
			var a = $(this).next().clone();
			return $(".mobile-nav-links").append(a), $(".mobile-nav-links a.currency").click(currency_click), $(".mobile-nav-links").animate({
				left: -$(".left.side-nav, .right.side-nav").width()
			}), $(".mobile-nav-links > ul").width($(".left.side-nav, .right.side-nav").width()), a.addClass("open"), $(this).closest(".mobile-nav-links").hasClass("manager_menu") && (a.append('<div class="back_btn"><a href="#"><i class="fa fa-long-arrow-left"></i></a></div>'), a.find(".back_btn").delay(400).fadeIn().find("a").click(function () {
				return $(this).parent().fadeOut("fast"), $(".mobile-nav-links").animate({
					left: 0
				}), !1
			})), !1
		}), String.prototype.capitalize = function () {
			var a = this.toLowerCase();
			return a.replace(/(?:^|\s)\S/g, function (a) {
				return a.toUpperCase()
			})
		}
	}),
	function () {
		for (var a, b = function () {}, c = ["assert", "clear", "count", "debug", "dir", "dirxml", "error", "exception", "group", "groupCollapsed", "groupEnd", "info", "log", "markTimeline", "profile", "profileEnd", "table", "time", "timeEnd", "timeStamp", "trace", "warn"], d = c.length, e = window.console = window.console || {}; d--;) a = c[d], e[a] || (e[a] = b)
	}();