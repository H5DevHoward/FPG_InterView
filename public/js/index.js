function startAd() {
    function preloadImgs(obj) {
        var def = {
            selector: '.preload',
            done: function(){}
        };

        var opts = $.extend({}, def, obj);

        var images = [];
        var imgLen, currentIndex = 0;
        var $preloadItem = $(opts.selector);
        imgLen = $preloadItem.length;
        $preloadItem.each(function(index, item) {
            var $item = $(item);
            images[index] = new Image();
            images[index].addEventListener('load', function() {
                if(typeof($item.data('bg')) != 'undefined') {
                    $item.css('background-image', 'url('+images[index].src+')');
                }else {
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

    var $window = $(window);
    var $cta = $('.cta');
    var routIndex = 0;
    var routHref = ['/q1', '/q2', '/q3', '/result', '/save'];
    var audioNames = ['countDownAudio', 'rightAudio', 'wrongAudio', 'victoryAudio'];
    var audios = [];
    var countDown20,countDownEnd;
    var flag_q2_end = false;

    var $welcome = $('.welcome').textillate({
        loop: false,
        initialDelay: 100,
        in: {
            effect: 'fadeInLeft',
            sync: false,
            reverse: false
        },
        type: 'char',
    });

    $welcome.css('display', 'block').textillate('in');



    function swapPageAnimation() {
        var $navItem = $('.nav-wrapper div');
        var flag_isPage1 = (routIndex == 1);
        var flag_isPage4 = (routIndex == 4);

        if(flag_isPage4) {
            TweenMax.to('.submit', 0.1, {
                autoAlpha: 0
            });
            var $resultOverlay = $('.resultOverlay');
            var btnX = $resultOverlay.width();
            var btnY = $resultOverlay.height();
            var multipleX = $window.width() / btnX;
            var multipleY = $window.height() / btnY;

            TweenMax.to($resultOverlay, 0.5, {
                autoAlpha: 1,
                scaleX: multipleX*10,
                scaleY: multipleY*10,
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
                onComplete: function(){
                    $navItem.removeClass('active');
                    $navItem.eq(routIndex).addClass('active');
                }
            });
        }else {
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
                onComplete: function(){
                    $('.wrapper.active').css('z-index', '1');
                    $navItem.removeClass('active');
                    $navItem.eq(routIndex).addClass('active');
                }
            });
        }
    }

    function question1(timeout) {
        var timeout_card = [timeout[0].timeout*1000, timeout[1].timeout*1000, timeout[2].timeout*1000];

        var flag_card_animationEnd = false;
        $('.card-wrapper').on('animationend', '.card:last', function(){
            flag_card_animationEnd = true;
        }).on('mouseenter', '.card', function(){
            var $item = $(this);
            var cardIndex = $item.index();

            if(!flag_card_animationEnd) return;
            if($item.attr('data-flag') == 'true') return;
            $item.addClass('hover');
            setTimeout(function(){
                $item.attr('data-flag', 'true');
                $item.removeClass('hover');
            }, timeout_card[cardIndex]);
        });

        $('textarea.yourAnswer').on('keydown', function(e) {
            if (e.keyCode == '13') {
                $('.wrapper.active .submit').trigger('click');
            }
        });
    }

    function question2() {
        var totleTime = 30000;
        var countDownDiff = totleTime-20000;

        // init audio
        initAudio();
        function initAudio() {
            audioNames.forEach(function(item, i){
                var audio = new Audio();
                audio.src = '../media/'+item+'.mp3';
                audios.push(audio);
            });
        }

        var lampIndex = 0;
        var lampArray = $.makeArray($('.lamp'));
        var tweenItemLen = lampArray.length;
        function findEndAnimation(copy) {
            $('.defeat-wrapper').css('display', 'block');
            TweenMax.staggerFromTo('.lamp-wrapper .lamp' , 0.5, {
                x: '0%',
            } , {
                x: '-230%',
                ease: Quad.easeOut,
                delay: 0.3,
                onComplete: function(tween){
                    var $tweenTarget = $(tween.target);
                    var tweenItemIndex = $tweenTarget.index();
                    if(tweenItemIndex) {
                        TweenMax.fromTo('.defeatCircle:nth-child('+(tweenItemIndex+1)+')', 0.2, {
                            zIndex: tweenItemLen-tweenItemIndex
                        }, {
                            autoAlpha: 1,
                            scale: 3*tweenItemIndex,
                            backgroundColor: $tweenTarget.css('background-color'),
                            ease: Bounce.easeInOut
                        });
                    }else {
                        TweenMax.to('.defeatCircle:nth-child(1)', 0.2, {
                            autoAlpha: 1,
                            backgroundColor: $tweenTarget.css('background-color'),
                            zIndex: tweenItemLen-tweenItemIndex
                        });
                    }
                },
                onCompleteParams:['{self}']
            } , 0.05, function(){
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
        $('.different-wrapper .overlay').on('click', function(){
            var $this = $(this);
            TweenMax.staggerFromTo('.lamp-wrapper .lamp' , 0.5, {
                x: '-230%',
            } , {
                x: '0%',
                ease: Quad.easeOut,
                delay: 0.3
            } , 0.05);

            countDown20 = setTimeout(function(){
                audios[0].play();
            }, countDownDiff);

            countDownEnd = setTimeout(function(){
                findEndAnimation('.defeatCopy');
                flag_q2_end = true;
            }, totleTime);

            TweenMax.to($this, 0.5, {
                autoAlpha: 0,
                onComplete: function(){
                    $this.css('display', 'none');
                }
            });
            TweenMax.to('.lamp-wrapper', 0.5, {
                autoAlpha: 1
            });
        });

        $('.target.product').on('click', '.targetItem', function(){
            if(flag_q2_end) return;

            resetTargetAudio(audios[2]);
            audios[2].play();
        }).on('click', '.hotspot', function(){
            if(flag_q2_end || $(this).hasClass('active')) return;

            $(this).addClass('active');
            $('.lamp').eq(lampIndex).addClass('active');

            resetTargetAudio(audios[1]);
            audios[1].play();

            if(lampIndex == lampArray.length-1) {
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
        $('.circle-wrapper input').on('keydown', function(e) {
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

        audios.forEach(function(item, i){
            resetTargetAudio(item);
        });
    }

    function submitEvent() {
        var $submit = $('.active.wrapper .submit');
        var answers = [];
        $submit.on('mouseenter mouseleave', function(){
            $submit.toggleClass('hover');
        }).on('click', function(){
            switch(routIndex) {
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
            $.post(
                routHref[4], {
                    answer: answers,
                    qIndex: routIndex
                }
            )
            .done(function(data) {
                console.log('successed');
                loadNextPage();
            })
            .fail(function() {
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
        fetch('template/template.ejs')
            .then(function(response) {
                return response.text();
            }).then(function(body) {
                // render the template
                var domWrapper = ejs.render(body, data);

                // exchange active/inactive class
                $('.prev,.temp').toggleClass('active inactive');
                // update the dom
                $('.wrapper.active').html(domWrapper);
                // preload images of the next page
                preloadImgs({selector: '.wrapper.active .preload'});

                swapPageAnimation();


                // register each question's events
                switch(routIndex) {
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
            url: routHref[routIndex],
            dataType: 'json',
            success: function(data){
                ++routIndex;
                renderTemplate(data);
            }
        });
    }

    $cta.on('click', loadNextPage);
}
