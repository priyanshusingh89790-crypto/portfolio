import { NETFLIX_LINK, DEVMEETUP_LINK, CAFE_LINK } from "./constant";

const projectData = [
  {
    title: "Netflix-AI",
    description: "AI-powered Netflix-style movie app with smart recommendations and seamless content discovery. Real-time data, modern UI, and responsive design for an intuitive user experience.",
    tags: ["React", "Redux", "AI Integration", "REST API", "Responsive UI"],
    image: "project/netflix.png",
    mobileImage: "project/netflixmob.png",
    link: NETFLIX_LINK,
  },
  {
    title: "DevMeetup",
    description: "Full-stack platform for discovering and organizing developer meetups. Includes authentication, event creation, and a responsive dashboard for browsing events.",
    tags: ["React", "Tailwind", "Firebase", "Redux Toolkit", "Responsive UI"],
    image: "project/devpic.png",
    mobileImage: "project/devmob.png",
    link: DEVMEETUP_LINK,
  },
  {
    title: "I Heart Cafe | Brand Website",
    description: "Responsive e-commerce website with product cards and feedback page. Showcases front-end skills and clean, user-friendly UI design.",
    tags: ["React", "Tailwind", "Firebase", "Redux Toolkit", "UI/UX Design"],
    image: "project/cafe.png",
    mobileImage: "project/cafemob.png",
    link: CAFE_LINK,
  },
  {
    title: "My Portfolio Website",
    description: "Personal portfolio website showcasing projects, skills, and contact information. Built with modern React and TailwindCSS for responsive and interactive UI.",
    tags: ["React", "Tailwind", "Responsive Design", "UI/UX", "Frontend Development"],
    image: "project/portfolio.png",
    mobileImage: "project/portfoliomob.png",
    link: "/",
  },
];

export default projectData;