// messageUtil.ts
import { message as antdMessage } from "antd";

let messageApi: ReturnType<typeof antdMessage.useMessage>[0];

export const initMessage = (api: typeof messageApi) => {
  messageApi = api;
};

export const messageUtil = {
  success: (...args: Parameters<typeof messageApi.success>) => {
    return messageApi?.success(...args);
  },
  error: (...args: Parameters<typeof messageApi.error>) => {
    return messageApi?.error(...args);
  },
  info: (...args: Parameters<typeof messageApi.info>) => {
    return messageApi?.info(...args);
  },
  warning: (...args: Parameters<typeof messageApi.warning>) => {
    return messageApi?.warning(...args);
  },
  loading: (...args: Parameters<typeof messageApi.loading>) => {
    return messageApi?.loading(...args);
  },
};
