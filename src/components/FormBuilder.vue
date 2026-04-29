<script setup>
    import { ref } from "vue";
    import { db } from "../firebase";
    import { addDoc, collection } from "firebase/firestore";

    const title = ref("");
    const questions = ref([]);
    const previewMode = ref(false);

    const addQuestion = (type) => {
        questions.value.push({
            text: "",
            type: type,
            required: false,
            options: ["radio", "checkbox", "select"].includes(type)
            ? ["Option 1"]
            : []
        });
    };

    const removeQuestion = (index) => {
        questions.value.splice(index, 1);
    };

    const addOption = (index) => {
        questions.value[index].options.push("New option");
    };

    const removeOption = (questionIndex, optionIndex) => {
        const opts = questions.value[questionIndex].options;
        if (opts.length > 1) {
            opts.splice(optionIndex, 1);
        } else {
            alert("At least one option is required");
        }
    };

    const hasOptions = (type) => {
        return ["radio", "checkbox", "select"].includes(type);
    };

    const saveForm = async () => {
        const docRef = await addDoc(collection(db, "forms"), {
        title: title.value,
        questions: questions.value,
        });
        alert("Form saved! Form Id:" + docRef.id);
        title.value = "";
        questions.value = [{
            text: "",
            type: "text",
            required: false,
            options: []
        }];
    };
</script>

<template>
    <div class="container">
        <div class="sidebar">
            <h3>Question Types</h3>
            <button @click="addQuestion('text')">Text</button>
            <button @click="addQuestion('number')">Number</button>
            <button @click="addQuestion('email')">Email</button>
            <button @click="addQuestion('date')">Date</button>
            <button @click="addQuestion('radio')">Radio</button>
            <button @click="addQuestion('checkbox')">Checkbox</button>
            <button @click="addQuestion('select')">Select</button>
        </div>

        <div class="main">
            <div class="topbar">
                <h2>Form Builder</h2>
                <button class="secondary" @click="previewMode = !previewMode">
                    {{ previewMode ? "Back to Edit" : "Preview Form" }}
                </button>
            </div>

            <div class="content">
                <div v-if="!previewMode">
                    <h2>Create Form</h2>
                    <input class="form-title" v-model="title" placeholder="Form title" />

                    <div v-for="(q, index) in questions" :key="index" class="question">
                        <input v-model="q.text" placeholder="Question text" />
                        <button class="delete" @click="removeQuestion(index)">Delete</button>
                        <label class="required">
                            Required
                            <input type="checkbox" v-model="q.required" />
                        </label>

                        <div v-if="hasOptions(q.type)">
                            <div v-for="(opt, i) in q.options" :key="i" class="option-row">
                                <input v-model="q.options[i]" placeholder="Option" />
                                <button class="delete" @click="removeOption(index, i)">Delete</button>
                            </div>
                            <button class="secondary" @click="addOption(index)">Add Option</button>
                        </div>
                        <small>Type: {{ q.type }}</small>
                    </div>
                    <button @click="saveForm">Save Form</button>
                </div>

                <div v-else>
                    <div class="preview">
                        <h2>{{ title }}</h2>
                        <div v-for="(q, i) in questions" :key="i">
                            <p>
                            {{ q.text }}
                            <span v-if="q.required" style="color:red">*</span>
                            </p>
                            <input v-if="q.type === 'text'" disabled />
                            <input v-if="q.type === 'number'" type="number" disabled />
                            <input v-if="q.type === 'email'" type="email" disabled />
                            <input v-if="q.type === 'date'" type="date" disabled />

                            <div v-if="q.type === 'radio'">
                                <label v-for="(opt, j) in q.options" :key="j">
                                    <input type="radio" disabled />
                                    {{ opt }}
                                </label>
                            </div>
                            <div v-if="q.type === 'checkbox'">
                                <label v-for="(opt, j) in q.options" :key="j">
                                    <input type="checkbox" disabled />
                                    {{ opt }}
                                </label>
                            </div>
                            <select v-if="q.type === 'select'" disabled>
                                <option v-for="(opt, j) in q.options" :key="j">
                                    {{ opt }}
                                </option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .container {
        display: flex;
    }

    /* SIDEBAR STYLES */
    .sidebar {
        position: fixed;
        left: 0;
        top: 0;
        width: 220px;
        height: 100vh;

        background: #2c2c2c;
        color: white;
        padding: 15px;
        padding-top: 60px;

        display: flex;
        flex-direction: column;
        gap: 8px;
    }
    .sidebar h3 {
        margin-bottom: 10px;
    }
    .sidebar button {
        width: 100%;
        padding: 8px;
    }
    .sidebar button:hover {
        background: #666;
    }

    /* MAIN AREA STYLES*/
    .main {
        margin-left: 240px;
        padding: 20px;
        width: 100%;
    }

    .main > input {
        width: 100%;
        box-sizing: border-box;

        font-size: 18px;
        padding: 10px;
        margin-bottom: 20px;
    }

    /* CENTERED CONTENT STYLES */
    .content {
        max-width: 600px;
        margin: 0 auto;
    }

    /* FORM TITLE STYLES */
    .form-title {
        margin-bottom: 10px;
    }

    /* QUESTION STYLES */
    .question {
        width: 100%;
        box-sizing: border-box;

        background: white;
        border-radius: 10px;
        padding: 16px;
        margin-bottom: 16px;

        box-shadow: 0 2px 6px rgba(0,0,0,0.08);
    }
    .question > * {
        margin-bottom: 10px;
    }
    .question > *:last-child {
        margin-bottom: 0;
    }
    .question input {
        width: 100%;
        box-sizing: border-box;
    }
    .question button {
        margin-left: 5px;
        cursor: pointer;
    }
    .question button:hover {
        opacity: 0.8;
    }

    /* REQUIRED STYLES */
    .required {
        display: flex;
    }
    .required input {
        width: 20px;
    }

    /* OPTION STYLES */
    .option-row {
        display: flex;
        align-items: center;
        gap: 8px;
    }
    .option-row input {
        flex: 1;
    }

    /* DELETE BUTTON STYLES */
    button.delete {
        background: #e74c3c;
    }
    button.delete:hover {
        background: #c0392b;
    }

    /* SECONDARY BUTTON STYLES */
    button.secondary {
        margin-top: 15px;
        background: #3498db;
    }
    button.secondary:hover {
        background: #2980b9;
    }

    /* PREVIEW STYLES */
    .preview {
        max-width: 600px;
        margin: auto;
        background: white;
        padding: 20px;
        border-radius: 10px;
    }
    .preview p {
        font-weight: bold;
    }
    .preview input,
    .preview select {
        display: block;
        margin-bottom: 5px;
    }
    .preview label {
        display: flex;
        align-items: center;
    }

    /* TOPBAR STYLES */
    .topbar {
        max-width: 600px;
        margin: 0 auto 20px auto;

        display: flex;
        justify-content: space-between;
        align-items: center;

        background: white;
        padding: 14px 18px;
        border-radius: 10px;

        box-shadow: 0 2px 6px rgba(0,0,0,0.08);
    }
    .topbar button {
        margin: 0;
    }
    .topbar h2 {
        margin: 0;
    }
</style>