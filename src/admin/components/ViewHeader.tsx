import React from 'react';
import { Th, Typography } from '@strapi/design-system';

const ViewHeader: React.FC = () => {
  return (
    <Th>
      <Typography variant="sigma" textColor="neutral600">
        View
      </Typography>
    </Th>
  );
};

export default ViewHeader;
