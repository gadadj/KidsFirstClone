import { useState } from 'react';
import TableHeader from '@ferlab/ui/core/components/ProTable/Header';
import intl from 'react-intl-universal';
import { Space, Typography, List } from 'antd';
import { MAIN_SCROLL_WRAPPER_ID } from 'common/constants';
import { scrollToTop } from 'utils/helper';
import FiltersBox from './components/Filters/Box';

import styles from './index.module.scss';
import MemberCard from './components/MemberCard';
import { useMembers } from 'graphql/members/actions';
import { DEFAULT_QUERY_CONFIG } from './contants';
import { BooleanOperators, TermOperators } from '@ferlab/ui/core/data/sqon/operators';
import { generateValueFilter } from '@ferlab/ui/core/data/sqon/utils';

const { Title } = Typography;

const resolveSqon = (search: string, roles: string[], interests: string[]) => {
  const searchContent = [];
  const content = [];

  if (search.length > 0) {
    searchContent.push(
      generateValueFilter({
        field: 'firstName',
        value: [search],
        operator: TermOperators.in,
      }),
    );

    searchContent.push(
      generateValueFilter({
        field: 'lastName',
        value: [search],
        operator: TermOperators.in,
      }),
    );

    searchContent.push(
      generateValueFilter({
        field: 'institution',
        value: [search],
        operator: TermOperators.in,
      }),
    );

    content.push({
      content: searchContent,
      op: BooleanOperators.or,
    });
  }

  if (roles.length > 0) {
    content.push(
      generateValueFilter({
        field: 'roles',
        value: roles,
        operator: TermOperators.all,
      }),
    );
  }

  if (interests.length) {
    content.push(
      generateValueFilter({
        field: 'searchableInterests.name.raw',
        value: interests,
        operator: TermOperators.all,
      }),
    );
  }

  return {
    content,
    op: BooleanOperators.and,
  };
};

const CommunityPage = () => {
  const [search, setSearch] = useState('');
  const [queryConfig, setQueryConfig] = useState(DEFAULT_QUERY_CONFIG);
  const [roleFilter, setRoleFilter] = useState<string[]>([]);
  const [interestsFilter, setInterestsFilter] = useState<string[]>([]);
  const { loading, data, total } = useMembers({
    first: queryConfig.size,
    offset: queryConfig.size * (queryConfig.pageIndex - 1),
    sqon: resolveSqon(search, roleFilter, interestsFilter),
  });

  return (
    <Space direction="vertical" size={24} className={styles.communityWrapper}>
      <Title className={styles.title} level={4}>
        {intl.get('screen.community.title')}
      </Title>
      <FiltersBox
        onSearchFilterChange={setSearch}
        onRoleFilterChange={setRoleFilter}
        onInterestsFilterChange={setInterestsFilter}
        hasFilters={roleFilter.length > 0 || interestsFilter.length > 0}
      />
      <Space className={styles.usersListWrapper} size={24} direction="vertical">
        <TableHeader
          pageIndex={queryConfig.pageIndex}
          pageSize={queryConfig.size}
          total={total}
          dictionary={{
            itemCount: {
              results: 'Members',
              noResults: 'No members',
              clear: '',
              of: '',
              selectAllResults: '',
              selected: '',
              selectedPlural: '',
            },
          }}
        ></TableHeader>
        <List
          grid={{
            gutter: 24,
            xs: 1,
            sm: 2,
            md: 2,
            lg: 3,
            xl: 4,
            xxl: 5,
          }}
          dataSource={data}
          className={styles.membersList}
          pagination={{
            total: total,
            pageSize: queryConfig.size,
            onChange: (page) => {
              setQueryConfig({
                ...queryConfig,
                pageIndex: page,
              });
              scrollToTop(MAIN_SCROLL_WRAPPER_ID);
            },
            size: 'small',
            hideOnSinglePage: true,
            showSizeChanger: false,
          }}
          loading={loading}
          renderItem={(item) => (
            <List.Item className={styles.memberListItem}>
              <MemberCard user={item} match={search} />
            </List.Item>
          )}
        />
      </Space>
    </Space>
  );
};

export default CommunityPage;
