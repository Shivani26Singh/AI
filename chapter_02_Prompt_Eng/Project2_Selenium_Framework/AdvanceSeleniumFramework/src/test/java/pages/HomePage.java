package pages;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;

import utils.WaitHelper;

public class HomePage {

    private final WebDriver driver;
    private final WaitHelper waitHelper;

    @FindBy(xpath = "//span[contains(@class,'breadcrumbDetail')]")
    private WebElement breadcrumbLabel;

    @FindBy(xpath = "//a[contains(@title,'Home')]")
    private WebElement homeTab;

    @FindBy(xpath = "//span[@class='pageDescription']")
    private WebElement pageDescription;

    @FindBy(xpath = "//div[contains(@class,'slds-page-header')]")
    private WebElement pageHeader;

    @FindBy(xpath = "//div[@class='oneConsoleTabItem active']")
    private WebElement activeConsoleTab;

    @FindBy(xpath = "//div[contains(@class,'forceListViewManagerHeader')]")
    private WebElement listViewHeader;

    public HomePage(WebDriver driver) {
        this.driver = driver;
        this.waitHelper = new WaitHelper(driver);
        PageFactory.initElements(driver, this);
    }

    public boolean isDashboardLoaded() {
        try {
            waitHelper.waitForVisibility(pageHeader);
            return pageHeader.isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    public boolean isHomeTabDisplayed() {
        try {
            waitHelper.waitForVisibility(homeTab);
            return homeTab.isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    public String getPageDescription() {
        try {
            waitHelper.waitForVisibility(pageDescription);
            return pageDescription.getText().trim();
        } catch (Exception e) {
            throw new RuntimeException("Page description not found", e);
        }
    }

    public String getCurrentUrl() {
        return driver.getCurrentUrl();
    }

    public boolean isOnSalesforceDomain() {
        String url = driver.getCurrentUrl();
        return url.contains("salesforce.com") || url.contains("lightning.force.com");
    }
}
