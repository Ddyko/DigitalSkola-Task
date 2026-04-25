const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');
const chrome = require('selenium-webdriver/chrome');

describe('SauceDemo Testing', function () {
    let driver;

    it('Login to SauceDemo', async function () {
        const options = new chrome.Options();
        options.addArguments('--incognito');

        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();

            await driver.get('https://www.saucedemo.com');
            assert.strictEqual(await driver.getTitle(), 'Swag Labs');

            const inputUsername = await driver.findElement(
                By.xpath('//*[@data-test="username"]')
            );
            const inputPassword = await driver.findElement(
                By.xpath('//*[@data-test="password"]')
            );
            const buttonLogin = await driver.findElement(
                By.xpath('//*[@data-test="login-button"]')
            );

            await inputUsername.sendKeys('standard_user');
            await inputPassword.sendKeys('secret_sauce');
            await buttonLogin.click();

            const cartLink = await driver.wait(
                until.elementLocated(By.xpath('//*[@data-test="shopping-cart-link"]')),
                10000
            );
            await driver.wait(until.elementIsVisible(cartLink), 5000);
            assert.ok(await cartLink.isDisplayed(), 'After login, shopping cart link must be visible');

            const hamBut = await driver.wait(
                until.elementLocated(By.xpath('//*[@id="react-burger-menu-btn"]')), 5000
            );
            await driver.wait(until.elementIsVisible(hamBut), 5000);
            assert.ok(await hamBut.isDisplayed(), 'Hamburger Button is visible');
    });


    it('Change SauceDemo Filter Z-A', async function () {
        // await login(driver);
        const firstDiv = await driver.wait(
                until.elementLocated(By.xpath('//*[@id="inventory_container"]/div/div[1]')), 5000
            );
        
        const firstItemName = await firstDiv.getText();
        assert.ok(firstItemName.includes('Sauce Labs Backpack'), 'Before Filter is correct');

        const pickFilter = await driver.findElement(
            By.xpath('//*[@id="header_container"]/div[2]/div/span/select')
        );
        const filterOption = await driver.findElement(
            By.xpath('//*[@id="header_container"]/div[2]/div/span/select/option[2]')
        );

        await pickFilter.click();
        await filterOption.click();

        const filteredName = await firstDiv.getText();
        assert.ok(filteredName.includes('Test.allTheThings() T-Shirt (Red)'), 'After Filter is correct');

        await driver.quit();
    });

    
});
