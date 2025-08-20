import { Modal } from "antd";
import type { ReactNode } from "react";

type ModalType = "info" | "success" | "error" | "warning" | "confirm";

interface PopupOptions {
  title?: ReactNode;
  content?: ReactNode;
  closable?: boolean;
  footer?: ReactNode;
  centered?: boolean;
  onOk?: () => void;
  onCancel?: () => void;
}

let modalApi: ReturnType<typeof Modal.useModal>[0];

export const initPopup = (api: typeof modalApi) => {
  modalApi = api;
};

export const popupUtil: Record<ModalType, (options: PopupOptions) => void> = {
  info: (options) => {
    modalApi?.info({ centered: true, ...options });
  },
  success: (options) => {
    modalApi?.success({ centered: true, ...options });
  },
  error: (options) => {
    modalApi?.error({ centered: true, ...options });
  },
  warning: (options) => {
    modalApi?.warning({ centered: true, ...options });
  },
  confirm: (options) => {
    modalApi?.confirm({ centered: true, ...options });
  },
};
