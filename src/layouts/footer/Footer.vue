<template>
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-top">
        <div class="footer-logo-social">
          <RouterLink to="/" class="logo">
            Cyberon
          </RouterLink>

          <div class="socials">
            <a target="_blank" href="https://www.facebook.com/teaua.marketplace/" class="social-icon">
              <svg viewBox="0 0 12 23" fill="currentColor" xmlns="http://www.w3.org/2000/svg" class="social-svg">
                <path d="M7.823 12.784h3.07l.577-4.077H7.823V6.069c0-1.115.51-2.2 2.143-2.2h1.659V.4A18.9 18.9 0 0 0 8.683.125c-2.998 0-4.967 1.95-4.967 5.482v3.1H.375v4.072h3.34v9.846H7.82l.004-9.84Z"/>
              </svg>
            </a>
            <a target="_blank" href="https://www.instagram.com/teaua_marketplace/#" class="social-icon">
              <svg viewBox="0 0 30 30" fill="currentColor" xmlns="http://www.w3.org/2000/svg" class="social-svg">
                <path d="M20.021 2.5H9.934A7.443 7.443 0 0 0 2.5 9.935v10.088a7.442 7.442 0 0 0 7.435 7.433h10.088a7.442 7.442 0 0 0 7.433-7.435V9.934A7.443 7.443 0 0 0 20.021 2.5Z"/>
                <path d="M14.978 8.524a6.462 6.462 0 0 0-6.453 6.454 6.462 6.462 0 0 0 6.454 6.455 6.462 6.462 0 0 0 6.455-6.455 6.463 6.463 0 0 0-6.456-6.453ZM21.445 10.119a1.546 1.546 0 1 0 0-3.093 1.546 1.546 0 0 0 0 3.093Z"/>
              </svg>
            </a>
          </div>
        </div>

        <div class="footer-menu">
          <div class="menu-section">
            <p class="menu-title">Про компанію</p>
            <ul>
              <FooterLink href="/pro-nas/" text="Про нас"/>
              <FooterLink href="/action/" text="Акції"/>
              <FooterLink href="/blog/" text="Блог"/>
              <FooterLink href="/brendy/" text="Бренди"/>
              <FooterLink href="/kontakti/" text="Контакти"/>
            </ul>
          </div>
          <div class="menu-section">
            <p class="menu-title">Покупцеві</p>
            <ul>
              <FooterLink href="/requisites/" text="Реквізити компанії"/>
              <FooterLink href="/umovi-vikoristannya-saytu/" text="Умови використання сайту"/>
              <FooterLink href="/dogovir-oferti/" text="Договір оферти"/>
              <FooterLink href="/dostavka/" text="Оплата та доставка"/>
            </ul>
          </div>
        </div>

        <div class="footer-contacts">
          <ContactBlock label="Телефон" value="+380504741854" link="tel:+380504741854"/>
          <ContactBlock label="Графік роботи" value="9:00-18:00; сб, нд-вихідні"/>
          <ContactBlock label="Email" value="info@tea.ua" link="mailto:info@tea.ua"/>
          <ContactBlock label="Адреса" value="02100 Київська обл., м. Обухів, вул. Трипільська, 46"/>
        </div>

      </div>

      <hr class="footer-divider"/>
      <div class="footer-bottom">
        <p class="footer-text">©TEA.ua © 2025. Всі права захищені</p>
        <RouterLink class="footer-link" to="/privacy-policy/">Політика конфіденційності</RouterLink>
        <div class="footer-bottom-right">
          <RouterLink target="_blank" class="footer-link dev-link" to="https://seok.ua/">
            <svg viewBox="0 0 20 18" fill="currentColor" xmlns="http://www.w3.org/2000/svg" class="dev-svg">
              <path d="M5.839 4.913c0 .534-.122 1-.366 1.399a2.51 2.51 0 0 1-1.023.933c-.439.223-.948.335-1.53.335-.582 0-1.092-.112-1.53-.335a2.516 2.516 0 0 1-1.024-.933C.122 5.912 0 5.447 0 4.913c0-.533.122-.998.366-1.398.245-.398.586-.71 1.023-.932.439-.224.948-.336 1.531-.336s1.091.112 1.53.336c.437.223.779.534 1.023.932.244.4.366.866.366 1.398Z"/>
            </svg>
            <span>Розробка та просування.</span>
          </RouterLink>
          <div class="language-switcher">
            <span class="lang-active">ua</span>
            <span>ru</span>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import FooterLink from './FooterLink.vue'
import ContactBlock from './ContactBlock.vue'
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.footer {
  background-color: #2563EB;
  color: #FFFFFF;
  margin-top: 4rem;
  border-radius: 15px;
  font-family: 'Helvetica Neue', Arial, sans-serif;
}

.footer-container {
  max-width: 1440px;
  margin: 0 auto;
  padding: 2.5rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.footer-top {
  display: flex;
  flex-direction: column;
  gap: 15rem;
}

.footer-logo-social {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.logo {
  font-weight: bold;
  font-size: 50px;
  color: #ffffff;
  text-decoration: none;
  margin-right: 90px;
}

.socials {
  display: flex;
  gap: 0.75rem;
}

.social-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: #FFFFFF;
  color: #1C1C1C;
  border-radius: 50%;
  transition: all 0.3s;
}

.social-icon:hover {
  background-color: #333333;
  color: #FFFFFF;
}

.social-svg {
  width: 24px;
  height: 24px;
}

.footer-menu {
  display: flex;
  gap: 4rem;
}

.menu-section {
  display: flex;
  flex-direction: column;
}

.menu-title {
  font-weight: bold;
  font-size: 1.125rem;
  margin-bottom: 0.5rem;
}

.menu-section ul {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.footer-contacts {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 0.90rem;
}
.contact-block .label {
  font-weight: bold;
  min-width: 120px;
}

.footer-divider {
  height: 1px;
  background-color: #444;
  border: none;
  margin: 1.25rem 0;
}

.footer-bottom {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: flex-start;
  font-size: 0.875rem;
}

.footer-link {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  transition: color 0.3s;
}

.footer-link:hover {
  color: #FFFFFF;
}

.footer-bottom-right {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 0.5rem;
}

.dev-svg {
  width: 18px;
  height: 18px;
  margin-right: 0.25rem;
}

.language-switcher {
  display: grid;
  grid-template-columns: 1fr 1fr;
  border: 1px solid #666;
  border-radius: 0.5rem;
  overflow: hidden;
  font-weight: bold;
}

.language-switcher span {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.25rem 0;
  text-transform: uppercase;
}

.language-switcher .lang-active {
  background-color: #FFFFFF;
  color: #1C1C1C;
}

@media(min-width: 1024px) {
  .footer-container {
    padding: 5rem 5rem;
  }

  .footer-top {
    flex-direction: row;
    gap: 5rem;
  }

  .logo {
    width: 258px;
    height: 60px;
  }

  .social-icon {
    width: 48px;
    height: 48px;
  }

  .social-svg {
    width: 32px;
    height: 32px;
  }

  .footer-menu {
    gap: 6rem;
  }

  .footer-bottom {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
