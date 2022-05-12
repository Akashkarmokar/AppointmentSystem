import Appointment from "App/Models/Appointment";
import moment from "moment";
moment().format()
export default class AppoinmentQuery{
    public async upCommingAppoinments(upCommingAppoinmentsFor){
        console.log('************************************************')
        // console.log(upCommingAppoinmentsFor);
        /**
         * Find all appoinments Request which is not accepted yet
         */
        // let cuurentDate = moment().toString();
        let cuurentDate = moment().format('ddd MMM DD YYYY');
        // console.log('cur Date :',cuurentDate);
        // let appoinments = await Appointment.query().select('*').preload('forWhichTimeSlot',(timeSlotQuery)=>{
        //     timeSlotQuery.where('teacherId',upCommingAppoinmentsFor.teacherId).preload('day');
        // }).preload('byWhichStudent').where('date','>=',cuurentDate).andWhere('status','0').orderBy('date','desc');
        let appoinments = await Appointment.query().select('*').preload('forWhichTimeSlot',(timeSlotQuery)=>{
            timeSlotQuery.where('teacherId',upCommingAppoinmentsFor.teacherId).preload('day');
        }).preload('byWhichStudent').andWhere('status','0').orderBy('date','desc');
        // let appoinments = await Appointment.query().select('*').preload('byWhichStudent');
        const appoinmentsJSON = appoinments.map((appoinments)=> appoinments.serialize())
        // console.log(appoinmentsJSON);
        // const finalResult : object[] = [];
        // for(let x of appoinmentsJSON){
        //     console.log(x.date,"***",cuurentDate);
        //     let dbDate = moment(x.date,'ddd MMM DD YYYY');
        //     console.log('dif:',dbDate.diff(cuurentDate))
        //     if(dbDate.isAfter(cuurentDate) && x.forWhichTimeSlot){
        //         finalResult.push(x);
        //     }
        // } 
        // console.log('FInal Result :',finalResult);
        // return appoinmentsJSON;
        // console.log(finalResult);
        // return finalResult;
        return appoinmentsJSON;
    }

    public async status(changeStatusFor){
        let appointment = await Appointment.findOrFail(changeStatusFor.appointmentId);
        appointment.status = changeStatusFor.status;

        await appointment.save();
        
    }
    public async made(data){
        let appoinments = await Appointment.query().where('status','1').preload('forWhichTimeSlot',(query)=>{
            query.where('teacherId',data.userId);
        }).preload('byWhichStudent').orderBy('date','asc');
        const allAppoinments = appoinments.map((eachAppointment)=> eachAppointment.serialize());
        return allAppoinments;
        
    }
}