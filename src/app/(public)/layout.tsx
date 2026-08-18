import { Experience } from "@/components/animation/Experience";
import { Footer } from "@/components/public/Footer";
import { Header } from "@/components/public/Header";
import { getServices, getSettings } from "@/lib/content";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const [settings, services] = await Promise.all([getSettings(), getServices()]);
  return (
    <>
      <Experience introEnabled={settings.introEnabled} />
      <Header settings={settings} services={services} />
      <main id="main-content">{children}</main>
      <Footer settings={settings} services={services} />
    </>
  );
}
