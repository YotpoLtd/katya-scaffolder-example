import { PixelEvent } from 'widgets-shared-services'

export class ${{ values.widgetName }}Event {
  static category = '${{ values.widget_name }}-widget'
  static create(event: PixelEvent): PixelEvent {
    return {
      ...event,
      category: this.category,
    }
  }
}

export interface AnalyticsParams {
  label: string
  property: string
  context?: object
}
