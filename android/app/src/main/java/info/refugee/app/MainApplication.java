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
import com.AirMaps.AirPackage;
import com.i18n.reactnativei18n.ReactNativeI18n;
import com.chirag.RNMail.*;  // <--- import
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;  // <--- Import Package
import org.pgsqlite.SQLitePluginPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {
  private ReactNativePushNotificationPackage mReactNativePushNotificationPackage; // <------ Add Package Variable

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    protected boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
            mReactNativePushNotificationPackage = new ReactNativePushNotificationPackage(); // <------ Initialize the Package

      return Arrays.<ReactPackage>asList(
                  new MainReactPackage(),
                  new VectorIconsPackage(),
                  new RNSharePackage(),
                  new AirPackage(),
                  new ReactNativeI18n(),
                  new RNMail(),
                  new SQLitePluginPackage(),
                            mReactNativePushNotificationPackage // <---- Add the Package

              );
    }
  };

   // Add onNewIntent
   public void onNewIntent(Intent intent) {
      if ( mReactNativePushNotificationPackage != null ) {
          mReactNativePushNotificationPackage.newIntent(intent);
      }
   }
   
  @Override
  public ReactNativeHost getReactNativeHost() {
      return mReactNativeHost;
  }
}
