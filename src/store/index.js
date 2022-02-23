import { provide } from "vue";

/**
 * This file define global states in project
 */
const example = Symbol();

function useProvider() {
  provide(example);
}

export default {
  useProvider
};
