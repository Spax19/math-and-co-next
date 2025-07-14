"use client";

import { useState } from "react";
import ProtectedRoute from "../../../components/protectedRoutes";
import AdminSidebar from "../../../components/admin/adminSidebar";
import AddProductModal from "../../../components/admin/addProduct";
import EditProductModal from "../../../components/admin/editProduct"; 
import DeleteProductModal from "../../../components/admin/deleteProduct"; 
import "../../globals.css";
import {
  Package,
  Edit,
  Trash2,
  PlusCircle,
  AlertTriangle,
  CheckCircle,
} from "lucide-react"; // Icons
import { toast } from "react-toastify"; // For notifications

export default function AdminProductsPage() {
  // Dummy Product Data
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Classic Cabernet Sauvignon 2022",
      category: "Red Wine",
      stock: 150,
      price: 25.99,
      status: "In Stock",
    },
    {
      id: 2,
      name: "Elegant Chardonnay 2023",
      category: "White Wine",
      stock: 75,
      price: 18.5,
      status: "In Stock",
    },
    {
      id: 3,
      name: "Sparkling Rosé Brut",
      category: "MCC",
      stock: 15,
      price: 32.0,
      status: "Low Stock",
    },
    {
      id: 4,
      name: "Premium Pinot Noir 2021",
      category: "Red Wine",
      stock: 5,
      price: 45.0,
      status: "Out of Stock",
    },
    {
      id: 5,
      name: "Crisp Sauvignon Blanc",
      category: "White Wine",
      stock: 120,
      price: 21.75,
      status: "In Stock",
    },
    {
      id: 6,
      name: "Dessert Wine Late Harvest",
      category: "Dessert Wine",
      stock: 30,
      price: 39.99,
      status: "In Stock",
    },
  ]);

  // State for modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null); // Product currently being edited/deleted

  // Handlers for Add Modal
  const handleAddProductClick = () => {
    setIsAddModalOpen(true);
  };

  const handleSaveNewProduct = (newProduct) => {
    setProducts((prevProducts) => [...prevProducts, newProduct]);
    toast.success("Product added successfully!");
    setIsAddModalOpen(false);
  };

  // Handlers for Edit Modal
  const handleEditProductClick = (product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleSaveEditedProduct = (updatedProduct) => {
    setProducts((prevProducts) =>
      prevProducts.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
    toast.success("Product updated successfully!");
    setIsEditModalOpen(false);
    setSelectedProduct(null);
  };

  // Handlers for Delete Modal
  const handleDeleteProductClick = (product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDeleteProduct = (productId) => {
    setProducts((prevProducts) =>
      prevProducts.filter((p) => p.id !== productId)
    );
    toast.success("Product deleted successfully!");
    setIsDeleteModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        <main className="flex-1 p-8 w-60">
          {" "}
          {/* flex-1 ensures it takes remaining width */}
          <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
            <Package className="w-8 h-8 mr-3 text-[#d4b26a]" /> Product
            Management
          </h1>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Product List
              </h2>
              <button
                onClick={handleAddProductClick}
                className="flex items-center px-4 py-2 bg-[#d4b26a] text-white rounded-md font-medium hover:bg-[#c4a25a] transition-colors duration-200 shadow-sm"
              >
                <PlusCircle className="w-5 h-5 mr-2" /> Add New Product
              </button>
            </div>

            <p className="text-gray-600 mb-4">
              View, add, edit, and delete products in your inventory.
            </p>

            <div className="overflow-x-auto">
              {" "}
              {/* This makes the table horizontally scrollable on small screens */}
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {product.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {product.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {product.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {product.stock}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        ${product.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${
                            product.status === "In Stock"
                              ? "bg-green-100 text-green-800"
                              : product.status === "Low Stock"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {product.status === "Low Stock" && (
                            <AlertTriangle className="w-3 h-3 inline mr-1" />
                          )}
                          {product.status === "In Stock" && (
                            <CheckCircle className="w-3 h-3 inline mr-1" />
                          )}
                          {product.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEditProductClick(product)}
                          className="text-indigo-600 hover:text-indigo-900 mr-3"
                        >
                          <Edit className="w-4 h-4 inline" /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProductClick(product)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4 inline" /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveNewProduct}
      />
      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        product={selectedProduct}
        onSave={handleSaveEditedProduct}
      />
      <DeleteProductModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        product={selectedProduct}
        onDeleteConfirm={handleConfirmDeleteProduct}
      />
    </ProtectedRoute>
  );
}
