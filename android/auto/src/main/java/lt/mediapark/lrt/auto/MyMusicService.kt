package lt.mediapark.lrt.auto

import android.os.Handler
import android.os.Looper
import android.util.Log
import androidx.media3.common.AudioAttributes
import androidx.media3.common.MediaItem
import androidx.media3.common.Player
import androidx.media3.exoplayer.ExoPlayer
import androidx.media3.session.MediaLibraryService
import androidx.media3.session.MediaSession
import lt.mediapark.lrt.auto.data.WatchHistoryEntry

class MyMusicService : MediaLibraryService() {

    private lateinit var player: Player
    private lateinit var mediaSession: MediaLibrarySession
    private lateinit var rdsService: RDSNowPlayingService
    private lateinit var callback: LRTMediaSessionCallback

    private val handler = Handler(Looper.getMainLooper())
    private var trackingRunnable: Runnable? = null

    override fun onCreate() {
        super.onCreate()
        initializeSessionAndPlayer()
    }

    private fun initializeSessionAndPlayer() {
        player = ExoPlayer.Builder(this)
            .setHandleAudioBecomingNoisy(true)
            .setAudioAttributes(AudioAttributes.DEFAULT, true)
            .build().apply {
                addListener(object : Player.Listener {
                    override fun onPlaybackStateChanged(playbackState: Int) {
                        when (playbackState) {
                            Player.STATE_ENDED -> {
                                pushProgress(completed = true)
                                stopTracking()
                                callback.notifyContinuePlayingChanged()
                            }
                            Player.STATE_READY -> {
                                if (isPlaying) startTracking()
                            }
                        }
                    }

                    override fun onIsPlayingChanged(isPlaying: Boolean) {
                        if (isPlaying) {
                            startTracking()
                        } else {
                            pushProgress(completed = false)
                            stopTracking()
                            callback.notifyContinuePlayingChanged()
                        }
                    }

                    override fun onMediaItemTransition(mediaItem: MediaItem?, reason: Int) {
                        pushProgress(completed = false)
                        handleMediaItemTransition(mediaItem)
                    }
                })
            }
        player.repeatMode = Player.REPEAT_MODE_ALL

        rdsService = RDSNowPlayingService(player)

        callback = LRTMediaSessionCallback(this)
        mediaSession = MediaLibrarySession
            .Builder(this, player, callback)
            .build()
    }

    private fun startTracking() {
        stopTracking()
        val r = object : Runnable {
            override fun run() {
                pushProgress(completed = false)
                handler.postDelayed(this, TRACK_INTERVAL_MS)
            }
        }
        trackingRunnable = r
        handler.postDelayed(r, TRACK_INTERVAL_MS)
    }

    private fun stopTracking() {
        trackingRunnable?.let { handler.removeCallbacks(it) }
        trackingRunnable = null
    }

    private fun pushProgress(completed: Boolean) {
        val item = player.currentMediaItem ?: return
        val articleId = item.mediaMetadata.extras?.getInt(MediaItemTree.EXTRA_ARTICLE_ID, -1) ?: -1
        if (articleId <= 0) return
        val positionMs = player.currentPosition
        val durationMs = player.duration
        if (positionMs < 0) return
        val positionSec = (positionMs / 1000L).toInt()
        val durationSec = if (durationMs > 0) (durationMs / 1000L).toInt() else 0
        val progressPct = if (durationSec > 0) {
            ((positionSec.toDouble() / durationSec) * 100).toLong().toDouble() / 100.0
        } else 0.0
        val entry = WatchHistoryEntry(
            articleId = articleId,
            mediaType = "audio",
            categoryId = null,
            positionSec = positionSec,
            durationSec = durationSec,
            progressPct = progressPct,
            completed = completed,
            updatedAt = System.currentTimeMillis()
        )
        Log.d(TAG, "tick: article=$articleId pos=$positionSec/$durationSec pct=$progressPct")
        callback.pushPlaybackProgress(entry)
    }

    private fun handleMediaItemTransition(mediaItem: MediaItem?) {
        val channelId = mediaItem?.mediaMetadata?.extras?.getInt(
            MediaItemTree.EXTRA_CHANNEL_ID, -1
        ) ?: -1

        if (channelId > 0 && RDSNowPlayingService.firestoreDocPath(channelId) != null) {
            rdsService.startListening(channelId)
        } else {
            rdsService.stopListening()
        }
    }

    override fun onGetSession(controllerInfo: MediaSession.ControllerInfo): MediaLibrarySession? {
        return mediaSession
    }

    override fun onDestroy() {
        stopTracking()
        rdsService.stopListening()
        mediaSession.release()
        player.release()
        super.onDestroy()
    }

    companion object {
        private const val TAG = "MyMusicService"
        private const val TRACK_INTERVAL_MS = 10_000L
    }
}
