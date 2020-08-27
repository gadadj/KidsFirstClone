import React from 'react';
import PropTypes from 'prop-types';

import CardContent from './CardContent';
import CardHeader from './CardHeader';
import { CardWrapper as CWrapper, HeaderWrapper as HWrapper } from './styles';

const Card = ({
  Header,
  Content = CardContent,
  children,
  scrollable = false,
  title,
  inactive = false,
  showHeader = true,
  HeaderWrapper = HWrapper,
  CardWrapper = CWrapper,
  className,
  badge,
  showScrollFullHeight,
}) => {
  const DefaultHeader = <CardHeader title={title} badge={badge} />;

  return (
    <CardWrapper className={className} inactive={inactive}>
      {showHeader && <HeaderWrapper inactive={inactive}>{Header || DefaultHeader}</HeaderWrapper>}
      <Content showScrollFullHeight={showScrollFullHeight} scrollable={scrollable}>
        {children}
      </Content>
    </CardWrapper>
  );
};

Card.propTypes = {
  Header: PropTypes.node,
  Content: PropTypes.func,
  children: PropTypes.node,
  scrollable: PropTypes.bool,
  title: PropTypes.node,
  inactive: PropTypes.bool,
  showHeader: PropTypes.bool,
  HeaderWrapper: PropTypes.any,
  CardWrapper: PropTypes.any,
  className: PropTypes.string,
  badge: PropTypes.string,
  showScrollFullHeight: PropTypes.bool,
};

export default Card;
