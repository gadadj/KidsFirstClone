/* eslint-disable max-len */
import React from 'react';

type StudyIconProps = {
  className: string | undefined;
};

const StudyIcon = ({ className }: StudyIconProps) => (
  <svg
    className={`${className || ''}`}
    data-name="StydyIconSvg" 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 47.07 47.03"
  >
    <path
      className="cls-1"
      d="M22.58.22.68,11.63A1.4,1.4,0,0,0,.2,13.55,1.38,1.38,0,0,0,.68,14l21.9,11.4a2.12,2.12,0,0,0,1.9,0L46.38,14a1.4,1.4,0,0,0,.48-1.92,1.38,1.38,0,0,0-.48-.48L24.37.22A1.89,1.89,0,0,0,22.58.22Z"
      transform="translate(0.01 0)"
    />
    <path
      className="cls-1"
      d="M46.27,22.23l-4.1-2.1a1.1,1.1,0,0,0-.8,0l-15.7,8.2a4.44,4.44,0,0,1-2.2.5,5.4,5.4,0,0,1-2.2-.5l-15.7-8.2a1.1,1.1,0,0,0-.8,0l-4.1,2.1a1.4,1.4,0,0,0-.48,1.92,1.38,1.38,0,0,0,.48.48L22.57,36a2.12,2.12,0,0,0,1.9,0l21.9-11.4a1.45,1.45,0,0,0,.27-2A1.48,1.48,0,0,0,46.27,22.23Z"
      transform="translate(0.01 0)"
    />
    <path
      className="cls-1"
      d="M46.27,33l-4.1-2.1a1.1,1.1,0,0,0-.8,0l-15.7,8.2a4.44,4.44,0,0,1-2.2.5,5.4,5.4,0,0,1-2.2-.5L5.57,30.9a1.1,1.1,0,0,0-.8,0L.67,33a1.4,1.4,0,0,0-.48,1.92,1.38,1.38,0,0,0,.48.48l21.9,11.4a2.12,2.12,0,0,0,1.9,0l21.9-11.4a1.45,1.45,0,0,0,.3-2A1.41,1.41,0,0,0,46.27,33Z"
      transform="translate(0.01 0)"
    />
  </svg>
);

export default StudyIcon;
