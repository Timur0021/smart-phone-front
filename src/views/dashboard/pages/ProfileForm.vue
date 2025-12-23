<template>
  <div class="profile-form-wrapper">
    <div class="profile-form">
      <form @submit.prevent="handleSubmit">
        <div class="avatar-info-row">
          <div class="avatar-upload">
            <label class="avatar-button">
              <template v-if="previewImage || user.image">
                <img :src="previewImage || user.image" alt="avatar" class="avatar"/>
              </template>
              <template v-else>
                <div class="avatar-placeholder">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" width="64" height="64">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
              </template>
              <input type="file" @change="handleImageChange" />
            </label>
          </div>

          <div class="user-info">
            <div class="user-name">{{ user.name }} {{ user.last_name }}</div>
            <div class="user-phone">{{ user.phone }}</div>
          </div>
        </div>

        <h2 class="form-section-title">Особисті дані</h2>

        <div class="form-grid">
          <div class="form-group">
            <label>Ім'я</label>
            <input type="text" v-model="form.name" placeholder="Введіть ім'я" />
          </div>

          <div class="form-group">
            <label>Прізвище</label>
            <input type="text" v-model="form.last_name" placeholder="Введіть прізвище" />
          </div>

          <div class="form-group">
            <label>Email</label>
            <input type="email" v-model="form.email" placeholder="Введіть email" />
          </div>

          <div class="form-group">
            <label>Телефон</label>
            <input type="tel" v-model="form.phone" placeholder="Введіть телефон" />
          </div>

          <div class="form-group">
            <label>Пароль</label>
            <input type="password" v-model="form.password" autocomplete="new-password" placeholder="Введіть новий пароль" />
          </div>
        </div>

        <div class="button-wrapper">
          <button type="submit" class="save-btn">Зберегти</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { apolloClient} from "@/graphql/apolloClient.ts";
import { UPDATE_PERSONAL_DATA} from "@/graphql/mutations/customer-dashboard/updatePersonalData.ts";
import { GET_CURRENT_USER } from "@/graphql/queries/customer-dashboard/getCurrentUser.ts";

const toast = useToast();

const user = reactive({
  id: null as number | null,
  name: '',
  last_name: '',
  email: '',
  phone: '',
  password: '',
  image: ''
});

const form = reactive<{
  name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  image: File | null;
}>({
  name: user.name,
  last_name: user.last_name,
  email: user.email,
  phone: user.phone,
  password: '',
  image: null,
});

const previewImage = ref<string | null>(null);

const uploadTemporaryFile = async (file: File): Promise<number | null> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const res = await fetch('http://smart-phone.test/api/temporary-files', {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });


    if (!res.ok) {
      toast.error('Помилка завантаження фото');
      return null;
    }

    const data = await res.json();

    if (!data.temporaryFile) {
      toast.error('Не вдалося отримати ID файлу');
      return null;
    }

    if (typeof data.temporaryFile === 'number') {
      return data.temporaryFile;
    }

    return data.temporaryFile.id ?? null;
  } catch (error) {
    console.error(error);
    toast.error('Помилка зʼєднання з сервером');
    return null;
  }
};

const handleImageChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    form.image = target.files[0];
    previewImage.value = URL.createObjectURL(target.files[0]);
  }
};

const handleSubmit = async () => {
  const input: Record<string, any> = {};

  if (form.name !== user.name) input.name = form.name;
  if (form.last_name !== user.last_name) input.last_name = form.last_name;
  if (form.email !== user.email) input.email = form.email;
  if (form.phone !== user.phone) input.phone = form.phone;
  if (form.password) input.password = form.password;

  if (form.image) {
    const temporaryFileId = await uploadTemporaryFile(form.image);
    if (!temporaryFileId) return;
    input.image = temporaryFileId;
  }

  if (Object.keys(input).length === 0) {
    toast.info('Немає змін для оновлення');
    return;
  }

  try {
    const result = await apolloClient.mutate({
      mutation: UPDATE_PERSONAL_DATA,
      variables: { input },
      context: {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      },
    });

    toast.success('Дані успішно оновлені!');
    Object.assign(user, input);
  } catch (e) {
    console.error(e);
    toast.error('Помилка при оновленні даних');
  }
};

onMounted(async () => {
  try {
    const { data } = await apolloClient.query({
      query: GET_CURRENT_USER,
      fetchPolicy: 'no-cache',
      context: {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    });

    if (data?.currentUser) {
      Object.assign(user, data.currentUser);

      form.name = user.name;
      form.last_name = user.last_name;
      form.email = user.email;
      form.phone = user.phone;
    }
  } catch (e) {
    console.error(e);
  }
});
</script>

<style scoped>
.profile-form-wrapper {
  display: flex;
  justify-content: flex-start;
  padding-top: 90px;
  padding-left: 50px;
  width: 100%;
}

.profile-form {
  width: 850px;
  background: #ffffff;
  padding: 60px;
  border-radius: 16px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.12);
  position: relative;
}

.avatar-info-row {
  display: flex;
  align-items: center;
  gap: 25px;
  margin-bottom: 40px;
}

.avatar-upload {
  display: flex;
  justify-content: flex-start;
}

.avatar-button input[type="file"] {
  display: none;
}

.avatar-button {
  display: block;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  position: relative;
}

.avatar-button .avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.avatar-placeholder {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: silver;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
}

.user-phone {
  font-size: 1.4rem;
  color: #4b5563;
  margin-top: 10px;
}

.form-section-title {
  font-size: 1.6rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 25px;
  margin-left: 0;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  margin-bottom: 25px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 8px;
  font-weight: 500;
  color: #374151;
}

.form-group input {
  padding: 14px 18px;
  border-radius: 10px;
  border: 1px solid #d1d5db;
  outline: none;
  transition: all 0.2s;
  font-size: 1.05rem;
}

.form-group input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59,130,246,0.2);
}

.button-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 70px;
}

.save-btn {
  background-color: #3b82f6;
  color: #ffffff;
  padding: 16px 36px;
  border-radius: 16px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
  font-size: 1.2rem;
}

.save-btn:hover {
  background-color: #2563eb;
}
</style>
