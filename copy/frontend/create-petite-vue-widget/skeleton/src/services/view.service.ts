import { DEVICE_TO_DISPLAY_TYPE, deviceType, displayType } from '../models/view.models'

export const MAX_MOBILE_WIDTH = 480
export const MAX_LAPTOP_WIDTH = 1440

export const COLORS = {
  yotpoTransparent: 'transparent',
  yotpoBlack: '#373330',
  yotpoB2BDarkBlue: '#051146',
  yotpoBlue: '#0042e4',
  yotpoSkyBlue: '#2e4f7c',
  yotpoSkyBlueDarker: '#203756',
  yotpoPrimaryTextBlack: '#2C2C2C',
  yotpoDisabled: '#D8D8D8',
  yotpoEmptyWhite: '#FFFFFF',
}

class ViewService {
  calcDisplayType(calcDeviceType: deviceType): displayType {
    return DEVICE_TO_DISPLAY_TYPE[calcDeviceType]
  }
}

export default new ViewService()
