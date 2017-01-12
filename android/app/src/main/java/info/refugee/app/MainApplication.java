package info.refugee.app;

import android.app.Application;
import android.util.Log;
import android.content.Intent;

import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;

import com.oblador.vectoricons.VectorIconsPackage;

import cl.json.RNSharePackage;

import com.airbnb.android.react.maps.MapsPackage;
import com.i18n.reactnativei18n.ReactNativeI18n;
import com.chirag.RNMail.*;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.mapbox.reactnativemapboxgl.ReactNativeMapboxGLPackage;
import com.avishayil.rnrestart.ReactNativeRestartPackage;
import org.pgsqlite.SQLitePluginPackage;

import java.util.Arrays;
import java.util.List;

import info.refugee.modules.GooglePlayServicesPackage;

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
                    new MapsPackage(),
                    new ReactNativeI18n(),
                    new RNMail(),
                    new SQLitePluginPackage(),
                    new ReactNativeMapboxGLPackage(),
                    new ReactNativePushNotificationPackage(),
                    new ReactNativeRestartPackage(),
                    new GooglePlayServicesPackage()
            );
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }
}
