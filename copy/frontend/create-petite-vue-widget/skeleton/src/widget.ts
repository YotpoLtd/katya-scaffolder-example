import { MerchantMetadata, Widget, MapObject, WidgetOptions, loadFonts } from '@ugc-storefront/core' //todo
import { StoreService } from './services/store.service'
import { ${{values.widget_type}}Component } from './components/${{values.widget_type | lower }}.component'
import { SectionType } from './models/customizations.models'
import { getValueOrDefault } from './services/customizations.service'

export class ${{values.widget_type}} implements Widget {
  private element!: Element
  private instanceId!: string
  private productId!: string
  private merchantData!: MerchantMetadata
  private staticContent!: any
  private overridenCustomizations!: MapObject
  private instaceVersionId!: string
  private startLoadDate!: Date
  private areFontsLoaded!: WidgetOptions['areFontsLoaded']
  private storeLanguage!: string

  init(widgetOptions: WidgetOptions): void {
    this.startLoadDate = new Date()
    if (widgetOptions.element.classList.contains('yotpo-widget-instance')) {
      this.element = widgetOptions.element
      this.element.classList.remove('yotpo-widget-instance')
    } else {
      return
    }
    this.instanceId = this.element.getAttribute('data-yotpo-instance-id') || ''
    this.productId = this.element.getAttribute('data-yotpo-product-id') || this.element.getAttribute('data-yotpo-cart-product-id') || ''
    this.storeLanguage = this.element.getAttribute('data-yotpo-language-code') || ''
    this.instaceVersionId = widgetOptions.metadata.instanceVersionId || ''
    this.merchantData = widgetOptions.merchantData // merchant id of widgetsRepo app_key
    this.staticContent = widgetOptions.metadata.staticContent
    this.areFontsLoaded = widgetOptions.areFontsLoaded
    const customizations = this.getLowerCaseKeysMap(widgetOptions.metadata.customizations)
    this.overridenCustomizations = this.getCustomizations(customizations)
  }

  run() {
    if (this.element === undefined || this.element === null) {
      return
    }
    if (this.overridenCustomizations['mode-read-only']) {
      const fullHtmlElement = document.createElement('div')
      const fullHtmlStyleLink = document.createElement('style')
      document.getElementsByTagName('head')[0].appendChild(fullHtmlStyleLink)
      if (this.element.parentNode) {
        this.element.parentNode.appendChild(fullHtmlElement)
      }
    }
    const storeService: any = new StoreService(
      this.element,
      this.overridenCustomizations,
      this.staticContent,
      this.merchantData.guid,
      this.productId,
      this.instanceId,
      this.instaceVersionId,
      this.storeLanguage,
      { startLoadDate: this.startLoadDate },
    )
    storeService.awaitInitComplete().then(() => {
      const { config } = storeService.getConfig()

      if (!this.areFontsLoaded) {
        const fontFamilyAndUrl = {
          family: config.primaryFont.font.family,
          url: config.primaryFont.font.url,
        }
        loadFonts(document, this.element.parentElement, [fontFamilyAndUrl])
      }
      if (this.element.parentNode && this.overridenCustomizations['mode-read-only']) {
        this.element.parentNode.removeChild(this.element)
      }
      new ${{values.widget_type}}Component(storeService)
    })
  }

  getLowerCaseKeysMap(map: { [key: string]: string }): {
    [key: string]: string
  } {
    const loweCaseKeysMap: { [key: string]: string } = {}
    Object.keys(map).forEach((key) => {
      loweCaseKeysMap[key.toLowerCase()] = map[key]
    })
    return loweCaseKeysMap
  }

  getCustomizations(customizations: any) {
    const urlParams = this.getQueryParams()
    const elementAttributes = this.getElementAttributes()
    customizations = { ...customizations, ...elementAttributes, ...urlParams }
    if (customizations['mode-read-only']) {
      if (getValueOrDefault(customizations['product-page-preview'], true) && !getValueOrDefault(customizations['other-pages-preview'], false)) {
        customizations['data-yotpo-section-id'] = SectionType.PRODUCT
      } else {
        customizations['data-yotpo-section-id'] = SectionType.CATEGORY
      }
    }
    return customizations
  }

  getElementAttributes(): { [key: string]: string } {
    const attributes: { [key: string]: string } = {}
    for (let i = 0, atts = this.element.attributes, n = atts.length; i < n; i++) {
      const attribueName = atts[i].nodeName
      attributes[attribueName.toLowerCase()] = (atts[i].nodeValue || '').toString()
    }
    return attributes
  }
  getQueryParams(): any {
    const excludedParams: string[] = ['view-preview-html-container', 'view-preview-style']
    const queryString = window.location.search.substring(1)
    const params: any = {}
    const queries = queryString.split('&')
    queries.forEach((indexQuery: string) => {
      if (!excludedParams.includes(indexQuery)) {
        const indexPair = indexQuery.split('=')
        const queryKey = decodeURIComponent(indexPair[0]).toLowerCase()
        const queryValue = decodeURIComponent(indexPair.length > 1 ? indexPair[1] : '')
        // @ts-ignore
        params[queryKey] = queryValue
      }
    })
    return params
  }
}
