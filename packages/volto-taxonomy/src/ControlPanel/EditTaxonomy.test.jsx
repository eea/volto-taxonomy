import { vi } from 'vitest';
import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Route, Router } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-intl-redux';
import config from '@plone/volto/registry';
import * as reactRedux from 'react-redux';
import EditTaxonomy from './EditTaxonomy';

vi.mock('react-redux', async () => ({
  ...(await vi.importActual('react-redux')),
  useDispatch: vi.fn(),
  useSelector: vi.fn(),
}));

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

vi.mock('@eeacms/volto-taxonomy/actions', () => ({
  getTaxonomy: vi.fn(() => ({ type: 'GET_TAXONOMY' })),
  updateTaxonomy: vi.fn(() => ({ type: 'UPDATE_TAXONOMY' })),
}));

vi.mock('@plone/volto/hooks/client/useClient', () => ({
  useClient: () => false,
}));

vi.mock('./TaxonomySettings', () => ({
  __esModule: true,
  default: () => <div>Taxonomy settings</div>,
}));

vi.mock('@plone/volto/helpers/Loadable/Loadable');

const mockStore = configureStore([]);
const store = mockStore({ intl: { locale: 'en', messages: {} } });

const tree = [
  {
    key: 'mars',
    title: 'Mars',
    translations: { en: 'Mars' },
    children: [
      {
        key: 'phobos',
        title: 'Phobos',
        translations: { en: 'Phobos' },
        children: [],
      },
    ],
  },
  {
    key: 'venus',
    title: 'Venus',
    translations: { en: 'Venus' },
    children: [],
  },
];

const renderPanel = (usage) => {
  reactRedux.useSelector.mockReturnValue({
    name: 'collective.taxonomy.test',
    title: 'Test taxonomy',
    default_language: 'en',
    tree,
    usage,
  });

  const history = createMemoryHistory({
    initialEntries: ['/controlpanel/taxonomies/collective.taxonomy.test'],
  });

  return render(
    <Provider store={store}>
      <Router history={history}>
        <Route path="/controlpanel/taxonomies/:id" component={EditTaxonomy} />
      </Router>
    </Provider>,
  );
};

const deleteButton = (container) =>
  container.querySelector('[data-cy="taxonomy-delete-node"]');

const confirmDialog = () => document.querySelector('.ui.modal');

const dialogHeader = () => screen.queryByText('Delete a term that is in use?');

beforeAll(async () => {
  const { __setLoadables } = await import(
    '@plone/volto/helpers/Loadable/Loadable'
  );
  await __setLoadables();
});

beforeEach(() => {
  reactRedux.useDispatch.mockReturnValue(vi.fn());
  config.settings.languages = [{ name: 'English', code: 'en' }];
});

describe('EditTaxonomy', () => {
  it('asks for confirmation before deleting a term that is in use', async () => {
    const { container } = renderPanel({ mars: 3 });

    await waitFor(() => screen.getByDisplayValue('Mars'));

    fireEvent.click(deleteButton(container));

    await waitFor(() => expect(dialogHeader()).toBeInTheDocument());
    expect(screen.getByText(/is used by 3 content items/)).toBeInTheDocument();
    expect(screen.getByDisplayValue('Mars')).toBeInTheDocument();

    fireEvent.click(within(confirmDialog()).getByText('Cancel'));
    await waitFor(() => expect(dialogHeader()).not.toBeInTheDocument());
    expect(screen.getByDisplayValue('Mars')).toBeInTheDocument();

    fireEvent.click(deleteButton(container));
    await waitFor(() => expect(dialogHeader()).toBeInTheDocument());
    fireEvent.click(within(confirmDialog()).getByText('Delete node'));

    await waitFor(() =>
      expect(screen.queryByDisplayValue('Mars')).not.toBeInTheDocument(),
    );
    expect(screen.getByDisplayValue('Venus')).toBeInTheDocument();
  });

  it('deletes a term without asking when the taxonomy has no usage', async () => {
    const { container } = renderPanel(undefined);

    await waitFor(() => screen.getByDisplayValue('Mars'));

    fireEvent.click(deleteButton(container));

    await waitFor(() =>
      expect(screen.queryByDisplayValue('Mars')).not.toBeInTheDocument(),
    );
    expect(dialogHeader()).not.toBeInTheDocument();
  });

  it('deletes a term without asking when nothing uses it', async () => {
    const { container } = renderPanel({ mars: 0 });

    await waitFor(() => screen.getByDisplayValue('Mars'));

    fireEvent.click(deleteButton(container));

    await waitFor(() =>
      expect(screen.queryByDisplayValue('Mars')).not.toBeInTheDocument(),
    );
    expect(dialogHeader()).not.toBeInTheDocument();
  });
});
