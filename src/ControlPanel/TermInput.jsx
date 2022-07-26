import React from 'react';
import { Grid, Button, Label, Input, Segment } from 'semantic-ui-react';
import { SEPARATOR } from '../constants';
// import { Icon } from '@plone/volto/components';
// import addSVG from '@plone/volto/icons/add.svg';
// import deleteSVG from '@plone/volto/icons/delete.svg';

const MultipleValuesTermInput = (props) => {
  const { entries, onChange } = props;
  const [items, setItems] = React.useState(entries);
  const entries_copy = [...entries];
  const editable_item = entries_copy.splice(-1);
  const editable_index = entries.indexOf(editable_item[0]);
  return (
    <Input
      className="ccl-text-input"
      value={editable_item[0]}
      key={editable_index}
      onChange={(ev, { value }) => {
        let new_items = items;
        const old_value = new_items[editable_index];
        new_items[editable_index] = value;
        setItems(new_items);
        // onChange('title', SEPARATOR + new_items.join(SEPARATOR), old_value);
        onChange('title', value, old_value);
      }}
    />
  );
};

const TermInput = ({ entry, onChange }) => {
  const [isEditing, setEditing] = React.useState();
  return isEditing ? (
    <>
      <strong>
        {entry?.hierarchy ? entry.hierarchy.join(SEPARATOR) : entry.title}
      </strong>
      <Segment basic>
        <Grid columns={2}>
          <Grid.Row>
            <Grid.Column>
              <Label basic horizontal size="large">
                Title
              </Label>
              <MultipleValuesTermInput
                entries={entry.hierarchy}
                onChange={onChange}
              />
            </Grid.Column>
            <Grid.Column>
              <Label basic horizontal size="large">
                Token
              </Label>
              <Input
                className="ccl-text-input"
                value={entry.token}
                onChange={(e, { value }) => {
                  onChange('token', value, '');
                }}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Button
              compact
              onClick={() => {
                setEditing(false);
              }}
            >
              OK
            </Button>
          </Grid.Row>
        </Grid>
      </Segment>
    </>
  ) : (
    <Button title={entry.token} compact basic onClick={() => setEditing(true)}>
      <span>
        {entry?.hierarchy ? entry.hierarchy.join(SEPARATOR) : entry.title}
      </span>
    </Button>
  );
};

export default TermInput;
