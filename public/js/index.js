function startAd() {
    var week = '今天星期:' + '日一二三四五六'.charAt(new Date().getDay());
    console.log(week);

    var HW_CM = {};

    selector = HW_CM.selector = '.preload';
    done = HW_CM.done = function(){
        console.log('preloadImgs completed');
    };

    HW_CM.preloadImgs = function(selector, done) {
        var images = new Array();
        var imgLen, currentIndex = 0;
        imgLen = $(selector).length;
        $(selector).each(function(index, item) {
            images[index] = new Image();
            images[index].addEventListener('load', function() {
                if(typeof($(item).attr('data-bg')) != 'undefined') {
                    $(item).css({
                        'background-image': 'url('+images[index].src+')',
                        'background-position': 'center',
                        'background-repeat': 'no-repeat',
                        'background-size': 'cover'
                    });
                }else {
                    $(item).append('<img src="'+images[index].src+'">');
                }
                if (++currentIndex == imgLen) {
                    done();
                }
            });
            images[index].src = $(item).data('source');
        });
    }
    HW_CM.preloadImgs(selector, done);


    var $welcome = $('.welcome').textillate({
        loop: false,
        initialDelay: 100,
        in: {
            effect: 'fadeInLeft',
            sync: false,
            reverse: false,
            callback: function () {},
        },
        type: 'char',
    });
    $welcome.css('display', 'block').textillate('in');

    var routIndex = 0;
    var routHref = [
        '/q1',
        '/q2',
        '/q3',
        '/result',
        '/save'
    ];

    function swapPageAnimation() {
        if(routIndex == 4) {
            TweenMax.to('.submit', .1, {
                autoAlpha: 0
            });
            TweenMax.to('.resultOverlay', .5, {
                autoAlpha: 1,
                scaleX: 20,
                scaleY: 40,
                delay: 0.1
            });

            $('.prev .poster').css('background-color', 'rgba(255, 255, 255, 0.5)');
            $('.temp .container').addClass('blur');

            TweenMax.fromTo('.prev', .7, {
                x: '0%',
                y: '0%',
                autoAlpha: 0,
                zIndex: 2
            }, {
                autoAlpha: 1,
                x: '0%',
                y: '0%',
                ease: Cubic.easeInOut,
                delay: 0.1,
                onComplete: function(){
                    $('.nav-wrapper	div').removeClass('active');
                    $('.nav-wrapper	div').eq(routIndex).addClass('active');
                }
            });
        }else {
            TweenMax.fromTo('.wrapper.inactive', .7, {
                x: '0%',
                y: '0%',
                autoAlpha: routIndex == 4 ? 0 : 1,
                zIndex: 2
            }, {
                x: routIndex == 1 ? '0%' : ('-100%'),
                y: routIndex == 1 ? '-100%' : ('0%'),
                autoAlpha: 1,
                ease: Cubic.easeInOut,
                delay: 0.1
            });
            TweenMax.fromTo('.wrapper.active', .7, {
                x: routIndex == 1 ? '0%' : ('100%'),
                y: routIndex == 1 ? '100%' : ('0%')
            }, {
                x: '0%',
                y: '0%',
                ease: Cubic.easeInOut,
                zIndex: 1,
                delay: 0.1,
                onComplete: function(){
                    $('.nav-wrapper	div').removeClass('active');
                    $('.nav-wrapper	div').eq(routIndex).addClass('active');
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
                $item.attr('data-flag', 'true')
                $item.removeClass('hover');
            }, timeout_card[cardIndex]);
        });

        $('textarea.yourAnswer').keydown(function(e) {
            if (e.keyCode == '13') {
                $('.wrapper.active .submit').trigger('click');
            }
        });
    }

    var countDownAudio,rightAudio,wrongAudio,victoryAudio;
    var countDown20,countDownEnd;
    var flag_q2_end = false;
    function question2() {
        var totleTime = 30000;

        // init audio
        initAudio();
        function initAudio() {
            rightAudio = new Audio();
            rightAudio.src = '../media/right.mp3';

            wrongAudio = new Audio();
            wrongAudio.src = '../media/wrong.mp3';

            countDownAudio = new Audio();
            countDownAudio.src = '../media/countDown.mp3';

            victoryAudio = new Audio();
            victoryAudio.src = '../media/victory.mp3';
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
                    var tweenItemIndex = $(tween.target).index();
                    if(tweenItemIndex) {
                        TweenMax.fromTo('.defeatCircle:nth-child('+(tweenItemIndex+1)+')', .2, {
                            zIndex: tweenItemLen-tweenItemIndex
                        }, {
                            autoAlpha: 1,
                            scale: 3*tweenItemIndex,
                            backgroundColor: $(tween.target).css('background-color'),
                            ease: Bounce.easeInOut
                        });
                    }else {
                        TweenMax.to('.defeatCircle:nth-child(1)', .2, {
                            autoAlpha: 1,
                            backgroundColor: $(tween.target).css('background-color'),
                            zIndex: tweenItemLen-tweenItemIndex
                        });
                    }
                },
                onCompleteParams:["{self}"]
            } , 0.05, function(){
                TweenMax.to(copy, .2, {
                    autoAlpha: 1,
                    scale: 12,
                    ease: Bounce.easeInOut
                });
            });
        }
        //register events
        $('.different-wrapper .overlay').on('click', function(){
            TweenMax.staggerFromTo('.lamp-wrapper .lamp' , 0.5, {
                x: '-230%',
            } , {
                x: '0%',
                ease: Quad.easeOut,
                delay: 0.3
            } , 0.05);


            countDown20 = setTimeout(function(){
                countDownAudio.play();
            }, totleTime-20000);

            countDownEnd = setTimeout(function(){
                findEndAnimation('.defeatCopy');
                flag_q2_end = true;
            }, totleTime);

            TweenMax.to(this, .5, {
                autoAlpha: 0,
                display: 'none'
            });
            TweenMax.to('.lamp-wrapper', .5, {
                autoAlpha: 1
            });
        });

        $('.target.product').on('click', '.targetItem', function(){
            if(flag_q2_end) return;

            wrongAudio.pause();
            wrongAudio.currentTime = 0;
            wrongAudio.play();
        }).on('click', '.hotspot', function(){
            if(flag_q2_end || $(this).hasClass('active')) return;

            $(this).addClass('active');
            $('.lamp').eq(lampIndex).addClass('active');

            rightAudio.pause();
            rightAudio.currentTime = 0;
            rightAudio.play();

            if(lampIndex == lampArray.length-1) {
                flag_q2_end = true;
                console.log('victory');
                findEndAnimation('.victoryCopy');

                victoryAudio.play();

                clearTimeout(countDown20);
                clearTimeout(countDownEnd);
                countDownAudio.pause();
                countDownAudio.currentTime = 0;
            }
            ++lampIndex;
        });
    }

    function question3() {
        $('.circle-wrapper input').keydown(function(e) {
            if (e.keyCode == '13') {
                $('.wrapper.active .submit').trigger('click');
            }
        });
    }

    // reset the audios before next step
    function resetAudio() {
        flag_q2_end = true;
        clearTimeout(countDown20);
        clearTimeout(countDownEnd);

        rightAudio.pause();
        rightAudio.currentTime = 0;
        countDownAudio.pause();
        countDownAudio.currentTime = 0;
        wrongAudio.pause();
        wrongAudio.currentTime = 0;
        victoryAudio.pause();
        victoryAudio.currentTime = 0;
    }

    function submitEvent() {
        var $submit = $('.active.wrapper .submit');
        var answers = [];
        $submit.on('mouseenter', function(){
            $submit.addClass('hover');
        }).on('mouseleave', function(){
            $submit.removeClass('hover');
        }).on('click', function(){
            switch(routIndex) {
                case 1:
                    var q1Answer = $('textarea').val().replace(/ /g, '');
                    // if(q1Answer.length < 1) return;
                    answers.push(q1Answer);
                    // console.log(q1Answer);
                    break;
                case 2:
                    resetAudio();

                    var q2Answer = $.makeArray($('.lamp.active')).length;
                    answers.push(q2Answer);
                    // console.log(q2Answer);
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
                sync: false,
                reverse: false,
                shuffle: true,
                callback: function () {},
            },
            type: 'char'
        });
        var $result = $('.result .option').textillate({
            loop: false,
            initialDelay: 0,
            in: {
                effect: 'fadeInLeft',
                sync: false,
                reverse: false,
                shuffle: true,
                callback: function () {},
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
                HW_CM.preloadImgs('.wrapper.active .preload', done);

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
            })
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

    var $cta = $('.cta');
    $cta.on('click', function(){
        loadNextPage();
    });
}
