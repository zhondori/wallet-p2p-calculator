<script setup lang="ts">
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ref, computed, onMounted } from "vue";

const formatter = new Intl.NumberFormat('en-US', {
  style: 'decimal',
  currency: 'UZS',
  signDisplay: 'never',
})

const total = ref(0);
const buy = ref(0);
const sell = ref(0);
const percent = ref(0);
const extraFee = ref(0);

const profit = computed(() => {
  const spent = total.value * buy.value;
  const sold = total.value * sell.value;

  return sold - spent;
})

const fee = computed(() => {
  const sold = total.value * sell.value;

  return ((sold / 100) * 0.9);
})

const totalSellingPrice = computed(() => {
  return total.value * sell.value;
});

const profitInUZS = computed(() => {
  return ((totalSellingPrice.value / 100) * percent.value);
});

const profitPercentage = computed(() => {
  if (!totalSellingPrice.value) return 0;
  return ((profit.value / totalSellingPrice.value) * 100).toFixed(2);
});

const pureProfitPercentage = computed(() => {
  if (!totalSellingPrice.value) return 0;
  return (((profit.value - fee.value - extraFee.value) / totalSellingPrice.value) * 100).toFixed(2);
});

// Telegram WebApp initialization
const webapp = (window as any).Telegram?.WebApp as any

onMounted(() => {
  if (webapp) {
    // Enable closing confirmation
    webapp.enableClosingConfirmation()
    
    // Expand webapp to maximum available height
    webapp.expand()
    
    // Set header color based on theme
    webapp.setHeaderColor(webapp.themeParams.bg_color)
    
    // Ready event
    webapp.ready()
  }
})

</script>

<template>
  <div class="flex mt-4 flex-col gap-3 max-w-[300px] mx-auto">
    <Label for="total">Jami USDT</Label>
    <Input type="number" id='total' placeholder="Jami USDT" v-model="total" />
    <Label for="buy">1 USDT olish narxi</Label>
    <Input type="number" id='buy' placeholder="1 USDT olish narxi" v-model="buy" />
    <Label for="sell">1 USDT sotish narxi</Label>
    <Input type="number" id='sell' placeholder="1 USDT sotish narxi" v-model="sell" />
    <Label for="extraFee">Qo'shimcha xarajat</Label>
    <Input type="number" id='extraFee' placeholder="Qo'shimcha xarajat" v-model="extraFee" />
    <div class="grid gap-3">
      <div class="flex flex-col gap-2 p-3 rounded-lg bg-gray-50">
        <h3 class="text-lg font-bold text-gray-700">Foyda Ko'rsatkichlari</h3>
        <div class="grid gap-2">
          <div class="flex justify-between items-center p-3 rounded bg-white shadow-sm">
            <span class="text-gray-600">Umumiy Foyda:</span>
            <span :class="{'text-green-600': profit > 0, 'text-red-600': profit < 0}" class="font-semibold text-end">
              {{ profit < 0 ? '-' : '+' }}{{ formatter.format(Math.abs(profit)) }}
              <span class="text-sm ml-1">({{ Number(profitPercentage) < 0 ? '-' : '+' }}{{ Math.abs(Number(profitPercentage)) }}%)</span>
            </span>
          </div>
          
          <div class="flex justify-between items-center p-3 rounded bg-white shadow-sm">
            <span class="text-gray-600">Sof Foyda:</span>
            <span :class="{'text-green-600': (profit - fee - extraFee) > 0, 'text-red-600': (profit - fee - extraFee) < 0}" class="font-semibold">
              {{ (profit - fee - extraFee) < 0 ? '-' : '+' }}{{ formatter.format(Math.abs(profit - fee - extraFee)) }}
              <span class="text-sm ml-1">({{ Number(pureProfitPercentage) < 0 ? '-' : '+' }}{{ Math.abs(Number(pureProfitPercentage)) }}%)</span>
            </span>
          </div>

          <div class="flex justify-between items-center p-3 rounded bg-white shadow-sm">
            <span class="text-gray-600">Wallet Fee:</span>
            <span class="font-semibold text-orange-600">
              {{ fee < 0 ? '-' : '' }}{{ formatter.format(Math.abs(fee)) }}
            </span>
          </div>

          <div class="flex justify-between items-center p-3 rounded bg-white shadow-sm">
            <span class="text-gray-600">Extra Fee:</span>
            <span class="font-semibold text-orange-600">
              {{ extraFee < 0 ? '-' : '' }}{{ formatter.format(Math.abs(extraFee)) }}
            </span>
          </div>

          <div class="flex justify-between items-center p-3 rounded bg-white shadow-sm">
            <span class="text-gray-600">1% Foyda:</span>
            <span class="font-semibold text-blue-600">
              {{ (totalSellingPrice / 100) < 0 ? '-' : '' }}{{ formatter.format(Math.abs(totalSellingPrice / 100)) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
