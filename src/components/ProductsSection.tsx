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
  Textarea,
} from "@heroui/react";
import { useForm } from "react-hook-form";

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image_url: string;
  created_at: string;
}

interface ProductForm {
  name: string;
  price: number;
  description: string;
  image_url: string;
}

export default function ProductsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { register, handleSubmit, reset } = useForm<ProductForm>();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await axios.get("http://localhost:3000/api/products");
    setProducts(res.data);
  };
  console.log(products, "products");

  const addProduct = async (data: ProductForm) => {
    await axios.post("http://localhost:3000/api/products", data);
    fetchProducts();
    setIsAddModalOpen(false);
    reset();
  };

  const editProduct = async (data: ProductForm) => {
    if (selectedProduct) {
      await axios.put(
        `http://localhost:3000/api/products/${selectedProduct.id}`,
        data
      ); // Asumsi ada PUT, adjust kalau beda
      fetchProducts();
      setIsEditModalOpen(false);
      reset();
    }
  };

  const deleteProduct = async (id: number) => {
    await axios.delete(`http://localhost:3000/api/products/${id}`); // Asumsi ada DELETE
    fetchProducts();
  };

  const openEditModal = (product: Product) => {
    setSelectedProduct(product);
    reset(product);
    setIsEditModalOpen(true);
  };

  return (
    <div className="mt-8">
      <Button onClick={() => setIsAddModalOpen(true)} color="primary">
        Add Product
      </Button>
      <Table aria-label="Products Table" className="mt-4">
        <TableHeader>
          <TableColumn>ID</TableColumn>
          <TableColumn>Name</TableColumn>
          <TableColumn>Price</TableColumn>
          <TableColumn>Description</TableColumn>
          <TableColumn>Image URL</TableColumn>
          <TableColumn>Actions</TableColumn>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.id}</TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>${product.price}</TableCell>
              <TableCell>{product.description}</TableCell>
              <TableCell>{product.image_url}</TableCell>
              <TableCell>
                <Button size="sm" onClick={() => openEditModal(product)}>
                  Edit
                </Button>
                <Button
                  size="sm"
                  color="danger"
                  onClick={() => deleteProduct(product.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Add Modal */}
      <Modal
        className="dark"
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      >
        <ModalContent>
          <ModalHeader>Add Product</ModalHeader>
          <ModalBody>
            <form onSubmit={handleSubmit(addProduct)}>
              <Input
                label="Name"
                {...register("name", { required: true })}
                className="mb-2"
              />
              <Input
                label="Price"
                type="number"
                {...register("price", { required: true })}
                className="mb-2"
              />
              <Textarea
                label="Description"
                {...register("description")}
                className="mb-2"
              />
              <Input
                label="Image URL"
                {...register("image_url")}
                className="mb-2"
              />
              <Button type="submit" color="primary">
                Save
              </Button>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <ModalContent>
          <ModalHeader>Edit Product</ModalHeader>
          <ModalBody>
            <form onSubmit={handleSubmit(editProduct)}>
              <Input label="Name" {...register("name", { required: true })} />
              <Input
                label="Price"
                type="number"
                {...register("price", { required: true })}
              />
              <Textarea label="Description" {...register("description")} />
              <Input label="Image URL" {...register("image_url")} />
              <Button type="submit" color="primary">
                Update
              </Button>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}
