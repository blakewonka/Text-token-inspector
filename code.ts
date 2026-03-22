figma.showUI(__html__, {
  width: 500,
  height: 453,
  themeColors: true,
} as ShowUIOptions & { themeColors: boolean });

interface TokenResult {
  layer: string;
  token: string;
  nodeId: string;
  modes: { name: string; value: string }[];
}

function findTextNodes(node: SceneNode): TextNode[] {
  if (node.type === "TEXT") return [node];
  if ("children" in node) {
    const results: TextNode[] = [];
    for (const child of (node as ChildrenMixin).children) {
      results.push(...findTextNodes(child as SceneNode));
    }
    return results;
  }
  return [];
}

function findInstances(node: SceneNode): InstanceNode[] {
  const results: InstanceNode[] = [];
  if (node.type === "INSTANCE") results.push(node);
  if ("children" in node) {
    for (const child of (node as ChildrenMixin).children) {
      results.push(...findInstances(child as SceneNode));
    }
  }
  return results;
}

async function resolveVariableBinding(bindingId: string, layerName: string, nodeId: string): Promise<TokenResult | null> {
  const variable = await figma.variables.getVariableByIdAsync(bindingId);
  if (!variable) return null;

  const collection = await figma.variables.getVariableCollectionByIdAsync(variable.variableCollectionId);
  if (!collection) return null;

  const modes = collection.modes.map((mode) => ({
    name: mode.name,
    value: variable!.valuesByMode[mode.modeId] as string ?? "",
  }));

  return {
    layer: layerName,
    token: variable.name.split("/").pop() ?? variable.name,
    nodeId: nodeId,
    modes,
  };
}

async function resolveTextNode(textNode: TextNode): Promise<TokenResult | null> {
  const binding = (textNode.boundVariables as Record<string, VariableAlias | undefined>)?.["characters"];
  if (!binding?.id) return null;
  return resolveVariableBinding(binding.id, textNode.name, textNode.id);
}

async function collectComponentTokens(node: InstanceNode): Promise<TokenResult[]> {
  const results: TokenResult[] = [];
  const props = node.componentProperties;
  const propNames = Object.keys(props);
  for (const propName of propNames) {
    const prop = props[propName];
    if (prop.type !== "TEXT") continue;
    const bindings = (prop as any).boundVariables;
    const binding = bindings?.["value"] as VariableAlias | undefined;
    if (!binding?.id) continue;
    const result = await resolveVariableBinding(binding.id, propName.replace(/#.*$/, ""), node.id);
    if (result) results.push(result);
  }
  return results;
}

async function collectAllTokens(node: SceneNode): Promise<TokenResult[]> {
  const seen = new Set<string>();
  const results: TokenResult[] = [];

  function addUnique(token: TokenResult): void {
    const key = token.nodeId + "|" + token.token;
    if (seen.has(key)) return;
    seen.add(key);
    results.push(token);
  }

  const textNodes = findTextNodes(node);
  for (const textNode of textNodes) {
    const result = await resolveTextNode(textNode);
    if (result) addUnique(result);
  }

  const instances = findInstances(node);
  for (const instance of instances) {
    const tokens = await collectComponentTokens(instance);
    for (const t of tokens) addUnique(t);
  }

  let parent = node.parent;
  while (parent && parent.type !== "PAGE" && parent.type !== "DOCUMENT") {
    if (parent.type === "INSTANCE") {
      const tokens = await collectComponentTokens(parent as InstanceNode);
      for (const t of tokens) addUnique(t);
    }
    parent = parent.parent;
  }

  return results;
}

async function onSelectionChange(): Promise<void> {
  const sel = figma.currentPage.selection;

  if (sel.length === 0) {
    figma.ui.postMessage({ type: "NO_SELECTION" });
    return;
  }

  const seen = new Set<string>();
  const allTokens: TokenResult[] = [];

  for (let i = 0; i < sel.length; i++) {
    const tokens = await collectAllTokens(sel[i]);
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
}

onSelectionChange();
figma.on("selectionchange", () => { onSelectionChange(); });

figma.ui.onmessage = async (msg: { type: string; nodeId?: string; width?: number; height?: number }) => {
  if (msg.type === "CLOSE") {
    figma.closePlugin();
  }

  if (msg.type === "RESIZE" && msg.width && msg.height) {
    figma.ui.resize(msg.width, msg.height);
  }

  if (msg.type === "NAVIGATE" && msg.nodeId) {
    const node = await figma.getNodeByIdAsync(msg.nodeId);
    if (!node || !("type" in node)) {
      figma.ui.postMessage({ type: "NAVIGATE_FAIL" });
      return;
    }

    let target: BaseNode | null = node;
    while (target && target.type !== "PAGE" && target.type !== "DOCUMENT") {
      if (target.type === "INSTANCE") {
        const inst = target as InstanceNode;
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
};
