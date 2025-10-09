import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Form,
  Input,
} from "@heroui/react";
import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { LoginSchema } from "@repo/shared/src";
import { useUserStore } from "../store/userStore";

export default function Login() {
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const [signupError, setSignupError] = useState("");
  const navigate = useNavigate();

  const { login, isError, isLoading, errorMessage } = useUserStore();

  useEffect(() => {
    setSignupError("");
  }, [email, password]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validateUserDeatils = LoginSchema.safeParse({
      email,
      password,
    });

    if (!validateUserDeatils.success) {
      if (
        `${validateUserDeatils.error.issues[0].path[0].toString()}` ===
        "password"
      ) {
        setSignupError("Password should not be less than 6 characters");
      }
      if (
        `${validateUserDeatils.error.issues[0].path[0].toString()}` === "email"
      ) {
        setSignupError("Invalid email address");
      }
      return;
    }

    // Go for login
    await login({
      email: validateUserDeatils.data.email,
      password: validateUserDeatils.data.password,
      navigate,
    });
  };

  return (
    <div className="flex justify-center items-center min-h-[90vh] p-4">
      <Card className="max-w-xl w-md p-4">
        <CardHeader>
          <p className="text-2xl">
            Login to <span className="font-semibold ml-1">Parlay</span>
          </p>
        </CardHeader>
        <CardBody>
          <Form onSubmit={handleLogin}>
            <Input
              isRequired
              type="email"
              placeholder="Enter your email"
              label="Email"
              labelPlacement="outside"
              variant="faded"
              size="lg"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <Input
              isRequired
              type={isPasswordVisible ? "text" : "password"}
              placeholder="Create password"
              label="Password"
              labelPlacement="outside"
              variant="faded"
              size="lg"
              endContent={
                isPasswordVisible ? (
                  <EyeOff
                    className="hover:cursor-pointer select-none"
                    onClick={() => setPasswordVisible(!isPasswordVisible)}
                  />
                ) : (
                  <Eye
                    className="hover:cursor-pointer select-none"
                    onClick={() => setPasswordVisible(!isPasswordVisible)}
                  />
                )
              }
              onChange={(e) => setPassword(e.target.value)}
            />

            <div>
              <p className="text-danger text-sm font-semibold">
                {signupError.length !== 0 && signupError}
              </p>
              <p className="text-danger text-sm font-semibold">
                {isError && errorMessage}
              </p>
            </div>
            <Button type="submit" color="primary" className="w-full" size="lg" isDisabled = {isLoading}>
              Signup
            </Button>
          </Form>
        </CardBody>
        <CardFooter className="flex justify-center">
          <p>
            New to Parlay?{" "}
            <span>
              <Link to={"/auth/signup"}>
                <Chip
                  as={"span"}
                  color="default"
                  variant="light"
                  className="hover:bg-default-100 transition-all"
                  radius="sm"
                >
                  <span className="text-primary font-semibold">
                    Create account
                  </span>
                </Chip>
              </Link>
            </span>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
