import { useState } from "react";
import { Menu, X, Globe, Phone } from "lucide-react";
import { useLang } from "@/lib/lang-context";
import { LANG_NAMES } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n";
import logo from "@/assets/logo.png";

export function Header() {
  const { lang, setLang, t } = useLang();
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const links = [
    { href: "#home", label: t.nav.home },
    { href: "#about", label: t.nav.about },
    { href: "#services", label: t.nav.services },
    { href: "#doctors", label: t.nav.doctors },
    { href: "#contact", label: t.nav.contact },
    { href: `/feedback?lang=${lang}`, label: lang === "hi" ? "फीडबैक" : lang === "ur" ? "فیڈبیک" : "Feedback" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-background border-b border-border">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-3">
        <a href="#home" className="flex items-center gap-2 min-w-0">
          <img src={logo} alt="Dhreeti Clinic" className="h-11 w-11 object-contain" />
          <div className="min-w-0">
            <div className="font-bold text-base sm:text-lg leading-tight text-primary truncate">Dhreeti Clinic</div>
            <div className="text-[10px] sm:text-xs text-muted-foreground truncate">{t.tagline}</div>
          </div>
        </a>

        <nav className="hidden lg:flex items-center gap-6">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm font-medium hover:text-primary transition-colors">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a href="tel:+919901515300" className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-primary">
            <Phone className="h-4 w-4" /> +91 99015 15300
          </a>

          <div className="relative">
            <button
              onClick={() => setLangOpen((v) => !v)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border hover:bg-muted text-sm font-medium min-h-11"
              aria-label="Language"
            >
              <Globe className="h-4 w-4" />
              <span>{LANG_NAMES[lang]}</span>
            </button>
            {langOpen && (
              <div className="absolute end-0 mt-2 w-40 bg-card rounded-lg border border-border shadow-card overflow-hidden">
                {(Object.keys(LANG_NAMES) as Lang[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => { setLang(l); setLangOpen(false); }}
                    className={`w-full text-start px-4 py-3 text-sm hover:bg-muted ${lang === l ? "bg-secondary text-primary font-semibold" : ""}`}
                  >
                    {LANG_NAMES[l]}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden p-2 rounded-lg border border-border min-h-11 min-w-11"
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-card">
          <nav className="container mx-auto px-4 py-3 flex flex-col">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="py-3 text-base font-medium border-b border-border last:border-0"
              >
                {l.label}
              </a>
            ))}
            <a href="tel:+919901515300" className="mt-2 inline-flex items-center gap-2 text-primary font-semibold py-3">
              <Phone className="h-4 w-4" /> +91 99015 15300
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
