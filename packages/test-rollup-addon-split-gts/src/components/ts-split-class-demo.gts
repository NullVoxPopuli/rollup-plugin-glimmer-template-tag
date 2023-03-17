import Component from '@glimmer/component';
import { service } from '@ember/service';

import type RouterService from '@ember/routing/router-service';

export default class TsClassDemo extends Component {
  // Need TS Syntax for confident test
  @service declare router: RouterService;

  greeting = 'Hello World!';

  <template>
    TS Split Class Demo: {{this.greeting}}
  </template>
}
