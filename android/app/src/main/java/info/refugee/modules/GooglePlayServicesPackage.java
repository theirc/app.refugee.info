package info.refugee.modules;

import com.facebook.react.bridge.*;
import com.facebook.react.*;
import com.facebook.react.uimanager.ViewManager;
import com.google.android.gms.common.GooglePlayServicesUtil;
import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.GoogleApiAvailability;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class GooglePlayServicesPackage implements ReactPackage {

    @Override
    public List<Class<? extends JavaScriptModule>> createJSModules() {
        return Collections.emptyList();
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }

    @Override
    public List<NativeModule> createNativeModules(
            ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();

        modules.add(new GooglePlayServicesModule(reactContext));

        return modules;
    }
}
