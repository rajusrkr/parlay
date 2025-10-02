import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Chip,
} from "@heroui/react";
import { Coins } from "lucide-react";
import { Link, useLocation } from "react-router";
import { LogoutAndThemeSwitcher } from "./LogoutAndThemeSwitcher";

export default function MarketNavbar() {
  const url = useLocation();

  const navbarItemsAndUrls = [
    { title: "Markets", url: "/admin/console" },
    { title: "Leaderboard", url: "/admin/leaderboard" },
    { title: "Add new market", url: "/admin/add-new-market" },
  ];

  return (
    <Navbar isBordered className="justify-center" maxWidth="full">
      <div className="w-full max-w-7xl mx-auto">
        <NavbarContent>
          <NavbarBrand>
            <Link to="/">
              <div className="flex items-center gap-1">
                <Coins />
                <p className="font-bold text-inherit">
                  Parlay{" "}
                  <Chip as={"span"} variant="solid" color="secondary">
                    <span className="font-bold">Admin</span>
                  </Chip>
                </p>
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
                      className={`${url.pathname === items.url && "text-secondary font-semibold"}`}
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
              <LogoutAndThemeSwitcher />
            </NavbarItem>
          </NavbarContent>
        </NavbarContent>
      </div>
    </Navbar>
  );
}
