package lt.mediapark.lrt;

import android.content.Intent
import android.content.res.Configuration
import android.os.Build
import android.os.Bundle
import android.util.Log
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import com.google.android.gms.cast.framework.CastContext
import com.swmansion.rnscreens.fragment.restoration.RNScreensFragmentFactory;


class MainActivity : ReactActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        supportFragmentManager.fragmentFactory = RNScreensFragmentFactory()
        super.onCreate(savedInstanceState)

        try {
            // lazy load Google Cast context
            CastContext.getSharedInstance(this)
        } catch (e: Exception) {
            Log.e("MainActivity", "onCreate: ", e)
            // cast framework not supported
        }
    }

    /**
     * Returns the name of the main component registered from JavaScript. This is used to schedule
     * rendering of the component.
     */
    override fun getMainComponentName(): String = "lrtApp"

    /**
     * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
     * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
     */
    override fun createReactActivityDelegate(): ReactActivityDelegate =
        DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

    // Workaround appcompat-1.1.0 bug https://issuetracker.google.com/issues/141132133
    override fun applyOverrideConfiguration(overrideConfiguration: Configuration?) {
        if (Build.VERSION.SDK_INT <= 25) {
            return
        }
        super.applyOverrideConfiguration(overrideConfiguration)
    }

    //Theo-player PIP setup
    override fun onUserLeaveHint() {
        this.sendBroadcast(Intent("onUserLeaveHint"))
        super.onUserLeaveHint()
    }

    override fun onPictureInPictureModeChanged(
        isInPictureInPictureMode: Boolean,
        newConfig: Configuration
    ) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            super.onPictureInPictureModeChanged(isInPictureInPictureMode, newConfig)
            val intent = Intent("onPictureInPictureModeChanged")
            intent.putExtra("isInPictureInPictureMode", isInPictureInPictureMode)
            this.sendBroadcast(intent)
        }
    }
}