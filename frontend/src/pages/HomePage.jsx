import React, { useEffect } from 'react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { HeroSection } from '../components/home/HeroSection';
import { NewsSection } from '../components/home/NewsSection';
import { EventsSection } from '../components/home/EventsSection';
import { GallerySection } from '../components/home/GallerySection';
import { ServicesHub } from '../components/home/ServicesHub';
import { DirectorySection } from '../components/home/DirectorySection';
import { StickyNewsBanner } from '../components/home/StickyNewsBanner';
import { apiService } from '../lib/api';

export const HomePage = () => {
  useEffect(() => {
    // Seed data on first load
    const seedData = async () => {
      try {
        await apiService.seedData();
      } catch (error) {
        // Ignore errors - data might already be seeded
      }
    };
    seedData();
  }, []);

  return (
    <div className="min-h-screen bg-white" data-testid="home-page">
      <Header />
      <main>
        <HeroSection />
        <NewsSection />
        <EventsSection />
        <GallerySection />
        <ServicesHub />
        <DirectorySection />
      </main>
      <Footer />
      <StickyNewsBanner />
    </div>
  );
};

export default HomePage;
