import { Checkbox, Form, Input, Space } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { useEffect, useRef, useState } from 'react';
import { memberRolesOptions } from 'views/Community/contants';
import intl from 'react-intl-universal';
import { useDispatch } from 'react-redux';
import formStyles from '../form.module.css';
import BaseCard from '../BaseCard';
import BaseForm from '../BaseForm';
import { usePersona } from 'store/persona';
import ProLabel from '@ferlab/ui/core/components/ProLabel';
import { updatePersonaUser } from 'store/persona/thunks';

enum FORM_FIELDS {
  ROLES = 'roles',
  INSTITUTION = 'organization',
}

const initialChangedValues = {
  [FORM_FIELDS.ROLES]: false,
  [FORM_FIELDS.INSTITUTION]: false,
};

const RoleAndAffiliationCard = () => {
  const [form] = useForm();
  const dispatch = useDispatch();
  const { personaUserInfo } = usePersona();
  const [hasChanged, setHasChanged] = useState<Record<FORM_FIELDS, boolean>>(initialChangedValues);
  const initialValues = useRef<Record<FORM_FIELDS, any>>();

  const isValueChanged = () => Object.values(hasChanged).some((val) => val);

  const onDiscardChanges = () => {
    setHasChanged(initialChangedValues);
    form.setFieldsValue(initialValues.current);
  };

  useEffect(() => {
    initialValues.current = {
      [FORM_FIELDS.ROLES]: personaUserInfo?.roles,
      [FORM_FIELDS.INSTITUTION]: personaUserInfo?.institution || '',
    };
    form.setFieldsValue(initialValues.current);
    setHasChanged(initialChangedValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [personaUserInfo]);

  return (
    <BaseCard
      form={form}
      title={intl.get('screen.profileSettings.cards.roleAffiliation.title')}
      isValueChanged={isValueChanged()}
      onDiscardChanges={onDiscardChanges}
    >
      <BaseForm
        form={form}
        onHasChanged={setHasChanged}
        initialValues={initialValues}
        hasChangedInitialValue={hasChanged}
        onFinish={(values: any) =>
          dispatch(
            updatePersonaUser({
              data: {
                ...personaUserInfo,
                roles: values[FORM_FIELDS.ROLES],
                institution: values[FORM_FIELDS.INSTITUTION],
              },
              callback: () => {
                initialValues.current = values;
                setHasChanged(initialChangedValues);
              },
            }),
          )
        }
      >
        <Form.Item
          name={FORM_FIELDS.INSTITUTION}
          label={
            <ProLabel
              title={intl.get('screen.profileSettings.cards.roleAffiliation.institution')}
            />
          }
        >
          <Input />
        </Form.Item>
        <Form.Item
          className={formStyles.withCustomHelp}
          name={FORM_FIELDS.ROLES}
          label={intl.get('screen.profileSettings.cards.roleAffiliation.role')}
          rules={[{ required: true }]}
        >
          <Checkbox.Group className={formStyles.checkBoxGroup}>
            <span className={formStyles.help}>
              {intl.get('screen.profileSettings.cards.roleAffiliation.checkAllThatApply')}
            </span>
            <Space direction="vertical">
              {memberRolesOptions.map(({ key, value }) => (
                <Checkbox key={key} value={key}>
                  {value}
                </Checkbox>
              ))}
            </Space>
          </Checkbox.Group>
        </Form.Item>
      </BaseForm>
    </BaseCard>
  );
};

export default RoleAndAffiliationCard;
