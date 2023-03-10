export type mobileDevice = 'MOBILE'
export type tabletDevice = 'TABLET'
export type desktopDevice = 'DESKTOP'
export type laptopDevice = 'LAPTOP'

export type deviceType = mobileDevice | tabletDevice | desktopDevice | laptopDevice

export type displayType = 'S' | 'SM' | 'M' | 'ML' | 'L'

export const DEVICE_TO_DISPLAY_TYPE: { [x: string]: displayType } = {
  MOBILE: 'S',
  TABLET: 'SM',
  LAPTOP: 'M',
  DESKTOP: 'L',
}
