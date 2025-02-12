interface CategoryType {
  name: string;
  price: number;
}

export function getLowestPrice(tickets: CategoryType[]): number | null {
  if (!tickets || tickets.length === 0) return null;

  console.log(tickets);

  const prices = tickets.reduce((acc: number[], ticket) => {
    const category = ticket as unknown as CategoryType;
    if (category && category.price) {
      acc.push(Number(category.price));
    }
    return acc;
  }, []);

  console.log(prices);

  return prices.length > 0 ? Math.min(...prices) : null;
}
