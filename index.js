const puppeteer = require('puppeteer');
const twilio = require('twilio');
const CREDS = require('./creds');
const client = require('twilio')(CREDS.sid, CREDS.token);

async function run() {
    const browser = await puppeteer.launch({
        headless: false,
    });
    const page = await browser.newPage();

    await page.goto('https://gmail.com');

    await page.click('#identifierId');
    await page.keyboard.type(CREDS.username);
    await page.click('#identifierNext');

    // await page.waitForSelector('#password > div.aCsJod.oJeWuf > div > div.Xb9hP > input');
    await page.waitFor(1000);
    await page.keyboard.type(CREDS.password);
    await page.click('#passwordNext');

    await page.waitForSelector('#\\3a 2 > div > div > div.aKh > table > tbody > tr.aAA.J-KU-Jg.J-KU-Jg-K9 > td:nth-child(1)');
    await page.click('#\\3a 2 > div > div > div.aKh > table > tbody > tr.aAA.J-KU-Jg.J-KU-Jg-K9 > td:nth-child(1)');

    const listOfEMails = [];
    await setInterval(async () => {
        const newEmail = await page.evaluate(() => {
            const ids = [];
            const elements = document.getElementsByClassName('zA zE');

            for (var element of elements) {
                if (elements !== undefined) {
                    ids.push(element.id);
                }
            }

            return ids;
        });

        if (newEmail.length > 0) {
            let sendSMS = false;
            for (var id of newEmail) {
                if (!listOfEMails.includes(id)) {
                    listOfEMails.push(id);
                    sendSMS = true;
                }
            }

            if (sendSMS) {
                client.messages
                    .create({
                        body: 'newemail',
                        from: '+12566335665',
                        to: '+639062131205'
                    })
                    .then(message => console.log(message.sid))
                    .done();
            }
        }
    }, 6000);

    // browser.close();
}

run();
