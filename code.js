"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
figma.showUI("<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n<meta charset=\"UTF-8\" />\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n<title>Text Token Extractor</title>\n<style>\n*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}\n\nhtml, body {\n  width: 100%;\n  height: 100%;\n  overflow: hidden;\n}\n\nbody {\n  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;\n  font-size: 11px;\n  background: var(--figma-color-bg);\n  color: var(--figma-color-text);\n  display: flex;\n  flex-direction: column;\n  height: 100vh;\n}\n\n::-webkit-scrollbar { width: 3px; }\n::-webkit-scrollbar-track { background: transparent; }\n::-webkit-scrollbar-thumb { background: var(--figma-color-border-strong); border-radius: 4px; }\n\n.body {\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n  overflow: hidden;\n  position: relative;\n  min-height: 0;\n}\n\n.empty {\n  flex: 1;\n  padding: 32px 16px;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  gap: 8px;\n  text-align: center;\n}\n\n.empty-text { font-size: 11px; color: var(--figma-color-text-secondary); line-height: 1.5; }\n.empty-hint { font-size: 11px; color: var(--figma-color-text-tertiary); }\n\n.tokens-scroll {\n  flex: 1;\n  overflow-y: auto;\n  min-height: 0;\n}\n\n.token-section {\n  padding: 8px;\n  border-bottom: 1px solid var(--figma-color-border);\n}\n\n.token-section:last-child {\n  border-bottom: none;\n}\n\n.card-container {\n  border: 1px solid var(--figma-color-border);\n  border-radius: 4px;\n  overflow: hidden;\n}\n\n/* Card header: layer name + chevron */\n.card-header {\n  height: 32px;\n  padding: 0 8px;\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  background: var(--figma-color-bg-secondary);\n  border-bottom: 1px solid var(--figma-color-border);\n  flex-shrink: 0;\n  cursor: pointer;\n  transition: background 80ms;\n}\n\n.card-header:hover {\n  background: var(--figma-color-bg-hover);\n}\n\n.card-header:active {\n  background: var(--figma-color-bg-tertiary);\n}\n\n.card-header.open {\n  background: var(--figma-color-bg-hover);\n}\n\n.token-layer {\n  font-size: 11px;\n  font-weight: 500;\n  color: var(--figma-color-text-secondary);\n  flex: 1;\n  min-width: 0;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n.chevron-btn {\n  width: 24px;\n  height: 24px;\n  border-radius: 4px;\n  flex-shrink: 0;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n  background: transparent;\n  border: none;\n  color: var(--figma-color-icon-tertiary);\n  transition: color 120ms;\n  padding: 0;\n}\n\n.chevron-btn svg {\n  transition: transform 200ms;\n}\n\n.chevron-btn.open svg {\n  transform: rotate(180deg);\n}\n\n/* Token ID row — always visible, larger and copy-friendly */\n.token-id-row {\n  min-height: 40px;\n  padding: 0 0 0 8px;\n  display: flex;\n  align-items: center;\n  gap: 4px;\n  border-bottom: 1px solid var(--figma-color-border);\n  background: transparent;\n  transition: background 80ms;\n  cursor: pointer;\n}\n\n.token-id-row:hover {\n  background: var(--figma-color-bg-hover);\n}\n\n.token-id-row:active {\n  background: var(--figma-color-bg-tertiary);\n}\n\n.token-id-text {\n  flex: 1;\n  min-width: 0;\n  font-size: 11px;\n  color: var(--figma-color-text);\n  word-break: break-all;\n  line-height: 1.4;\n  padding: 8px 0;\n}\n\n.token-id-copy {\n  width: 32px;\n  min-height: 40px;\n  flex-shrink: 0;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n  background: transparent;\n  border: none;\n  color: var(--figma-color-icon-tertiary);\n  transition: color 120ms;\n  padding: 0;\n}\n\n.token-id-row:hover .token-id-copy {\n  color: var(--figma-color-icon);\n}\n\n.token-id-copy.ok {\n  color: var(--figma-color-icon);\n}\n\n/* Modes grid */\n.modes-grid {\n  display: none;\n  grid-template-columns: 80px 1fr auto;\n}\n\n.modes-grid.open {\n  display: grid;\n}\n\n.mrow {\n  display: contents;\n}\n\n.mrow:last-child > .mtag,\n.mrow:last-child > .mval,\n.mrow:last-child > .copy-btn { border-bottom: none; }\n\n.mrow:hover > .mtag,\n.mrow:hover > .mval,\n.mrow:hover > .copy-btn { background: var(--figma-color-bg-hover); }\n\n.mtag {\n  display: flex;\n  align-items: center;\n  padding: 0 8px;\n  min-height: 32px;\n  font-size: 11px;\n  font-weight: 400;\n  color: var(--figma-color-text-tertiary);\n  white-space: nowrap;\n  border-bottom: 1px solid var(--figma-color-border);\n  border-right: 1px solid var(--figma-color-border);\n  transition: background 80ms;\n}\n\n.mval {\n  min-width: 0;\n  padding: 6px 8px;\n  font-size: 11px;\n  color: var(--figma-color-text);\n  word-break: break-word;\n  border-bottom: 1px solid var(--figma-color-border);\n  display: flex;\n  align-items: center;\n  transition: background 80ms;\n}\n\n.copy-btn {\n  width: 32px;\n  min-height: 32px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n  background: transparent;\n  border: none;\n  border-bottom: 1px solid var(--figma-color-border);\n  color: var(--figma-color-icon-tertiary);\n  transition: background 120ms, color 120ms;\n  padding: 0;\n}\n\n.copy-btn:hover {\n  color: var(--figma-color-icon-brand);\n  background: var(--figma-color-bg-hover);\n}\n\n.copy-btn.ok {\n  color: var(--figma-color-text-brand);\n}\n\n.toast {\n  position: absolute;\n  bottom: 0;\n  left: 50%;\n  transform: translateX(-50%) translateY(0);\n  background: var(--figma-color-bg-brand);\n  border: none;\n  border-radius: 4px;\n  padding: 5px 12px;\n  font-size: 11px;\n  font-weight: 500;\n  color: var(--figma-color-text-onbrand);\n  opacity: 0;\n  pointer-events: none;\n  transition: opacity 150ms, transform 150ms;\n  white-space: nowrap;\n  z-index: 3;\n}\n\n.toast.show {\n  opacity: 1;\n  transform: translateX(-50%) translateY(-8px);\n}\n\n.footer {\n  height: 32px;\n  padding: 0 8px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  border-top: 1px solid var(--figma-color-border);\n  background: var(--figma-color-bg-secondary);\n  flex-shrink: 0;\n  position: relative;\n  z-index: 2;\n}\n\n.footer a {\n  font-size: 11px;\n  color: var(--figma-color-text-tertiary);\n  text-decoration: none;\n  transition: color 120ms;\n  display: flex;\n  align-items: center;\n  gap: 4px;\n}\n\n.footer a:hover { color: var(--figma-color-text-brand); }\n\n.resize-handle {\n  position: fixed;\n  bottom: 0;\n  right: 0;\n  width: 12px;\n  height: 12px;\n  cursor: nwse-resize;\n  z-index: 10;\n}\n\n.resize-handle::after {\n  content: '';\n  position: absolute;\n  bottom: 2px;\n  right: 2px;\n  width: 6px;\n  height: 6px;\n  border-right: 1.5px solid var(--figma-color-icon-tertiary);\n  border-bottom: 1.5px solid var(--figma-color-icon-tertiary);\n  opacity: 0.5;\n}\n\n</style>\n</head>\n<body>\n\n<div class=\"body\">\n  <div id=\"content\" style=\"display:flex;flex-direction:column;flex:1;min-height:0;overflow:hidden;\"></div>\n  <div class=\"toast\" id=\"toast\">Copied</div>\n</div>\n\n<div class=\"resize-handle\" id=\"resizeHandle\"></div>\n<div class=\"footer\">\n  <a href=\"https://github.com/blakewonka/Text-token-inspector\" target=\"_blank\">blakewonka.com</a>\n</div>\n\n<script>\nfunction esc(s) {\n  return String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');\n}\n\nfunction showEmpty(text, hint) {\n  document.getElementById('content').innerHTML = `\n    <div class=\"empty\">\n      <p class=\"empty-text\">${esc(text)}</p>\n      <span class=\"empty-hint\">${esc(hint)}</span>\n    </div>`;\n}\n\nfunction copyText(text) {\n  try { navigator.clipboard.writeText(text); } catch {\n    const ta = document.createElement('textarea'); ta.value = text;\n    document.body.appendChild(ta); ta.select(); document.execCommand('copy');\n    document.body.removeChild(ta);\n  }\n}\n\nconst copyIcon = `<svg width=\"12\" height=\"12\" viewBox=\"0 0 12 12\" fill=\"none\">\n  <rect x=\"4\" y=\"4\" width=\"7\" height=\"7\" rx=\"1.5\" stroke=\"currentColor\" stroke-width=\"1.2\"/>\n  <path d=\"M1 8V2.5A1.5 1.5 0 0 1 2.5 1H8\" stroke=\"currentColor\" stroke-width=\"1.2\" stroke-linecap=\"round\"/>\n</svg>`;\n\nconst chevronIcon = `<svg width=\"12\" height=\"12\" viewBox=\"0 0 12 12\" fill=\"none\">\n  <path d=\"M2.5 4.5L6 8L9.5 4.5\" stroke=\"currentColor\" stroke-width=\"1.3\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n</svg>`;\n\nlet modeViewEnabled = false;\n\nfunction showAllTokens(tokens) {\n  const content = document.getElementById('content');\n  content.innerHTML = `\n    <div class=\"tokens-scroll\" id=\"tokensList\">\n      ${tokens.map((data, i) => `\n        <div class=\"token-section\">\n          <div class=\"card-container\">\n            <div class=\"token-id-row\">\n              <span class=\"token-id-text\">${esc(data.token)}</span>\n              <button class=\"token-id-copy\" data-v=\"${esc(data.token)}\" title=\"Copy token\">${copyIcon}</button>\n            </div>\n            <div class=\"card-header\" data-idx=\"${i}\">\n              <span class=\"token-layer\">Translations</span>\n              <button class=\"chevron-btn\" data-idx=\"${i}\" title=\"Show language values\">${chevronIcon}</button>\n            </div>\n            <div class=\"modes-grid\" id=\"modes-${i}\">\n              ${data.modes.map(m => `\n                <div class=\"mrow\">\n                  <div class=\"mtag\">${esc(m.name)}</div>\n                  <div class=\"mval\">${esc(m.value || '—')}</div>\n                  <button class=\"copy-btn\" data-v=\"${esc(m.value)}\" title=\"Copy\">${copyIcon}</button>\n                </div>`).join('')}\n            </div>\n          </div>\n        </div>`).join('')}\n    </div>`;\n\n  content.querySelectorAll('.card-header').forEach(header => {\n    header.addEventListener('click', function() {\n      const idx = this.dataset.idx;\n      const grid = document.getElementById('modes-' + idx);\n      const btn = this.querySelector('.chevron-btn');\n      const isOpen = grid.classList.toggle('open');\n      btn.classList.toggle('open', isOpen);\n      this.classList.toggle('open', isOpen);\n    });\n  });\n\n  content.querySelectorAll('.token-id-row').forEach(row => {\n    const btn = row.querySelector('.token-id-copy');\n    row.addEventListener('click', () => {\n      copyText(btn.dataset.v);\n      btn.classList.add('ok');\n      setTimeout(() => btn.classList.remove('ok'), 900);\n      showToast('Copied');\n    });\n  });\n\n  content.querySelectorAll('.token-id-copy').forEach(btn => {\n    btn.addEventListener('click', (e) => {\n      e.stopPropagation();\n      copyText(btn.dataset.v);\n      btn.classList.add('ok');\n      setTimeout(() => btn.classList.remove('ok'), 900);\n      showToast('Copied');\n    });\n  });\n\n  content.querySelectorAll('.copy-btn').forEach(btn => {\n    btn.addEventListener('click', (e) => {\n      e.stopPropagation();\n      copyText(btn.dataset.v);\n      btn.classList.add('ok');\n      setTimeout(() => btn.classList.remove('ok'), 900);\n      showToast('Copied');\n    });\n  });\n}\n\nlet toastTimer;\nfunction showToast(msg) {\n  const t = document.getElementById('toast');\n  t.textContent = msg;\n  t.classList.add('show');\n  clearTimeout(toastTimer);\n  toastTimer = setTimeout(() => t.classList.remove('show'), 1400);\n}\n\nwindow.onmessage = (event) => {\n  const msg = event.data.pluginMessage;\n  if (!msg) return;\n  switch (msg.type) {\n    case 'NO_SELECTION':\n      showEmpty('Select a text layer with a token', 'Works with text instances and frames');\n      break;\n    case 'NO_TOKEN':\n      showEmpty('No variable token found', 'The selected layer has no bound text variable');\n      break;\n    case 'ALL_TOKENS':\n      modeViewEnabled = false;\n      showAllTokens(msg.payload);\n      break;\n    case 'NAVIGATE_FAIL':\n      showToast('Main component not found');\n      break;\n  }\n};\n\nshowEmpty('Select a text layer with a token', 'Works with text instances and frames');\n\n(function() {\n  var handle = document.getElementById('resizeHandle');\n  var startX, startY, startW, startH;\n  handle.addEventListener('mousedown', function(e) {\n    e.preventDefault();\n    startX = e.clientX;\n    startY = e.clientY;\n    startW = window.innerWidth;\n    startH = window.innerHeight;\n    document.addEventListener('mousemove', onDrag);\n    document.addEventListener('mouseup', onUp);\n  });\n  function onDrag(e) {\n    var w = Math.max(500, startW + (e.clientX - startX));\n    var h = Math.max(320, startH + (e.clientY - startY));\n    parent.postMessage({ pluginMessage: { type: 'RESIZE', width: w, height: h } }, '*');\n  }\n  function onUp() {\n    document.removeEventListener('mousemove', onDrag);\n    document.removeEventListener('mouseup', onUp);\n  }\n})();\n\n</script>\n</body>\n</html>\n", {
    width: 500,
    height: 453,
    themeColors: true,
});
function findTextNodes(node) {
    if (node.type === "TEXT")
        return [node];
    if ("children" in node) {
        const results = [];
        for (const child of node.children) {
            results.push(...findTextNodes(child));
        }
        return results;
    }
    return [];
}
function findInstances(node) {
    const results = [];
    if (node.type === "INSTANCE")
        results.push(node);
    if ("children" in node) {
        for (const child of node.children) {
            results.push(...findInstances(child));
        }
    }
    return results;
}
function resolveVariableBinding(bindingId, layerName, nodeId) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const variable = yield figma.variables.getVariableByIdAsync(bindingId);
        if (!variable)
            return null;
        const collection = yield figma.variables.getVariableCollectionByIdAsync(variable.variableCollectionId);
        if (!collection)
            return null;
        const modes = collection.modes.map((mode) => {
            var _a;
            return ({
                name: mode.name,
                value: (_a = variable.valuesByMode[mode.modeId]) !== null && _a !== void 0 ? _a : "",
            });
        });
        return {
            layer: layerName,
            token: (_a = variable.name.split("/").pop()) !== null && _a !== void 0 ? _a : variable.name,
            nodeId: nodeId,
            modes,
        };
    });
}
function resolveTextNode(textNode) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const binding = (_a = textNode.boundVariables) === null || _a === void 0 ? void 0 : _a["characters"];
        if (!(binding === null || binding === void 0 ? void 0 : binding.id))
            return null;
        return resolveVariableBinding(binding.id, textNode.name, textNode.id);
    });
}
function collectComponentTokens(node) {
    return __awaiter(this, void 0, void 0, function* () {
        const results = [];
        const props = node.componentProperties;
        const propNames = Object.keys(props);
        for (const propName of propNames) {
            const prop = props[propName];
            if (prop.type !== "TEXT")
                continue;
            const bindings = prop.boundVariables;
            const binding = bindings === null || bindings === void 0 ? void 0 : bindings["value"];
            if (!(binding === null || binding === void 0 ? void 0 : binding.id))
                continue;
            const result = yield resolveVariableBinding(binding.id, propName.replace(/#.*$/, ""), node.id);
            if (result)
                results.push(result);
        }
        return results;
    });
}
function collectAllTokens(node) {
    return __awaiter(this, void 0, void 0, function* () {
        const seen = new Set();
        const results = [];
        function addUnique(token) {
            const key = token.nodeId + "|" + token.token;
            if (seen.has(key))
                return;
            seen.add(key);
            results.push(token);
        }
        const textNodes = findTextNodes(node);
        for (const textNode of textNodes) {
            const result = yield resolveTextNode(textNode);
            if (result)
                addUnique(result);
        }
        const instances = findInstances(node);
        for (const instance of instances) {
            const tokens = yield collectComponentTokens(instance);
            for (const t of tokens)
                addUnique(t);
        }
        let parent = node.parent;
        while (parent && parent.type !== "PAGE" && parent.type !== "DOCUMENT") {
            if (parent.type === "INSTANCE") {
                const tokens = yield collectComponentTokens(parent);
                for (const t of tokens)
                    addUnique(t);
            }
            parent = parent.parent;
        }
        return results;
    });
}
function onSelectionChange() {
    return __awaiter(this, void 0, void 0, function* () {
        const sel = figma.currentPage.selection;
        if (sel.length === 0) {
            figma.ui.postMessage({ type: "NO_SELECTION" });
            return;
        }
        const seen = new Set();
        const allTokens = [];
        for (let i = 0; i < sel.length; i++) {
            const tokens = yield collectAllTokens(sel[i]);
            for (const t of tokens) {
                const key = t.nodeId + "|" + t.token;
                if (!seen.has(key)) {
                    seen.add(key);
                    allTokens.push(t);
                }
            }
        }
        if (allTokens.length === 0) {
            figma.ui.postMessage({ type: "NO_TOKEN" });
            return;
        }
        figma.ui.postMessage({ type: "ALL_TOKENS", payload: allTokens });
    });
}
onSelectionChange();
figma.on("selectionchange", () => { onSelectionChange(); });
figma.ui.onmessage = (msg) => __awaiter(void 0, void 0, void 0, function* () {
    if (msg.type === "CLOSE") {
        figma.closePlugin();
    }
    if (msg.type === "RESIZE" && msg.width && msg.height) {
        figma.ui.resize(msg.width, msg.height);
    }
    if (msg.type === "NAVIGATE" && msg.nodeId) {
        const node = yield figma.getNodeByIdAsync(msg.nodeId);
        if (!node || !("type" in node)) {
            figma.ui.postMessage({ type: "NAVIGATE_FAIL" });
            return;
        }
        let target = node;
        while (target && target.type !== "PAGE" && target.type !== "DOCUMENT") {
            if (target.type === "INSTANCE") {
                const inst = target;
                const main = inst.mainComponent;
                if (main) {
                    figma.currentPage.selection = [main];
                    figma.viewport.scrollAndZoomIntoView([main]);
                    figma.ui.postMessage({ type: "NAVIGATE_DONE" });
                    return;
                }
            }
            target = target.parent;
        }
        figma.ui.postMessage({ type: "NAVIGATE_FAIL" });
    }
});
