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
                                stopTracking()
                                // Notify *after* the push resolves. Every browse re-fetches, so
                                // notifying first races the PUT and the finished row can come
                                // back from the server still marked unfinished.
                                pushProgress(completed = true) {
                                    callback.notifyContinuePlayingChanged()
                                }
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
                        // Podcast episode queues grow as they are consumed — the stream URL of an
                        // episode only exists in its article payload, so the rest of the list is
                        // resolved a couple of items ahead rather than all at once.
                        callback.topUpEpisodeQueue(player)
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

    /**
     * Builds and pushes one watch-history entry, mirroring the phone app's
     * `playback_progress_store.upsertProgress` — that store is the source of truth for what an
     * entry means, and Android Auto writes the same endpoint, so the rules have to match or the
     * two clients disagree about the same article. CarPlay's `PlayerController` carries the same
     * logic.
     *
     * [completed] is the *caller's* signal (playback reached `STATE_ENDED`). What actually ships
     * is derived, because anything past [PLAYBACK_COMPLETED_PCT] counts as finished too — a
     * driver who skips the outro should not be offered the last few seconds forever.
     */
    private fun pushProgress(completed: Boolean, onPushed: (() -> Unit)? = null) {
        val item = player.currentMediaItem ?: return onPushed.runIfSet()
        val articleId = item.mediaMetadata.extras?.getInt(MediaItemTree.EXTRA_ARTICLE_ID, -1) ?: -1
        if (articleId <= 0) return onPushed.runIfSet()
        val positionMs = player.currentPosition
        val durationMs = player.duration
        if (positionMs < 0) return onPushed.runIfSet()
        val positionSec = (positionMs / 1000L).toInt()
        val durationSec = if (durationMs > 0) (durationMs / 1000L).toInt() else 0

        // No duration means no progress can be expressed, and an entry that can never satisfy the
        // completion threshold would sit in the list forever. `upsertProgress` drops these too.
        if (durationSec <= 0) return onPushed.runIfSet()

        val rawPct = (positionSec.toDouble() / durationSec).coerceIn(0.0, 1.0)
        val progressPct = Math.round(rawPct * 100).toDouble() / 100.0
        val isCompleted = completed || progressPct >= PLAYBACK_COMPLETED_PCT

        // Below the resume threshold there is nothing worth continuing from. A completed entry
        // always goes through regardless — that write is what clears the row.
        if (!isCompleted && positionSec < PLAYBACK_MIN_POSITION_SEC) return onPushed.runIfSet()

        val entry = WatchHistoryEntry(
            articleId = articleId,
            mediaType = "audio",
            categoryId = null,
            // A finished entry is normalised to the start rather than left at the end, so that if
            // it is ever surfaced again — replayed, or returned to a client that does not filter
            // `completed` — resuming lands at 0 rather than in the outro.
            positionSec = if (isCompleted) 0 else positionSec,
            durationSec = durationSec,
            progressPct = if (isCompleted) 1.0 else progressPct,
            completed = isCompleted,
            updatedAt = System.currentTimeMillis()
        )
        Log.d(
            TAG,
            "tick: article=$articleId pos=$positionSec/$durationSec pct=$progressPct " +
                "completed=$isCompleted"
        )
        callback.pushPlaybackProgress(entry, onPushed)
    }

    /**
     * Invokes the callback if there is one, returning `Unit` so it can be used as `return
     * onPushed.runIfSet()`. Every bail-out in [pushProgress] has to go through it, or a caller
     * that sequenced a repaint behind the push waits forever.
     */
    private fun (() -> Unit)?.runIfSet() { this?.invoke() }

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
        callback.release()
        mediaSession.release()
        player.release()
        super.onDestroy()
    }

    companion object {
        private const val TAG = "MyMusicService"
        private const val TRACK_INTERVAL_MS = 10_000L

        /**
         * Mirrors of the phone app's `PLAYBACK_PROGRESS_*` constants in `app/constants/index.ts`,
         * and of CarPlay's copies in `PlayerController`. All three clients write the same
         * watch-history endpoint, so these are kept in step by hand — nothing enforces it.
         */
        private const val PLAYBACK_COMPLETED_PCT = 0.95
        private const val PLAYBACK_MIN_POSITION_SEC = 6
    }
}
