import { Github, Linkedin, Mail,Download, Mouse } from "lucide-react";
import usescroll from "./hooks/usescroll";
import useSlide from "./hooks/useSlide";
const Body = () => {
  const showArrow = usescroll();
  useSlide();
  return (
    <div className="dark:bg-neutral-950 w-full h-full">
    <div id="home" className="flex relative lg:flex-row flex-col lg:max-w-[80%] lg:p-0 p-4 mx-auto dark:bg-neutral-950 pt-32 lg:pt-0 md:w-[90%] items-center min-h-[calc(100vh-80px)] justify-between">
      <div className="lg:w-[47%] w-full reveal-left flex flex-col gap-5">
        <h1 className=" lg:text-3xl md:text-2xl text-[22px] text-gray-600 dark:text-white font-lato font-semibold">
          Hi, I’m Priyanshu{" "}
        </h1>
        <p className="lg:text-7xl md:text-6xl text-4xl pl-5 md:pl-0 lg:pl-0 font-bold dark:text-white"> Frontend </p>{" "}
        <b className="text-yellow-700 text-right lg:text-7xl md:text-6xl pr-5 md:pr-0 lg:pr-0 text-4xl dark:text-yellow-600">Developer</b>
        <p className="lg:text-xl md:text-lg text-[16px] lg:pt-4 font-lato text-gray-600 dark:text-white">
          {" "}
          Building modern and responsive web interfaces
        </p>
        <p className="lg:text-xl md:text-lg text-[16px] font-lato text-gray-600 dark:text-white">
          I specialize in React, CSS, and creating clean, user-friendly
          websites. Currently exploring new projects and open for opportunities.
        </p>
        <div className="flex lg:pt-5 gap-5">
          <a href="https://github.com/priyanshusingh89790-crypto" className="bg-yellow-600/50 cursor-pointer dark:bg-yellow-600 hover:bg-yellow-600 hover:scale-110 transition-all hover:text-white p-3 rounded-full ">
            <Github />
          </a>
          <a href="https://www.linkedin.com/in/priyanshu-singh-668b53328/" className="bg-yellow-600/50 cursor-pointer dark:bg-yellow-600 hover:bg-yellow-600 hover:scale-110 transition-all hover:text-white p-3 rounded-full ">
            <Linkedin />
          </a>
          <a href="https://mail.google.com/mail/?view=cm&fs=1&to=priyanshuvwork@gmail.com" 
          target="_blank"
          className="bg-yellow-600/50 cursor-pointer dark:bg-yellow-600 hover:bg-yellow-600 hover:scale-110 transition-all hover:text-white p-3 rounded-full ">
            <Mail />
          </a>
        </div>
        <div className="flex lg:flex-row flex-col md:flex-row gap-5 lg:w-full lg:pt-5 justify-center items-center">
        <a href="/_Priyanshu CV Resume.pdf"
  download="Priyanshu_Frontend_Developer_Resume.pdf"
        className="bg-black/80 dark:bg-white/80 cursor-pointer dark:text-black text-white px-5 py-2 rounded-full w-full flex items-center justify-center gap-2 font-lato font-semibold dark:hover:bg-white/60 hover:bg-black/60 transition-all">
         Download my CV
        <Download size={20}/>
        </a>
        <button onClick={() => window.scrollTo({top: document.getElementById("contact").offsetTop, behavior: "smooth"})}
         className="bg-yellow-700 text-white px-5 py-2 w-full rounded-full font-lato font-semibold hover:bg-yellow-600 dark:hover:bg-yellow-700 dark:bg-yellow-600 transition-all">
         Let’s Work Together
        </button>
        </div>
      </div>
      <div className="pt-10 lg:pt-0 md:pt-10 reveal-right">
        <img
          src="mypic.jpg"
          alt="my picture"
          className="lg:w-[580px] md:w-full lg:h-[600px] md:h-full w-full h-full rounded-2xl object-cover"
        />
      </div>
    {showArrow && (
        <div className="absolute lg:block  bottom-8 animate-bounce dark:text-yellow-500 left-1/2 -translate-x-1/2 text-yellow-700 flex flex-col items-center gap-2"> 
        <h1 className="font-lato hidden md:hidden lg:block text-center">Scroll down</h1>
            <Mouse className="hidden md:hidden lg:block"/>
        
        </div>
        )}
    </div>
    </div>
  );
};

export default Body;
