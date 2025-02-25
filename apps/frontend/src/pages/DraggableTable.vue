<script setup>
import { computed, ref } from 'vue';
import Draggable from 'vuedraggable';

// 🟢 Массив с данными
const items = ref([
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' },
  { id: 3, name: 'Item 3' },
  { id: 4, name: 'Item 4' }
]);

// 🟢 Список выбранных элементов
const selectedItems = ref([]);
const draggingSingle = ref(false); // Флаг одиночного перетаскивания

// 🔵 Проверка, выбран ли элемент
const isSelected = (id) => selectedItems.value.includes(id);

// 🔵 Проверка, все ли элементы выбраны
const allSelected = computed(
  () => items.value.length > 0 && items.value.every((item) => selectedItems.value.includes(item.id))
);

// 🔵 Выделение или снятие выделения со всех элементов
const toggleAll = () => {
  if (allSelected.value) {
    selectedItems.value = [];
  } else {
    selectedItems.value = items.value.map((item) => item.id);
  }
};

// 🔵 Обработка начала перетаскивания
const onMouseDown = (id, event) => {
  if (!event.target.matches('input[type="checkbox"]')) {
    // Если клик не по чекбоксу — одиночное перетаскивание
    draggingSingle.value = true;
    selectedItems.value = [id];
  } else {
    // Если клик по чекбоксу — групповой выбор
    draggingSingle.value = false;
  }
};

// 🔵 Проверка возможности перемещения
const onMove = (event) => {
  if (draggingSingle.value) return true;
  const draggedId = event.draggedContext.element.id;
  return selectedItems.value.includes(draggedId);
};

// 🔵 Обработка завершения перетаскивания
const onEnd = (event) => {
  if (selectedItems.value.length > 1) {
    const movedGroup = items.value.filter((item) => selectedItems.value.includes(item.id));
    const others = items.value.filter((item) => !selectedItems.value.includes(item.id));

    items.value = [
      ...others.slice(0, event.newIndex),
      ...movedGroup,
      ...others.slice(event.newIndex)
    ];
  }
};
</script>

<template>
  <table>
    <thead>
      <tr>
        <th>
          <input :checked="allSelected" type="checkbox" @change="toggleAll" />
        </th>
        <th>ID</th>
        <th>Name</th>
      </tr>
    </thead>

    <!-- Используем Draggable, где компонент уже правильно обрабатывает событие на move и end -->
    <Draggable v-model="items" :move="onMove" tag="tbody" @end="onEnd">
      <template #default="{ element }">
        <tr
          v-for="item in items"
          :key="item.id"
          :class="{ selected: isSelected(item.id) }"
          @mousedown="onMouseDown(item.id, $event)"
        >
          <td>
            <input v-model="selectedItems" :value="item.id" type="checkbox" @click.stop />
          </td>
          <td>{{ item.id }}</td>
          <td>{{ item.name }}</td>
        </tr>
      </template>
    </Draggable>
  </table>
</template>

<style scoped>
.selected {
  background-color: #f0f0f0;
}
</style>
