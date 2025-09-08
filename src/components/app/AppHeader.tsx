import { Avatar, Button, Dropdown, Layout } from "antd";
import {
    EditOutlined,
    LogoutOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../app/store";
import { toggleSider } from "../../features/app.slice";
import { useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import ChangePasswordForm from "../user/ChangePasswordForm";
import { authService } from "../../features/auth/auth.service";
import type { TabHeaderItem } from "./AppTabHeader";
import AppTabHeader from "./AppTabHeader";

const { Header } = Layout;

interface HeaderProps {
    title: ReactNode;
    subtitle?: ReactNode;
    items?: TabHeaderItem[];
    onItemChange?: (e: string) => void;
    defaultSelect?: string;
}

export default function AppHeader({ title, subtitle, items, onItemChange, defaultSelect }: HeaderProps) {
    const collapsed = useSelector((state: RootState) => state.app.globalSiderCollapsed);
    const [visible, setVisible] = useState<boolean>(false);
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    return <>
        <Header className="bg-white! p-0! flex flex-row border-b-2 border-b-[#dfe2e1] relative" >
            <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => dispatch(toggleSider())}
                className="focus:outline-none!"
                style={{
                    fontSize: '16px',
                    width: 64,
                    height: 64,
                }} />
            <div className="h-full flex flex-col justify-center sm:w-full">
                <div className="text-2xl font-medium">{title}</div>
                {subtitle && !items && <div className="text-sm text-gray-400">{subtitle}</div>}
                {items && <AppTabHeader items={items} defaultSelect={defaultSelect ?? ''} onChange={onItemChange!}/>}
            </div>
            <div className="absolute! right-6">
                <Dropdown menu={{
                    items: [
                        {
                            label: 'User information',
                            key: 'user.info',
                            icon: <UserOutlined />,
                            onClick: () => navigate('/user/me')
                        },
                        {
                            label: 'Change password',
                            icon: <EditOutlined />,
                            key: 'change.password',
                            onClick: () => setVisible(true)
                        },
                        {
                            label: 'Logout',
                            icon: <LogoutOutlined />,
                            key: 'logout',
                            onClick: () => {
                                authService.logout();
                                navigate('/login');
                            },
                            danger: true
                        }
                    ]
                }}>
                    <Avatar size='large' icon={<UserOutlined />} />
                </Dropdown>

            </div>
        </Header>
        {<ChangePasswordForm visible={visible} onCancel={() => setVisible(false)} />}
    </>
}