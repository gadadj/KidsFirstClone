import React from 'react';

import CardContent from './CardContent';
import CardHeader from './CardHeader';
import { CardWrapper, HeaderWrapper } from './styles';

const Card = ({
  Header,
  Content = CardContent,
  children,
  className,
  scrollable,
  title,
  inactive = false,
}) => {
  const DefaultHeader = <CardHeader title={title} />;

  return (
    <CardWrapper className={className} inactive={inactive}>
      <HeaderWrapper inactive={inactive}>{Header || DefaultHeader}</HeaderWrapper>
      <Content scrollable={scrollable}>{children}</Content>
    </CardWrapper>
  );
};

export default Card;
