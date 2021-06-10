import React from 'react';
import { Container, Header, Segment, Tab } from 'semantic-ui-react';
import { Helmet } from '@plone/volto/helpers';
import { useDispatch, useSelector } from 'react-redux';
import { Icon, Toolbar } from '@plone/volto/components';
import { Portal } from 'react-portal';
import { Link } from 'react-router-dom';
import { getContent } from '@plone/volto/actions';
import backSVG from '@plone/volto/icons/back.svg';

// import TaxonomySettings from './TaxonomySettings';
import TaxonomyData from './TaxonomyData';

export default (props) => {
  const { id } = props.match.params;
  const url = `/@taxonomy/${id}`;
  const dispatch = useDispatch();
  const request = useSelector((state) => state.content.subrequests[url]);

  React.useEffect(() => {
    if (!request) {
      dispatch(getContent(url, null, url));
    }
  }, [request, dispatch, url]);

  return (
    <>
      <Container id="page-taxonomies" className="controlpanel-taxonomies">
        <Helmet title="Taxonomies" />
        <Segment.Group raised>
          <Segment className="primary">
            <Header as="h3">
              Taxonomy: {request?.data?.title || 'loading...'}
            </Header>
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
                      <TaxonomyData id={props?.match?.params?.id} />
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
};
