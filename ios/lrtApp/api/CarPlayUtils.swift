import Foundation

class CarPlayUtils {
  static func getCoverByChannelId(channelId: Int) -> String {
    switch channelId {
    case 1: return "https://www.lrt.lt/images/app_logo/LTV1.png?v=2"
    case 2: return "https://www.lrt.lt/images/app_logo/LTV2.png?v=2"
    case 3: return "https://www.lrt.lt/images/app_logo/WORLD.png?v=2"
    case 5: return "https://www.lrt.lt/images/app_logo/Klasika.png?v=2"
    case 6: return "https://www.lrt.lt/images/app_logo/Opus.png?v=2"
    case 37: return "https://www.lrt.lt/images/app_logo/LRT100.png?v=2"
    default: return "https://www.lrt.lt/images/app_logo/LR.png?v=2"
    }
  }
}
