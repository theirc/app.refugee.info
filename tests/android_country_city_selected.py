import unittest
from time import sleep

from appium import webdriver
from appium.webdriver.common.multi_action import MultiAction
from appium.webdriver.common.touch_action import TouchAction
from selenium.common.exceptions import NoSuchElementException

from tests import desired_capabilities


class CountryCitySelectedTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        desired_caps = desired_capabilities.get_desired_capabilities()
        cls.driver = webdriver.Remote('http://localhost:4723/wd/hub', desired_caps)
        cls.driver.implicitly_wait(10)
        cls.driver.find_element_by_android_uiautomator('text("Select")').click()
        cls.driver.find_element_by_android_uiautomator('new UiScrollable(new UiSelector().scrollable(true)).'
                                                       'scrollIntoView(new UiSelector().text("Greece"));').click()
        cls.driver.find_element_by_android_uiautomator('text("Select")').click()
        cls.driver.find_element_by_android_uiautomator('new UiScrollable(new UiSelector().scrollable(true)).'
                                                       'scrollIntoView(new UiSelector().text("Athens"));').click()
        cls.driver.find_element_by_android_uiautomator('text("Select")').click()

    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()

    def test_general_information(self):
        el = self.driver.find_element_by_android_uiautomator('text("General Information")')
        self.assertIsNotNone(el)
        el = self.driver.find_element_by_android_uiautomator('text("IMPORTANT INFORMATION")')
        self.assertIsNotNone(el)
        text_views = self.driver.find_elements_by_class_name("android.widget.TextView")
        self.assertGreaterEqual(len(text_views), 3)

    def test_services(self):
        enter_menu(self)
        self.driver.find_element_by_android_uiautomator('text("List Services")').click()
        el = self.driver.find_element_by_android_uiautomator('text("Service List")')
        self.assertIsNotNone(el)
        el = self.driver.find_element_by_android_uiautomator('textContains("Latest services")')
        self.assertIsNotNone(el)
        el = self.driver.find_element_by_android_uiautomator('textContains("Search")')
        self.assertIsNotNone(el)
        els = self.driver.find_elements_by_android_uiautomator('textContains("Rating")')
        if len(els) > 0:
            els[0].click()
            el = self.driver.find_element_by_accessibility_id('Google Map')
            self.assertIsNotNone(el)
            el = self.driver.find_element_by_android_uiautomator('text("Get directions")')
            self.assertIsNotNone(el)
            el = self.driver.find_element_by_android_uiautomator('text("Call")')
            self.assertIsNotNone(el)
            el = self.driver.find_element_by_android_uiautomator('new UiScrollable(new UiSelector().scrollable(true)).'
                                                                 'scrollIntoView(new UiSelector().'
                                                                 'text("Rate this service"));')
            self.assertIsNotNone(el)
            text_views = self.driver.find_elements_by_class_name("android.widget.TextView")
            text_views[len(text_views) - 4].click()
            edit_texts = self.driver.find_elements_by_class_name("android.widget.EditText")
            try:
                edit_texts[0].send_keys('test name')
                self.driver.back()
                edit_texts[1].send_keys('test comment')
                self.driver.back()
                self.driver.find_element_by_android_uiautomator('text("Submit")').click()
            except NoSuchElementException:
                pass  # sometimes appium crashes on back() after send_keys()
        self.driver.back()
        self.driver.back()

    def test_changing_theme(self):
        for x in range(3):
            enter_menu(self)
            el = self.driver.find_element_by_android_uiautomator('new UiScrollable(new UiSelector().scrollable(true)).'
                                                                 'scrollIntoView(new UiSelector().text("Dark"));')
            self.assertIsNotNone(el)
            el.click()
            if x == 0:
                close_warnings(self)
            enter_menu(self)
            el = self.driver.find_element_by_android_uiautomator('new UiScrollable(new UiSelector().scrollable(true)).'
                                                                 'scrollIntoView(new UiSelector().text("Light"));')
            self.assertIsNotNone(el)
            el.click()

    def test_language(self):
        enter_menu(self)
        el = self.driver.find_element_by_android_uiautomator('text("French")')
        el.click()
        enter_menu(self)
        el = self.driver.find_element_by_android_uiautomator('text("English")')
        el.click()

    def test_services_map_tap(self):
        enter_menu(self)
        self.driver.find_element_by_android_uiautomator('textContains("Map")').click()
        el = self.driver.find_element_by_accessibility_id('Google Map')
        els = el.find_elements_by_class_name('android.view.View')
        action = TouchAction(self.driver)
        action.tap(els[0]).perform()
        self.driver.back()
        self.driver.back()

    def test_services_map_multi_touch(self):
        enter_menu(self)
        self.driver.find_element_by_android_uiautomator('textContains("Map")').click()
        el = self.driver.find_element_by_accessibility_id('Google Map')
        els = el.find_elements_by_class_name('android.view.View')
        if len(els) > 3:
            action0 = TouchAction().tap(els[0])
            action1 = TouchAction().tap(els[1])
            action2 = TouchAction().tap(els[2])
            ma = MultiAction(self.driver, els[0])
            ma.add(action0, action1, action2)
            ma.perform()
        self.driver.back()
        self.driver.back()


def close_warnings(self):
    warnings = self.driver.find_elements_by_android_uiautomator('textContains("Warning")')
    if len(warnings) > 0:
        warnings[0].click()
        self.driver.find_element_by_android_uiautomator('text("Dismiss All")').click()


def enter_menu(self):
    image_views = self.driver.find_elements_by_class_name("android.widget.ImageView")
    image_views[len(image_views) - 1].click()

if __name__ == '__main__':
    suite = unittest.TestLoader().loadTestsFromTestCase(CountryCitySelectedTests)
    unittest.TextTestRunner(verbosity=2).run(suite)
