import React from 'react';
import { uniq } from 'lodash';
import { Trans } from 'react-i18next';
import { ColumnsState } from '@arranger/components/dist/DataTable';

import IconWithLoading from 'icons/IconWithLoading';
import downloadIcon from 'assets/icon-download-white.svg';

import {
  downloadBiospecimen,
  clinicalDataParticipants,
  clinicalDataFamily,
} from 'services/downloadData';
import PillInputWithLoadingOptionsAndButton from 'uikit/PillInputWithLoadingOptionsAndButton';
import { familyMemberAndParticipantIds } from '../FamilyManifestModal';

export default ({ api, projectId, theme, sqon }) => (
  <ColumnsState
    projectId={projectId}
    graphqlField="participant"
    render={({ state }) => (
      <PillInputWithLoadingOptionsAndButton
        options={{
          'Clinical (Participant)': {
            onSelected: async () => {
              const { participantIds } = await familyMemberAndParticipantIds({
                api,
                sqon,
              });
              return clinicalDataParticipants({
                sqon: {
                  op: 'in',
                  content: {
                    field: 'participants.kf_id',
                    value: participantIds,
                  },
                },
                columns: state.columns,
              })();
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
              return clinicalDataFamily({
                sqon: {
                  op: 'in',
                  content: {
                    field: 'participants.kf_id',
                    value: uniq([...familyMemberIds, ...participantIds]),
                  },
                },
                columns: state.columns,
              })();
            },
          },
          Biospecimen: { onSelected: downloadBiospecimen({ sqon, columns: state.columns }) },
        }}
        render={({ loading }) => {
          return (
            <React.Fragment>
              <IconWithLoading {...{ loading, icon: downloadIcon }} />
              <Trans css={theme.uppercase}>Download</Trans>
            </React.Fragment>
          );
        }}
      />
    )}
  />
);
