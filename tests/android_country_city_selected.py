import unittest
from appium import webdriver
from tests import desired_capabilities


class CountryCitySelectedTests(unittest.TestCase):

    def setUp(self):
        desired_caps = desired_capabilities.get_desired_capabilities()
        self.driver = webdriver.Remote('http://localhost:4723/wd/hub', desired_caps)
        self.driver.implicitly_wait(50)
        warnings = self.driver.find_elements_by_android_uiautomator('textContains("Warning")')
        if len(warnings) > 0:
            warnings[0].click()
            self.driver.find_element_by_android_uiautomator('text("Dismiss All")').click()
        self.driver.find_element_by_id("android:id/text1").click()
        country_list = self.driver.find_elements_by_class_name("android.widget.CheckedTextView")
        country_list[2].click()
        text1 = self.driver.find_elements_by_id("android:id/text1")
        text1[1].click()
        city_list = self.driver.find_elements_by_class_name("android.widget.CheckedTextView")
        city_list[0].click()
        self.driver.find_element_by_android_uiautomator('textContains("Select")').click()

    def tearDown(self):
        self.driver.quit()

    def test_general_information(self):
        el = self.driver.find_element_by_android_uiautomator('text("General Information")')
        self.assertTrue(el)
        el = self.driver.find_element_by_android_uiautomator('text("IMPORTANT INFORMATION")')
        self.assertTrue(el)
        text_views = self.driver.find_elements_by_class_name("android.widget.TextView")
        self.assertGreaterEqual(len(text_views), 3)

    def test_list_services(self):
        text_views = self.driver.find_elements_by_class_name("android.widget.TextView")
        text_views[len(text_views) - 2].click()
        self.driver.find_element_by_android_uiautomator('text("List Services")').click()
        el = self.driver.find_element_by_android_uiautomator('text("Service List")')
        self.assertTrue(el)
        el = self.driver.find_element_by_android_uiautomator('textContains("Latest services")')
        self.assertTrue(el)
        el = self.driver.find_element_by_android_uiautomator('textContains("Search")')
        self.assertTrue(el)


if __name__ == '__main__':
    suite = unittest.TestLoader().loadTestsFromTestCase(CountryCitySelectedTests)
    unittest.TextTestRunner(verbosity=2).run(suite)
