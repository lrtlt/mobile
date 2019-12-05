package com.reactlibrary;

import android.util.Log;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.gemius.sdk.audience.AudienceConfig;
import com.gemius.sdk.audience.AudienceEvent;
import com.gemius.sdk.audience.BaseEvent;
import com.gemius.sdk.audience.BaseEvent.EventType;

public class GemiusPluginModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;

    public GemiusPluginModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "GemiusPlugin";
    }


    @ReactMethod
    public void setAppInfo(String app, String version, String gemiusHitCollectorHost, String gemiusPrismIdentifier) {
        Log.i("GemiusPluginModule", "Setting app info: app[" + app + "] version[" + version +"]");
        com.gemius.sdk.Config.setAppInfo(app, version);
        AudienceConfig.getSingleton().setHitCollectorHost(gemiusHitCollectorHost);
        AudienceConfig.getSingleton().setScriptIdentifier(gemiusPrismIdentifier);
    }

    @ReactMethod
    public void sendPageViewedEvent(String gemiusPrismIdentifier, ReadableMap paramsMap) {
        Log.d("GemiusPluginModule", "sendPageViewedEvent() called.");
        AudienceEvent event = new AudienceEvent(this.reactContext);
        event.setScriptIdentifier(gemiusPrismIdentifier);
        event.setEventType(AudienceEvent.EventType.FULL_PAGEVIEW);
        addParamsToEvent(event, paramsMap);
        event.sendEvent();
    }

    @ReactMethod
    public void sendPartialPageViewedEvent(String gemiusPrismIdentifier, ReadableMap paramsMap) {
        Log.d("GemiusPluginModule", "sendPartialPageViewedEvent() called.");
        AudienceEvent event = new AudienceEvent(this.reactContext);
        event.setScriptIdentifier(gemiusPrismIdentifier);
        event.setEventType(AudienceEvent.EventType.PARTIAL_PAGEVIEW);
        addParamsToEvent(event, paramsMap);
        event.sendEvent();
    }

    @ReactMethod
    public void sendActionEvent(String gemiusPrismIdentifier, ReadableMap paramsMap) {
        Log.d("GemiusPluginModule", "sendActionEvent() called.");
        AudienceEvent event = new AudienceEvent(this.reactContext);
        event.setScriptIdentifier(gemiusPrismIdentifier);
        event.setEventType(EventType.ACTION);
        addParamsToEvent(event, paramsMap);
        event.sendEvent();
    }

    private void addParamsToEvent(BaseEvent event, ReadableMap paramsMap){
        if(paramsMap != null){
            Log.d("GemiusPluginModule", "Adding extra params to event.");
            ReadableMapKeySetIterator iterator = paramsMap.keySetIterator();
            while(iterator.hasNextKey()){
                String key = iterator.nextKey();
                String value = paramsMap.getString(key);
                Log.d("GemiusPluginModule", key + " = " + value);
                event.addExtraParameter(key, value);
            }
        }
    }
}
