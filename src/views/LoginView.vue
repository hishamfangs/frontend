<template>
  <div class="login-wrapper">
    <div class="login">
      <div v-if="loginStatus == STATUS.PENDING" class="loading">
        {{ filesStore.translate('loading') }}...
      </div>
      <div class="login-hint">
        <div class="login-hint-container">
          <img src="/icons/alert.png" />
        </div>
        <span> {{ filesStore.translate('Login with the following credentials:') }} </span><br />
        {{ filesStore.translate('username') }} : user1<br />
        {{ filesStore.translate('password') }} : 1234
      </div>
      <div class="login-container">
        <div class="username">
          <input
            type="text"
            name="username"
            :placeholder="filesStore.translate('Email or username')"
            v-model="username"
          />
        </div>
        <div class="password">
          <input
            type="password"
            name="password"
            :placeholder="filesStore.translate('password')"
            v-model="password"
          />
        </div>
        <div class="login-button">
          <div class="error_message" v-if="loginStatus == STATUS.FAILED">
            {{ filesStore.translate('Incorrect Username or Password!') }}
          </div>
          <button class="fill" type="button" name="Login" value="Login" @click="doLogin">
            {{ filesStore.translate('Login') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useFilesStore } from '../stores/filesStore'
import { STATUS } from '../Enums'
export default {
  data() {
    return {
      /*** ENUMS **/
      STATUS: STATUS,
      username: '',
      password: '',
      filesStore: useFilesStore(),
      loginStatus: STATUS.IDLE
    }
  },
  methods: {
    async doLogin() {
      try {
        this.loginStatus = STATUS.PENDING
        await this.filesStore.loginUser(this.username, this.password)
        this.loginStatus = STATUS.SUCCESS
        this.$router.push({ name: 'File Manager' })
      } catch (err) {
        this.loginStatus = STATUS.FAILED
      }
    }
  }
}
</script>

<style scoped>
/****** Login ********/
.login-wrapper {
  font-family: 'SF Pro Display';
  width: 100%;
  height: 100%;
  padding: 40px;
}

.signup .logo {
  font-size: 50px;
  font-weight: bold;
  color: var(--primary-text);
}

.signup .description {
  font-size: 18px;
  margin: 3px 0px 12px;
}

.login-register-container {
  width: 700px;
  display: flex;
  gap: 80px;
}

.login {
  width: 400px;
  margin: auto;
  padding: 40px;
  background: white;
  border-radius: 40px;
  box-shadow: 0px 1px 101px rgba(0, 0, 0, 0.14);
  margin-top: 4px;
}

.login-container > div,
.login-container button {
  padding: 7px 0px;
}
.login-container .login-button {
  padding-bottom: 0px;
  position: relative;
}
input {
  height: 40px;
  padding: 10px;
  width: 100%;
  border-radius: 8px;
  border: 1px solid #eaebec;
}

button {
  line-height: 20px;
  background: var(--primary-text);
  border: 0px;
  color: white;
  font-weight: bold;
  width: auto;
  padding: 7px 20px !important;
  border-radius: 40px;
  margin-left: auto;
  height: 28px;
}

[lang='ar_AE'] button {
  margin-left: 0px;
  margin-right: auto;
}

button.fill {
  background: black;
  border: 0px;
  color: white;
}

button.border {
  background: transparent;
  border: 1px solid var(--primary-color);
  color: var(--primary-color);
}
.login-hint {
  text-align: center;
  margin: 20px;
  font-size: 13px;
  margin-top: 0;
}
.login-hint span {
  font-weight: 500;
  color: grey;
}
.error_message {
  color: red;
  position: absolute;
  bottom: 5px;
  font-size: 0.8em;
}
.login-hint-container {
  width: 50px;
  margin: auto;
}
.login-hint-container img {
  width: 100%;
  filter: hue-rotate(76deg) brightness(0.68) saturate(2.5);
}
</style>
