import './App.css'
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import GlobalLoading from './components/GlobalLoading';
import { SocketProvider } from './context/SocketContext';
import { message, Modal } from 'antd';
import { initMessage } from './utils/message.util';
import { initPopup } from './utils/popup.util';

function App() {
  const [messageApi, messageContextHolder] = message.useMessage();
  initMessage(messageApi);

  const [modal, modalContextHolder] = Modal.useModal();
  initPopup(modal);
  return (
    <>
      <GlobalLoading />
      <SocketProvider>
        <RouterProvider router={router} />
      </SocketProvider>
      {messageContextHolder}
      {modalContextHolder}
    </>
  );
}

export default App
