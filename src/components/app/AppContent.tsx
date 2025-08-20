import { Layout } from "antd";
import type { ReactNode } from "react";

const { Content } = Layout;
interface ContentProps {
    children: ReactNode,
    className?: string,
}

export default function AppContent({ children, className }: ContentProps) {
    return <Content className={`w-full ${className ?? ''}`}>
        {children}
    </Content>
}