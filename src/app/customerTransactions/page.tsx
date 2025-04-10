'use client';

import { deleteCustomerTransaction, getAllCustomerTransactions } from "@/services/transactionService";
import { CustomerTransactionType } from "@/types/types";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { ConfirmModal } from "../components/ConfirmModal";
import Navbar from "../components/navbar";

export default function CustomerTransactions() {
    const searchParams = useSearchParams();
    const customerId = searchParams.get('id');

    const [customerTransactions, setCustomerTransactions] = useState<CustomerTransactionType[]>([]);
    const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const router = useRouter();

    const fetchCustomerTransactions = async (customerId: number) => {
        try {
            const data = await getAllCustomerTransactions(customerId);
            setCustomerTransactions(data.data.transactions);
        } catch (error) {
            console.error("Failed to fetch customers:", error);
        }
    };

    useEffect(() => {
        if (customerId) {
            fetchCustomerTransactions(+customerId);
        } else {
            router.push("/")
        }
    }, [customerId, router]);

    const handleConfirmDelete = async () => {
        if (!selectedCustomerId) return;
        try {
            await deleteCustomerTransaction(selectedCustomerId);
            setIsModalOpen(false);
            setSelectedCustomerId(null);
            if (customerId) {
                fetchCustomerTransactions(+customerId);
            }
        } catch (error) {
            console.error("Delete failed:", error);
        }
    };

    const handleDeleteClick = (id: number) => {
        setSelectedCustomerId(id);
        setIsModalOpen(true);
    };

    return (
        <Suspense fallback={<div>Loading...</div>}>
        <div>
            <Navbar />
            <div className="flex justify-between items-center max-w-[800px] mx-auto my-[30px]">
                <h1 className="text-4xl text-gray-800">Entry</h1>
                <button
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-md"
                    onClick={() => router.push(`/transaction?customerId=${customerId}`)}
                >
                    Add Entry
                </button>
            </div>
            <div className="relative overflow-x-auto shadow-md rounded-lg max-w-[800px] mx-auto bg-white border border-1">
                <table className="w-full text-sm text-left text-gray-700 ">
                    <thead className="text-xs uppercase bg-gray-100 text-gray-600">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Date
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Pake
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Start
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Stop
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Total Unit
                            </th>
                            <th scope="col" className="px-6 py-3">
                                rate
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Total
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
                            customerTransactions.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="text-center py-6 text-gray-500">
                                        No Transactions found
                                    </td>
                                </tr>
                            ) : (
                                customerTransactions?.map((item, index) => (
                                    <tr key={item.transactionId} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} border-b border-gray-200`}>
                                        <td className="px-4 py-4 font-medium text-gray-900">{item.date ? new Date(item.date).toLocaleDateString('en-GB') : ''}</td>
                                        <td className="px-4 py-4 font-medium text-gray-900">{item.crop}</td>
                                        <td className="px-4 py-4 font-medium text-gray-900">{item.start}</td>
                                        <td className="px-4 py-4 font-medium text-gray-900">{item.stop}</td>
                                        <td className="px-4 py-4 font-medium text-gray-900">{item.totalUnits}</td>
                                        <td className="px-4 py-4 font-medium text-gray-900">{item.rate}</td>
                                        <td className="px-4 py-4 font-medium text-gray-900">{item.total}</td>
                                        <td className="px-4 py-4 text-blue-600 hover:underline cursor-pointer" onClick={() => router.push(`/transaction?customerId=${customerId}&transactionId=${item.transactionId}`)}>Edit</td>
                                        <td className="px-4 py-4 text-red-500 hover:underline cursor-pointer" onClick={() => handleDeleteClick(item.transactionId)}>Delete</td>
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
                header="Delete transaction"
                text="Are you sure you want to delete this transaction?"
            />
        </div >
        </Suspense>
    )
}