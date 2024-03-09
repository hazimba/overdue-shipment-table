import { Table } from "antd";
import { memo, useState, useMemo, useCallback } from "react";
import { parse } from 'date-fns';
import { getFlagEmoji } from "../utils";
import AllOrder from "./AllOrder";

const OverdueSalesTable = ({ orders = [], isLoading = false }: any) => {
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  const shipmentOverdueData = orders.filter((i: any) => i.shipment_status === 'Pending').map((i: any) => {
    const currentDate: any = new Date();
    const latestShipDate: any = parse(i.latest_ship_date, 'dd/MM/yyyy', new Date());
    const overdueDays = Math.ceil((currentDate - latestShipDate) / (1000 * 60 * 60 * 24));
    return {
      ...i,
      overdue_days: overdueDays,
      order_tax: (i.items * i.orderValue) * (i.taxes / 100),
      order_subtotal: i.items * i.orderValue,
      order_total: ((i.items * i.orderValue) * (i.taxes / 100) + i.items * i.orderValue).toFixed(2),
      shopName: i.store.shopName,
      marketplace: i.store.marketplace
    }
  })

  const columns = useMemo(
    () => [
      {
        title: "MARKETPLACE",
        dataIndex: "marketplace",
        render: (marketPlace: string, record: any) => {
          const flag = getFlagEmoji(record.store.country.slice(0, 2));
          return (
            <div>{`${flag} ${marketPlace}`}</div>
          );
        },
        sorter: (a: any, b: any) => {
          const marketplaceA = a.marketplace.toUpperCase();
          const marketplaceB = b.marketplace.toUpperCase();
          return (marketplaceA < marketplaceB) ? -1 : (marketplaceA > marketplaceB) ? 1 : 0;
        },  
      },
      {
        title: "STORE",
        dataIndex: "shopName",
        responsive: ["md"],
        sorter: (a: any, b: any) => {
          const shopA = a.shopName.toUpperCase();
          const shopB = b.shopName.toUpperCase();
          return (shopA < shopB) ? -1 : (shopA > shopB) ? 1 : 0;
        },  
      },
      {
        title: "ORDER ID",
        dataIndex: "orderId",
        sorter: (a: any, b: any) => {
          const orderIdA = a.orderId.toUpperCase();
          const orderIdB = b.orderId.toUpperCase();
          return (orderIdA < orderIdB) ? -1 : (orderIdA > orderIdB) ? 1 : 0;
        }, 
      },
      {
        title: "ITEMS",
        dataIndex: "items",
        align: "right",
        sorter: (a: any, b: any) => a.items - b.items,
      },
      {
        title: "DESTINATION",
        dataIndex: "destination",
        responsive: ["md"],
        align: "right",
        sorter: (a: any, b: any) => {
          const destinationA = a.destination.toUpperCase();
          const destinationB = b.destination.toUpperCase();
          return (destinationA < destinationB) ? -1 : (destinationA > destinationB) ? 1 : 0;
        },      
      },
      {
        title: "DAYS OVERDUE",
        dataIndex: "overdue_days",
        key: "overdue_days",
        align: "right",
        sorter: (a: any, b: any) => a.overdue_days - b.overdue_days,
        responsive: ["md"],
        render: (overdue: string) => <div style={{ color: 'red', fontWeight: "600" }}>- {overdue}</div>
      },
      {
        title: "ORDER VALUE",
        dataIndex: "orderValue",
        align: "right",
        sorter: (a: any, b: any) => a.orderValue - b.orderValue,
        responsive: ["md"],
        render: (orderValue: string) => <>${orderValue}</>
      },
      {
        title: "ORDER TAXES",
        dataIndex: "taxes",
        align: "right",
        sorter: (a: any, b: any) => a.taxes - b.taxes,
        responsive: ["md"],
        render: (taxes: string) => <>{taxes}%</>
      },
      {
        title: "ORDER TOTAL",
        dataIndex: "order_total",
        align: "right",
        sorter: (a: any, b: any) => a.order_total - b.order_total,
        responsive: ["md"],
        render: (orderTotal: string) => <>${orderTotal}</>
      },
    ],
    []
  );

  const onChange = useCallback((current: number, pageSize: number) => {
    setPagination({ current, pageSize });
  }, []);

  const showTotal = useCallback((total: any, range: any) => {
    return `${range[0]} - ${range[1]} of ${total}`;
  }, []);

  const paginationObj = useMemo(
    () => ({
      onChange,
      showTotal,
      pageSizeOptions: [5, 10],
      ...pagination,
    }),
    [onChange, pagination, showTotal]
  );

  return (
    <>
      <Table
      size="small"
      // @ts-ignore
      columns={columns}
      loading={isLoading}
      dataSource={shipmentOverdueData}
      pagination={paginationObj}
      />
      <AllOrder shipmentOverdueData={shipmentOverdueData} />
    </>
  );
};

export default memo(OverdueSalesTable);
