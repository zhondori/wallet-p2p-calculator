<script setup lang="ts">
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ref, computed } from "vue";

const formatter = new Intl.NumberFormat('en-US', {
  style: 'decimal',
  currency: 'UZS',
  signDisplay: 'never',
})

const total = ref(0);
const buy = ref(0);
const sell = ref(0);
const percent = ref(0);

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
  return (((profit.value - fee.value) / totalSellingPrice.value) * 100).toFixed(2);
});

</script>

<template>
  <div class="flex mt-20 flex-col gap-4 max-w-[300px] mx-auto">
    <Label for="total">Jami USDT</Label>
    <Input type="number" id='total' placeholder="Jami USDT" v-model="total" />
    <Label for="buy">1 USDT olish narxi</Label>
    <Input type="number" id='buy' placeholder="1 USDT olish narxi" v-model="buy" />
    <Label for="sell">1 USDT sotish narxi</Label>
    <Input type="number" id='sell' placeholder="1 USDT sotish narxi" v-model="sell" />
    <div class="flex gap-2 items-end">
      <div class="flex-1">
        <Label for="percent">Foiz</Label>
        <Input type="number" id="percent" placeholder="Foiz kiriting" v-model="percent" />
      </div>
      <div class="text-lg font-semibold">
        <h3>{{ formatter.format(profitInUZS) }} UZS</h3>
      </div>
    </div>
    <div class="text-lg font-semibold">
      <h3>Foyda: {{ formatter.format(profit) }} ({{ profitPercentage }}%)</h3>
      <h3>Sof foyda: {{ formatter.format(profit - fee) }} ({{ pureProfitPercentage }}%)</h3>
      <h3>Wallet fee: {{ formatter.format(fee) }}</h3>
      <h3>1% foyda: {{ formatter.format(totalSellingPrice / 100) }}</h3>
    </div>
  </div>
</template>
