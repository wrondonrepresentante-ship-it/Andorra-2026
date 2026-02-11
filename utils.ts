
export const copyToClipboard = (text: string, callback?: () => void) => {
  navigator.clipboard.writeText(text).then(() => {
    if (callback) callback();
  });
};

export const formatCurrency = (val: string, currency: string) => {
  const symbol = currency === 'EUR' ? '€' : 'R$';
  return `${symbol} ${val}`;
};
