<script>
import LanguageSelector from '@/components/LanguageSelector.vue'
import { useFilesStore } from '@/stores/filesStore'

export default {
  components: {
    LanguageSelector
  },
  data() {
    return {
      filesStore: useFilesStore()
    }
  },
  methods: {
    setLanguage(lang) {
      this.filesStore.setLanguage(lang)
    }
  },
  computed: {
    language() {
      return this.filesStore.language
    }
  },
  async mounted() {}
}
</script>

<template>
  <LanguageSelector
    :language="language"
    :translate="this.filesStore.translate"
    @setLanguage="setLanguage"
  />
  <router-view />
</template>

<style></style>
