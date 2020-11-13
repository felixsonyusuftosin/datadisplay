const formatter = new Intl.NumberFormat('en-US')

export const formatCurrency = (amount: number) => formatter.format(+amount)
export const formatCurrency$ = (amount: number, currency: string) => new Intl.NumberFormat('en-GB', { style: 'currency', currency }).format(!isNaN(+amount) ? amount : 0)