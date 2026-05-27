package tests;

import org.testng.Assert;
import org.testng.annotations.Test;

import base.BaseTest;
import pages.HomePage;
import pages.LoginPage;

public class ValidLoginTest extends BaseTest {

    @Test(description = "Verify valid user login to Salesforce")
    public void validLoginTest() {
        LoginPage loginPage = new LoginPage(driver);
        loginPage.navigateToLogin();

        Assert.assertTrue(loginPage.isLoginPageDisplayed(),
                "Login page should be displayed");

        loginPage.doLogin(validUser, validPass);

        HomePage homePage = new HomePage(driver);
        Assert.assertTrue(homePage.isDashboardLoaded(),
                "Dashboard should be loaded after successful login");

        Assert.assertTrue(homePage.isOnSalesforceDomain(),
                "URL should be on Salesforce domain after login");
    }
}
