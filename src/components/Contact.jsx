
import { Github, Linkedin, Mail } from "lucide-react";
const Contact = () => {
    return (
        <div className="max-w-7xl mx-auto items-center justify-center flex flex-col gap-5 pb-20 pt-20">
            
                <h1 className="text-[20px] font-lato text-orange-800 font-semibold">CONTACT</h1>
                
                <div className="flex w-[70%] flex-col bg-white/30 border border-yellow-800/20 shadow-lg justify-between rounded-lg p-5 items-center gap-5">
                    <h1 className="text-3xl font-semibold">Let's Connect </h1>
                <p className="text-[20px] font-lato text-orange-800/70">Feel free to reach out for collaboration, or just a friendly hello!</p>
                <div className="flex flex-col gap-5">
                    <div className="flex flex-col w-[600px] gap-5">
                    <h1 className="text-[18px] font-lato text-orange-800"> Name
                    <input type="text" placeholder="YOUR NAME" className="p-2 rounded-lg w-full border border-orange-800/20 text-[16px]" />
                    </h1>
                    <h1 className="text-[18px] font-lato text-orange-800">Email
                    <input type="email" placeholder="YOUR EMAIL" className="p-2 rounded-lg w-full border border-orange-800/20 text-[16px]" />
                    </h1>
                    </div>
                    <h1 className="text-[18px] font-lato text-orange-800">Message</h1>
                    <textarea placeholder="YOUR MESSAGE" className="p-2 h-[150px] rounded-lg w-full border border-orange-800/20 text-[16px]"></textarea>
                    <button className="bg-orange-800 text-white justify-self-end self-end w-20 p-2 rounded-lg font-lato font-semibold">Send</button>
                    <div className="flex flex-col items-center justify-center gap-5">
                        <h1 className="text-[18px] font-lato text-orange-800">Or email me diretly at:</h1>
                        <p className="text-[16px] font-lato text-orange-800">priyanshuvwork@gmail.com</p>
                        <div className="flex gap-5 items-center justify-center">
                            <Github/>
                            <Linkedin/>
                            <Mail/>
                        </div>
                    </div>
                     </div>
                </div>
            
        </div>
    );
};
export default Contact;