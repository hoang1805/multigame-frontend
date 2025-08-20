import { useEffect, useState } from 'react';
import type { OpponentData, ResultData, StateData } from '../features/caro/caro.data';
import { useSocketContext } from '../context/SocketContext';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { popupUtil } from '../utils/popup.util';
import AppHeader from '../components/app/AppHeader';
import AppContent from '../components/app/AppContent';
import Player from '../components/caro/Player';
import BoardCanvas from '../components/caro/BoardCanvas';

type Cell = 'X' | 'O' | null;

export default function Caro() {
    const { id: matchId } = useParams<{ id: string }>();
    const { on, emit, getSocket, disconnect } = useSocketContext();
    const [size, setSize] = useState<number>(0);
    const [board, setBoard] = useState<Cell[][]>();
    const [opponentName, setOppponentName] = useState<string>('');
    const [timeLimit, setTimeLimit] = useState<number>(0);
    const [playerSymbol, setPlayerSymbol] = useState<string>('');
    const [currentTurn, setCurrentTurn] = useState<string>('');
    const [timeRemain, setTimeRemain] = useState<number>(0);
    const [result, setResult] = useState<string>('');

    const socket = getSocket('caro');
    const navigate = useNavigate();

    const onOk = () => {
        navigate('/', { replace: true });
    }

    useEffect(() => {
        on('caro', 'caro:opponent', (data: OpponentData) => {
            if (data.matchId != parseInt(matchId!, 10)) return;

            setOppponentName(data.name);
        });

        on('caro', 'caro:state', (data: StateData) => {
            if (data.matchId != parseInt(matchId!, 10)) return;

            if (data.size) {
                setSize(data.size);
            }

            if (data.time) {
                setTimeLimit(data.time);
            }

            setBoard(parsedBoard(data.board));
            setCurrentTurn(data.turn);
            setTimeRemain(data.timeRemain);
            setPlayerSymbol(data.userSymbol);
        });

        on('caro', 'caro:win', (data: ResultData) => {
            if (data.matchId != parseInt(matchId!, 10)) return;
            setBoard(parsedBoard(data.board));
            setResult("You win");
        });

        on('caro', 'caro:lose', (data: ResultData) => {
            if (data.matchId != parseInt(matchId!, 10)) return;
            setBoard(parsedBoard(data.board));
            setResult("You lose");
        });

        on('caro', 'caro:draw', (data: ResultData) => {
            if (data.matchId != parseInt(matchId!, 10)) return;
            setBoard(parsedBoard(data.board));
            setResult("Draw");
        });

        on('caro', 'error', (data: { message: string }) => {
            popupUtil.error({ title: "Error", content: data.message, centered: true, closable: false, onOk });
        })

        return () => {
            socket?.off('caro:opponent');
            socket?.off('caro:state');
            socket?.off('caro:win');
            socket?.off('caro:lose');
            socket?.off('caro:draw');
            socket?.off('error');
            disconnect('caro');
        };
    }, [socket, matchId]);

    useEffect(() => {
        emit('caro', 'join');
    }, [emit]);

    useEffect(() => {
        if (result) {
            popupUtil.info({ title: "Match result", content: result, centered: true, closable: false, onOk });
        }
    }, [result]);

    useEffect(() => {
        if (timeRemain <= 0 || result) return;

        const start = Date.now();
        const startRemain = timeRemain;

        const interval = setInterval(() => {
            const elapsed = Date.now() - start;
            const newRemain = Math.max(0, startRemain - elapsed);
            setTimeRemain(newRemain);
        }, 100);

        return () => clearInterval(interval);
    }, [timeRemain]);

    const handleClick = (row: number, col: number) => {
        if (!socket) return;
        if (!board) return;
        if (board[row][col]) return;
        if (playerSymbol !== currentTurn) return;
        if (!matchId) return;

        emit('caro', 'move', { matchId: parseInt(matchId), row, col });
    };

    if (!matchId || !socket) {
        return <Navigate to='/' replace />
    }

    return <>
        <AppHeader title='Playing Caro' />
        <AppContent>
            <div className='mx-auto mt-3.5 w-xl flex flex-col justify-between gap-3.5'>
                <div className='flex flex-row justify-between gap-2.5'>
                    {/**Left */}
                    <Player className='w-full' name={playerSymbol == 'X' ? 'You' : opponentName} limit={timeLimit} time={currentTurn == 'X' ? timeRemain : 0} side={'left'} opponent={playerSymbol == 'O'} />

                    {/**Right */}
                    <Player className='w-full' name={playerSymbol == 'O' ? 'You' : opponentName} limit={timeLimit} time={currentTurn == 'O' ? timeRemain : 0} side={'right'} opponent={playerSymbol == 'X'} />
                </div>
                <BoardCanvas size={size} board={board ?? []} onClick={handleClick} />
            </div>
        </AppContent>
    </>
}

function parsedBoard(board: string[][]): Cell[][] {
    return board.map((row: string[]) =>
        row.map((cell) => (cell === 'X' || cell === 'O' ? cell : null))
    );
}
