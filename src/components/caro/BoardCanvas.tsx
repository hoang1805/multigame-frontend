import { useEffect, useRef } from "react";

type BoardCanvasProps = {
    size: number; // số ô (ví dụ 15x15)
    board: (string | null)[][];
    cellSize?: number; // kích thước mỗi ô (px)
    onClick?: (i: number, j: number) => void;
};

export default function BoardCanvas({
    size,
    board,
    cellSize = 30,
    onClick,
}: BoardCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Vẽ bàn cờ mỗi khi board thay đổi
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = size * cellSize;
        canvas.height = size * cellSize;

        // Xóa toàn bộ
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Vẽ grid
        ctx.strokeStyle = "#000";
        for (let i = 0; i <= size; i++) {
            // ngang
            ctx.beginPath();
            ctx.moveTo(0, i * cellSize);
            ctx.lineTo(size * cellSize, i * cellSize);
            ctx.stroke();
            // dọc
            ctx.beginPath();
            ctx.moveTo(i * cellSize, 0);
            ctx.lineTo(i * cellSize, size * cellSize);
            ctx.stroke();
        }

        // Vẽ X và O
        ctx.lineWidth = 2;
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                const val = board[i][j];
                if (val === "X") {
                    ctx.strokeStyle = "red";
                    ctx.beginPath();
                    ctx.moveTo(j * cellSize + 5, i * cellSize + 5);
                    ctx.lineTo((j + 1) * cellSize - 5, (i + 1) * cellSize - 5);
                    ctx.moveTo((j + 1) * cellSize - 5, i * cellSize + 5);
                    ctx.lineTo(j * cellSize + 5, (i + 1) * cellSize - 5);
                    ctx.stroke();
                } else if (val === "O") {
                    ctx.strokeStyle = "blue";
                    ctx.beginPath();
                    ctx.arc(
                        j * cellSize + cellSize / 2,
                        i * cellSize + cellSize / 2,
                        cellSize / 2 - 5,
                        0,
                        Math.PI * 2
                    );
                    ctx.stroke();
                }
            }
        }
    }, [board, size, cellSize]);

    // Click để xác định tọa độ
    const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas || !onClick) return;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;

        const i = Math.floor(y / cellSize);
        const j = Math.floor(x / cellSize);
        if (i < 0 || j < 0) return ;
        onClick(i, j);
    };

    return (
        <canvas
            ref={canvasRef}
            onClick={handleClick}
            style={{ border: "1px solid black", cursor: "pointer" }}
        />
    );
}
