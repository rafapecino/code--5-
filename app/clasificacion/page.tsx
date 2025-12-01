"use client";
import { useState } from "react";
import Header from "@/All/components/header";
import { motion } from "framer-motion";
import MotogpTable from "./components/motogp-table";
import Moto2Table from "./components/moto2-table";
import Moto3Table from "./components/moto3-table";

type Category = "motogp" | "moto2" | "moto3";

export default function ClasificacionPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("motogp");

  const renderTable = () => {
    switch (activeCategory) {
      case "motogp":
        return <MotogpTable />;
      case "moto2":
        return <Moto2Table />;
      case "moto3":
        return <Moto3Table />;
      default:
        return <MotogpTable />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground bg-black">
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: "url('/Motohp fondo, marc y peco.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/80"></div>
      </div>
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />

        <main className="flex-grow pt-20 md:pt-24">
          <section className="px-4 sm:px-6 lg:px-8 py-12 border-b border-border bg-transparent">
            <div className="max-w-7xl mx-auto">
              <h1
                className="text-4xl md:text-5xl font-bold mb-4 text-white"
                style={{ textShadow: "2px 2px 8px rgba(0, 0, 0, 0.8)" }}
              >
                Clasificación del Campeonato
              </h1>
            </div>
          </section>

          <section className="px-4 sm:px-6 lg:px-8 py-12">
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-center mb-8">
                <div className="bg-secondary/30 backdrop-blur-sm rounded-full p-1 flex space-x-1">
                  {(["motogp", "moto2", "moto3"] as Category[]).map((category) => (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={`relative px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                        activeCategory === category
                          ? "text-white"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      {activeCategory === category && (
                        <motion.div
                          layoutId="active-pill"
                          className="absolute inset-0 bg-red-600 rounded-full"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10">
                        {category.toUpperCase()}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderTable()}
              </motion.div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
