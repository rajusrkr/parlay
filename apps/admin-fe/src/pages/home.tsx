import { Spinner } from "@heroui/react";
import { useEffect } from "react";
import { useNavigate } from "react-router";

const Home = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/market/open");
  }, []);
  return (
    <div className="flex justify-center items-center min-h-96">
      <Spinner />
    </div>
  );
};

export default Home;
