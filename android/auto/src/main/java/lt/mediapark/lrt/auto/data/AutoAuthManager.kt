package lt.mediapark.lrt.auto.data

import android.content.Context
import com.auth0.android.Auth0
import com.auth0.android.authentication.AuthenticationAPIClient
import com.auth0.android.authentication.storage.SecureCredentialsManager
import com.auth0.android.authentication.storage.SharedPreferencesStorage
import kotlin.coroutines.resume
import kotlin.coroutines.resumeWithException
import kotlin.coroutines.suspendCoroutine

class AutoAuthManager(context: Context) {

    private val credentialsManager: SecureCredentialsManager

    init {
        val auth0 = Auth0.getInstance(
            "bRojXnSKqnmaJhQRFY6V0zopGygYrRfg",
            "lrt.eu.auth0.com"
        )
        // DPoP must match the phone app: react-native-auth0 enables it by default and stores a key
        // thumbprint next to the credentials, so a manager without it refuses every refresh with
        // DPOP_NOT_CONFIGURED once the access token the phone app left behind expires.
        val authAPI = AuthenticationAPIClient(auth0).useDPoP(context)
        credentialsManager = SecureCredentialsManager(
            authAPI,
            context,
            auth0,
            SharedPreferencesStorage(context)
        )
    }

    fun isLoggedIn(): Boolean {
        return credentialsManager.hasValidCredentials()
    }

    suspend fun getAccessToken(): String = suspendCoroutine { continuation ->
        credentialsManager.getCredentials(object :
            com.auth0.android.callback.Callback<com.auth0.android.result.Credentials,
                    com.auth0.android.authentication.storage.CredentialsManagerException> {
            override fun onSuccess(result: com.auth0.android.result.Credentials) {
                continuation.resume(result.accessToken)
            }

            override fun onFailure(error: com.auth0.android.authentication.storage.CredentialsManagerException) {
                continuation.resumeWithException(error)
            }
        })
    }
}
