package com.reactlibrary;

import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
// import com.gemius.sdk.Config;
// import com.gemius.sdk.audience.AudienceConfig;
// import com.gemius.sdk.audience.AudienceEvent;
// import com.gemius.sdk.audience.BaseEvent;
// import com.gemius.sdk.audience.BaseEvent.EventType;
// import com.gemius.sdk.stream.EventProgramData;
// import com.gemius.sdk.stream.Player;
// import com.gemius.sdk.stream.PlayerData;
// import com.gemius.sdk.stream.ProgramData;

public class GemiusPluginModule extends ReactContextBaseJavaModule {

    private static final String TAG = "GemiusPluginModule";

    private final ReactApplicationContext reactContext;

    /**
     * Player used to send video player statistics.
     */
//    private Player player;


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
        // Log.i(TAG, "Setting app info: app[" + app + "] version[" + version + "]");
        // Config.setAppInfo(app, version);
        // AudienceConfig.getSingleton().setHitCollectorHost(gemiusHitCollectorHost);
        // AudienceConfig.getSingleton().setScriptIdentifier(gemiusPrismIdentifier);
    }

    @ReactMethod
    public void setPlayerInfo(String playerId, String serverHost, String accountId) {
        // Log.w(TAG, "Initialising player...");
        // if (player == null) {
        //     player = new Player(playerId, serverHost, accountId, new PlayerData());
        //     player.setContext(reactContext);
        // } else {
        //     Log.w(TAG, "Player already initialised");
        // }
    }

    @ReactMethod
    public void setProgramData(String clipId, String name, Integer duration, String type) {
//        Log.d(TAG, "Settings new program data for '" + name + "'");
//        ProgramData programData = new ProgramData();
//        programData.setName(name);
//        programData.setDuration(duration);
//
//        if (type != null && type.equals("audio")) {
//            programData.setProgramType(ProgramData.ProgramType.AUDIO);
//        } else {
//            programData.setProgramType(ProgramData.ProgramType.VIDEO);
//        }
//
//        player.newProgram(clipId, programData);
    }

    @ReactMethod
    public void sendPlay(String clipId, Integer offset) {
//        Log.d(TAG, "Player PLAY event for '" + clipId + "' offset: " + offset);
//        EventProgramData eventProgramData = new EventProgramData();
//        eventProgramData.setAutoPlay(true);
//        player.programEvent(clipId, offset, Player.EventType.PLAY, eventProgramData);
    }

    @ReactMethod
    public void sendPause(String clipId, Integer offset) {
//        Log.d(TAG, "Player PAUSE event for '" + clipId + "' offset: " + offset);
//        player.programEvent(clipId, offset, Player.EventType.PAUSE, null);
    }

    @ReactMethod
    public void sendStop(String clipId, Integer offset) {
//        Log.d(TAG, "Player STOP event for '" + clipId + "' offset: " + offset);
//        player.programEvent(clipId, offset, Player.EventType.STOP, null);
    }

    @ReactMethod
    public void sendBuffer(String clipId, Integer offset) {
//        Log.d(TAG, "Player BUFFER event for '" + clipId + "' offset: " + offset);
//        player.programEvent(clipId, offset, Player.EventType.BUFFER, null);
    }

    @ReactMethod
    public void sendClose(String clipId, Integer offset) {
//        Log.d(TAG, "Player CLOSE event for '" + clipId + "' offset: " + offset);
//        player.programEvent(clipId, offset, Player.EventType.CLOSE, null);
    }

    @ReactMethod
    public void sendSeek(String clipId, Integer offset) {
//        Log.d(TAG, "Player SEEK event for '" + clipId + "' offset: " + offset);
//        player.programEvent(clipId, offset, Player.EventType.SEEK, null);
    }

    @ReactMethod
    public void sendComplete(String clipId, Integer offset) {
//        Log.d(TAG, "Player COMPLETE event for '" + clipId + "' offset: " + offset);
//        player.programEvent(clipId, offset, Player.EventType.COMPLETE, null);
    }

    @ReactMethod
    public void sendPageViewedEvent(String gemiusPrismIdentifier, ReadableMap paramsMap) {
//        Log.d(TAG, "sendPageViewedEvent() called.");
//        AudienceEvent event = new AudienceEvent(this.reactContext);
//        event.setScriptIdentifier(gemiusPrismIdentifier);
//        event.setEventType(AudienceEvent.EventType.FULL_PAGEVIEW);
//        addParamsToEvent(event, paramsMap);
//        event.sendEvent();
    }

    @ReactMethod
    public void sendPartialPageViewedEvent(String gemiusPrismIdentifier, ReadableMap paramsMap) {
//        Log.d(TAG, "sendPartialPageViewedEvent() called.");
//        AudienceEvent event = new AudienceEvent(this.reactContext);
//        event.setScriptIdentifier(gemiusPrismIdentifier);
//        event.setEventType(AudienceEvent.EventType.PARTIAL_PAGEVIEW);
//        addParamsToEvent(event, paramsMap);
//        event.sendEvent();
    }

    @ReactMethod
    public void sendActionEvent(String gemiusPrismIdentifier, ReadableMap paramsMap) {
//        Log.d(TAG, "sendActionEvent() called.");
//        AudienceEvent event = new AudienceEvent(this.reactContext);
//        event.setScriptIdentifier(gemiusPrismIdentifier);
//        event.setEventType(EventType.ACTION);
//        addParamsToEvent(event, paramsMap);
//        event.sendEvent();
    }

//    private void addParamsToEvent(BaseEvent event, ReadableMap paramsMap) {
//        if (paramsMap != null) {
//            Log.d(TAG, "Adding extra params to event.");
//            ReadableMapKeySetIterator iterator = paramsMap.keySetIterator();
//            while (iterator.hasNextKey()) {
//                String key = iterator.nextKey();
//                String value = paramsMap.getString(key);
//                Log.d("GemiusPluginModule", key + " = " + value);
//                event.addExtraParameter(key, value);
//            }
//        }
//    }
}
