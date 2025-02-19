import { motion } from "framer-motion";

interface ShoppingItem {
  title: string;
  source: string;
  link: string;
  price: string;
  delivery: string;
  imageUrl: string;
  rating?: number;
  ratingCount?: number;
  offers?: string;
  productId?: string;
  position: number;
}

interface ShoppingProps {
  shoppingData?: {
    searchParameters?: {
      q: string;
      type: string;
      engine: string;
    };
    organic: ShoppingItem[];
  };
}

export const Shopping = ({ shoppingData }: ShoppingProps) => {
  if (!shoppingData) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex flex-col gap-3">
            <div className="w-full h-48 bg-zinc-200 dark:bg-zinc-800 rounded" />
            <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4" />
            <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2" />
            <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-1/4" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {shoppingData.organic.map((item, index) => (
        <a
          key={index}
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col gap-3 p-4 rounded-lg bg-zinc-100/80 dark:bg-zinc-800/30 transition-all duration-200"
        >
          {item.imageUrl && (
            <div className="relative w-full h-48 overflow-hidden rounded-lg">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-contain transition-transform duration-200 group-hover:scale-105"
              />
            </div>
          )}
          <h3 className="font-medium text-sm line-clamp-2">{item.title}</h3>
          <div className="flex flex-col gap-1">
            <span className="text-lg font-semibold text-zinc-900 dark:text-white">
              {item.price}
            </span>
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              {item.source}
            </span>
          </div>
          {item.rating && (
            <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-sm ${
                      i < Math.floor(item.rating!) 
                      ? 'text-yellow-400'
                      : 'text-zinc-300 dark:text-zinc-600'
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              {item.ratingCount && (
                <span>({item.ratingCount})</span>
              )}
            </div>
          )}
          {item.offers && (
            <span className="text-xs text-zinc-500 dark:text-zinc-500">
              {item.offers} offers available
            </span>
          )}
        </a>
      ))}
    </div>
  );
};
