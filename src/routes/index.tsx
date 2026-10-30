import { createFileRoute } from "@tanstack/react-router";
import {
  Phone, MapPin, Stethoscope, Baby, Activity, Pill, Ambulance,
  Calendar, FlaskConical, ShoppingBag, Facebook, Instagram, Youtube, Mail, Clock, ShieldCheck, Heart,
} from "lucide-react";
import { LangProvider, useLang } from "@/lib/lang-context";
import { Header } from "@/components/site/Header";
import { WhatsAppFab } from "@/components/site/WhatsAppFab";
import logo from "@/assets/logo.png";
import doctors from "@/assets/doctors.jpeg";
import baby from "@/assets/baby.jpeg";
import elderly from "@/assets/elderly.jpeg";
import care from "@/assets/care.jpeg";
import vaccine from "@/assets/vaccine.jpeg";
import stethoscope from "@/assets/stethoscope.jpeg";
import ot from "@/assets/ot.jpeg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dhreeti (Dhriti) Clinic — Trusted Healthcare in Ara, Bihar" },
      { name: "description", content: "Family medicine, OB-GYN, ultrasound, 24/7 pharmacy & emergency referrals at Dhreeti Clinic, Maulabag, Ara." },
      { property: "og:title", content: "Dhreeti Clinic — Ara, Bihar" },
      { property: "og:description", content: "Reliable & affordable healthcare. Book appointments, lab tests, and order medicines online." },
    ],
  }),
  component: () => (
    <LangProvider>
      <Page />
    </LangProvider>
  ),
});

function Page() {
  const { t } = useLang();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* HERO */}
      <section id="home" className="relative overflow-hidden bg-gradient-soft">
        <div className="container mx-auto px-4 py-12 sm:py-20 grid lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-xs font-semibold">
              <ShieldCheck className="h-4 w-4" /> Est. 2022 · Ara, Bhojpur
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              {t.hero.title}
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-xl">{t.hero.subtitle}</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href="/book" className="bg-gradient-hero text-white font-semibold px-6 py-4 rounded-xl shadow-soft min-h-12 inline-flex items-center justify-center gap-2">
                <Calendar className="h-5 w-5" /> {t.hero.cta1}
              </a>
              <a href="tel:+919901515300" className="bg-card border-2 border-primary text-primary font-semibold px-6 py-4 rounded-xl min-h-12 inline-flex items-center justify-center gap-2">
                <Phone className="h-5 w-5" /> {t.hero.cta2}
              </a>
            </div>
            <div className="flex items-center gap-6 pt-4">
              <div><div className="text-2xl font-bold text-primary">10k+</div><div className="text-xs text-muted-foreground">Patients cared</div></div>
              <div className="h-10 w-px bg-border" />
              <div><div className="text-2xl font-bold text-primary">24/7</div><div className="text-xs text-muted-foreground">Pharmacy</div></div>
              <div className="h-10 w-px bg-border" />
              <div><div className="text-2xl font-bold text-primary">2</div><div className="text-xs text-muted-foreground">Specialists</div></div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-hero rounded-3xl blur-2xl opacity-20" />
            <img src={doctors} alt="Dr. Ganesh Pandey and Dr. Pragya Rajesh" className="relative rounded-3xl shadow-soft w-full object-cover" />
            <div className="absolute -bottom-4 start-4 bg-card rounded-2xl shadow-card p-3 flex items-center gap-2">
              <img src={logo} alt="" className="h-10 w-10" />
              <div>
                <div className="text-xs text-muted-foreground">Trusted by</div>
                <div className="text-sm font-bold text-primary">Ara families</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ACTION CENTER */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">{t.actionCenter.title}</h2>
            <p className="text-muted-foreground mt-2">{t.actionCenter.subtitle}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <ActionCard icon={<Calendar className="h-7 w-7" />} title={t.actions.appointment} desc={t.actions.appointmentDesc} href="/book" />
            <ActionCard icon={<FlaskConical className="h-7 w-7" />} title={t.actions.lab} desc={t.actions.labDesc} href="https://wa.me/919901515300?text=I%20want%20to%20book%20a%20Blood%2FUrine%20test" />
            <ActionCard icon={<ShoppingBag className="h-7 w-7" />} title={t.actions.meds} desc={t.actions.medsDesc} href="https://wa.me/919901515300?text=I%20want%20to%20order%20medicines" />
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-16 sm:py-20 bg-gradient-soft">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">{t.services.title}</h2>
            <p className="text-muted-foreground mt-3">{t.services.subtitle}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <ServiceCard icon={<Stethoscope />} image={stethoscope} title={t.services.gm.title} doctor={t.services.gm.doctor} desc={t.services.gm.desc} />
            <ServiceCard icon={<Baby />} image={baby} title={t.services.ob.title} doctor={t.services.ob.doctor} desc={t.services.ob.desc} />
            <ServiceCard icon={<Activity />} image={ot} title={t.services.us.title} desc={t.services.us.desc} />
            <ServiceCard icon={<Pill />} image={vaccine} title={t.services.pharm.title} desc={t.services.pharm.desc} />
            <ServiceCard icon={<Ambulance />} image={elderly} title={t.services.ref.title} desc={t.services.ref.desc} highlight />
            <ServiceCard icon={<Heart />} image={care} title="Compassionate Family Care" desc="From newborns to seniors — every patient treated with dignity, listened to, and supported on their healing journey." />
          </div>
        </div>
      </section>

      {/* DOCTORS */}
      <section id="doctors" className="py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-foreground mb-12">Meet Our Doctors</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <DoctorCard name="Dr. Ganesh Pandey" specialty="General Physician" desc={t.services.gm.desc} />
            <DoctorCard name="Dr. Pragya Rajesh" specialty="Obstetrician & Gynecologist" desc={t.services.ob.desc} />
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section id="about" className="py-16 sm:py-20 bg-gradient-hero text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">{t.mission.title}</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <div className="bg-white/10 rounded-2xl p-8 border border-white/20">
              <Heart className="h-10 w-10 mb-4" />
              <h3 className="text-2xl font-bold mb-3">{t.mission.mTitle}</h3>
              <p className="text-white/90 leading-relaxed">{t.mission.mText}</p>
            </div>
            <div className="bg-white/10 rounded-2xl p-8 border border-white/20">
              <ShieldCheck className="h-10 w-10 mb-4" />
              <h3 className="text-2xl font-bold mb-3">{t.mission.vTitle}</h3>
              <p className="text-white/90 leading-relaxed">{t.mission.vText}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-16 sm:py-20">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-10">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">{t.contact.title}</h2>
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-secondary text-primary inline-flex items-center justify-center shrink-0">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-semibold">Address</div>
                  <p className="text-muted-foreground">{t.contact.address}</p>
                  <a href="https://maps.app.goo.gl/PWMyi82X5niphyHEA?g_st=ac" target="_blank" rel="noopener noreferrer" className="text-primary font-semibold text-sm mt-1 inline-block">Open in Google Maps →</a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-secondary text-primary inline-flex items-center justify-center shrink-0">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-semibold">{t.contact.callUs}</div>
                  <a href="tel:+919901515300" className="block text-primary font-semibold">+91 99015 15300</a>
                  <a href="tel:+919279797955" className="block text-primary font-semibold">+91 92797 97955</a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-secondary text-primary inline-flex items-center justify-center shrink-0">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-semibold">Hours</div>
                  <p className="text-muted-foreground">Mon – Sun · Pharmacy 24/7 · Clinic 9 AM – 9 PM</p>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-card min-h-[320px] border border-border">
            <iframe
              title="Dhreeti Clinic location"
              src="https://www.google.com/maps?q=25.5632589,84.6597406&output=embed"
              className="w-full h-full min-h-[320px] border-0"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-foreground text-background py-12">
        <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <img src={logo} alt="" className="h-12 w-12 bg-white rounded-lg p-1" />
              <div>
                <div className="font-bold text-lg">Dhreeti Clinic</div>
                <div className="text-xs opacity-70">{t.tagline}</div>
              </div>
            </div>
          </div>
          <div>
            <div className="font-semibold mb-3">{t.footer.follow}</div>
            <div className="flex items-center gap-3">
              <SocialLink href="https://www.facebook.com/share/19TuNETpAt/" label="Facebook"><Facebook className="h-5 w-5" /></SocialLink>
              <SocialLink href="https://www.instagram.com/dhreeti_clinic?igsh=MXRlYjM2dzhhaHBzYw==" label="Instagram"><Instagram className="h-5 w-5" /></SocialLink>
              <SocialLink href="https://youtube.com/@dhreeticlinic?si=0kteaFbMV-U1YtQW" label="YouTube"><Youtube className="h-5 w-5" /></SocialLink>
              <SocialLink href="https://maps.app.goo.gl/PWMyi82X5niphyHEA?g_st=ac" label="Maps"><MapPin className="h-5 w-5" /></SocialLink>
              <SocialLink href="mailto:contact@dhreeticlinic.in" label="Email"><Mail className="h-5 w-5" /></SocialLink>
            </div>
          </div>
          <div className="text-sm opacity-80">
            <div className="font-semibold mb-3 opacity-100">Contact</div>
            <p>{t.contact.address}</p>
            <a href="tel:+919901515300" className="block mt-2">+91 99015 15300</a>
            <a href="tel:+919279797955" className="block">+91 92797 97955</a>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-8 pt-6 border-t border-white/10 text-center text-sm opacity-70">
          © {new Date().getFullYear()} Dhreeti Clinic. {t.footer.rights}.
        </div>
      </footer>

      <WhatsAppFab />
    </div>
  );
}

function ActionCard({ icon, title, desc, onClick, href }: { icon: React.ReactNode; title: string; desc: string; onClick?: () => void; href?: string }) {
  const cls = "group flex items-start gap-4 p-5 rounded-2xl bg-card border border-border hover:border-primary hover:shadow-soft transition-all text-start min-h-20 w-full";
  const inner = (
    <>
      <div className="h-14 w-14 rounded-xl bg-gradient-hero text-white inline-flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">{icon}</div>
      <div>
        <div className="font-bold text-base sm:text-lg text-foreground">{title}</div>
        <div className="text-sm text-muted-foreground mt-0.5">{desc}</div>
      </div>
    </>
  );
  if (href) return <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>{inner}</a>;
  return <button onClick={onClick} className={cls}>{inner}</button>;
}

function ServiceCard({ icon, image, title, doctor, desc, highlight }: { icon: React.ReactNode; image?: string; title: string; doctor?: string; desc: string; highlight?: boolean }) {
  return (
    <div className={`rounded-2xl overflow-hidden bg-card border ${highlight ? "border-primary shadow-soft" : "border-border"} hover:shadow-card transition-shadow flex flex-col`}>
      {image && <img src={image} alt="" className="h-44 w-full object-cover" />}
      <div className="p-6 flex-1 flex flex-col">
        <div className="h-12 w-12 rounded-xl bg-secondary text-primary inline-flex items-center justify-center mb-4">{icon}</div>
        <h3 className="text-lg font-bold text-foreground">{title}</h3>
        {doctor && <div className="text-sm text-primary font-semibold mt-1">{doctor}</div>}
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function DoctorCard({ name, specialty, desc }: { name: string; specialty: string; desc: string }) {
  return (
    <div className="rounded-2xl bg-card border border-border p-6 shadow-card flex gap-4">
      <div className="h-20 w-20 rounded-2xl bg-gradient-hero text-white inline-flex items-center justify-center text-2xl font-bold shrink-0">
        {name.split(" ")[1]?.[0]}{name.split(" ")[2]?.[0]}
      </div>
      <div>
        <h3 className="text-xl font-bold">{name}</h3>
        <div className="text-sm text-primary font-semibold">{specialty}</div>
        <p className="text-sm text-muted-foreground mt-2">{desc}</p>
      </div>
    </div>
  );
}

function SocialLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="h-11 w-11 inline-flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
      {children}
    </a>
  );
}
