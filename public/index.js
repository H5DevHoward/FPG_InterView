(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

window.startAd = function () {
    function preloadImgs(obj) {
        var def = {
            selector: '.preload',
            done: function done() {}
        };
        var opts = $.extend({}, def, obj);
        var images = [];
        var imgLen = void 0,
            currentIndex = 0;
        var $preloadItem = $(opts.selector);

        imgLen = $preloadItem.length;
        $preloadItem.each(function (index, item) {
            var $item = $(item);

            images[index] = new Image();
            images[index].addEventListener('load', function () {
                if (typeof $item.data('bg') != 'undefined') {
                    $item.css('background-image', 'url(' + images[index].src + ')');
                } else {
                    $item.append(images[index]);
                }
                if (++currentIndex == imgLen) {
                    opts.done();
                }
            });
            images[index].src = $item.data('source');
        });
    }
    preloadImgs();

    var ROUT_HREF = ['/q1', '/q2', '/q3', '/result', '/save'];
    var AUDIO_NAMES = ['countDownAudio', 'rightAudio', 'wrongAudio', 'victoryAudio'];

    var $window = $(window);
    var $cta = $('.cta');
    var $contactMe = $('.face2');
    var routIndex = 0;
    var audios = [];
    var countDown20 = void 0,
        countDownEnd = void 0;
    var flag_q2_end = false;
    var $welcome = $('.welcome').textillate({
        loop: false,
        initialDelay: 100,
        in: {
            effect: 'fadeInLeft',
            sync: false,
            reverse: false
        },
        type: 'char'
    });

    $welcome.css('display', 'block').textillate('in');

    function swapPageAnimation() {
        var $navItem = $('.nav-wrapper div');
        var flag_isPage1 = routIndex == 1;
        var flag_isPage4 = routIndex == 4;


        if (flag_isPage4) {
            var $resultOverlay = $('.resultOverlay');
            var btnX = $resultOverlay.width();
            var btnY = $resultOverlay.height();
            var multipleX = $window.width() / btnX;
            var multipleY = $window.height() / btnY;

            TweenMax.to('.submit', 0.1, {
                autoAlpha: 0
            });

            TweenMax.to($resultOverlay, 0.5, {
                autoAlpha: 1,
                scaleX: multipleX * 10,
                scaleY: multipleY * 10,
                delay: 0.1
            });

            $('.prev .poster').css('background-color', 'rgba(255, 255, 255, 0.5)');
            $('.temp .container').addClass('blur');

            TweenMax.fromTo('.prev', 0.7, {
                x: '0%',
                zIndex: 2,
                autoAlpha: 0
            }, {
                autoAlpha: 1,
                ease: Cubic.easeInOut,
                delay: 0.1,
                onComplete: function onComplete() {
                    $navItem.removeClass('active');
                    $navItem.eq(routIndex).addClass('active');
                }
            });
        } else {
            TweenMax.fromTo('.wrapper.inactive', 0.7, {
                x: '0%',
                y: '0%',
                zIndex: 2,
                autoAlpha: flag_isPage4 ? 0 : 1
            }, {
                x: flag_isPage1 ? '0%' : '-100%',
                y: flag_isPage1 ? '-100%' : '0%',
                autoAlpha: 1,
                ease: Cubic.easeInOut,
                delay: 0.1
            });
            TweenMax.fromTo('.wrapper.active', 0.7, {
                x: flag_isPage1 ? '0%' : '100%',
                y: flag_isPage1 ? '100%' : '0%'
            }, {
                x: '0%',
                y: '0%',
                ease: Cubic.easeInOut,
                delay: 0.1,
                onComplete: function onComplete() {
                    $('.wrapper.active').css('z-index', '1');
                    $navItem.removeClass('active');
                    $navItem.eq(routIndex).addClass('active');
                }
            });
        }
    }

    function question1(timeout) {
        var TIMEOUT_CARD = timeout.map(function (x) {
            return x.timeout * 1000;
        });
        var flag_card_animationEnd = false;

        $('.card-wrapper').on('animationend', '.card:last', function () {
            flag_card_animationEnd = true;
        }).on('mouseenter', '.card', function () {
            var $item = $(this);
            var CARD_INDEX = $item.index();

            if (!flag_card_animationEnd) return;
            if ($item.attr('data-flag') == 'true') return;
            $item.addClass('hover');
            setTimeout(function () {
                $item.attr('data-flag', 'true');
                $item.removeClass('hover');
            }, TIMEOUT_CARD[CARD_INDEX]);
        });

        $('textarea.yourAnswer').on('keydown', function (e) {
            if (e.keyCode == '13') {
                $('.wrapper.active .submit').trigger('click');
            }
        });
    }

    function question2() {
        var TOTLE_TIME = 30000;
        var COUNT_DOWN_DIFF = TOTLE_TIME - 20000;

        // init audio
        initAudio();

        function initAudio() {
            AUDIO_NAMES.forEach(function (item, i) {
                var audio = new Audio();

                audio.src = '../media/' + item + '.mp3';
                audios.push(audio);
            });
        }

        var lampIndex = 0;
        var lampArray = $.makeArray($('.lamp'));
        var TWEEN_ITEM_LENGTH = lampArray.length;

        function findEndAnimation(copy) {
            $('.defeat-wrapper').css('display', 'block');
            TweenMax.staggerFromTo('.lamp-wrapper .lamp', 0.5, {
                x: '0%'
            }, {
                x: '-230%',
                ease: Quad.easeOut,
                delay: 0.3,
                onComplete: function onComplete(tween) {
                    var $tweenTarget = $(tween.target);
                    var tweenItemIndex = $tweenTarget.index();
                    var tweenItemColor = $tweenTarget.css('background-color');
                    var tweenItemZIndex = TWEEN_ITEM_LENGTH - tweenItemIndex;

                    if (tweenItemIndex) {
                        TweenMax.fromTo('.defeatCircle:nth-child(' + (tweenItemIndex + 1) + ')', 0.2, {
                            zIndex: tweenItemZIndex
                        }, {
                            autoAlpha: 1,
                            scale: 3 * tweenItemIndex,
                            backgroundColor: tweenItemColor,
                            ease: Bounce.easeInOut
                        });
                    } else {
                        TweenMax.to('.defeatCircle:nth-child(1)', 0.2, {
                            autoAlpha: 1,
                            backgroundColor: tweenItemColor,
                            zIndex: tweenItemZIndex
                        });
                    }
                },
                onCompleteParams: ['{self}']
            }, 0.05, function () {
                TweenMax.fromTo(copy, 0.2, {
                    zIndex: 6
                }, {
                    autoAlpha: 1,
                    scale: 12,
                    ease: Bounce.easeInOut
                });
            });
        }
        //register events
        $('.different-wrapper .overlay').on('click', function () {
            var $this = $(this);

            TweenMax.staggerFromTo('.lamp-wrapper .lamp', 0.5, {
                x: '-230%'
            }, {
                x: '0%',
                ease: Quad.easeOut,
                delay: 0.3
            }, 0.05);

            countDown20 = setTimeout(function () {
                audios[0].play();
            }, COUNT_DOWN_DIFF);

            countDownEnd = setTimeout(function () {
                findEndAnimation('.defeatCopy');
                flag_q2_end = true;
            }, TOTLE_TIME);

            TweenMax.to($this, 0.5, {
                autoAlpha: 0,
                onComplete: function onComplete() {
                    $this.css('display', 'none');
                }
            });
            TweenMax.to('.lamp-wrapper', 0.5, {
                autoAlpha: 1
            });
        });

        $('.target.product').on('click', '.targetItem', function () {
            if (flag_q2_end) return;

            resetTargetAudio(audios[2]);
            audios[2].play();
        }).on('click', '.hotspot', function () {
            var $this = $(this);
            if (flag_q2_end || $this.hasClass('active')) return;

            $this.addClass('active');
            $('.lamp').eq(lampIndex).addClass('active');

            resetTargetAudio(audios[1]);
            audios[1].play();

            if (lampIndex == TWEEN_ITEM_LENGTH - 1) {
                flag_q2_end = true;
                findEndAnimation('.victoryCopy');

                audios[3].play();

                clearTimeout(countDown20);
                clearTimeout(countDownEnd);

                resetTargetAudio(audios[0]);
            }
            ++lampIndex;
        });
    }

    function question3() {
        $('.circle-wrapper input').on('keydown', function (e) {
            if (e.keyCode == '13') {
                $('.wrapper.active .submit').trigger('click');
            }
        });
    }

    // reset target audio
    function resetTargetAudio(audioObj) {
        audioObj.pause();
        audioObj.currentTime = 0;
    }

    // reset audios before swap page
    function resetAudio() {
        flag_q2_end = true;
        clearTimeout(countDown20);
        clearTimeout(countDownEnd);

        audios.forEach(function (item, i) {
            resetTargetAudio(item);
        });
    }

    function submitEvent() {
        var $submit = $('.active.wrapper .submit');
        var answers = [];

        $submit.on('mouseenter mouseleave', function () {
            $submit.toggleClass('hover');
        }).on('click', function () {
            switch (routIndex) {
                case 1:
                    var q1Answer = $('textarea').val().replace(/ /g, '');

                    answers.push(q1Answer);
                    break;
                case 2:
                    resetAudio();

                    var q2Answer = $.makeArray($('.lamp.active')).length;

                    answers.push(q2Answer);
                    break;
                case 3:
                    var q3Answer = $('input').val().replace(/ /g, '');

                    answers.push(q3Answer);
                    break;
                default:
                    console.log('default');
            }

            // send answers
            $.post(ROUT_HREF[4], {
                answer: answers,
                qIndex: routIndex
            }).done(function (data) {
                console.log('successed');
                loadNextPage();
            }).fail(function () {
                console.log('failed');
            });
        });
    }

    function resultAnimation() {
        var $resultTitle = $('.result .title').textillate({
            loop: false,
            initialDelay: 0,
            in: {
                effect: 'fadeInLeft',
                shuffle: true
            },
            type: 'char'
        });
        var $result = $('.result .option').textillate({
            loop: false,
            initialDelay: 0,
            in: {
                effect: 'fadeInLeft',
                shuffle: true
            },
            type: 'char'
        });

        $('.result').css('display', 'block');
        $resultTitle.textillate('in');
        $result.textillate('in');
    }

    function renderTemplate(data) {
        fetch('template/template.ejs').then(function (response) {
            return response.text();
        }).then(function (body) {
            // render the template
            var domWrapper = ejs.render(body, data);

            // exchange active/inactive class
            $('.prev,.temp').toggleClass('active inactive');
            // update the dom
            $('.wrapper.active').html(domWrapper);
            // preload images of the next page
            preloadImgs({
                selector: '.wrapper.active .preload'
            });

            swapPageAnimation();

            // register each question's events
            switch (routIndex) {
                case 1:
                    question1(data.config.detail);
                    break;
                case 2:
                    question2();
                    break;
                case 3:
                    question3();
                    break;
                case 4:
                    resultAnimation();
                    break;
                default:
                    console.log('default');
            }

            submitEvent();
        });
    }

    function loadNextPage() {
        $.ajax({
            type: 'POST',
            url: ROUT_HREF[routIndex],
            dataType: 'json',
            success: function success(data) {
                ++routIndex;
                renderTemplate(data);
            }
        });
    }

    $cta.on('click', loadNextPage);
    $contactMe.on('click', function () {
        window.open('https://github.com/H5DevHoward/FPG_InterView');
    });
};

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJwdWJsaWMvanMvaW5kZXguZXM2Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSxPQUFPLE9BQVAsR0FBaUIsWUFBTTtBQUNuQixhQUFTLFdBQVQsQ0FBcUIsR0FBckIsRUFBMEI7QUFDdEIsWUFBSSxNQUFNO0FBQ04sc0JBQVUsVUFESjtBQUVOLGtCQUFNLGdCQUFXLENBQUU7QUFGYixTQUFWO0FBSUEsWUFBSSxPQUFPLEVBQUUsTUFBRixDQUFTLEVBQVQsRUFBYSxHQUFiLEVBQWtCLEdBQWxCLENBQVg7QUFDQSxZQUFJLFNBQVMsRUFBYjtBQUNBLFlBQUksZUFBSjtBQUFBLFlBQVksZUFBZSxDQUEzQjtBQUNBLFlBQUksZUFBZSxFQUFFLEtBQUssUUFBUCxDQUFuQjs7QUFFQSxpQkFBUyxhQUFhLE1BQXRCO0FBQ0EscUJBQWEsSUFBYixDQUFrQixVQUFDLEtBQUQsRUFBUSxJQUFSLEVBQWlCO0FBQy9CLGdCQUFJLFFBQVEsRUFBRSxJQUFGLENBQVo7O0FBRUEsbUJBQU8sS0FBUCxJQUFnQixJQUFJLEtBQUosRUFBaEI7QUFDQSxtQkFBTyxLQUFQLEVBQWMsZ0JBQWQsQ0FBK0IsTUFBL0IsRUFBdUMsWUFBVztBQUM5QyxvQkFBSSxPQUFPLE1BQU0sSUFBTixDQUFXLElBQVgsQ0FBUCxJQUE0QixXQUFoQyxFQUE2QztBQUN6QywwQkFBTSxHQUFOLENBQVUsa0JBQVYsV0FBcUMsT0FBTyxLQUFQLEVBQWMsR0FBbkQ7QUFDSCxpQkFGRCxNQUVPO0FBQ0gsMEJBQU0sTUFBTixDQUFhLE9BQU8sS0FBUCxDQUFiO0FBQ0g7QUFDRCxvQkFBSSxFQUFFLFlBQUYsSUFBa0IsTUFBdEIsRUFBOEI7QUFDMUIseUJBQUssSUFBTDtBQUNIO0FBQ0osYUFURDtBQVVBLG1CQUFPLEtBQVAsRUFBYyxHQUFkLEdBQW9CLE1BQU0sSUFBTixDQUFXLFFBQVgsQ0FBcEI7QUFDSCxTQWZEO0FB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SixDQUFXLElBQVgsRUFBaUIsSUFBakIsQ0FBakI7O0FBRUE7QUFDQSxjQUFFLGFBQUYsRUFBaUIsV0FBakIsQ0FBNkIsaUJBQTdCO0FBQ0E7QUFDQSxjQUFFLGlCQUFGLEVBQXFCLElBQXJCLENBQTBCLFVBQTFCO0FBQ0E7QUFDQSx3QkFBWTtBQUNSLDBCQUFVO0FBREYsYUFBWjs7QUFJQTs7QUFHQTtBQUNBLG9CQUFRLFNBQVI7QUFDSSxxQkFBSyxDQUFMO0FBQ0ksOEJBQVUsS0FBSyxNQUFMLENBQVksTUFBdEI7QUFDQTtBQUNKLHFCQUFLLENBQUw7QUFDSTtBQUNBO0FBQ0oscUJBQUssQ0FBTDtBQUNJO0FBQ0E7QUFDSixxQkFBSyxDQUFMO0FBQ0k7QUFDQTtBQUNKO0FBQ0ksNEJBQVEsR0FBUixDQUFZLFNBQVo7QUFkUjs7QUFpQkE7QUFDSCxTQXRDTDtBQXVDSDs7QUFFRCxhQUFTLFlBQVQsR0FBd0I7QUFDcEIsVUFBRSxJQUFGLENBQU87QUFDSCxrQkFBTSxNQURIO0FBRUgsaUJBQUssVUFBVSxTQUFWLENBRkY7QUFHSCxzQkFBVSxNQUhQO0FBSUgscUJBQVMsdUJBQVE7QUFDYixrQkFBRSxTQUFGO0FBQ0EsK0JBQWUsSUFBZjtBQUNIO0FBUEUsU0FBUDtBQVNIOztBQUVELFNBQUssRUFBTCxDQUFRLE9BQVIsRUFBaUIsWUFBakI7QUFDQSxlQUFXLEVBQVgsQ0FBYyxPQUFkLEVBQXVCLFlBQVc7QUFDOUIsZUFBTyxJQUFQLENBQVksOENBQVo7QUFDSCxLQUZEO0FBR0gsQ0E1YUQiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwid2luZG93LnN0YXJ0QWQgPSAoKSA9PiB7XG4gICAgZnVuY3Rpb24gcHJlbG9hZEltZ3Mob2JqKSB7XG4gICAgICAgIGxldCBkZWYgPSB7XG4gICAgICAgICAgICBzZWxlY3RvcjogJy5wcmVsb2FkJyxcbiAgICAgICAgICAgIGRvbmU6IGZ1bmN0aW9uKCkge31cbiAgICAgICAgfTtcbiAgICAgICAgbGV0IG9wdHMgPSAkLmV4dGVuZCh7fSwgZGVmLCBvYmopO1xuICAgICAgICBsZXQgaW1hZ2VzID0gW107XG4gICAgICAgIGxldCBpbWdMZW4sIGN1cnJlbnRJbmRleCA9IDA7XG4gICAgICAgIGxldCAkcHJlbG9hZEl0ZW0gPSAkKG9wdHMuc2VsZWN0b3IpO1xuXG4gICAgICAgIGltZ0xlbiA9ICRwcmVsb2FkSXRlbS5sZW5ndGg7XG4gICAgICAgICRwcmVsb2FkSXRlbS5lYWNoKChpbmRleCwgaXRlbSkgPT4ge1xuICAgICAgICAgICAgbGV0ICRpdGVtID0gJChpdGVtKTtcblxuICAgICAgICAgICAgaW1hZ2VzW2luZGV4XSA9IG5ldyBJbWFnZSgpO1xuICAgICAgICAgICAgaW1hZ2VzW2luZGV4XS5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZigkaXRlbS5kYXRhKCdiZycpKSAhPSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgICAgICAkaXRlbS5jc3MoJ2JhY2tncm91bmQtaW1hZ2UnLCBgdXJsKCR7aW1hZ2VzW2luZGV4XS5zcmN9KWApO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICRpdGVtLmFwcGVuZChpbWFnZXNbaW5kZXhdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCsrY3VycmVudEluZGV4ID09IGltZ0xlbikge1xuICAgICAgICAgICAgICAgICAgICBvcHRzLmRvbmUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGltYWdlc1tpbmRleF0uc3JjID0gJGl0ZW0uZGF0YSgnc291cmNlJyk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBwcmVsb2FkSW1ncygpO1xuXG4gICAgY29uc3QgUk9VVF9IUkVGID0gWycvcTEnLCAnL3EyJywgJy9xMycsICcvcmVzdWx0JywgJy9zYXZlJ107XG4gICAgY29uc3QgQVVESU9fTkFNRVMgPSBbJ2NvdW50RG93bkF1ZGlvJywgJ3JpZ2h0QXVkaW8nLCAnd3JvbmdBdWRpbycsICd2aWN0b3J5QXVkaW8nXTtcblxuICAgIGxldCAkd2luZG93ID0gJCh3aW5kb3cpO1xuICAgIGxldCAkY3RhID0gJCgnLmN0YScpO1xuICAgIGxldCAkY29udGFjdE1lID0gJCgnLmZhY2UyJyk7XG4gICAgbGV0IHJvdXRJbmRleCA9IDA7XG4gICAgbGV0IGF1ZGlvcyA9IFtdO1xuICAgIGxldCBjb3VudERvd24yMCwgY291bnREb3duRW5kO1xuICAgIGxldCBmbGFnX3EyX2VuZCA9IGZhbHNlO1xuICAgIGNvbnN0ICR3ZWxjb21lID0gJCgnLndlbGNvbWUnKS50ZXh0aWxsYXRlKHtcbiAgICAgICAgbG9vcDogZmFsc2UsXG4gICAgICAgIGluaXRpYWxEZWxheTogMTAwLFxuICAgICAgICBpbjoge1xuICAgICAgICAgICAgZWZmZWN0OiAnZmFkZUluTGVmdCcsXG4gICAgICAgICAgICBzeW5jOiBmYWxzZSxcbiAgICAgICAgICAgIHJldmVyc2U6IGZhbHNlLFxuICAgICAgICB9LFxuICAgICAgICB0eXBlOiAnY2hhcicsXG4gICAgfSk7XG5cbiAgICAkd2VsY29tZS5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKS50ZXh0aWxsYXRlKCdpbicpO1xuXG5cblxuICAgIGZ1bmN0aW9uIHN3YXBQYWdlQW5pbWF0aW9uKCkge1xuICAgICAgICBsZXQgJG5hdkl0ZW0gPSAkKCcubmF2LXdyYXBwZXIgZGl2Jyk7XG4gICAgICAgIGxldCBbZmxhZ19pc1BhZ2UxLCBmbGFnX2lzUGFnZTRdID0gW3JvdXRJbmRleCA9PSAxLCByb3V0SW5kZXggPT0gNF07XG5cbiAgICAgICAgaWYgKGZsYWdfaXNQYWdlNCkge1xuICAgICAgICAgICAgbGV0ICRyZXN1bHRPdmVybGF5ID0gJCgnLnJlc3VsdE92ZXJsYXknKTtcbiAgICAgICAgICAgIGxldCBidG5YID0gJHJlc3VsdE92ZXJsYXkud2lkdGgoKTtcbiAgICAgICAgICAgIGxldCBidG5ZID0gJHJlc3VsdE92ZXJsYXkuaGVpZ2h0KCk7XG4gICAgICAgICAgICBsZXQgbXVsdGlwbGVYID0gJHdpbmRvdy53aWR0aCgpIC8gYnRuWDtcbiAgICAgICAgICAgIGxldCBtdWx0aXBsZVkgPSAkd2luZG93LmhlaWdodCgpIC8gYnRuWTtcblxuICAgICAgICAgICAgVHdlZW5NYXgudG8oJy5zdWJtaXQnLCAwLjEsIHtcbiAgICAgICAgICAgICAgICBhdXRvQWxwaGE6IDAsXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgVHdlZW5NYXgudG8oJHJlc3VsdE92ZXJsYXksIDAuNSwge1xuICAgICAgICAgICAgICAgIGF1dG9BbHBoYTogMSxcbiAgICAgICAgICAgICAgICBzY2FsZVg6IG11bHRpcGxlWCAqIDEwLFxuICAgICAgICAgICAgICAgIHNjYWxlWTogbXVsdGlwbGVZICogMTAsXG4gICAgICAgICAgICAgICAgZGVsYXk6IDAuMSxcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkKCcucHJldiAucG9zdGVyJykuY3NzKCdiYWNrZ3JvdW5kLWNvbG9yJywgJ3JnYmEoMjU1LCAyNTUsIDI1NSwgMC41KScpO1xuICAgICAgICAgICAgJCgnLnRlbXAgLmNvbnRhaW5lcicpLmFkZENsYXNzKCdibHVyJyk7XG5cbiAgICAgICAgICAgIFR3ZWVuTWF4LmZyb21UbygnLnByZXYnLCAwLjcsIHtcbiAgICAgICAgICAgICAgICB4OiAnMCUnLFxuICAgICAgICAgICAgICAgIHpJbmRleDogMixcbiAgICAgICAgICAgICAgICBhdXRvQWxwaGE6IDAsXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgYXV0b0FscGhhOiAxLFxuICAgICAgICAgICAgICAgIGVhc2U6IEN1YmljLmVhc2VJbk91dCxcbiAgICAgICAgICAgICAgICBkZWxheTogMC4xLFxuICAgICAgICAgICAgICAgIG9uQ29tcGxldGU6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgJG5hdkl0ZW0ucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgICAgICAgICAkbmF2SXRlbS5lcShyb3V0SW5kZXgpLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBUd2Vlbk1heC5mcm9tVG8oJy53cmFwcGVyLmluYWN0aXZlJywgMC43LCB7XG4gICAgICAgICAgICAgICAgeDogJzAlJyxcbiAgICAgICAgICAgICAgICB5OiAnMCUnLFxuICAgICAgICAgICAgICAgIHpJbmRleDogMixcbiAgICAgICAgICAgICAgICBhdXRvQWxwaGE6IGZsYWdfaXNQYWdlNCA/IDAgOiAxLFxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIHg6IGZsYWdfaXNQYWdlMSA/ICcwJScgOiAnLTEwMCUnLFxuICAgICAgICAgICAgICAgIHk6IGZsYWdfaXNQYWdlMSA/ICctMTAwJScgOiAnMCUnLFxuICAgICAgICAgICAgICAgIGF1dG9BbHBoYTogMSxcbiAgICAgICAgICAgICAgICBlYXNlOiBDdWJpYy5lYXNlSW5PdXQsXG4gICAgICAgICAgICAgICAgZGVsYXk6IDAuMSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgVHdlZW5NYXguZnJvbVRvKCcud3JhcHBlci5hY3RpdmUnLCAwLjcsIHtcbiAgICAgICAgICAgICAgICB4OiBmbGFnX2lzUGFnZTEgPyAnMCUnIDogJzEwMCUnLFxuICAgICAgICAgICAgICAgIHk6IGZsYWdfaXNQYWdlMSA/ICcxMDAlJyA6ICcwJScsXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgeDogJzAlJyxcbiAgICAgICAgICAgICAgICB5OiAnMCUnLFxuICAgICAgICAgICAgICAgIGVhc2U6IEN1YmljLmVhc2VJbk91dCxcbiAgICAgICAgICAgICAgICBkZWxheTogMC4xLFxuICAgICAgICAgICAgICAgIG9uQ29tcGxldGU6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgJCgnLndyYXBwZXIuYWN0aXZlJykuY3NzKCd6LWluZGV4JywgJzEnKTtcbiAgICAgICAgICAgICAgICAgICAgJG5hdkl0ZW0ucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgICAgICAgICAkbmF2SXRlbS5lcShyb3V0SW5kZXgpLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBxdWVzdGlvbjEodGltZW91dCkge1xuICAgICAgICBjb25zdCBUSU1FT1VUX0NBUkQgPSB0aW1lb3V0Lm1hcCh4ID0+IHgudGltZW91dCAqIDEwMDApO1xuICAgICAgICBsZXQgZmxhZ19jYXJkX2FuaW1hdGlvbkVuZCA9IGZhbHNlO1xuXG4gICAgICAgICQoJy5jYXJkLXdyYXBwZXInKS5vbignYW5pbWF0aW9uZW5kJywgJy5jYXJkOmxhc3QnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGZsYWdfY2FyZF9hbmltYXRpb25FbmQgPSB0cnVlO1xuICAgICAgICB9KS5vbignbW91c2VlbnRlcicsICcuY2FyZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY29uc3QgJGl0ZW0gPSAkKHRoaXMpO1xuICAgICAgICAgICAgY29uc3QgQ0FSRF9JTkRFWCA9ICRpdGVtLmluZGV4KCk7XG5cbiAgICAgICAgICAgIGlmICghZmxhZ19jYXJkX2FuaW1hdGlvbkVuZCkgcmV0dXJuO1xuICAgICAgICAgICAgaWYgKCRpdGVtLmF0dHIoJ2RhdGEtZmxhZycpID09ICd0cnVlJykgcmV0dXJuO1xuICAgICAgICAgICAgJGl0ZW0uYWRkQ2xhc3MoJ2hvdmVyJyk7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAkaXRlbS5hdHRyKCdkYXRhLWZsYWcnLCAndHJ1ZScpO1xuICAgICAgICAgICAgICAgICRpdGVtLnJlbW92ZUNsYXNzKCdob3ZlcicpO1xuICAgICAgICAgICAgfSwgVElNRU9VVF9DQVJEW0NBUkRfSU5ERVhdKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJCgndGV4dGFyZWEueW91ckFuc3dlcicpLm9uKCdrZXlkb3duJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgaWYgKGUua2V5Q29kZSA9PSAnMTMnKSB7XG4gICAgICAgICAgICAgICAgJCgnLndyYXBwZXIuYWN0aXZlIC5zdWJtaXQnKS50cmlnZ2VyKCdjbGljaycpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBxdWVzdGlvbjIoKSB7XG4gICAgICAgIGNvbnN0IFRPVExFX1RJTUUgPSAzMDAwMDtcbiAgICAgICAgY29uc3QgQ09VTlRfRE9XTl9ESUZGID0gVE9UTEVfVElNRSAtIDIwMDAwO1xuXG4gICAgICAgIC8vIGluaXQgYXVkaW9cbiAgICAgICAgaW5pdEF1ZGlvKCk7XG5cbiAgICAgICAgZnVuY3Rpb24gaW5pdEF1ZGlvKCkge1xuICAgICAgICAgICAgQVVESU9fTkFNRVMuZm9yRWFjaCgoaXRlbSwgaSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGF1ZGlvID0gbmV3IEF1ZGlvKCk7XG5cbiAgICAgICAgICAgICAgICBhdWRpby5zcmMgPSBgLi4vbWVkaWEvJHtpdGVtfS5tcDNgO1xuICAgICAgICAgICAgICAgIGF1ZGlvcy5wdXNoKGF1ZGlvKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cblxuXG4gICAgICAgIGxldCBsYW1wSW5kZXggPSAwO1xuICAgICAgICBsZXQgbGFtcEFycmF5ID0gJC5tYWtlQXJyYXkoJCgnLmxhbXAnKSk7XG4gICAgICAgIGNvbnN0IFRXRUVOX0lURU1fTEVOR1RIID0gbGFtcEFycmF5Lmxlbmd0aDtcblxuICAgICAgICBmdW5jdGlvbiBmaW5kRW5kQW5pbWF0aW9uKGNvcHkpIHtcbiAgICAgICAgICAgICQoJy5kZWZlYXQtd3JhcHBlcicpLmNzcygnZGlzcGxheScsICdibG9jaycpO1xuICAgICAgICAgICAgVHdlZW5NYXguc3RhZ2dlckZyb21UbygnLmxhbXAtd3JhcHBlciAubGFtcCcsIDAuNSwge1xuICAgICAgICAgICAgICAgIHg6ICcwJScsXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgeDogJy0yMzAlJyxcbiAgICAgICAgICAgICAgICBlYXNlOiBRdWFkLmVhc2VPdXQsXG4gICAgICAgICAgICAgICAgZGVsYXk6IDAuMyxcbiAgICAgICAgICAgICAgICBvbkNvbXBsZXRlOiB0d2VlbiA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxldCAkdHdlZW5UYXJnZXQgPSAkKHR3ZWVuLnRhcmdldCk7XG4gICAgICAgICAgICAgICAgICAgIGxldCB0d2Vlbkl0ZW1JbmRleCA9ICR0d2VlblRhcmdldC5pbmRleCgpO1xuICAgICAgICAgICAgICAgICAgICBsZXQgdHdlZW5JdGVtQ29sb3IgPSAkdHdlZW5UYXJnZXQuY3NzKCdiYWNrZ3JvdW5kLWNvbG9yJyk7XG4gICAgICAgICAgICAgICAgICAgIGxldCB0d2Vlbkl0ZW1aSW5kZXggPSBUV0VFTl9JVEVNX0xFTkdUSCAtIHR3ZWVuSXRlbUluZGV4O1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0d2Vlbkl0ZW1JbmRleCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgVHdlZW5NYXguZnJvbVRvKGAuZGVmZWF0Q2lyY2xlOm50aC1jaGlsZCgkeyh0d2Vlbkl0ZW1JbmRleCArIDEpfSlgLCAwLjIsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB6SW5kZXg6IHR3ZWVuSXRlbVpJbmRleFxuICAgICAgICAgICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF1dG9BbHBoYTogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY2FsZTogMyAqIHR3ZWVuSXRlbUluZGV4LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogdHdlZW5JdGVtQ29sb3IsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWFzZTogQm91bmNlLmVhc2VJbk91dCxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgVHdlZW5NYXgudG8oJy5kZWZlYXRDaXJjbGU6bnRoLWNoaWxkKDEpJywgMC4yLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXV0b0FscGhhOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogdHdlZW5JdGVtQ29sb3IsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgekluZGV4OiB0d2Vlbkl0ZW1aSW5kZXgsXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgb25Db21wbGV0ZVBhcmFtczogWyd7c2VsZn0nXSxcbiAgICAgICAgICAgIH0sIDAuMDUsICgpID0+IHtcbiAgICAgICAgICAgICAgICBUd2Vlbk1heC5mcm9tVG8oY29weSwgMC4yLCB7XG4gICAgICAgICAgICAgICAgICAgIHpJbmRleDogNixcbiAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgIGF1dG9BbHBoYTogMSxcbiAgICAgICAgICAgICAgICAgICAgc2NhbGU6IDEyLFxuICAgICAgICAgICAgICAgICAgICBlYXNlOiBCb3VuY2UuZWFzZUluT3V0LFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgLy9yZWdpc3RlciBldmVudHNcbiAgICAgICAgJCgnLmRpZmZlcmVudC13cmFwcGVyIC5vdmVybGF5Jykub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zdCAkdGhpcyA9ICQodGhpcyk7XG5cbiAgICAgICAgICAgIFR3ZWVuTWF4LnN0YWdnZXJGcm9tVG8oJy5sYW1wLXdyYXBwZXIgLmxhbXAnLCAwLjUsIHtcbiAgICAgICAgICAgICAgICB4OiAnLTIzMCUnLFxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIHg6ICcwJScsXG4gICAgICAgICAgICAgICAgZWFzZTogUXVhZC5lYXNlT3V0LFxuICAgICAgICAgICAgICAgIGRlbGF5OiAwLjMsXG4gICAgICAgICAgICB9LCAwLjA1KTtcblxuICAgICAgICAgICAgY291bnREb3duMjAgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICBhdWRpb3NbMF0ucGxheSgpO1xuICAgICAgICAgICAgfSwgQ09VTlRfRE9XTl9ESUZGKTtcblxuICAgICAgICAgICAgY291bnREb3duRW5kID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgZmluZEVuZEFuaW1hdGlvbignLmRlZmVhdENvcHknKTtcbiAgICAgICAgICAgICAgICBmbGFnX3EyX2VuZCA9IHRydWU7XG4gICAgICAgICAgICB9LCBUT1RMRV9USU1FKTtcblxuICAgICAgICAgICAgVHdlZW5NYXgudG8oJHRoaXMsIDAuNSwge1xuICAgICAgICAgICAgICAgIGF1dG9BbHBoYTogMCxcbiAgICAgICAgICAgICAgICBvbkNvbXBsZXRlOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICR0aGlzLmNzcygnZGlzcGxheScsICdub25lJyk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgVHdlZW5NYXgudG8oJy5sYW1wLXdyYXBwZXInLCAwLjUsIHtcbiAgICAgICAgICAgICAgICBhdXRvQWxwaGE6IDEsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJCgnLnRhcmdldC5wcm9kdWN0Jykub24oJ2NsaWNrJywgJy50YXJnZXRJdGVtJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAoZmxhZ19xMl9lbmQpIHJldHVybjtcblxuICAgICAgICAgICAgcmVzZXRUYXJnZXRBdWRpbyhhdWRpb3NbMl0pO1xuICAgICAgICAgICAgYXVkaW9zWzJdLnBsYXkoKTtcbiAgICAgICAgfSkub24oJ2NsaWNrJywgJy5ob3RzcG90JywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zdCAkdGhpcyA9ICQodGhpcyk7XG4gICAgICAgICAgICBpZiAoZmxhZ19xMl9lbmQgfHwgJHRoaXMuaGFzQ2xhc3MoJ2FjdGl2ZScpKSByZXR1cm47XG5cbiAgICAgICAgICAgICR0aGlzLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgICAgICQoJy5sYW1wJykuZXEobGFtcEluZGV4KS5hZGRDbGFzcygnYWN0aXZlJyk7XG5cbiAgICAgICAgICAgIHJlc2V0VGFyZ2V0QXVkaW8oYXVkaW9zWzFdKTtcbiAgICAgICAgICAgIGF1ZGlvc1sxXS5wbGF5KCk7XG5cbiAgICAgICAgICAgIGlmIChsYW1wSW5kZXggPT0gVFdFRU5fSVRFTV9MRU5HVEggLSAxKSB7XG4gICAgICAgICAgICAgICAgZmxhZ19xMl9lbmQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGZpbmRFbmRBbmltYXRpb24oJy52aWN0b3J5Q29weScpO1xuXG4gICAgICAgICAgICAgICAgYXVkaW9zWzNdLnBsYXkoKTtcblxuICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dChjb3VudERvd24yMCk7XG4gICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KGNvdW50RG93bkVuZCk7XG5cbiAgICAgICAgICAgICAgICByZXNldFRhcmdldEF1ZGlvKGF1ZGlvc1swXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICArK2xhbXBJbmRleDtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcXVlc3Rpb24zKCkge1xuICAgICAgICAkKCcuY2lyY2xlLXdyYXBwZXIgaW5wdXQnKS5vbigna2V5ZG93bicsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIGlmIChlLmtleUNvZGUgPT0gJzEzJykge1xuICAgICAgICAgICAgICAgICQoJy53cmFwcGVyLmFjdGl2ZSAuc3VibWl0JykudHJpZ2dlcignY2xpY2snKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gcmVzZXQgdGFyZ2V0IGF1ZGlvXG4gICAgZnVuY3Rpb24gcmVzZXRUYXJnZXRBdWRpbyhhdWRpb09iaikge1xuICAgICAgICBhdWRpb09iai5wYXVzZSgpO1xuICAgICAgICBhdWRpb09iai5jdXJyZW50VGltZSA9IDA7XG4gICAgfVxuXG4gICAgLy8gcmVzZXQgYXVkaW9zIGJlZm9yZSBzd2FwIHBhZ2VcbiAgICBmdW5jdGlvbiByZXNldEF1ZGlvKCkge1xuICAgICAgICBmbGFnX3EyX2VuZCA9IHRydWU7XG4gICAgICAgIGNsZWFyVGltZW91dChjb3VudERvd24yMCk7XG4gICAgICAgIGNsZWFyVGltZW91dChjb3VudERvd25FbmQpO1xuXG4gICAgICAgIGF1ZGlvcy5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0sIGkpIHtcbiAgICAgICAgICAgIHJlc2V0VGFyZ2V0QXVkaW8oaXRlbSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHN1Ym1pdEV2ZW50KCkge1xuICAgICAgICBsZXQgJHN1Ym1pdCA9ICQoJy5hY3RpdmUud3JhcHBlciAuc3VibWl0Jyk7XG4gICAgICAgIGxldCBhbnN3ZXJzID0gW107XG5cbiAgICAgICAgJHN1Ym1pdC5vbignbW91c2VlbnRlciBtb3VzZWxlYXZlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkc3VibWl0LnRvZ2dsZUNsYXNzKCdob3ZlcicpO1xuICAgICAgICB9KS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHN3aXRjaCAocm91dEluZGV4KSB7XG4gICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICBjb25zdCBxMUFuc3dlciA9ICQoJ3RleHRhcmVhJykudmFsKCkucmVwbGFjZSgvIC9nLCAnJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgYW5zd2Vycy5wdXNoKHExQW5zd2VyKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgICAgICByZXNldEF1ZGlvKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcTJBbnN3ZXIgPSAkLm1ha2VBcnJheSgkKCcubGFtcC5hY3RpdmUnKSkubGVuZ3RoO1xuXG4gICAgICAgICAgICAgICAgICAgIGFuc3dlcnMucHVzaChxMkFuc3dlcik7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcTNBbnN3ZXIgPSAkKCdpbnB1dCcpLnZhbCgpLnJlcGxhY2UoLyAvZywgJycpO1xuXG4gICAgICAgICAgICAgICAgICAgIGFuc3dlcnMucHVzaChxM0Fuc3dlcik7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdkZWZhdWx0Jyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHNlbmQgYW5zd2Vyc1xuICAgICAgICAgICAgJC5wb3N0KFJPVVRfSFJFRls0XSwge1xuICAgICAgICAgICAgICAgICAgICBhbnN3ZXI6IGFuc3dlcnMsXG4gICAgICAgICAgICAgICAgICAgIHFJbmRleDogcm91dEluZGV4LFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmRvbmUoZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdzdWNjZXNzZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgbG9hZE5leHRQYWdlKCk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZmFpbCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdmYWlsZWQnKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVzdWx0QW5pbWF0aW9uKCkge1xuICAgICAgICBjb25zdCAkcmVzdWx0VGl0bGUgPSAkKCcucmVzdWx0IC50aXRsZScpLnRleHRpbGxhdGUoe1xuICAgICAgICAgICAgbG9vcDogZmFsc2UsXG4gICAgICAgICAgICBpbml0aWFsRGVsYXk6IDAsXG4gICAgICAgICAgICBpbjoge1xuICAgICAgICAgICAgICAgIGVmZmVjdDogJ2ZhZGVJbkxlZnQnLFxuICAgICAgICAgICAgICAgIHNodWZmbGU6IHRydWVcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0eXBlOiAnY2hhcicsXG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCAkcmVzdWx0ID0gJCgnLnJlc3VsdCAub3B0aW9uJykudGV4dGlsbGF0ZSh7XG4gICAgICAgICAgICBsb29wOiBmYWxzZSxcbiAgICAgICAgICAgIGluaXRpYWxEZWxheTogMCxcbiAgICAgICAgICAgIGluOiB7XG4gICAgICAgICAgICAgICAgZWZmZWN0OiAnZmFkZUluTGVmdCcsXG4gICAgICAgICAgICAgICAgc2h1ZmZsZTogdHJ1ZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHR5cGU6ICdjaGFyJyxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJCgnLnJlc3VsdCcpLmNzcygnZGlzcGxheScsICdibG9jaycpO1xuICAgICAgICAkcmVzdWx0VGl0bGUudGV4dGlsbGF0ZSgnaW4nKTtcbiAgICAgICAgJHJlc3VsdC50ZXh0aWxsYXRlKCdpbicpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlbmRlclRlbXBsYXRlKGRhdGEpIHtcbiAgICAgICAgZmV0Y2goJ3RlbXBsYXRlL3RlbXBsYXRlLmVqcycpXG4gICAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKTtcbiAgICAgICAgICAgIH0pLnRoZW4oYm9keSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gcmVuZGVyIHRoZSB0ZW1wbGF0ZVxuICAgICAgICAgICAgICAgIGxldCBkb21XcmFwcGVyID0gZWpzLnJlbmRlcihib2R5LCBkYXRhKTtcblxuICAgICAgICAgICAgICAgIC8vIGV4Y2hhbmdlIGFjdGl2ZS9pbmFjdGl2ZSBjbGFzc1xuICAgICAgICAgICAgICAgICQoJy5wcmV2LC50ZW1wJykudG9nZ2xlQ2xhc3MoJ2FjdGl2ZSBpbmFjdGl2ZScpO1xuICAgICAgICAgICAgICAgIC8vIHVwZGF0ZSB0aGUgZG9tXG4gICAgICAgICAgICAgICAgJCgnLndyYXBwZXIuYWN0aXZlJykuaHRtbChkb21XcmFwcGVyKTtcbiAgICAgICAgICAgICAgICAvLyBwcmVsb2FkIGltYWdlcyBvZiB0aGUgbmV4dCBwYWdlXG4gICAgICAgICAgICAgICAgcHJlbG9hZEltZ3Moe1xuICAgICAgICAgICAgICAgICAgICBzZWxlY3RvcjogJy53cmFwcGVyLmFjdGl2ZSAucHJlbG9hZCcsXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBzd2FwUGFnZUFuaW1hdGlvbigpO1xuXG5cbiAgICAgICAgICAgICAgICAvLyByZWdpc3RlciBlYWNoIHF1ZXN0aW9uJ3MgZXZlbnRzXG4gICAgICAgICAgICAgICAgc3dpdGNoIChyb3V0SW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICAgICAgcXVlc3Rpb24xKGRhdGEuY29uZmlnLmRldGFpbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgICAgICAgICAgcXVlc3Rpb24yKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgICAgICAgICAgcXVlc3Rpb24zKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0QW5pbWF0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdkZWZhdWx0Jyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgc3VibWl0RXZlbnQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxvYWROZXh0UGFnZSgpIHtcbiAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgIHR5cGU6ICdQT1NUJyxcbiAgICAgICAgICAgIHVybDogUk9VVF9IUkVGW3JvdXRJbmRleF0sXG4gICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICAgICAgc3VjY2VzczogZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgKytyb3V0SW5kZXg7XG4gICAgICAgICAgICAgICAgcmVuZGVyVGVtcGxhdGUoZGF0YSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAkY3RhLm9uKCdjbGljaycsIGxvYWROZXh0UGFnZSk7XG4gICAgJGNvbnRhY3RNZS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgICAgd2luZG93Lm9wZW4oJ2h0dHBzOi8vZ2l0aHViLmNvbS9INURldkhvd2FyZC9GUEdfSW50ZXJWaWV3Jyk7XG4gICAgfSk7XG59O1xuIl19
