import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { values } from 'lodash';
import { Container, Header, Segment, Table, Button } from 'semantic-ui-react';
import { Helmet } from '@plone/volto/helpers';
import { Icon, Toolbar } from '@plone/volto/components';
import { getContent } from '@plone/volto/actions';
import { Link } from 'react-router-dom';
import { Portal } from 'react-portal';

// import circleBottomSVG from '@plone/volto/icons/circle-bottom.svg';
// import circleTopSVG from '@plone/volto/icons/circle-top.svg';
import backSVG from '@plone/volto/icons/back.svg';
import cicleAddSvg from '@plone/volto/icons/circle-plus.svg';

import AddTaxonomy from './AddTaxonomy';

export default (props) => {
  const url = '/@taxonomy';
  const request = useSelector((state) => state.content.subrequests[url]);
  const dispatch = useDispatch();
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    if (!request) {
      dispatch(getContent(url, null, url));
    }
  }, [request, dispatch]);

  return (
    <Container id="page-taxonomies" className="controlpanel-taxonomies">
      <Helmet title="Taxonomies" />
      {show && <AddTaxonomy {...props} setShow={setShow} />}
      <Segment.Group raised>
        <Segment className="primary">Taxonomy settings</Segment>
        <Segment>
          <Header as="h3">Existing taxonomies</Header>
        </Segment>

        <Segment>
          <Table compact singleLine striped>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>
                  <FormattedMessage id="Type" defaultMessage="Type" />
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <FormattedMessage id="Items" defaultMessage="Items" />
                </Table.HeaderCell>
                <Table.HeaderCell textAlign="right">
                  <FormattedMessage id="Actions" defaultMessage="Actions" />
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {values(request?.data).map((item) => (
                <Table.Row key={item?.['name']}>
                  <Table.Cell>
                    <Link to={`${props.location.pathname}/${item?.['name']}`}>
                      {item?.title}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{item?.count?.['en-gb']}</Table.Cell>
                  <Table.Cell textAlign="right"></Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Segment>
      </Segment.Group>

      {__CLIENT__ && (
        <Portal node={document.getElementById('toolbar')}>
          <Toolbar
            pathname={props.location.pathname}
            hideDefaultViewButtons
            inner={
              <>
                <Link to="/controlpanel" className="item">
                  <Icon
                    name={backSVG}
                    aria-label="Back"
                    className="contents circled"
                    size="30px"
                    title="Back"
                  />
                </Link>
                <Button
                  id="add-taxonomy"
                  aria-label={'add-taxonomy'}
                  onClick={() => {
                    setShow(true);
                  }}
                >
                  <Icon
                    name={cicleAddSvg}
                    color="#007eb1"
                    aria-label="Add Taxonomy"
                    title={'Add Taxonomy'}
                    size="40px"
                  />
                </Button>
              </>
            }
          />
        </Portal>
      )}
    </Container>
  );
};
