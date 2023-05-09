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
/**
 * Capture group used to extract the non-glimmer version of the extension
 * used in the `load` hook.
 */
const RELEVANT_EXTENSION_REGEX = /\.g([jt]s)$/;

/**
 * Rollup plugin that does a two-phase transform to convert <template> tags to vanilla JS.
 * 1. preprocess the <template> tag into a secret internal format
 * 2. convert that secret internal format into vanilla JS that a consuming build environment knows how to handle
 *
 * @typedef {object} Options
 * @property {boolean} [preprocessOnly] tells this rollup plugin to only do the first part of the <template> transform
 * @param {Options} options
 *
 * @type {PluginImpl}
 * */
export function glimmerTemplateTag(options) {
  let { preprocessOnly } = options || {};

  preprocessOnly ??= true;

  return {
    name: 'preprocess-glimmer-template-tag',
    async resolveId(source, importer, options) {
      let resolution = await this.resolve(source, importer, { ...options, skipSelf: true });

      /**
       * When there is no extension provided, we need to *guess*
       * if the importer is intending to use gjs or gts.
       *
       * This is true even if we have the `nodeResolve` plugin included.
       */
      if (!resolution && !path.extname(source)) {
        return (
          (await this.resolve(source + '.gts', importer, { ...options })) ||
          (await this.resolve(source + '.gjs', importer, { ...options }))
        );
      }

      if (resolution?.external) {
        return resolution;
      }

      /**
       * We mix in metadata to the resolution so that when `load` occurs,
       * we can swap out with the precompiled code.
       */
      if (resolution?.id && RELEVANT_EXTENSION_REGEX.test(resolution.id)) {
        let result = resolutionFor(resolution.id);

        return result;
      }

      return resolution;
    },

    async load(id) {
      let originalId = this.getModuleInfo(id)?.meta?.[PLUGIN_KEY]?.originalId ?? id;

      if (originalId !== id) {
        this.addWatchFile(originalId);
      }

      if (RELEVANT_EXTENSION_REGEX.test(originalId)) {
        return transformGlimmerTemplateTag(originalId, preprocessOnly);
      }

      return;
    },
  };
}

/**
 * @param {string} originalId
 * @param {boolean} [ preprocessOnly ]
 */
async function transformGlimmerTemplateTag(originalId, preprocessOnly) {
  let intermediate = await preprocessTemplates(originalId);

  if (preprocessOnly) {
    return intermediate;
  }

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

  throw new Error('Failed to generate code from Babel AST');
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
