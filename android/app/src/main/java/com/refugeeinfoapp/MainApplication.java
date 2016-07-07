package com.refugeeinfoapp;

import android.app.Application;
import android.util.Log;

import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;

import com.oblador.vectoricons.VectorIconsPackage;
import cl.json.RNSharePackage;
import com.AirMaps.AirPackage;
import com.i18n.reactnativei18n.ReactNativeI18n;
import com.chirag.RNMail.*;  // <--- import

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    protected boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
                  new MainReactPackage(),
                  new VectorIconsPackage(),
                  new RNSharePackage(),
                  new AirPackage(),
                  new ReactNativeI18n(),
                  new RNMail()
              );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
      return mReactNativeHost;
  }
}
