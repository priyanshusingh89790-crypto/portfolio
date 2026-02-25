import { Link, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../utils/constant";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const response = await axios.post(`${BACKEND_URL}/register`, {
        name,
        email,
        password,
      });

      if (response.data.success) {

        localStorage.setItem("token", response.data.token);

        localStorage.setItem("user", JSON.stringify(response.data.user));

        alert("Registered successfully");

        navigate("/dashboard");

      } else {
        alert(response.data.message);
      }

    } catch (error) {
      alert("Registration failed");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg w-[400px] shadow-2xl border border-gray-300">
        <h1 className="text-4xl font-bold text-orange-600">Register</h1>

        <form
          className="flex flex-col gap-4 mt-8"
          onSubmit={handleRegister}
        >
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="border border-gray-300 focus:outline-none focus:border-orange-600 h-12 rounded-md p-2"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="border border-gray-300 focus:outline-none focus:border-orange-600 h-12 rounded-md p-2"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="border border-gray-300 focus:outline-none focus:border-orange-600 h-12 rounded-md p-2"
          />

          <button className="bg-orange-500 text-white py-2 rounded-md">
            Register
          </button>
        </form>

        <p className="text-center mt-4">
          Already have an account?
          <Link to="/" className="text-orange-500 ml-1">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;