import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Chip,
} from "@heroui/react";
import { Coins } from "lucide-react";
import { Link } from "react-router";

export default function HomeNavbar() {
  return (
    <Navbar shouldHideOnScroll isBordered>
      <NavbarBrand>
        <Link to="/">
          <div className="flex items-center gap-1">
            <Coins />
            <p className="font-bold text-inherit">Parlay</p>
          </div>
        </Link>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link color="foreground" to={"/"}>
            Features
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link aria-current="page" to={"/"}>
            Customers
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" to={"/"}>
            Integrations
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <Link to={"/auth/signup"}>
            <Chip color="default" variant="light" className="hover:bg-default-100 transition-all" radius="sm">
              <span className="text-primary"> Sign Up</span>
            </Chip>
          </Link>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
