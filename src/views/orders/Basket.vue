<template>
  <section class="basket-page">
    <div class="container">
      <h1 class="page-title">Кошик</h1>

      <div class="basket-layout">
        <div class="basket-items">
          <div class="basket-item" v-for="item in products" :key="item.id">
            <img
                :src="item.image"
                :alt="item.name"
                class="product-image"
            />

            <div class="product-info">
              <h3>{{ item.name }}</h3>
              <p class="sku">Артикул: {{ item.code }}</p>
            </div>

            <div class="quantity-block">
              <button @click="decrease(item)">−</button>
              <span>{{ item.quantity }}</span>
              <button @click="increase(item)">+</button>
            </div>

            <div class="price-block">
              {{ item.price * item.quantity }} ₴
            </div>

            <button class="remove-btn">
              ✕
            </button>
          </div>
        </div>

        <aside class="order-summary">
          <h2>Ваше замовлення</h2>

          <div class="summary-row">
            <span>Товарів</span>
            <span>{{ totalItems }}</span>
          </div>

          <div class="summary-row total">
            <span>До сплати</span>
            <span>{{ totalPrice }} ₴</span>
          </div>

          <button class="checkout-btn">
            Оформити замовлення
          </button>
        </aside>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

const products = ref([
  {
    id: 1,
    name: "iPhone 16 Pro Max",
    code: "APL-001",
    quantity: 1,
    price: 64999,
    image: "https://via.placeholder.com/120"
  },
  {
    id: 2,
    name: "AirPods Pro 2",
    code: "APL-002",
    quantity: 2,
    price: 10999,
    image: "https://via.placeholder.com/120"
  }
]);

const increase = (item: any) => {
  item.quantity++;
};

const decrease = (item: any) => {
  if (item.quantity > 1) {
    item.quantity--;
  }
};

const totalItems = computed(() =>
    products.value.reduce((sum, item) => sum + item.quantity, 0)
);

const totalPrice = computed(() =>
    products.value.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    )
);
</script>

<style scoped>
.basket-page {
  min-height: 100vh;
  padding: 50px 0;
}

.container {
  width: 92%;
  max-width: 1500px;
  margin: 0 auto;
}

.page-title {
  font-size: 48px;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 35px;
}

.basket-layout {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 30px;
}

.basket-items {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.basket-item {
  background: white;
  border-radius: 24px;
  padding: 24px;
  display: grid;
  grid-template-columns: 140px 1fr auto auto auto;
  gap: 24px;
  align-items: center;
  box-shadow: 0 10px 30px rgba(15, 23, 42, .06);
  transition: .25s;
}

.basket-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 20px 40px rgba(15, 23, 42, .10);
}

.product-image {
  width: 140px;
  height: 140px;
  object-fit: contain;
  background: #f8fafc;
  border-radius: 18px;
  padding: 10px;
}

.product-info h3 {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: #0f172a;
}

.sku {
  color: #64748b;
  margin-top: 12px;
  font-size: 15px;
}

.quantity-block {
  display: flex;
  align-items: center;
  gap: 14px;
  background: #f1f5f9;
  border-radius: 16px;
  padding: 6px;
}

.quantity-block button {
  width: 42px;
  height: 42px;
  border: none;
  border-radius: 12px;
  background: white;
  cursor: pointer;
  font-size: 22px;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(0,0,0,.08);
  transition: .2s;
}

.quantity-block button:hover {
  transform: scale(1.05);
}

.quantity-block span {
  min-width: 30px;
  text-align: center;
  font-size: 18px;
  font-weight: 700;
}

.price-block {
  font-size: 32px;
  font-weight: 800;
  color: #2563eb;
  min-width: 170px;
  text-align: right;
}

.remove-btn {
  width: 44px;
  height: 44px;
  border: none;
  border-radius: 12px;
  background: #fee2e2;
  color: #dc2626;
  cursor: pointer;
  font-size: 20px;
  transition: .2s;
}

.remove-btn:hover {
  background: #dc2626;
  color: white;
}

.order-summary {
  background: white;
  border-radius: 24px;
  padding: 32px;
  height: fit-content;
  position: sticky;
  top: 20px;
  box-shadow: 0 10px 30px rgba(15,23,42,.06);
}

.order-summary h2 {
  margin-top: 0;
  margin-bottom: 30px;
  font-size: 28px;
  font-weight: 700;
  color: #0f172a;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 18px;
  font-size: 18px;
  color: #334155;
}

.summary-row.total {
  margin-top: 25px;
  padding-top: 25px;
  border-top: 1px solid #e2e8f0;
  font-size: 30px;
  font-weight: 800;
  color: #0f172a;
}

.checkout-btn {
  width: 100%;
  margin-top: 30px;
  height: 60px;
  border: none;
  border-radius: 16px;
  background: linear-gradient(
      135deg,
      #2563eb,
      #1d4ed8
  );
  color: white;
  font-size: 18px;
  font-weight: 800;
  cursor: pointer;
  transition: .25s;
}

.checkout-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(37,99,235,.3);
}

@media (max-width: 1200px) {
  .basket-layout {
    grid-template-columns: 1fr;
  }

  .order-summary {
    position: static;
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 34px;
  }

  .basket-item {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .product-image {
    margin: 0 auto;
  }

  .quantity-block {
    justify-content: center;
  }

  .price-block {
    text-align: center;
  }

  .remove-btn {
    margin: 0 auto;
  }
}
</style>