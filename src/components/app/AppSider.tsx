import { Layout, Menu } from "antd";
import {
    HistoryOutlined,
    HomeOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";

const { Sider } = Layout;
const siderStyle: React.CSSProperties = {
    overflow: 'auto',
    height: '100vh',
    position: 'sticky',
    insetInlineStart: 0,
    top: 0,
    bottom: 0,
    scrollbarWidth: 'thin',
    scrollbarGutter: 'stable',
};

export default function AppSider() {
    const navigate = useNavigate();
    const location = useLocation();
    const collapsed = useSelector((state: RootState) => state.app.globalSiderCollapsed);

    return <Sider trigger={null} style={siderStyle} collapsible collapsed={collapsed} theme="dark">
        <div className="h-[64px] flex items-center justify-center">
            <div className="text-2xl font-bold cursor-pointer" onClick={() => { navigate('/home') }}>
                {!collapsed ? <><span className="text-white">multi</span>
                    <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">game</span>
                    <span className="text-gray-400">.com</span></> : <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
                    MG
                </span>}

            </div>
        </div>
        <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[location.pathname]}
            onClick={({ key }) => navigate(key)}
            className="mt-2"
            items={[
                {
                    key: '/home',
                    icon: <HomeOutlined />,
                    label: 'Home',
                },
                {
                    key: '/user/me',
                    icon: <UserOutlined />,
                    label: 'User',
                },
                {
                    key: '/history',
                    icon: <HistoryOutlined />,
                    label: 'History',
                },
            ]} />
    </Sider>
}