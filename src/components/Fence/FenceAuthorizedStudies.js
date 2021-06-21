import React, { Fragment } from 'react';
import { Spin } from 'antd';
import { injectState } from 'freactal';
import get from 'lodash/get';
import { compose } from 'recompose';

import RightChevron from 'icons/DoubleChevronRightIcon';
import StackIcon from 'icons/StackIcon';
import { withHistory } from 'services/history';
import { fenceConnectionInitializeHoc } from 'stateProviders/provideFenceConnections';
import Column from 'uikit/Column';
import { Span } from 'uikit/Core';
import ExternalLink from 'uikit/ExternalLink';
import { PromptMessageContainer } from 'uikit/PromptMessage';
import Row from 'uikit/Row';

import './FenceAuthorizedStudies.css';

const sqonForStudy = (studyId) => ({
  op: 'and',
  content: [
    {
      op: 'in',
      content: {
        field: 'participants.study.external_id',
        value: [studyId],
      },
    },
  ],
});

const FenceProjectList = ({ history, fenceConnectionsInitialized, authStudies }) =>
  !fenceConnectionsInitialized ? (
    <Spin />
  ) : (
    authStudies.map(({ id, studyShortName }) => {
      const sqon = sqonForStudy(id);
      return (
        <Row className={'itemRowContainer'} key={id}>
          <Column justifyContent="center" p={15}>
            <StackIcon width={20} />
          </Column>
          <Column flex={1} justifyContent="center" pr={10}>
            <Span>
              <strong>{studyShortName}</strong> ({`${id}`})
            </Span>
          </Column>
          <Column justifyContent="center">
            <ExternalLink hasExternalIcon={false}>
              <Span
                onClick={() => history.push(`/search/file?sqon=${encodeURI(JSON.stringify(sqon))}`)}
              >
                {'View data files'} <RightChevron width={10} fill={'#90278e'} />
              </Span>
            </ExternalLink>
          </Column>
        </Row>
      );
    })
  );

const FenceAuthorizedStudies = compose(
  withHistory,
  injectState,
  fenceConnectionInitializeHoc,
)(({ fence, history, state: { fenceStudies, fenceConnectionsInitialized } }) => {
  const authStudies = get(fenceStudies, `${fence}.authorizedStudies`, []);
  return (
    <div className={'fenceAuthorizedStudiesContainer'}>
      <Column>
        {authStudies.length ? (
          <Fragment>
            <Row style={{ margin: '10px 0' }}>
              <Span className="title" fontWeight={'bold'}>
                {' '}
                You have access to controlled datasets from the following studies:
              </Span>
            </Row>
            <Column pl={15}>
              <FenceProjectList
                authStudies={authStudies}
                history={history}
                fenceConnectionsInitialized={fenceConnectionsInitialized}
              />
            </Column>
          </Fragment>
        ) : (
          <Row>
            <PromptMessageContainer warning mb={0} width={'100%'}>
              <Span className="title" fontWeight={'bold'}>
                {"You don't have access to any study-controlled datasets."}
              </Span>
            </PromptMessageContainer>
          </Row>
        )}
      </Column>
    </div>
  );
});

export default FenceAuthorizedStudies;
