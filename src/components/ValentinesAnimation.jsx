import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const trophies = ["🏆", "🥇", "🏅", "✨", "🎖️"];

export default function AnniversaryAnimation() {
  const [fallingTrophies, setFallingTrophies] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setFallingTrophies((prev) => [
        ...prev,
        {
          id: Math.random(),
          emoji: trophies[Math.floor(Math.random() * trophies.length)],
          left: Math.random() * 100,
          direction: Math.random() > 0.5 ? "left" : "right",
          size: Math.random() * 1.5 + 1, // Vary size
        },
      ]);

      // Remove trophies after animation
      setTimeout(() => {
        setFallingTrophies((prev) => prev.slice(1));
      }, 5000);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
      {fallingTrophies.map(({ id, emoji, left, direction, size }) => (
        <motion.div
          key={id}
          initial={{ opacity: 0, y: -50, x: direction === "left" ? 50 : -50, rotate: 0 }}
          animate={{ opacity: 1, y: "100vh", x: direction === "left" ? -50 : 50, rotate: 360 }}
          transition={{ duration: 5, ease: "easeInOut" }}
          className="absolute text-3xl drop-shadow-lg animate-pulse"
          style={{ left: `${left}%`, fontSize: `${size}rem` }}
        >
          {emoji}
        </motion.div>
      ))}
    </div>
  );
}
