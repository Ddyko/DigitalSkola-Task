const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');
const chrome = require('selenium-webdriver/chrome');

describe('SauceDemo Login Test', function () {
    let driver;

    beforeEach(async function () {
        const options = new chrome.Options();
        options.addArguments('--incognito');

        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();

        await driver.get('https://www.saucedemo.com');
    });

    afterEach(async function () {
        await driver.quit();
    });

    async function login(username, password) {
        if (username) {
            await driver.findElement(By.id('user-name')).sendKeys(username);
        }
        if (password) {
            await driver.findElement(By.id('password')).sendKeys(password);
        }
        await driver.findElement(By.id('login-button')).click();
    }

    it('Login without username and password', async function () {
        await login('', '');

        const errorMsg = await driver.findElement(By.css('[data-test="error"]')).getText();
        assert.ok(errorMsg.includes('Username is required'));
    });

    it('Login with username only', async function () {
        await login('standard_user', '');

        const errorMsg = await driver.findElement(By.css('[data-test="error"]')).getText();
        assert.ok(errorMsg.includes('Password is required'));
    });

    it('Login with incorrect password', async function () {
        await login('standard_user', 'wrongpass');

        const errorMsg = await driver.findElement(By.css('[data-test="error"]')).getText();
        assert.ok(errorMsg.includes('Username and password do not match any user in this service'));
    });

    it('Login with standard user', async function () {
        await login('standard_user', 'secret_sauce');

        await driver.wait(until.urlContains('inventory'), 5000);

        const title = await driver.findElement(By.className('title')).getText();
        assert.strictEqual(title, 'Products');
    });

    it('Login with locked out user', async function () {
        await login('locked_out_user', 'secret_sauce');

        const errorMsg = await driver.findElement(By.css('[data-test="error"]')).getText();
        assert.ok(errorMsg.includes('Sorry, this user has been locked out.'));
    });
});