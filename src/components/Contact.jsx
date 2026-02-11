import { Github, Linkedin, Mail } from "lucide-react";
const Contact = () => {
  return (
    <div className="w-full h-screen ">
      <div className="lg:max-w-7xl mx-auto items-center justify-center flex flex-col gap-5 pb-20 pt-20">
        <h1 className="text-[20px] font-lato text-orange-800 font-semibold">
          CONTACT
        </h1>
        <div className="flex lg:flex-row flex-col pt-20 gap-20">
          <div className="flex flex-col gap-14">
            <h1 className="text-5xl font-semibold text-stone-700">
              Let's Connect
            </h1>
            <p className="text-[20px] font-lato text-yellow-700">
              I'd like to hear from you!
            </p>
            <p className="text-[20px] font-lato text-stone-700">
              I’m currently open to frontend opportunities and would love to
              connect about roles, projects, or collaborations.
            </p>
            <div className="flex flex-col items-start justify-start gap-8">
              <h1 className="text-[18px] flex items-center gap-2 bg-white/30 border border-yellow-800/20 rounded-lg p-2 font-lato text-yellow-700">
                email me diretly at:
                <a
                  href="mailto:[EMAIL_ADDRESS]"
                  className="text-[16px] font-lato text-black"
                >
                  priyanshuvwork@gmail.com
                </a>
              </h1>
              <div className="flex gap-5">
                <a href="https://github.com/priyanshusingh89790-crypto" className="bg-yellow-600/50 cursor-pointer hover:bg-yellow-600 hover:scale-110 transition-all hover:text-white p-2 rounded-full ">
                  <Github />
                </a>
                <a href="https://www.linkedin.com/in/priyanshu-singh-668b53328/" className="bg-yellow-600/50 cursor-pointer hover:bg-yellow-600 hover:scale-110 transition-all hover:text-white p-2 rounded-full ">
                  <Linkedin />
                </a>
                <div className="bg-yellow-600/50 cursor-pointer hover:bg-yellow-600 hover:scale-110 transition-all hover:text-white p-2 rounded-full ">
                  <Mail />
                </div>
              </div>
            </div>
          </div>

          <div className="flex w-auto flex-col bg-white/30 border border-yellow-800/20 shadow-lg justify-between rounded-lg p-10 items-center gap-5">
            <div className="flex flex-col gap-5">
              <div className="flex flex-col lg:w-[600px] w-auto gap-5">
                <h1 className="text-[18px] font-lato text-yellow-700">
                  {" "}
                  Name
                  <input
                    type="text"
                    placeholder="YOUR NAME"
                    className="p-2 rounded-lg w-full border placeholder:text-black border-orange-800/20 text-[16px]"
                  />
                </h1>
                <h1 className="text-[18px] font-lato text-yellow-700">
                  Email
                  <input
                    type="email"
                    placeholder="YOUR EMAIL"
                    className="p-2 rounded-lg w-full border placeholder:text-black border-orange-800/20 text-[16px]"
                  />
                </h1>
              </div>
              <h1 className="text-[18px] font-lato text-yellow-700">Message</h1>
              <textarea
                placeholder="YOUR MESSAGE"
                className="p-2 h-[150px] rounded-lg font-lato w-full border placeholder:text-black border-orange-800/20 text-[16px]"
              ></textarea>
              <button className="bg-yellow-700 text-white justify-self-end self-end w-20 p-2 rounded-lg font-lato font-semibold">
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Contact;
