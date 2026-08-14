import Auth0
import Foundation

class CarPlayAuthManager {
  static let shared = CarPlayAuthManager()

  private let credentialsManager: CredentialsManager

  private init() {
    let auth = Auth0.authentication(
      clientId: "bRojXnSKqnmaJhQRFY6V0zopGygYrRfg",
      domain: "lrt.eu.auth0.com"
    )
    credentialsManager = CredentialsManager(authentication: auth)
  }

  func isLoggedIn() -> Bool {
    return credentialsManager.canRenew()
  }

  func getAccessToken() async throws -> String {
    let credentials = try await credentialsManager.credentials(
      withScope: "openid profile email offline_access",
      minTTL: 60,
      parameters: ["audience": Self.apiAudience]
    )
    return credentials.accessToken
  }

  /// Must match the phone app's `AUTH0_AUDIENCE`. Renewing without it yields a token the
  /// watch-history and subscriptions APIs reject.
  private static let apiAudience = "https://www.lrt.lt/servisai/authrz"
}
