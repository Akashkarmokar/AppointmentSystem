<template>
	<div class="available-slots">
		<h2 style="text-align: center; color: #2c92f8">Available Slots</h2>
		<hr />
		<div v-if="availableSlots.length">
			<table>
				<tr>
					<th>Start Time</th>
					<th>End Time</th>
					<!-- <th>Country</th> -->
				</tr>
				<tr v-for="(item, index) in availableSlots" :key="index">
					<td>{{ item.start_time | HourFormate }}</td>
					<td>{{ item.end_time  | HourFormate}}</td>
				</tr>
			</table>
		</div>
		<div v-else>
			<h4>No data yet...</h4>
		</div>
		<hr />
		<Select placeholder="Select Day" size="large" v-model="day">
			<Option value="1">monday</Option>
			<Option value="2">tuesday</Option>
			<Option value="3">wednesday</Option>
			<Option value="4">thursday</Option>
			<Option value="5">friday</Option>
			<Option value="6">satarday</Option>
			<Option value="7">sunday</Option>
		</Select>
		<!-- {{day}} -->
		<!-- {{this.$store.state.authUser.id}} -->
	</div>
</template>
<script>
export default {
	data() {
		return {
			day: "",
			availableSlots: [],
		};
	},
	async created() {
		try {
		} catch (error) {
			this.e("Something is wrong to fetch your created slots data");
		}
	},
	watch: {
		async day(newValue, oldValue) {
			const { data } = await this.callApi(
				"get",
				`/time-slots/available/?day=${newValue}`
			);
			this.availableSlots = data;
		},
	},
};
</script>
<style scoped>
table {
	font-family: arial, sans-serif;
	border-collapse: collapse;
	width: 100%;
}

td,
th {
	border: 1px solid #dddddd;
	text-align: left;
	padding: 8px;
}

tr:nth-child(even) {
	background-color: #dddddd;
}
.available-slots {
	background-color: #ffffff;
	padding: 30px 10px;
}
</style>