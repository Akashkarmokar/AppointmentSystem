<template>
	<div style="background-color: #9cb0ba; margin: 10px 20px">
		<profile-details v-bind:userId="userId"></profile-details>
		<div>
			<button
				v-on:click="editProfile = !editProfile"
				style="
					background-color: #42cc8c;
					width: 100px;
					padding: 15px 0px;
					margin: 10px 20px;
				"
			>
				{{ editProfile ? "Undo" : "Edit Profile" }}
			</button>
		</div>
		<div v-if="editProfile" style="margin-left: 20px">
			<edit-profile v-bind:userId="userId"></edit-profile>
		</div>
	</div>
</template>

<script>
import profileDetails from "../../components/profileDetails.vue";
import editProfile from "../../components/editProfile.vue";
export default {
	middleware: "auth",
	components: {
		"profile-details": profileDetails,
		"edit-profile": editProfile,
	},
	data() {
		return {
			userId: null,
			editProfile: false,
		};
	},
	async created() {
		this.userId = this.$store.state.authUser.id;
	},
};
</script>