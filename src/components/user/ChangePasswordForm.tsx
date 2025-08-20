import { Modal } from "antd";
import { useEffect, useState } from "react";
import { loading } from "../../utils/global.loading";
import { userService } from "../../features/user/user.service";
import { popupUtil } from "../../utils/popup.util";
import { messageUtil } from "../../utils/message.util";
import InputPassword from "../form/input/InputPassword";

interface ChangePasswordProps {
    visible: boolean;
    onCancel: () => void;
}

export default function ChangePasswordForm({ visible, onCancel }: ChangePasswordProps) {
    const [password, setPassword] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [rePassword, setRePassword] = useState<string>('');

    useEffect(() => {
        setPassword('');
        setNewPassword('');
        setRePassword('');
    }, [visible]);

    const onSubmit = async() => {
        try {
            loading.show();
            await userService.changePassword(password, newPassword, rePassword);
            messageUtil.success('Change password successfully !!!');
            onCancel();
        } catch(err: any) {
            const msg = err?.response?.data?.message || "Error";
            popupUtil.error({ title: 'Error', centered: true, content: msg, closable: true });
        } finally {
            loading.hide();
        }
    }

    return <Modal title='Update user information' open={visible} closable={true} onOk={onSubmit} onCancel={onCancel} centered={true} destroyOnHidden={true}>
        <div className="space-y-6">
            <InputPassword name="password" label="Password" required={true} value={password} onChange={(e) => setPassword(e.target.value)}/>
            <InputPassword name="newPassword" label="New password" required={true} value={newPassword} onChange={(e) => setNewPassword(e.target.value)}/>
            <InputPassword name="rePassword" label="Repeat new password" required={true} value={rePassword} onChange={(e) => setRePassword(e.target.value)} />
        </div>
    </Modal>
}