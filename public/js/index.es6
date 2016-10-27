window.startAd = () => {
    function preloadImgs(obj) {
        let def = {
            selector: '.preload',
            done: function() {}
        };
        let opts = $.extend({}, def, obj);
        let images = [];
        let imgLen, currentIndex = 0;
        let $preloadItem = $(opts.selector);

        imgLen = $preloadItem.length;
        $preloadItem.each((index, item) => {
            let $item = $(item);

            images[index] = new Image();
            images[index].addEventListener('load', function() {
                if (typeof($item.data('bg')) != 'undefined') {
                    $item.css('background-image', `url(${images[index].src})`);
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

    const ROUT_HREF = ['/q1', '/q2', '/q3', '/result', '/save'];
    const AUDIO_NAMES = ['countDownAudio', 'rightAudio', 'wrongAudio', 'victoryAudio'];

    let $window = $(window);
    let $cta = $('.cta');
    let routIndex = 0;
    let audios = [];
    let countDown20, countDownEnd;
    let flag_q2_end = false;
    const $welcome = $('.welcome').textillate({
        loop: false,
        initialDelay: 100,
        in: {
            effect: 'fadeInLeft',
            sync: false,
            reverse: false,
        },
        type: 'char',
    });

    $welcome.css('display', 'block').textillate('in');



    function swapPageAnimation() {
        let $navItem = $('.nav-wrapper div');
        let [flag_isPage1, flag_isPage4] = [routIndex == 1, routIndex == 4];

        if (flag_isPage4) {
            let $resultOverlay = $('.resultOverlay');
            let btnX = $resultOverlay.width();
            let btnY = $resultOverlay.height();
            let multipleX = $window.width() / btnX;
            let multipleY = $window.height() / btnY;

            TweenMax.to('.submit', 0.1, {
                autoAlpha: 0,
            });

            TweenMax.to($resultOverlay, 0.5, {
                autoAlpha: 1,
                scaleX: multipleX * 10,
                scaleY: multipleY * 10,
                delay: 0.1,
            });

            $('.prev .poster').css('background-color', 'rgba(255, 255, 255, 0.5)');
            $('.temp .container').addClass('blur');

            TweenMax.fromTo('.prev', 0.7, {
                x: '0%',
                zIndex: 2,
                autoAlpha: 0,
            }, {
                autoAlpha: 1,
                ease: Cubic.easeInOut,
                delay: 0.1,
                onComplete: () => {
                    $navItem.removeClass('active');
                    $navItem.eq(routIndex).addClass('active');
                },
            });
        } else {
            TweenMax.fromTo('.wrapper.inactive', 0.7, {
                x: '0%',
                y: '0%',
                zIndex: 2,
                autoAlpha: flag_isPage4 ? 0 : 1,
            }, {
                x: flag_isPage1 ? '0%' : '-100%',
                y: flag_isPage1 ? '-100%' : '0%',
                autoAlpha: 1,
                ease: Cubic.easeInOut,
                delay: 0.1,
            });
            TweenMax.fromTo('.wrapper.active', 0.7, {
                x: flag_isPage1 ? '0%' : '100%',
                y: flag_isPage1 ? '100%' : '0%',
            }, {
                x: '0%',
                y: '0%',
                ease: Cubic.easeInOut,
                delay: 0.1,
                onComplete: () => {
                    $('.wrapper.active').css('z-index', '1');
                    $navItem.removeClass('active');
                    $navItem.eq(routIndex).addClass('active');
                },
            });
        }
    }

    function question1(timeout) {
        const TIMEOUT_CARD = timeout.map(x => x.timeout * 1000);
        let flag_card_animationEnd = false;

        $('.card-wrapper').on('animationend', '.card:last', function() {
            flag_card_animationEnd = true;
        }).on('mouseenter', '.card', function() {
            const $item = $(this);
            const CARD_INDEX = $item.index();

            if (!flag_card_animationEnd) return;
            if ($item.attr('data-flag') == 'true') return;
            $item.addClass('hover');
            setTimeout(() => {
                $item.attr('data-flag', 'true');
                $item.removeClass('hover');
            }, TIMEOUT_CARD[CARD_INDEX]);
        });

        $('textarea.yourAnswer').on('keydown', function(e) {
            if (e.keyCode == '13') {
                $('.wrapper.active .submit').trigger('click');
            }
        });
    }

    function question2() {
        const TOTLE_TIME = 30000;
        const COUNT_DOWN_DIFF = TOTLE_TIME - 20000;

        // init audio
        initAudio();

        function initAudio() {
            AUDIO_NAMES.forEach((item, i) => {
                const audio = new Audio();

                audio.src = `../media/${item}.mp3`;
                audios.push(audio);
            });
        }



        let lampIndex = 0;
        let lampArray = $.makeArray($('.lamp'));
        const TWEEN_ITEM_LENGTH = lampArray.length;

        function findEndAnimation(copy) {
            $('.defeat-wrapper').css('display', 'block');
            TweenMax.staggerFromTo('.lamp-wrapper .lamp', 0.5, {
                x: '0%',
            }, {
                x: '-230%',
                ease: Quad.easeOut,
                delay: 0.3,
                onComplete: tween => {
                    let $tweenTarget = $(tween.target);
                    let tweenItemIndex = $tweenTarget.index();
                    let tweenItemColor = $tweenTarget.css('background-color');
                    let tweenItemZIndex = TWEEN_ITEM_LENGTH - tweenItemIndex;

                    if (tweenItemIndex) {
                        TweenMax.fromTo(`.defeatCircle:nth-child(${(tweenItemIndex + 1)})`, 0.2, {
                            zIndex: tweenItemZIndex
                        }, {
                            autoAlpha: 1,
                            scale: 3 * tweenItemIndex,
                            backgroundColor: tweenItemColor,
                            ease: Bounce.easeInOut,
                        });
                    } else {
                        TweenMax.to('.defeatCircle:nth-child(1)', 0.2, {
                            autoAlpha: 1,
                            backgroundColor: tweenItemColor,
                            zIndex: tweenItemZIndex,
                        });
                    }
                },
                onCompleteParams: ['{self}'],
            }, 0.05, () => {
                TweenMax.fromTo(copy, 0.2, {
                    zIndex: 6,
                }, {
                    autoAlpha: 1,
                    scale: 12,
                    ease: Bounce.easeInOut,
                });
            });
        }
        //register events
        $('.different-wrapper .overlay').on('click', function() {
            const $this = $(this);

            TweenMax.staggerFromTo('.lamp-wrapper .lamp', 0.5, {
                x: '-230%',
            }, {
                x: '0%',
                ease: Quad.easeOut,
                delay: 0.3,
            }, 0.05);

            countDown20 = setTimeout(() => {
                audios[0].play();
            }, COUNT_DOWN_DIFF);

            countDownEnd = setTimeout(() => {
                findEndAnimation('.defeatCopy');
                flag_q2_end = true;
            }, TOTLE_TIME);

            TweenMax.to($this, 0.5, {
                autoAlpha: 0,
                onComplete: () => {
                    $this.css('display', 'none');
                },
            });
            TweenMax.to('.lamp-wrapper', 0.5, {
                autoAlpha: 1,
            });
        });

        $('.target.product').on('click', '.targetItem', function() {
            if (flag_q2_end) return;

            resetTargetAudio(audios[2]);
            audios[2].play();
        }).on('click', '.hotspot', function() {
            const $this = $(this);
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

        audios.forEach(function(item, i) {
            resetTargetAudio(item);
        });
    }

    function submitEvent() {
        let $submit = $('.active.wrapper .submit');
        let answers = [];

        $submit.on('mouseenter mouseleave', function() {
            $submit.toggleClass('hover');
        }).on('click', function() {
            switch (routIndex) {
                case 1:
                    const q1Answer = $('textarea').val().replace(/ /g, '');

                    answers.push(q1Answer);
                    break;
                case 2:
                    resetAudio();

                    const q2Answer = $.makeArray($('.lamp.active')).length;

                    answers.push(q2Answer);
                    break;
                case 3:
                    const q3Answer = $('input').val().replace(/ /g, '');

                    answers.push(q3Answer);
                    break;
                default:
                    console.log('default');
            }

            // send answers
            $.post(ROUT_HREF[4], {
                    answer: answers,
                    qIndex: routIndex,
                })
                .done(data => {
                    console.log('successed');
                    loadNextPage();
                })
                .fail(() => {
                    console.log('failed');
                });
        });
    }

    function resultAnimation() {
        const $resultTitle = $('.result .title').textillate({
            loop: false,
            initialDelay: 0,
            in: {
                effect: 'fadeInLeft',
                shuffle: true
            },
            type: 'char',
        });
        const $result = $('.result .option').textillate({
            loop: false,
            initialDelay: 0,
            in: {
                effect: 'fadeInLeft',
                shuffle: true
            },
            type: 'char',
        });

        $('.result').css('display', 'block');
        $resultTitle.textillate('in');
        $result.textillate('in');
    }

    function renderTemplate(data) {
        fetch('template/template.ejs')
            .then(response => {
                return response.text();
            }).then(body => {
                // render the template
                let domWrapper = ejs.render(body, data);

                // exchange active/inactive class
                $('.prev,.temp').toggleClass('active inactive');
                // update the dom
                $('.wrapper.active').html(domWrapper);
                // preload images of the next page
                preloadImgs({
                    selector: '.wrapper.active .preload',
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
            success: data => {
                ++routIndex;
                renderTemplate(data);
            },
        });
    }

    $cta.on('click', loadNextPage);
};
