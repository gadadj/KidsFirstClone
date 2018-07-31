import React from 'react';
import { compose } from 'recompose';
import { uniq } from 'lodash';
import { Trans } from 'react-i18next';
import { css } from 'react-emotion';
import { withTheme } from 'emotion-theming';
import { ColumnsState } from '@arranger/components/dist/DataTable';

import IconWithLoading from 'icons/IconWithLoading';
import DownloadIcon from 'icons/DownloadIcon';
import PillInputWithLoadingOptionsAndButton from 'uikit/PillInputWithLoadingOptionsAndButton';
import { familyMemberAndParticipantIds } from '../FamilyManifestModal';

import { trackUserInteraction, TRACKING_EVENTS } from 'services/analyticsTracking';
import { withApi } from 'services/api';
import {
  downloadBiospecimen,
  clinicalDataParticipants,
  clinicalDataFamily,
} from 'services/downloadData';

export default compose(withApi, withTheme)(({ api, projectId, theme, sqon, className }) => (
  <ColumnsState
    projectId={projectId}
    graphqlField="participant"
    render={({ state }) => (
      <PillInputWithLoadingOptionsAndButton
        containerClassName={className}
        options={{
          'Clinical (Participant)': {
            onSelected: async () => {
              const { participantIds } = await familyMemberAndParticipantIds({
                api,
                sqon,
              });
              let downloadConfig = {
                sqon: {
                  op: 'in',
                  content: {
                    field: 'participants.kf_id',
                    value: participantIds,
                  },
                },
                columns: state.columns,
              };
              trackUserInteraction({
                category: TRACKING_EVENTS.categories.fileRepo.actionsSidebar,
                action: TRACKING_EVENTS.actions.download.report,
                label: 'Clinical (Participant)',
              });
              const downloader = clinicalDataParticipants(downloadConfig);
              return downloader();
            },
          },
          'Clinical (Participant and family)': {
            tooltip: `No file was found for family members`,
            onDropdownOpen: async () => {
              const { familyMembersWithoutParticipantIds } = await familyMemberAndParticipantIds({
                api,
                sqon,
              });
              return (familyMembersWithoutParticipantIds || []).length;
            },
            onSelected: async () => {
              const { familyMemberIds, participantIds } = await familyMemberAndParticipantIds({
                api,
                sqon,
              });
              let downloadConfig = {
                sqon: {
                  op: 'in',
                  content: {
                    field: 'participants.kf_id',
                    value: uniq([...familyMemberIds, ...participantIds]),
                  },
                },
                columns: state.columns,
              };
              trackUserInteraction({
                category: TRACKING_EVENTS.categories.fileRepo.actionsSidebar,
                action: TRACKING_EVENTS.actions.download.report,
                label: 'Clinical (Participant and family)',
              });
              const downloader = clinicalDataFamily(downloadConfig);
              return downloader();
            },
          },
          Biospecimen: {
            onSelected: () => {
              let downloadConfig = { sqon, columns: state.columns };
              trackUserInteraction({
                category: TRACKING_EVENTS.categories.fileRepo.actionsSidebar,
                action: TRACKING_EVENTS.actions.download.report,
                label: 'Biospecimen',
              });
              const downloader = downloadBiospecimen(downloadConfig);
              return downloader();
            },
          },
        }}
        render={({ loading }) => {
          return (
            <React.Fragment>
              <IconWithLoading
                {...{ loading }}
                Icon={() => (
                  <DownloadIcon
                    className={css`
                      margin-right: 9px;
                    `}
                  />
                )}
              />
              <Trans css={theme.uppercase}>Download</Trans>
            </React.Fragment>
          );
        }}
      />
    )}
  />
));
