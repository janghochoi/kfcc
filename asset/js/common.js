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
		const $accordions = $('.accordion');

		if (!$accordions.length) return;

		$accordions.each(function () {
			const $this = $(this);
			const $buttons = $this.find('.accordion-name');
			const $contents = $this.find('.accordion-content');
			const parentType = $this.hasClass('is-type-one');

			$buttons.each(function () {
				const $this = $(this);

				if ($this.hasClass(activeClass)) {
					$this.next().show();
				}

				$this.off().on('click', function () {
					if ($buttons.next().is(':animated') > 0) return false;

					if (parentType) {
						$contents.not($this.next()).stop().slideUp(aniSpeed);
						$buttons.not($this).removeClass(activeClass);
					}

					$this.toggleClass(activeClass);
					$this.next().stop().slideToggle(aniSpeed);
				});
			});
		});
	};
	_accordion();

	// btnTop
	function _btnTop() {
		const $topBtn = $('.button-top');

		if (!$topBtn.length) return;

		function scrollToTopSmoothly() {
			const animationDuration = 500;
			$('html, body').animate({ scrollTop: 0 }, animationDuration);
		}

		$topBtn.off().on('click', function (e) {
			e.preventDefault();
			scrollToTopSmoothly();
		});
	}
	_btnTop();


	// Disable invalid alert
	function _disableInvalid() {
		const $requiredElements = $content.find('[required]');

		if (!$requiredElements.length) return;

		$requiredElements.on('invalid', function (e) {
			e.preventDefault();
		});
	};
	_disableInvalid();

	// Document tile
	function _documentTitle() {
		const $headerTitle = $header.find('.title');
		const $conTitle = $container.find('.heading.depth01 .title');
		const headerTitleValue = $headerTitle.text();
		const conTitleValue = $conTitle.text();
		const docTitle = $document.attr('title');

		let newTitle = docTitle;

		if ($headerTitle.length) {
			newTitle = headerTitleValue + ' | ' + newTitle;
		} else if ($conTitle.length) {
			newTitle = conTitleValue + ' | ' + newTitle;
		}

		$document.attr('title', newTitle);
	};
	_documentTitle();

	// input [X] 설정
	function _input() {
		const $inputs = $('.input');

		if (!$inputs.length) return;

		function updateInputState($input) {
			const $inputElement = $input.find('input');
			const hasValue = $inputElement.val() !== '';

			if (!hasValue) {
				$input.removeClass(activeClass);
			} else {
				$input.addClass(activeClass);
			}
		}

		function onInput(e) {
			const $this = $(this);
			const $parent = $this.closest('.input');
			updateInputState($parent);
		}

		function onCleanButtonClick(e) {
			const $this = $(this);
			const $parent = $this.closest('.input');
			const $inputElement = $parent.find('input');

			$inputElement.val('');
			$parent.removeClass(activeClass);
		}

		$inputs.each(function () {
			const $this = $(this);

			if (!$this.hasClass('button-clean')) {
				const $inputElement = $this.find('input');
				const isReadOnly = $inputElement.prop('readonly');
				const isDisabled = $inputElement.prop('disabled');

				if (!isReadOnly && !isDisabled) {
					$this.append('<button type="button" class="button-clean"><i class="icon-input-clear"></i></button>');
				}
			}

			updateInputState($this);
		});

		$(document)
			.on('input', '.input input', onInput)
			.on('click', '.button-clean', onCleanButtonClick);
	};
	_input();

	function _inputFocus() {
		const $input = $('.inner-button input');
		$input.on({
			focus: function () {
				$(this).closest('.inner-button').addClass(activeClass);
			},
			focusout: function () {
				$(this).closest('.inner-button').removeClass(activeClass);
			}
		});
	};
	//_inputFocus();

	// 인풋 3자리 마다 , 추가
	function _inputComma() {
		const $comma = $('.input .comma');

		$comma.on('input', function () {
			this.value = this.value.replace(/[^\d]/g, ''); // 입력값이 숫자가 아닌 문자를 제거
			this.value = this.value.replace(/,/g, ''); // 기존 쉼표 제거
			this.value = this.value.replace(/\B(?=(\d{3})+(?!\d))/g, ','); // 3자리 마다 쉼표 추가
		});
	};
	_inputComma();

	// 인풋 숫자만 입력
	function _inputNumber() {
		const $inputNum = $('.input .number');

		$inputNum.on('input', function () {
			this.value = this.value.replace(/\D/g, ''); // 숫자가 아닌 문자를 제거
		});
	};
	_inputNumber();

	// Skip To Content
	function _skipToContent() {
		const $skipNaviBtn = $body.find('a.skip-content');

		if (!$skipNaviBtn.length) return;
		if (!$content.length) $skipNaviBtn.hide();

		$skipNaviBtn.off().on('click', function (e) {
			const $this = $(this),
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
		const isAtBottom = (window.innerHeight + window.scrollY + 1) >= document.body.offsetHeight;
		$html.toggleClass('scroll-last', isAtBottom);
	};

	// tab
	function _tabs() {
		const $tabWrap = $('.tab-wrap');
		if (!$tabWrap.length) return;

		const $tabList = $tabWrap.find('.tab-list > ul');
		const $tabItem = $tabList.find('li a');
		const $tabContainer = $tabWrap.find('.tab-container');
		const $tabContent = $tabContainer.find('.tab-content');

		$tabItem.off().on('click', function (e) {
			e.preventDefault();

			const $this = $(this);
			const $myWrap = $this.closest('.tab-wrap');
			const $myList = $myWrap.find('> .tab-list li');
			const $myContent = $myWrap.find('> .tab-container > .tab-content');
			const myIndex = $this.parent().index();

			$myList.removeClass(activeClass);
			$this.parent().addClass(activeClass);
			$myContent.hide().removeAttr('tabindex');
			$myContent.eq(myIndex).show().attr('tabindex', 0);
		});
	};
	_tabs();

	// toggleButton 단독 연결
	function _toggleButton() {
		const $toggleButtons = $('.button-toggle');

		if (!$toggleButtons.length) return false;

		$toggleButtons.each(function () {
			const $this = $(this);
			const myOpen = $this.data('open');
			const myTarget = $this.data('toggle');

			function toggleButton() {
				const isOpen = $this.hasClass(activeClass);

				$this.toggleClass(activeClass, !isOpen);
				$('[data-target="' + myTarget + '"]').slideToggle(aniSpeed);

			}

			if (myOpen) {
				$this.addClass(activeClass);
				$('[data-target="' + myTarget + '"]').show();
				if ($this.hasClass('accordion-name')) {
					$this.attr('aria-expanded', 'true');
				}
			} else {
				$this.removeClass(activeClass);
				$('[data-target="' + myTarget + '"]').hide();
				if ($this.hasClass('accordion-name')) {
					$this.attr('aria-expanded', 'false');
				}
			}

			$this.off().on('click', toggleButton);
		});
	}
	_toggleButton();

	//footer link
	function _footerLink() {
		const $footerLink = $('.footer-link');
		const $button = $footerLink.find('.button-link');
		const $tgLink = $footerLink.find('ul');

		$button.off().on('click', function () {
			$tgLink.stop().slideToggle(aniSpeed);
			$footerLink.toggleClass(activeClass);
		});
	};
	_footerLink();

	function _setupFormCount() {
		const $formCounts = $('.form-count');

		if (!$formCounts.length) return;

		$formCounts.on('click', '[class*=button-]', function () {
			const $this = $(this);
			const $parent = $this.closest('.form-count');
			const $val = $parent.find('.val');
			const count = Number($val.text());
			const total = Number($parent.data('total'));
			let newCount;

			if ($this.hasClass('button-plus')) {
				newCount = count + 1;

				if (newCount === total) {
					$this.attr('disabled', true);
				}

				$val.text(newCount);
			} else {
				newCount = count - 1;
				$parent.find('.button-plus').attr('disabled', false);

				if (newCount === 0) return;

				$val.text(newCount);
			}

			const $buttonMinus = $parent.find('.button-minus');
			$buttonMinus.attr('disabled', newCount <= 1);
		});
	}
	//_setupFormCount();

	// scrollUpDown
	function scrollUpDown() {
		const SCROLL_THRESHOLD = 80;
		const scrollDownClass = 'scroll-down';
		const scrollUpClass = 'scroll-up';

		const currentScrollPos = window.pageYOffset || document.documentElement.scrollTop;

		if (currentScrollPos > lastScroll && currentScrollPos > SCROLL_THRESHOLD) {
			$html.removeClass(scrollUpClass).addClass(scrollDownClass);
		} else {
			$html.removeClass(scrollDownClass).addClass(scrollUpClass);
		}

		lastScroll = currentScrollPos;
	};

	window.ui = {
		accordion: _accordion, 					// accordion
		btnTop: _btnTop,						// btnTop
		disableInvalid: _disableInvalid,		// Disable invalid alert
		documentTitle: _documentTitle,			// Document tile
		input: _input,							// input [X] 설정
		inputFocus: _inputFocus,				// inner-button input focus
		inputComma: _inputComma,				// 인풋 3자리 마다 , 추가
		inputNumber: _inputNumber,				// 인풋 숫자만 입력
		skipToContent: _skipToContent,			// Skip To Content
		scrollLast: _scrollLast,				// 스크롤 마지막
		tabs: _tabs,							// tab
		toggleButton: _toggleButton,			// toggleButton 단독 연결
		userAgent: _userAgent,					// userAgent 단말기 체크 [android, iphone]
		footerLink: _footerLink,				// footer link
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


	$(document).ready(function () {

	})
		.on('click', '.heading-payment .btn-payment-status', function () {
			const controls = $(this).closest('.controls');
			if ($(this).hasClass('active')) {
				$(this).removeClass('active');
				controls.find('.table').hide();
				$(this).find('.text').text('열기');
			} else {
				$(this).addClass('active');
				controls.find('.table').show();
				$(this).find('.text').text('접기');
			}
		})
})(jQuery, window, document);