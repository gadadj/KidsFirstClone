import React from 'react';
import styled from 'react-emotion';

export const StyledH3 = props => {
  const Component = styled('h3')`
    font-family: Montserrat;
    font-size: 20px;
    font-weight: 300;
    line-height: 1;
    letter-spacing: 0.3px;
    text-align: left;
    color: ${({ theme }) => theme.primaryHover};
    margin: 0;
  `;
  return <Component {...{ ...props, className: `styledH3 ${props.className}` }} />;
};

export const StyledH2 = styled('h2')`
  font-family: Montserrat;
  font-size: 28px;
  font-weight: 400;
  letter-spacing: 0.4px;
  color: ${({ theme }) => theme.primaryHover};
  margin: 0px;
`;

export const StyledH4 = styled('h4')`
  font-family: Montserrat;
  font-size: 18px;
  font-weight: 300;
  line-height: 1;
  letter-spacing: 0.3px;
  text-align: left;
  color: ${({ theme }) => theme.primaryHover};
  margin: 0 0 5px 0;
`;
