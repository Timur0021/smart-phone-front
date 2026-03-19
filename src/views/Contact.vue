<template>
  <div class="page">
    <Breadcrumbs title="Контакти" />

    <h1 class="title" v-if="blocks.length">
      {{ getTitle(blocks[0] ?? { id: '', name: '', type: '', block: [] }) }}
    </h1>

    <div class="content">
      <div class="left">
        <h2>Зв'яжіться з нами</h2>

        <div class="info">
          <div class="item" v-for="(item, index) in contacts" :key="index">
            <p class="label">{{ item.label }}</p>
            <p>{{ item.value }}</p>
          </div>
        </div>
      </div>

      <div class="right">
        <h2>Виникли питання? Напишіть нам</h2>

        <p class="text">
          Залиште своє повідомлення, і ми відповімо якнайшвидше
        </p>

        <button class="btn" @click="showPopup = true">
          Написати
        </button>

        <div v-if="showPopup" class="popup">
          <div class="popup-overlay" @click="showPopup = false"></div>

          <div class="popup-box">
            <button class="close" @click="showPopup = false">×</button>

            <h2>Напишіть нам</h2>

            <form class="form" @submit.prevent="sendFeedback">
              <div class="row">
                <input type="text" placeholder="Ім'я" v-model="firstName">
                <input type="text" placeholder="Телефон" v-model="phone">
              </div>

              <input type="email" placeholder="Email" v-model="email">

              <div class="rating">
                <label class="rating-label">Оцінка:</label>

                <StarRatings
                    v-model="rating"
                    :numberOfStars="5"
                    :starSize="50"
                    :step="0.5"
                    starColor="#f5a623"
                    inactiveColor="#ccc"
                />
              </div>

              <textarea placeholder="Повідомлення" v-model="message"></textarea>

              <button
                  type="submit"
                  class="send"
                  :disabled="sending"
              >
                {{ sending ? "Відправка..." : "Відправити" }}
              </button>
            </form>
          </div>
        </div>

        <div class="social">
          <p class="label">Соціальні мережі:</p>
          <div class="icons">
            <a href="https://facebook.com" target="_blank" class="icon-link">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#1877F2" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 12C22 6.48 17.52 2 12 2S2 6.48 2 12c0 5 3.66 9.13 8.44 9.88v-6.99H7.9v-2.89h2.54V9.83c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.45h-1.25c-1.23 0-1.61.77-1.61 1.56v1.87h2.74l-.44 2.89h-2.3v6.99C18.34 21.13 22 17 22 12z"/>
              </svg>
            </a>

            <a href="https://instagram.com" target="_blank" class="icon-link">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#E1306C" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 2C4.238 2 2 4.238 2 7v10c0 2.762 2.238 5 5 5h10c2.762 0 5-2.238 5-5V7c0-2.762-2.238-5-5-5H7zm10 1.5c1.379 0 2.5 1.121 2.5 2.5v10c0 1.379-1.121 2.5-2.5 2.5H7c-1.379 0-2.5-1.121-2.5-2.5V6c0-1.379 1.121-2.5 2.5-2.5h10zM12 7a5 5 0 100 10 5 5 0 000-10zm0 1.5a3.5 3.5 0 110 7 3.5 3.5 0 010-7zm4.75-2.25a1.25 1.25 0 11-2.5 0 1.25 1.25 0 012.5 0z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import Breadcrumbs from "@/views/Breadcrumbs.vue";
import StarRatings from "vue3-star-ratings";
import { apolloClient } from "@/graphql/apolloClient.ts";
import { GET_PAGE } from "@/graphql/queries/page/page.ts";
import { GET_SETTINGS } from "@/graphql/queries/settings/settings.ts";
import { CREATE_FEEDBACK } from "@/graphql/mutations/pages/feedback.ts";
import { useToast } from "vue-toastification";

const toast = useToast();


const showPopup = ref(false);
const rating = ref(0);
const firstName = ref("");
const phone = ref("");
const email = ref("");
const message = ref("");
const sending = ref(false);
const blocks = ref<PageBlock[]>([]);
const contacts = ref<{ label: string; value: string }[]>([]);

interface BlockDataItem {
  key: string;
  type: string;
  value?: any;
  items?: BlockDataItem[];
}

interface BlockItem {
  type: string;
  data: BlockDataItem[];
}

interface PageBlock {
  id: string;
  name: string;
  type: string;
  block: BlockItem[];
}

const sendFeedback = async () => {
  if (!firstName.value || !phone.value || !email.value || !message.value) {
    toast.warning("Всі поля обов'язкові");
    return;
  }

  try {
    sending.value = true;

    const { data } = await apolloClient.mutate({
      mutation: CREATE_FEEDBACK,
      variables: {
        first_name: firstName.value,
        phone: phone.value,
        email: email.value,
        mark: rating.value,
        message: message.value,
      }
    });

    if (data?.createFeedback?.status) {
      toast.success("Повідомлення відправлено");
    } else {
      toast.error("Помилка відправки");
    }

    firstName.value = "";
    phone.value = "";
    email.value = "";
    message.value = "";
    rating.value = 0;

    showPopup.value = false;
  } catch (e) {
    console.error(e);
    toast.error("Сталася помилка при відправці")
  } finally {
    sending.value = false;
  }
}

onMounted(async () => {
    try {
      const { data: perData } = await apolloClient.query({
        query: GET_PAGE,
        variables: { slug: "kontakti" },
      }) as any;

      blocks.value = perData.page.blocks;

      const { data } = await apolloClient.query({ query: GET_SETTINGS }) as any;
      const settings = data.settings.settings;
      const textInSite = data.settings.text_in_site;

      if (blocks.value.length && blocks.value[0]) {
        contacts.value = getContactsFromBlock(blocks.value[0], settings, textInSite);
      }
    } catch (e) {
      console.error(e);
      toast.error("Сталася помилка при зєднані")
    }
})

watch(rating, (val) => {
  rating.value = Math.round(val * 2) / 2
})

function getTitle(block: PageBlock) {
  const titleBlock = block.block.find((b) => b.type === "title");

  if (!titleBlock) return "";

  const titleField = titleBlock.data.find((d) => d.key === "title");

  return titleField?.value ?? "";
}

function getContactsFromBlock(block: PageBlock, settings: any[], textInSite: any[]) {
  const listBlock = block.block.find(b => b.type === 'text_list');
  if (!listBlock) return [];

  const itemsField = listBlock.data.find(d => d.key === 'items');
  if (!itemsField?.items) return [];

  return itemsField.items.map((item: any) => {
    const textField = item.data.find((d: any) => d.key === 'text_item');
    const label = textField?.value ?? '';

    let value = '';
    const lowerLabel = label.toLowerCase();

    const mapping: Record<string, () => string> = {
      'телефон': () => settings.find(s => s.key === 'phone')?.value ?? '',
      'email': () => settings.find(s => s.key === 'email')?.value ?? '',
      'адреса': () => settings.find(s => s.key === 'address')?.value ?? '',
      'графік': () => textInSite.find(t => t.key === 'working_hours')?.text ?? ''
    };

    for (const key in mapping) {
      const fn = mapping[key];
      if (lowerLabel.includes(key) && fn) {
        value = fn();
        break;
      }
    }

    return { label, value };
  });
}
</script>

<style scoped>
.page {
  padding: 20px 0;
  font-family: 'Helvetica Neue', Arial, sans-serif;
}
.title {
  font-size: 50px;
  font-weight: 700;
  margin-top: 10px;
  margin-bottom: 20px;
  margin-left: 210px;
  font-family: 'Helvetica Neue', Arial, sans-serif;
}

.content {
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-right: 5rem;
}

.left {
  width: 650px;
  background: rgb(177, 206, 237);
  padding: 20px 60px 60px 60px;
  border-radius: 15px;
}

.left h2 {
  font-size: 50px;
  font-weight: 700;
  margin: 0 0 30px 0;
  padding: 0;
}

.label {
  font-weight: 700;
  font-size: 28px;
  margin: 0;
}

.item p:not(.label) {
  font-size: 28px;
  margin: 18px 0 0 0;
}

.item {
  margin-bottom: 35px;
}

.social {
  margin-top: 40px;
}

.icons {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.right {
  width: 700px;
  background: linear-gradient(rgba(255,255,255,0.7), rgba(255,255,255,0.7)),
  url('src/assets/caracter-empresarial-confuso-que-toma-decision-importante_74855-20080.avif') no-repeat center center;
  background-size: cover;
  padding: 20px 60px 60px 60px;
  border-radius: 6px;
  color: black;
  position: relative;
}

.right h2 {
  font-size: 50px;
  font-weight: 700;
  margin: 0 0 30px 0;
  padding: 0;
}

.right .text {
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 50px 0;
}

.btn {
  background: #1e73ff;
  color: white;
  border: none;
  padding: 21px 36px;
  font-size: 24px;
  border-radius: 4px;
  cursor: pointer;
}


.btn:hover {
  background: #0f5fe0;
}

.right .social {
  position: absolute;
  bottom: 20px;
  left: 60px;
  display: block;
}

.right .social .label {
  margin-bottom: 25px;
  font-size: 28px;
  font-weight: 700;
}

.right .social .icons {
  display: flex;
  gap: 15px;
}

.right .social .icons a svg {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: #e5e5e5;
  padding: 6px;
}

.right .social .icons a:hover svg {
  background: #adc3f5;
}

.popup {
  position: fixed;
  inset: 0;
  z-index: 1000;
}

.popup-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.5);
}

.popup-box {
  position: relative;
  width: 500px;
  background: white;
  padding: 30px;
  border-radius: 10px;
  margin: 100px auto;
  z-index: 2;
}

.close {
  position: absolute;
  right: 10px;
  top: 5px;
  font-size: 28px;
  border: none;
  background: none;
  cursor: pointer;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.row {
  display: flex;
  gap: 10px;
}

.row input {
  width: 100%;
}

input,
textarea {
  padding: 12px;
  font-size: 16px;
  border: 1px solid #ccc;
}

textarea {
  min-height: 120px;
  resize: none;
}

.send {
  background: #1e73ff;
  color: white;
  border: none;
  padding: 14px;
  font-size: 18px;
  cursor: pointer;
  border-radius: 8px;
}

.send:hover {
  background: #0f5fe0;
}

.rating {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px 0 5px 0;
}

.rating-label {
  font-weight: 700;
  font-size: 18px;
  margin-bottom: 5px;
}

@media (min-width: 2560px) {
  .title {
    font-size: 50px;
    font-weight: 700;
    margin-top: 10px;
    margin-bottom: 20px;
    margin-left: 390px;
    font-family: 'Helvetica Neue', Arial, sans-serif;
  }
  .left,
  .right {
    width: 700px;
  }

  .form input,
  .form textarea {
    width: 100%;
    box-sizing: border-box;
    padding: 19px;
    font-size: 18px;
    border: 1px solid #ccc;
  }

  textarea {
    min-height: 120px;
    resize: none;
  }

}
</style>