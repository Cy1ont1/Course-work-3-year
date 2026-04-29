<script setup>
    import { ref } from "vue";
    import { createUserWithEmailAndPassword } from "firebase/auth";
    import { auth } from "../firebase";

    const email = ref("");
    const password = ref("");

    const register = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email.value, password.value);
            alert("Account created!");
        } catch (e) {
            alert(e.message);
        }
    };
</script>

<template>
    <div class="auth-box">
        <h2>Register</h2>
        <input v-model="email" placeholder="Email" />
        <input v-model="password" type="password" placeholder="Password" />
        <button @click="register">Sign Up</button>
        <p>
            Already have an account?
            <span @click="$emit('switch')">Login</span>
        </p>
    </div>
</template>

<style scoped>
.auth-box {
    max-width: 300px;
    margin: 100px auto;
    background: white;
    padding: 20px;
    border-radius: 10px;
    text-align: center;
}

.auth-box input {
    width: 100%;
    margin-bottom: 10px;
}

.auth-box span {
    color: #3498db;
    cursor: pointer;
}
</style>