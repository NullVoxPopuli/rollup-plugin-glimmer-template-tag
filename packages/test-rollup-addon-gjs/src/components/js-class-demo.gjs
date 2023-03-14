import Component from '@glimmer/component';

export default class JsClassDemo extends Component {
  greeting = 'Hello World!';

  <template>
    JS Class Demo: {{this.greeting}}
  </template>
}
