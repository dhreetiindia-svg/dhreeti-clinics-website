import { Facebook, Instagram, Youtube, Mail, MapPin } from "lucide-react";
import { useLang } from "@/lib/lang-context";
import logo from "@/assets/logo.png";

export function Footer() {
  const { t } = useLang();
  return (
    <footer className="bg-foreground text-background py-12">
      {/* index.tsx वाला footer का अंदर का कोड ज्यों का त्यों यहाँ */}
    </footer>
  );
}

function SocialLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="h-11 w-11 inline-flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
      {children}
    </a>
  );
}
