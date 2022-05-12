<template>
	<div
		style="
			background-color: #9cb0ba;
			margin: 10px 20px;
			padding: 20px 10px;
			height: 200vh;
		"
	>
		<div>
			<profile-details v-bind:userId="id"></profile-details>
		</div>
		<hr />
		<h3
			style="
				text-align: center;
				margin-bottom: 80px;
				text-decoration: underline;
			"
		>
			Look for available appointment scheducles:
		</h3>
		<div class="available-bookings">
			<div>
				<client-only>
					<date-picker
						:disabled-dates="previousDates"
						:inline="true"
						v-model="date_today"
						format="D"
					/>
				</client-only>
			</div>
			<div v-if="slots.length !== 0" class="slot">
				<div v-for="(slot, index) of slots" :key="index">
				<!-- <h3>"{ 'red': slot.allAppointment.length > 0 && (selectedDate === slot.allAppointment[0].date) ,'green': slot.allAppointment.length === 0 }"</h3> -->
				<!-- <h3>v-bind:class="slot.allAppointment.length > 0 && slot.allAppointment[0].date === selectedDate ? 'red': 'green'"</h3> -->
					<button
						v-on:click="slotId(slot.id)"
						v-bind:class="slot.allAppointment.length > 0 && slot.allAppointment.some((ele)=> ele.date === selectedDate) ? 'red': 'green'"
						
					>
						{{ slot.start_time | HourFormate }} - {{ slot.end_time | HourFormate }}
						<!-- <h6 v-if="slot.allAppointment.length > 0">{{slot.allAppointment}}</h6>
						<h6>{{ selectedDate }}</h6>
						<h6>chSl id: {{ choosedSlotId }} index: {{slot.id}}</h6> -->

					</button>
					<div
						style="margin: 20px 0px"
						v-if="choosedSlotId === slot.id && (slot.allAppointment.length === 0 || (slot.allAppointment.length > 0 && slot.allAppointment.every((ele)=> ele.date !== selectedDate)))"
					>
						<div class="_log_input_group">
							<Input
								placeholder="Agenda in short"
								size="large"
								type="text"
								v-model="agenda"
							></Input>
							<!-- *********** -->
							<button
								v-on:click="sendReq(choosedSlotId, id)"
								:loading="isLoading"
								:disabled="isLoading"
								class="update"
								style="
									background-color: #e182af;
									padding: 10px 05px;
									margin-top: 5px;
								"
							>
								{{
									isLoading
										? "Please wait..."
										: "Send request"
								}}
							</button>
						</div>
					</div>
				</div>
			</div>
			<div v-else>
				<h1 style="text-align: center">No slots available</h1>
			</div>
		</div>
	</div>
</template>

<script>
import profileDetails from "../../components/profileDetails.vue";
import moment from "moment";
moment().format();
export default {
	components: { profileDetails },
	data() {
		return {
			id: this.$route.params.id,
			date_today: new Date(moment()),
			slots: [],
			agenda: "",
			choosedSlotId: null,
			previousDates: {},
			selectedDate : ''
		};
	},
	created() {
		// console.log("created", this.date_today);
	},
	methods: {
		slotId(id) {
			this.choosedSlotId = id;
			// console.log("slot id called", this.choosedSlotId);
		},
		async sendReq(timeSlotId, teacherId) {
			this.isLoading = true;
			let date = moment(this.date_today).toString();
			console.log(date);
			let day = moment(this.date_today).isoWeekday();
			const data = {
				timeSlotId,
				date,
				studentId: this.$store.state.authUser.id,
				agenda: this.agenda,
			};
			if (this.agenda === null || this.agenda === "") {
				this.isLoading = false;
				return this.e("Mention your agenda for meeting");
			}
			const req = await this.callApi("post", "/appointments/request", {
				data,
				teacherId,
			});

			// console.log("req is ", req);
			if (req.status === 200) {
				this.agenda = "";
				this.choosedSlotId = -1;
				if (req.data.msg === "booked") {
					this.e("This slot is already booked");
				} else if (req.data.msg === "already requested") {
					this.e("You have already requested for that slot once");
				} else if (req.data.msg === "sucessfull") {
					this.s("Request sent");
				}
			} else {
				this.e("Something went wrong, try again");
			}
			this.isLoading = false;
		},
	},
	watch: {
		timings: function () {
			// console.log(" im from watch date  = ", this.date_today);
		},
		disableDates: function () {},
	},
	computed: {
		async timings() {
			if (this.date_today !== null) {
				let date = moment(this.date_today).format("DD MMM YYYY");
				let day = moment(this.date_today).isoWeekday();
				this.selectedDate = moment(this.date_today).format("DD MM YYYY");
				// console.log(this.selectedDate);
				// console.log(date.toString());
				// console.log(day.toString());
				const data = {
					teacher_id: this.id,
					day_id: day,
				};
				const slots = await this.callApi(
					"get",
					`time-slots?teacher_id=${this.id}&day_id=${day}&selectedDate=${this.selectedDate}`
				);
				this.slots = slots.data;
				// console.log(this.slots);
				// console.log(this.choosedSlotId);
			}
		},
		disableDates() {
			let fullDate = moment(); //get the full date
			let dateOfAmonth = fullDate.get("date"); //date of the month
			fullDate.set("date", dateOfAmonth - 1); //setting date to  the previous day
			const yesterday = new Date(fullDate);
			// console.log("yestarday is ", yesterday);
			this.previousDates = {
				ranges: [
					{
						// Disable dates in given ranges (exclusive).
						from: new Date(1950, 11, 25),
						to: yesterday,
					},
				],
			};
		},
	},
};
</script>

<style>
.available-bookings {
	display: grid;
	grid-template-columns: 1fr 2fr;
	grid-row-gap: 26px;
}
.slot {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	grid-row-gap: 20px;
	grid-column-gap: 20px;
}

.green {
	background-color: #42cc8c;
	width: 100%;
	padding: 15px 0px;
}
.red {
	background-color: red;
	width: 100%;
	padding: 15px 0px;
}
</style>