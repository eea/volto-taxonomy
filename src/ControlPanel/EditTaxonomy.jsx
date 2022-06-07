import React from 'react';
import { Container, Header, Segment, Tab, Button } from 'semantic-ui-react';
import { Helmet } from '@plone/volto/helpers';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { Icon, Toolbar, Toast } from '@plone/volto/components';
import { Portal } from 'react-portal';
import { defineMessages, useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import backSVG from '@plone/volto/icons/back.svg';
import deleteSVG from '@plone/volto/icons/delete.svg';
import addDocumentSVG from '@plone/volto/icons/add-document.svg';
import saveSVG from '@plone/volto/icons/save.svg';
import navSVG from '@plone/volto/icons/nav.svg';
import { getTaxonomy, updateTaxonomy } from '../actions';

import SortableTree, {
  addNodeUnderParent,
  removeNodeAtPath,
  changeNodeAtPath,
  getFlatDataFromTree,
} from 'react-sortable-tree';
import TaxonomySettings from './TaxonomySettings';

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

  const languages = request?.languages || [request?.default_language];

  const [treeData, setTreeData] = React.useState(null);

  React.useEffect(() => {
    if (request) setTreeData(request?.tree);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [request]);

  const getNodeKey = ({ treeIndex }) => treeIndex;

  React.useEffect(() => {
    dispatch(getTaxonomy(id));
  }, [id, dispatch]);

  const onChange = (data) => {
    setTreeData(data);
  };

  const onSubmit = React.useCallback(() => {
    const flatdata = getFlatDataFromTree({
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
  }, [treeData, dispatch, request, languages, id, intl]);

  return (
    <>
      <Container id="page-taxonomies" className="controlpanel-taxonomies">
        <Helmet title="Taxonomies" />
        <Segment.Group raised>
          <Segment className="primary">
            <Header as="h3">Taxonomy: {request?.title || 'loading...'}</Header>
          </Segment>

          {treeData ? (
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
                        {/* <TaxonomyData id={id} taxonomy={request} /> */}
                        <div>
                          <SortableTree
                            treeData={treeData}
                            onChange={onChange}
                            isVirtualized={false}
                            generateNodeProps={({ node, path }) => ({
                              buttons: [
                                <button
                                  onClick={() => {
                                    const insertNode = addNodeUnderParent({
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
                                  <Icon name={navSVG} size="24px" />
                                </button>,
                                <button
                                  onClick={() => {
                                    const removedNode = removeNodeAtPath({
                                      treeData,
                                      path,
                                      getNodeKey,
                                    });
                                    setTreeData(removedNode);
                                  }}
                                >
                                  <Icon name={deleteSVG} size="24px" />
                                </button>,
                              ],
                              title: (
                                <input
                                  style={{ fontSize: '1.1rem' }}
                                  value={node.title}
                                  placeholder="Title"
                                  onChange={(event) => {
                                    const name = event.target.value;

                                    const newNode = changeNodeAtPath({
                                      treeData,
                                      path,
                                      getNodeKey,
                                      newNode: {
                                        ...node,
                                        title: name,
                                      },
                                    });
                                    setTreeData(newNode);
                                  }}
                                />
                              ),
                              subtitle: (
                                <input
                                  style={{ fontSize: '1.1rem' }}
                                  value={node.key}
                                  placeholder="id"
                                  onChange={(event) => {
                                    const id = event.target.value;

                                    const newNode = changeNodeAtPath({
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
                          <button
                            onClick={() => {
                              setTreeData((state) =>
                                state.concat({
                                  title: '',
                                  key: uuid(),
                                }),
                              );
                            }}
                          >
                            <Icon name={addDocumentSVG} size="24px" />
                          </button>
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
          ) : null}
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
