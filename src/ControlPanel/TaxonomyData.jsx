import React from 'react';
import { isEqual } from 'lodash';
import { v4 as uuid } from 'uuid';
import { useDispatch, useSelector } from 'react-redux';
import { Segment, Ref, Button, Table } from 'semantic-ui-react';
import { getTaxonomy, updateTaxonomy } from '../actions';
import { Icon } from '@plone/volto/components';
import { DragDropList } from '@plone/volto/components';
import addSVG from '@plone/volto/icons/add.svg';
import deleteSVG from '@plone/volto/icons/delete.svg';
import dragSVG from '@plone/volto/icons/drag.svg';
import { SEPARATOR } from '../constants';
import subRightSVG from '@plone/volto/icons/sub-right.svg';

import TermInput from './TermInput';

const fixData = (data) => {
  Object.keys(data.order || {}).forEach((lang) => {
    data.order[lang].length = data.data?.[lang].length;
  });
  return data;
};

const TaxonomyData = (props) => {
  const { id } = props;
  const url = `/@taxonomy/${id}`;
  const dispatch = useDispatch();
  const dataLoaded = React.useRef(false);
  const [state, setState] = React.useState({});
  const taxonomy = useSelector((state) => state.taxonomy);
  const request = taxonomy.get;
  const { loading, loaded, error } = request || {};
  const data = taxonomy?.data?.[url];

  const onChangeTerm = (id, value, old_value, lang, i) => {
    const newState = { ...state };
    newState.data[lang].map((item) => {
      const h_index = item.hierarchy.indexOf(old_value);
      if (id === 'title' && h_index !== -1) {
        item.hierarchy[h_index] = value;
        item.title = SEPARATOR + item.hierarchy.join(SEPARATOR);
      }
      if (id === 'token') {
        item.token = value;
      }
      return item;
    });
    setState(newState);
  };

  React.useEffect(() => {
    if (id && !loaded && !loading) {
      const action = getTaxonomy(url);
      dispatch(action);
    }
    if (data && !isEqual(data, state) && !dataLoaded.current) {
      dataLoaded.current = true;
      setState(fixData(data));
    }
  }, [dispatch, url, id, state, data, loading, loaded, error]);

  let langs = ['en'];
  let childList = [];
  if (state.data) {
    // langs = Object.keys(state?.data || {}).sort();
    childList = Array(state?.data?.[langs[0]].length)
      .fill(0)
      .map((_, i) => [i.toString(), i.toString()]);
  }

  return (
    <Segment.Group>
      <Segment>
        <Table compact singleLine attached>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell textAlign="left" width="1"></Table.HeaderCell>
              {langs.map((lang) => (
                <Table.HeaderCell textAlign="left" key={lang}>
                  {lang}
                </Table.HeaderCell>
              ))}
              <Table.HeaderCell textAlign="right" width="1"></Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <DragDropList
            childList={childList}
            as="tbody"
            onMoveItem={(result) => {
              const { source, destination } = result;
              const ns = JSON.parse(JSON.stringify(state));
              Object.keys(ns.order).forEach((lang) => {
                const x = ns.order[lang][source.index];
                const y = ns.order[lang][destination.index];
                ns.order[lang][destination.index] = x;
                ns.order[lang][source.index] = y;
              });
              setState(ns);
              return true;
            }}
          >
            {({ index, draginfo }) => {
              return (
                <Ref innerRef={draginfo.innerRef} key={index}>
                  <Table.Row {...draginfo.draggableProps}>
                    <Table.Cell>
                      <div {...draginfo.dragHandleProps}>
                        <Icon name={dragSVG} size="18px" />
                      </div>
                    </Table.Cell>
                    {langs.map((lang) => {
                      const i = state.order[lang][index];
                      const entry = state.data[lang][i];
                      return (
                        entry && (
                          <>
                            <Table.Cell key={lang}>
                              {entry?.hierarchy.map((h, index) =>
                                index ? (
                                  <>
                                    <Icon name={subRightSVG} size="18px" />{' '}
                                  </>
                                ) : (
                                  ''
                                ),
                              )}
                              <TermInput
                                entry={entry}
                                onChange={(id, value, old_value) =>
                                  onChangeTerm(id, value, old_value, lang, i)
                                }
                              />
                            </Table.Cell>
                            <Table.Cell>
                              <Button
                                basic
                                onClick={() => {
                                  const newState = { ...state };
                                  let lang_array = [...newState.data[lang]];
                                  let new_item = JSON.parse(
                                    JSON.stringify(newState.data[lang][i]),
                                  );
                                  new_item.hierarchy.splice(-1, 1, '...');
                                  new_item.title =
                                    SEPARATOR +
                                    new_item?.hierarchy.join(SEPARATOR);
                                  new_item['token'] = uuid();
                                  if (index === lang_array.length - 1) {
                                    lang_array.push(new_item);
                                  } else {
                                    lang_array.splice(i + 1, 0, new_item);
                                  }
                                  newState.data[lang] = lang_array;

                                  // let order_array = [
                                  //   ...Array(lang_array.length).keys(),
                                  // ];
                                  // newState.order[lang] = order_array;
                                  // newState.count[lang] = lang_array.length;
                                  setState(newState);
                                }}
                              >
                                <Icon
                                  className="circled"
                                  name={addSVG}
                                  size="12px"
                                />
                              </Button>
                              <Button
                                basic
                                onClick={() => {
                                  const newState = { ...state };
                                  let lang_array = newState.data[lang];
                                  lang_array.splice(i, 1);
                                  newState.data[lang] = lang_array;

                                  let order_array = newState.order[lang];
                                  order_array.splice(i, 1);
                                  newState.order[lang] = order_array;

                                  newState.count[lang] = lang_array.length;

                                  setState(newState);
                                }}
                              >
                                <Icon
                                  className="circled"
                                  name={deleteSVG}
                                  size="12px"
                                />
                              </Button>
                            </Table.Cell>
                          </>
                        )
                      );
                    })}
                  </Table.Row>
                </Ref>
              );
            }}
          </DragDropList>
        </Table>
      </Segment>
      <Segment>
        <Button
          onClick={() => {
            const newState = { ...state };
            Object.keys(state.data).forEach((lang) => {
              newState.data[lang].push({
                token: uuid(),
                title: '...',
                hierarchy: ['...'],
              });
              newState.order[lang].push(newState.order[lang].length);
            });
            setState(newState);
          }}
        >
          Add new entry
        </Button>
        <Button
          floated="right"
          onClick={() => {
            dispatch(updateTaxonomy(url, state));
          }}
        >
          Save
        </Button>
      </Segment>
    </Segment.Group>
  );
};

export default TaxonomyData;

// export default DragDropContext(HTML5Backend)(TaxonomyData);
// Input, Dropdown
// import backSVG from '@plone/volto/icons/back.svg';
// import cutSVG from '@plone/volto/icons/cut.svg';
// import copySVG from '@plone/volto/icons/copy.svg';
// import tagSVG from '@plone/volto/icons/tag.svg';
// import renameSVG from '@plone/volto/icons/rename.svg';
// import semaphoreSVG from '@plone/volto/icons/semaphore.svg';
// import uploadSVG from '@plone/volto/icons/upload.svg';
// import propertiesSVG from '@plone/volto/icons/properties.svg';
// import pasteSVG from '@plone/volto/icons/paste.svg';
// import zoomSVG from '@plone/volto/icons/zoom.svg';
// import checkboxUncheckedSVG from '@plone/volto/icons/checkbox-unchecked.svg';
// import checkboxCheckedSVG from '@plone/volto/icons/checkbox-checked.svg';
// import checkboxIndeterminateSVG from '@plone/volto/icons/checkbox-indeterminate.svg';
// import configurationSVG from '@plone/volto/icons/configuration-app.svg';
// import sortDownSVG from '@plone/volto/icons/sort-down.svg';
// import sortUpSVG from '@plone/volto/icons/sort-up.svg';
// import downKeySVG from '@plone/volto/icons/down-key.svg';
// import moreSVG from '@plone/volto/icons/more.svg';
// import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';
// import { DragDropContext } from 'react-dnd';
// import HTML5Backend from 'react-dnd-html5-backend';
