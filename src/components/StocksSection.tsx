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
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Input,
} from "@heroui/react";
import { useForm } from "react-hook-form";

interface Stock {
  id: number;
  product_id: number;
  quantity: number;
  product_name?: string; // Join dengan product untuk nama
}

interface StockForm {
  quantity: number;
}

export default function StocksSection() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const { register, handleSubmit, reset } = useForm<StockForm>();

  useEffect(() => {
    fetchStocks();
  }, []);

  const fetchStocks = async () => {
    const res = await axios.get("http://localhost:3000/api/stock");
    setStocks(res.data); // Asumsi res.data punya join product_name
  };

  const updateStock = async (data: StockForm) => {
    if (selectedStock) {
      await axios.post("http://localhost:3000/api/stock/update", {
        product_id: selectedStock.product_id,
        quantity: data.quantity,
      });
      fetchStocks();
      setIsModalOpen(false);
      reset();
    }
  };

  const openModal = (stock: Stock) => {
    setSelectedStock(stock);
    reset({ quantity: stock.quantity });
    setIsModalOpen(true);
  };

  return (
    <div className="mt-8">
      <Table aria-label="Stocks Table">
        <TableHeader>
          <TableColumn>ID</TableColumn>
          <TableColumn>Product Name</TableColumn>
          <TableColumn>Quantity</TableColumn>
          <TableColumn>Actions</TableColumn>
        </TableHeader>
        <TableBody>
          {stocks.map((stock) => (
            <TableRow key={stock.id}>
              <TableCell>{stock.id}</TableCell>
              <TableCell>{stock.product_name || "Unknown"}</TableCell>
              <TableCell>{stock.quantity}</TableCell>
              <TableCell>
                <Button size="sm" onClick={() => openModal(stock)}>
                  Update
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Update Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalContent>
          <ModalHeader>Update Stock</ModalHeader>
          <ModalBody>
            <form onSubmit={handleSubmit(updateStock)}>
              <Input
                label="Quantity"
                type="number"
                {...register("quantity", { required: true })}
              />
              <Button type="submit" color="primary">
                Save
              </Button>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}
