export const validatePeriodFormat = (period) => {
    if (!period || !/^\d{4}-\d{2}$/.test(period)) {
        throw new Error('Invalid period format.');
    }

    const [year, month] = period.split('-').map(Number);
    const start = new Date(Date.UTC(year, month - 1, 1));
    const end = new Date(Date.UTC(year, month, 1));

    return {start, end};
};
