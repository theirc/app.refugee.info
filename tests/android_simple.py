import os
from time import sleep

import unittest

from appium import webdriver

PATH = lambda p: os.path.abspath(
    os.path.join(os.path.dirname(__file__), p)
)

class SimpleAndroidTests(unittest.TestCase):
    def setUp(self):
        desired_caps = {}
        desired_caps['platformName'] = 'Android'
        desired_caps['platformVersion'] = '6.0'
        desired_caps['deviceName'] = 'test'
        desired_caps['noReset'] = True
        desired_caps['app'] = PATH(
            '../android/app/build/outputs/apk/app-debug.apk'
        )

        self.driver = webdriver.Remote('http://localhost:4723/wd/hub', desired_caps)

    def tearDown(self):
        self.driver.quit()

    def test_find_elements(self):
        el = self.driver.find_elements_by_accessibility_id('test-id-location-view')
        self.assertIsNotNone(el)
        el = self.driver.find_elements_by_accessibility_id('test-id-toolbar')
        self.assertIsNotNone(el)


if __name__ == '__main__':
    suite = unittest.TestLoader().loadTestsFromTestCase(SimpleAndroidTests)
    unittest.TextTestRunner(verbosity=2).run(suite)
