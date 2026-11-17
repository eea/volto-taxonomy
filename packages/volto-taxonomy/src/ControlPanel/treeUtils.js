/**
 * Helpers for the taxonomy tree editor.
 *
 * The tree is stored as nested `{ key, title, translations, children,
 * expanded }` nodes. A node path is the list of child indexes from the root,
 * e.g. `[1, 0]` is the first child of the second root node.
 */

const pathId = (path) => path.join('.');

const getChildren = (node) => node?.children || [];

const isExpanded = (node) => node?.expanded === true;

/**
 * Flatten the tree into `{ id, parentId, depth, index, path, node }` items.
 * Children of collapsed nodes are skipped unless `includeCollapsed` is set.
 */
export function flattenTree(treeData = [], { includeCollapsed = false } = {}) {
  const items = [];
  const walk = (nodes, parentPath, depth) => {
    (nodes || []).forEach((node, index) => {
      const path = [...parentPath, index];
      items.push({
        id: pathId(path),
        parentId: parentPath.length ? pathId(parentPath) : null,
        depth,
        index,
        path,
        node,
      });
      if (includeCollapsed || isExpanded(node)) {
        walk(getChildren(node), path, depth + 1);
      }
    });
  };
  walk(treeData, [], 0);
  return items;
}

/**
 * All the nodes of the tree, including the ones under collapsed parents.
 */
export function getFlatDataFromTree(treeData) {
  return flattenTree(treeData, { includeCollapsed: true });
}

/**
 * Rebuild the nested tree from flattened items, using `parentId` to attach
 * children. Children hidden under a collapsed node are kept after any item
 * dropped into it, and the node is expanded so the drop stays visible.
 */
export function buildTree(flatItems) {
  const root = [];
  const built = {};

  flatItems.forEach(({ id }) => {
    built[id] = [];
  });

  flatItems.forEach(({ id, parentId }) => {
    const siblings = parentId === null ? root : built[parentId];
    siblings.push(id);
  });

  const byId = Object.fromEntries(flatItems.map((item) => [item.id, item]));

  const toNode = (id) => {
    const { node } = byId[id];
    const movedIn = built[id].map(toNode);
    if (isExpanded(node)) {
      return movedIn.length || node.children
        ? { ...node, children: movedIn }
        : { ...node };
    }
    const hidden = getChildren(node);
    if (!movedIn.length) return { ...node };
    return { ...node, expanded: true, children: [...movedIn, ...hidden] };
  };

  return root.map(toNode);
}

/**
 * Hide the descendants of the given items (used for the dragged item).
 */
export function removeChildrenOf(items, ids) {
  const excludeParentIds = [...ids];

  return items.filter((item) => {
    if (item.parentId !== null && excludeParentIds.includes(item.parentId)) {
      excludeParentIds.push(item.id);
      return false;
    }
    return true;
  });
}

/**
 * Compute where the dragged item would land: its depth, from the horizontal
 * drag offset, clamped by its neighbours, and the resulting parent.
 */
export function getProjection(
  items,
  activeId,
  overId,
  dragOffset,
  indentationWidth,
  arrayMove,
) {
  const overItemIndex = items.findIndex(({ id }) => id === overId);
  const activeItemIndex = items.findIndex(({ id }) => id === activeId);
  const activeItem = items[activeItemIndex];
  const newItems = arrayMove(items, activeItemIndex, overItemIndex);
  const previousItem = newItems[overItemIndex - 1];
  const nextItem = newItems[overItemIndex + 1];
  const projectedDepth =
    activeItem.depth + Math.round(dragOffset / indentationWidth);
  const maxDepth = previousItem ? previousItem.depth + 1 : 0;
  const minDepth = nextItem ? nextItem.depth : 0;
  const depth = Math.min(Math.max(projectedDepth, minDepth), maxDepth);

  const getParentId = () => {
    if (depth === 0 || !previousItem) return null;
    if (depth === previousItem.depth) return previousItem.parentId;
    if (depth > previousItem.depth) return previousItem.id;
    return (
      newItems
        .slice(0, overItemIndex)
        .reverse()
        .find((item) => item.depth === depth)?.parentId ?? null
    );
  };

  return { depth, maxDepth, minDepth, parentId: getParentId() };
}

/**
 * Move the dragged item to its projected place and return the new tree.
 */
export function moveItem(treeData, activeId, overId, projection, arrayMove) {
  const items = flattenTree(treeData);
  const activeIndex = items.findIndex(({ id }) => id === activeId);
  const overIndex = items.findIndex(({ id }) => id === overId);
  if (activeIndex === -1 || overIndex === -1) return treeData;

  const moved = [...items];
  moved[activeIndex] = {
    ...moved[activeIndex],
    depth: projection.depth,
    parentId: projection.parentId,
  };

  return buildTree(arrayMove(moved, activeIndex, overIndex));
}

const updateAtPath = (nodes, path, update) => {
  const [index, ...rest] = path;
  return nodes.flatMap((node, i) => {
    if (i !== index) return [node];
    if (!rest.length) return update(node);
    return [
      { ...node, children: updateAtPath(getChildren(node), rest, update) },
    ];
  });
};

export function changeNodeAtPath(treeData, path, newNode) {
  return updateAtPath(treeData, path, () => [newNode]);
}

export function removeNodeAtPath(treeData, path) {
  return updateAtPath(treeData, path, () => []);
}

export function toggleExpandedAtPath(treeData, path) {
  return updateAtPath(treeData, path, (node) => [
    { ...node, expanded: !isExpanded(node) },
  ]);
}

/**
 * Append `newNode` to the children of the node at `parentPath`, expanding
 * it, or to the root level when `parentPath` is empty.
 */
export function addNodeUnderParent(treeData, parentPath, newNode) {
  if (!parentPath.length) return [...treeData, newNode];
  return updateAtPath(treeData, parentPath, (node) => [
    { ...node, expanded: true, children: [...getChildren(node), newNode] },
  ]);
}
