import unittest
from time import sleep
from appium import webdriver
from tests import desired_capabilities


class SimpleAndroidTests(unittest.TestCase):

    def setUp(self):
        desired_caps = desired_capabilities.get_desired_capabilities()
        self.driver = webdriver.Remote('http://localhost:4723/wd/hub', desired_caps)
        self.path = desired_caps['app']
        self.driver.implicitly_wait(10)

    def tearDown(self):
        self.driver.quit()

    def close_warnings(self, warnings):
        self.driver.find_element_by_android_uiautomator('text("Dismiss All")').click()
        warnings[0].click()
        self.driver.find_element_by_android_uiautomator('text("Dismiss All")').click()

    def test_find_elements(self):
        image_views = self.driver.find_elements_by_class_name("android.widget.ImageView")
        self.assertGreaterEqual(len(image_views), 5)
        el = self.driver.find_element_by_android_uiautomator('text("Language")')
        self.assertIsNotNone(el)
        el = self.driver.find_element_by_android_uiautomator('text("Theme")')
        self.assertIsNotNone(el)
        el = self.driver.find_element_by_android_uiautomator('text("Select")')
        self.assertIsNotNone(el)

    def test_installation(self):
        self.driver.remove_app('info.refugee.app')
        self.assertFalse(self.driver.is_app_installed('info.refugee.app'))
        self.driver.install_app(self.path)
        self.assertTrue(self.driver.is_app_installed('info.refugee.app'))

    def test_launching_application(self):
        el = self.driver.find_element_by_android_uiautomator('text("Select")')
        self.assertIsNotNone(el)
        self.driver.close_app()
        try:
            self.driver.implicitly_wait(0)
            self.driver.find_element_by_android_uiautomator('text("Select")')
        except Exception as e:
            pass  # should not exist
        self.driver.launch_app()
        el = self.driver.find_element_by_android_uiautomator('text("Select")')
        self.assertIsNotNone(el)

    def test_resetting_application(self):
        el = self.driver.find_element_by_android_uiautomator('text("Select")')
        self.assertIsNotNone(el)
        self.driver.reset()
        el = self.driver.find_element_by_android_uiautomator('text("Select")')
        self.assertIsNotNone(el)

    def test_send_to_background(self):
        self.driver.background_app(1)
        el = self.driver.find_element_by_android_uiautomator('text("Select")')
        self.assertIsNotNone(el)

    def test_menu(self):
        image_views = self.driver.find_elements_by_class_name("android.widget.ImageView")
        image_views[len(image_views) - 2].click()


if __name__ == '__main__':
    suite = unittest.TestLoader().loadTestsFromTestCase(SimpleAndroidTests)
    unittest.TextTestRunner(verbosity=2).run(suite)
