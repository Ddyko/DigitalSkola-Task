const { Builder } = require('selenium-webdriver');
const SharingAction = require('../actions/sharing.action');
const LoginAction = require('../actions/login.action');
const LoginPage = require('../pageobject/login.page');
const { compareScreenshot } = require('../../utilities/visual_regression.helper');

describe('Login', () => {
    let driver; 
    let loginAction;
    let sharingAction;

    beforeEach(async () => {
        driver = new Builder()
            .forBrowser('chrome')
            .build();

        loginAction = new LoginAction(driver);
        sharingAction = new SharingAction(driver);
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

        await sharingAction.fullPageScreenshot('login_success');
    });

    it('Login with incorrect password', async () => {
        await loginAction.inputUsername('standard_user');
        await loginAction.inputPassword('wrongpass');
        await loginAction.clickLoginButton();
        await loginAction.assertLoginFailed('Epic sadface: Username and password do not match any user in this service');

        await sharingAction.fullPageScreenshot('login_incorrect_password');
        await sharingAction.partialScreenshot(LoginPage.errorMessage, 'password_not_match');
    });

    //Regression for No Password
    it('Login with username only', async () => {
        await loginAction.inputUsername('standard_user');
        await loginAction.clickLoginButton();
        await loginAction.assertLoginFailed('Epic sadface: Password is required');

        // await sharingAction.fullPageScreenshot('login_no_password');
        // await sharingAction.partialScreenshot(LoginPage.errorMessage, 'password_required');

        await compareScreenshot(driver, 'user_locked_out')
    });

    //Regression for Locked out User
    it('Login with locked out user', async () => {
        await loginAction.inputUsername('locked_out_user');
        await loginAction.inputPassword('secret_sauce');
        await loginAction.clickLoginButton();
        await loginAction.assertLoginFailed('Epic sadface: Sorry, this user has been locked out.');

        // await sharingAction.fullPageScreenshot('login_lockout');
        // await sharingAction.partialScreenshot(LoginPage.errorMessage, 'user_locked_out');

        await compareScreenshot(driver, 'user_locked_out')
    });
})