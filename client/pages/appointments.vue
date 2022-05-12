<template>
    <div style="margin: 100px padding:100px 0px">
		<div style="padding:5%">
			<table style="margin: 100px 0px; text-align: center">
				<tr>
                    <th>Date</th>
                    <th>Agenda</th>
                    <th>Time</th>
                    <th>Student</th>
                    <th>Dept.</th>
                </tr>
                <tr v-for="(app,idx) in appointments" :key="idx">
                    <td>{{ app.date | toDate }}</td>
                    <td>{{ app.agenda }}</td>
                    <td>{{ app.date | HourFormate }}</td>
                    <td><button v-on:click="jumpToProfile(app.byWhichStudent.id)">{{ app.byWhichStudent.user_name }}</button></td>
                    <td>{{ app.byWhichStudent.dept }}</td>
                </tr>
			</table>
            <!-- <div v-for="(app,idx) in appointments" :key="idx">
                <h4>{{ app.date }}</h4>
            </div> -->
		</div>
	</div>
</template>
<script>
import moment from "moment";
export default{
    data(){
        return {
            appointments : [],
        }
    },
    async created(){
        const {data} = await this.callApi('get','appointments/made')
        this.appointments=data.filter((ele)=>{
            return ele.forWhichTimeSlot != null;
        });
    },
    methods:{
        jumpToProfile(profileId){
            // console.log(profileId);
            this.$router.push(`profile/${profileId}`)
        }
    }
}
</script>
<style>
button {
  background: none!important;
  border: none;
  padding: 0!important;
  /*optional*/
  font-family: arial, sans-serif;
  /*input has OS specific font-family*/
  color: #069;
  /* text-decoration: underline; */
  cursor: pointer;
}
th{
    color: coral;
}
th,td{
    text-align: center;
}
</style>