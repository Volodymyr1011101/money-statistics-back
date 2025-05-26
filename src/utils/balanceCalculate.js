export const calculateBalance = (balance, transactionAmount, type) => {
    if (type === 'income') {
        const newBalance = Number(balance) + Number(transactionAmount);
        return {
            balance: newBalance,
        };
    }
    const newBalance = Number(balance) - Number(transactionAmount);

    return {
        balance: newBalance,
    };
};
