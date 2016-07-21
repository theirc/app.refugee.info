package info.refugee.app;

import com.facebook.react.ReactActivity;
import com.microsoft.codepush.react.CodePush;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.chirag.RNMail.RNMail;
import android.content.Intent;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "RefugeeInfoApp";
    }

      @Override
    public void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        ((MainApplication) getApplication()).onNewIntent(intent);
    }
}
