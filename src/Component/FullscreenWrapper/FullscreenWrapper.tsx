import React from 'react';
import { FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import { useHotkeys } from 'react-hotkeys-hook';

import './FullscreenWrapper.less';

export const FullscreenWrapper: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children
}) => {
  const [fullscreen, setFullscreen] = React.useState<boolean>(false);

  const {
    t
  } = useTranslation();

  const toggleFullscreen = () => {
    setFullscreen(!fullscreen);
  };

  /**
   * Exit fullscreen when Esc is pressed.
   */
  useHotkeys('esc', toggleFullscreen, {
    enableOnTags: ['INPUT', 'TEXTAREA', 'SELECT'],
    filter: () => fullscreen
  });

  const wrapperCls = `fs-wrapper${fullscreen ? ' fullscreen' : ''}`;

  return (
    <div className={wrapperCls}>
      <div>
        <Tooltip
          title={fullscreen ? t('FullscreenWrapper.leaveFullscreen') : t('FullscreenWrapper.fullscreen') }
          placement='left'
        >
          <Button
            icon={fullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
            size='small'
            onClick={toggleFullscreen}
          />
        </Tooltip>
      </div>
      {children}
    </div>
  );
};

export default FullscreenWrapper;
