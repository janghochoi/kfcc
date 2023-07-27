(function ($, window, document, undefined) {
	'use strict';
	// Common variable
	var $window = $(window),
		$document = $(document),
		$html = $document.find('html').addClass('OL'),
		$body = $document.find('body').on({
			'keydown': function (e) {
				if (e.keyCode === 9) $html.removeClass('OL');
			},
			'keyup': function (e) {
				if (e.keyCode === 13) $html.removeClass('OL');
			},
			'click': function () {
				$html.addClass('OL');
			}
		}),
		$wrap = $body.find('#wrap'),
		$header = $wrap.find('.header'),
		$footer = $wrap.find('.footer'),
		$container = $body.find('.container'),
		$content = $body.find('#content'),
		winWidth = $window.width(),
		winHeight = $window.height(),
		scrollTopPos = $window.scrollTop(),
		aniSpeed = 200,
		activeClass = 'active',
		lastScroll = 0,
		tabContentPosArray = [];

	function _userAgent() {
		var setUserAgent = navigator.userAgent.toLowerCase(); //userAgent 값 얻기
		if (setUserAgent.indexOf('android') > -1) {
			//안드로이드
			$('html').removeClass('ios');
			$('html').addClass('android');
			return "android";
		} else if (setUserAgent.indexOf("iphone") > -1 || setUserAgent.indexOf("ipad") > -1 || setUserAgent.indexOf("ipod") > -1) {
			//IOS
			$('html').removeClass('android');
			$('html').addClass('ios');
			return "ios";
		} else {
			//아이폰, 안드로이드 외
			return "other";
		};
	};
	_userAgent();

	// accordion
	function _accordion() {
		var $accordion = $('.accordion');

		if (!$accordion.length) return false;

		$accordion.each(function () {
			var $this = $(this),
				$button = $this.find('.accordion-name'),
				$parent = $this.closest('.accordion'),
				$content = $parent.find('.accordion-content'),
				parentType = $parent.data('toggle');

			$button.each(function () {
				var $this = $(this);

				if ($this.hasClass(activeClass)) {
					$this.attr('aria-label', '닫기');
					$this.attr('aria-expanded', 'true');
					$this.next().show();
				} else {
					$this.attr('aria-label', '펼치기');
					$this.attr('aria-expanded', 'false');
				}
			});

			$button.off().on('click', function () {
				var $this = $(this);

				if ($button.next().is(':animated') > 0) return false;

				if (parentType == 'one') {
					$content.not($(this).next()).stop().slideUp(aniSpeed);
					$this.toggleClass(activeClass);
					$button.not($(this)).removeClass(activeClass).attr('aria-label', '펼치기');
					$this.next().stop().slideToggle(aniSpeed);
					aria();
				} else {
					$this.toggleClass(activeClass);
					$this.next().slideToggle(aniSpeed);
					aria();
				}

				function aria() {
					if ($this.attr('aria-label') == '펼치기') {
						$this.attr('aria-label', '닫기');
						$this.attr('aria-expanded', 'true');
					} else {
						$this.attr('aria-label', '펼치기');
						$this.attr('aria-expanded', 'false');
					}
				};
			});
		});
	};
	_accordion();

	// btnTop
	function _btnTop() {
		var $topBtn = $('.button-top');

		if (!$topBtn.length) return false;

		$topBtn.off().on('click', function (e) {
			e.preventDefault();
			$('html, body').animate({
				scrollTop: 0
			}, 500)
		});
	};
	_btnTop();

	// checkbox all
	function _checkbox() {
		var $checkAll = $body.find('.checkbox-all'),
			$checkBox = $body.find('.checkbox').not('.checkbox-all').not(':disabled').find('input');

		function checkAll() {
			$checkAll.on('change', function () {
				var $this = $(this),
					checked = $this.prop('checked'),
					myData = $this.data('group');

				$('input[data-group="' + myData + '"]').not(':disabled').prop('checked', checked);
			});
		}
		checkAll();

		function check() {
			$checkBox.on('change', function () {
				var $this = $(this),
					myData = $this.data('trigger'),
					boxLength = $('input[data-trigger="' + myData + '"]').not(':disabled').length,
					checkedLength = $('input[data-trigger="' + myData + '"]:checked').length,
					selectAll = (boxLength == checkedLength);

				$('input[data-group="' + myData + '"].checkbox-all').prop('checked', selectAll);
			});
		}
		check();
	};
	_checkbox();

	// Disable invalid alert
	function _disableInvalid() {
		var $requiredEl = $content.find('[required]');

		if (!$requiredEl.length) return false;
		$requiredEl.on('invalid', function (e) {
			e.preventDefault();
		});
	};
	_disableInvalid();

	// Document tile
	function _documentTitle() {
		var $headerTitle = $header.find('.title'),
			$conTitle = $container.find('.heading.depth01 .title'),
			headerTitleValue = $headerTitle.text(),
			conTitleValue = $conTitle.text(),
			docTitle = $document.attr('title');

		if (!$headerTitle.length) {
			$document.attr('title', docTitle);
		} else if ($conTitle.length) {
			$document.attr('title', conTitleValue + ' | ' + docTitle);
		} else {
			$document.attr('title', headerTitleValue + ' | ' + docTitle);
		}
	};
	_documentTitle();

	// input [X] 설정
	function _input() {
		var $input = $('.input');

		if (!$input.length) return false;

		$input.each(function () {
			var $this = $(this);

			if (!$this.hasClass('button-clean') && !$this.find('input').attr('readonly') && !$this.find('input').attr('disabled')) {
				$this.append('<button type="button" class="button-clean" aria-label="내용 삭제"><i class="icon-input-clear"></i></button>');
			}
			if ($this.find('input').val() == undefined || $this.find('input').val() == '') {
				$this.removeClass(activeClass);
			} else {
				$this.addClass(activeClass);
			}
		});

		$document
			.on('input', '.input input', function (e) {
				var $this = $(this),
					$parent = $this.closest('.input');

				if ($this.val() == undefined || $this.val() == '') {
					$parent.removeClass(activeClass);
				} else {
					$parent.addClass(activeClass);
				}
			})
			.on('click', '.button-clean', function (e) {
				var $this = $(this),
					$parent = $this.closest('.input');

				$parent.find('input').val('');
				$parent.removeClass(activeClass);
			});
	};
	_input();

	function _inputFocus() {
		var $input = $('.inner-button input');
		$input.on('focus', function () {
			$(this).closest('.inner-button').addClass(activeClass);
		});
		$input.on('focusout', function () {
			$(this).closest('.inner-button').removeClass(activeClass);
		});
	};
	//_inputFocus();

	// 인풋 3자리 마다 , 추가
	function _inputComma() {
		var $comma = $('.input .comma');

		if (!$comma.length) return false;

		$comma.off().on('input', function () {
			var $this = $(this),
				myValue;

			myValue = $this.val();
			myValue = myValue.replace(/[^0-9]/g, "");					// 입력값이 숫자가 아니면 공백
			myValue = myValue.replace(/,/g, "");						// ,값 공백처리
			$this.val(myValue.replace(/\B(?=(\d{3})+(?!\d))/g, ","));	// 정규식을 이용해서 3자리 마다 , 추가
		});
	};
	_inputComma();

	// 인풋 숫자만 입력
	function _inputNumber() {
		var $inputNum = $('.input .number');

		if (!$inputNum.length) return false;

		$inputNum.on('input', function () {
			var $this = $(this),
				myValue = $this.val();

			myValue = myValue.replace(/[^0-9]/g, "");	// 입력값이 숫자가 아니면 공백
			$this.val(myValue);
		});
	};
	_inputNumber();

	// Skip To Content
	function _skipToContent() {
		var $skipNaviBtn = $body.find('a.skip-content');

		if (!$skipNaviBtn.length) return false;
		if (!$content.length) $skipNaviBtn.hide();

		$skipNaviBtn.off().on('click', function (e) {
			var $this = $(this),
				myId = $this.attr('href');

			e.preventDefault();

			$(myId).attr('tabindex', 0).focus().on('keydown', function (e) {
				if (e.keyCode === 9) $(this).removeAttr('tabindex');
			});
		});
	};
	_skipToContent();

	// scrollLast
	function _scrollLast() {
		if ((window.innerHeight + window.scrollY + 1) >= document.body.offsetHeight) {
			$html.addClass('scroll-last');
		} else {
			$html.removeClass('scroll-last');
		}
	};

	// tab
	function _tabs() {
		var $tabWrap = $body.find('.tab-wrap'),
			$tabList = $tabWrap.find('.tab-list:not(.type-link) > ul'),
			$tabItem = $tabList.find('li a'),
			$tabContainer = $tabWrap.find('.tab-container'),
			$tabContent = $tabContainer.find('.tab-content');

		if (!$tabWrap.length) return false;

		$tabList.attr({
			'role': 'tablist',
		});
		$tabItem.attr({
			'role': 'tab',
			'aria-selected': false
		});
		$tabItem.closest('li').attr({
			'role': 'none presentation'
		})
		$tabWrap.find('.tab-list li:first-child a').attr({
			'aria-selected': true
		});
		$tabContent.attr({
			'role': 'tabpanel'
		});

		$tabItem.off().on('click', function (e) {
			var $this = $(this),
				$myWrap = $this.closest('.tab-wrap'),
				$myList = $myWrap.find('> .tab-list li'),
				$myContent = $myWrap.find('> .tab-container > .tab-content'),
				myIndex = $this.parent().index();

			e.preventDefault();

			$myList.removeClass(activeClass).find('a').attr('aria-selected', 'false');
			$this.parent().addClass(activeClass).find('a').attr('aria-selected', 'true');
			$myContent.hide().removeAttr('tabindex');
			$myContent.eq(myIndex).show().attr('tabindex', 0);

		});
	};
	_tabs();

	// toggleButton 단독 연결
	function _toggleButton() {
		var $toggleButton = $('.button-toggle');

		if (!$toggleButton.length) return false;

		$toggleButton.each(function () {
			var $this = $(this),
				myOpen = $this.data('open'),
				myPressed = $this.attr('aria-pressed'),
				myTarget = $this.data('toggle');

			if (myOpen) {
				$this.addClass(activeClass);
				$('[data-target="' + myTarget + '"]').show();
				if ($this.hasClass('accordion-name')) {
					$this.attr('aria-expanded', 'true');
				}
			} else if (!myOpen) {
				$this.removeClass(activeClass);
				$('[data-target="' + myTarget + '"]').hide();
				if ($this.hasClass('accordion-name')) {
					$this.attr('aria-expanded', 'false');
				}
			}
			if (myPressed == 'true') {
				$this.addClass(activeClass);
			}

			$this.off().on('click', function () {
				var myToggle = $this.data('toggle');

				if ($this.hasClass(activeClass) && $this.attr('aria-pressed')) {
					$this.attr('aria-pressed', 'false');
				} else if (!$this.hasClass(activeClass) && $this.attr('aria-pressed')) {
					$this.attr('aria-pressed', 'true');
				}

				if ($this.attr('aria-label') == '펼치기') {
					$this.attr('aria-label', '닫기');
					$this.attr('aria-expanded', 'true');
				} else if ($this.attr('aria-label') == '닫기') {
					$this.attr('aria-label', '펼치기');
					$this.attr('aria-expanded', 'false');
				}

				$this.toggleClass(activeClass);
				$('[data-target="' + myToggle + '"]').slideToggle(aniSpeed);

			});
		});
	};
	_toggleButton();

	//footer link
	function _footerLink() {
		var $button = $footer.find('.button-link'),
			$tgLink = $footer.find('.footer-link ul');
		$button.off().on('click', function () {
			$tgLink.slideToggle(aniSpeed);
		});
	};
	_footerLink();

	function count() {
		var $formCount = $('.form-count');

		if (!$formCount.length) return false;

		$document.off().on('click', '.form-count [class*=button-]', function () {
			var $this = $(this),
				$parent = $this.closest('.form-count'),
				$val = $parent.find('.val'),
				count = Number($val.text()),
				total = Number($parent.data('total'));

			if ($this.hasClass('button-plus')) {
				count = Number(count + 1);

				if (total == count) {
					$this.attr("disabled", true);
				};

				$val.text(count);
			} else {
				count = Number(count - 1);
				$parent.find('.button-plus').attr("disabled", false);
				if (count == 0) return false;
				$val.text(count);
			}
			if (count > 1) {
				$parent.find('.button-minus').attr("disabled", false);
			} else {
				$parent.find('.button-minus').attr("disabled", true);
			}
		});
	}
	//count();

	// scrollUpDown
	function scrollUpDown() {
		if (scrollTopPos > lastScroll && scrollTopPos > 80) {
			$html.removeClass('scroll-up').addClass('scroll-down');
		} else {
			$html.removeClass('scroll-down').addClass('scroll-up');
		}
		lastScroll = scrollTopPos;
	};

	window.ui = {
		accordion: _accordion, 						// accordion
		btnTop: _btnTop,									// btnTop
		checkbox: _checkbox,							// checkbox all
		disableInvalid: _disableInvalid,	// Disable invalid alert
		documentTitle: _documentTitle,		// Document tile
		input: _input,										// input [X] 설정
		inputFocus: _inputFocus,					// inner-button input focus
		inputComma: _inputComma,					// 인풋 3자리 마다 , 추가
		inputNumber: _inputNumber,				// 인풋 숫자만 입력
		skipToContent: _skipToContent,		// Skip To Content
		scrollLast: _scrollLast,					// 스크롤 마지막
		tabs: _tabs,											// tab
		toggleButton: _toggleButton,			// toggleButton 단독 연결
		userAgent: _userAgent,						// userAgent 단말기 체크 [android, iphone]
	}

	// Window Event
	$window.on({
		'resize': function () {
			if (winWidth !== $window.width()) {
				winWidth = $window.width();
			}
			if (winHeight !== $window.height()) {
				winHeight = $window.height();
			}
			_userAgent();
		},
		'scroll': function () {
			scrollTopPos = $window.scrollTop();

			scrollUpDown();
		},
		'load': function () {
		}
	});
})(jQuery, window, document);