package tests;

import org.testng.Assert;
import org.testng.annotations.Test;

import base.BaseTest;
import config.ConfigReader;
import pages.LoginPage;

public class InvalidLoginTest extends BaseTest {

    @Test(description = "Verify invalid login displays error message")
    public void invalidLoginTest() {
        LoginPage loginPage = new LoginPage(driver);
        loginPage.navigateToLogin();

        Assert.assertTrue(loginPage.isLoginPageDisplayed(),
                "Login page should be displayed");

        String invalidUser = ConfigReader.get("invalid.username");
        String invalidPass = ConfigReader.get("invalid.password");

        loginPage.doLogin(invalidUser, invalidPass);

        Assert.assertTrue(loginPage.isErrorMessageDisplayed(),
                "Error message should be displayed for invalid credentials");

        String errorText = loginPage.getErrorMessageText();
        Assert.assertFalse(errorText.isEmpty(),
                "Error message text should not be empty");

        Assert.assertTrue(loginPage.isLoginPageDisplayed(),
                "User should remain on login page after failed login");
    }
}
