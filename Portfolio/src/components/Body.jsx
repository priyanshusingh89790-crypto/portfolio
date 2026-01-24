import { Github, Linkedin, Mail, ChevronDown } from "lucide-react";
const Body = () => {
  return (
    <div className="flex flex-row max-w-7xl mx-auto items-center min-h-screen justify-between">
      <div className="w-[50%] flex flex-col gap-5">
        <h1 className=" text-3xl text-gray-600 font-lato font-semibold">
          Hi, I’m Priyanshu{" "}
        </h1>
        <p className="text-7xl font-bold"> Frontend </p>{" "}
        <b className="text-yellow-700 text-right text-7xl">Developer</b>
        <p className="text-xl font-lato text-gray-600">
          {" "}
          Building modern and responsive web interfaces
        </p>
        <p className="text-xl font-lato text-gray-600">
          I specialize in React, CSS, and creating clean, user-friendly
          websites. Currently exploring new projects and open for opportunities.
        </p>
        <div className="flex gap-5">
          <div className="bg-yellow-600/50 cursor-pointer hover:bg-yellow-600 hover:scale-110 transition-all hover:text-white p-2 rounded-full ">
            <Github />
          </div>
          <div className="bg-yellow-600/50 cursor-pointer hover:bg-yellow-600 hover:scale-110 transition-all hover:text-white p-2 rounded-full ">
            <Linkedin />
          </div>
          <div className="bg-yellow-600/50 cursor-pointer hover:bg-yellow-600 hover:scale-110 transition-all hover:text-white p-2 rounded-full ">
            <Mail />
          </div>
        </div>
        <button className="bg-yellow-700 text-white px-5 py-2 rounded-full font-lato font-semibold hover:bg-yellow-600 transition-all">
         Let’s Work Together
        </button>
        <div className=" absolute bottom-12 text-yellow-700 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"> 
        <h1 className="font-lato text-center">Scroll down</h1>
            <ChevronDown/>
        
        </div>
      </div>
      <div className="">
        <img
          src="mypic.jpg"
          alt="my picture"
          className="w-[500px] h-[500px] rounded-2xl object-cover"
        />
      </div>
    </div>
  );
};

export default Body;
