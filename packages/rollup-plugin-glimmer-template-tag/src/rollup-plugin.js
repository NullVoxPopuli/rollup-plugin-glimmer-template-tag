// @ts-check

/**
 * @typedef {import('rollup').PluginImpl} PluginImpl
 */
import fs from 'node:fs/promises';
import path from 'node:path';

import * as babel from '@babel/core';
import { preprocessEmbeddedTemplates } from 'ember-template-imports/lib/preprocess-embedded-templates.js';
import { TEMPLATE_TAG_NAME, TEMPLATE_TAG_PLACEHOLDER } from 'ember-template-imports/lib/util.js';

const PLUGIN_KEY = 'glimmer-template-tag';
const RELEVANT_EXTENSION_REGEX = /\.g([jt]s)$/;

/** @type {PluginImpl} */
export function glimmerTemplateTag() {
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

        if (!result?.id) {
          continue;
        }

        if (RELEVANT_EXTENSION_REGEX.test(result?.id)) {
          return resolutionFor(result.id);
        }
      }

      return;
    },

    async load(id) {
      let originalId = this.getModuleInfo(id)?.meta?.[PLUGIN_KEY]?.originalId ?? id;

      if (originalId !== id) {
        this.addWatchFile(originalId);
      }

      if (RELEVANT_EXTENSION_REGEX.test(originalId)) {
        let intermediate = await preprocessTemplates(originalId);

        let config = await babel.loadPartialConfigAsync();

        // Use the basename so we don't accidentally operate on real files
        let filename = path.basename(originalId);

        /**
         * Because we need to parse the user's code,
         * we can't assume that they're not using custom plugins / syntax.
         *
         * So we *must* use their babel config, and then _only_
         * do the ember-template-imports transform.
         */
        let ast = await babel.parseAsync(intermediate, {
          ...config?.options,
          filename,
          ast: true,
          sourceMaps: 'inline',
        });

        if (!ast) {
          throw new Error('Failed to parse the intermediate output in to Babel AST');
        }

        let result = await babel.transformFromAstAsync(ast, intermediate, {
          babelrc: false,
          configFile: false,
          sourceMaps: 'inline',
          filename: path.basename(originalId),
          // Babel defaults to "guessing" when there is no browserslist past
          // We want to do the least amount of work
          browserslistEnv: 'last 1 firefox versions',
          plugins: ['ember-template-imports/src/babel-plugin'],
        });

        if (result?.code) {
          return result.code;
        }
      }

      return;
    },
  };
}

/**
 * @param {string} originalId
 */
function resolutionFor(originalId) {
  return {
    id: originalId.replace(RELEVANT_EXTENSION_REGEX, '.$1'),
    meta: {
      [PLUGIN_KEY]: { originalId },
    },
  };
}

/**
 * @param {string} modulePath
 */
async function preprocessTemplates(modulePath) {
  // @ts-ignore
  let ember = (await import('ember-source')).default;
  let contents = await fs.readFile(modulePath, 'utf-8');

  // This is basically taken directly from `ember-template-imports`
  let result = preprocessEmbeddedTemplates(contents, {
    relativePath: path.relative('.', modulePath),

    getTemplateLocalsRequirePath: ember.absolutePaths.templateCompiler,
    getTemplateLocalsExportPath: '_GlimmerSyntax.getTemplateLocals',

    templateTag: TEMPLATE_TAG_NAME,
    templateTagReplacement: TEMPLATE_TAG_PLACEHOLDER,

    includeSourceMaps: true,
    includeTemplateTokens: true,
  });

  return result.output;
}
