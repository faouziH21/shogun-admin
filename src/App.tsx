import React, { useCallback, useEffect, useState } from 'react';
import {
  useRecoilState
} from 'recoil';

import {
  BrowserRouter as Router,
  Switch,
  Redirect,
  Route
} from 'react-router-dom';
import Header from './Component/Header/Header';

import {
  Result,
  Spin
} from 'antd';

import {
  LoadingOutlined
} from '@ant-design/icons';

import Portal from './Page/Portal/Portal';
import Logger from 'js-logger';
import { appInfoAtom, userInfoAtom } from './State/atoms';
import { setSwaggerDocs } from './State/static';
import _isEmpty from 'lodash/isEmpty';
import './App.less';

import config from 'shogunApplicationConfig';
import useSHOGunClient from './Hooks/useSHOGunClient';

const App: React.FC = () => {

  const [, setUserInfo] = useRecoilState(userInfoAtom);
  const [, setAppInfo] = useRecoilState(appInfoAtom);
  const [loadingState, setLoadingState] = useState<'failed' | 'loading' | 'done'>();

  const client = useSHOGunClient();

  // Fetch initial data:
  // - swagger docs
  // - applicationInfo
  // - logged in User
  const getInitialData = useCallback(async () => {
    try {
      setLoadingState('loading');
      const swaggerDoc = await client.openapi().getApiDocs();
      setSwaggerDocs(swaggerDoc);
      const appInfo = await client.info().getAppInfo();
      setAppInfo(appInfo);
      if (appInfo?.userId) {
        const userInfo = await client.user().findOne(appInfo.userId);
        setUserInfo(userInfo);
      }
      setLoadingState('done');
    } catch (error) {
      setLoadingState('failed');
      Logger.error(error);
    }
  }, [setAppInfo, setUserInfo, client]);

  useEffect(() => {
    getInitialData();
  }, [getInitialData]);

  if (loadingState === 'loading') {
    return (
      <Result
        icon={<LoadingOutlined spin />}
        title="Loading."
      />
    );
  }
  if (loadingState === 'failed') {
    return (
      <Result
        status="warning"
        title="Failed to load the initial data. Check your console."
      />
    );
  }

  return (
    <Router>
      <Header />
      <React.Suspense
        fallback={
          <Spin
            className="suspense-spin"
            indicator={
              <LoadingOutlined
                className="suspense-spin-icon"
                spin
              />
            }
          />
        }
      >
        <Switch>
          <Route
            path={`${config.appPrefix}/portal`}
            component={Portal}
          />
          <Redirect
            exact
            from={`${config.appPrefix}/`}
            to={`${config.appPrefix}/portal`}
          />
        </Switch>
      </React.Suspense>
    </Router>
  );
};

export default App;
