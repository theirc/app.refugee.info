Installing
----------------------

### Requirements
- JDK 7
- Android SDK
- React Native
- Watchman


### Installing Prerequisites
```sh
sudo apt-get install libgl1-mesa-dev automake
```

### Installing Android SDK
- Download SDK from http://developer.android.com/sdk/index.html#downloads
- Unpack the archive
- Add exports to .bashrc:
> export ANDROID_HOME=:/path/to/android-sdk/

> export PATH=$PATH:/path/to/android-sdk/tools/


### Configuring SDK
+ start up Android SDK Manager
```sh
android &
```
- Android 6.0 (API 23)
- Extras
- - Android Support Repository
- - Android Support Library
- - Google Play services
- - Google Repository
- - Intel x86 Emulator Accelerator


### Installing Intel x86 Emulator Accelerator (HAXM) on Ubuntu
https://software.intel.com/en-us/blogs/2012/03/12/how-to-start-intel-hardware-assisted-virtualization-hypervisor-on-linux-to-speed-up-intel-android-x86-emulator


### Updating npm & node:
```sh
sudo npm install -g npm
sudo npm cache clean -f
sudo npm install -g n
sudo n stable
```


### Installing React Native:
```sh
sudo npm install -g react-native-cli
touch ~/.gradle/gradle.properties && echo "org.gradle.daemon=true" >> ~/.gradle/gradle.properties
```


### Installing Watchman:
```sh
git clone https://github.com/facebook/watchman.git
cd watchman
git checkout v4.5.0  # the latest stable release
./autogen.sh
./configure
make
sudo make install
echo 999999 | sudo tee -a /proc/sys/fs/inotify/max_user_watches && echo 999999 | sudo tee -a /proc/sys/fs/inotify/max_queued_events && echo 999999 | sudo tee -a /proc/sys/fs/inotify/max_user_instances && watchman shutdown-server
```


### Creating android virtual machine:
start AVD manager: 
```sh
android &
```
- go to Device Definitions, edit desired device, set Buttons property to "Hardware"
- Create new Android Virtual Device, select previously edited device definition
- Set target to Android 6.0, CPU: Google APIs Intel Atom (x86), Skin with dynamic hardware controls


### Starting up application
- Start Android Virtual Machine
- Go to project root
```sh
react-native run-android
react-native start
```
- Reload JS
- For faster development enable live & hot reload in the Dev Console

### Tests
- Installing tests environment
```sh
npm install -g appium  # get appium
pip install Appium-Python-Client
pip install pytest
```

- Running tests
```sh
appium &               # start appium
py.test tests/*.py     # run all tests
```
