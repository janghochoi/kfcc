var dialogUI = window.dialogUI = dialogUI || {};
(function (dialogUI, $, window, document, undefined) {
	'use strict';

	var $window = $(window),
		$document = $(document),
		$html = $document.find('html'),
		$body = $document.find('body'),
		aniSpeed = 200,
		posY;

	// Focus rotation(jQuery UI :focusable required)
	dialogUI.focusRotation = function (evtTg, tgWrap, closeBtn) {
		var $tgWrap = tgWrap,
			$firstFocusTg = $tgWrap.find(':focusable:first'),
			$lastFocusTg = $tgWrap.find(':focusable:last');
		$tgWrap.attr('tabindex', 0).focus().on('keydown', function (e) {
			var $this = $(this);
			if (!$(e.target).is(tgWrap)) return;
			if (e.keyCode === 9 && e.shiftKey) {
				e.preventDefault();
				$this.removeAttr('tabindex');
				(closeBtn) ? closeBtn.focus() : $lastFocusTg.focus();
			} else if (e.keyCode === 9 && !e.shiftKey) {
				e.preventDefault();
				$this.removeAttr('tabindex');
				$firstFocusTg.focus();
			}
		});
		$firstFocusTg.on('keydown', function (e) {
			if (e.keyCode === 9 && e.shiftKey) {
				e.preventDefault();
				(closeBtn) ? closeBtn.focus() : $lastFocusTg.focus();
			}
			if ((e.keyCode === 9 && !e.shiftKey)
				&& ($firstFocusTg.is($lastFocusTg))) {
				e.preventDefault();
			}
		});
		$lastFocusTg.on('keydown', function (e) {
			if (e.keyCode === 9 && !e.shiftKey) {
				e.preventDefault();
				(closeBtn) ? closeBtn.focus() : $firstFocusTg.focus();
			}
			if ((e.keyCode === 9 && e.shiftKey)
				&& ($firstFocusTg.is($lastFocusTg))) {
				e.preventDefault();
			}
		});
	};

	// dialog
	dialogUI.dialog = {
		tgEl: {
			lockScroll: 'LS',
		},
		__init: function (el, openBtn, animate, noDimmed) {
			var tgEl = dialogUI.dialog.tgEl;
			tgEl.$dialogWrap = $("." + el);
			tgEl.$dialog = tgEl.$dialogWrap.find('.dialog');
			tgEl.$dialogBody = tgEl.$dialog.find('.dialog-body');
			tgEl.$close = tgEl.$dialog.find('.close').add(tgEl.$dialog.find('.cancle'));
			tgEl.$openBtnFocus = openBtn;

			//posY = $(window).scrollTop();

			// 딤드 클릭시 닫힘.
			if (!noDimmed) {
				dialogUI.dialog.__dimmed();
			};

			if (tgEl.$dialogWrap.data('lock') !== 'none') {
				$html.addClass(tgEl.lockScroll);
			};

			if (animate == 'animate') {
				tgEl.$dialogWrap.fadeIn(aniSpeed, 'swing', function () {
					$(this).find('.dialog').addClass('animate');
				});
			} else {
				tgEl.$dialogWrap.fadeIn('aniSpeed', 'linear', function () {
					$(this).css('display', 'flex');
				});
			};

			if (tgEl.$dialogBody.find('iframe').length > 0) {
				var $iframe = tgEl.$dialogBody.find('iframe'),
					bodyHeight = tgEl.$dialogBody.outerHeight();

				$iframe.outerHeight(bodyHeight);
			};

			setTimeout(function () {
				if (tgEl.$dialogBody.find('.float-bottom').length > 0) {
					tgEl.$dialogBody.find('.float-bottom').css('padding-top', ui.floatHeight());
				};
			}, 1000);

			tgEl.$close.off().on('click', function () {
				var $this = $(this);
				tgEl.$dialog.removeClass('animate');
				dialogUI.dialog.__close(tgEl.$openBtnFocus, $this);
			});

			dialogUI.focusRotation(openBtn, tgEl.$dialog);
		},
		__keyEvent: function () {
			var tgEl = dialogUI.dialog.tgEl;
			$document.on('keydown', function (e) {
				if (e.keyCode == 27) {
					if ($('.dialogWrap').is(':visible')) {
						dialogUI.dialog.__close(tgEl.$openBtnFocus, tgEl.$close);
					}
				}
			});
		},
		__close: function (firstFocus, $closeEl) {
			var tgEl = dialogUI.dialog.tgEl;
			if (firstFocus == undefined) {
				$('.dialog-wrap').hide();
				return false;
			}
			firstFocus.focus();
			$closeEl.closest('.dialog-wrap').off().fadeOut(aniSpeed);
			$html.removeClass(tgEl.lockScroll);
			//posY = $(window).scrollTop(posY);
		},
		__dimmed: function () {
			var tgEl = dialogUI.dialog.tgEl;

			var $dialogWrap = $body.find('.dialog-wrap');

			$dialogWrap.off().on('click', function (e) {
				if (e.target.classList[0] === 'dialog-wrap') {
					dialogUI.dialog.__close(tgEl.$openBtnFocus, tgEl.$close);
				}
			});
		}
	}
})(dialogUI, jQuery, window, document);