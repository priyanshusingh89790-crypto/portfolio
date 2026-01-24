import {Settings,BoxIcon,Book,Pencil } from "lucide-react"
const Skill = () => {
    return (
        <div className="w-full">
            <div className="max-w-7xl pb-20 mx-auto min-h-[700px] items-center justify-center pt-10 flex flex-col gap-2">
                <h1 className="text-2xl text-orange-800 font-lato font-semibold">SKILLS</h1>
                <h1 className="text-3xl font-semibold">Techonologies i use to build the web</h1>
                <div className="flex justify-between w-full mt-20">
                    <div className="flex flex-col w-[250px] h-[280px] shadow-lg items-center bg-white/30 p-5 rounded-lg border border-orange-800/20 ">
                        <h1 className="flex gap-2 items-center w-full text-orange-900 border-b border-orange-800/20 pb-2 text-[24px] "><Settings/>Frontend</h1>
                        
                        <ul className =" list-disc pt-2 w-[70%] text-stone-900">
                            <li className="font-lato text-lg pt-2">React</li>
                            <li className="font-lato text-lg pt-3">JavaScript</li>
                            <li className="font-lato text-lg pt-3">HTML & CSS</li>
                            <li className="font-lato text-lg pt-3">Tailwind CSS</li>
                        </ul>
                        
                    </div>
                    <div className="flex flex-col w-[250px] h-[280px] shadow-lg items-center bg-white/40 p-5 rounded-lg border border-orange-800/20 ">
                        <h1 className="flex gap-2 items-center  w-[90%] text-orange-900 border-b border-orange-800/20 pb-2 text-[24px] "><BoxIcon/>State & Logic</h1>
                        
                        <ul className =" list-disc pt-2 w-[70%] text-stone-900">
                            <li className="font-lato text-lg pt-2">Redux Toolkit</li>
                            <li className="font-lato text-lg pt-3">Context API</li>
                           
                        </ul>
                        
                    </div>
                    <div className="flex flex-col w-[250px] h-[280px] shadow-lg items-center bg-white/40 p-5 rounded-lg border border-orange-800/20 ">
                        <h1 className="flex gap-2 items-center  w-[90%] text-orange-900 border-b border-orange-800/20 pb-2 text-[24px] "><Book/>Tools</h1>
                        
                        <ul className =" list-disc pt-2 w-[70%] text-stone-900">
                            <li className="font-lato text-lg pt-2">Git & Github</li>
                            <li className="font-lato text-lg pt-3">Firebase</li>
                            <li className="font-lato text-lg pt-3">REST API</li>
                        </ul>
                        
                    </div>
                    <div className="flex flex-col w-[250px] h-[280px] shadow-lg items-center bg-white/40 p-5 rounded-lg border border-orange-800/20 ">
                        <h1 className="flex gap-2 items-center  w-[90%] text-orange-900 border-b border-orange-800/20 pb-2 text-[24px] "><Pencil/>Design & UX</h1>
                        
                        <ul className =" list-disc pt-2 w-[72%] text-stone-900">
                            <li className="font-lato text-lg pt-2">Responsive Design</li>
                            <li className="font-lato text-lg pt-3">Figma</li>
                            <li className="font-lato text-lg pt-3">Accessibility</li>
                        </ul>
                        
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Skill;
