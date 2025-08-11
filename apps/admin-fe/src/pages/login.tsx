import { Button, Card, Input } from "@heroui/react";
import { LogIn } from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleRegistration = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const sendReq = await fetch(
        "http://localhost:8000/api/v0/admin/auth/login",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const res = await sendReq.json();

      if (res.success) {
        navigate("/");
      } else {
        console.log(res);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[90vh]">
      <Card className="w-96 h-96 flex justify-center items-center">
        <div className="flex flex-col justify-center items-center">
          <h2 className="text-3xl font-semibold">
            PredictX{" "}
            <span className="bg-black text-white px-2 rounded-xl pb-0.5">
              admin
            </span>
          </h2>
          <p className="flex text-lg items-center">
            Login <LogIn />
          </p>
        </div>

        <form onSubmit={handleRegistration} className="space-y-3">
          <div>
            <div>
              <label htmlFor="Market settlement">
                <span className="text-sm font-semibold text-gray-500">
                  Enter your email
                </span>
              </label>
            </div>
            <Input
              type="email"
              placeholder="Enter email"
              label="Email"
              labelPlacement="inside"
              variant="bordered"
              required
              className="w-80"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <div>
              <label htmlFor="Market settlement">
                <span className="text-sm font-semibold text-gray-500">
                  Enter your password
                </span>
              </label>
            </div>
            <Input
              type="password"
              placeholder="Enter password"
              label="Password"
              labelPlacement="inside"
              variant="bordered"
              required
              className="w-80"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <Button className="w-80" color="primary" type="submit">
              Login
            </Button>
          </div>

          <div className="flex justify-center">
            <Link
              to={"/auth/register"}
              className="text-blue-600 underline underline-offset-2 font-semibold"
            >
              Register
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
