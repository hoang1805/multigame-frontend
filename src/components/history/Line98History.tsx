import { ConfigProvider, Empty, Table, type TableProps } from "antd";
import { useEffect, useState } from "react";
import { line98Service } from "../../features/line98/line98.service";
import type { Line98 } from "../../features/line98/line98.response";
import { popupUtil } from "../../utils/popup.util";
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
  size: number
): TableProps<Line98>["columns"] => {
  return [
    {
      title: "#",
      dataIndex: "index",
      width: 50,
      render: (_, __, index) => (page - 1) * size + index + 1,
    },
    {
      title: "Score",
      dataIndex: "score",
      key: "score",
    },
    {
      title: "Status",
      dataIndex: "endReason",
      key: "status",
      render: (status: string) =>
        status == "game_over" ? "Game over" : "Playing",
    },
  ];
};

export default function Line98History() {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [games, setGames] = useState<Line98[]>([]);
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    async function loadUsers() {
      setLoading(true);
      try {
        const response = await line98Service.paginate(page, size);
        setGames(response.data);
        setTotal(response.total);
        console.log(response);
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
    <div className="text-2xl my-4 font-medium">Line98 History</div>
    <ConfigProvider renderEmpty={renderEmpty}>
      <Table columns={getColumns(page, size)} rowKey={(e) => e.id} bordered dataSource={games} pagination={{
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
        loading={loading}
        locale={{
          emptyText: (
            <Empty description="No Data"></Empty>
          ),
        }} />
    </ConfigProvider>
  </div>
}
