<template>
	<div>
		<div
			v-if="user.user_type === 'student'"
			class="_layout_col _only_desktop"
			style="margin: 50px 0px"
		>
			<div class="_menu_search">
				<div class="_menu_search_main">
					<div class="_menu_search_icon">
						<i class="fas fa-search"></i>
					</div>

					<div class="_menu_search_input">
						<input
							type="text"
							placeholder="Search"
							v-model="searchInput"
						/>
					</div>
				</div>
			</div>
		</div>
		<div
			v-for="(teacher, index) of teachers"
			:key="index"
			style="margin: 30px 20px"
		>
			<div style="background-color: #9cb0ba; padding: 10px 20px">
				<h4>
					Name: {{ teacher.first_name + " " + teacher.last_name }}
				</h4>
				<hr />
				<h4>Email:{{ teacher.email }}</h4>
				<hr />
				<h4>Identity:{{ teacher.user_type }}</h4>
				<hr />
				<h4>Depertment:{{ teacher.dept }}</h4>
				<hr />
				<div v-if="user.user_type === 'admin'">
					<div style="margin: 30px 0px">
						<button
							v-on:click.once="update(teacher.id)"
							class="update"
							style="
								background-color: #42cc8c;
								width: 100px;
								padding: 15px 0px;
							"
						>
							Update
						</button>
						<button
							v-on:click.once="erase(teacher.id)"
							class="reject"
							style="
								background-color: #ff531d;
								width: 100px;
								padding: 15px 0px;
							"
							:loading="isLoading"
							:disabled="loading"
						>
							{{ isLoading ? "Please wait..." : "Delete" }}
						</button>
					</div>
				</div>
				<div v-else>
					<button
						v-on:click="timeSlot(teacher.id)"
						class="update"
						style="
							background-color: #42cc8c;
							width: 100%;
							padding: 15px 0px;
						"
					>
						See {{ teacher.first_name + " " + teacher.last_name }}'s
						time slots
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			teachers: null,
			user: null,
			searchInput: "",
		};
	},
	async created() {
		this.user = this.$store.state.authUser;
	},

	methods: {
		async erase(id) {
			this.isLoading = true;
			const dlt = await this.callApi("delete", "/auth/delete", {
				id,
			});
			this.isLoading = false;
			if (dlt.status !== 200) {
				this.e("Something went wrong.Try again");
			} else {
				this.s("Successfull");
			}
		},
		update(id) {
			this.$router.push(`/profile/${id}`);
		},
		timeSlot(id) {
			this.$router.push(`/time-slots/${id}`);
		},
	},
	watch: {
		async searching() {},
	},
	computed: {
		searching: async function () {
			// console.log("searching for something", this.searchInput);
			if (this.searchInput === "") {
				const teachers = await this.callApi(
					"get",
					"/dashboard/teacher-list/"
				);
				if (teachers.status === 200) {
					this.teachers = teachers.data;
					// console.log(this.teachers);
				}
			} else {
				this.teachers = null;
				const teachers = await this.callApi(
					"get",
					`/dashboard/teacher-list/search?value=${this.searchInput}`
				);
				this.teachers = teachers.data;
				// console.log("im from search", teachers.data);
			}
		},
	},
};
</script>

<style>
</style>