import 'ember-source/types';
import 'ember-source/types/preview';
import '@glint/environment-ember-loose';
import '@glint/environment-ember-loose/native-integration';

import type { Registry as JSRegistry } from '@nullvoxpopuli/test-rollup-addon-gjs/glint-registry';
import type { Registry as TSRegistry } from '@nullvoxpopuli/test-rollup-addon-gts/glint-registry';

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry extends JSRegistry, TSRegistry {
    // Custom stuff would be added here, but we don't
    // yet have anything custom in the globals
  }
}
