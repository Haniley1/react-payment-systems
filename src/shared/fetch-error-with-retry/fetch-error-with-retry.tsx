import { RedoOutlined } from '@ant-design/icons';
import { Button, Result, Tooltip } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import './fetch-error-with-retry.scss';

const DEFAULT_FETCH_ERROR_TITLE = 'FetchErrorDescription';

const FetchErrorWithRetry = (
  props: {
    retryFn(): any;
    status?: "warning" | 403 | 404 | 500 | "403" | "404" | "500" | "success" | "error" | "info" | undefined;
    title?: React.ReactNode;
    tooltipTitle?: string;
  }
) => {
  const { retryFn, status, title, tooltipTitle } = props;
  const { t } = useTranslation();

  return (
    <div className="fetch-error-with-retry-component">
      <Result
        status={status || '500'}
        title={title || t(DEFAULT_FETCH_ERROR_TITLE)}
        extra={
          <Tooltip title={tooltipTitle || t('Retry')}>
            <Button
              shape="circle"
              size="large"
              icon={<RedoOutlined />}
              onClick={retryFn}
            />
          </Tooltip>
        }
      />
    </div>
  )
}

export default React.memo(FetchErrorWithRetry); 
