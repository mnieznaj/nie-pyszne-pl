import { CartItem, CartState } from "@/store/interfaces";

const state: CartState = {
  items: []
};

const getters = {
  cartItems(state: CartState): CartItem[] {
    return state.items;
  }
};
const mutations = {
  addToCart: function(state: CartState, item: CartItem): void {
    const cartItem: CartItem | undefined = state.items.find(
      product => product.id === item.id
    );
    cartItem
      ? cartItem.quantity++
      : state.items.push({
          id: item.id,
          name: item.name,
          quantity: 1,
          price: item.price,
          imgUrl: item.imgUrl
        });
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations
};