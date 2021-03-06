<template>
  <div
    class="np-transparent-modal"
    :class="{ 'np-transparent-modal--active': isLiActive }"
    @click="toggleOrderList"
  ></div>
  <section class="np-search-bar">
    <button
      @click="changeFoodListView"
      type="button"
      class="np-search-bar__toggle-list-view"
    >
      <ListIcon />
    </button>

    <div class="np-search-bar__input">
      <SearchIcon class="np-search-bar__input-icon" />

      <input
        :value="filterVal"
        @input="setActiveFilter"
        class="np-search-bar__input-el"
        type="search"
        placeholder="Search"
      />
    </div>

    <section class="np-search-bar__filter">
      <div @click="toggleOrderList" class="np-search-bar__filter-option">
        <SwitchIcon class="np-search-bar__filter-option-icon" />

        <p class="np-search-bar__filter-option-text">
          <span>{{ orderVal.category }}: </span>{{ orderVal.order }}
        </p>

        <button
          :class="isListActive('np-search-bar__filter-option-btn--active')"
          class="np-search-bar__filter-option-btn"
        >
          <DownArrowIcon />
        </button>
      </div>
      <ul
        :class="isListActive('np-search-bar__filter-list--active')"
        @click="setFoodOrder"
        class="np-search-bar__filter-list"
      >
        <li
          :id="option.type"
          :key="option.type"
          v-for="option in orderOptions"
          class="np-search-bar__filter-list-item"
        >
          <span>{{ option.category }} </span> {{ option.order }}
        </li>
      </ul>
    </section>
  </section>
</template>

<script lang="ts">
import ListIcon from "@/assets/icons/icon-list.vue";
import DownArrowIcon from "@/assets/icons/icon-down-arrow.vue";
import SearchIcon from "@/assets/icons/icon-search.vue";
import SwitchIcon from "@/assets/icons/icon-switch.vue";
import { computed, defineComponent, ref, ComputedRef } from "vue";
import { useStore } from "@/store/index";
import { OrderOption } from "@/store/navigationInterface";
import router from "@/router";
import orderOptionsList from "@/components/Navigation/SearchBar/orderOptionsList";

export default defineComponent({
  components: {
    ListIcon,
    DownArrowIcon,
    SearchIcon,
    SwitchIcon
  },
  setup() {
    const store = useStore();
    const isLiActive = ref<any>(false);
    const filterVal: ComputedRef<string> = computed(
      () => store.state.nav.filterFoodParam
    );
    const orderVal: ComputedRef<OrderOption> = computed(
      () => store.state.nav.foodListOrder
    );
    const orderOptions: OrderOption[] = orderOptionsList.filter(
      option => option.type !== "none"
    );

    const changeFoodListView = function(): void {
      let listType = "";
      store.state.nav.displayAsList ? (listType = "grid") : (listType = "list");
      router.replace({
        path: "/",
        query: {
          ...router.currentRoute.value.query,
          displayType: listType
        }
      });
      store.commit("nav/toggleFoodListView");
    };
    const toggleOrderList = function(): void {
      isLiActive.value = !isLiActive.value;
    };
    const isListActive = function(className: string): string {
      return isLiActive.value ? className : "";
    };

    const setFoodOrder = (event: any): void => {
      const type = event.target.closest(".np-search-bar__filter-list-item").id;
      const activeOrder: OrderOption | undefined = orderOptions.find(
        (option: OrderOption) => option.type === type
      );
      if (activeOrder) {
        router.replace({
          path: "/",
          query: {
            ...router.currentRoute.value.query,
            listOrder: activeOrder.type
          }
        });
        store.commit("nav/setFoodListOrder", activeOrder);
        store.commit("nav/orderFoodList");
        toggleOrderList();
        store.commit(
          "products/setNumberOfPages",
          store.state.nav.filteredFoodList
        );
        store.commit("products/setResults", store.state.nav.filteredFoodList);
      }
    };

    const setActiveFilter = function(event: any): void {
      if (event && event.target) {
        const filterValue = event.target.value;
        router.replace({
          name: "Home",
          query: {
            ...router.currentRoute.value.query,
            filterPhrase: filterValue
          }
        });
        store.commit("nav/setFoodListFilter", filterValue);
        store.commit("nav/filterFoodList");
        store.commit("products/setPage", 1);
        store.commit(
          "products/setNumberOfPages",
          store.state.nav.filteredFoodList
        );
        store.commit("products/setResults", store.state.nav.filteredFoodList);
      }
    };

    return {
      changeFoodListView,
      setActiveFilter,
      setFoodOrder,
      toggleOrderList,
      isListActive,
      filterVal,
      orderVal,
      orderOptions,
      isLiActive
    };
  }
});
</script>

<style lang="scss" scoped>
.np-transparent-modal {
  @apply h-screen w-screen hidden fixed top-0 left-0;
  z-index: 2;

  &--active {
    display: block;
  }
}
.np-search-bar {
  @apply flex sm:flex-col flex-row justify-start items-center w-full mb-10 sm:mb-4 h-16 sm:h-full;
  background-color: #ffffff;

  svg {
    height: inherit;
    width: auto;
    fill: theme("colors.secondary.DEFAULT");
  }

  &__toggle-list-view {
    @apply sm:hidden block;
    height: inherit;
    outline: none;

    svg {
      padding: 10px 0 10px 0;

      &:hover {
        fill: theme("colors.primary.DEFAULT");
      }
    }
  }

  &__input,
  &__filter {
    @apply h-16 sm:mb-4 ml-10 sm:ml-0;
    height: inherit;
    border-radius: 2px;
    border: solid 1px theme("colors.secondary.lighter");
  }

  &__input {
    @apply flex flex-row justify-start items-center w-full sm:ml-0;
    height: inherit;
    padding: 10px;

    &:hover {
      border-color: theme("colors.primary.DEFAULT");
    }

    &-el {
      width: 100%;
      font-size: 19px;
      outline: none;
      color: theme("colors.secondary.dark");
    }

    svg {
      height: 36px;
      margin-right: 20px;
    }
  }

  &__filter {
    @apply w-72 sm:w-full;
    height: inherit;

    &:hover {
      border-color: theme("colors.primary.DEFAULT");
    }

    &-option {
      @apply flex flex-row justify-between items-center;
      height: inherit;
      width: inherit;
      padding: 16px;
      cursor: pointer;

      svg {
        fill: theme("colors.secondary.dark");
        width: 30px;
      }

      &-text {
        width: 100%;
        margin: 0 10px;
        font-size: 19px;
        text-align: left;
        color: theme("colors.secondary.DEFAULT");

        span {
          color: theme("colors.secondary.dark");
        }
      }

      &-icon {
        transform: rotate(90deg);
      }

      &-btn {
        outline: none;

        &--active {
          transform: rotate(180deg);
        }

        svg {
          width: 15px;
        }
      }
    }

    &-list {
      width: inherit;
      display: none;
      background-color: theme("colors.white");

      &--active {
        @apply block absolute z-10;
        border: solid 1px theme("colors.secondary.lighter");
      }

      &-item {
        height: 40px;
        line-height: 40px;
        text-align: center;
        color: theme("colors.secondary.DEFAULT");
        cursor: pointer;
        border: solid 1px theme("colors.secondary.lighter");

        &:hover {
          color: theme("colors.secondary.darker");
          border-color: theme("colors.secondary.darker");
        }
      }
    }
  }
}
</style>
