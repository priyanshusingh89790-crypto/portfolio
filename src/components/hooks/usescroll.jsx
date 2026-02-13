import { useEffect, useState } from "react";
 const usescroll = () => {
const [showArrow, setShowArrow] = useState(true);

useEffect(() => {
  const onScroll = () => setShowArrow(window.scrollY < 10);
  window.addEventListener("scroll", onScroll);
  return () => window.removeEventListener("scroll", onScroll);
}, []);
 return showArrow;
} 
export default usescroll;