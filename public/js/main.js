$(function(){
	var Module = (function () {
		var html = $('html'),
			isMobile;

		// On load/resize, toggle a class between mobile/desktop mode
		var deviceClass = function () { //-------Public Method
			if ($(window).width() < 976 && !(new RegExp('MSIE [78]')).exec(navigator.userAgent)) {
				if (!html.hasClass('isMobile')) {
					html.addClass('isMobile').removeClass('isDesktop');
					isMobile = true;
				}
			} else {
				if (!html.hasClass('isDesktop')) {
					html.addClass('isDesktop').removeClass('isMobile');
					isMobile = false;
				}
			}
		};

		var general = function () { //-------Public Method

			// Quiz answer selection
			$('.question-answers').on('click', '.question-answers__item__answers ul li', function(){
				var $el = $(this);
				var selectionParent = $el.parents('.question-answers__item');

				$('.question-answers__item__answers ul li', selectionParent).removeClass('selected highlight');
				$el.addClass('selected');

				setTimeout(function(){
					$el.addClass('highlight');
				}, 1000);
				
				//Scroll to next question and position it to the middle of the screen when click on an answer
				function goToNextEl(elHeight){
					$('html,body').animate({
						scrollTop: elHeight},
						'slow');
				}
				var viewportHeight = $(window).height(),
					selectionNextSibling = selectionParent.next('.question-answers__item');
					
				
				if (selectionNextSibling.length !== 0) {
					var nextSiblingHeight = selectionNextSibling.height(),
						nextSiblingPos = selectionNextSibling.offset().top,
						middlePosition = (viewportHeight - nextSiblingHeight)/2,
						offset;
				
					if (nextSiblingHeight < viewportHeight) {
						offset = nextSiblingPos - ((viewportHeight / 2) - (nextSiblingHeight / 2));
					} else {
						offset = nextSiblingPos + 105;
					}
					setTimeout(function(){
						goToNextEl(offset);
					}, 1500);
				}
			});
            
            // Quiz title area effects
            $(window).bind('load', function() {
                
                var titleArea = $('.row.title-area');
                var quizArea = $('.row.quiz-area');

                var titleAreaHeight = titleArea.height(),
                    viewportHeight = $(window).height(),
                    middlePosition = (viewportHeight -titleAreaHeight)/2;
                
                titleArea.css('top', middlePosition);
                quizArea.css('margin-top', viewportHeight);
                
                $('button', titleArea).on('click', function(e){
                    e.preventDefault();
                    $.when(titleArea.fadeOut(500), quizArea.show()).done(function() {
                        quizArea.css('margin-top', middlePosition);
                    });
                    $('.question-answers__item').each(function(){
                        var questionHeight = $(this).height();

                        $(this).css('height', questionHeight);
                    });
                });
            });

			// Article share
			$('.share a').not('.share .email a, .share .print a').click(function(){
				window.open(this.href, 'Share', "width=600, height=600");
				return false;
			});

			// Share links popup
			$('.share-icons a.icon').not('.share-icons .jiathis_button_weixin.icon-wechat, .email a.icon').click(function(){
				window.open(this.href, 'Share', "width=600, height=600");
				return false;
			});
			$('.share a').each(function() {
				var _href = $(this).attr('href'),
				currentLoc = window.location.href,
				title = encodeURIComponent($('h1').text());

				if ($(this).parent().hasClass('twitter')) {
					$(this).attr('href', _href + currentLoc + '&text=' + title + ':' + '&url=' + currentLoc +  '&via=Mourant');
				} else if ($(this).parent().hasClass('linkedin')) {
					$(this).attr('href', _href  + currentLoc +'&title='+ title);
				} else {
					$(this).attr("href", _href + currentLoc);
				}
			});
			
			//Pre-select based on query string value
			function getParameterByName(name, url) {
				if (!url) {
				  url = window.location.href;
				}
				name = name.replace(/[\[\]]/g, "\\$&");
				var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
					results = regex.exec(url);
				if (!results) return null;
				if (!results[2]) return '';
				return decodeURIComponent(results[2].replace(/\+/g, " "));
			}

			var locationId = getParameterByName('VxForm_Office');

			$('#contact-form-location').val(locationId);

			// Google reCaptcha
			$('form').submit(function() {
				if (grecaptcha.getResponse().length === 0) {
					alert('The reCaptcha form was not completed.  Please try again.');
					return false;
				} else {
					return true;
				}
			});
		};

		return {
			deviceClass: deviceClass,
			general: general
		};

	})();

	//------- Calling Public Methods
	Module.deviceClass();
	Module.general();

	$(window).resize(function () {
		var html = $('html');

		Module.deviceClass();
	});

});
