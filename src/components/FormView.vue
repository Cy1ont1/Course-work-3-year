<script setup>
    import { ref, watch } from "vue";
    import { db } from "../firebase";
    import { doc, getDoc, addDoc, collection } from "firebase/firestore";

    const props = defineProps(["formId"]);
    const form = ref(null);
    const answers = ref([]);

    watch(() => props.formId, async (newId) => {
        if (!newId) return;
        const snap = await getDoc(doc(db, "forms", newId));
        if (snap.exists()) {
            form.value = snap.data();
            answers.value = form.value.questions.map(q =>
            q.type === "checkbox" ? [] : ""
            );
        }
        else {
            alert("Form not found");
        }
    });

    const submit = async () => {
        for (let i = 0; i < form.value.questions.length; i++) {
            const q = form.value.questions[i];
            const answer = answers.value[i];
            if (q.required) {
                if (q.type === "checkbox") {
                    if (!answer || answer.length === 0) {
                        alert(`Question ${i + 1} is required`);
                        return;
                    }
                } 
                else {
                    if (!answer || answer === "") {
                        alert(`Question ${i + 1} is required`);
                        return;
                    }
                }
            }
        }
        await addDoc(collection(db, "responses"), {
            formId: props.formId,
            answers: answers.value,
        });
        alert("Submitted!");
    };
</script>

<template>
    <div class="form-container" v-if="form">
        <div class="form-card">
            <h2>{{ form.title }}</h2>
            <div v-for="(q, i) in form.questions" :key="i" class="form-question">
                <p>
                    {{ q.text }}
                    <span v-if="q.required" class="required">*</span>
                </p>
                <input v-if="q.type === 'text'" v-model="answers[i]" />
                <input v-if="q.type === 'number'" type="number" v-model="answers[i]" />
                <input v-if="q.type === 'email'" type="email" v-model="answers[i]" />
                <input v-if="q.type === 'date'" type="date" v-model="answers[i]" />

                <div v-if="q.type === 'radio'">
                    <label v-for="(opt, j) in q.options" :key="j">
                    <input type="radio" :value="opt" v-model="answers[i]" />
                    {{ opt }}
                    </label>
                </div>
                <div v-if="q.type === 'checkbox'">
                    <label v-for="(opt, j) in q.options" :key="j">
                    <input
                        type="checkbox"
                        :value="opt"
                        v-model="answers[i]"
                    />
                    {{ opt }}
                    </label>
                </div>
                <select v-if="q.type === 'select'" v-model="answers[i]">
                    <option v-for="(opt, j) in q.options" :key="j">
                    {{ opt }}
                    </option>
                </select>
            </div>
            <button @click="submit">Submit</button>
        </div>
    </div>
</template>

<style scoped>
    .form-container {
        margin-top: 70px;
        padding: 20px;

        display: flex;
        justify-content: center;
    }
    .form-card {
        width: 100%;
        max-width: 600px;

        background: white;
        padding: 20px;
        border-radius: 10px;

        box-shadow: 0 2px 6px rgba(0,0,0,0.1);
    }
    .form-question {
        margin-bottom: 20px;
    }
    .form-question p {
        font-weight: bold;
        margin-bottom: 8px;
    }
    .required {
        color: red;
        margin-left: 5px;
    }
    .form-question input,
    .form-question select {
        width: 100%;
        padding: 8px;

        border: 1px solid #ccc;
        border-radius: 5px;
    }
    .form-question label {
        display: flex;
        align-items: center;
        height: 30px;
        margin-bottom: 5px;
    }
    .form-question label input {
        width: 10px;
        height: 10px;
        margin-bottom: 5px;
    }
    .submit-btn {
        width: 100%;
        margin-top: 10px;

        background: #4caf50;
        padding: 10px;
        border-radius: 6px;
    }
</style>