import intl from 'react-intl-universal';
import { IResizableGridLayoutConfig } from '@ferlab/ui/core/layout/ResizableGridLayout';
import cx from 'classnames';

import AgeAtDiagnosisGraphCard from '../AgeAtDiagnosisGraphCard';
import DataCategoryGraphCard from '../DataCategoryGraphCard';
import DataTypeGraphCard from '../DataTypeGraphCard';
import DemographicsGraphCard from '../DemographicGraphCard';
import StudiesGraphCard from '../StudiesGraphCard';
import SunburstGraphCard from '../SunburstGraphCard';

import styles from '../index.module.scss';

export const getDefaultLayouts = (): IResizableGridLayoutConfig[] => [
  {
    title: intl.get('screen.dataExploration.tabs.summary.observed_phenotype.cardTitle'),
    id: 'observed_phenotype',
    component: <SunburstGraphCard field="observed_phenotype" />,
    base: {
      h: 4,
      w: 8,
      x: 0,
      y: 0,
      minW: 5,
      minH: 4,
      isResizable: false,
    },
    md: {
      h: 4,
      w: 6,
      x: 0,
    },
    sm: {
      h: 4,
      w: 5,
      x: 0,
    },
    xs: {
      h: 4,
      w: 6,
      x: 0,
    },
  },
  {
    title: intl.get('screen.dataExploration.tabs.summary.mondo.cardTitle'),
    id: 'mondo',
    component: <SunburstGraphCard field="mondo" />,
    base: {
      h: 4,
      w: 8,
      x: 8,
      y: 0,
      minW: 5,
      minH: 4,
      isResizable: false,
    },
    md: {
      h: 4,
      w: 6,
      x: 6,
    },
    sm: {
      h: 4,
      w: 5,
      x: 5,
    },
    xs: {
      h: 4,
      w: 6,
      x: 0,
      y: 4,
    },
  },
  {
    title: intl.get('screen.dataExploration.tabs.summary.demographic.cardTitle'),
    id: 'demographics-graph-card',
    component: <DemographicsGraphCard />,
    base: {
      h: 2,
      w: 6,
      x: 0,
      y: 4,
      minW: 4,
      minH: 2,
    },
    md: {
      h: 2,
      w: 4,
      x: 0,
      y: 4,
    },
    sm: {
      h: 2,
      w: 5,
      x: 0,
      y: 4,
    },
    xs: {
      h: 2,
      w: 6,
      x: 0,
      y: 12,
    },
  },
  {
    title: intl.get('screen.dataExploration.tabs.summary.ageAtDiagnosis.cardTitle'),
    id: 'age-at-diagnosis-graph-card',
    component: <AgeAtDiagnosisGraphCard />,
    base: {
      h: 2,
      w: 5,
      x: 6,
      y: 4,
      minW: 3,
      minH: 2,
    },
    md: {
      h: 2,
      w: 4,
      x: 4,
      y: 4,
    },
    sm: {
      h: 2,
      w: 5,
      x: 5,
      y: 8,
    },
    xs: {
      h: 2,
      w: 6,
      x: 0,
      y: 16,
    },
  },
  {
    title: intl.get('screen.dataExploration.tabs.summary.availableData.dataCategoryTitle'),
    id: 'data-category-graph-card',
    component: <DataCategoryGraphCard />,
    base: {
      h: 2,
      w: 5,
      x: 11,
      y: 4,
      minW: 2,
      minH: 2,
    },
    md: {
      h: 2,
      w: 4,
      x: 8,
      y: 4,
    },
    sm: {
      h: 2,
      w: 5,
      x: 0,
      y: 12,
    },
    xs: {
      h: 2,
      w: 6,
      x: 0,
      y: 20,
    },
  },
  {
    title: intl.get('screen.dataExploration.tabs.summary.studies.cardTitle'),
    id: 'studies-graph-card',
    component: <StudiesGraphCard />,
    base: {
      h: 3,
      w: 4,
      x: 0,
      y: 8,
      minW: 2,
      minH: 2,
    },
    md: {
      h: 3,
      w: 4,
      x: 0,
      y: 8,
    },
    sm: {
      h: 2,
      w: 5,
      x: 5,
      y: 12,
    },
    xs: {
      h: 4,
      w: 6,
      x: 0,
      y: 8,
    },
  },
  {
    title: intl.get('screen.dataExploration.tabs.summary.availableData.dataTypeTitle'),
    id: 'data-type-graph-card',
    component: <DataTypeGraphCard />,
    base: {
      h: 3,
      w: 6,
      x: 4,
      y: 8,
      minW: 2,
      minH: 2,
    },
    md: {
      h: 3,
      w: 7,
      x: 4,
      y: 8,
    },
    sm: {
      h: 4,
      w: 10,
      x: 0,
      y: 16,
    },
    xs: {
      h: 4,
      w: 6,
      x: 0,
      y: 24,
    },
  },
];
