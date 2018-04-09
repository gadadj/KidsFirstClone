import * as React from 'react';

export default ({ height, width, fill = '#fff', background = '#fff', ...props }) => {
  return (
    <svg viewBox="0 0 94 94" width={width} height={height} {...props}>
      <title>icon-error</title>
      <g id="Layer_1" data-name="Layer 1">
        <circle
          fill={background}
          stroke={fill}
          strokeMiterlimit={10}
          strokeWidth="8px"
          cx="47"
          cy="47"
          r="43"
        />
        <path
          fill={fill}
          d="M54.63,65.28A7.63,7.63,0,1,1,47,57.65,7.63,7.63,0,0,1,54.63,65.28ZM40.26,23.5l1.3,25.93a2.29,2.29,0,0,0,2.28,2.17h6.32a2.29,2.29,0,0,0,2.28-2.17l1.3-25.92a2.29,2.29,0,0,0-2.28-2.4H42.54A2.29,2.29,0,0,0,40.26,23.5Z"
        />
      </g>
    </svg>
  );
};
