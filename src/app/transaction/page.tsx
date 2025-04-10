'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { createTransaction, getTransactionById, updateTransaction } from '@/services/transactionService';
import { TransactionForm } from '@/types/types';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Navbar from '../components/navbar';

export default function Transaction() {
    const searchParams = useSearchParams();
    const transactionId = searchParams.get('transactionId');
    const customerId = searchParams.get('customerId') ?? 0;
    const router = useRouter();

    const [form, setForm] = useState<TransactionForm>({
        date: '',
        crop: '',
        start: '',
        stop: '',
        rate: ''
    });

    const [errors, setErrors] = useState<Partial<Record<keyof TransactionForm, string>>>({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchTransaction = async () => {
            if (!customerId) {
                router.push("/")
            }
            if (transactionId && customerId) {
                try {
                    const data = await getTransactionById(customerId, transactionId);
                    setForm({
                        date: data.transactions.date,
                        crop: data.transactions.crop,
                        start: data.transactions.start,
                        stop: data.transactions.stop,
                        rate: data.transactions.rate
                    });
                } catch {
                    toast.error('Failed to load transaction');
                }
            }
        };
        fetchTransaction();
    }, [customerId, transactionId]);

    const validate = () => {
        const newErrors: Partial<Record<keyof TransactionForm, string>> = {};
        let isValid = true;

        if (!form.date.trim()) {
            newErrors.date = 'Date is required';
            isValid = false;
        }
        if (!form.crop.trim()) {
            newErrors.crop = 'Crop is required';
            isValid = false;
        }
        if (form.start === '') {
            newErrors.start = 'Start value is required';
            isValid = false;
        }
        if (form.stop === '') {
            newErrors.stop = 'Stop value is required';
            isValid = false;
        }
        else if (form.start !== '' && Number(form.stop) <= Number(form.start)) {
            newErrors.stop = 'Stop must be greater than start';
            isValid = false;
        }
        if (form.rate === '') {
            newErrors.rate = 'Rate is required';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;

        setForm(prev => ({
            ...prev,
            [id]: ['start', 'stop', 'rate', 'customerId'].includes(id)
                ? value === '' ? '' : Number(value)
                : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);

        try {
            if (transactionId) {
                await updateTransaction(transactionId, form);
                toast.success('Transaction updated successfully!');
            } else {
                await createTransaction({ customerId: +customerId, ...form });
                toast.success('Transaction created successfully!');
            }
            setTimeout(() => {
                router.back();
            }, 200);
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Failed to save transaction');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="flex justify-center items-center max-w-[700px] mx-auto my-[30px]">
                <h1 className="text-4xl text-gray-800">{transactionId ? 'Edit Entry' : 'Add Entry'}</h1>
            </div>

            <form className="max-w-sm mx-auto" onSubmit={handleSubmit}>
                {['start', 'stop', 'rate'].map((field) => (
                    <div key={field} className="mb-5">
                        <label htmlFor={field} className="block mb-2 text-sm font-medium text-gray-900">
                            {field.charAt(0).toUpperCase() + field.slice(1)}
                        </label>
                        <input
                            type="number"
                            id={field}
                            value={form[field as keyof TransactionForm] ?? ''}
                            onChange={handleChange}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            placeholder={`Enter ${field}`}
                        />
                        {errors[field as keyof TransactionForm] && (
                            <p className="text-red-500 text-sm mt-1">{errors[field as keyof TransactionForm]}</p>
                        )}
                    </div>
                ))}

                <div className="mb-5">
                    <label htmlFor="date" className="block mb-2 text-sm font-medium text-gray-900">Date</label>
                    <DatePicker
                        selected={form.date ? new Date(form.date) : null}
                        onChange={(date: Date | null) => {
                            setForm(prev => ({
                                ...prev,
                                date: date ? date.toISOString() : ''
                            }));
                        }}
                        dateFormat="dd/MM/yyyy"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        placeholderText="Select a date"
                    />
                    {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
                </div>

                <div className="mb-5">
                    <label htmlFor="crop" className="block mb-2 text-sm font-medium text-gray-900">Crop</label>
                    <input
                        type="text"
                        id="crop"
                        value={form.crop}
                        onChange={handleChange}
                        placeholder="Enter crop"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    />
                    {errors.crop && <p className="text-red-500 text-sm mt-1">{errors.crop}</p>}
                </div>

                <button
                    type="submit"
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                >
                    {loading ? 'Saving...' : (transactionId ? 'Update' : 'Submit')}
                </button>
            </form>
        </div>
    );
}
