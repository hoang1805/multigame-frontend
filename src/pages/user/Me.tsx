import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import AppHeader from "../../components/app/AppHeader";
import AppContent from "../../components/app/AppContent";
import { Avatar, Button, Tooltip } from "antd";
import { EditOutlined, UserOutlined } from '@ant-design/icons';
import { useState } from "react";
import UpdateForm from "../../components/user/UpdateForm";

export default function Me() {
    const user = useSelector((state: RootState) => state.user.user);
    const [visible, setVisible] = useState<boolean>(false);
    return <>
        <AppHeader title="User detail" subtitle="View your information" />
        <AppContent>
            <div className="mt-20 mx-auto max-w-3xl bg-white border border-gray-300 rounded-md shadow px-8 py-5 relative">
                <div className="font-medium text-2xl">User information</div>
                <div className="mt-4 flex flex-row gap-20 items-center">
                    <div className="">
                        <Avatar
                            size={150}
                            icon={<UserOutlined />}
                        />
                    </div>
                    <div className="flex flex-col gap-2.5 text-base">
                        <div><span className="font-medium">Username:</span> {user?.username ?? ''}</div>
                        <div><span className="font-medium">Email:</span> {user?.email ?? ''}</div>
                        <div><span className="font-medium">Display name:</span> {user?.nickname ?? ''}</div>
                    </div>
                </div>
                <div className="absolute right-3 top-5">
                    <Tooltip title="Edit your information">
                        <Button icon={<EditOutlined />} onClick={() => setVisible(true)}></Button>
                    </Tooltip>
                </div>
            </div>
            {<UpdateForm visible={visible} onCancel={() => setVisible(false)} />}
        </AppContent>
    </>
}