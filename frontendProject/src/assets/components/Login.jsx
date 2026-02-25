import { Link } from "react-router-dom";
import {useNavigate} from "react-router-dom";
const Login = () => {
    const navigate = useNavigate();
    return (
        <div className="h-screen flex items-center justify-center border border-gray-300">
            <div className="bg-white p-8 rounded-lg w-[400px] h-auto shadow-2xl border border-gray-300">
                <h1 className="text-4xl font-bold text-orange-600">
                    Login
                </h1>
                <form className="flex flex-col justify-between mt-10 h-[250px]">
                    <input type="text" placeholder="Username" className="border border-gray-300 focus:outline-none focus:border-orange-600 h-12 rounded-md p-2" />
                    <input type="password" placeholder="Password" className="border border-gray-300 focus:outline-none focus:border-orange-600 h-12 rounded-md p-2" />
                    <button onClick={() => navigate("/dashboard")} type="submit" className="bg-orange-500 text-white px-4 py-2 rounded-md">Login</button>
                </form>
                <p className="text-center mt-4">Don't have an account? <Link to="/register" className="text-orange-500">Register</Link></p>
            </div>
        </div>
    );
};

export default Login;   