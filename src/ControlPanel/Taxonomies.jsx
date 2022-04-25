import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { values, map, includes, pull } from 'lodash';
import {
  Container,
  Header,
  Segment,
  Table,
  Button,
  Confirm,
  Checkbox,
} from 'semantic-ui-react';
import { Helmet } from '@plone/volto/helpers';
import { Icon, Toolbar } from '@plone/volto/components';
import { Link } from 'react-router-dom';
import { Portal } from 'react-portal';

import backSVG from '@plone/volto/icons/back.svg';
import cicleAddSvg from '@plone/volto/icons/circle-plus.svg';
import deleteSVG from '@plone/volto/icons/delete.svg';

import AddTaxonomy from './AddTaxonomy';
import { deleteTaxonomy, getTaxonomy } from '../actions';

export default (props) => {
  const taxonomies = useSelector((state) => state.taxonomy?.data);
  const dispatch = useDispatch();
  const [show, setShow] = React.useState(false);
  const [selected, setSelected] = React.useState([]);
  const [showDelete, setShowDelete] = React.useState(false);

  React.useEffect(() => {
    if (!taxonomies) {
      dispatch(getTaxonomy());
    }
  }, [taxonomies, dispatch]);

  const onDeleteOk = () => {
    if (selected.length) {
      for (let i = 0; i < selected.length; i++) {
        dispatch(deleteTaxonomy(selected[i]));
      }
    }
    setSelected([]);
    setShowDelete(false);
  };

  const onDeleteCancel = () => {
    setShowDelete(false);
  };

  const onChangeSelect = (id) => {
    setSelected((prevState) =>
      !includes(selected, id)
        ? [...(prevState || []), id]
        : [...pull(prevState, id)],
    );
  };

  return (
    <Container id="page-taxonomies" className="controlpanel-taxonomies">
      <Helmet title="Taxonomies" />
      {show && <AddTaxonomy {...props} setShow={setShow} />}
      <Confirm
        open={showDelete}
        header={'Delete Taxonomies'}
        content={
          <div className="content">
            <FormattedMessage
              id="Do you really want to delete the following taxonomies?"
              defaultMessage="Do you really want to delete the following taxonomies?"
            />
            <ul className="content">
              {map(selected, (item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        }
        onCancel={onDeleteCancel}
        onConfirm={onDeleteOk}
        size={null}
      />
      <Segment.Group raised>
        <Segment className="primary">Taxonomy settings</Segment>
        <Segment>
          <Header as="h3">Existing taxonomies</Header>
        </Segment>
        <Segment>
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>
                  <FormattedMessage id="Select" defaultMessage="Select" />
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <FormattedMessage id="Type" defaultMessage="Type" />
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <FormattedMessage id="Count" defaultMessage="Count" />
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {taxonomies?.map((item) => (
                <Table.Row key={item?.['name']}>
                  <Table.Cell textAlign="left">
                    <Checkbox
                      checked={selected?.includes(item?.['name'])}
                      onChange={(e) => {
                        e.stopPropagation();
                        onChangeSelect(item?.['name']);
                      }}
                      value={item?.['name']}
                    />
                  </Table.Cell>
                  <Table.Cell textAlign="left">
                    <Link to={`${props.location.pathname}/${item?.['name']}`}>
                      {item?.title}
                    </Link>
                  </Table.Cell>
                  <Table.Cell textAlign="right">
                    {item?.count?.['en']}
                  </Table.Cell>
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
                <Button
                  id="delete-taxonomy"
                  aria-label={'delete-taxonomy'}
                  onClick={() => {
                    setShowDelete(true);
                  }}
                >
                  <Icon
                    name={deleteSVG}
                    size="35px"
                    color={selected.length > 0 ? '#e40166' : 'grey'}
                    className="delete"
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
