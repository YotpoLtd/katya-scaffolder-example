export const template = `
<div v-cloak v-scope
    v-intersection="setIntersection()"
    id="yotpo-${{ values.widget_name }}-widget"
    class="yotpo-${{ values.widget_name }}-widget"
    :class="get${{ values.widgetName }}Class()"
    >
	<div class="yotpo-widget-clear" :color="textColor()" >
        <h1>{{welcomeText()}}!</h1>
  </div>
</div>
`
