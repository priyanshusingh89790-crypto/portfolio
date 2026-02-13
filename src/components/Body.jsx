import { Github, Linkedin, Mail,Download, Mouse } from "lucide-react";
import usescroll from "./hooks/usescroll";
const Body = () => {
  const showArrow = usescroll();
  return (
    <div id="home" className="flex lg:flex-row flex-col max-w-7xl mx-auto pt-32 lg:pt-0 md:pt-0 items-center min-h-screen justify-between p-5">
      <div className="lg:w-[50%] w-full  flex flex-col gap-5">
        <h1 className=" lg:text-3xl text-[22px] text-gray-600 font-lato font-semibold">
          Hi, I’m Priyanshu{" "}
        </h1>
        <p className="lg:text-7xl text-4xl pl-5 md:pl-0 lg:pl-0 font-bold"> Frontend </p>{" "}
        <b className="text-yellow-700 text-right lg:text-7xl pr-5 md:pr-0 lg:pr-0 text-4xl">Developer</b>
        <p className="lg:text-xl text-[16px] lg:pt-4 font-lato text-gray-600">
          {" "}
          Building modern and responsive web interfaces
        </p>
        <p className="lg:text-xl text-[16px] font-lato text-gray-600">
          I specialize in React, CSS, and creating clean, user-friendly
          websites. Currently exploring new projects and open for opportunities.
        </p>
        <div className="flex lg:pt-5 gap-5">
          <a href="https://github.com/priyanshusingh89790-crypto" className="bg-yellow-600/50 cursor-pointer hover:bg-yellow-600 hover:scale-110 transition-all hover:text-white p-3 rounded-full ">
            <Github />
          </a>
          <a href="https://www.linkedin.com/in/priyanshu-singh-668b53328/" className="bg-yellow-600/50 cursor-pointer hover:bg-yellow-600 hover:scale-110 transition-all hover:text-white p-3 rounded-full ">
            <Linkedin />
          </a>
          <a href="https://mail.google.com/mail/?view=cm&fs=1&to=priyanshuvwork@gmail.com" 
          target="_blank"
          className="bg-yellow-600/50 cursor-pointer hover:bg-yellow-600 hover:scale-110 transition-all hover:text-white p-3 rounded-full ">
            <Mail />
          </a>
        </div>
        <div className="flex gap-5 lg:w-full lg:pt-5 justify-center items-center">
        <a href="/_Priyanshu CV Resume.pdf"
  download="Priyanshu_Frontend_Developer_Resume.pdf"
        className="bg-black/80 text-white px-5 py-2 rounded-full w-full flex items-center justify-center gap-2 font-lato font-semibold hover:bg-black/60 transition-all">
         Download my CV
        <Download size={20}/>
        </a>
        <button onClick={() => window.scrollTo({top: document.getElementById("contact").offsetTop, behavior: "smooth"})}
         className="bg-yellow-700 text-white px-5 py-2 w-full rounded-full font-lato font-semibold hover:bg-yellow-600 transition-all">
         Let’s Work Together
        </button>
        </div>
        {showArrow && (
        <div className=" absolute bottom-12 animate-bounce text-yellow-700 left-1/2  -translate-x-1/2 flex flex-col items-center gap-2"> 
        <h1 className="font-lato hidden md:hidden lg:block text-center">Scroll down</h1>
            <Mouse className="hidden md:hidden lg:block"/>
        
        </div>
        )}
      </div>
      <div className="pt-10 lg:pt-0 md:pt-0 ">
        <img
          src="mypic.jpg"
          alt="my picture"
          className="w-[510px] h-[600px] rounded-2xl object-cover"
        />
      </div>
    </div>
  );
};

export default Body;
