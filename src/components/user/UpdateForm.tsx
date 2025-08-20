import { Modal } from "antd";
import { useEffect, useState } from "react";
import InputText from "../form/input/InputText";
import { loading } from "../../utils/global.loading";
import { userService } from "../../features/user/user.service";
import { popupUtil } from "../../utils/popup.util";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../app/store";
import { messageUtil } from "../../utils/message.util";
import { cacheUser } from "../../features/user/user.slice";

interface UpdateProps {
    visible: boolean;
    onCancel: () => void;
}

export default function UpdateForm({ visible, onCancel }: UpdateProps) {
    const user = useSelector((state: RootState) => state.user.user);
    const [nickname, setNickname] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        setUsername(user?.username ?? '');
        setEmail(user?.email ?? '');
        setNickname(user?.nickname ?? '');
        console.log('hello');
    }, [user, visible]);

    const onSubmit = async() => {
        try {
            loading.show();
            const updated = await userService.update(email, nickname);
            dispatch(cacheUser({user: updated}));
            messageUtil.success('Update user successfully');
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
            <InputText name="username" label="Username" required={true} readonly={true} value={username} />
            <InputText name="email" label="Email" type="email" required={true} value={email} onChange={(e) => setEmail(e.target.value)} />
            <InputText name="nickname" label="Display name" value={nickname} onChange={(e) => setNickname(e.target.value)} />
        </div>
    </Modal>
}