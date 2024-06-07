<template>
  <div class="language-selector">
    <div class="button-group">
      <button
        class="english"
        name="english"
        :class="[language == 'en_US' ? 'active' : '']"
        @click="setLanguage('en_US')"
      >
        {{ translate('En') }}
      </button>
      <button
        class="arabic"
        name="arabic"
        :class="[language == 'ar_AE' ? 'active' : '']"
        @click="setLanguage('ar_AE')"
      >
        {{ translate('Ar') }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  props: {
    language: {
      type: String,
      required: true
    },
    translate: {
      type: Function,
      required: true
    }
  },
  methods: {
    setLanguage(lang) {
      document.documentElement.setAttribute('lang', lang)
      this.$emit('setLanguage', lang)
    }
  },
  async mounted() {
    this.setLanguage('en_US')
  }
}
</script>
