
require('dotenv').config()
const https = require('https');
const express = require('express');
const LINE = require('@line/bot-sdk');
const app = express();
const PORT = process.env.PORT || 3000;

const config = {
    channelAccessToken: process.env['CHANNEL_ACCESS_TOKEN'],
    channelSecret: process.env['CHANNEL_SECRET']
}
const client = new LINE.Client(config);

// app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.sendStatus(200);
});

app.post('/callback', LINE.middleware(config), async (req, res) => {
    try {
        console.log('L25', req.body)

        await Promise.all(req.body.events.map(async (event) => {
            if (event.type === 'follow') console.log('加入好友')
            if (event.type === 'unfollow') console.log('被封鎖')

            if (event.type == 'message') {
                let text = event.message.text
                switch (text) {
                    case 'ok':
                        a = [{
                            type: 'text',
                            text: 'ok?'
                        }, {
                            type: 'text',
                            text: '那就好啊！'
                        }]
                        break;

                    case '測試1':
                        messageData = [{
                            type: 'flex',
                            altText: '回應',
                            contents: {
                                type: 'carousel',
                                contents: Array.from({ length: 10 }).map((v, idx) => {
                                    return {
                                        type: 'bubble',
                                        size: 'kilo',
                                        header: {
                                            type: 'box',
                                            layout: 'vertical',
                                            contents: [
                                                {
                                                    type: 'text',
                                                    text: `${idx}`,
                                                    color: '#ffffff',
                                                    align: 'start',
                                                    size: 'xxl',
                                                    gravity: 'center',
                                                    wrap: true,
                                                    maxLines: 2,
                                                    adjustMode: 'shrink-to-fit'
                                                }
                                            ],
                                            backgroundColor: '#1E1E7D',
                                            width: '100%',
                                            height: '180px',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            backgroundColor: '#1E1E7D'
                                        },
                                        body: {
                                            type: 'box',
                                            layout: 'vertical',
                                            contents: [
                                                {
                                                    type: 'text',
                                                    text: '發生什麼事',
                                                    weight: 'bold',
                                                    size: 'lg',
                                                    wrap: true,
                                                },
                                                {
                                                    type: 'box',
                                                    layout: 'vertical',
                                                    margin: 'md',
                                                    contents: [
                                                        {
                                                            type: 'text',
                                                            text: `${idx} 數字是數學的基礎，從幾何到統計學，無處不在。它們可以代表量、時間、金錢和更多。`,
                                                            size: 'md',
                                                            wrap: true
                                                        }
                                                    ]
                                                },
                                            ],
                                            spacing: 'sm',
                                            paddingAll: '13px',
                                            paddingBottom: '0px',
                                        },
                                        footer: {
                                            type: 'box',
                                            layout: 'vertical',
                                            contents: [
                                                {
                                                    type: 'separator',
                                                },
                                                {
                                                    type: 'button',
                                                    action: {
                                                        type: 'uri',
                                                        label: '查看Google',
                                                        uri: `https://fakeimg.pl/350x200/ff0000/000?text=Hello%20The%20${idx}`,
                                                    },
                                                    margin: 'xs',
                                                },
                                            ],
                                        },
                                    }
                                })
                            }
                        }, {
                            type: 'text',
                            text: '下一頁',
                            quickReply: {
                                items: [
                                    {
                                        type: 'action',
                                        action: {
                                            type: 'postback',
                                            label: '下方的小框框',
                                            data: 'action=url&item=under',
                                            text: '下方的小框框'
                                        }
                                    },
                                ]
                            }
                        }];
                        break;
                    case '測試2':
                        messageData = {
                            type: 'text',
                            text: `確認是否關注我`,
                            quickReply: {
                                items: [
                                    {
                                        type: 'action',
                                        action: {
                                            type: 'postback',
                                            label: '關注',
                                            // text: `關注 ${paramsData.fundName}`,
                                            data: `eventType=followFundViewConfirm&userId=${event.source.userId}&fundId=&fundName=`
                                        }
                                    },
                                    {
                                        type: 'action',
                                        action: {
                                            type: 'postback',
                                            label: '不關注',
                                            // text: `不關注 ${paramsData.fundName}`,
                                            data: `eventType=followFundViewReject&userId=${event.source.userId}&fundId=&fundName=`
                                        }
                                    }
                                ]
                            },
                        }
                        break;
                    case '測試3':
                        messageData = {
                            type: 'text',
                            text: '給你看看',
                            quickReply: {
                                items: [
                                    {
                                        type: 'action',
                                        action: {
                                            type: 'message',
                                            label: '收到用戶內容',
                                            text: '收到用戶內容'
                                        }
                                    },
                                    {
                                        type: 'action',
                                        action: {
                                            type: 'camera',
                                            label: '開啟相機'
                                        }
                                    },
                                    {
                                        type: 'action',
                                        action: {
                                            type: 'cameraRoll',
                                            label: '開啟相簿'
                                        }
                                    },
                                    {
                                        type: 'action',
                                        action: {
                                            type: 'location',
                                            label: '傳送位置'
                                        }
                                    }
                                ]
                            }
                        }
                        break;
                    default:
                        messageData = [{
                            type: 'text',
                            text: '你是不是在...'
                        }, {
                            type: 'text',
                            text: '不要亂！'
                        }]
                        break;
                }

                return client.replyMessage(event.replyToken, messageData)
            }

            if (event.type == 'postback') {
                let messageData = {}
                if (event.postback.data.indexOf('followFundViewConfirm')) {
                    messageData = {
                        type: 'imagemap',
                        baseUrl: 'https://github.com/line/line-bot-sdk-nodejs/raw/master/examples/kitchensink/static/rich',
                        altText: 'Imagemap alt text',
                        baseSize: { width: 1040, height: 1040 },
                        actions: [
                            { area: { x: 0, y: 0, width: 520, height: 520 }, type: 'uri', linkUri: 'https://store.line.me/family/manga/en' },
                            { area: { x: 520, y: 0, width: 520, height: 520 }, type: 'uri', linkUri: 'https://store.line.me/family/music/en' },
                            { area: { x: 0, y: 520, width: 520, height: 520 }, type: 'uri', linkUri: 'https://store.line.me/family/play/en' },
                            { area: { x: 520, y: 520, width: 520, height: 520 }, type: 'message', text: 'URANAI!' },
                        ],
                        video: {
                            originalContentUrl: 'https://github.com/line/line-bot-sdk-nodejs/raw/master/examples/kitchensink/static/imagemap/video.mp4',
                            previewImageUrl: 'https://github.com/line/line-bot-sdk-nodejs/raw/master/examples/kitchensink/static/imagemap/preview.jpg',
                            area: {
                                x: 280,
                                y: 385,
                                width: 480,
                                height: 270,
                            },
                            externalLink: {
                                linkUri: 'https://line.me',
                                label: 'LINE'
                            }
                        },
                    }
                }

                if (event.postback.data.indexOf('followFundViewReject')) {
                    messageData = {
                        type: 'text',
                        text: `不要就算了～`
                    }
                }

                return client.replyMessage(event.replyToken, messageData);
            }
        }))

        return res.json({})
    } catch (error) {
        console.error(error);
        return res.status(500).end();
    }
});


app.get('/push/message', async (req, res) => {
    try {
        const messageInfo = require('./template/message.json')
        const message = {
            "type": "flex",
            "altText": "測試",
            "contents": messageInfo
        };

        const client = new LINE.Client(config);
        const result = await client.pushMessage(process.env['USER_ID'], message)
        console.log('L293', result)

        return res.send('ok')
    } catch (error) {
        console.error(error)
        res.status(500).end();
    }
})

// app.post('/webhook', function (req, res) {
//     res.send('HTTP POST request sent to the webhook URL!');
//     // If the user sends a message to your bot, send a reply message
//     if (req.body.events[0].type === 'message') {
//         // Message data, must be stringified
//         const dataString = JSON.stringify({
//             replyToken: req.body.events[0].replyToken,
//             messages: [
//                 {
//                     type: 'text',
//                     text: 'Hello, user',
//                 },
//                 {
//                     type: 'text',
//                     text: 'May I help you?',
//                 },
//             ],
//         });

//         // Request header
//         const headers = {
//             'Content-Type': 'application/json',
//             Authorization: 'Bearer ' + TOKEN,
//         };

//         // Options to pass into the request
//         const webhookOptions = {
//             hostname: 'api.line.me',
//             path: '/v2/bot/message/reply',
//             method: 'POST',
//             headers: headers,
//             body: dataString,
//         };

//         // Define request
//         const request = https.request(webhookOptions, (res) => {
//             res.on('data', (d) => {
//                 process.stdout.write(d);
//             });
//         });

//         // Handle error
//         request.on('error', (err) => {
//             console.error(err);
//         });

//         // Send data
//         request.write(dataString);
//         request.end();
//     }
// });

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
});
