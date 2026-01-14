"use client";

import { useEffect, useRef } from "react";
import WordCloud from "wordcloud";

export default function WordCloudCanvas({
  words,
  width = 600,
  height = 400,
  isDark,
}) {
  const canvasRef = useRef();

  useEffect(() => {
    if (!canvasRef.current || !words?.length) return;

    WordCloud(canvasRef.current, {
      list: words.map((w) => [w.label, w.count]),
      gridSize: 8,
      weightFactor: 10,
      fontFamily: "sans-serif",
      // color: "random-dark",
      rotateRatio: 0.5,
      backgroundColor: isDark ? "#0f172a" : "#ffffff",
      color: isDark ? "#f1f5f9" : "#1e293b",
    });
  }, [words, isDark]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="w-full max-w-full"
    />
  );
}
