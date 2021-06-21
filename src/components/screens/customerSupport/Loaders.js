import React from 'react';
import { Loader, Dimmer, Segment, Image } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';

const Loaders = () => {
  return (
    <Segment>
      <Dimmer active>
        <Loader />
      </Dimmer>

      <Image src='/images/wireframe/short-paragraph.png' />
    </Segment>
  );
};

export default Loaders;
