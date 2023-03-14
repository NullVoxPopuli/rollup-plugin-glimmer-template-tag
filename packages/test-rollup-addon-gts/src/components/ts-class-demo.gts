import Component from '@glimmer/component';

export default class TsClassDemo extends Component {
  greeting = 'Hello World!';

  <template>
    TS Class Demo: {{this.greeting}}
  </template>
}
