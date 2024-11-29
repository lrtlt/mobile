package lrt.mediapark.lrt.auto

import androidx.media3.common.AudioAttributes
import androidx.media3.common.MediaItem
import androidx.media3.common.Player
import androidx.media3.exoplayer.ExoPlayer
import androidx.media3.session.MediaLibraryService
import androidx.media3.session.MediaSession

class MyMusicService : MediaLibraryService() {

    private lateinit var player: Player
    private lateinit var mediaSession: MediaLibrarySession

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
                        //Maybe implement?
                    }
                })
            }
        player.repeatMode = Player.REPEAT_MODE_ALL

        mediaSession = MediaLibrarySession
            .Builder(this, player, LRTMediaSessionCallback())
            .build()
    }


    override fun onGetSession(controllerInfo: MediaSession.ControllerInfo): MediaLibrarySession? {
        return mediaSession
    }

    override fun onDestroy() {
        mediaSession.release()
        player.release()
        super.onDestroy()
    }
}


