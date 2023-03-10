import { FontService, MapObject } from 'widgets-shared-services'
import { ObjectUtils } from 'widgets-utils'
import { ViewStoreModule } from '../models/store.models'
import browserService from '../services/browser.service'
import { Customizations } from '../services/customizations.service'
import viewService, { COLORS } from '../services/view.service'

const parseColor = (colorString: string, defaultValue: string) => {
  if (!colorString) {
    return defaultValue
  }
  const isHexColorCode = colorString.includes('#')
  return isHexColorCode ? colorString : rgbaToHEX(colorString, defaultValue)
}
const rgbaToHEX = (rgbaString: string, defaultValue: string) => {
  if (!rgbaString) {
    return defaultValue
  }
  const paredValues = rgbaString.match(/\d+/g) || []
  let [r, g, b, a] = paredValues

  // @ts-ignore
  r = r.toString(16)
  // @ts-ignore
  g = g.toString(16)
  // @ts-ignore
  b = b.toString(16)
  // @ts-ignore
  a = Math.round(a * 255).toString(16)

  if (r.length == 1) r = '0' + r
  if (g.length == 1) g = '0' + g
  if (b.length == 1) b = '0' + b
  if (a.length == 1) a = '0' + a
  return `#${r}${g}${b}${a}`
}

export const getViewConfigurations = (customizationsOverrides: MapObject): ViewStoreModule => {
  const initialViewCustomizations = {
    isMobileOverride: {
      default: false,
      key: 'is-mobile',
    },
    primaryColor: {
      default: COLORS.yotpoSkyBlue,
      key: 'view-primary-color',
    },
    textColor: {
      default: COLORS.yotpoBlack,
      key: 'view-text-color',
    },
    backgroundColor: {
      default: COLORS.yotpoTransparent,
      key: 'view-background-color',
    },
    primaryFont: {
      font: {
        family: {
          default: 'Nunito Sans@400|https://cdn-widgetsrepository.yotpo.com/web-fonts/css/nunito_sans/v1/nunito_sans_400.css',
          key: 'view-primary-font',
          getter(fontNameAndUrl: string): string {
            return FontService.getFontFamily(fontNameAndUrl, '|')
          },
        },
        url: {
          default: 'Nunito Sans@400|https://cdn-widgetsrepository.yotpo.com/web-fonts/css/nunito_sans/v1/nunito_sans_400.css',
          key: 'view-primary-font',
          getter(fontNameAndUrl: string): string {
            return FontService.getFontUrl(fontNameAndUrl, '|')
          },
        },
        weight: {
          default: 'Nunito Sans@400|https://cdn-widgetsrepository.yotpo.com/web-fonts/css/nunito_sans/v1/nunito_sans_400.css',
          key: 'view-primary-font',
          getter(fontNameAndUrl: string): string {
            return FontService.getFontWeight(fontNameAndUrl)
          },
        },
        style: {
          default: 'Nunito Sans@400|https://cdn-widgetsrepository.yotpo.com/web-fonts/css/nunito_sans/v1/nunito_sans_400.css',
          key: 'view-primary-font',
          getter(fontNameAndUrl: string): string {
            return FontService.getFontStyle(fontNameAndUrl)
          },
        },
      },
    },
  }

  const cleanedCustomizations = ObjectUtils.removeEmptyFields(customizationsOverrides)
  const initialViewState = {
    deviceType: 'DESKTOP',
    displayType: 'L',
    primaryColor: parseColor(cleanedCustomizations['view-primary-color'], COLORS.yotpoSkyBlue),
    textColor: parseColor(cleanedCustomizations['view-text-color'], COLORS.yotpoBlack),
    backgroundColor: parseColor(cleanedCustomizations['view-background-color'], COLORS.yotpoTransparent),
    primaryFont: {
      font: {
        family: "'Nunito Sans'",
        url: 'Nunito Sans@400|https://cdn-widgetsrepository.yotpo.com/web-fonts/css/nunito_sans/v1/nunito_sans_400.css',
        weight: '400',
        style: 'normal',
        size: '14',
      },
    },
  }
  const mappedValues = Customizations.mapValuesToKeys(initialViewCustomizations, cleanedCustomizations)
  if (!cleanedCustomizations['is-mobile'] != null) {
    mappedValues.deviceType = browserService.getDeviceType()
    mappedValues.displayType = viewService.calcDisplayType(mappedValues.deviceType)
  } else if (cleanedCustomizations['is-mobile'].toLowerCase()) {
    mappedValues.deviceType = 'MOBILE'
    mappedValues.displayType = 'S'
  }
  return {
    ...initialViewState,
    ...mappedValues,
  }
}
