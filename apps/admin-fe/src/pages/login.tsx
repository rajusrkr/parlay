import {
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";
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
    <div className="flex flex-col justify-center items-center min-h-[90vh]">
      <div className="mb-3">
        <h2 className="text-4xl">
          PredicX{" "}
          <span className="border px-1 py-1 rounded bg-black text-white">
            admin
          </span>
        </h2>
      </div>

      <Card sx={{ width: 400 }}>
        <CardContent>
          <Typography gutterBottom variant="h3" component={"div"}>
            Login
          </Typography>

          <form onSubmit={handleRegistration}>
            <div className="flex flex-col space-y-3 pt-3">
              <label htmlFor="emai;">Email</label>
              <TextField
                type="email"
                label="Enter your email"
                size="small"
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="flex flex-col space-y-3 pt-3">
              <label htmlFor="password">Email</label>
              <TextField
                type="password"
                label="Enter your password"
                size="small"
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex justify-center pt-3">
              <Button
                type="submit"
                variant="contained"
                className="w-full"
                style={{ backgroundColor: "black" }}
              >
                Login
              </Button>
            </div>
          </form>

          <div className="flex justify-center pt-3">
            <Link to={"/auth/register"} className="text-blue-600 underline">
              Register
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
