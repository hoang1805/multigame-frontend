import { useEffect, type ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../app/store";
import { Navigate } from "react-router-dom";
import { authService } from "../features/auth/auth.service";
import { userService } from "../features/user/user.service";
import { cacheUser } from "../features/user/user.slice";
import { loading } from "../utils/global.loading";
import { popupUtil } from "../utils/popup.util";

interface ProtectedRouteProps {
    children: ReactNode;
}
export default function ProtectedRoute({ children }: ProtectedRouteProps) { 
    const refreshToken = useSelector((state: RootState) => state.auth.refreshToken);
    const dispatch = useDispatch<AppDispatch>();
    const load = async () => {
        try {
            loading.show();
            const user = await userService.me();
            dispatch(cacheUser({ user }));
        } catch (err: any) {
            const msg = err?.response?.data?.message || "Error";
            popupUtil.error({ title: 'Error', centered: true, content: msg, closable: true });
        } finally {
            loading.hide();
        }
    };

    useEffect(() => { if (refreshToken) load() }, [refreshToken]);

    if (!refreshToken) {
        authService.logout();
        return <Navigate to='/login' replace />
    }

    return children;
}