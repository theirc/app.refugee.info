import unittest
from time import sleep

from appium import webdriver
from tests import desired_capabilities


class OnlyCountrySelectedTests(unittest.TestCase):

    def setUp(self):
        desired_caps = desired_capabilities.get_desired_capabilities()
        self.driver = webdriver.Remote('http://localhost:4723/wd/hub', desired_caps)
        self.driver.implicitly_wait(10)

    def tearDown(self):
        self.driver.quit()

    def test_services_list(self):
        self.driver.find_element_by_android_uiautomator('text("Select")').click()
        self.driver.find_element_by_android_uiautomator('new UiScrollable(new UiSelector().scrollable(true)).'
                                                        'scrollIntoView(new UiSelector().text("Greece"));').click()
        self.driver.find_element_by_android_uiautomator('text("Select")').click()
        text_views = self.driver.find_elements_by_class_name("android.widget.TextView")
        text_views[len(text_views)-1].click()
        image_views = self.driver.find_elements_by_class_name("android.widget.ImageView")
        image_views[0].click()
        el = self.driver.find_element_by_android_uiautomator('text("Choose location first")')
        self.assertIsNotNone(el)

if __name__ == '__main__':
    suite = unittest.TestLoader().loadTestsFromTestCase(OnlyCountrySelectedTests)
    unittest.TextTestRunner(verbosity=2).run(suite)
