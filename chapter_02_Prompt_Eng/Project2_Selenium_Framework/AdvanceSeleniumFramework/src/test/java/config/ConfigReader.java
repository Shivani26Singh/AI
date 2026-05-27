package config;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.Properties;

public class ConfigReader {

    private static Properties properties;

    static {
        try (FileInputStream fis = new FileInputStream(
                System.getProperty("user.dir") + "/src/test/resources/config.properties")) {
            properties = new Properties();
            properties.load(fis);
        } catch (IOException e) {
            throw new RuntimeException("Failed to load config.properties", e);
        }
    }

    public static String get(String key) {
        String value = System.getProperty(key);
        if (value != null) {
            return value;
        }
        String propValue = properties.getProperty(key);
        if (propValue == null) {
            throw new IllegalArgumentException("Key not found in config: " + key);
        }
        return propValue;
    }

    public static long getLong(String key) {
        return Long.parseLong(get(key));
    }
}
