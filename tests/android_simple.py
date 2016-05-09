import unittest
from time import sleep
from appium import webdriver
from tests import desired_capabilities


class SimpleAndroidTests(unittest.TestCase):

    def setUp(self):
        desired_caps = desired_capabilities.get_desired_capabilities()
        self.driver = webdriver.Remote('http://localhost:4723/wd/hub', desired_caps)
        self.path = desired_caps['app']
        self.driver.implicitly_wait(50)
        warnings = self.driver.find_elements_by_android_uiautomator('textContains("Warning")')
        if len(warnings) > 0:
            warnings[0].click()
            self.driver.find_element_by_android_uiautomator('text("Dismiss All")').click()

    def tearDown(self):
        self.driver.quit()

    def test_find_elements(self):
        el = self.driver.find_element_by_android_uiautomator('text("Welcome")')
        self.assertIsNotNone(el)
        el = self.driver.find_element_by_android_uiautomator('text("Detect Location")')
        self.assertIsNotNone(el)
        el = self.driver.find_element_by_android_uiautomator('text("Select country")')
        self.assertIsNotNone(el)

    def test_installation(self):
        self.driver.remove_app('com.refugeeinfoapp')
        self.assertFalse(self.driver.is_app_installed('com.refugeeinfoapp'))
        self.driver.install_app(self.path)
        self.assertTrue(self.driver.is_app_installed('com.refugeeinfoapp'))

    def test_launching_application(self):
        el = self.driver.find_element_by_android_uiautomator('text("Welcome")')
        self.assertIsNotNone(el)
        self.driver.close_app()
        try:
            self.driver.implicitly_wait(0)
            self.driver.find_element_by_android_uiautomator('text("Welcome")')
        except Exception as e:
            pass  # should not exist
        self.driver.launch_app()
        el = self.driver.find_element_by_android_uiautomator('text("Welcome")')
        self.assertIsNotNone(el)

    def test_resetting_application(self):
        el = self.driver.find_element_by_android_uiautomator('text("Detect Location")')
        self.assertIsNotNone(el)

        self.driver.reset()
        sleep(2)

        el = self.driver.find_element_by_android_uiautomator('text("Welcome")')
        self.assertIsNotNone(el)

    def test_send_to_background(self):
        self.driver.background_app(1)
        sleep(2)
        el = self.driver.find_element_by_android_uiautomator('text("Welcome")')
        self.assertIsNotNone(el)

    def test_menu(self):
        text_views = self.driver.find_elements_by_class_name("android.widget.TextView")
        text_views[len(text_views) - 2].click()
        el = self.driver.find_element_by_android_uiautomator('text("Home")')
        self.assertIsNotNone(el)
        el = self.driver.find_element_by_android_uiautomator('text("List Services")')
        self.assertIsNotNone(el)
        el = self.driver.find_element_by_android_uiautomator('text("Explore Services on Map")')
        self.assertIsNotNone(el)
        el = self.driver.find_element_by_android_uiautomator('text("General Information")')
        self.assertIsNotNone(el)


if __name__ == '__main__':
    suite = unittest.TestLoader().loadTestsFromTestCase(SimpleAndroidTests)
    unittest.TextTestRunner(verbosity=2).run(suite)
