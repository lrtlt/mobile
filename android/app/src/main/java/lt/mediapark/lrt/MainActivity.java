package lt.mediapark.lrt;

import android.content.res.Configuration;
import android.os.Build;
import android.os.Bundle;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;

public class MainActivity extends ReactActivity {

  @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(null);
    }

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "lrtApp";
  }

  // Workaround appcompat-1.1.0 bug https://issuetracker.google.com/issues/141132133
  @Override
  public void applyOverrideConfiguration(Configuration overrideConfiguration) {
      if (Build.VERSION.SDK_INT >= 21 && Build.VERSION.SDK_INT <= 25) {
          return;
      }
      super.applyOverrideConfiguration(overrideConfiguration);
  }
}
