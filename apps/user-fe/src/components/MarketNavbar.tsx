import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Chip,
} from "@heroui/react";
import { Coins } from "lucide-react";
import { Link, useLocation } from "react-router";
import { ThemeSwitcher } from "./ThemeSwitcher";

export default function MarketNavbar() {
  const url = useLocation();

  const navbarItemsAndUrls = [
    { title: "Market", url: "/market" },
    { title: "Positions", url: "/positions" },
    { title: "Orders", url: "/orders" },
  ];

  return (
    <Navbar isBordered className="justify-center" maxWidth="full">
      <div className="w-full max-w-7xl mx-auto">
        <NavbarContent>
          <NavbarBrand>
            <Link to="/">
              <div className="flex items-center gap-1">
                <Coins />
                <p className="font-bold text-inherit">Parlay</p>
              </div>
            </Link>
          </NavbarBrand>
          <NavbarContent className="hidden sm:flex gap-4 grow justify-center">
            {navbarItemsAndUrls.map((items, i) => (
              <NavbarItem key={i}>
                <Link aria-current="page" to={items.url}>
                  <Chip
                    color="default"
                    variant={url.pathname === items.url ? "flat" : "light"}
                    radius="sm"
                    size="lg"
                  >
                    <span
                      className={`${url.pathname === items.url && "text-primary font-semibold"}`}
                    >
                      {items.title}
                    </span>
                  </Chip>
                </Link>
              </NavbarItem>
            ))}
          </NavbarContent>
          <NavbarContent justify="end">
            <NavbarItem>
              {/* <Link to={"/auth/signup"}>
            <Chip
              color="default"
              variant="light"
              className="hover:bg-default-100 transition-all"
              radius="sm"
            >
              <span className="text-primary"> Sign Up</span>
            </Chip>
          </Link> */}

              <ThemeSwitcher />
            </NavbarItem>
          </NavbarContent>
        </NavbarContent>
      </div>
    </Navbar>
  );
}
