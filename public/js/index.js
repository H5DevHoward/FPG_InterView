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
};

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJwdWJsaWMvanMvaW5kZXguZXM2Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSxPQUFPLE9BQVAsR0FBaUIsWUFBTTtBQUNuQixhQUFTLFdBQVQsQ0FBcUIsR0FBckIsRUFBMEI7QUFDdEIsWUFBSSxNQUFNO0FBQ04sc0JBQVUsVUFESjtBQUVOLGtCQUFNLGdCQUFXLENBQUU7QUFGYixTQUFWO0FBSUEsWUFBSSxPQUFPLEVBQUUsTUFBRixDQUFTLEVBQVQsRUFBYSxHQUFiLEVBQWtCLEdBQWxCLENBQVg7QUFDQSxZQUFJLFNBQVMsRUFBYjtBQUNBLFlBQUksZUFBSjtBQUFBLFlBQVksZUFBZSxDQUEzQjtBQUNBLFlBQUksZUFBZSxFQUFFLEtBQUssUUFBUCxDQUFuQjs7QUFFQSxpQkFBUyxhQUFhLE1BQXRCO0FBQ0EscUJBQWEsSUFBYixDQUFrQixVQUFDLEtBQUQsRUFBUSxJQUFSLEVBQWlCO0FBQy9CLGdCQUFJLFFBQVEsRUFBRSxJQUFGLENBQVo7O0FBRUEsbUJBQU8sS0FBUCxJQUFnQixJQUFJLEtBQUosRUFBaEI7QUFDQSxtQkFBTyxLQUFQLEVBQWMsZ0JBQWQsQ0FBK0IsTUFBL0IsRUFBdUMsWUFBVztBQUM5QyxvQkFBSSxPQUFPLE1BQU0sSUFBTixDQUFXLElBQVgsQ0FBUCxJQUE0QixXQUFoQyxFQUE2QztBQUN6QywwQkFBTSxHQUFOLENBQVUsa0JBQVYsV0FBcUMsT0FBTyxLQUFQLEVBQWMsR0FBbkQ7QUFDSCxpQkFGRCxNQUVPO0FBQ0gsMEJBQU0sTUFBTixDQUFhLE9BQU8sS0FBUCxDQUFiO0FBQ0g7QUFDRCxvQkFBSSxFQUFFLFlBQUYsSUFBa0IsTUFBdEIsRUFBOEI7QUFDMUIseUJBQUssSUFBTDtBQUNIO0FBQ0osYUFURDtBQVVBLG1CQUFPLEtBQVAsRUFBYyxHQUFkLEdBQW9CLE1BQU0sSUFBTixDQUFXLFFBQVgsQ0FBcEI7QUFDSCxTQWZEO0FB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QUFFQTtBQUNBLGNBQUUsYUFBRixFQUFpQixXQUFqQixDQUE2QixpQkFBN0I7QUFDQTtBQUNBLGNBQUUsaUJBQUYsRUFBcUIsSUFBckIsQ0FBMEIsVUFBMUI7QUFDQTtBQUNBLHdCQUFZO0FBQ1IsMEJBQVU7QUFERixhQUFaOztBQUlBOztBQUdBO0FBQ0Esb0JBQVEsU0FBUjtBQUNJLHFCQUFLLENBQUw7QUFDSSw4QkFBVSxLQUFLLE1BQUwsQ0FBWSxNQUF0QjtBQUNBO0FBQ0oscUJBQUssQ0FBTDtBQUNJO0FBQ0E7QUFDSixxQkFBSyxDQUFMO0FBQ0k7QUFDQTtBQUNKLHFCQUFLLENBQUw7QUFDSTtBQUNBO0FBQ0o7QUFDSSw0QkFBUSxHQUFSLENBQVksU0FBWjtBQWRSOztBQWlCQTtBQUNILFNBdENMO0FBdUNIOztBQUVELGFBQVMsWUFBVCxHQUF3QjtBQUNwQixVQUFFLElBQUYsQ0FBTztBQUNILGtCQUFNLE1BREg7QUFFSCxpQkFBSyxVQUFVLFNBQVYsQ0FGRjtBQUdILHNCQUFVLE1BSFA7QUFJSCxxQkFBUyx1QkFBUTtBQUNiLGtCQUFFLFNBQUY7QUFDQSwrQkFBZSxJQUFmO0FBQ0g7QUFQRSxTQUFQO0FBU0g7O0FBRUQsU0FBSyxFQUFMLENBQVEsT0FBUixFQUFpQixZQUFqQjtBQUNILENBeGFEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIndpbmRvdy5zdGFydEFkID0gKCkgPT4ge1xuICAgIGZ1bmN0aW9uIHByZWxvYWRJbWdzKG9iaikge1xuICAgICAgICBsZXQgZGVmID0ge1xuICAgICAgICAgICAgc2VsZWN0b3I6ICcucHJlbG9hZCcsXG4gICAgICAgICAgICBkb25lOiBmdW5jdGlvbigpIHt9XG4gICAgICAgIH07XG4gICAgICAgIGxldCBvcHRzID0gJC5leHRlbmQoe30sIGRlZiwgb2JqKTtcbiAgICAgICAgbGV0IGltYWdlcyA9IFtdO1xuICAgICAgICBsZXQgaW1nTGVuLCBjdXJyZW50SW5kZXggPSAwO1xuICAgICAgICBsZXQgJHByZWxvYWRJdGVtID0gJChvcHRzLnNlbGVjdG9yKTtcblxuICAgICAgICBpbWdMZW4gPSAkcHJlbG9hZEl0ZW0ubGVuZ3RoO1xuICAgICAgICAkcHJlbG9hZEl0ZW0uZWFjaCgoaW5kZXgsIGl0ZW0pID0+IHtcbiAgICAgICAgICAgIGxldCAkaXRlbSA9ICQoaXRlbSk7XG5cbiAgICAgICAgICAgIGltYWdlc1tpbmRleF0gPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgICAgIGltYWdlc1tpbmRleF0uYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YoJGl0ZW0uZGF0YSgnYmcnKSkgIT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgJGl0ZW0uY3NzKCdiYWNrZ3JvdW5kLWltYWdlJywgYHVybCgke2ltYWdlc1tpbmRleF0uc3JjfSlgKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAkaXRlbS5hcHBlbmQoaW1hZ2VzW2luZGV4XSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICgrK2N1cnJlbnRJbmRleCA9PSBpbWdMZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgb3B0cy5kb25lKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpbWFnZXNbaW5kZXhdLnNyYyA9ICRpdGVtLmRhdGEoJ3NvdXJjZScpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgcHJlbG9hZEltZ3MoKTtcblxuICAgIGNvbnN0IFJPVVRfSFJFRiA9IFsnL3ExJywgJy9xMicsICcvcTMnLCAnL3Jlc3VsdCcsICcvc2F2ZSddO1xuICAgIGNvbnN0IEFVRElPX05BTUVTID0gWydjb3VudERvd25BdWRpbycsICdyaWdodEF1ZGlvJywgJ3dyb25nQXVkaW8nLCAndmljdG9yeUF1ZGlvJ107XG5cbiAgICBsZXQgJHdpbmRvdyA9ICQod2luZG93KTtcbiAgICBsZXQgJGN0YSA9ICQoJy5jdGEnKTtcbiAgICBsZXQgcm91dEluZGV4ID0gMDtcbiAgICBsZXQgYXVkaW9zID0gW107XG4gICAgbGV0IGNvdW50RG93bjIwLCBjb3VudERvd25FbmQ7XG4gICAgbGV0IGZsYWdfcTJfZW5kID0gZmFsc2U7XG4gICAgY29uc3QgJHdlbGNvbWUgPSAkKCcud2VsY29tZScpLnRleHRpbGxhdGUoe1xuICAgICAgICBsb29wOiBmYWxzZSxcbiAgICAgICAgaW5pdGlhbERlbGF5OiAxMDAsXG4gICAgICAgIGluOiB7XG4gICAgICAgICAgICBlZmZlY3Q6ICdmYWRlSW5MZWZ0JyxcbiAgICAgICAgICAgIHN5bmM6IGZhbHNlLFxuICAgICAgICAgICAgcmV2ZXJzZTogZmFsc2UsXG4gICAgICAgIH0sXG4gICAgICAgIHR5cGU6ICdjaGFyJyxcbiAgICB9KTtcblxuICAgICR3ZWxjb21lLmNzcygnZGlzcGxheScsICdibG9jaycpLnRleHRpbGxhdGUoJ2luJyk7XG5cblxuXG4gICAgZnVuY3Rpb24gc3dhcFBhZ2VBbmltYXRpb24oKSB7XG4gICAgICAgIGxldCAkbmF2SXRlbSA9ICQoJy5uYXYtd3JhcHBlciBkaXYnKTtcbiAgICAgICAgbGV0IFtmbGFnX2lzUGFnZTEsIGZsYWdfaXNQYWdlNF0gPSBbcm91dEluZGV4ID09IDEsIHJvdXRJbmRleCA9PSA0XTtcblxuICAgICAgICBpZiAoZmxhZ19pc1BhZ2U0KSB7XG4gICAgICAgICAgICBsZXQgJHJlc3VsdE92ZXJsYXkgPSAkKCcucmVzdWx0T3ZlcmxheScpO1xuICAgICAgICAgICAgbGV0IGJ0blggPSAkcmVzdWx0T3ZlcmxheS53aWR0aCgpO1xuICAgICAgICAgICAgbGV0IGJ0blkgPSAkcmVzdWx0T3ZlcmxheS5oZWlnaHQoKTtcbiAgICAgICAgICAgIGxldCBtdWx0aXBsZVggPSAkd2luZG93LndpZHRoKCkgLyBidG5YO1xuICAgICAgICAgICAgbGV0IG11bHRpcGxlWSA9ICR3aW5kb3cuaGVpZ2h0KCkgLyBidG5ZO1xuXG4gICAgICAgICAgICBUd2Vlbk1heC50bygnLnN1Ym1pdCcsIDAuMSwge1xuICAgICAgICAgICAgICAgIGF1dG9BbHBoYTogMCxcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBUd2Vlbk1heC50bygkcmVzdWx0T3ZlcmxheSwgMC41LCB7XG4gICAgICAgICAgICAgICAgYXV0b0FscGhhOiAxLFxuICAgICAgICAgICAgICAgIHNjYWxlWDogbXVsdGlwbGVYICogMTAsXG4gICAgICAgICAgICAgICAgc2NhbGVZOiBtdWx0aXBsZVkgKiAxMCxcbiAgICAgICAgICAgICAgICBkZWxheTogMC4xLFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICQoJy5wcmV2IC5wb3N0ZXInKS5jc3MoJ2JhY2tncm91bmQtY29sb3InLCAncmdiYSgyNTUsIDI1NSwgMjU1LCAwLjUpJyk7XG4gICAgICAgICAgICAkKCcudGVtcCAuY29udGFpbmVyJykuYWRkQ2xhc3MoJ2JsdXInKTtcblxuICAgICAgICAgICAgVHdlZW5NYXguZnJvbVRvKCcucHJldicsIDAuNywge1xuICAgICAgICAgICAgICAgIHg6ICcwJScsXG4gICAgICAgICAgICAgICAgekluZGV4OiAyLFxuICAgICAgICAgICAgICAgIGF1dG9BbHBoYTogMCxcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBhdXRvQWxwaGE6IDEsXG4gICAgICAgICAgICAgICAgZWFzZTogQ3ViaWMuZWFzZUluT3V0LFxuICAgICAgICAgICAgICAgIGRlbGF5OiAwLjEsXG4gICAgICAgICAgICAgICAgb25Db21wbGV0ZTogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAkbmF2SXRlbS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgICAgICRuYXZJdGVtLmVxKHJvdXRJbmRleCkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIFR3ZWVuTWF4LmZyb21UbygnLndyYXBwZXIuaW5hY3RpdmUnLCAwLjcsIHtcbiAgICAgICAgICAgICAgICB4OiAnMCUnLFxuICAgICAgICAgICAgICAgIHk6ICcwJScsXG4gICAgICAgICAgICAgICAgekluZGV4OiAyLFxuICAgICAgICAgICAgICAgIGF1dG9BbHBoYTogZmxhZ19pc1BhZ2U0ID8gMCA6IDEsXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgeDogZmxhZ19pc1BhZ2UxID8gJzAlJyA6ICctMTAwJScsXG4gICAgICAgICAgICAgICAgeTogZmxhZ19pc1BhZ2UxID8gJy0xMDAlJyA6ICcwJScsXG4gICAgICAgICAgICAgICAgYXV0b0FscGhhOiAxLFxuICAgICAgICAgICAgICAgIGVhc2U6IEN1YmljLmVhc2VJbk91dCxcbiAgICAgICAgICAgICAgICBkZWxheTogMC4xLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBUd2Vlbk1heC5mcm9tVG8oJy53cmFwcGVyLmFjdGl2ZScsIDAuNywge1xuICAgICAgICAgICAgICAgIHg6IGZsYWdfaXNQYWdlMSA/ICcwJScgOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgeTogZmxhZ19pc1BhZ2UxID8gJzEwMCUnIDogJzAlJyxcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICB4OiAnMCUnLFxuICAgICAgICAgICAgICAgIHk6ICcwJScsXG4gICAgICAgICAgICAgICAgZWFzZTogQ3ViaWMuZWFzZUluT3V0LFxuICAgICAgICAgICAgICAgIGRlbGF5OiAwLjEsXG4gICAgICAgICAgICAgICAgb25Db21wbGV0ZTogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAkKCcud3JhcHBlci5hY3RpdmUnKS5jc3MoJ3otaW5kZXgnLCAnMScpO1xuICAgICAgICAgICAgICAgICAgICAkbmF2SXRlbS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgICAgICRuYXZJdGVtLmVxKHJvdXRJbmRleCkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHF1ZXN0aW9uMSh0aW1lb3V0KSB7XG4gICAgICAgIGNvbnN0IFRJTUVPVVRfQ0FSRCA9IHRpbWVvdXQubWFwKHggPT4geC50aW1lb3V0ICogMTAwMCk7XG4gICAgICAgIGxldCBmbGFnX2NhcmRfYW5pbWF0aW9uRW5kID0gZmFsc2U7XG5cbiAgICAgICAgJCgnLmNhcmQtd3JhcHBlcicpLm9uKCdhbmltYXRpb25lbmQnLCAnLmNhcmQ6bGFzdCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZmxhZ19jYXJkX2FuaW1hdGlvbkVuZCA9IHRydWU7XG4gICAgICAgIH0pLm9uKCdtb3VzZWVudGVyJywgJy5jYXJkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zdCAkaXRlbSA9ICQodGhpcyk7XG4gICAgICAgICAgICBjb25zdCBDQVJEX0lOREVYID0gJGl0ZW0uaW5kZXgoKTtcblxuICAgICAgICAgICAgaWYgKCFmbGFnX2NhcmRfYW5pbWF0aW9uRW5kKSByZXR1cm47XG4gICAgICAgICAgICBpZiAoJGl0ZW0uYXR0cignZGF0YS1mbGFnJykgPT0gJ3RydWUnKSByZXR1cm47XG4gICAgICAgICAgICAkaXRlbS5hZGRDbGFzcygnaG92ZXInKTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICRpdGVtLmF0dHIoJ2RhdGEtZmxhZycsICd0cnVlJyk7XG4gICAgICAgICAgICAgICAgJGl0ZW0ucmVtb3ZlQ2xhc3MoJ2hvdmVyJyk7XG4gICAgICAgICAgICB9LCBUSU1FT1VUX0NBUkRbQ0FSRF9JTkRFWF0pO1xuICAgICAgICB9KTtcblxuICAgICAgICAkKCd0ZXh0YXJlYS55b3VyQW5zd2VyJykub24oJ2tleWRvd24nLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBpZiAoZS5rZXlDb2RlID09ICcxMycpIHtcbiAgICAgICAgICAgICAgICAkKCcud3JhcHBlci5hY3RpdmUgLnN1Ym1pdCcpLnRyaWdnZXIoJ2NsaWNrJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHF1ZXN0aW9uMigpIHtcbiAgICAgICAgY29uc3QgVE9UTEVfVElNRSA9IDMwMDAwO1xuICAgICAgICBjb25zdCBDT1VOVF9ET1dOX0RJRkYgPSBUT1RMRV9USU1FIC0gMjAwMDA7XG5cbiAgICAgICAgLy8gaW5pdCBhdWRpb1xuICAgICAgICBpbml0QXVkaW8oKTtcblxuICAgICAgICBmdW5jdGlvbiBpbml0QXVkaW8oKSB7XG4gICAgICAgICAgICBBVURJT19OQU1FUy5mb3JFYWNoKChpdGVtLCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgYXVkaW8gPSBuZXcgQXVkaW8oKTtcblxuICAgICAgICAgICAgICAgIGF1ZGlvLnNyYyA9IGAuLi9tZWRpYS8ke2l0ZW19Lm1wM2A7XG4gICAgICAgICAgICAgICAgYXVkaW9zLnB1c2goYXVkaW8pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuXG5cbiAgICAgICAgbGV0IGxhbXBJbmRleCA9IDA7XG4gICAgICAgIGxldCBsYW1wQXJyYXkgPSAkLm1ha2VBcnJheSgkKCcubGFtcCcpKTtcbiAgICAgICAgY29uc3QgVFdFRU5fSVRFTV9MRU5HVEggPSBsYW1wQXJyYXkubGVuZ3RoO1xuXG4gICAgICAgIGZ1bmN0aW9uIGZpbmRFbmRBbmltYXRpb24oY29weSkge1xuICAgICAgICAgICAgJCgnLmRlZmVhdC13cmFwcGVyJykuY3NzKCdkaXNwbGF5JywgJ2Jsb2NrJyk7XG4gICAgICAgICAgICBUd2Vlbk1heC5zdGFnZ2VyRnJvbVRvKCcubGFtcC13cmFwcGVyIC5sYW1wJywgMC41LCB7XG4gICAgICAgICAgICAgICAgeDogJzAlJyxcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICB4OiAnLTIzMCUnLFxuICAgICAgICAgICAgICAgIGVhc2U6IFF1YWQuZWFzZU91dCxcbiAgICAgICAgICAgICAgICBkZWxheTogMC4zLFxuICAgICAgICAgICAgICAgIG9uQ29tcGxldGU6IHR3ZWVuID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbGV0ICR0d2VlblRhcmdldCA9ICQodHdlZW4udGFyZ2V0KTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHR3ZWVuSXRlbUluZGV4ID0gJHR3ZWVuVGFyZ2V0LmluZGV4KCk7XG4gICAgICAgICAgICAgICAgICAgIGxldCB0d2Vlbkl0ZW1Db2xvciA9ICR0d2VlblRhcmdldC5jc3MoJ2JhY2tncm91bmQtY29sb3InKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHR3ZWVuSXRlbVpJbmRleCA9IFRXRUVOX0lURU1fTEVOR1RIIC0gdHdlZW5JdGVtSW5kZXg7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHR3ZWVuSXRlbUluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBUd2Vlbk1heC5mcm9tVG8oYC5kZWZlYXRDaXJjbGU6bnRoLWNoaWxkKCR7KHR3ZWVuSXRlbUluZGV4ICsgMSl9KWAsIDAuMiwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHpJbmRleDogdHdlZW5JdGVtWkluZGV4XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXV0b0FscGhhOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjYWxlOiAzICogdHdlZW5JdGVtSW5kZXgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiB0d2Vlbkl0ZW1Db2xvcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlYXNlOiBCb3VuY2UuZWFzZUluT3V0LFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBUd2Vlbk1heC50bygnLmRlZmVhdENpcmNsZTpudGgtY2hpbGQoMSknLCAwLjIsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdXRvQWxwaGE6IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiB0d2Vlbkl0ZW1Db2xvcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB6SW5kZXg6IHR3ZWVuSXRlbVpJbmRleCxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBvbkNvbXBsZXRlUGFyYW1zOiBbJ3tzZWxmfSddLFxuICAgICAgICAgICAgfSwgMC4wNSwgKCkgPT4ge1xuICAgICAgICAgICAgICAgIFR3ZWVuTWF4LmZyb21Ubyhjb3B5LCAwLjIsIHtcbiAgICAgICAgICAgICAgICAgICAgekluZGV4OiA2LFxuICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgYXV0b0FscGhhOiAxLFxuICAgICAgICAgICAgICAgICAgICBzY2FsZTogMTIsXG4gICAgICAgICAgICAgICAgICAgIGVhc2U6IEJvdW5jZS5lYXNlSW5PdXQsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICAvL3JlZ2lzdGVyIGV2ZW50c1xuICAgICAgICAkKCcuZGlmZmVyZW50LXdyYXBwZXIgLm92ZXJsYXknKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnN0ICR0aGlzID0gJCh0aGlzKTtcblxuICAgICAgICAgICAgVHdlZW5NYXguc3RhZ2dlckZyb21UbygnLmxhbXAtd3JhcHBlciAubGFtcCcsIDAuNSwge1xuICAgICAgICAgICAgICAgIHg6ICctMjMwJScsXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgeDogJzAlJyxcbiAgICAgICAgICAgICAgICBlYXNlOiBRdWFkLmVhc2VPdXQsXG4gICAgICAgICAgICAgICAgZGVsYXk6IDAuMyxcbiAgICAgICAgICAgIH0sIDAuMDUpO1xuXG4gICAgICAgICAgICBjb3VudERvd24yMCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGF1ZGlvc1swXS5wbGF5KCk7XG4gICAgICAgICAgICB9LCBDT1VOVF9ET1dOX0RJRkYpO1xuXG4gICAgICAgICAgICBjb3VudERvd25FbmQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICBmaW5kRW5kQW5pbWF0aW9uKCcuZGVmZWF0Q29weScpO1xuICAgICAgICAgICAgICAgIGZsYWdfcTJfZW5kID0gdHJ1ZTtcbiAgICAgICAgICAgIH0sIFRPVExFX1RJTUUpO1xuXG4gICAgICAgICAgICBUd2Vlbk1heC50bygkdGhpcywgMC41LCB7XG4gICAgICAgICAgICAgICAgYXV0b0FscGhhOiAwLFxuICAgICAgICAgICAgICAgIG9uQ29tcGxldGU6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgJHRoaXMuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBUd2Vlbk1heC50bygnLmxhbXAtd3JhcHBlcicsIDAuNSwge1xuICAgICAgICAgICAgICAgIGF1dG9BbHBoYTogMSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICAkKCcudGFyZ2V0LnByb2R1Y3QnKS5vbignY2xpY2snLCAnLnRhcmdldEl0ZW0nLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmIChmbGFnX3EyX2VuZCkgcmV0dXJuO1xuXG4gICAgICAgICAgICByZXNldFRhcmdldEF1ZGlvKGF1ZGlvc1syXSk7XG4gICAgICAgICAgICBhdWRpb3NbMl0ucGxheSgpO1xuICAgICAgICB9KS5vbignY2xpY2snLCAnLmhvdHNwb3QnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnN0ICR0aGlzID0gJCh0aGlzKTtcbiAgICAgICAgICAgIGlmIChmbGFnX3EyX2VuZCB8fCAkdGhpcy5oYXNDbGFzcygnYWN0aXZlJykpIHJldHVybjtcblxuICAgICAgICAgICAgJHRoaXMuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgJCgnLmxhbXAnKS5lcShsYW1wSW5kZXgpLmFkZENsYXNzKCdhY3RpdmUnKTtcblxuICAgICAgICAgICAgcmVzZXRUYXJnZXRBdWRpbyhhdWRpb3NbMV0pO1xuICAgICAgICAgICAgYXVkaW9zWzFdLnBsYXkoKTtcblxuICAgICAgICAgICAgaWYgKGxhbXBJbmRleCA9PSBUV0VFTl9JVEVNX0xFTkdUSCAtIDEpIHtcbiAgICAgICAgICAgICAgICBmbGFnX3EyX2VuZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgZmluZEVuZEFuaW1hdGlvbignLnZpY3RvcnlDb3B5Jyk7XG5cbiAgICAgICAgICAgICAgICBhdWRpb3NbM10ucGxheSgpO1xuXG4gICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KGNvdW50RG93bjIwKTtcbiAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQoY291bnREb3duRW5kKTtcblxuICAgICAgICAgICAgICAgIHJlc2V0VGFyZ2V0QXVkaW8oYXVkaW9zWzBdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgICsrbGFtcEluZGV4O1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBxdWVzdGlvbjMoKSB7XG4gICAgICAgICQoJy5jaXJjbGUtd3JhcHBlciBpbnB1dCcpLm9uKCdrZXlkb3duJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgaWYgKGUua2V5Q29kZSA9PSAnMTMnKSB7XG4gICAgICAgICAgICAgICAgJCgnLndyYXBwZXIuYWN0aXZlIC5zdWJtaXQnKS50cmlnZ2VyKCdjbGljaycpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyByZXNldCB0YXJnZXQgYXVkaW9cbiAgICBmdW5jdGlvbiByZXNldFRhcmdldEF1ZGlvKGF1ZGlvT2JqKSB7XG4gICAgICAgIGF1ZGlvT2JqLnBhdXNlKCk7XG4gICAgICAgIGF1ZGlvT2JqLmN1cnJlbnRUaW1lID0gMDtcbiAgICB9XG5cbiAgICAvLyByZXNldCBhdWRpb3MgYmVmb3JlIHN3YXAgcGFnZVxuICAgIGZ1bmN0aW9uIHJlc2V0QXVkaW8oKSB7XG4gICAgICAgIGZsYWdfcTJfZW5kID0gdHJ1ZTtcbiAgICAgICAgY2xlYXJUaW1lb3V0KGNvdW50RG93bjIwKTtcbiAgICAgICAgY2xlYXJUaW1lb3V0KGNvdW50RG93bkVuZCk7XG5cbiAgICAgICAgYXVkaW9zLmZvckVhY2goZnVuY3Rpb24oaXRlbSwgaSkge1xuICAgICAgICAgICAgcmVzZXRUYXJnZXRBdWRpbyhpdGVtKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc3VibWl0RXZlbnQoKSB7XG4gICAgICAgIGxldCAkc3VibWl0ID0gJCgnLmFjdGl2ZS53cmFwcGVyIC5zdWJtaXQnKTtcbiAgICAgICAgbGV0IGFuc3dlcnMgPSBbXTtcblxuICAgICAgICAkc3VibWl0Lm9uKCdtb3VzZWVudGVyIG1vdXNlbGVhdmUnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICRzdWJtaXQudG9nZ2xlQ2xhc3MoJ2hvdmVyJyk7XG4gICAgICAgIH0pLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgc3dpdGNoIChyb3V0SW5kZXgpIHtcbiAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHExQW5zd2VyID0gJCgndGV4dGFyZWEnKS52YWwoKS5yZXBsYWNlKC8gL2csICcnKTtcblxuICAgICAgICAgICAgICAgICAgICBhbnN3ZXJzLnB1c2gocTFBbnN3ZXIpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgICAgIHJlc2V0QXVkaW8oKTtcblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBxMkFuc3dlciA9ICQubWFrZUFycmF5KCQoJy5sYW1wLmFjdGl2ZScpKS5sZW5ndGg7XG5cbiAgICAgICAgICAgICAgICAgICAgYW5zd2Vycy5wdXNoKHEyQW5zd2VyKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgICAgICBjb25zdCBxM0Fuc3dlciA9ICQoJ2lucHV0JykudmFsKCkucmVwbGFjZSgvIC9nLCAnJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgYW5zd2Vycy5wdXNoKHEzQW5zd2VyKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2RlZmF1bHQnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gc2VuZCBhbnN3ZXJzXG4gICAgICAgICAgICAkLnBvc3QoUk9VVF9IUkVGWzRdLCB7XG4gICAgICAgICAgICAgICAgICAgIGFuc3dlcjogYW5zd2VycyxcbiAgICAgICAgICAgICAgICAgICAgcUluZGV4OiByb3V0SW5kZXgsXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuZG9uZShkYXRhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3N1Y2Nlc3NlZCcpO1xuICAgICAgICAgICAgICAgICAgICBsb2FkTmV4dFBhZ2UoKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5mYWlsKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2ZhaWxlZCcpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZXN1bHRBbmltYXRpb24oKSB7XG4gICAgICAgIGNvbnN0ICRyZXN1bHRUaXRsZSA9ICQoJy5yZXN1bHQgLnRpdGxlJykudGV4dGlsbGF0ZSh7XG4gICAgICAgICAgICBsb29wOiBmYWxzZSxcbiAgICAgICAgICAgIGluaXRpYWxEZWxheTogMCxcbiAgICAgICAgICAgIGluOiB7XG4gICAgICAgICAgICAgICAgZWZmZWN0OiAnZmFkZUluTGVmdCcsXG4gICAgICAgICAgICAgICAgc2h1ZmZsZTogdHJ1ZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHR5cGU6ICdjaGFyJyxcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0ICRyZXN1bHQgPSAkKCcucmVzdWx0IC5vcHRpb24nKS50ZXh0aWxsYXRlKHtcbiAgICAgICAgICAgIGxvb3A6IGZhbHNlLFxuICAgICAgICAgICAgaW5pdGlhbERlbGF5OiAwLFxuICAgICAgICAgICAgaW46IHtcbiAgICAgICAgICAgICAgICBlZmZlY3Q6ICdmYWRlSW5MZWZ0JyxcbiAgICAgICAgICAgICAgICBzaHVmZmxlOiB0cnVlXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdHlwZTogJ2NoYXInLFxuICAgICAgICB9KTtcblxuICAgICAgICAkKCcucmVzdWx0JykuY3NzKCdkaXNwbGF5JywgJ2Jsb2NrJyk7XG4gICAgICAgICRyZXN1bHRUaXRsZS50ZXh0aWxsYXRlKCdpbicpO1xuICAgICAgICAkcmVzdWx0LnRleHRpbGxhdGUoJ2luJyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVuZGVyVGVtcGxhdGUoZGF0YSkge1xuICAgICAgICBmZXRjaCgndGVtcGxhdGUvdGVtcGxhdGUuZWpzJylcbiAgICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UudGV4dCgpO1xuICAgICAgICAgICAgfSkudGhlbihib2R5ID0+IHtcbiAgICAgICAgICAgICAgICAvLyByZW5kZXIgdGhlIHRlbXBsYXRlXG4gICAgICAgICAgICAgICAgbGV0IGRvbVdyYXBwZXIgPSBlanMucmVuZGVyKGJvZHksIGRhdGEpO1xuXG4gICAgICAgICAgICAgICAgLy8gZXhjaGFuZ2UgYWN0aXZlL2luYWN0aXZlIGNsYXNzXG4gICAgICAgICAgICAgICAgJCgnLnByZXYsLnRlbXAnKS50b2dnbGVDbGFzcygnYWN0aXZlIGluYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgLy8gdXBkYXRlIHRoZSBkb21cbiAgICAgICAgICAgICAgICAkKCcud3JhcHBlci5hY3RpdmUnKS5odG1sKGRvbVdyYXBwZXIpO1xuICAgICAgICAgICAgICAgIC8vIHByZWxvYWQgaW1hZ2VzIG9mIHRoZSBuZXh0IHBhZ2VcbiAgICAgICAgICAgICAgICBwcmVsb2FkSW1ncyh7XG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdG9yOiAnLndyYXBwZXIuYWN0aXZlIC5wcmVsb2FkJyxcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHN3YXBQYWdlQW5pbWF0aW9uKCk7XG5cblxuICAgICAgICAgICAgICAgIC8vIHJlZ2lzdGVyIGVhY2ggcXVlc3Rpb24ncyBldmVudHNcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKHJvdXRJbmRleCkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgICAgICBxdWVzdGlvbjEoZGF0YS5jb25maWcuZGV0YWlsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgICAgICAgICBxdWVzdGlvbjIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgICAgICAgICBxdWVzdGlvbjMoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRBbmltYXRpb24oKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2RlZmF1bHQnKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBzdWJtaXRFdmVudCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbG9hZE5leHRQYWdlKCkge1xuICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgdHlwZTogJ1BPU1QnLFxuICAgICAgICAgICAgdXJsOiBST1VUX0hSRUZbcm91dEluZGV4XSxcbiAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgICAgICBzdWNjZXNzOiBkYXRhID0+IHtcbiAgICAgICAgICAgICAgICArK3JvdXRJbmRleDtcbiAgICAgICAgICAgICAgICByZW5kZXJUZW1wbGF0ZShkYXRhKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgICRjdGEub24oJ2NsaWNrJywgbG9hZE5leHRQYWdlKTtcbn07XG4iXX0=
