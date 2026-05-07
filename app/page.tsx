"use client";
import { useState } from "react";
import EntryAnimation from "@/components/EntryAnimation";
import HomePage from "@/components/HomePage";

export default function Home() {
  const [showHome, setShowHome] = useState(false);

  return (
    <main>
      {!showHome ? (
        // ده أنيميشن الدخول اللي فيه التابلت 3D
        <EntryAnimation onComplete={() => setShowHome(true)} />
      ) : (
        // دي الصفحة الرئيسية اللي بتظهر بعد ما تضغط على التابلت
        <HomePage />
      )}
    </main>
  );
}
