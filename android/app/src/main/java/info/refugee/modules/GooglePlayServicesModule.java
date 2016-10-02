package info.refugee.modules;


import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.google.android.gms.common.GooglePlayServicesUtil;
import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.GoogleApiAvailability;

import java.util.Map;

public class GooglePlayServicesModule extends ReactContextBaseJavaModule {
    @Override
    public String getName() {
        return "GooglePlayServices";
    }

    public GooglePlayServicesModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    private boolean checkPlayServicesInternal() {
        try {
            GoogleApiAvailability googleAPI = GoogleApiAvailability.getInstance();
            int result = googleAPI.isGooglePlayServicesAvailable(getCurrentActivity().getApplicationContext());

            return result == ConnectionResult.SUCCESS;
        } catch (Exception e) {
            return false;
        }
    }


    @ReactMethod
    public void checkPlayServices(Promise promise) {
        try {
            promise.resolve(checkPlayServicesInternal());
        } catch (Exception e) {
            promise.reject("500", e.getMessage());
        }
    }
}