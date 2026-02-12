package lt.mediapark.lrt.auto

import androidx.media3.common.AudioAttributes
import androidx.media3.common.MediaItem
import androidx.media3.common.Player
import androidx.media3.exoplayer.ExoPlayer
import androidx.media3.session.MediaLibraryService
import androidx.media3.session.MediaSession

class MyMusicService : MediaLibraryService() {

    private lateinit var player: Player
    private lateinit var mediaSession: MediaLibrarySession
    private lateinit var rdsService: RDSNowPlayingService

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
                        //Maybe implement?
                    }

                    override fun onMediaItemTransition(mediaItem: MediaItem?, reason: Int) {
                        handleMediaItemTransition(mediaItem)
                    }
                })
            }
        player.repeatMode = Player.REPEAT_MODE_ALL

        rdsService = RDSNowPlayingService(player)

        mediaSession = MediaLibrarySession
            .Builder(this, player, LRTMediaSessionCallback())
            .build()
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
        rdsService.stopListening()
        mediaSession.release()
        player.release()
        super.onDestroy()
    }
}
