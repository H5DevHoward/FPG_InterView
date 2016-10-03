'use strict';

const app = require('koa')();
const serve = require('koa-static');
const path = require('path');
const onerror = require('koa-onerror');
const render = require('koa-ejs');
const router = require('koa-router')();
const koaBody = require('koa-body')();
const logger = require('koa-logger');

const CONFIG = [
    {
        question: '1.Try to remember the numbers (hover to see)',
        detail: [
            {
                title: 'Only one chance',
                content: '3.14159 26535 89793 23846',
                timeout: 5
            },
            {
                title: 'Only one chance',
                content: '3.14159 26535 89793 23846 26433 83279',
                timeout: 4
            },
            {
                title: 'Only one chance',
                content: '3.14159 26535 89793 23846 26433 83279 50288',
                timeout: 3
            }
        ],
        key: '3.14159 26535 89793 23846 26433 83279 50288 41971 69399 37510 58209 74944 59230 78164',
        percent: 0.4
    }, {
        question: '2.Try to find all the difference between the two pictures in 30s',
        detail: ['img/product2_1.jpg', 'img/product2_2.jpg'],
        key: 5,
        percent: 0.3
    }, {
        question: '3.Try to guess the answer',
        detail: [
            {
                circle: ['#000', '#000', '#000', '#000', '#000'],
                answer: '1'
            },
            {
                circle: ['#000', '#000', '#000', '#000', '#fff'],
                answer: '2'
            },
            {
                circle: ['#000', '#000', '#000', '#fff', '#000'],
                answer: '3'
            },
            {
                circle: ['#000', '#000', '#000', '#fff', '#fff'],
                answer: '4'
            },
            {
                circle: ['#000', '#000', '#fff', '#000', '#000'],
                answer: '5'
            },
            {
                circle: ['#000', '#000', '#fff', '#000', '#fff'],
                answer: '6'
            },
            {
                circle: ['#000', '#fff', '#000', '#000', '#fff'],
                answer: '?'
            }
        ],
        key: 10,
        percent: 0.3
    }
];

const otherAccess = [
    {
        qIndex: 0,
        poster: 'img/p1.jpeg'
    },
    {
        qIndex: 1,
        poster: 'img/p2.jpeg'
    },
    {
        qIndex: 2,
        poster: 'img/p3.jpeg'
    },
    {
        qIndex: 3,
        poster: 'img/p4.jpeg'
    },
    {
        qIndex: 4,
        poster: 'img/blur.svg'
    }
];

const qAnswer = new Map();
const scores = new Map();


app.use(serve(path.join(__dirname, 'public')));
app.use(logger());

render(app, {
    root: path.join(__dirname, 'views'),
    layout: '__layout',
    viewExt: 'ejs',
    cache: false,
    debug: true
});


router
    .get('/', function*(next) {
        yield this.render('home', {
            otherAccess: otherAccess[0],
            layout: '__layout'
        });
    })
    .post('/q1', koaBody, function*(next) {
        this.body = {
            config: CONFIG[0],
            otherAccess: otherAccess[1]
        };
        yield next;
    })
    .post('/q2', koaBody, function*(next) {
        this.body = {
            config: CONFIG[1],
            otherAccess: otherAccess[2]
        };
        yield next;
    })
    .post('/q3', koaBody, function*(next) {
        this.body = {
            config: CONFIG[2],
            otherAccess: otherAccess[3]
        };
        yield next;
    })
    .post('/save', koaBody, function*(next){
        let params = this.request.body;
        qAnswer.set(params.qIndex, params.answer);

        switch(params.qIndex) {
            case '1':
                scores.set('1', question1Method(qAnswer.get('1')));
                break;
            case '2':
                scores.set('2', question2Method(qAnswer.get('2')));
                break;
            case '3':
                scores.set('3', question3Method(qAnswer.get('3')));
                break;
            default:
                console.log('default');
        }

        this.body = {
            answer: scores,
            layout: false
        };
        yield next;
    })
    .post('/result', koaBody, function*(next) {
        let result = [];
        let sum = 0;
        for(const [key, value] of scores) {
            sum += value;
            result.push(value);
        }
        result.push(sum);

        this.body = {
            scrore: result,
            otherAccess: otherAccess[4]
        };
        yield next;
    });


app.use(router.routes());

onerror(app);

app.listen(3123);
console.log('listening on port 3123');



function question1Method(arr) {
    let key = CONFIG[0].key.replace(/ /ig, '');
    let keyLen = key.length;
    let input = arr[0];
    let inputLen = input.length;
    if(!inputLen) return 0;
    let len = Math.min(keyLen, input.length);
    let i = 0;
    for(; i < len; ++i) {
        if(key[i] != input[i]) {
          break;
        }
    }
    return Math.round(100 / keyLen * i * CONFIG[0].percent);
}

function question2Method(arr) {
    return Math.round(100 / 5 * arr[0] * CONFIG[1].percent);
}

function question3Method(arr) {
    return arr[0] == CONFIG[2].key ? 30 : 0;
}
