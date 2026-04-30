const { Builder } = require('selenium-webdriver');
const LoginAction = require('../actions/login.action')

describe('Login', () => {
    let driver; 
    let loginAction;

    beforeEach(async () => {
        driver = new Builder()
            .forBrowser('chrome')
            .build();

        loginAction = new LoginAction(driver);
        await loginAction.openUrl('https://www.saucedemo.com/');
    })

    afterEach(async () => {
        await driver.quit();
    })

    it('Login with valid credential', async () => {
        await loginAction.inputUsername('standard_user');
        await loginAction.inputPassword('secret_sauce');
        await loginAction.clickLoginButton();
        await loginAction.assertLoginSuccess('Products');
    });

    it('Login with incorrect password', async () => {
        await loginAction.inputUsername('standard_user');
        await loginAction.inputPassword('wrongpass');
        await loginAction.clickLoginButton();
        await loginAction.assertLoginFailed('Epic sadface: Username and password do not match any user in this service');
    });

    it('Login with username only', async () => {
        await loginAction.inputUsername('standard_user');
        await loginAction.clickLoginButton();
        await loginAction.assertLoginFailed('Epic sadface: Password is required');
    });

    it('Login with locked out user', async () => {
        await loginAction.inputUsername('locked_out_user');
        await loginAction.inputPassword('secret_sauce');
        await loginAction.clickLoginButton();
        await loginAction.assertLoginFailed('Epic sadface: Sorry, this user has been locked out.');
    });
})