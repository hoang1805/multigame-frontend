import { Spin } from "antd";

interface PlayerProps {
    name: string;
    limit: number;
    time: number;
    side: 'left' | 'right';
    opponent: boolean;
    className?: string;
}

export default function Player({ name, limit, time, side, opponent, className }: PlayerProps) {
    return <div className={`flex flex-row justify-between items-center rounded-md border bg-white border-gray-300 h-20 p-3.5 ${className ?? ''}`}>
        <div>
            {side == 'left' ? <User name={name} opponent={opponent} time={time} side={side} /> : <Timer time={time} limit={limit} />}
        </div>
        <div>
            {side == 'right' ? <User name={name} opponent={opponent} time={time} side={side} /> : <Timer time={time} limit={limit} />}
        </div>
    </div>
}


interface UserProps {
    name: string;
    opponent: boolean;
    time: number;
    side: 'left' | 'right';
}
function User({ name, opponent, time, side }: UserProps) {
    return <div className="flex flex-col justify-between">
        <div className={`font-medium ${side == 'left' ? 'text-left' : 'text-right'}`}>{name}</div>
        {time > 0 ? <div className={`${side == 'left' ? 'text-left' : 'text-right'}`}>{opponent ? 'Your opponent \'s turn' : 'Your turn'}</div> : <div>&nbsp;</div>}
    </div>
}

interface TimerProps {
    time: number;
    limit: number;
}
function Timer({ time, limit }: TimerProps) {
    if (time <= 0 || limit <= 0) {
        return <div></div>;
    }

    const percent = 1.0 * time / limit * 100;

    return <div className="flex justify-center"><Spin percent={percent} size="large" /></div>
}