import { Link } from "react-router";

export default function LandingPage() {
  return (
    <div>
      <h1>landing page soon</h1>

      <div>
        <Link to={"/auth/login"}>
          <span className="underline">Login</span>
        </Link>
      </div>
    </div>
  );
}
