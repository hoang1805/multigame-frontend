import { useEffect, useMemo, useRef, useState } from "react";
import { Button, Space, Typography, Tag } from "antd";
import { useSocketContext } from "../context/SocketContext";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";
import type { BallState, HelpData, MoveData } from "../features/line98/line98.data";
import { useNavigate, useParams } from "react-router-dom";
import { loading } from "../utils/global.loading";
import { line98Service } from "../features/line98/line98.service";
import { popupUtil } from "../utils/popup.util";
import AppHeader from "../components/app/AppHeader";
import AppContent from "../components/app/AppContent";

const { Title } = Typography;

type Pos = [number, number]; // [row, col]

type Line98State = {
    board: number[][];    // 0 = empty, 1..5 = color id
    score: number;
    nextBalls: number[];  // length 3, 1..5
    gameOver?: boolean;
};

type HelpSuggestion = {
    from: Pos;
    to: Pos;
    path?: Pos[];
};

const COLORS: Record<number, string> = {
    1: "#e74c3c", // red
    2: "#3498db", // blue
    3: "#2ecc71", // green
    4: "#f1c40f", // yellow
    5: "#9b59b6", // purple
};

export default function Line98() {
    const { id: matchId } = useParams<{ id: string }>();
    const { on, emit, initSocket, disconnect } = useSocketContext();
    // const socket = getSocket("line98");

    const token = useSelector((state: RootState) => state.auth.accessToken);
    const socket = initSocket('line98', token ?? '');

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [state, setState] = useState<Line98State | null>(null);
    const [selected, setSelected] = useState<Pos | null>(null);
    // const [time, setTime] = useState<number>(0);
    const [hint, setHint] = useState<HelpSuggestion | null>(null);
    const [awaiting, setAwaiting] = useState(false);
    const [grid, setGrid] = useState<number>(1);
    const [helpRemain, setHelpRemain] = useState<number>(0);

    const navigate = useNavigate();

    const onOk = () => {
        navigate('/', { replace: true });
    }

    // kích thước canvas (cố định để dễ tính; có thể responsive sau)
    const view = useMemo(() => ({ size: 450, padding: 8 }), []);
    const cell = useMemo(() => {
        // if (!grid) return;
        const usable = view.size - view.padding * 2;
        return Math.floor(usable / grid);
    }, [view, grid]);

    useEffect(() => {
        (async () => {
            loading.show();
            try {
                const game = await line98Service.get(matchId);
                setGrid(game.config.size);
                setState({
                    board: parseBoard(game.state.balls, game.config.size),
                    score: game.score,
                    nextBalls: game.state.nextBalls,
                    gameOver: game.state.gameOver,
                });
                setHelpRemain(game.state.helpRemaining);
                // setTime(game.state.time);

                emit('line98', 'join', { matchId: parseInt(matchId ?? '', 10) });
            } catch (err) {
                loading.hide();
                console.log(err);
            } finally {
                loading.hide();
            }
        })();

    }, [matchId]);

    useEffect(() => {
        on('line98', 'line98:connected', () => {
            console.log('connected');
        });

        on('line98', 'line98:move', (data: MoveData) => {
            setState(prev => {
                if (!prev || parseInt(matchId ?? '', 10) !== data.matchId) {
                    return prev;
                }

                const board = [...prev.board.map(row => [...row])]; // clone board
                const nextBalls = data.move.nextBalls ?? prev.nextBalls;
                const score = prev.score + (data.move.points ?? 0);

                if (data.move.moveFrom && data.move.moveTo) {
                    const { x: fx, y: fy } = data.move.moveFrom;
                    const { x: tx, y: ty } = data.move.moveTo;
                    board[tx][ty] = board[fx][fy];
                    board[fx][fy] = 0;
                }

                if (data.move.removed) {
                    data.move.removed.forEach(({ x, y }) => board[x][y] = 0);
                }

                if (data.move.added) {
                    data.move.added.forEach(({ x, y, color }) => board[x][y] = color);
                }

                return { ...prev, board, nextBalls, score };
            });
        });

        on('line98', 'line98:help', (data: HelpData) => {
            setHint({
                from: [data.from.x, data.from.y],
                to: [data.to.x, data.to.y]
            });
        });

        on('line98', 'line98:game.over', (data: { matchId: number }) => {
            if (parseInt(matchId ?? '', 10) !== data.matchId) {
                return;
            }
            popupUtil.info({ title: 'Game over!', content: 'You lose!!!', closable: false, centered: true, onOk });
        });

        on('line98', 'error', (data: { message: string }) => {
            popupUtil.error({ title: "Error", content: data.message, centered: true, closable: false, onOk })
        });

        return () => {
            socket.off('line98:connected');
            socket.off('line98:move');
            socket.off('line98:help');
            socket.off('line98:game.over');
            socket.off('error');
            disconnect('line98');
        };
    }, [socket]);  // chỉ phụ thuộc socket, KHÔNG phụ thuộc state


    // --- canvas draw
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !state || !socket) return;

        const dpr = window.devicePixelRatio || 1;
        canvas.width = view.size * dpr;
        canvas.height = view.size * dpr;
        canvas.style.width = `${view.size}px`;
        canvas.style.height = `${view.size}px`;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.scale(dpr, dpr);

        // background
        ctx.fillStyle = "#fafafa";
        ctx.fillRect(0, 0, view.size, view.size);

        // draw grid
        const start = view.padding;
        const size = cell * grid;
        ctx.strokeStyle = "#ddd";
        for (let i = 0; i <= grid; i++) {
            // vertical
            ctx.beginPath();
            ctx.moveTo(start + i * cell, start);
            ctx.lineTo(start + i * cell, start + size);
            ctx.stroke();
            // horizontal
            ctx.beginPath();
            ctx.moveTo(start, start + i * cell);
            ctx.lineTo(start + size, start + i * cell);
            ctx.stroke();
        }

        // helper: draw ball
        const drawBall = (r: number, c: number, colorId: number, scale = 1) => {
            if (colorId <= 0) return;
            const cx = start + c * cell + cell / 2;
            const cy = start + r * cell + cell / 2;
            const radius = (cell * 0.35) * scale;

            // shadow
            ctx.beginPath();
            ctx.arc(cx, cy + 1.5, radius, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(0,0,0,0.15)";
            ctx.fill();

            // main
            ctx.beginPath();
            ctx.arc(cx, cy, radius, 0, Math.PI * 2);
            ctx.fillStyle = COLORS[colorId] || "#555";
            ctx.fill();

            // highlight
            ctx.beginPath();
            ctx.arc(cx - radius / 3, cy - radius / 3, radius / 3, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(255,255,255,0.35)";
            ctx.fill();
        };

        // draw balls
        for (let r = 0; r < grid; r++) {
            for (let c = 0; c < grid; c++) {
                const val = state.board?.[r]?.[c] ?? 0;
                const scaled =
                    selected && selected[0] === r && selected[1] === c ? 1.12 : 1;
                drawBall(r, c, val, scaled);
            }
        }

        // draw suggestion (from/to and optional path)
        if (hint) {
            const toRect = (p: Pos) => ({
                x: start + p[1] * cell + 1,
                y: start + p[0] * cell + 1,
                w: cell - 2,
                h: cell - 2,
            });

            // path
            if (hint.path && hint.path.length > 0) {
                ctx.save();
                ctx.lineWidth = 3;
                ctx.strokeStyle = "rgba(52,152,219,0.8)";
                ctx.beginPath();
                hint.path.forEach((p, idx) => {
                    const cx = start + p[1] * cell + cell / 2;
                    const cy = start + p[0] * cell + cell / 2;
                    if (idx === 0) ctx.moveTo(cx, cy);
                    else ctx.lineTo(cx, cy);
                });
                ctx.stroke();
                ctx.restore();
            }

            // from/to highlight
            const r1 = toRect(hint.from);
            const r2 = toRect(hint.to);
            ctx.save();
            ctx.strokeStyle = "#e67e22";
            ctx.lineWidth = 2;
            ctx.strokeRect(r1.x, r1.y, r1.w, r1.h);
            ctx.strokeStyle = "#27ae60";
            ctx.strokeRect(r2.x, r2.y, r2.w, r2.h);
            ctx.restore();
        }
    }, [state, selected, hint, cell, view, socket]);

    // --- click handling
    const pointToCell = (x: number, y: number): Pos | null => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return null;
        const rx = x - rect.left;
        const ry = y - rect.top;
        const start = view.padding;
        const within =
            rx >= start &&
            ry >= start &&
            rx < start + cell * grid &&
            ry < start + cell * grid;
        if (!within) return null;

        const c = Math.floor((rx - start) / cell);
        const r = Math.floor((ry - start) / cell);
        if (r < 0 || r >= grid || c < 0 || c >= grid) return null;
        return [r, c];
    };

    const onCanvasClick: React.MouseEventHandler<HTMLCanvasElement> = (e) => {
        if (!state || awaiting) return;
        const p = pointToCell(e.clientX, e.clientY);
        if (!p) return;

        const [r, c] = p;
        const val = state.board?.[r]?.[c] ?? 0;

        // chọn/unselect
        if (val > 0) {
            // chọn bóng
            setSelected((prev) =>
                prev && prev[0] === r && prev[1] === c ? null : [r, c]
            );
            setHint(null);
            return;
        }

        // click ô trống, nếu đã chọn -> emit move
        if (selected && socket) {
            setAwaiting(true);
            emit("line98", "move", { matchId: parseInt(matchId ?? '', 10), from: { x: selected[0], y: selected[1] }, to: { x: r, y: c } });
            // để UI đỡ nhấp nháy
            setHint(null);
            setAwaiting(false);
            // không clear selected vội; server trả state sẽ vẽ lại
        }
    };

    // --- actions
    const handleHelp = () => {
        console.log(state);
        console.log(awaiting);
        if (!state || awaiting || helpRemain <= 0) return;
        setHelpRemain(helpRemain - 1);
        emit("line98", "help");
    };

    const handleCancel = () => {
        popupUtil.confirm({
            title: "Bỏ cuộc",
            content: "Bạn chắc chắn chứ? Bạn sẽ bị tính thua trận này",
            centered: true,
            onOk: () => emit("line98", "cancel"),
        });
    };

    return <>
        <AppHeader title="Playing Line98"/>
        <AppContent>
            <div className="max-w-[720px] mx-auto my-20 px-3">
                <Space style={{ marginBottom: 12, width: "100%", justifyContent: "space-between" }}>
                    <Title level={3} style={{ margin: 0 }}>
                        Current game
                    </Title>
                    <Space>
                        <Tag color="blue">
                            Score: <b style={{ marginLeft: 4 }}>{state?.score ?? 0}</b>
                        </Tag>
                        <Space.Compact>
                            <Button onClick={handleHelp} disabled={!state || awaiting}>
                                Help
                            </Button>
                            <Button onClick={handleCancel} danger>
                                Give up
                            </Button>
                        </Space.Compact>
                    </Space>
                </Space>

                <div style={{ display: "flex", gap: 16 }}>
                    <canvas
                        ref={canvasRef}
                        width={view.size}
                        height={view.size}
                        style={{
                            borderRadius: 12,
                            background: "#fff",
                            boxShadow: "0 4px 18px rgba(0,0,0,0.06)",
                            cursor: awaiting ? "wait" : "pointer",
                        }}
                        onClick={onCanvasClick}
                    />
                    <div style={{ minWidth: 140 }}>
                        <div style={{ marginBottom: 8, fontWeight: 600 }}>Upcomming:</div>
                        <Space wrap>
                            {(state?.nextBalls ?? []).map((c, i) => (
                                <span
                                    key={i}
                                    style={{
                                        width: 22,
                                        height: 22,
                                        borderRadius: "50%",
                                        background: COLORS[c] || "#bbb",
                                        display: "inline-block",
                                        boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                                    }}
                                />
                            ))}
                        </Space>
                    </div>
                </div>
            </div>
        </AppContent>
    </>
}

function parseBoard(balls: BallState[], size: number): number[][] {
    const board = Array.from({ length: size }, () => Array<number>(size).fill(0));
    balls.forEach(({ x, y, color }) => {
        board[x][y] = color;
    })
    return board;
}