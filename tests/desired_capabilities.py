import os

# Returns abs path relative to this file and not cwd
PATH = lambda p: os.path.abspath(
    os.path.join(os.path.dirname(__file__), p)
)


def get_desired_capabilities():
    desired_caps = {
        'platformName': 'Android',
        'platformVersion': '6.0',
        'deviceName': 'test',
        'app': PATH('../android/app/build/outputs/apk/app-debug.apk'),
        'newCommandTimeout': 120,
        'orientation': 'PORTRAIT'
    }

    return desired_caps
