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
import { Link } from "react-router";
import { RegisterSchema } from "@repo/shared/src"

export default function Signup() {
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const [passwordError, setPasswordError] = useState("");
  const [signupError, setSignupError] = useState("");

  useEffect(() => {
    if (confirmPassword.length !== 0) {
      if (confirmPassword !== password) {
        setPasswordError("Passwords did not match");
      } else {
        setPasswordError("");
      }
    }
  }, [confirmPassword, password]);

  useEffect(() => {
    setSignupError("")
  }, [name, email, password])

  const handleSignup = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validateUserDeatils = RegisterSchema.safeParse({
      email,
      name,
      password,
    });

    if (!validateUserDeatils.success) {
      if (`${validateUserDeatils.error.issues[0].path[0].toString()}` === "name") {
        setSignupError("Name should not be less than 4 characters")
      }
      if (`${validateUserDeatils.error.issues[0].path[0].toString()}` === "password") {
        setSignupError("Password should not be less than 6 characters")
      }
       if (`${validateUserDeatils.error.issues[0].path[0].toString()}` === "email") {
        setSignupError("Invalid email address")
      }
      return;
    }

    // Go for signup
  };

  return (
    <div className="flex justify-center items-center min-h-[90vh] p-4">
      <Card className="max-w-xl w-md p-4">
        <CardHeader>
          <p className="text-2xl">
            Signup to <span className="font-semibold ml-1">Parlay</span>
          </p>
        </CardHeader>
        <CardBody>
          <Form onSubmit={handleSignup}>
            <Input
              isRequired
              type="text"
              placeholder="Enter your name"
              label="Name"
              labelPlacement="outside"
              variant="faded"
              size="lg"
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
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
            <Input
              isRequired
              type={isConfirmPasswordVisible ? "text" : "password"}
              placeholder="Re-type the password"
              label="Confirm password"
              labelPlacement="outside"
              variant="faded"
              size="lg"
              endContent={
                isConfirmPasswordVisible ? (
                  <EyeOff
                    className="hover:cursor-pointer select-none"
                    onClick={() =>
                      setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
                    }
                  />
                ) : (
                  <Eye
                    className="hover:cursor-pointer select-none"
                    onClick={() =>
                      setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
                    }
                  />
                )
              }
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <div>
              <p className="text-danger text-sm font-semibold">
                {passwordError.length !== 0 && passwordError}
              </p>
          <p className="text-danger text-sm font-semibold">
                {signupError.length !== 0 && signupError}
              </p>
            </div>
            <Button type="submit" color="primary" className="w-full" size="lg">
              Signup
            </Button>
          </Form>
        </CardBody>
        <CardFooter className="flex justify-center">
          <p>
            Already have account?{" "}
            <span>
              <Link to={"/auth/login"}>
                <Chip
                  as={"span"}
                  color="default"
                  variant="light"
                  className="hover:bg-default-100 transition-all"
                  radius="sm"
                >
                  <span className="text-primary font-semibold">Login</span>
                </Chip>
              </Link>
            </span>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
