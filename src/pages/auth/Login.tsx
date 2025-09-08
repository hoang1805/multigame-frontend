import { useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../app/store";
import { authService } from "../../features/auth/auth.service";
import { login } from "../../features/auth/auth.slice";
import { useNavigate } from "react-router-dom";
import { loading } from "../../utils/global.loading";
import { messageUtil } from "../../utils/message.util";
import { popupUtil } from "../../utils/popup.util";
import InputText from "../../components/form/input/InputText";
import InputPassword from "../../components/form/input/InputPassword";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username || !password) {
            messageUtil.warning("Please enter both username and password!");
            return;
        }

        try {
            loading.show();
            const res = await authService.login(username, password);
            dispatch(login(res));
            messageUtil.success('Login successfull !!!')
            navigate('/');
        } catch (err: any) {
            const msg = err?.response?.data?.message || "Login failed";
            popupUtil.error({ title: 'Error', centered: true, content: msg, closable: true });
        } finally {
            loading.hide();
        }
    };

    return 
    <div className="flex w-full h-screen justify-center">
        <div className="flex min-h-full flex-col justify-center sm:px-6 py-12 lg:px-8 max-w-3xl w-full">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Sign in to your account</h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-lg">
                <div className="space-y-6 shadow-sm sm:p-12 py-12 px-3 sm:rounded-lg border border-white border-solid bg-white">
                    <InputText name="username" label="Username" required={true} onChange={(e) => setUsername(e.target.value)} />

                    <InputPassword name="password" label="Password" required={true} onChange={(e) => setPassword(e.target.value)} />

                    <div>
                        <button onClick={handleLogin} className="flex w-full justify-center bg-indigo-600! px-3 py-1.5 text-sm/6! font-semibold! text-white! shadow-xs hover:bg-indigo-500! focus-visible:outline-2! focus-visible:outline-offset-2! focus-visible:outline-indigo-600! dark:bg-indigo-500! dark:shadow-none! dark:hover:bg-indigo-400! dark:focus-visible:outline-indigo-500!">Sign in</button>
                    </div>
                </div>

                <p className="mt-10 text-center text-sm/6 text-gray-500">
                    Not have an account?
                    <a href="/register" className="font-semibold text-indigo-600 hover:text-indigo-500"> Register new account</a>
                </p>
            </div>
        </div>
    </div>;
}
