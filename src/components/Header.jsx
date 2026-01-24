const Header=()=>{
    return(
        <div className="bg-orange-950 fixed top-0 left-0 z-[999] right-0 h-20 flex items-center justify-center">
           <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
            <div className="">
                <h1 className="font-bold text-white text-5xl"> PS. </h1>  
            </div>
            <div className="">
                <ul className="flex items-center justify-between gap-10 text-white">
                    <li className="cursor-pointer hover:text-yellow-400 font-lato">Home</li>
                    <li className="cursor-pointer hover:text-yellow-400 font-lato">About</li>
                    <li className="cursor-pointer hover:text-yellow-400 font-lato">Skills</li>  
                    <li className="cursor-pointer hover:text-yellow-400 font-lato">Projects</li>
                    <li className="cursor-pointer hover:text-yellow-400 font-lato">Contact</li>
                </ul>
            </div>
             
            </div>
        </div>
    );
};
export default Header 