const path = require('path')
const readXlsxFile = require('read-excel-file/node')
const dataPath = path.join(__dirname, './login.testcases.xlsx')
const { Builder, By, Key, until } = require('selenium-webdriver');
const { writeLog, writeResult } = require('../../consts');

readXlsxFile(dataPath).then(async (rows) => {
    const resultTest = {
        totalTestCase: rows.length - 1,
        totalPass: 0,
        totalFail: 0
    }

    console.log(rows);

    for (let i = 1; i < rows.length; i++) {
        const [tc_id, description, username, password, expected_result] = rows[i];
        let result = await testLogin({ tc_id, description, username, password, expected_result })
        console.log(result);
    }

    // rows.forEach(async (row, index) => {
    //     if (index === 0) return;
    //     const [tc_id, description, username, password, expected_result] = row;
    //     const result = await testLogin({ tc_id, description, username, password, expected_result });
    //     if (result === 1) {
    //         resultTest.totalPass++;
    //     } else {
    //         resultTest.totalFail++;
    //     }

    //     if (index === rows.length - 1) {
    //         const resultPath = path.join(__dirname, 'result.xlsx');
    //         writeResult(resultTest, resultPath);
    //     }
    // })
}).catch((err) => {
    console.error(err);
})

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
        return result === expected_result ? 1 : 0;
    }
    catch (error) {
        console.error(error);
    }
    finally {
        await driver.quit();
    }
}