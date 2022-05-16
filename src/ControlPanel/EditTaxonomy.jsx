import React from 'react';
import { Container, Header, Segment, Tab } from 'semantic-ui-react';
import { Helmet } from '@plone/volto/helpers';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Icon, Toolbar } from '@plone/volto/components';
import { Portal } from 'react-portal';
import { Link } from 'react-router-dom';
import backSVG from '@plone/volto/icons/back.svg';
import { getTaxonomy } from '../actions';
import SortableTree, {
  addNodeUnderParent,
  removeNodeAtPath,
} from 'react-sortable-tree';
// import TaxonomySettings from './TaxonomySettings';
import TaxonomyData from './TaxonomyData';

export function getTreeFromFlatData(
  flatData,
  getKey = (node) => node.id,
  getParentKey = (node) => node.parentId,
  rootKey = '0',
) {
  if (!flatData) {
    return [];
  }

  const childrenToParents = {};
  flatData.forEach((child, index) => {
    const parentKey = getParentKey(child);

    if (parentKey in childrenToParents) {
      childrenToParents[parentKey].push(child);
    } else {
      childrenToParents[parentKey] = [child];
    }
  });

  if (!(rootKey in childrenToParents)) {
    return [];
  }

  const keysArray = Object.keys(childrenToParents);

  for (let i = 1; i < keysArray.length; i++) {
    if (keysArray[i].includes(keysArray[i - 1])) {
      if (childrenToParents[keysArray[i - 1]]) {
        childrenToParents[keysArray[i - 1]][0].children =
          childrenToParents[keysArray[i]];
      }
    }
  }

  return Object.values(childrenToParents).flat();

  // const trav = (parent) => {
  //   const parentKey = getKey(parent);
  //   if (parentKey in childrenToParents) {
  //     return {
  //       ...parent,
  //       children: childrenToParents[parentKey].map((child) => trav(child)),
  //     };
  //   }

  //   return { ...parent };
  // };

  // return childrenToParents[rootKey].map((child) => trav(child));
}

export default withRouter((props) => {
  const { id } = props.match.params;
  const dispatch = useDispatch();
  const request = useSelector((state) => state.taxonomy?.taxonomy);

  const [treeData, setTreeData] = React.useState([
    { title: 'Chicken', children: [{ title: 'Egg' }] },
    { title: 'Fish', children: [{ title: 'fingerline' }] },
  ]);

  React.useEffect(() => {
    setTreeData(
      getTreeFromFlatData(
        request?.data?.['en'],
        (node) => node.title,
        (node) => node.title,
        request?.data?.['en'][0]?.title,
      ),
    );
  }, [request]);
  const getNodeKey = ({ treeIndex }) => treeIndex;

  React.useEffect(() => {
    dispatch(getTaxonomy(id));
  }, [id]);

  const onChange = (data) => {
    setTreeData(data);
  };

  return (
    <>
      <Container id="page-taxonomies" className="controlpanel-taxonomies">
        <Helmet title="Taxonomies" />
        <Segment.Group raised>
          <Segment className="primary">
            <Header as="h3">Taxonomy: {request?.title || 'loading...'}</Header>
          </Segment>

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
                                onClick={() =>
                                  setTreeData((state) => ({
                                    treeData: addNodeUnderParent({
                                      treeData: state.treeData,
                                      parentKey: path[path.length - 1],
                                      expandParent: true,
                                      getNodeKey,
                                      newNode: {
                                        title: `${
                                          node.title.split(' ')[0]
                                        }sson`,
                                      },
                                      addAsFirstChild: state.addAsFirstChild,
                                    }).treeData,
                                  }))
                                }
                              >
                                Add Child
                              </button>,
                              <button
                                onClick={() =>
                                  setTreeData((state) => ({
                                    treeData: removeNodeAtPath({
                                      treeData: state.treeData,
                                      path,
                                      getNodeKey,
                                    }),
                                  }))
                                }
                              >
                                Remove
                              </button>,
                            ],
                          })}
                        />
                      </div>
                    </Tab.Pane>
                  ),
                },
                // {
                //   menuItem: 'Edit taxonomy',
                //   render: () => (
                //     <Tab.Pane>
                //       <TaxonomySettings />
                //     </Tab.Pane>
                //   ),
                // },
              ]}
            />
          </Segment>
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
              </>
            }
          />
        </Portal>
      )}
    </>
  );
});
