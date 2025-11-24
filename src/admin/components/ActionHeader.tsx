import React from 'react';
import { Th, Typography } from '@strapi/design-system';

const ActionHeader: React.FC = () => {
  return (
    <Th>
      <Typography variant="sigma" textColor="neutral600">
        Action
      </Typography>
    </Th>
  );
};

export default ActionHeader;
