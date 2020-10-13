import React from 'react';
import { isEqual } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { getContent } from '@plone/volto/actions';
import { Segment, Ref, Button, Label, Table } from 'semantic-ui-react';
import { Icon } from '@plone/volto/components';
import { DragDropList } from '@eeacms/volto-blocks-form/components';
import deleteSVG from '@plone/volto/icons/delete.svg';
import dragSVG from '@plone/volto/icons/drag.svg';

const TaxonomyData = (props) => {
  const { id } = props;
  const url = `/@taxonomy-data/${id}`;
  const dispatch = useDispatch();
  const request = useSelector((state) => state.content.subrequests[url]);
  const dataLoaded = React.useRef(false);
  const [state, setState] = React.useState({});

  React.useEffect(() => {
    if (!request && id) {
      dispatch(getContent(url, null, url));
    }
    const reqData = request?.data || {};
    if (reqData && !isEqual(reqData, state) && !dataLoaded.current) {
      dataLoaded.current = true;
      setState(reqData);
    }
  }, [request, dispatch, url, id, state, request?.data]);

  let langs = [];
  let childList = [];
  if (state.data) {
    langs = Object.keys(state?.data || {}).sort();
    childList = Array(state?.data?.[langs[0]].length)
      .fill(0)
      .map((_, i) => [i, i]);
  }

  // console.log('data', request);
  // console.log('childlist', childList);

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
                        <Table.Cell key={lang}>
                          <Label title={entry.token}>
                            <span>{entry.title}</span>
                          </Label>
                        </Table.Cell>
                      );
                    })}
                    <Table.Cell>
                      <Button basic onClick={() => {}}>
                        <Icon
                          className="circled"
                          name={deleteSVG}
                          size="12px"
                        />
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                </Ref>
              );
            }}
          </DragDropList>
        </Table>
      </Segment>
      <Segment>
        <Button>Add new entry</Button>
        <Button floated="right">Save</Button>
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
