import Vue from 'vue'
import VueTailwind from 'vue-tailwind'

Vue.use(VueTailwind, {
  theme: {
    TInput: {
      baseClass:
        'bg-transparent border-b border-gray-700 w-full mb-px text-gray-800 pb-1 focus:outline-none focus:border-b-2 focus:border-blue-400 focus:mb-0'
    }
  }
})
