import axiosInstance from '@/utils/axiosInstance';

export const createCustomer = async (customerData: { name: string; phone: string }) => {
    const response = await axiosInstance.post('/createCustomer', customerData);
    return response.data;
};

export const getAllCustomers = async () => {
    const response = await axiosInstance.get('/getCustomers');
    return response.data;
};

export const updateCustomer = async (id: string, data: { name: string; phone: string }) => {
    const response = await axiosInstance.put(`/customer/${id}`, data);
    return response.data;
};

export const getCustomerById = async (id: string) => {
    const response = await axiosInstance.get(`/getCustomerDetails/${id}`).then(res => res.data);
    return response.data;
};

export const deleteCustomer = async (id: number) => {
    const response = await axiosInstance.delete(`/customer/${id}`).then(res => res.data);
    return response.data;
};
