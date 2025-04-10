export interface CustomerTransactionType {
    transactionId: number,
    date: string,
    crop: string,
    start: number,
    stop: number,
    totalUnits: number,
    rate: string,
    total: string
}

export type Customer = {
    customerId: number,
    name: string,
    phone: string,
    isActive: boolean,
    isDelete: false,
    createdAt: string,
    updatedAt: string
}

export interface TransactionForm {
    customerId?: number;
    date: string;
    crop: string;
    start: number | '';
    stop: number | '';
    rate: number | '';
}