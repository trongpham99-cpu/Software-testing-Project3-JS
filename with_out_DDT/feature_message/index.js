const { Builder, By, Key, until } = require('selenium-webdriver');
const { writeLog, writeResult } = require('../../consts');
const path = require('path');

async function testSendMessage({
    tc_id,
    description,
    message,
    expected_result,
}) {
    let driver = await new Builder().forBrowser('chrome').build();

    try {
        await driver.get('https://school.moodledemo.net/login/index.php');

        const loginInput = await driver.findElement(By.id('username'));
        await loginInput.sendKeys('student');

        const passwordInput = await driver.findElement(By.id('password'));
        await passwordInput.sendKeys('moodle');

        const loginButton = await driver.findElement(By.id('loginbtn'));
        await loginButton.click();

        await driver.get('https://school.moodledemo.net/message/index.php');

        //click dropdown
        await driver.sleep(5000);
        const toggle_button = await driver.findElement(By.xpath('/html/body/div[2]/div[3]/div/div[2]/div/section/div/div/div/div/div[1]/div/div[2]/div[1]/div/div[1]/div[1]/button'));

        //check toggle is open or close
        const isToggleOpen = await toggle_button.getAttribute('aria-expanded');
        if (isToggleOpen === 'false') {
            await toggle_button.click();
        }

        //wait for dropdown
        await driver.wait(until.elementLocated(By.className('list-group')), 10000);

        //select user 
        await driver.sleep(5000);
        const userMessage = await driver.findElement(By.xpath('/html/body/div[2]/div[3]/div/div[2]/div/section/div/div/div/div/div[1]/div/div[2]/div[1]/div/div[1]/div[2]/div[2]/a'));
        await userMessage.click();

        //wait for message page
        await driver.sleep(5000);
        const messageInput = await driver.findElement(By.xpath('/html/body/div[2]/div[3]/div/div[2]/div/section/div/div/div/div/div[2]/div[3]/div/div[1]/div[2]/textarea'))
        await messageInput.sendKeys(message);

        //send message
        const btnSend = await driver.findElement(By.xpath('/html/body/div[2]/div[3]/div/div[2]/div/section/div/div/div/div/div[2]/div[3]/div/div[1]/div[2]/div/button[2]'));
        await btnSend.click();

        //get list message 
        await driver.sleep(5000);
        const listMessageEl = await driver.findElement(By.xpath('/html/body/div[2]/div[3]/div/div[2]/div/section/div/div/div/div/div[2]/div[2]/div[3]/div/div[1]/div[5]/div'))

        //print text int list message
        const listMessage = await listMessageEl.getText()

        let result = ""
        //check if message is sent
        if (listMessage.includes(message)) {
            result = 'Message sent';
        } else {
            result = 'Message not sent';
        }

        //sleep
        await driver.sleep(5000);

        //write log to file xlxs
        const log = {
            id: tc_id,
            description: description,
            message: message,
            expected_result: expected_result,
            actual_result: result,
            status: result === expected_result ? 'Pass' : 'Fail'
        }

        const logPath = path.join(__dirname, 'log.xlsx');
        writeLog(log, logPath);
    }
    catch (error) {
        console.error(error);
    }
    finally {
        await driver.quit();
    }
}

testSendMessage({ tc_id: 'tc_01', description: 'Send message', message: 'Hello, this is a test message', expected_result: 'Message sent' });