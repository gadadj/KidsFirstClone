import React from 'react';
import { Line } from 'rc-progress';

import 'rc-progress/assets/index.css';

const ProgressBar = ({ numerator, denominator }) => (
  <Line
    strokeWidth="2"
    trailWidth="2"
    strokeColor={'#f79122'}
    percent={(numerator / denominator) * 100}
  />
);

export default ProgressBar;
