import { ${{ values.widgetName }}Event } from './models/${{ values.widget_name }}-event.models'
import { ${{ values.widgetName }} } from './widget'

// @ts-ignore
if (typeof yotpoWidgetsContainer !== 'undefined') {
  if (typeof window !== 'undefined' && window.performance && window.performance.mark) {
    window.performance.mark(`yotpo:${${{ values.widgetName }}Event.category}:loaded`)
  }
  // @ts-ignore
  ;(yotpoWidgetsContainer as any)['${{ values.widgetName }}'] = () => new ${{ values.widgetName }}()
}
