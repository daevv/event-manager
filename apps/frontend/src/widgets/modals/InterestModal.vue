<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal">
      <h3>Выберите интересы</h3>
      <div class="interests-container">
        <div
          v-for="interest in availableInterests"
          :key="interest"
          :class="['interest-tag', isInterestSelected(interest) ? 'selected' : '']"
          @click="toggleInterest(interest)"
        >
          <span v-if="isInterestSelected(interest)" class="remove">✖</span>
          {{ interest }}
        </div>
      </div>
      <button class="save-button" @click="confirmChanges">Готово</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineEmits, defineProps, ref } from 'vue';

const availableInterests = ref([
  'музыка',
  'образование',
  'искусство',
  'видеоигры',
  'книги',
  'спорт',
  'кино',
  'путешествия',
  'технологии'
]);

const props = defineProps({
  interests: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['update:interests', 'close']);

const toggleInterest = (interest: string) => {
  const index = props.interests.indexOf(interest);
  if (index > -1) {
    props.interests.splice(index, 1);
  } else {
    props.interests.push(interest);
  }
};

const isInterestSelected = (interest: string) => props.interests.includes(interest);

const closeModal = () => emit('close');
const confirmChanges = () => {
  emit('update:interests', [...props.interests]);
  closeModal();
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 500px;
  width: 100%;
}

.interests-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.interest-tag {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 20px;
  cursor: pointer;
}

.interest-tag.selected {
  background-color: green;
  color: white;
}

.remove {
  margin-left: 10px;
  cursor: pointer;
  font-weight: bold;
}

.save-button {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 5px;
  font-size: 16px;
}
</style>
