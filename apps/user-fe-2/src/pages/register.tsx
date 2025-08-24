import { Button, Card, Input } from "@heroui/react";
import { LogIn } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router";

interface Register {
  name: string;
  email: string;
  password: string;
}

export default function Register() {
  const [registerData, setRegisterData] = useState<Register>({
    email: "",
    name: "",
    password: "",
  });

  console.log(registerData);

  const handleRegistration = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const sendReq = await fetch(
        "http://localhost:8000/api/v0/user/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(registerData),
        }
      );

      const res = await sendReq.json();

      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[90vh]">
      <Card className="w-lg h-[580px] flex justify-center items-center">
        <div className="flex flex-col justify-center items-center space-y-2">
          <h2 className="text-3xl font-semibold">
            PredictX{" "}
            <span className="bg-black text-white px-2 rounded-xl pb-0.5">
              User
            </span>
          </h2>
          <p className="flex text-lg items-center">
            Register <LogIn />
          </p>
        </div>

        <form onSubmit={handleRegistration} className="space-y-3 w-full px-14">
          <div>
            <div>
              <label htmlFor="Market settlement">
                <span className="text-sm font-semibold text-gray-500">
                  Enter your name
                </span>
              </label>
            </div>
            <Input
              type="text"
              placeholder="Enter name"
              label="Name"
              name="name"
              labelPlacement="inside"
              variant="bordered"
              required
              className=""
              onChange={(e) => {
                setRegisterData({
                  ...registerData,
                  [e.target.name]: e.target.value,
                });
              }}
            />
          </div>

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
              name="email"
              labelPlacement="inside"
              variant="bordered"
              required
              className=""
              onChange={(e) => {
                setRegisterData({
                  ...registerData,
                  [e.target.name]: e.target.value,
                });
              }}
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
              name="password"
              labelPlacement="inside"
              variant="bordered"
              required
              className=""
              onChange={(e) => {
                setRegisterData({
                  ...registerData,
                  [e.target.name]: e.target.value,
                });
              }}
            />
          </div>

          <div className="">
            <Button className="w-full" color="primary" type="submit">
              Register
            </Button>
          </div>

          <div className="flex justify-center">
            <Link
              to={"/auth/login"}
              className="text-blue-600 underline underline-offset-2 font-semibold"
            >
              Login
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
