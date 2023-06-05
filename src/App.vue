<template>
    <div
        class="spinner"
        :class="{
            active: spinner,
        }"
        style="
            position: absolute;
            z-index: 20;
            left: 0;
            right: 0;
            bottom: 0;
            top: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #0000008c;
        "
    >
        <div class="lds-roller">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    </div>
    <div
        class="spinner"
        :class="{
            active: success_msg,
        }"
        style="
            position: absolute;
            z-index: 20;
            left: 0;
            right: 0;
            bottom: 0;
            top: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #0000008c;
        "
    >
        <div class="response">
            <div class="success">{{ success_message }}</div>
            <div class="ok" @click="success_msg = false">ok</div>
        </div>
    </div>
    <div
        class="spinner"
        :class="{
            active: error_msg,
        }"
        style="
            position: absolute;
            z-index: 20;
            left: 0;
            right: 0;
            bottom: 0;
            top: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #0000008c;
        "
    >
        <div class="response">
            <div class="error flex flex-col" style="justify-content: space-between;align-items: center;">
                <span>{{ error_message }}</span>
                <small v-if="error_small" style="font-size: 12px;color:#b3b3b3;margin-top:10px;max-width: 400px;">{{ i18n('Если вы ввели ссылку на газету с Google диска или подобного зранилиша файлов то скачайте и отправте PDF-газету в виде файла.') }}</small>
            </div>
            <div class="ok_error" @click="error_msg = false">ok</div>
        </div>
    </div>
    <div class="container">
        <div class="title">{{ i18n('Добавить газету в проект') }}</div>

        <form
            class="form"
            :action="`https://newspapers-service.imas.kz/upload_instance?res_id=${res_id}&pdate=${pdate}`"
            method="POST"
            enctype="multipart/form-data"
            @submit.prevent
        >
            <div class="sub_title">{{ i18n('Дата публикаций газеты') }}</div>
            <input
                type="date"
                name="pdate"
                class="mb-15"
                :max="new Date().toISOString().split('T')[0]"
                v-model="instanceUpload.pdate"
            />
            <div class="tabs">
                <div
                    class="tab"
                    :class="{
                        active: file_tab,
                    }"
                    style="border-radius: 5px 0 0 0"
                    @click="file_tab = true"
                >
                    {{ i18n('Файл') }}
                </div>
                <div
                    class="tab"
                    :class="{
                        active: !file_tab,
                    }"
                    style="border-radius: 0 5px 0 0; border-left: 0"
                    @click="file_tab = false"
                >
                    {{ i18n('Ссылка') }}
                </div>
            </div>
            <div class="pdf-file mb-15">
                <label for="pdf-file">
                    <div class="sub_title mb-5">
                        {{
                            file_tab
                                ? i18n("Перетащите PDF-газету")
                                : i18n("Введите ссылку на PDF-газету")
                        }}
                    </div>
                    <div class="btn" v-if="file_tab">{{ i18n('Выбрать PDF-газету') }}</div>
                    <input
                        type="url"
                        v-model="pdf_link"
                        class="newspaper-link"
                        v-else
                        placeholder="https://example-newspaper.com/..."
                    />
                    <span
                        class="file-name"
                        v-if="file_tab"
                        :style="{ color: hasFiles ? 'green' : 'red' }"
                        >{{
                            hasFiles
                                ? files.length == 4
                                    ? `${i18n('Выбрано')} ${files.length} ${i18n('файла')}`
                                    : files.length == 1
                                    ? `${i18n('Выбран')} ${files.length} ${i18n('файл')}`
                                    : `${i18n('Выбрано')} ${files.length} ${i18n('файлов')}`
                                : i18n("Газета не выбрана")
                        }}</span
                    >
                    <input
                        type="file"
                        name="files"
                        multiple
                        accept="application/pdf"
                        id="pdf-file"
                        class="newspaper"
                        ref="fileInput"
                        @change="onFileInputChange"
                    />
                </label>
            </div>
            <div class="sub_title">{{ i18n('Источник') }}</div>
            <div class="tabs">
                <div
                    class="tab"
                    :class="{
                        active: resource_tab,
                    }"
                    style="border-radius: 5px 0 0 0"
                    @click="resource_tab = true"
                >
                    {{ i18n('Выбрать') }}
                </div>
                <div
                    class="tab"
                    :class="{
                        active: !resource_tab,
                    }"
                    style="border-radius: 0 5px 0 0; border-left: 0"
                    @click="resource_tab = false"
                >
                    {{ i18n('Добавить новый') }}
                </div>
            </div>
            <div
                class="pdf-file mb-15"
                :style="{
                    paddingBottom: resource_tab ? '13px' : '17px',
                }"
            >
                <div style="position: relative">
                    <div class="sub_title mb-5">
                        {{
                            resource_tab
                                ? i18n("Выберите источник газеты")
                                : i18n("Добавьте новый источник газеты")
                        }}
                    </div>
                    <v-select
                        v-if="resource_tab"
                        @sort-list="
                            (value, id, name) =>
                                input_selected_resource(value, id, name)
                        "
                        @select-option="
                            (option, id, name) =>
                                selectProject(option, id, name)
                        "
                        :options="project_names"
                        :name="'name'"
                        :id="'res_id'"
                    ></v-select>
                    <div class="mb-5" v-else>
                        <div>
                            <div class="sub_title">{{ i18n('Ссылка на источник') }}</div>
                            <div class="mb-5 pos-r" style="position: relative">
                                <input
                                    class="newspaper-link warn-border"
                                    :placeholder="i18n('Введите ссылку на источник')"
                                    type="url"
                                    @change="onchage_new_resource_url"
                                    :value="new_source.resource_url"
                                />
                                <span class="warning">{{ i18n('Убедитесь, что ссылка на источник правильная') }}</span>
                            </div>
                            <div class="sub_title">{{ i18n('Название источника') }}</div>
                            <div class="mb-5" style="position: relative">
                                <input
                                    class="newspaper-link warn-border"
                                    :placeholder="i18n('Введите заголовок источника')"
                                    type="text"
                                    v-model="new_source.resource_name"
                                />
                                <span class="warning">{{ i18n('Убедитесь, что заголовок источника правильный') }}</span>
                            </div>
                            <div class="sub_title">{{ i18n('Страна') }}</div>
                            <v-select
                                @sort-list="
                                    (value, id, name, select_name) =>
                                        input_selected_option(
                                            value,
                                            id,
                                            name,
                                            select_name
                                        )
                                "
                                @select-option="
                                    (option, id, name, select_name) =>
                                        selectProject(
                                            option,
                                            id,
                                            name,
                                            select_name
                                        )
                                "
                                :options="resource_data.countries"
                                :select_name="'countries'"
                                :default_placeholder="i18n('Выберите страну')"
                                :withId="false"
                                :name="'country_name'"
                                :id="'id'"
                            ></v-select>
                            <div
                                class="isKazakstan"
                                :class="{
                                    active: isKazakstan,
                                }"
                            >
                                <div class="sub_title">{{ i18n('Регион') }}</div>
                                <v-select
                                    @sort-list="
                                        (value, id, name, select_name) =>
                                            input_selected_option(
                                                value,
                                                id,
                                                name,
                                                select_name
                                            )
                                    "
                                    @select-option="
                                        (option, id, name, select_name) =>
                                            selectProject(
                                                option,
                                                id,
                                                name,
                                                select_name
                                            )
                                    "
                                    :options="resource_data.regions"
                                    :select_name="'regions'"
                                    :default_placeholder="i18n('Выберите регион')"
                                    :withId="false"
                                    :name="'name'"
                                    :id="'id'"
                                ></v-select>
                                <div class="sub_title" v-show="new_source.region_id >= 0">{{ i18n('Город') }}</div>
                                <v-select
                                    @sort-list="
                                        (value, id, name, select_name) =>
                                            input_selected_option(
                                                value,
                                                id,
                                                name,
                                                select_name
                                            )
                                    "
                                    @select-option="
                                        (option, id, name, select_name) =>
                                            selectProject(
                                                option,
                                                id,
                                                name,
                                                select_name
                                            )
                                    "
                                    :options="(resource_data.cities ?? []).filter(city => city.region_id == new_source.region_id)"
                                    :select_name="'cities'"
                                    :default_placeholder="i18n('Выберите город')"
                                    :withId="false"
                                    :name="'name'"
                                    :id="'id'"
                                    v-show="new_source.region_id >= 0"
                                ></v-select>
                            </div>
                        </div>
                    </div>
                    <button
                        id="add-newspaper"
                        class="add-new-source"
                        v-if="!resource_tab"
                        @click="addNewSource()"
                    >
                        {{ i18n('Добавить источник') }}
                    </button>
                    <input
                        type="file"
                        name="files"
                        multiple
                        accept="application/pdf"
                        id="pdf-file"
                        class="newspaper"
                        ref="fileInput"
                        @change="onFileInputChange"
                    />
                </div>
            </div>

            <!-- <div class="sub_title">Газета</div>
            <div class="flex">
                <input type="text" class="field mb-15 w-full" placeholder="Введите ссылку на PDF-газету" />
            </div> -->
            <!-- <input type="text" name="res_id" value="1" /> -->

            <button id="add-newspaper" type="submit" @click="postData">
                {{ i18n('Добавить') }}
            </button>
        </form>
    </div>
</template>

<script>
import axios from "axios";
import VSelect from "@/components/VSelect.vue";
import i18n from "@/utils/i18n";

export default {
    name: "App",
    setup() {
        return { i18n }
    },
    components: {
        VSelect,
    },
    data() {
        return {
            selected_project: "",
            project_names: [],
            pdate: "", // 2023-03-15

            instanceUpload: {
                res_id: 0,
                pdate: "",
                url: "",
            },
            files: [],
            resource_is_selected: false,
            spinner: false,
            success_msg: false,
            success_message: i18n('Газета успешна попала в систему!'),
            error_msg: false,
            error_small: false,
            error_message: "Fail to upload pdf-newspaper!",
            file_tab: false,
            resource_tab: true,
            isKazakstan: false,
            pdf_link: "",
            domain_name: "",
            new_source: {
                safe_resource_name: "",
                resource_name: "",
                resource_url: "",
                country_id: 0,
                region_id: 0,
                city_id: 0,
            },
            resource_data: {},
        };
    },
    methods: {
        onFileInputChange(event) {
            this.files = event.target.files;
        },
        postData() {
            if (this.instanceUpload.res_id == 0) return;
            const formData = new FormData();
            formData.append(
                "instance_upload",
                JSON.stringify(this.instanceUpload)
            );
            if (this.file_tab) {
                for (let i = 0; i < this.files.length; i++) {
                    formData.append("files", this.files[i]);
                }
            }
            this.spinner = true;
            axios
                .post(
                    `https://newspapers-service.imas.kz/${
                        this.file_tab
                            ? "upload_instance"
                            : "upload_instance_url"
                    }?res_id=${this.instanceUpload.res_id}&pdate=${
                        this.instanceUpload.pdate
                    }`,
                    this.file_tab ? formData : this.pdf_link
                )
                .then((response) => {
                    // Handle the response from the server
                    this.success_msg = true;
                    this.success_message = i18n('Газета успешна попала в систему!')
                    console.log(response);
                })
                .catch((error) => {
                    // Handle the error
                    this.error_msg = true;
                    this.error_small = false;

                    this.error_message = error.message || "Fail to upload pdf-newspaper!";

                    // if (error.response.status === 403) {
                    if (error.response.status === 422) {
                        this.error_message = i18n("Убедитесть что все поля заполнены!");
                    }
                    else if (error.response.status === 403) {
                        this.error_message = i18n("Газета уже есть в системе!");
                    }
                    else if (error.response.status === 405) {
                        // this.error_message = "Формат газеты оказался неправильным, \nпопробуйте скачать и отправить в виде файла!";
                        this.error_small = true;
                        this.error_message = i18n("Данный формат газеты не поддерживается. Пожалуйста, прикрепите газету в виде pdf-файла.");
                    }
                    else if (error.response.status === 500) {
                        this.error_message = i18n("Серверная ошибка!");
                    }

                    console.error(error);
                })
                .finally(() => {
                    this.spinner = false;
                });
        },
        getProjectNames() {
            fetch("/ru/add-newspaper/get")
                .then((response) => response.json())
                .then((data) => {
                    console.log(data);
                    this.project_names = data;
                });
        },
        selectProject(option, id, name, select_name) {
            console.log(option[id]);

            if (select_name == "countries") {
                this.isKazakstan = option[id] == 57;

                this.new_source.country_id = option[id];
            } else if (select_name == "regions") {
                this.new_source.region_id = option[id];
            } else if (select_name == "cities") {
                this.new_source.city_id = option[id];
            }
            if (
                this.project_names.find((res) => res[id] === option[id]) !==
                undefined
            ) {
                this.instanceUpload[id] = +option[id];
                this.resource_is_selected = true;
            }
            // this.selected_project = `${option[id]} - ${option[name]}`;
        },
        input_selected_resource(value, id, name) {
            this.project_names.sort(
                (a, b) =>
                    (b[id] + " - " + b[name].toLowerCase()).includes(
                        value.toLowerCase()
                    ) -
                    (a[id] + " - " + a[name].toLowerCase()).includes(
                        value.toLowerCase()
                    )
            );
        },
        input_selected_option(value, id, name, select_name) {
            this.resource_data[select_name].sort((a, b) => {
                let find_result =
                    (b[name].toLowerCase().includes(value.toLowerCase())
                        ? b[name].length
                        : 0) -
                    (a[name].toLowerCase().includes(value.toLowerCase())
                        ? a[name].length
                        : 0);
                return find_result;
            });
        },
        uploadFile(event) {
            console.log(event.target.value);
            console.log(event.target.files);
            this.files = event.target.files;
        },
        addNewSource() {
            
            const regex = /^((https|http):\/\/[^/]+)/; // https://www.domain.com/url=fds
            let domain_name = (this.new_source.resource_url || this.domain_name).trim().match(regex)[1];
            let resource = this.project_names.find((resource) =>
                resource.res_url.includes(domain_name)
            );
            console.log(resource, domain_name);
            this.domain_name = domain_name;
            if (resource) {
                this.resource_tab = true;
                this.new_source.resource_url = resource.res_url;
                this.selectProject(resource, "res_id", "name");
            }
            else {
                this.new_source.resource_url = domain_name;
            }
            const formData = new FormData();
            formData.append(
                "resource_name",
                this.new_source.resource_name ||
                    this.new_source.safe_resource_name
            );
            formData.append(
                "resource_url",
                this.new_source.resource_url || this.domain_name
            );
            formData.append("category_id", 13);
            formData.append("country_id", this.new_source.country_id || 0);
            formData.append("region_id", this.new_source.region_id || 0);
            formData.append("city_id", this.new_source.city_id || 0);
            // resource_name: title,
            // resource_url: link,
            // category_id: category,
            // country_id: country,
            // region_id: region,
            // city_id: city,
            console.log(this.new_source);
            if (
                (this.new_source.country_id || 0) > 0 &&
                this.new_source.resource_name
            ) {
                this.spinner = true;
                axios
                    .post("/ru/addnews-service/add-new-resource", formData)
                    .then((response) => {
                        // Handle the response from the server
                        this.success_msg = true;
                        this.success_message = i18n('Источник успешна попал в систему!')
                        this.resource_tab = true;
                        if (JSON.parse(response.data)?.name == "Integrity constraint violation") {
                            this.success_message = i18n("Попробуйте изменить название источника!");
                            return;
                        }
                        else if (response.data === 'Источник уже есть в системе') {
                            this.error_message = i18n("Этот источник уже есть в системе!");
                        }

                        this.getProjectNames();
                        console.log(this.resource_data);
                    })
                    .catch((error) => {
                        // Handle the error
                        this.error_msg = true;
                        this.error_message =
                            error.message || "Fail to upload pdf-newspaper!";
                        if (error.response.status === 500) {
                            this.error_message = i18n("Этот источник уже есть в системе!");
                        }
                        console.error(JSON.parse(error.data));
                    })
                    .finally(() => {
                        this.spinner = false;
                    });
            }
            // let link = document.querySelector('#link').value;
            // let title = document.querySelector('#title').value;
            // let category = parseInt(document.querySelector('#category').value);
            // let country = parseInt(document.querySelector('#country').value);
            // let region = parseInt(document.querySelector('#region').value);
            // let city = parseInt(document.querySelector('#city').value);
            // if (link != '' && title != '' && category > 0 && country > 0) {
            //     if (country == 57 && region > 0 && city > 0) {
            //         console.error(country, region, city);
            //         return;
            //     }
            //     console.log(link, title, category, country, region, city);
            //     $.ajax({
            //         url: "/ru/addnews-service/add-new-resource",
            //         data : {
            //             resource_name: title,
            //             resource_url: link,
            //             category_id: category,
            //             country_id: country,
            //             region_id: region,
            //             city_id: city,
            //         },
            //         type : "POST",
            //         success: function(data){
            //             console.log(data);
            //             if (data == 1) {
            //                 // close_window()
            //                 console.success('data is ', data);
            //             }
            //             // document.querySelector('#iframe').setAttribute('srcdoc', data.html);
            //         },
            //         error: function(error){
            //             console.error(error);
            //         },
            //     });
            // }
        },
        getResourceData(link) {
            this.spinner = true;
            this.new_source.resource_url = link;
            axios
                .get(`/ru/addnews-service/add-newspaper-resource?link=${link}`)
                .then((response) => {
                    // this.success_msg = true
                    console.log(response.data);
                    this.resource_data = response.data;

                    this.new_source.safe_resource_name =
                        this.new_source.resource_name =
                            this.resource_data.res_name;
                })
                .catch((error) => {
                    // Handle the error
                    this.error_msg = true;
                    this.error_message =
                        error.message || "Fail to upload pdf-newspaper!";
                    console.error(error);
                })
                .finally(() => {
                    this.spinner = false;
                });
        },
        onchage_new_resource_url(event) {
            let newValue = event?.target?.value || '';
            if (newValue) {
                const regex = /^((https|http):\/\/[^/]+)/; // https://www.domain.com/url=fds
                let domain_name = newValue.trim().match(regex)[1];
                let resource = this.project_names.find((resource) =>
                    resource.res_url.includes(domain_name)
                );
                console.log(resource, domain_name);
                this.domain_name = domain_name;
                if (resource) {
                    this.resource_tab = true;
                    this.new_source.resource_url = resource.res_url;
                    this.selectProject(resource, "res_id", "name");
                } else {
                    this.resource_tab = false;
                    this.getResourceData(domain_name);
                }
            }
        },
    },
    computed: {
        hasFiles() {
            return this.files.length != 0;
        },
    },
    mounted() {
        this.getProjectNames();
        this.getResourceData('');
        console.log(this.resource_data);
    },
};
</script>

<style>
body {
    margin: 0;
    padding: 0;
    font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
}
#app {
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    /* margin-top: -150px; */
}
.projects {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 30px;
    width: 200px;
    padding: 0 6px;
    border: 1px solid rgb(168, 168, 168);
    border-radius: 3px;
    background: white;
}

.projects input {
    border: none;
    height: 96%;
}

.projects input:focus {
    outline: none;
}

.projects i {
    color: rgb(32, 32, 32);
}

.pos-r {
    position: relative;
    width: 214px;
}

.project_names::-webkit-scrollbar {
    width: 7px;
    margin-left: 2px;
}

.project_names::-webkit-scrollbar-track {
    margin-left: 2px;
    background-color: transparent;
}

.project_names::-webkit-scrollbar-thumb {
    /*background-color: #eaeaea;*/
    background-color: rgb(170, 227, 255);
    /* border-radius: 5px; */
}

.project_names::-webkit-scrollbar-thumb:hover {
    /*background-color: #d7d7d7;*/
    background-color: rgb(109, 166, 221);
}

.project_names {
    position: absolute;
    background: white;
    padding: 2px;
    border: 1px solid #000;
    right: 0;
    left: 0;
    margin-top: 5px;
    max-height: 140px;
    overflow-y: scroll;
    user-select: none;
    z-index: 1;
}

.project_name {
    padding: 6px 12px;
    font-size: 12px;
}

.project_name:hover {
    background: rgb(200, 200, 200);
}

.title {
    font-size: 22px;
    margin-bottom: 25px;
}

.container {
    border: 1px solid #a09f9f;
    padding: 25px 25px 18px 25px;
    border-radius: 5px;
    box-shadow: 0px 0px 10px #a5a3a3;
    background: white;
    width: 400px;
}

.mb-15 {
    margin-bottom: 15px;
}
.mb-5 {
    display: flex;
    padding-bottom: 7px;
}
select.field {
    background: white;
}
.field {
    height: 30px;
    border: 1px solid rgb(168, 168, 168);
    border-radius: 3px;
    padding-left: 5px;
    padding-right: 5px;
}

select:focus,
input:focus {
    outline: none;
}

.sub_title {
    margin-bottom: 5px;
}
.tabs {
    display: flex;
    margin-bottom: -1px;
}
.tab {
    border: 1px dashed #000;
    padding: 5px;
    border-radius: 5px 5px 0 0;
    background: buttonface;
    cursor: pointer;
    user-select: none;
}
.tab.active {
    border-bottom: 0px solid #000;
}
.pdf-file {
    border: 1px dashed #000;
    padding: 10px 10px 13px 10px;
    border-radius: 0 5px 5px 5px;
    background: buttonface;
}
.pdf-file label {
    width: 100%;
}
.pdf-file label,
.pdf-file input {
    cursor: pointer;
}

.w-full {
    width: 100%;
}

.flex {
    display: flex;
}

.flex-col {
    flex-direction: column;
}

#pdf-file {
    display: none;
}
.btn {
    display: inline;
    margin-right: 10px;
    padding: 4px;
    border: 1px solid #8f8e8e;
    border-radius: 3px;
    font-size: 15px;
    background: white;
}
.btn:hover {
    background: #e9e9e9;
}
.newspaper-link {
    border-radius: 3px;
    border: 1px solid #000;
    padding: 4px;
    width: 100%;
}
.file-name {
    font-size: 15px;
}

#add-newspaper:hover {
    background: #169e83;
}
#add-newspaper {
    margin-left: auto;
    display: flex;
    height: 30px;
    border: none;
    border-radius: 4px;
    background: #1ab394;
    align-items: center;
    justify-content: center;
    margin-top: 10px;
    padding: 0 8px;
    font-size: 15px;
    color: white;
    cursor: pointer;
}

.lds-roller {
    display: inline-block;
    position: relative;
    width: 80px;
    height: 80px;
    z-index: 20;
    /* background: #0000008c; */
}
.lds-roller div {
    animation: lds-roller 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    transform-origin: 40px 40px;
}
.lds-roller div:after {
    content: " ";
    display: block;
    position: absolute;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #fff;
    margin: -4px 0 0 -4px;
}
.lds-roller div:nth-child(1) {
    animation-delay: -0.036s;
}
.lds-roller div:nth-child(1):after {
    top: 63px;
    left: 63px;
}
.lds-roller div:nth-child(2) {
    animation-delay: -0.072s;
}
.lds-roller div:nth-child(2):after {
    top: 68px;
    left: 56px;
}
.lds-roller div:nth-child(3) {
    animation-delay: -0.108s;
}
.lds-roller div:nth-child(3):after {
    top: 71px;
    left: 48px;
}
.lds-roller div:nth-child(4) {
    animation-delay: -0.144s;
}
.lds-roller div:nth-child(4):after {
    top: 72px;
    left: 40px;
}
.lds-roller div:nth-child(5) {
    animation-delay: -0.18s;
}
.lds-roller div:nth-child(5):after {
    top: 71px;
    left: 32px;
}
.lds-roller div:nth-child(6) {
    animation-delay: -0.216s;
}
.lds-roller div:nth-child(6):after {
    top: 68px;
    left: 24px;
}
.lds-roller div:nth-child(7) {
    animation-delay: -0.252s;
}
.lds-roller div:nth-child(7):after {
    top: 63px;
    left: 17px;
}
.lds-roller div:nth-child(8) {
    animation-delay: -0.288s;
}
.lds-roller div:nth-child(8):after {
    top: 56px;
    left: 12px;
}
@keyframes lds-roller {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
.spinner {
    display: none !important;
    min-height: 100vh;
}
.spinner.active {
    display: flex !important;
}

.response {
    background: white;
    border-radius: 6px;
    display: flex;
    align-items: center;
}
.error,
.success {
    padding: 20px;
    font-size: 17px;
    color: #169e83;
    margin-right: 45px;
}
.error {
    color: red;
}
.ok_error,
.ok {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 35px;
    width: 35px;
    font-size: 17px;
    background-color: #169e83;
    color: white;
    margin-right: 20px;
    border-radius: 5px;
    cursor: pointer;
    user-select: none;
}
.ok_error {
    background-color: #bbb;
}
.ok:hover {
    background-color: #117763;
}
.ok_error:hover {
    background-color: #838383;
}

.isKazakstan:not(.isKazakstan.active) {
    display: none;
}

.add-new-source {
    position: absolute;
    margin: 0;
    bottom: -10px;
    right: -4px;
}

.warning {
    position: absolute;
    left: 100%;
    bottom: 100%;
    white-space: nowrap;
    font-size: 12px;
    background: rgb(251,202,4);
    height: 20px;
    display: flex;
    align-items: center;
    line-height: 1;
    padding: 0 6px;
    border-radius: 15px 15px 15px 0;
}
.warn-border {
    border: 1px solid rgb(251,202,4);
}
</style>
