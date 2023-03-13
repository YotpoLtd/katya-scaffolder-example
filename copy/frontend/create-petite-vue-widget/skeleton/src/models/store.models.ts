export interface FontStyle {
  font: {
    family: string
    url: string
    weight: string
    style: string
    size: string
  }
}

export interface WidgetStore {
  sequence: number
  analyticsLoaded: boolean
  commit: Function
}

export interface WidgetConfig {
  element: any
  sectionId: string
  storeId: string
  sessionId: string
  instanceId: string
  staticContent: any
  instanceVersionId: string
  startLoadDate: Date
  isReadOnly: boolean
  isPreview: boolean
  isLoading: boolean
  primaryFont: FontStyle
  storeLanguage: string
  headlineText: string
  welcomeText: string
}

export interface WidgetActions {
  trackEvent: Function
  trackAppShown: Function
  trackError: Function
  trackLoaded: Function
  trackClicked: Function
  trackWidgetLoaded: Function
}

export interface ViewStoreModule {
  primaryColor: string
  textColor: string
  backgroundColor: string
  primaryFont: FontStyle
  deviceType: string
  displayType: string
}
