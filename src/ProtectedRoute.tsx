import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';
import ConditionalWrapper from 'components/utils/ConditionalWrapper';
import { STATIC_ROUTES } from 'utils/routes';
import { REDIRECT_URI_KEY } from 'common/constants';
import { usePersona } from 'store/persona';

type OwnProps = Omit<RouteProps, 'component' | 'render' | 'children'> & {
  layout?: (children: any) => React.ReactElement;
  children: React.ReactNode;
};

const ProtectedRoute = ({ children, layout, ...routeProps }: OwnProps) => {
  const { personaUserInfo, error: personaError } = usePersona();
  const { keycloak } = useKeycloak();
  const RouteLayout = layout!;
  const currentPath = routeProps.path;

  if (personaError) {
    return <Redirect to={STATIC_ROUTES.ERROR} />;
  }

  if (!keycloak.authenticated) {
    return (
      <Redirect
        to={{
          pathname: STATIC_ROUTES.LOGIN,
          search: `${REDIRECT_URI_KEY}=${routeProps.location?.pathname}${routeProps.location?.search}`,
        }}
      />
    );
  }

  if (!personaUserInfo) {
    return (
      <Redirect
        to={{
          pathname: STATIC_ROUTES.REGISTRATION,
        }}
      />
    );
  }

  if (!personaUserInfo?.acceptedTerms) {
    return (
      <Redirect
        to={{
          pathname: STATIC_ROUTES.TERMSCONDITONS,
          search: `${REDIRECT_URI_KEY}=${routeProps.location?.pathname}${routeProps.location?.search}`,
        }}
      />
    );
  }

  if (currentPath === STATIC_ROUTES.LOGIN) {
    return <Redirect to={STATIC_ROUTES.DASHBOARD} />;
  }

  return (
    <ConditionalWrapper
      condition={RouteLayout !== undefined}
      children={<Route {...routeProps}>{children}</Route>}
      wrapper={(children) => <RouteLayout>{children}</RouteLayout>}
    />
  );
};

export default ProtectedRoute;
