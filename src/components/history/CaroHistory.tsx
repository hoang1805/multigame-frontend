import { ConfigProvider, Empty, Table, type TableProps } from "antd";
import { useEffect, useState } from "react";
import { popupUtil } from "../../utils/popup.util";
import { caroService } from "../../features/caro/caro.service";
import type { Caro } from "../../features/caro/caro.response";
import type { User } from "../../features/user/user.slice";
import { userService } from "../../features/user/user.service";
import { loading } from "../../utils/global.loading";
import type { RenderEmptyHandler } from "antd/es/config-provider";

const renderEmpty: RenderEmptyHandler = (componentName) => {
  if (componentName === 'Table.filter') {
    return (
      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No data" />
    );
  }
};

const getColumns = (
  page: number,
  size: number,
  users: User[],
): TableProps<Caro>["columns"] => {
  return [
    {
      title: "#",
      dataIndex: "index",
      width: 50,
      render: (_, __, index) => (page - 1) * size + index + 1,
    },
    {
      title: "Status",
      dataIndex: "isFinished",
      key: "status",
      render: (v: boolean) => v ? "Finished" : "Playing",
    },
    {
      title: "Winner",
      dataIndex: "winner",
      key: "winner",
      render: (winner: number | null) =>
        winner == null ? 'Draw' : users.find((u) => u.id == winner)?.nickname ?? 'Player'
    },
  ];
};

export default function CaroHistory() {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [_loading, setLoading] = useState(false);
  const [games, setGames] = useState<Caro[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    async function load() {
      try {
        loading.show();
        const response = await userService.all();
        setUsers(response.users);
      } catch (err: any) {
        const msg = err?.response?.data?.message || "failed";
        popupUtil.error({
          title: "Error",
          centered: true,
          content: msg,
          closable: true,
        });
      } finally {
        loading.hide();
      }
    }

    load();
  }, [])

  useEffect(() => {
    async function loadUsers() {
      setLoading(true);
      try {
        const response = await caroService.paginate(page, size);
        setGames(response.data);
        setTotal(response.total);
      } catch (err: any) {
        setGames([]);
        const msg = err?.response?.data?.message || "failed";
        popupUtil.error({
          title: "Error",
          centered: true,
          content: msg,
          closable: true,
        });
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, [page, size]);

  return <div className="mx-15">
    <div className="text-2xl my-4 font-medium">Caro History</div>
    <ConfigProvider renderEmpty={renderEmpty}>
      <Table columns={getColumns(page, size, users)} rowKey={(e) => e.id} bordered dataSource={games} pagination={{
        showSizeChanger: true,
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} of ${total} items`,
        pageSizeOptions: [10, 20, 50, 100, 500],
        current: page,
        pageSize: size,
        onChange: (page, pageSize) => {
          setPage(page);
          setSize(pageSize);
        },
        total: total
      }}
        loading={_loading}
        locale={{
          emptyText: (
            <Empty description="No Data"></Empty>
          ),
        }} />
    </ConfigProvider>
  </div>
}
