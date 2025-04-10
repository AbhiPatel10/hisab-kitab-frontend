"use client"

import { deleteCustomer, getAllCustomers } from "@/services/customerService";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ConfirmModal } from "@/app/components/ConfirmModal";
import { Customer } from "@/types/types";
import Navbar from "./components/navbar";

export default function Home() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter();

  const fetchCustomers = async () => {
    try {
      const data = await getAllCustomers();
      setCustomers(data.data);
    } catch (error) {
      console.error("Failed to fetch customers:", error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleConfirmDelete = async () => {
    if (!selectedCustomerId) return;
    try {
      await deleteCustomer(selectedCustomerId);
      setIsModalOpen(false);
      setSelectedCustomerId(null);
      fetchCustomers();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleDeleteClick = (id: number) => {
    setSelectedCustomerId(id);
    setIsModalOpen(true);
  };

  return (
    <div>
      <Navbar />
      <div className="flex justify-between items-center max-w-[700px] mx-auto my-[30px]">
        <h1 className="text-4xl text-gray-800">Customers List</h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-md" onClick={() => router.push('/addCustomer')}>
          Add Customer
        </button>
      </div>
      <div className="relative overflow-x-auto shadow-md rounded-lg max-w-[700px] mx-auto bg-white border border-1">
        <table className="w-full text-sm text-left text-gray-700 ">
          <thead className="text-xs uppercase bg-gray-100 text-gray-600">
            <tr>
              <th scope="col" className="px-6 py-3">
                Customer name
              </th>
              <th scope="col" className="px-4 py-3 w-[30px]">
                Edit
              </th>
              <th scope="col" className="px-4 py-3 w-[30px]">
                Delete
              </th>
            </tr>
          </thead>
          <tbody>
            {
              customers.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-6 text-gray-500">
                    No customer found
                  </td>
                </tr>
              ) : (
                customers?.map((customer, index) => (
                  <tr
                    key={customer.customerId}
                    className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} border-b border-gray-200 hover:cursor-pointer`}
                    onClick={() => router.push(`/customerTransactions?id=${customer.customerId}`)}
                  >
                    <td className="px-4 py-4 font-medium text-gray-900">{customer.name}</td>
                    <td className="px-4 py-4 text-blue-600 hover:underline cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/addCustomer?id=${customer.customerId}`)
                      }}>
                      Edit
                    </td>
                    <td className="px-4 py-4 text-red-500 hover:underline cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(customer.customerId)
                      }}>
                      Delete
                    </td>
                  </tr>
                )))
            }
          </tbody>
        </table>
      </div>
      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div >
  );
}
