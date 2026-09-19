import Loading from "@/components/Loading";
import axios from "axios";
import { useEffect, useState } from "react";
import { TbCaretDownFilled, TbCaretUpFilled } from "react-icons/tb";

type DataType = {
  btc: any;
  eth: any;
  sol: any;
};

const CryptocurrencyPrice = () => {
  const [data, setData] = useState<DataType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDisabled, setDisabled] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const newData: any = await getCoins();

      if (newData === null) {
        setDisabled(true);
      } else {
        setData(newData);
      }
      setIsLoading(false);
    };

    fetchData();
  }, []);

  if (isDisabled) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-30">
        <Loading />
      </div>
    );
  }

  const CryptoCard = ({
    coin,
    name,
    icon
  }: {
    coin: any;
    name: string;
    icon: string;
  }) => {
    const isPositive = coin.delta.month > 1;
    const changePercent = Math.abs((coin.delta.month - 1) * 100);

    return (
      <div className="flex items-center gap-3 py-2 transition-all duration-200 hover:scale-[1.01]">
        <div className="relative">
          <img
            src={icon}
            alt={name}
            className="w-8 h-8 rounded-full"
          />
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-neutral-800 dark:text-neutral-200">
              {name}
            </span>
            <span className="text-base font-bold text-neutral-800 dark:text-neutral-200">
              ${coin.rate.toFixed(2)}
            </span>
          </div>

          <div className={`flex items-center text-sm font-medium mt-1 ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
            {isPositive ? (
              <TbCaretUpFilled className="mr-1" />
            ) : (
              <TbCaretDownFilled className="mr-1" />
            )}
            {changePercent.toFixed(2)}%
            <span className="ml-1 text-xs text-neutral-500 dark:text-neutral-400">
              (30d)
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-3">
      <div className="mb-3">
        <h3 className="text-base font-semibold text-neutral-800 dark:text-neutral-200 mb-1">
          Cryptocurrency Prices
        </h3>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Real-time USD market data
        </p>
      </div>

      <div className="space-y-2">
        {data && (
          <>
            <CryptoCard
              coin={data.btc}
              name="Bitcoin"
              icon="/img/cryptocurrency/bitcoin.png"
            />
            <CryptoCard
              coin={data.eth}
              name="Ethereum"
              icon="/img/cryptocurrency/etherium.png"
            />
            <CryptoCard
              coin={data.sol}
              name="Solana"
              icon="/img/cryptocurrency/solana.png"
            />
          </>
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-700">
        <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center">
          Data provided by LiveCoinWatch
        </p>
      </div>
    </div>
  );
};

async function getCoins() {
  try {
    const res = await axios.post("https://api.livecoinwatch.com/coins/list", {
      currency: "USD",
      sort: "rank",
      order: "ascending",
      offset: 0,
      limit: 10,
      meta: false
    }, {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": import.meta.env.VITE_LIVECOINWATCH_API_KEY,
      }
    });
    return {
      btc: res.data.find((currency: any) => currency.code === "BTC"),
      eth: res.data.find((currency: any) => currency.code === "ETH"),
      sol: res.data.find((currency: any) => currency.code === "SOL"),
    };
  } catch (error) {
    console.error(error)
    return null
  }
}

export default CryptocurrencyPrice;
