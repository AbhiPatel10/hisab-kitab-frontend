"use client"

import { createCustomer, getCustomerById, updateCustomer } from '@/services/customerService';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import Navbar from '../components/navbar';

const AddCustomer = () => {
    const searchParams = useSearchParams();
    const customerId = searchParams.get('id');

    const [form, setForm] = useState({ name: '', phone: '' });
    const [errors, setErrors] = useState({ name: '', phone: '' });
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    useEffect(() => {
        const fetchCustomer = async () => {
            if (customerId) {
                try {
                    console.log("customerId", customerId);
                    const data = await getCustomerById(customerId);
                    setForm({
                        name: data.customerDetails.name,
                        phone: data.customerDetails.phone
                    });
                } catch {
                    toast.error('Failed to load customer');
                }
            }
        };
        fetchCustomer();
    }, [customerId]);

    const validate = () => {
        const newErrors = { name: '', phone: '' };
        let isValid = true;

        if (!form.name.trim()) {
            newErrors.name = 'Customer name is required';
            isValid = false;
        }

        if (!form.phone.trim()) {
            newErrors.phone = 'Phone number is required';
            isValid = false;
        } else if (!/^[6-9]\d{9}$/.test(form.phone)) {
            newErrors.phone = 'Enter a valid 10-digit phone number';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);

        try {
            if (customerId) {
                await updateCustomer(customerId, form);
                toast.success('Customer updated successfully!');
            } else {
                await createCustomer(form);
                toast.success('Customer created successfully!');
            }

            setTimeout(() => {
                router.push('/');
            }, 200);
            setForm({ name: '', phone: '' }); // Reset form
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Failed to create customer');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="flex justify-center items-center max-w-[700px] mx-auto my-[30px]">
                <h1 className="text-4xl text-gray-800">{customerId ? 'Edit Customer' : 'Add Customer'}</h1>
            </div>

            <form className="max-w-sm mx-auto" onSubmit={handleSubmit}>
                <div className="mb-5">
                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">Customer Name</label>
                    <input
                        type="text"
                        id="name"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                        placeholder="Enter Customer Name"
                        required
                        value={form.name}
                        onChange={handleChange}
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>
                <div className="mb-5">
                    <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900">Customer Phone No.</label>
                    <input
                        type="text"
                        id="phone"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        placeholder="Enter customer phone number"
                        required
                        value={form.phone}
                        onChange={(e) => {
                            const onlyDigits = e.target.value.replace(/\D/g, ''); // remove non-digits
                            
                            if (onlyDigits.length <= 10) {
                                if(onlyDigits){
                                    handleChange(e);
                                }
                            }
                        }}
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>
                <button
                    type="submit"
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                >
                    {loading ? 'Saving...' : (customerId ? 'Update' : 'Submit')}
                </button>
            </form>
        </div>
    )
}

export default AddCustomer