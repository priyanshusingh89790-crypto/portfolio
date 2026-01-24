
import {ArrowRight,Dot} from "lucide-react"
const Project = () => {
    return (
        <div className="w-full bg-white/40">
            <div className="max-w-7xl mx-auto items-center justify-center pt-10 pb-20 flex flex-col gap-2">
                <h1 className="text-2xl text-orange-800 font-lato font-semibold">PROJECTS</h1>
                <h1 className="text-3xl font-semibold">Selected Work & Case Studies</h1>
                <div className="pt-20 flex flex-col gap-20">
                    <div className="flex gap-10 border bg-white/50 border-yellow-800/20 hover:shadow-lg hover:scale-105 transition-all justify-between rounded-lg p-5">
                        <div className="relative h-[350px] w-[50%]">
  <img
    src="devpic.png"
    alt="background"
    className="h-full w-full object-cover"
  />

  <img
    src="devmob.png"
    alt="mobile"
    className="absolute bottom-0 right-4 bg-black/10 p-2 h-[250px] w-[150px] rounded-lg z-10"
  />
</div>

                        <div className="w-[50%] p-4">
                        <h1 className="text-3xl text-orange-900 ">DevMeetup Platform</h1>
                        <p className="text-[20px] pt-5 text-orange-900 font-lato">Full Stack platforrm for disccovering and organizing developer meetups. Features include user authentication, event creation, and a responsive dashboard for browsing upcoming events .</p>
                        <ul className="flex pt-5 gap-6">
                            <li className="font-lato text-orange-900/70 text-[20px] flex items-center gap-1"><Dot/>React</li>
                            <li className="font-lato text-orange-900/70 text-[20px] flex items-center gap-1"><Dot/>Tailwind</li>
                            <li className="font-lato text-orange-900/70 text-[20px] flex items-center gap-1"><Dot/>Firebase</li>
                            <li className="font-lato text-orange-900/70 text-[20px] flex items-center gap-1"><Dot/>Redux Toolkit</li>
                        </ul>
                        <div className="flex gap-16  pt-5">
                            <button className=" text-orange-800 text-[20px] hover:text-orange-600 hover:border-orange-600 font-lato border-b-2 border-orange-800 flex items-center gap-2 p-2">Live View →</button>
                            <button className=" text-orange-800 text-[20px] hover:text-orange-600 hover:border-orange-600 font-lato border-b-2 border-orange-800 flex items-center gap-2 p-2">Github →</button>
                        </div>
                        </div>
                    </div>
                    <div className="flex gap-10 border bg-white/50 border-yellow-800/20 hover:shadow-lg hover:scale-105 transition-all justify-between rounded-lg p-5">
                       
                        <div className="w-[50%] p-4">
                        <h1 className="text-3xl text-orange-900">Brand Website</h1>
                        <p className="text-[20px] pt-5 text-orange-900 font-lato">I Heart Cafe is a responsive website featuring e-commerce product cards and a feedback page. The project demonstrates my skills in front-end development and UI design.</p>
                        <ul className="flex pt-5 gap-6">
                            <li className="font-lato text-orange-900/70 text-[20px] flex items-center gap-1"><Dot/>React</li>
                            <li className="font-lato text-orange-900/70 text-[20px] flex items-center gap-1"><Dot/>Tailwind</li>
                            <li className="font-lato text-orange-900/70 text-[20px] flex items-center gap-1"><Dot/>Firebase</li>
                            <li className="font-lato text-orange-900/70 text-[20px] flex items-center gap-1"><Dot/>Redux Toolkit</li>
                        </ul>
                        <div className="flex gap-16  pt-5">
                            <button className=" text-orange-800 text-[20px] hover:border-orange-600 hover:text-orange-600 font-lato border-b-2 border-orange-800 flex items-center gap-2 p-2">Live View →</button>
                            <button className=" text-orange-800 text-[20px] hover:border-orange-600 hover:text-orange-600 font-lato border-b-2 border-orange-800 flex items-center gap-2 p-2">Github →</button>
                        </div>
                        </div>
                         <div className="relative h-[350px] w-[50%]">
  <img
    src="cafe.png"
    alt="background"
    className="h-full w-full object-cover"
  />

  <img
    src="cafemob.png"
    alt="mobile"
    className="absolute bottom-0 right-4 bg-white/20 p-2 h-[250px] w-[150px] rounded-lg z-10"
  />
</div>

                    </div>
                    
                </div>
            </div>
        </div>
    );
};
export default Project;