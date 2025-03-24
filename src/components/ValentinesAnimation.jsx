import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const flowers = ["🌸", "💐", "🌷", "🌹", "🌺"];

export default function ValentinesAnimation() {
  const [fallingFlowers, setFallingFlowers] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setFallingFlowers((prev) => [
        ...prev,
        {
          id: Math.random(),
          emoji: flowers[Math.floor(Math.random() * flowers.length)],
          left: Math.random() * 100,
          direction: Math.random() > 0.5 ? "left" : "right"
        },
      ]);

      // Remove flowers after animation
      setTimeout(() => {
        setFallingFlowers((prev) => prev.slice(1));
      }, 5000);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
      {fallingFlowers.map(({ id, emoji, left, direction }) => (
        <motion.div
          key={id}
          initial={{ opacity: 0, y: -50, x: direction === "left" ? 50 : -50, rotate: 0 }}
          animate={{ opacity: 1, y: "100vh", x: direction === "left" ? -50 : 50, rotate: 360 }}
          transition={{ duration: 5, ease: "easeInOut" }}
          className="absolute text-3xl"
          style={{ left: `${left}%` }}
        >
          {emoji}
        </motion.div>
      ))}
    </div>
  );
}
