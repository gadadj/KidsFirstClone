import * as React from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion';

import { applyDefaultStyles } from 'uikit/Core';
import Column from 'uikit/Column';
import Chip from 'uikit/Chip';
import Row from 'uikit/Row';
import CircleIcon from 'uikit/CircleIcon';
import filesSvg from 'icons/FileIcon';
import participantSvg from 'icons/ParticipantIcon';

const Title = applyDefaultStyles(styled('h1')`
  display: flex;
  font-family: ${({ theme }) => theme.fonts.default};
  font-size: 28px;
  font-weight: 500;
  text-align: left;
  color: ${({ theme }) => theme.cardTitle};
  margin: 0;
  padding-left: 20px;
`);

const entityIcon = type => {
  switch (type) {
    case 'file':
      return <CircleIcon color="#009cbb" size={60} Icon={filesSvg} iconSize={22} />;
    case 'participant':
      return <CircleIcon color="#ed2b9e" size={60} Icon={participantSvg} />;
    default:
      return null;
  }
};

const EntityTitle = ({ icon, title, tags = [] }) => (
  <Row>
    {entityIcon(icon)}
    <Column style={{ justifyContent: 'center' }}>
      <Title>{title}</Title>
    </Column>
    {tags ? tags.map((tag, i) => <Chip key={`${i}${tag}`}>{tag}</Chip>) : null}
  </Row>
);

EntityTitle.PropTypes = {
  title: PropTypes.string,
  icon: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.string),
};

export default EntityTitle;
