import { store } from "../app/store";
import { hide, show } from "../features/loading/global.loading.slice";

export const loading = {
  setLoadingState: null,

  // Hiển thị loading
  show() {
    store.dispatch(show());
  },

  // Ẩn loading
  hide() {
    store.dispatch(hide())
  },
};

