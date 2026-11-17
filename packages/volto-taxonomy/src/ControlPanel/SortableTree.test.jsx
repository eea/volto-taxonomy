import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-intl-redux';
import SortableTree from './SortableTree';

const mockStore = configureStore();

vi.mock('@plone/volto/helpers/Loadable/Loadable');

beforeAll(async () => {
  const { __setLoadables } = await import(
    '@plone/volto/helpers/Loadable/Loadable'
  );
  await __setLoadables();
});

const treeData = [
  {
    key: 'a',
    title: 'A',
    expanded: true,
    children: [{ key: 'a1', title: 'A1' }],
  },
  { key: 'b', title: 'B', children: [{ key: 'b1', title: 'B1' }] },
];

const renderTree = (onChange = vi.fn()) =>
  render(
    <Provider store={mockStore({ intl: { locale: 'en', messages: {} } })}>
      <SortableTree
        treeData={treeData}
        onChange={onChange}
        renderNode={({ node, path }) => ({
          title: <span>{`title ${node.key} ${path.join('.')}`}</span>,
          subtitle: <span>{`id ${node.key}`}</span>,
          buttons: [<button key="x">{`action ${node.key}`}</button>],
        })}
      />
    </Provider>,
  );

describe('SortableTree', () => {
  it('renders the visible nodes with their path', async () => {
    renderTree();
    await waitFor(() => screen.getByText('title a 0'));
    expect(screen.getByText('title a1 0.0')).toBeInTheDocument();
    expect(screen.getByText('title b 1')).toBeInTheDocument();
    expect(screen.queryByText('title b1 1.0')).not.toBeInTheDocument();
    expect(screen.getByText('action b')).toBeInTheDocument();
  });

  it('expands a collapsed node', async () => {
    const onChange = vi.fn();
    renderTree(onChange);
    const expand = await waitFor(() => screen.getByLabelText('Expand'));
    fireEvent.click(expand);
    expect(onChange).toHaveBeenCalledWith([
      treeData[0],
      { ...treeData[1], expanded: true },
    ]);
  });

  it('renders a drag handle for each visible node', async () => {
    renderTree();
    await waitFor(() => screen.getByText('title a 0'));
    expect(screen.getAllByLabelText('Drag to reorder')).toHaveLength(3);
  });
});
