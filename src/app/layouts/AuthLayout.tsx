import { Layout } from "antd";
import { Outlet } from "react-router-dom";
const { Content } = Layout;

export function AuthLayout() {
    return <Layout className="min-h-screen! max-w-screen h-full bg-gray-50!">
        <Content className="w-full">
            <Outlet />
        </Content>
    </Layout>
}