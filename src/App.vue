<script setup>
  import { ref, onMounted } from "vue";
  import { auth } from "./firebase";
  import { onAuthStateChanged, signOut } from "firebase/auth";

  import Login from "./components/Login.vue";
  import Register from "./components/Register.vue";
  import FormBuilder from "./components/FormBuilder.vue";
  import FormView from "./components/FormView.vue";

  const user = ref(null);
  const loading = ref(true);
  const showRegister = ref(false);
  const page = ref("builder");
  const formId = ref("");

  const logout = async () => {
    await signOut(auth);

    page.value = "builder";
    formId.value = "";
    showRegister.value = false;
  };

  onMounted(() => {
    onAuthStateChanged(auth, (u) => {
      user.value = u;
      loading.value = false;
    });
  });
</script>

<template>
  <div v-if="loading" class="loading">
    Loading...
  </div>

  <div v-if="!user">
    <Login v-if="!showRegister" @switch="showRegister = true" />
    <Register v-else @switch="showRegister = false" />
  </div>

  <div v-else>
    <div class="nav">
      <button :class="{ active: page === 'builder' }" @click="page = 'builder'">
        Builder
      </button>
      <button :class="{ active: page === 'view' }" @click="page = 'view'">
        View Form
      </button>
      <input v-if="page === 'view'" v-model="formId" placeholder="Enter Form ID" />
      <div class="spacer"></div>
      <button class="logout" @click="logout()">Sign Out</button>
    </div>

    <FormBuilder v-if="page === 'builder'" />
    <FormView v-if="page === 'view'" :formId="formId" />
  </div>
</template>