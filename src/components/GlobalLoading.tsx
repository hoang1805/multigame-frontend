import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons'
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";


export default function GlobalLoading() {
    const isLoading = useSelector((state: RootState) => state.globalLoading.isLoading);

    if (!isLoading) return null;

    return (
        <Spin
            fullscreen
            indicator={
                <LoadingOutlined
                    style={{
                        fontSize: 48,
                    }}
                    spin
                />
            }
        />
    );
};