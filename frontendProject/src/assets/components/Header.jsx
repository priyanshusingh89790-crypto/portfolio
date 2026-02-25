const Header=()=>{
    const user = JSON.parse(localStorage.getItem("user"));
    const handleLogout =()=>{
       localStorage.removeItem("token");
       localStorage.removeItem("user");
       window.location.href = "/";
    }
    return(
    <div className="bg-orange-500 text-white px-4 py-2 w-full justify-between h-16 shadow-2xl flex shadow-orange-500/50">
         <h1 className="text-2xl font-bold p-2">Task Management</h1>
         <h2 className="text-md p-2 flex-col items-center justify-center flex">{user?.email}
            <button onClick={handleLogout} className="bg-white text-orange-500 px-2 rounded-md text-[14px] w-fit">Logout</button>
         </h2>
    </div>
    )
};
export default Header;