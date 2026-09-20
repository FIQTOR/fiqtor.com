import { Link } from "react-router-dom";
import React, { useRef, useEffect } from "react";
import { TbCheck, TbX, TbHome, TbRefresh } from "react-icons/tb";
import { motion } from "framer-motion";

interface ResponseProps {
  status: string;
}

function NeuralNetworkCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const numNodes = Math.min(Math.floor((width * height) / 14000), 55);
    const nodes = Array.from({ length: numNodes }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.7,
      vy: (Math.random() - 0.5) * 0.7,
      radius: Math.random() * 2 + 1.2,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 130;

          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.35;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(59, 130, 246, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      for (const node of nodes) {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(147, 51, 234, 0.75)";
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none opacity-50" />;
}

const ResponseMessage = ({ status }: ResponseProps) => {
  const isSuccess = status === "success";

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center px-7 overflow-hidden">
      <NeuralNetworkCanvas />

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="relative z-10 flex flex-col items-center gap-8 text-center max-w-md"
      >
        {/* Animated Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
          className={`flex h-24 w-24 items-center justify-center rounded-full ${
            isSuccess
              ? "bg-green-500/10 text-green-500"
              : "bg-red-500/10 text-red-500"
          }`}
        >
          {isSuccess ? (
            <TbCheck className="h-12 w-12" strokeWidth={2.5} />
          ) : (
            <TbX className="h-12 w-12" strokeWidth={2.5} />
          )}
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`text-4xl md:text-5xl font-bold ${
            isSuccess ? "text-green-500" : "text-red-500"
          }`}
        >
          {isSuccess ? "Message Sent!" : "Something Went Wrong"}
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-lg text-neutral-500 dark:text-neutral-400 leading-relaxed"
        >
          {isSuccess
            ? "Thank you for reaching out! I'll get back to you within 24 hours."
            : "There was an issue sending your message. Please try again or reach out directly."}
        </motion.p>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {isSuccess ? (
            <Link
              to="/"
              className="group flex items-center gap-3 rounded-2xl bg-linear-to-r from-green-500 to-emerald-600 px-8 py-4 text-white font-bold shadow-lg shadow-green-500/20 transition-all duration-300 hover:shadow-xl hover:scale-105"
            >
              <TbHome className="h-5 w-5" />
              Back to Home
            </Link>
          ) : (
            <a
              href="/talk"
              className="group flex items-center gap-3 rounded-2xl bg-linear-to-r from-red-500 to-rose-600 px-8 py-4 text-white font-bold shadow-lg shadow-red-500/20 transition-all duration-300 hover:shadow-xl hover:scale-105"
            >
              <TbRefresh className="h-5 w-5" />
              Try Again
            </a>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ResponseMessage;
