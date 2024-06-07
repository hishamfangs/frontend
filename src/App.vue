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
    },
    logout() {
      this.filesStore.logout()
      this.$router.push({ name: 'Login' })
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
  <!-- Top Menu -->
  <div class="top-menu">
    <div class="spacer" v-if="filesStore.token"></div>
    <LanguageSelector
      :language="language"
      :translate="this.filesStore.translate"
      @setLanguage="setLanguage"
    />
    <button class="logout" v-if="filesStore.token" @click="logout">
      {{ filesStore.translate('Logout') }}
    </button>
  </div>
  <!-- Router View -->
  <router-view />
</template>

<style>
.top-menu {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 80%;
  padding: 0 40px;
  justify-content: space-between;
}
.spacer {
  width: 80px;
}
.logout {
  cursor: pointer;
}
</style>
