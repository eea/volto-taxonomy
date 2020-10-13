import React from 'react';
import { Grid, Button, Label, Input } from 'semantic-ui-react';

const TermInput = ({ entry, onChange }) => {
  const [isEditing, setEditing] = React.useState();
  return isEditing ? (
    <Grid columns={2}>
      <Grid.Row>
        <Grid.Column>
          <div>
            <Label>Title</Label>
          </div>
          <Input
            value={entry.title}
            onChange={(ev, { value }) => {
              onChange('title', value);
            }}
          />
        </Grid.Column>
        <Grid.Column>
          <div>
            <Label>Token</Label>
          </div>
          <Input
            value={entry.token}
            onChange={(e, { value }) => {
              onChange('token', value);
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
  ) : (
    <Button title={entry.token} compact basic onClick={() => setEditing(true)}>
      <span>{entry.title}</span>
    </Button>
  );
};

export default TermInput;
