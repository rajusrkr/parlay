import { Chip } from "@heroui/react";
import { useTheme } from "@heroui/use-theme";
import { LogOut, Moon, Sun } from "lucide-react";

export const LogoutAndThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div>
      <Chip as={"div"} size="lg" variant="bordered">
        <div className="flex items-center gap-2">
          <div>
            {
              theme === "light" ? (<Moon onClick={() => setTheme("dark")} size={20} className="select-none text-default-500"/>) : (<Sun onClick={() => setTheme("light")} size={20} className="select-none text-default-500"/>)
            }
          </div>

          <div className="mb-0.5 select-none">
            <Chip size="sm" color="danger" variant="light" radius="sm" className="hover:bg-danger-50 hover:cursor-pointer transition-all">
              <span className="flex items-center gap-1">
                <span className="font-semibold">Logout</span>
                <span>
                  <LogOut size={14} />
                </span>
              </span>
            </Chip>
          </div>
        </div>
      </Chip>
    </div>
  );
};
