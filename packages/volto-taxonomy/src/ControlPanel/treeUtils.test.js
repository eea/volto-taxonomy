import {
  addNodeUnderParent,
  buildTree,
  changeNodeAtPath,
  flattenTree,
  getFlatDataFromTree,
  getProjection,
  moveItem,
  removeChildrenOf,
  removeNodeAtPath,
  toggleExpandedAtPath,
} from './treeUtils';
import { checkForDuplicates } from './EditTaxonomy';

// Same behaviour as `arrayMove` from `@dnd-kit/sortable`.
const arrayMove = (array, from, to) => {
  const moved = [...array];
  moved.splice(to < 0 ? moved.length + to : to, 0, moved.splice(from, 1)[0]);
  return moved;
};

const tree = () => [
  {
    key: 'a',
    title: 'A',
    expanded: true,
    children: [
      { key: 'a1', title: 'A1' },
      { key: 'a2', title: 'A2' },
    ],
  },
  {
    key: 'b',
    title: 'B',
    children: [{ key: 'b1', title: 'B1' }],
  },
  { key: 'c', title: 'C' },
];

const keys = (nodes) =>
  nodes.map((node) =>
    node.children ? { [node.key]: keys(node.children) } : node.key,
  );

describe('flattenTree', () => {
  it('skips the children of collapsed nodes', () => {
    expect(flattenTree(tree()).map(({ id }) => id)).toEqual([
      '0',
      '0.0',
      '0.1',
      '1',
      '2',
    ]);
  });

  it('includes every node for the duplicates check', () => {
    expect(getFlatDataFromTree(tree()).map(({ node }) => node.key)).toEqual([
      'a',
      'a1',
      'a2',
      'b',
      'b1',
      'c',
    ]);
  });

  it('records the parent and depth of each item', () => {
    const [, a1] = flattenTree(tree());
    expect(a1).toMatchObject({ parentId: '0', depth: 1, path: [0, 0] });
  });
});

describe('buildTree', () => {
  it('rebuilds the same tree from its flattened items', () => {
    expect(buildTree(flattenTree(tree()))).toEqual(tree());
  });
});

describe('removeChildrenOf', () => {
  it('hides all the descendants of the dragged item', () => {
    const items = flattenTree(tree());
    expect(removeChildrenOf(items, ['0']).map(({ id }) => id)).toEqual([
      '0',
      '1',
      '2',
    ]);
  });
});

describe('moving items', () => {
  const drop = (data, activeId, overId, offset = 0) => {
    const items = removeChildrenOf(flattenTree(data), [activeId]);
    const projection = getProjection(
      items,
      activeId,
      overId,
      offset,
      40,
      arrayMove,
    );
    return moveItem(data, activeId, overId, projection, arrayMove);
  };

  it('reorders siblings at the root', () => {
    expect(keys(drop(tree(), '2', '0'))).toEqual([
      'c',
      { a: ['a1', 'a2'] },
      { b: ['b1'] },
    ]);
  });

  it('moves a node with its children', () => {
    expect(keys(drop(tree(), '0', '2'))).toEqual([
      { b: ['b1'] },
      'c',
      { a: ['a1', 'a2'] },
    ]);
  });

  it('nests a node when dragged to the right', () => {
    expect(keys(drop(tree(), '2', '2', 40))).toEqual([
      { a: ['a1', 'a2'] },
      { b: ['c', 'b1'] },
    ]);
  });

  it('expands a collapsed node that receives a child', () => {
    const [, b] = drop(tree(), '2', '2', 40);
    expect(b.expanded).toBe(true);
  });

  it('moves a child up to the root when dragged to the left', () => {
    expect(keys(drop(tree(), '0.1', '0.1', -40))).toEqual([
      { a: ['a1'] },
      'a2',
      { b: ['b1'] },
      'c',
    ]);
  });

  it('keeps the dropped node data', () => {
    const data = tree();
    data[2].translations = { en: 'C' };
    expect(drop(data, '2', '0')[0]).toEqual({
      key: 'c',
      title: 'C',
      translations: { en: 'C' },
    });
  });
});

describe('path operations', () => {
  it('changes a node', () => {
    const data = changeNodeAtPath(tree(), [0, 1], { key: 'x', title: 'X' });
    expect(data[0].children[1]).toEqual({ key: 'x', title: 'X' });
  });

  it('removes a node and its children', () => {
    expect(keys(removeNodeAtPath(tree(), [1]))).toEqual([
      { a: ['a1', 'a2'] },
      'c',
    ]);
  });

  it('adds a child and expands the parent', () => {
    const data = addNodeUnderParent(tree(), [1], { key: 'b2' });
    expect(data[1]).toMatchObject({ expanded: true });
    expect(keys(data[1].children)).toEqual(['b1', 'b2']);
  });

  it('adds a node at the root', () => {
    expect(keys(addNodeUnderParent(tree(), [], { key: 'd' })).at(-1)).toBe('d');
  });

  it('toggles a node', () => {
    expect(toggleExpandedAtPath(tree(), [1])[1].expanded).toBe(true);
    expect(toggleExpandedAtPath(tree(), [0])[0].expanded).toBe(false);
  });
});

describe('checkForDuplicates', () => {
  it('finds duplicated keys under collapsed nodes', () => {
    const data = addNodeUnderParent(tree(), [0, 0], { key: 'b1' });
    data[0].children[0].expanded = false;
    expect(checkForDuplicates(getFlatDataFromTree(data))).toBe(true);
    expect(checkForDuplicates(getFlatDataFromTree(tree()))).toBe(false);
  });
});
