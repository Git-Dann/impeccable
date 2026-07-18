/**
 * Framework-neutral Design Doctor live chrome contract.
 *
 * The production browser bundle is intentionally plain DOM so Svelte, React,
 * Vue, and static adapters can all mount the same chrome. This module is the
 * testable contract/inventory for that bundle; live-browser.js mirrors these
 * values at runtime because it is served as a standalone script.
 */

export const LIVE_CHROME_MOUNT_CONTRACT = Object.freeze([
  'root',
  'transport',
  'state',
  'actions',
]);

export const LIVE_UI_SURFACES = Object.freeze([
  {
    key: 'global-bottom-bar',
    ids: [
      'design-doctor-live-global-bar',
      'design-doctor-live-global-bar-brand',
      'design-doctor-live-pick-toggle',
      'design-doctor-live-insert-toggle',
      'design-doctor-live-detect-toggle',
      'design-doctor-live-detect-badge',
      'design-doctor-live-design-toggle',
      'design-doctor-live-page-chat',
      'design-doctor-live-page-chat-input',
      'design-doctor-live-page-chat-voice',
    ],
    states: ['rest', 'hover', 'focus-visible', 'pressed', 'active', 'tooltip'],
  },
  {
    key: 'pending-copy-edit-dock',
    ids: ['design-doctor-live-pending-dock'],
    states: ['closed', 'open', 'hover', 'pressed', 'loading', 'rollback', 'keep-fixing'],
  },
  {
    key: 'element-selection-chrome',
    ids: [
      'design-doctor-live-highlight',
      'design-doctor-live-tooltip',
      'design-doctor-live-bar',
      'design-doctor-live-selection-pill',
      'design-doctor-live-input',
      'design-doctor-live-configure-voice',
      'design-doctor-live-configure-bar-tooltip',
    ],
    states: ['rest', 'hover', 'focus-visible', 'pressed', 'disabled'],
  },
  {
    key: 'action-picker',
    ids: ['design-doctor-live-picker'],
    states: ['closed', 'open', 'option-hover', 'option-focus'],
  },
  {
    key: 'edit-chrome',
    ids: ['design-doctor-live-edit-badge'],
    states: ['enabled', 'disabled', 'editing', 'cancel', 'save', 'edited-content'],
  },
  {
    key: 'generating-row',
    ids: ['design-doctor-live-bar', 'design-doctor-live-shader'],
    states: ['action-label', 'animated-dots', 'generating', 'done'],
  },
  {
    key: 'variant-cycling-row',
    ids: ['design-doctor-live-bar', 'design-doctor-live-params-panel'],
    states: ['variant-1', 'variant-2', 'variant-3', 'left-disabled', 'right-disabled', 'dot-click', 'accept', 'discard'],
  },
  {
    key: 'variant-params-panel',
    ids: ['design-doctor-live-params-panel'],
    states: ['closed', 'open-above', 'open-below', 'range', 'steps', 'toggle'],
  },
  {
    key: 'saving-confirmed-rows',
    ids: ['design-doctor-live-bar'],
    states: ['saving', 'applying-variant', 'confirmed'],
  },
  {
    key: 'insert-mode-chrome',
    ids: [
      'design-doctor-live-insert-line',
      'design-doctor-live-insert-placeholder',
      'design-doctor-live-placeholder-resize',
      'design-doctor-live-insert-input',
      'design-doctor-live-insert-voice',
      'design-doctor-live-insert-create',
      'design-doctor-live-insert-create-tooltip',
    ],
    states: ['toggle-active', 'line', 'placeholder', 'resize', 'enabled', 'disabled', 'tooltip'],
  },
  {
    key: 'annotation-chrome',
    ids: [
      'design-doctor-live-annot',
      'design-doctor-live-annot-svg',
      'design-doctor-live-annot-pins',
      'design-doctor-live-annot-clear',
    ],
    states: ['overlay', 'drawing', 'pin', 'pin-edit', 'clear'],
  },
  {
    key: 'design-system-panel',
    ids: ['design-doctor-live-design-host'],
    states: ['closed', 'open', 'tabs', 'token-tiles', 'copy'],
  },
  {
    key: 'toasts-and-errors',
    ids: ['design-doctor-live-toast'],
    states: ['normal', 'error', 'no-variants-mounted'],
  },
  {
    key: 'css-isolation-boundary',
    ids: ['design-doctor-live-root'],
    states: ['shadow-root', 'style-tags', 'hostile-css'],
  },
]);

export const LIVE_UI_COMPONENT_IDS = Object.freeze([
  ...new Set(LIVE_UI_SURFACES.flatMap((surface) => surface.ids)),
]);

export function resolveLiveUiRoot(env = globalThis) {
  const doc = env?.document;
  const explicit = env?.__DESIGN_DOCTOR_LIVE_UI_ROOT__
    || env?.window?.__DESIGN_DOCTOR_LIVE_UI_ROOT__;
  if (explicit && typeof explicit.appendChild === 'function') return explicit;
  return doc?.body || null;
}

export function getLiveUiElementById(id, env = globalThis) {
  const doc = env?.document;
  const root = resolveLiveUiRoot(env);
  if (!id) return null;
  if (root?.getElementById) {
    const found = root.getElementById(id);
    if (found) return found;
  }
  if (root?.querySelector) {
    const found = root.querySelector('#' + escapeCssIdent(id));
    if (found) return found;
  }
  return doc?.getElementById?.(id) || null;
}

export function appendToLiveUiRoot(el, env = globalThis) {
  const root = resolveLiveUiRoot(env);
  if (!root) throw new Error('Design Doctor live UI root is not available');
  root.appendChild(el);
  return el;
}

export function appendStyleToLiveUiRoot(styleEl, env = globalThis) {
  const doc = env?.document;
  const root = resolveLiveUiRoot(env);
  if (root && root !== doc?.body) {
    root.appendChild(styleEl);
  } else {
    (doc?.head || doc?.body || root).appendChild(styleEl);
  }
  return styleEl;
}

export function activeElementDeep(doc = globalThis.document) {
  let active = doc?.activeElement || null;
  while (active?.shadowRoot?.activeElement) {
    active = active.shadowRoot.activeElement;
  }
  return active;
}

function escapeCssIdent(value) {
  if (typeof CSS !== 'undefined' && typeof CSS.escape === 'function') {
    return CSS.escape(String(value));
  }
  return String(value).replace(/([ !"#$%&'()*+,./:;<=>?@[\\\]^`{|}~])/g, '\\$1');
}
