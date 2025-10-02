import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Form,
  Input,
} from "@heroui/react";
import { useState } from "react";
import { useAdminStore } from "../store/adminStore";
import { useNavigate } from "react-router";

export default function Login() {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const { login } = useAdminStore();

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await login({ email, password, navigate });
  };

  return (
    <div className="flex items-center min-h-[90vh]">
      <Card className="max-w-xl w-96 px-2 py-6 mx-auto">
        <CardHeader>
          <div className="text-xl font-semibold flex items-center gap-1">
            <span className="text-default-700">Login to</span>{" "}
            <Chip variant="solid" color="secondary">
              <span className="font-bold">Parlay admin</span>
            </Chip>
          </div>
        </CardHeader>
        <CardBody>
          <Form
          onSubmit={handleLogin}
          >
            <Input
              isRequired
              type="email"
              placeholder="Enter your email"
              label="Email"
              labelPlacement="outside"
              variant="faded"
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              isRequired
              type="password"
              placeholder="Enter your password"
              label="Password"
              labelPlacement="outside"
              variant="faded"
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" color="secondary" className="w-full mt-2">
              <span className="font-semibold">Login</span>
            </Button>
          </Form>
        </CardBody>
      </Card>
    </div>
  );
}
