import { TransactionForm } from '@/types/types';
import axiosInstance from '@/utils/axiosInstance';

export const createTransaction = async (transactionsData: TransactionForm) => {
    const response = await axiosInstance.post('/createTransaction', transactionsData);
    return response.data;
};

export const getAllCustomerTransactions = async (customerId: number) => {
    const response = await axiosInstance.get(`/transactions/${customerId}`);
    return response.data;
};

export const updateTransaction = async (transactionId: string, data: TransactionForm) => {
    const response = await axiosInstance.put(`/updateTransaction/${transactionId}`, data);
    return response.data;
};

export const getTransactionById = async (customerId: string, transactionId: string) => {
    const response = await axiosInstance.get(`/transactionDetails/${customerId}/${transactionId}`).then(res => res.data);
    return response.data;
};

export const deleteCustomerTransaction = async (id: number) => {
    const response = await axiosInstance.delete(`/deleteTransaction/${id}`).then(res => res.data);
    return response.data;
};
