import { useEffect, useState } from "react";
import { Modal } from "antd";

interface FindMatchModalProps {
    visible: boolean;
    onCancel: () => void;
}

export default function FindMatchModal({ visible, onCancel }: FindMatchModalProps) {
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        if (!visible) {
            setSeconds(0);
            return;
        }

        const interval = setInterval(() => {
            setSeconds((prev) => prev + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [visible]);

    return (
        <Modal
            open={visible}
            footer={null}
            closable={true}
            centered
            onCancel={onCancel}
        >
            <div className="text-center">
                <h2 className="text-xl font-bold mb-4">🔍 Finding match...</h2>
                <p>Time: <b>{seconds}s</b></p>
            </div>
        </Modal>
    );
}
