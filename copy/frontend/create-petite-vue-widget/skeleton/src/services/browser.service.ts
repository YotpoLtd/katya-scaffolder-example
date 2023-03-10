import { MAX_LAPTOP_WIDTH, MAX_MOBILE_WIDTH } from './view.service'
import { deviceType } from '../models/view.models'
class BrowserService {
  getDeviceType(): deviceType {
    if (BrowserService.isMobileDevice()) {
      return 'MOBILE'
    }

    return BrowserService.deviceTypeByWidth()
  }

  private static isMobileDevice(): boolean {
    if (
      navigator.userAgent.match(/Android/i) ||
      navigator.userAgent.match(/\bAndroid(?:.+)Mobile\b/i) ||
      navigator.userAgent.match(/\bAndroid(?:.+)(?:KF[A-Z]{2,4})\b/i) ||
      navigator.userAgent.match(/\bokhttp\b/i) ||
      navigator.userAgent.match(/\bWindows(?:.+)ARM\b/i) ||
      navigator.userAgent.match(/webOS/i) ||
      navigator.userAgent.match(/iPhone/i) ||
      navigator.userAgent.match(/iPad/i) ||
      navigator.userAgent.match(/iPod/i) ||
      navigator.userAgent.match(/BlackBerry/i) ||
      navigator.userAgent.match(/BB10/i) ||
      navigator.userAgent.match(/Opera Mini/i) ||
      navigator.userAgent.match(/\b(CriOS|Chrome)(?:.+)Mobile/i) ||
      navigator.userAgent.match(/Mobile(?:.+)Firefox\b/i) ||
      navigator.userAgent.match(/Windows Phone/i)
    ) {
      return true
    }
    return false
  }

  private static deviceTypeByWidth(): deviceType {
    if (window.innerWidth < MAX_MOBILE_WIDTH) {
      return 'MOBILE'
    } else if (window.innerWidth < MAX_LAPTOP_WIDTH) {
      return 'LAPTOP'
    } else {
      return 'DESKTOP'
    }
  }
}

export default new BrowserService()
