import Link from "next/link";
import { SiX as XIcon, SiGithub as GithubIcon } from '@icons-pack/react-simple-icons'
import ThemeSwitch from "@/components/theme-switch";
import { SITE_NAME } from "@/constants";

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/60 dark:bg-[#181a1f] dark:border-[#2c2c2e] shadow">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="py-6 md:py-8">
          {/* Responsive grid with better mobile spacing */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-6">
            {/* Legal Links */}
            <div className="space-y-3 md:space-y-4 flex flex-col items-center md:items-start">
              <h3 className="text-sm font-semibold text-foreground text-center md:text-left">Jogi</h3>
              <ul className="space-y-2 flex flex-col items-center md:items-start">
                <li>
                  <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground text-center md:text-left">
                    Felhasználási feltételek
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground text-center md:text-left">
                    Adatkezelési tájékoztató
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company Info */}
            <div className="space-y-3 md:space-y-4 flex flex-col items-center md:items-start">
              <h3 className="text-sm font-semibold text-foreground text-center md:text-left">Cég</h3>
              <ul className="space-y-2 flex flex-col items-center md:items-start">
                <li>
                  <Link href="/" className="text-sm text-muted-foreground hover:text-foreground text-center md:text-left">
                    Főoldal
                  </Link>
                </li>
              </ul>
            </div>

            {/* Social Links and Theme Switch */}
            <div className="space-y-3 md:space-y-4 flex flex-col items-center md:items-start">
              <h3 className="text-sm font-semibold text-foreground text-center md:text-left">Nézd meg egyéb oldalainkat is:</h3>
              <div className="flex items-center space-x-4">
                <a
                  href="https://yumekai.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <GithubIcon className="h-5 w-5" />
                  <span className="sr-only">Yumekai - AI kép és zene megosztó közösségi oldal</span>
                </a>
                <a
                  href="https://hswlp.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <XIcon className="h-5 w-5" />
                  <span className="sr-only">HSWLP</span>
                </a>
              </div>
            </div>
          </div>

          {/* Copyright - Optimized for mobile */}
          <div className="mt-6 pt-6 md:mt-8 md:pt-8 border-t">
            <p className="text-sm text-muted-foreground text-center mb-4">
              Blogocska – személyes jegyzeteid otthona. Működik a HSWLP platformon.
            </p>
            <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between md:gap-4">
              <p className="text-sm text-muted-foreground text-center md:text-left">
                © {new Date().getFullYear()} {SITE_NAME}. Minden jog fenntartva.
              </p>

              <div className="flex flex-col md:flex-row items-center gap-4 md:space-x-4">

                <div className="flex items-center gap-4">
                  <ThemeSwitch />

                  <a
                    href="https://agenticdev.agency"
                    target="_blank"
                    className="flex items-center font-medium text-sm hover:text-foreground transition-colors"
                  >
                    <span className="whitespace-nowrap">Készítette</span>
                    <span className="whitespace-nowrap">HSWLP csapata</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

