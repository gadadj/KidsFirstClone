import React, { useEffect, useState } from 'react';
import { VisualType } from '@ferlab/ui/core/components/filters/types';
import { ISqonGroupFilter } from '@ferlab/ui/core/components/QueryBuilder/types';
import { Select, Tag } from 'antd';

import history from 'services/history';

import { ItemProps } from './SidebarFilters';
import { updateFilters } from './utils';

import styles from './SearchBar.module.scss';

type OwnProps = {
  options: ItemProps[];
  filters: ISqonGroupFilter;
};

const extractCodesFromFilter = (filters: ISqonGroupFilter) => {
  const find = filters.content.find(
    (s: { content: { field: string } }) => s.content.field === 'code',
  );
  return find ? find.content.value : [];
};

const codeFromKey = (key: string) => key.split('|')[0];

const SearchBar = ({ options, filters }: OwnProps) => {
  const [selected, setSelected] = useState<string[]>([]);

  const selectedStudyCodes = extractCodesFromFilter(filters);

  useEffect(() => {
    const updateSelected = options.filter((f) => selectedStudyCodes.includes(codeFromKey(f.value)));
    setSelected(updateSelected.map((s) => s.value));
  }, [filters]);

  const handleClose = (value: string) => {
    const remainingSelected = selected.filter((v) => v !== value);

    const iFilter = remainingSelected.map((c: string) => ({
      data: { key: codeFromKey(c) },
      name: '',
      id: '',
    }));

    updateFilters(
      history,
      { field: 'code', title: 'Study Code', type: VisualType.Checkbox },
      iFilter,
    );

    setSelected(remainingSelected);
  };

  const handleOnChange = (select: string[]) => {
    const codes = select.map((k: string) => codeFromKey(k));

    const iFilter = codes.map((c: string) => ({
      data: { key: c },
      name: '',
      id: '',
    }));
    updateFilters(
      history,
      { field: 'code', title: 'Study Code', type: VisualType.Checkbox },
      iFilter,
    );
  };

  const selectProps = {
    mode: 'multiple' as const,
    value: selected,
    options,
    allowClear: true,
    onChange: (newSelect: string[]) => {
      setSelected(newSelect);
      handleOnChange(newSelect);
    },
    placeholder: 'KF-DSD, Neuroblastoma…',
    maxTagCount: 'responsive' as const,
    // @ts-ignore
    // eslint-disable-next-line react/display-name
    tagRender: ({ value }: string) => (
      <Tag key={value} className={styles.tagSearchBar} closable onClose={() => handleClose(value)}>
        {codeFromKey(value)}
      </Tag>
    ),
  };

  return (
    // @ts-ignore
    <Select
      getPopupContainer={(trigger) => trigger.parentNode}
      className={styles.storiesSearchBar}
      {...selectProps}
    />
  );
};

export default SearchBar;
