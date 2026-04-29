<script setup>
    import { ref } from "vue";
    import { signInWithEmailAndPassword } from "firebase/auth";
    import { auth } from "../firebase";
    
    const email = ref("");
    const password = ref("");
    
    const login = async () => {
        try {
            await signInWithEmailAndPassword(auth, email.value, password.value);
            alert("Logged in!");
        } catch (e) {
            alert(e.message);
        }
    };
</script>

<template>
    <div class="auth-box">
        <h2>Login</h2>
        <input v-model="email" placeholder="Email" />
        <input v-model="password" type="password" placeholder="Password" />
        <button @click="login">Sign In</button>
        <p>
            Don't have an account?
            <span @click="$emit('switch')">Register</span>
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