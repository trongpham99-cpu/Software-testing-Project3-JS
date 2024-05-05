const { Builder, By, Key, until } = require('selenium-webdriver');
const { writeLog, writeResult } = require('../../consts');
const path = require('path');

async function testLogin({
    tc_id,
    description,
    username,
    password,
    expected_result,
}) {
    let driver = await new Builder().forBrowser('chrome').build();

    try {
        await driver.get('https://school.moodledemo.net/login/index.php');

        const loginInput = await driver.findElement(By.id('username'));
        await loginInput.sendKeys(username);

        const passwordInput = await driver.findElement(By.id('password'));
        await passwordInput.sendKeys(password);

        const loginButton = await driver.findElement(By.id('loginbtn'));
        await loginButton.click();

        await driver.sleep(5000);

        let result = ''
        try {
            let messageError = await driver.findElement(By.id('loginerrormessage'));
            let message = await messageError.getText();
            result = message;
        } catch (error) {
            result = 'Login success';
        }

        //write log to file xlxs
        const log = {
            id: tc_id,
            description: description,
            message: username + ' ' + password,
            input: `Username: ${username}, Password: ${password}`,
            expected_result: expected_result,
            actual_result: result,
            status: result === expected_result ? 'Pass' : 'Fail'
        }

        const logPath = path.join(__dirname, 'log.xlsx');
        writeLog(log, logPath);
        console.log('Test login success');
    }
    catch (error) {
        console.error(error);
    }
    finally {
        await driver.quit();
    }
}

//invalid username and valid password
testLogin({ tc_id: 'tc_01', description: 'Invalid login, please try again', username: 'student', password: 'Moodle1234', expected_result: 'Invalid login, please try again' });