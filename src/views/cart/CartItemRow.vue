<template>
  <div class="row">
    <div class="col info">
      <div class="thumb" :style="{ background: item.product?.gradient || '#eee' }"></div>
      <div class="meta">
        <h4>{{ item.productName }}</h4>
        <p class="artist">{{ item.product?.artist || item.product?.artistName || '—' }}</p>
      </div>
    </div>

    <div class="col price">R{{ unitPrice.toFixed(2) }}</div>

    <div class="col qty">
      <button @click="dec" :disabled="qty <= 1">−</button>
      <input type="number" v-model.number="qty" min="1" @change="emitUpdate" />
      <button @click="inc">+</button>
    </div>

    <div class="col total">R{{ (unitPrice * qty).toFixed(2) }}</div>

    <div class="col remove">
      <button class="remove-btn" @click="$emit('remove', id)">✕</button>
    </div>
  </div>
</template>

<script>
import { computed, ref, watch } from 'vue'

export default {
  name: 'CartItemRow',
  props: { item: { type: Object, required: true } },
  setup(props, { emit }) {
    const id = computed(() => props.item.id ?? props.item.cartItem_id)
    const unitPrice = computed(() => props.item.price ?? props.item.product?.price ?? 0)
    const qty = ref(props.item.quantity ?? 1)

    watch(() => props.item.quantity, (nv) => { if (nv !== undefined) qty.value = nv })

    const emitUpdate = () => emit('updateQty', { item: props.item, quantity: Math.max(1, qty.value) })
    const inc = () => { qty.value += 1; emitUpdate() }
    const dec = () => { if (qty.value > 1) { qty.value -= 1; emitUpdate() } }

    return { id, unitPrice, qty, inc, dec, emitUpdate }
  }
}
</script>

<style scoped>
.row {
  display: grid; grid-template-columns: 1.8fr .8fr 1fr .8fr .2fr; gap: 1rem;
  align-items: center; padding: 1rem; border-bottom: 1px solid #eee;
}
.col.info { display: flex; gap: 1rem; align-items: center; }
.thumb { width: 64px; height: 64px; border-radius: 12px; }
.meta h4 { margin: 0 0 .25rem; color: #333; }
.artist { margin: 0; color: #666; font-size: .9rem; }
.col.price, .col.total { font-weight: 600; color: #111; }
.col.qty { display: flex; align-items: center; gap: .4rem; }
.col.qty input {
  width: 70px; text-align: center; padding: .45rem; border: 1px solid #ddd; border-radius: 8px;
}
.col.qty button, .remove-btn {
  border: none; background: #f1f5f9; padding: .5rem .8rem; border-radius: 8px; cursor: pointer;
}
.remove-btn { background: #fee2e2; }
</style>
