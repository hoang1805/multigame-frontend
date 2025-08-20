import { useEffect, useState } from "react";
import AppContent from "../components/app/AppContent";
import AppHeader from "../components/app/AppHeader";
import { useNavigate, useParams } from "react-router-dom";
import CaroHistory from "../components/history/CaroHistory";
import Line98History from "../components/history/Line98History";

export function History() {
    const { game } = useParams<{ game: string }>();
    const [selected, setSelected] = useState(game ?? '');
    const navigate = useNavigate();

    if (game != 'caro' && game != 'line98') {
        navigate('/history/caro');
    }

    useEffect(() => {
        const parts = window.location.pathname.split("/");
        parts[parts.length - 1] = selected;
        const newPath = parts.join("/"); 

        window.history.replaceState(null, "", newPath);
    }, [selected])

    return <>
        <AppHeader title="User detail" items={[
            { label: "Caro", key: 'caro' },
            { label: "Line98", key: 'line98' },
        ]} onItemChange={(e) => setSelected(e)} defaultSelect={selected} />
        <AppContent>
            {selected == 'caro' && <CaroHistory />}
            {selected == 'line98' && <Line98History />}
        </AppContent>
    </>
}