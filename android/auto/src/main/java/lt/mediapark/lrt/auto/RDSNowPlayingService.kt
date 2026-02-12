package lt.mediapark.lrt.auto

import android.util.Log
import androidx.media3.common.Player
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.ListenerRegistration

class RDSNowPlayingService(private val player: Player) {

    private var listener: ListenerRegistration? = null
    private var currentChannelId: Int? = null

    fun startListening(channelId: Int) {
        if (currentChannelId == channelId && listener != null) return

        stopListening()

        val docPath = firestoreDocPath(channelId) ?: return

        currentChannelId = channelId
        val db = FirebaseFirestore.getInstance()
        listener = db.document(docPath).addSnapshotListener { snapshot, error ->
            if (error != null) {
                Log.e(TAG, "Error listening to $docPath: ${error.message}")
                return@addSnapshotListener
            }

            val info = snapshot?.getString("info") ?: return@addSnapshotListener

            val songTitle = if (info.startsWith(ETERYJE_PREFIX)) {
                info.removePrefix(ETERYJE_PREFIX)
            } else {
                info
            }

            updateMediaSessionArtist(songTitle)
        }
    }

    fun stopListening() {
        listener?.remove()
        listener = null
        currentChannelId = null
    }

    private fun updateMediaSessionArtist(artist: String) {
        val currentItem = player.currentMediaItem ?: return
        val currentIndex = player.currentMediaItemIndex

        val updatedMetadata = currentItem.mediaMetadata.buildUpon()
            .setArtist(artist)
            .build()

        val updatedItem = currentItem.buildUpon()
            .setMediaMetadata(updatedMetadata)
            .build()

        player.replaceMediaItem(currentIndex, updatedItem)
    }

    companion object {
        private const val TAG = "RDSNowPlayingService"
        private const val ETERYJE_PREFIX = "Eteryje: "

        fun firestoreDocPath(channelId: Int): String? {
            return when (channelId) {
                5 -> "rds/klasika"
                6 -> "rds/opus"
                37 -> "rds/lrt100"
                else -> null
            }
        }
    }
}
