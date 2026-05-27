package base;

import org.openqa.selenium.WebDriver;
import org.testng.annotations.AfterSuite;
import org.testng.annotations.BeforeSuite;

import config.ConfigReader;
import utils.DriverManager;
import utils.WaitHelper;

public class BaseTest {

    protected WebDriver driver;
    protected WaitHelper waitHelper;
    protected String baseUrl;
    protected String validUser;
    protected String validPass;

    @BeforeSuite
    public void setUpSuite() {
        driver = DriverManager.initDriver();
        waitHelper = new WaitHelper(driver);
        baseUrl = ConfigReader.get("base.url");
        validUser = ConfigReader.get("valid.username");
        validPass = ConfigReader.get("valid.password");
    }

    @AfterSuite(alwaysRun = true)
    public void tearDownSuite() {
        DriverManager.quitDriver();
    }

    public void navigateTo(String path) {
        driver.get(baseUrl + path);
    }
}
