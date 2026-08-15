import { NETFLIX_LINK, DEVMEETUP_LINK, CAFE_LINK } from "./constant";

const projectData = [
  {
    id: 1,
    title: "Netflix-AI",
    description:
      "AI-powered Netflix-style movie app with smart recommendations and seamless content discovery. Real-time data, modern UI, and responsive design.",
    longDescription:
      "A full-featured Netflix clone supercharged with AI-powered movie recommendations. Users can browse trending content, search across a live TMDB dataset, and receive personalised suggestions via an integrated AI layer. Built with React and Redux for state management, it features protected routes, a clean responsive layout, and smooth transitions that mirror the real Netflix experience.",
    tech: ["React", "Redux", "AI Integration", "REST API", "Responsive UI"],
    color: "#E50914",
    image: "project/netflix.png",
    mobileImage: "project/netflixmob.png",
    year: "2024",
    category: "AI Product",
    links: { live: NETFLIX_LINK, github: "#" },
    link: NETFLIX_LINK,
  },
  {
    id: 2,
    title: "DevMeetup",
    description:
      "Full-stack platform for discovering and organizing developer meetups with authentication, event creation, and responsive dashboards.",
    longDescription:
      "DevMeetup is a full-stack community platform where developers can discover local and online meetups, RSVP, and even host their own events. It features Firebase-backed authentication, real-time data sync, a Redux Toolkit-powered dashboard, and a responsive UI that works across all screen sizes. The event creation flow is smooth and intuitive, with form validation and instant feedback throughout.",
    tech: ["React", "Tailwind", "Firebase", "Redux Toolkit", "Responsive UI"],
    color: "#22d3ee",
    image: "project/devpic.png",
    mobileImage: "project/devmob.png",
    year: "2023",
    category: "Full-Stack",
    links: { live: DEVMEETUP_LINK, github: "#" },
    link: DEVMEETUP_LINK,
  },
  {
    id: 3,
    title: "I Heart Cafe | Brand Website",
    description:
      "Responsive restaurant and brand website featuring reservations, feedback system, and modern user experience.",
    longDescription:
      "A polished brand and restaurant website for I Heart Cafe. The site includes an online reservation system, a customer feedback module backed by Firebase, a dynamic menu section, and a visually rich hero built with modern UI/UX principles. Designed to be fast, mobile-first, and on-brand — it reflects the warm, cosy feel of the cafe through thoughtful color choices and smooth interactions.",
    tech: ["React", "Tailwind", "Firebase", "Redux Toolkit", "UI/UX Design"],
    color: "#f59e0b",
    image: "project/cafe.png",
    mobileImage: "project/cafemob.png",
    year: "2022",
    category: "Brand Site",
    links: { live: CAFE_LINK, github: "#" },
    link: CAFE_LINK,
  },
  {
    id: 4,
    title: "My Portfolio Website",
    description:
      "Personal portfolio showcasing projects, skills, and experience with modern animations and responsive design.",
    longDescription:
      "The site you're looking at right now! Built from scratch with React, Tailwind CSS, GSAP, and Three.js. It features a custom cursor, a particle-field hero, scroll-driven animations, a walking penguin mascot in the projects section, smooth Lenis scrolling, a dark/light theme toggle, ambient audio, and a contact form powered by EmailJS. Every interaction was crafted to feel snappy and deliberate.",
    tech: [
      "React",
      "Tailwind",
      "GSAP",
      "Three.js",
      "Lenis",
      "EmailJS",
    ],
    color: "#8b5cf6",
    image: "project/portfolio.png",
    mobileImage: "project/portfoliomob.png",
    year: "2025",
    category: "Portfolio",
    links: { live: "/", github: "#" },
    link: "/",
  },
];

export default projectData;