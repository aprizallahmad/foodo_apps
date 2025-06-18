# Gunakan image Node.js versi LTS sebagai base image
FROM node:20-alpine

# Set working directory di dalam kontainer
WORKDIR /app

# Salin package.json dan package-lock.json ke working directory
# Ini untuk memastikan dependensi terinstal sebelum kode aplikasi disalin,
# sehingga Docker bisa menggunakan cache layer untuk build yang lebih cepat
COPY package*.json ./

# Install dependensi proyek
RUN npm install

# Salin semua file proyek ke working directory
COPY . .

# Buat build production
RUN npm run build

# Expose port yang digunakan aplikasi React (default Vite: 5173)
EXPOSE 5173

# Perintah untuk menjalankan aplikasi saat kontainer dimulai
CMD ["npm", "run", "dev", "--", "--host"]