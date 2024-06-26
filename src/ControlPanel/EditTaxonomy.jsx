import React from 'react';
import {
  Container,
  Header,
  Segment,
  Tab,
  Button,
  Input,
  Menu,
  Message,
  Grid,
} from 'semantic-ui-react';
import { Helmet } from '@plone/volto/helpers';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { Icon, Toolbar, Toast } from '@plone/volto/components';
import { Field } from '@plone/volto/components';
import { Portal } from 'react-portal';
import config from '@plone/volto/registry';
import { defineMessages, useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import backSVG from '@plone/volto/icons/back.svg';
import deleteSVG from '@plone/volto/icons/delete.svg';
import addDocumentSVG from '@plone/volto/icons/add-document.svg';
import addSVG from '@plone/volto/icons/add.svg';
import saveSVG from '@plone/volto/icons/save.svg';
import navSVG from '@plone/volto/icons/nav.svg';
import { getTaxonomy, updateTaxonomy } from '../actions';
import loadable from '@loadable/component';
import TaxonomySettings from './TaxonomySettings';

const SortableTree = loadable(() => import('react-sortable-tree'));

const messages = defineMessages({
  saved: {
    id: 'Changes saved',
    defaultMessage: 'Changes saved',
  },
  success: {
    id: 'Success',
    defaultMessage: 'Success',
  },
  error: {
    id: 'Error',
    defaultMessage: 'Error',
  },
  duplicatedIds: {
    id: 'Duplicated Ids',
    description: 'Duplicated Id warning message.',
    defaultMessage: 'Duplicated Ids present',
  },
  duplicatedIdContent: {
    id: 'duplicatedIdContent',
    description: 'Duplicated Id warning message.',
    defaultMessage:
      'Duplicated Ids present, use unique ids in order to ' +
      'save these changes.',
  },
  PleaseAddTaxonomy: {
    id: 'Please add a new taxonomy entry',
    defaultMessage: 'Please add a new taxonomy entry',
  },
  addSameLevel: {
    id: 'Add node at same level',
    defaultMessage: 'Add node at same level',
  },
  addChildNode: {
    id: 'Add child node',
    defaultMessage: 'Add child node',
  },
  deleteNode: {
    id: 'Delete node',
    defaultMessage: 'Delete node',
  },
});

export function checkForDuplicates(flatdata = []) {
  const nodes = flatdata.map((item) => item.node.key);
  return new Set(nodes).size !== nodes.length;
}

export default withRouter((props) => {
  const { id } = props.match.params;
  const dispatch = useDispatch();
  const request = useSelector((state) => state.taxonomy?.taxonomy);
  const intl = useIntl();
  const [treeData, setTreeData] = React.useState(null);
  const [sortableTreeLib, setSortableTreeLib] = React.useState(null);

  const [languageToShow, setLanguage] = React.useState(null);

  const defaultLanguage = config.settings.languages.find(
    (lang) => lang.code === request?.default_language,
  );

  React.useEffect(() => {
    if (request) setTreeData(request?.tree);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [request]);

  React.useEffect(() => {
    dispatch(getTaxonomy(id));
  }, [id, dispatch]);

  React.useEffect(() => {
    // lazy load react-sortable-tree
    import(
      /* webpackChunkName: "taxonomy-edit-tree" */ 'react-sortable-tree/style.css'
    );
    import(/* webpackChunkName: "taxonomy-edit-tree" */ './button.less');
    import(
      /* webpackChunkName: "react-sortable-tree" */ 'react-sortable-tree'
    ).then((module) => {
      setSortableTreeLib(module);
    });
  }, []);

  React.useEffect(() => {
    setLanguage(defaultLanguage?.code);
  }, [defaultLanguage]);

  const getNodeKey = ({ treeIndex }) => treeIndex;

  const onChange = (data) => {
    setTreeData(data);
  };

  const handleLanguageChange = React.useCallback((_, value) => {
    setLanguage(value);
  }, []);

  const getTranslatedNodeTitle = React.useCallback(
    (node) => {
      return node?.translations
        ? node.translations[languageToShow] || ''
        : node.title || '';
    },
    [languageToShow],
  );

  const onSubmit = React.useCallback(() => {
    const languages = languageToShow
      ? [languageToShow]
      : [request?.default_language];
    const flatdata = sortableTreeLib.getFlatDataFromTree({
      treeData,
      getNodeKey,
    });
    const isDuplicated = checkForDuplicates(flatdata);
    if (!isDuplicated) {
      dispatch(
        updateTaxonomy(id, {
          taxonomy: request?.name,
          title: request?.title,
          languages,
          tree: treeData,
        }),
      )
        .then(() => {
          toast.success(
            <Toast
              success
              title={intl.formatMessage(messages.success)}
              content={intl.formatMessage(messages.saved)}
            />,
          );
        })
        .catch((e) => {
          toast.error(
            <Toast
              error
              title={intl.formatMessage(messages.error)}
              content={e.message}
            />,
          );
        });
    } else {
      toast.info(
        <Toast
          info
          title={intl.formatMessage(messages.duplicatedIds)}
          content={intl.formatMessage(messages.duplicatedIdContent)}
        />,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [treeData, dispatch, request, languageToShow, id, intl]);

  return (
    <>
      <Container id="page-taxonomies" className="controlpanel-taxonomies">
        <Helmet title="Taxonomies" />
        <Segment.Group raised>
          <Segment className="primary">
            <Header as="h3">Taxonomy: {request?.title || 'loading...'}</Header>
          </Segment>

          {treeData?.length ? (
            <Segment>
              <Tab
                menu={{
                  secondary: true,
                  pointing: true,
                  attached: true,
                  tabular: true,
                  className: 'formtabs',
                }}
                grid={{ paneWidth: 9, tabWidth: 3, stackable: true }}
                onTabChange={() => {}}
                panes={[
                  {
                    menuItem: 'Edit taxonomy data',
                    render: () => (
                      <Tab.Pane>
                        <Grid>
                          <Grid.Row>
                            <Grid.Column width={4}>
                              <Field
                                id="language"
                                title="Language"
                                default={defaultLanguage?.code}
                                widget="select"
                                type="string"
                                vocabulary={{
                                  '@id':
                                    'plone.app.vocabularies.SupportedContentLanguages',
                                }}
                                value={languageToShow}
                                onChange={handleLanguageChange}
                              />
                            </Grid.Column>
                          </Grid.Row>
                        </Grid>
                        <div>
                          <SortableTree
                            treeData={treeData}
                            onChange={onChange}
                            className="taxonomy-tree-wrapper"
                            isVirtualized={false}
                            generateNodeProps={({
                              node,
                              path,
                              treeIndex,
                              lowerSiblingCounts,
                            }) => ({
                              buttons: [
                                <Menu.Item
                                  icon
                                  as={Button}
                                  name={intl.formatMessage(
                                    messages.addChildNode,
                                  )}
                                  onClick={() => {
                                    const insertNode =
                                      sortableTreeLib.addNodeUnderParent({
                                        treeData,
                                        parentKey: path[path.length - 1],
                                        expandParent: true,
                                        getNodeKey,
                                        newNode: {
                                          title: ``,
                                          key: uuid(),
                                        },
                                      });
                                    setTreeData(insertNode.treeData);
                                  }}
                                >
                                  <Icon
                                    name={navSVG}
                                    size="24px"
                                    title={intl.formatMessage(
                                      messages.addChildNode,
                                    )}
                                  />
                                </Menu.Item>,
                                <Menu.Item
                                  icon
                                  as={Button}
                                  onClick={() => {
                                    const removedNode =
                                      sortableTreeLib.removeNodeAtPath({
                                        treeData,
                                        path,
                                        getNodeKey,
                                      });
                                    setTreeData(removedNode);
                                  }}
                                >
                                  <Icon
                                    name={deleteSVG}
                                    size="24px"
                                    className="delete"
                                    title={intl.formatMessage(
                                      messages.deleteNode,
                                    )}
                                  />
                                </Menu.Item>,
                                <Menu.Item
                                  icon
                                  name={intl.formatMessage(
                                    messages.addSameLevel,
                                  )}
                                  as={Button}
                                  onClick={() => {
                                    const insertNode =
                                      sortableTreeLib.addNodeUnderParent({
                                        treeData,
                                        parentKey: path[path.length - 2],
                                        expandParent: true,
                                        getNodeKey,
                                        newNode: {
                                          title: ``,
                                          key: uuid(),
                                        },
                                      });
                                    setTreeData(insertNode.treeData);
                                  }}
                                >
                                  <Icon
                                    name={addDocumentSVG}
                                    size="24px"
                                    title={intl.formatMessage(
                                      messages.addSameLevel,
                                    )}
                                  />
                                </Menu.Item>,
                              ],
                              title: (
                                <Input
                                  style={{ fontSize: '1rem' }}
                                  value={getTranslatedNodeTitle(node)}
                                  placeholder="Title"
                                  onChange={(event) => {
                                    const name = event.target.value;
                                    const newNode =
                                      sortableTreeLib.changeNodeAtPath({
                                        treeData,
                                        path,
                                        getNodeKey,
                                        newNode: {
                                          ...node,
                                          ...(languageToShow ===
                                          defaultLanguage.code
                                            ? { title: name }
                                            : {}),
                                          translations: {
                                            ...node.translations,
                                            [languageToShow]: name,
                                          },
                                        },
                                      });
                                    setTreeData(newNode);
                                  }}
                                />
                              ),
                              subtitle: (
                                <Input
                                  value={node.key}
                                  style={{ fontSize: '1rem' }}
                                  placeholder="id"
                                  onChange={(event) => {
                                    const id = event.target.value;

                                    const newNode =
                                      sortableTreeLib.changeNodeAtPath({
                                        treeData,
                                        path,
                                        getNodeKey,
                                        newNode: {
                                          ...node,
                                          key: id,
                                        },
                                      });
                                    setTreeData(newNode);
                                  }}
                                />
                              ),
                            })}
                          />
                        </div>
                      </Tab.Pane>
                    ),
                  },
                  {
                    menuItem: 'Edit taxonomy',
                    render: () => (
                      <Tab.Pane>
                        <TaxonomySettings {...props} />
                      </Tab.Pane>
                    ),
                  },
                ]}
              />
            </Segment>
          ) : (
            <Segment>
              <Message>
                <div className="add-taxonomy placeholder">
                  <Button
                    icon
                    onClick={() => {
                      setTreeData((state) =>
                        state.concat({
                          title: '',
                          key: uuid(),
                        }),
                      );
                    }}
                  >
                    <Icon name={addSVG} size="24px" />
                  </Button>
                  <p>{intl.formatMessage(messages.PleaseAddTaxonomy)}</p>
                </div>
              </Message>
            </Segment>
          )}
        </Segment.Group>
      </Container>

      {__CLIENT__ && (
        <Portal node={document.getElementById('toolbar')}>
          <Toolbar
            pathname={props.location.pathname}
            hideDefaultViewButtons
            inner={
              <>
                <Link to="/controlpanel/taxonomies" className="item">
                  <Icon
                    name={backSVG}
                    aria-label="Back"
                    className="contents circled"
                    size="30px"
                    title="Back"
                  />
                </Link>
                <Button
                  id="save-taxonomy-data"
                  aria-label={'Save taxonomy'}
                  className="save"
                  onClick={onSubmit}
                >
                  <Icon
                    name={saveSVG}
                    className="circled"
                    color="#007eb1"
                    aria-label="Save Taxonomy"
                    title={'Save Taxonomy'}
                    size="30px"
                  />
                </Button>
              </>
            }
          />
        </Portal>
      )}
    </>
  );
});
