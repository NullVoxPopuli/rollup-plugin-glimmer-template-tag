// @ts-check
import fs from 'node:fs/promises';
import path from 'node:path';

import { preprocessEmbeddedTemplates } from './preprocess-embedded-templates';
import { TEMPLATE_TAG_NAME, TEMPLATE_TAG_PLACEHOLDER } from './util';

const PLUGIN_KEY = 'glimmer-template-tag';
const RELEVANT_EXTENSION_REGEX = /\.g([jt]s)$/;

export default function firstClassComponentTemplates() {
  return {
    name: 'preprocess-glimmer-template-tag',
    async resolveId(source, importer, options) {
      if (source.endsWith('.hbs')) return;

      for (let ext of ['', '.gjs', '.gts']) {
        let result = await this.resolve(source + ext, importer, {
          ...options,
          skipSelf: true,
        });

        if (result?.external) {
          return;
        }

        if (RELEVANT_EXTENSION_REGEX.test(result?.id)) {
          return resolutionFor(result.id);
        }
      }
    },

    async load(id) {
      let originalId = this.getModuleInfo(id)?.meta?.[PLUGIN_KEY]?.originalId ?? id;

      if (originalId !== id) {
        this.addWatchFile(originalId);
      }

      if (RELEVANT_EXTENSION_REGEX.test(originalId)) {
        return await preprocessTemplates(originalId);
      }
    },
  };
}

function resolutionFor(originalId) {
  return {
    id: originalId.replace(RELEVANT_EXTENSION_REGEX, '.$1'),
    meta: {
      [PLUGIN_KEY]: { originalId },
    },
  };
}

async function preprocessTemplates(id) {
  let ember = (await import('ember-source')).default;
  let contents = await fs.readFile(id, 'utf-8');

  // This is basically taken directly from `ember-template-imports`
  let result = preprocessEmbeddedTemplates(contents, {
    relativePath: path.relative('.', id),

    getTemplateLocalsRequirePath: ember.absolutePaths.templateCompiler,
    getTemplateLocalsExportPath: '_GlimmerSyntax.getTemplateLocals',

    templateTag: TEMPLATE_TAG_NAME,
    templateTagReplacement: TEMPLATE_TAG_PLACEHOLDER,

    includeSourceMaps: true,
    includeTemplateTokens: true,
  });

  return result.output;
}
