<template>
    <div class="pos-r mb-15">
        <div class="projects" 
                @click="toggleProjectList()">
            <input
                :style="{
					paddingTop: 0,
				}"
                type="text"
                @input="sort_select($event.target.value)"
                :value="selected_option"
                :placeholder="default_placeholder"
            />

            <i
                class="fa-solid fa-angle-down"
				:class="{
					rotated: project_list_modal
				}"
				style="transition: .2s;cursor:pointer"
            ></i>
        </div>
        <div class="project_names" v-show="project_list_modal">
            <div
                class="project_name"
                v-for="option in options"
                :key="option[id]"
                @click="select_project(option)"
            >
                {{ withId ? `${option[id]} - ${option[name]}` : option[name] }}
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        id: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        select_name: {
            type: String,
            required: false,
            default: 'resources',
        },
        default_placeholder: {
            type: String,
            required: false,
            default: 'Выберите источник',
        },
        options: {
            type: Array,
            required: true,
        },
        withId: {
            type: Boolean,
            required: false,
            default: true,
        },
    },
    data() {
        return {
            project_list_modal: false,
            selected_option: '',
        };
    },
	methods: {
        toggleProjectList() {
            this.project_list_modal = !this.project_list_modal;
        },
        sort_select(value) {
            // this.project_list_modal = !this.project_list_modal;
			this.selected_option = value;
			this.$emit('sort-list', value, this.id, this.name, this.select_name)
        },
        select_project(option) {
			this.$emit('select-option', option, this.id, this.name, this.select_name)
            this.selected_option = this.withId ? `${option[this.id]} - ${option[this.name]}` : option[this.name];
			this.toggleProjectList()
        },
	},
};
</script>

<style>

.project_names {
  position: absolute;
  background: #fff;
  padding: 2px;
  border: 1px solid #000;
  right: 0;
  left: 0;
  margin-top: 5px;
  max-height: 140px;
  overflow-y: scroll;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
  z-index: 1;
}

.project_name {
  padding: 6px 12px;
  font-size: 12px;
  cursor: pointer;
}

.project_name:hover {
  background-color: #a5a3a3;
}

.rotated {
	transform:rotateX(180deg);
}

</style>
