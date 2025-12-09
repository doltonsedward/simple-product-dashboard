import { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Chip,
} from "@heroui/react";

interface Order {
  id: number;
  product_id: number;
  qty: number;
  total_price: number;
  status: "success" | "canceled";
  created_at: string;
  product_name?: string; // Join
}

export default function OrdersSection() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const res = await axios.get("http://localhost:3000/api/orders");
    setOrders(res.data);
  };

  const cancelOrder = async (id: number) => {
    await axios.post("http://localhost:3000/api/orders/cancel", { id });
    fetchOrders();
  };

  return (
    <div className="mt-8">
      <Table aria-label="Orders Table">
        <TableHeader>
          <TableColumn>ID</TableColumn>
          <TableColumn>Product Name</TableColumn>
          <TableColumn>Qty</TableColumn>
          <TableColumn>Total Price</TableColumn>
          <TableColumn>Status</TableColumn>
          <TableColumn>Actions</TableColumn>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.id}</TableCell>
              <TableCell>{order.product_name || "Unknown"}</TableCell>
              <TableCell>{order.qty}</TableCell>
              <TableCell>${order.total_price}</TableCell>
              <TableCell>
                <Chip color={order.status === "success" ? "success" : "danger"}>
                  {order.status}
                </Chip>
              </TableCell>
              <TableCell>
                {order.status === "success" && (
                  <Button
                    size="sm"
                    color="danger"
                    onClick={() => cancelOrder(order.id)}
                  >
                    Cancel
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
