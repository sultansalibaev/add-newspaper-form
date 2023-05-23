<template>
    <div>
        <input type="file" ref="fileInput" @change="onFileInputChange" />
        <label for="res_id">Resource ID:</label>
        <label for="pdate">Production Date:</label>
        <input type="date" id="pdate" v-model="instanceUpload.pdate" />
        <button @click="uploadInstance">Upload</button>
    </div>
</template>

<script>
import axios from "axios";

export default {
    data() {
        return {
            instanceUpload: {
                res_id: 5,
                pdate: "",
            },
            files: [],
        };
    },
    methods: {
        onFileInputChange(event) {
            this.files = event.target.files;
        },
        uploadInstance() {
            const formData = new FormData();
            formData.append(
                "instance_upload",
                JSON.stringify(this.instanceUpload)
            );
            for (let i = 0; i < this.files.length; i++) {
                formData.append("files", this.files[i]);
            }
            axios
                .post(`https://newspapers-service.imas.kz/upload_instance?res_id=${this.instanceUpload.res_id}&pdate=${this.instanceUpload.pdate}`, formData)
                .then((response) => {
                    // Handle the response from the server
                    console.log(response);
                })
                .catch((error) => {
                    // Handle the error
                    console.error(error);
                });
        },
    },
};
</script>
