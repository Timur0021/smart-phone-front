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
              <svg viewBox="0 0 448 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg" class="social-svg">
                <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9S160.5 370.9 224.1 370.9 339 319.6 339 256 287.7 141 224.1 141zm0 189.6c-41.2 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.5 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.9-26.9 26.9s-26.9-12-26.9-26.9 12-26.9 26.9-26.9 26.9 12 26.9 26.9zm76.1 27.2c-1.7-35.9-9.9-67.7-36-93.8s-58-34.3-93.8-36c-37-2.1-147.8-2.1-184.8 0-35.9 1.7-67.7 9.9-93.8 36S9.7 123.6 8 159.5c-2.1 37-2.1 147.8 0 184.8 1.7 35.9 9.9 67.7 36 93.8s58 34.3 93.8 36c37 2.1 147.8 2.1 184.8 0 35.9-1.7 67.7-9.9 93.8-36s34.3-58 36-93.8c2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.5 42.5-29.4 11.7-99.3 9-132.3 9s-102.9 2.6-132.3-9c-19.6-7.8-34.7-22.9-42.5-42.5-11.7-29.4-9-99.3-9-132.3s-2.6-102.9 9-132.3c7.8-19.6 22.9-34.7 42.5-42.5 29.4-11.7 99.3-9 132.3-9s102.9-2.6 132.3 9c19.6 7.8 34.7 22.9 42.5 42.5 11.7 29.4 9 99.3 9 132.3s2.7 102.9-9 132.3z"/>
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
        <p class="footer-text">© CYBERON.ua © 2025. Всі права захищені</p>
        <RouterLink class="footer-text footer-link-center" to="/privacy-policy/">
          Політика конфіденційності
        </RouterLink>
        <div class="footer-bottom-right">
          <RouterLink target="_blank" class="footer-link dev-link" to="https://seok.ua/">
            <span>Розробка та просування.</span>
          </RouterLink>
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
  background-color: #5985eb;
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
  align-items: flex-start;
}

.menu-title {
  font-weight: 900;
  font-size: 1.30rem;
  margin-bottom: 0.5rem;
  white-space: nowrap;
}

.menu-section ul {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin: 1rem 0 0 0;
  padding: 0;
  list-style: none;
}

.menu-section ul li {
  padding-left: 0;
  margin-left: 0;
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
  background-color: #FFFFFF;
  border: none;
  margin: 1.25rem 0;
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.25rem;
  font-weight: bold;
  font-family: 'Helvetica Neue', Arial, sans-serif;
  gap: 1rem;
}

.footer-text {
  margin: 0;
  letter-spacing: 0.5px;
}

.footer-link-center {
  text-align: center;
  flex: 1;
  color: #FFFFFF;
  text-decoration: none;
  transition: color 0.3s;
}

.footer-link-center:hover {
  color: #FFFFFF;
}

.footer-bottom-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.footer-link {
  color: #FFFFFF;
  text-decoration: none;
  transition: color 0.3s;
  margin-bottom: 0.50rem;
}

.footer-bottom-right {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 0.5rem;
}

.language-switcher span {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.25rem 0;
  text-transform: uppercase;
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
