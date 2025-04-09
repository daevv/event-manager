# Используем официальный Node.js образ в качестве основы
FROM node:20

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app

# Копируем только файлы, необходимые для установки зависимостей
COPY package.json yarn.lock turbo.json ./
COPY apps/*/package.json ./apps/
COPY packages/*/package.json ./packages/

# Устанавливаем turbo глобально
RUN npm install -g turbo

# Устанавливаем зависимости
RUN npm install

# Копируем остальные файлы приложения в контейнер
COPY . .

# Билдим проект
RUN npm run build

# Открываем порт, который будет использоваться для приложения
EXPOSE 3000

# Запускаем проект
CMD ["npm", "run", "dev"]