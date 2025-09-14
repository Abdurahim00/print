"use client"

import { useAppSelector } from "@/lib/redux/hooks"
import { useTranslations } from "next-intl"
import Link from "next/link"
import Image from "next/image"
import { Instagram, Facebook, Mail, MapPin, Phone, LinkedinIcon } from "lucide-react"

export function Footer() {
  const t = useTranslations()

  return (
    <footer className="border-t border-primary/20 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300">
      <div className="container mx-auto py-8 sm:py-10 md:py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 md:gap-12">
          {/* Logo and Contact Information */}
          <div className="space-y-3 sm:space-y-4 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center">
              {/* Logo */}
              <div className="relative h-10 w-28 sm:h-12 sm:w-36">
                <Image 
                  src="/logo.png" 
                  alt="MR MERCH" 
                  fill 
                  className="object-contain" 
                  style={{ filter: "none" }}
                />
              </div>
            </div>
            <address className="not-italic text-xs sm:text-sm space-y-2">
              <div className="flex items-start gap-2">
                <MapPin size={14} className="text-primary mt-0.5 flex-shrink-0" />
                <span>Datavägen 12b, 442 32 Askim</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-primary flex-shrink-0" />
                <a href="mailto:info@mrmerch.se" className="hover:text-primary transition-colors break-all">
                  info@mrmerch.se
                </a>
              </div>
            </address>
            <div className="flex items-center space-x-3 sm:space-x-4 pt-2">
              <Link href="https://www.instagram.com/mr.merch.se?igsh=bnkxMXI4azhqNHlz" aria-label="Instagram" className="bg-primary/10 hover:bg-primary/20 p-1.5 sm:p-2 rounded-full transition-colors touch-manipulation">
                <Instagram size={16} className="sm:text-[18px] text-primary" />
              </Link>
              <Link href="https://www.facebook.com/share/1ANBooptVJ/?mibextid=wwXIfr" aria-label="Facebook" className="bg-primary/10 hover:bg-primary/20 p-1.5 sm:p-2 rounded-full transition-colors touch-manipulation">
                <Facebook size={16} className="sm:text-[18px] text-primary" />
              </Link>
              <Link href="https://www.linkedin.com/company/mr.merch/" aria-label="LinkedIn" className="bg-primary/10 hover:bg-primary/20 p-1.5 sm:p-2 rounded-full transition-colors touch-manipulation">
                <LinkedinIcon size={16} className="sm:text-[18px] text-primary" />
              </Link>
            </div>
          </div>

          {/* Information Links */}
          <div>
            <h3 className="font-bold text-base sm:text-lg mb-3 sm:mb-4 text-primary">{t("footer.information")}</h3>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
              <li>
                <Link href="/privacy-policy" className="hover:text-primary transition-colors inline-block py-0.5">
                  {t("footer.privacyPolicy")}
                </Link>
              </li>
              <li>
                <Link href="/shipping-returns" className="hover:text-primary transition-colors inline-block py-0.5">
                  {t("footer.shippingReturns")}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-primary transition-colors inline-block py-0.5">
                  {t("footer.termsOfPurchase")}
                </Link>
              </li>
              <li>
                <Link href="/gift-card" className="hover:text-primary transition-colors inline-block py-0.5">
                  {t("footer.giftCard")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h3 className="font-bold text-base sm:text-lg mb-3 sm:mb-4 text-primary">{t("footer.services")}</h3>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
              <li>
                <Link href="/locations" className="hover:text-primary transition-colors inline-block py-0.5">
                  {t("footer.place")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors inline-block py-0.5">
                  {t("footer.contactUs")}
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:text-primary transition-colors inline-block py-0.5">
                  {t("footer.support")}
                </Link>
              </li>
              <li>
                <Link href="/faqs" className="hover:text-primary transition-colors inline-block py-0.5">
                  {t("footer.faqs")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="font-bold text-base sm:text-lg mb-3 sm:mb-4 text-primary">{t("footer.signUpEmail")}</h3>
            <p className="mb-3 sm:mb-4 text-xs sm:text-sm">
              {t("footer.emailSignupDesc")}
            </p>
            <form className="space-y-2">
              <div className="relative">
                <input 
                  type="email" 
                  placeholder={t("footer.yourEmailAddress")} 
                  className="w-full px-3 sm:px-4 py-2 text-sm rounded-md border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white dark:bg-slate-800"
                  required
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2 px-3 sm:px-4 rounded-md transition-colors text-sm min-h-[40px] sm:min-h-[44px] touch-manipulation"
              >
                {t("footer.subscribe")}
              </button>
            </form>
          </div>
        </div>
      </div>
    </footer>
  )
}
