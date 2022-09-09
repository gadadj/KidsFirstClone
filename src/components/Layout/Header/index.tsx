/* eslint-disable jsx-a11y/anchor-is-valid */
import { PageHeader, Dropdown, Menu, Space, Typography } from 'antd';
import KidsFirstIcon from 'components/Icons/KidsFirstIcon';
import {
  ReadOutlined,
  HomeOutlined,
  FileSearchOutlined,
  TeamOutlined,
  LogoutOutlined,
  UserOutlined,
  MessageOutlined,
  GlobalOutlined,
  MailOutlined,
} from '@ant-design/icons';
import ResourcesIcon from 'components/Icons/ResourcesIcon';
import { DownOutlined } from '@ant-design/icons';
import HeaderLink from 'components/Layout/Header/HeaderLink';
import { STATIC_ROUTES } from 'utils/routes';
import LineStyleIcon from 'components/Icons/LineStyleIcon';
import { useUser } from 'store/user';
import intl from 'react-intl-universal';
import { getFTEnvVarByKey } from 'helpers/EnvVariables';
import NotificationBanner from 'components/featureToggle/NotificationBanner';
import { AlterTypes } from 'common/types';
import { useKeycloak } from '@react-keycloak/web';
import { IncludeKeycloakTokenParsed } from 'common/tokenTypes';
import { DEFAULT_GRAVATAR_PLACEHOLDER } from 'common/constants';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { userActions } from 'store/user/slice';
import ExternalLink from '@ferlab/ui/core/components/ExternalLink';
import Gravatar from '@ferlab/ui/core/components/Gravatar';
import GradientAccent from 'components/uiKit/GradientAccent';

import style from 'components/Layout/Header/index.module.scss';
import { FT_COMMUNITY, FT_DASHBOARD, FT_EXPLORE_DATA, FT_STUDIES } from 'common/featureToggle';

const iconSize = { width: 14, height: 14 };
const FT_FLAG_KEY = 'SITE_WIDE_BANNER';
const BANNER_TYPE_KEY = FT_FLAG_KEY + '_TYPE';
const BANNER_MSG_KEY = FT_FLAG_KEY + '_MSG';

const Header = () => {
  const { userInfo } = useUser();
  const dispatch = useDispatch();
  const { keycloak } = useKeycloak();
  const history = useHistory();
  const currentPathName = history.location.pathname;
  const tokenParsed = keycloak.tokenParsed as IncludeKeycloakTokenParsed;

  return (
    <>
      <GradientAccent />
      <NotificationBanner
        className={style.siteWideBanner}
        featureToggleKey={FT_FLAG_KEY}
        type={getFTEnvVarByKey<AlterTypes>(BANNER_TYPE_KEY, 'warning')}
        message={getFTEnvVarByKey(BANNER_MSG_KEY)}
        banner
        closable
      />
      <PageHeader
        title={<KidsFirstIcon className={style.logo} />}
        subTitle={
          <nav className={style.headerList}>
            <HeaderLink
              key="dashboard"
              currentPathName={currentPathName}
              to={STATIC_ROUTES.DASHBOARD}
              icon={<HomeOutlined />}
              title={intl.get('layout.main.menu.dashboard')}
              featureToggleKey={FT_DASHBOARD}
            />
            <HeaderLink
              key="studies"
              currentPathName={currentPathName}
              to={STATIC_ROUTES.STUDIES}
              icon={<ReadOutlined />}
              title={intl.get('layout.main.menu.studies')}
              featureToggleKey={FT_STUDIES}
            />
            <HeaderLink
              key="explore-data"
              currentPathName={currentPathName}
              to={[
                STATIC_ROUTES.DATA_EXPLORATION,
                STATIC_ROUTES.DATA_EXPLORATION_SUMMARY,
                STATIC_ROUTES.DATA_EXPLORATION_BIOSPECIMENS,
                STATIC_ROUTES.DATA_EXPLORATION_PARTICIPANTS,
                STATIC_ROUTES.DATA_EXPLORATION_DATAFILES,
              ]}
              icon={<FileSearchOutlined />}
              title={intl.get('layout.main.menu.explore')}
              featureToggleKey={FT_EXPLORE_DATA}
            />
            <HeaderLink
              key="variant-data"
              currentPathName={currentPathName}
              to={[
                STATIC_ROUTES.VARIANT,
                STATIC_ROUTES.VARIANT_SUMMARY,
                STATIC_ROUTES.VARIANT_VARIANTS,
              ]}
              icon={<LineStyleIcon height={14} width={14} />}
              title={intl.get('layout.main.menu.variants')}
            />
          </nav>
        }
        extra={[
          <HeaderLink
            key="community"
            currentPathName={currentPathName}
            to={STATIC_ROUTES.COMMUNITY}
            icon={<TeamOutlined />}
            title={intl.get('layout.main.menu.community')}
            featureToggleKey={FT_COMMUNITY}
          />,
          <Dropdown
            key="resources"
            className={style.dropdown}
            trigger={['click']}
            overlay={
              <Menu
                items={[
                  {
                    key: 'website',
                    disabled: false,
                    label: (
                      <Space size={8}>
                        <GlobalOutlined className={style.icon} {...iconSize} />
                        <ExternalLink key="website" href="https://kidsfirstdrc.org/">
                          {intl.get('layout.main.menu.website')}
                        </ExternalLink>
                      </Space>
                    ),
                  },
                  {
                    key: 'documentation',
                    label: (
                      <Space size={8}>
                        <FileSearchOutlined className={style.icon} {...iconSize} />
                        <ExternalLink
                          key="documentation"
                          href="https://www.notion.so/d3b/Kids-First-DRC-Help-Center-c26b36ff66564417834f3f264475d10a"
                        >
                          {intl.get('layout.main.menu.documentation')}
                        </ExternalLink>
                      </Space>
                    ),
                  },
                  {
                    key: 'forum',
                    label: (
                      <Space size={8}>
                        <MessageOutlined className={style.icon} {...iconSize} />
                        <ExternalLink key="forum" href="https://forum.kidsfirstdrc.org/login">
                          {intl.get('layout.main.menu.forum')}
                        </ExternalLink>
                      </Space>
                    ),
                  },
                  {
                    key: 'contact',
                    label: (
                      <Space size={8}>
                        <MailOutlined />
                        <ExternalLink key="contact" href="https://kidsfirstdrc.org/contact/">
                          {intl.get('layout.main.menu.contact')}
                        </ExternalLink>
                      </Space>
                    ),
                  },
                ]}
              />
            }
          >
            <a className={style.resourcesMenuTrigger} onClick={(e) => e.preventDefault()} href="">
              <ResourcesIcon {...iconSize} />
              <span className={style.resources}>Resources</span>
              <DownOutlined />
            </a>
          </Dropdown>,
          <Dropdown
            key="user-menu"
            trigger={['click']}
            overlay={
              <Menu
                items={[
                  {
                    key: 'email',
                    disabled: true,
                    label: (
                      <Space size={4} className={style.userMenuEmail}>
                        <Typography.Text>Signed in with</Typography.Text>
                        <Typography.Text strong>{userInfo?.email}</Typography.Text>
                      </Space>
                    ),
                  },
                  {
                    type: 'divider',
                  },
                  {
                    key: 'profile_settings',
                    label: (
                      <Link to={`/member/${userInfo?.keycloak_id}`}>
                        <Space>
                          <UserOutlined />
                          {intl.get('layout.user.menu.settings')}
                        </Space>
                      </Link>
                    ),
                  },
                  {
                    key: 'logout',
                    label: (
                      <Space>
                        <LogoutOutlined />
                        {intl.get('layout.user.menu.logout')}
                      </Space>
                    ),
                    onClick: () => dispatch(userActions.cleanLogout()),
                  },
                ]}
              />
            }
          >
            <a className={style.userMenuTrigger} onClick={(e) => e.preventDefault()} href="">
              <Gravatar
                circle
                placeholder={DEFAULT_GRAVATAR_PLACEHOLDER}
                className={style.userGravatar}
                email={tokenParsed.email || tokenParsed.identity_provider_identity}
              />
              <span className={style.userName}>{userInfo?.first_name}</span>
              <DownOutlined />
            </a>
          </Dropdown>,
        ]}
        className={style.mainHeader}
      />
    </>
  );
};

export default Header;
