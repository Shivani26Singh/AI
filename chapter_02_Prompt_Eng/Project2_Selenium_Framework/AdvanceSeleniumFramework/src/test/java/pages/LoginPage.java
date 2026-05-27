package pages;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;

import utils.WaitHelper;

public class LoginPage {

    private final WebDriver driver;
    private final WaitHelper waitHelper;

    @FindBy(xpath = "//input[@id='username']")
    private WebElement usernameInput;

    @FindBy(xpath = "//input[@id='password']")
    private WebElement passwordInput;

    @FindBy(xpath = "//input[@id='Login']")
    private WebElement loginButton;

    @FindBy(xpath = "//input[@id='rememberUn']")
    private WebElement rememberMeCheckbox;

    @FindBy(xpath = "//div[@id='error']")
    private WebElement errorMessage;

    @FindBy(xpath = "//div[contains(@class,'loginError')]")
    private WebElement loginErrorBanner;

    public LoginPage(WebDriver driver) {
        this.driver = driver;
        this.waitHelper = new WaitHelper(driver);
        PageFactory.initElements(driver, this);
    }

    public void navigateToLogin() {
        driver.get("https://login.salesforce.com/?locale=in");
    }

    public void enterUsername(String username) {
        try {
            waitHelper.waitForVisibility(usernameInput);
            usernameInput.clear();
            usernameInput.sendKeys(username);
        } catch (Exception e) {
            throw new RuntimeException("Failed to enter username", e);
        }
    }

    public void enterPassword(String password) {
        try {
            waitHelper.waitForVisibility(passwordInput);
            passwordInput.clear();
            passwordInput.sendKeys(password);
        } catch (Exception e) {
            throw new RuntimeException("Failed to enter password", e);
        }
    }

    public void clickLogin() {
        try {
            waitHelper.waitForClickable(loginButton);
            loginButton.click();
        } catch (Exception e) {
            throw new RuntimeException("Failed to click login button", e);
        }
    }

    public void checkRememberMe() {
        try {
            waitHelper.waitForClickable(rememberMeCheckbox);
            if (!rememberMeCheckbox.isSelected()) {
                rememberMeCheckbox.click();
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to check remember me", e);
        }
    }

    public void uncheckRememberMe() {
        try {
            waitHelper.waitForClickable(rememberMeCheckbox);
            if (rememberMeCheckbox.isSelected()) {
                rememberMeCheckbox.click();
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to uncheck remember me", e);
        }
    }

    public void doLogin(String username, String password) {
        enterUsername(username);
        enterPassword(password);
        clickLogin();
    }

    public boolean isErrorMessageDisplayed() {
        try {
            waitHelper.waitForVisibility(errorMessage);
            return errorMessage.isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    public String getErrorMessageText() {
        try {
            waitHelper.waitForVisibility(errorMessage);
            return errorMessage.getText().trim();
        } catch (Exception e) {
            throw new RuntimeException("Error message element not found", e);
        }
    }

    public String getLoginErrorBannerText() {
        try {
            waitHelper.waitForVisibility(loginErrorBanner);
            return loginErrorBanner.getText().trim();
        } catch (Exception e) {
            throw new RuntimeException("Login error banner not found", e);
        }
    }

    public boolean isLoginPageDisplayed() {
        try {
            waitHelper.waitForVisibility(usernameInput);
            return usernameInput.isDisplayed() && passwordInput.isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }
}
