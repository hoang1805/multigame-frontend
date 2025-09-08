import { useNavigate } from "react-router-dom";
import { useSocketContext } from "../context/SocketContext";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";
import type { CaroFoundData } from "../features/caro/caro.data";
import { loading } from "../utils/global.loading";
import { useEffect, useState } from "react";
import { line98Service } from "../features/line98/line98.service";
import FindMatchModal from "../components/caro/FindMatchModal";
import { Card, Divider } from "antd";
import AppHeader from "../components/app/AppHeader";
import AppContent from "../components/app/AppContent";
import { popupUtil } from "../utils/popup.util";

export default function Home() {
  const { initSocket, on, disconnect } = useSocketContext();
  const navigate = useNavigate();
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const [name, setName] = useState<string>('');
  const user = useSelector((state: RootState) => state.user.user);
  const [searching, setSearching] = useState(false);
  const handlePlayCaro = () => {
    const game = 'caro';
    initSocket(game, accessToken ?? '');
    setSearching(true);

    on(game, 'caro:found', (data: CaroFoundData) => {
      setSearching(false);
      navigate(`/caro/${data.matchId}`);
    });

    on(game, 'caro:continue', (data: CaroFoundData) => {
      setSearching(false);
      navigate(`/caro/${data.matchId}`);
    });
  }

  const onCancelCaro = () => {
    setSearching(false);
    disconnect('caro');
  }

  const handlePlayLine98 = async () => {
    // navigate();
    loading.show();
    try {
      const data = await line98Service.play();
      loading.hide();
      navigate(`/line98/${data.id}`);
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Error";
      popupUtil.error({ title: 'Error', centered: true, content: msg, closable: true });
      loading.hide();
      console.log(err);
    }
  }

  useEffect(() => {
    setName(user?.nickname ?? '');
  }, [user?.nickname]);

  return <>
    <AppHeader title="Home" />
    <AppContent>
      <div className="mt-10 mx-10">
        <div className="text-2xl font-medium">
          Welcome back, <span className="">{name}</span> !!! 👋
        </div>
        <div className="text-gray-600 mt-2">See available games</div>
        <Divider size="middle" />
        <div className="text-xl font-medium mb-4">
          Available games
        </div>
        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-10">
          <Card onClick={() => handlePlayCaro()} className="cursor-pointer shadow-md rounded-xl transition-transform transform hover:scale-[1.02] bg-[#c3ddff]!">
            <Card.Meta
              title={<div className="">Caro</div>}
              description={
                <>
                  <p>Classic 15x15 board game.</p>
                  <p>Play with friends.</p>
                </>
              } />
          </Card>
          <Card onClick={() => handlePlayLine98()} className="cursor-pointer shadow-md rounded-xl transition-transform transform hover:scale-[1.02] bg-[#ddffd9]!">
            <Card.Meta
              title={<div className="">Line98</div>}
              description={
                <>
                  <p>Arrange balls of the same color.</p>
                  <p>Try to get the highest score!</p>
                </>
              } />
          </Card>
        </div>
        <FindMatchModal visible={searching} onCancel={onCancelCaro} />
      </div>
    </AppContent>
  </>;
}