import React from 'react';
import _ from 'lodash';
import { pickData } from './utils';
import { formatToGB } from './utils';
import { trackUserInteraction, TRACKING_EVENTS } from 'services/analyticsTracking';
import { kfWebRoot } from 'common/injectGlobals';

import ExternalLink from 'uikit/ExternalLink';

export const toFilePropertiesSummary = data => {
  const participants = data.participants.hits.edges[0].node;
  const study = participants.study;
  const biospecimens = participants.biospecimens.hits.edges[0].node;

  const experimentalStrategies =
    _.uniq(
      data.sequencing_experiments.hits.edges
        .filter(edge => edge.node && edge.node.experiment_strategy)
        .map(edge => edge.node.experiment_strategy),
    ).join(', ') || '--';

  return [
    { title: 'Kids First ID:', summary: pickData(data, 'kf_id') },

    { title: 'Name:', summary: pickData(data, 'file_name') },
    {
      title: 'Study:',
      summary: (
        <ExternalLink
          href={`${kfWebRoot}/support/studies-and-access`}
          onClick={e => {
            trackUserInteraction({
              category: TRACKING_EVENTS.categories.entityPage.file,
              action: TRACKING_EVENTS.actions.click + `: File Property: Study`,
              label: `${study.short_name} (${study.kf_id})`,
            });
          }}
        >
          {`${study.short_name} (${study.kf_id})`}
        </ExternalLink>
      ),
    },
    { title: 'Access:', summary: data.controlled_access ? 'Controlled' : 'Open' },
    { title: 'Consent Codes:', summary: pickData(biospecimens, 'dbgap_consent_code') },
    {
      title: 'External ID:',
      summary: pickData(data, 'external_id'),
    },
    {
      title: 'Harmonized Data:',
      summary: data.is_harmonized ? 'Yes' : 'No',
    },
    { title: 'Reference Genome:', summary: pickData(data, 'reference_genome') },
    {
      title: 'Experimental Strategy:',
      summary: experimentalStrategies,
    },
    { title: 'Data Type:', summary: pickData(data, 'data_type') },
    { title: 'File Format:', summary: pickData(data, 'file_format') },
    { title: 'Size:', summary: pickData(data, 'size', size => formatToGB(size)) },
  ];
};
