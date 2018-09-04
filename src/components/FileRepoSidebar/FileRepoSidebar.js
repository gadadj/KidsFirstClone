import React from 'react';
import { compose, withState } from 'recompose';
import { withTheme } from 'emotion-theming';
import { Trans } from 'react-i18next';
import { injectState } from 'freactal';
import { ColumnsState } from '@arranger/components/dist/DataTable';

import LeftChevron from 'icons/DoubleChevronLeftIcon';
import RightChevron from 'icons/DoubleChevronRightIcon';
import Heading from 'uikit/Heading';
import { Span } from 'uikit/Core';
import CavaticaCopyButton from 'components/cavatica/CavaticaCopyButton';
import FamilyManifestModal from '../FamilyManifestModal';
import { trackUserInteraction, TRACKING_EVENTS } from 'services/analyticsTracking';
import { downloadBiospecimen } from 'services/downloadData';
import {
  Slideable,
  Container,
  Titlebar,
  Content,
  Text,
  Section,
  DownloadButton,
  DownloadButtonsContainer,
} from './ui';
import ClinicalDownloadButton from './ClinicalDownloadButton';

const FileManifestsDownloadInput = compose(injectState)(({ effects: { setModal }, ...props }) => (
  <DownloadButton
    content={() => <Trans>Manifest</Trans>}
    onClick={() =>
      setModal({
        title: 'Download Manifest',
        component: <FamilyManifestModal {...props} />,
      })
    }
    {...props}
  />
));

const BioSpecimentDownloadButton = ({ sqon, projectId, ...props }) => (
  <ColumnsState
    projectId={projectId}
    graphqlField="participant"
    render={({ state }) => (
      <DownloadButton
        content={() => <Trans>BioSpecimen</Trans>}
        onClick={() => {
          let downloadConfig = { sqon, columns: state.columns };
          trackUserInteraction({
            category: TRACKING_EVENTS.categories.fileRepo.actionsSidebar,
            action: TRACKING_EVENTS.actions.download.report,
            label: 'Biospecimen',
          });
          const downloader = downloadBiospecimen(downloadConfig);
          return downloader();
        }}
        {...props}
      />
    )}
  />
);

const FileRepoSidebar = compose(withTheme, withState('expanded', 'setExpanded', true))(
  ({
    theme,
    expanded,
    setExpanded,
    style,
    containerWidth = '25%',
    contentSidePadding = 15,
    ...props
  }) => (
    <Slideable {...{ contentSidePadding, containerWidth, expanded }}>
      <Container {...{ contentSidePadding, containerWidth }}>
        <Titlebar onClick={() => setExpanded(!expanded)}>
          <Heading fontSize="18px">
            <Span mr="10px">
              {' '}
              {expanded ? (
                <RightChevron width={14} fill={theme.secondary} />
              ) : (
                <LeftChevron width={14} fill={theme.secondary} />
              )}{' '}
            </Span>
            <Trans>Actions</Trans>
          </Heading>
        </Titlebar>
        <Content {...{ expanded, contentSidePadding, containerWidth }}>
          <Section>
            <Text>
              <Trans i18nKey="fileRepoSidebar.noneSelected">
                If you have not selected any files, all files in your query will be included in the
                actions.
              </Trans>
            </Text>
          </Section>
          <Section>
            <Heading fontSize="16px">
              <Trans>Data Analysis</Trans>
            </Heading>
            <CavaticaCopyButton {...props} />
          </Section>
          <Section>
            <Heading fontSize="16px">
              <Trans>Download</Trans>
            </Heading>
            <DownloadButtonsContainer>
              <FileManifestsDownloadInput {...props} />
              <BioSpecimentDownloadButton {...props} />
              <ClinicalDownloadButton {...props} />
            </DownloadButtonsContainer>
          </Section>
        </Content>
      </Container>
    </Slideable>
  ),
);

export default FileRepoSidebar;
