import { provide, ref } from "vue";

/**
 * This file define global states in project
 */
const timeLineWidth = Symbol();

function useProvider() {
  provide(timeLineWidth, ref(0));
}

export default {
  useProvider,
  timeLineWidth
};
