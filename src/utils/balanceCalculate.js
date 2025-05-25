export const calculateBalance = (balance, transactionAmount, type) => {
    if (type === 'income') {
        const newBalance = balance + transactionAmount;
        return {
            balance: newBalance,
        };
    }
    const newBalance = balance - transactionAmount;

    return {
        balance: newBalance,
    };
};
