<script lang="ts" setup>
// Данные пользователя (заглушка)
import { ref } from 'vue';

const userInfo = ref({
  firstName: 'Иван',
  lastName: 'Иванов',
  email: 'ivan@example.com',
  interests: 'танцы, музыка, спорт',
  bio: 'Люблю активный отдых и новые знакомства.'
});

// Функции для вкладки "Общие настройки"
const saveUserInfo = () => {
  alert('Данные сохранены!');
  console.log('Обновлённые данные пользователя:', userInfo.value);
};
</script>

<template>
  <div class="general-settings">
    <h2 class="section-title">Общие настройки</h2>
    <form class="user-form" @submit.prevent="saveUserInfo">
      <div class="form-group">
        <label for="firstName">Имя:</label>
        <input
          id="firstName"
          v-model="userInfo.firstName"
          class="form-input"
          placeholder="Введите имя"
          type="text"
        />
      </div>
      <div class="form-group">
        <label for="lastName">Фамилия:</label>
        <input
          id="lastName"
          v-model="userInfo.lastName"
          class="form-input"
          placeholder="Введите фамилию"
          type="text"
        />
      </div>
      <div class="form-group">
        <label for="email">Почта:</label>
        <input
          id="email"
          v-model="userInfo.email"
          class="form-input"
          placeholder="Введите почту"
          type="email"
        />
      </div>
      <div class="form-group">
        <label for="interests">Интересы:</label>
        <input
          id="interests"
          v-model="userInfo.interests"
          class="form-input"
          placeholder="Например: танцы, музыка, спорт"
          type="text"
        />
      </div>
      <div class="form-group">
        <label for="bio">О себе:</label>
        <textarea
          id="bio"
          v-model="userInfo.bio"
          class="form-textarea"
          placeholder="Краткое описание профиля"
        ></textarea>
      </div>
      <button class="save-button" type="submit">Сохранить</button>
    </form>
  </div>
</template>

<style scoped>
.section-title {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin-bottom: 20px;
}
.user-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 600px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.form-input,
.form-textarea {
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 6px;
  outline: none;
  transition: border-color 0.3s ease;
}

.form-input:focus,
.form-textarea:focus {
  border-color: #ff6f61;
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.save-button {
  padding: 12px 24px;
  background: #ff6f61;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease;
}

.save-button:hover {
  background: #e65a50;
}
</style>
