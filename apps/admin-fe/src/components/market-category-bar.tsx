import { Link, useLocation } from "react-router";

export default function MarketCategoryBar() {
  const MarketCategoryAndURL = [
    { name: "Open", url: "/market/open" },
    { name: "Will open", url: "/market/will-open" },
    { name: "Settled", url: "/market/settled" },
    { name: "Cancelled", url: "/market/cancelled" },
    { name: "Create market", url: "/market/create" },
  ];

  const currentUrl = useLocation().pathname
  
  return (
    <div className="px-10">
      <div className="flex justify-center mt-12 gap-4 border-b-1 pb-0.5 bg-gray-300 rounded-t-lg h-10 items-center shadow">
        {MarketCategoryAndURL.map((mrkt, i) => (
          <Link to={mrkt.url} key={i}>
            <span className={`hover:bg-white text-lg font-semibold rounded-lg px-3 flex items-center border ${mrkt.name === "Create market" && "bg-green-300"} ${currentUrl === mrkt.url  && "bg-white"}`}>
              {mrkt.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
