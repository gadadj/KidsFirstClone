import React from 'react';
import { Space, Table, Spin } from 'antd';
import StackLayout from '@ferlab/ui/core/layout/StackLayout';
import { useTabFrequenciesData } from 'store/graphql/variants/tabActions';

type OwnProps = {
  variantId: string;
};

const columns = [
  {
    title: 'Studies',
    dataIndex: 'study_id',
  },
  {
    title: '# Participants',
    dataIndex: 'participant_number',
  },
  {
    title: 'ALT Allele',
    dataIndex: 'studies',
    render: () => 'todo',
  },
  {
    title: 'Homozygote',
    dataIndex: 'frequencies',
    render: () => 'todo',
  },
].map((el, index: number) => ({ ...el, key: `${el.dataIndex}-${index}` }));

const TabFrequencies = ({ variantId }: OwnProps) => {
  const { loading, data } = useTabFrequenciesData(variantId);

  const { studies } = data;

  return (
    <Spin spinning={loading}>
      <StackLayout vertical fitContent>
        <Space direction={'vertical'} size={'large'}>
          <Table title={() => 'title'} bordered dataSource={studies} columns={columns} />
          <Table title={() => 'title'} bordered dataSource={studies} columns={columns} />
        </Space>
      </StackLayout>
    </Spin>
  );
};

export default TabFrequencies;
