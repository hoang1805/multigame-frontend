import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import AppSider from "../../components/app/AppSider";

function MainLayout() {
  return <Layout className="min-h-screen! max-w-screen h-full">
    <AppSider></AppSider>
    <Layout className="w-full">
      <Outlet />
    </Layout>
  </Layout>
};

export default MainLayout;
