import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

export default function Home() {
  const redirect = useNavigate();

  return (
    <div>
      <Button>Login</Button>
      <Button onClick={() => redirect("/market")}>Open Markets</Button>
    </div>
  );
}
