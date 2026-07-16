import React from "react";
import Navbar from "@/app/components/Navbar";
import Hero from "@/app/components/Hero";
import Categories from "@/app/components/Categories";
import WhyUs from "@/app/components/WhyUs";
import FeaturedCourses from "@/app/components/FeaturedCourses";
import Stats from "@/app/components/Stats";
import CTAForm from "@/app/components/CTAForm";
import Footer from "@/app/components/Footer";

export default function Home() {
  return (
    <>
      {/* Header/Navbar */}
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <Hero />

        {/* Categories Section */}
        <Categories />

        {/* Why IHDECA Section */}
        <WhyUs />

        {/* Featured Courses Section */}
        <FeaturedCourses />

        {/* Stats Section */}
        <Stats />

        {/* Final CTA Form Section */}
        <CTAForm />
      </main>

      {/* Footer Section */}
      <Footer />
    </>
  );
}
