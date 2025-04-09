<!-- src/widgets/FooterSection.vue -->
<template>
  <footer class="footer">
    <div class="footer-container">
      <!-- Название сайта -->
      <div class="footer-brand">
        <router-link :to="{ name: RouteNames.HOME }" class="footer-title"> DaevPulse </router-link>
        <p class="footer-slogan">Исследуйте мир событий</p>
      </div>

      <!-- Навигация -->
      <nav class="footer-nav">
        <h4 class="nav-title">Навигация</h4>
        <ul class="nav-list">
          <li>
            <router-link :to="{ name: RouteNames.HOME }" class="nav-link">Главная</router-link>
          </li>
          <li>
            <router-link :to="{ name: RouteNames.ABOUT }" class="nav-link">О нас</router-link>
          </li>
          <li>
            <router-link :to="{ name: RouteNames.CONTACT }" class="nav-link">Контакты</router-link>
          </li>
        </ul>
      </nav>

      <!-- Контакты -->
      <div class="footer-contacts">
        <h4 class="contacts-title">Контакты</h4>
        <ul class="contacts-list">
          <li>
            <a class="contact-link" href="mailto:info@daevpulse.com">info@daevpulse.com</a>
          </li>
          <li>
            <a class="contact-link" href="tel:+79991234567">+7 (999) 123-45-67</a>
          </li>
        </ul>
      </div>
    </div>

    <!-- Нижняя часть футера -->
    <div class="footer-bottom">
      <p class="footer-copyright">© 2025 DaevPulse. Все права защищены.</p>
    </div>
  </footer>
</template>

<script lang="ts" setup>
import { RouteNames } from '@/router';
</script>

<style scoped>
.footer {
  background: linear-gradient(90deg, #2d2d2d 0%, #4a4a4a 100%);
  color: #fff;
  padding: 60px 0 20px;
}

.footer-container {
  display: flex;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  gap: 40px;
}

.footer-brand {
  flex: 1;
}

.footer-title {
  font-size: 28px;
  font-weight: 700;
  color: #ffeb3b;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-title:hover {
  color: #fff;
}

.footer-slogan {
  font-size: 16px;
  color: #ccc;
  margin-top: 8px;
}

.footer-nav,
.footer-contacts {
  flex: 1;
}

.nav-title,
.contacts-title {
  font-size: 20px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 16px;
}

.nav-list,
.contacts-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.nav-link,
.contact-link {
  font-size: 16px;
  color: #ccc;
  text-decoration: none;
  transition: color 0.3s ease;
}

.nav-link:hover,
.contact-link:hover {
  color: #ffeb3b;
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 40px;
  padding-top: 20px;
  text-align: center;
}

.footer-copyright {
  font-size: 14px;
  color: #999;
}

@media (max-width: 767px) {
  .footer {
    padding: 40px 0 20px;
  }

  .footer-container {
    flex-direction: column;
    gap: 32px;
  }

  .footer-title {
    font-size: 24px;
  }

  .footer-slogan {
    font-size: 14px;
  }

  .nav-title,
  .contacts-title {
    font-size: 18px;
  }

  .nav-link,
  .contact-link {
    font-size: 14px;
  }

  .footer-bottom {
    margin-top: 32px;
  }

  .footer-copyright {
    font-size: 12px;
  }
}
</style>
