import { useEffect } from "react";

const useSlide = () => {
  useEffect(() => {
    const elements = document.querySelectorAll(
      ".reveal-left, .reveal-right, .reveal-top, .reveal-down"
    );

    requestAnimationFrame(() => {
      elements.forEach((el) => {
        el.classList.add("reveal-init");
      });
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          }
        });
      },
      { threshold: 0.2 }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
};

export default useSlide;
