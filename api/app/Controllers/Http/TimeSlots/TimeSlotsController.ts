import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import TimeSlot from '../../../Models/TimeSlot'
import TimeSlotValidator from './TimeSlotValidator';
import TimeSlotService from './TimeSlotService';
import moment from 'moment';
moment().format();
// import User from 'App/Models/User';
export default class TimeSlotsController {
    private timeSlotValidator: TimeSlotValidator
    private timeSlotService: TimeSlotService

    constructor() {
        this.timeSlotService = new TimeSlotService()
        this.timeSlotValidator = new TimeSlotValidator()
    }
    public async add(ctx: HttpContextContract) {
        let one = moment("16:00:00", "HH:mm:ss").valueOf().toString();
        let two = moment("16:00:00", "HH:mm:ss").valueOf().toString()

        const data = ctx.request.all();
        let duration = data.duration;
        delete data.duration;
        const { day_id } = data;
        const { teacher_id } = data;
        const { start_time } = data;
        const { end_time } = data;
        const teacher = await TimeSlot.query().where("teacherId", teacher_id).where("dayId", day_id).orderBy("start_time", "desc").preload("user");
        const newStartTime = moment(start_time, "HH:mm:ss ").valueOf().toString();
        const newEndTime = moment(end_time, "HH:mm:ss ").valueOf().toString();
        for (let i of teacher) {
            const oldStartTime = moment(i.startTime, "HH:mm:ss").valueOf().toString();
            const oldEndTime = moment(i.endTime, "HH:mm:ss").valueOf().toString();
            // *********** START TIME VALIDATION **********
            if (newStartTime === oldStartTime || newStartTime === oldEndTime) {
                return {
                    msg: "not possible"
                }
            }
            if (newStartTime > oldStartTime) {
                if (newStartTime < oldEndTime) {
                    return {
                        msg: "not possible"
                    }
                }

            }
            // ******* END TIME VALIDATION ********
            if (newEndTime === oldStartTime || newEndTime === oldEndTime) {
                return {
                    msg: "not possible"
                }
            }
            if (newEndTime > oldStartTime) {

                if (newEndTime < oldEndTime) {
                    return {
                        msg: "not possible"
                    }
                }

            }
            // ********** START AND END TIME BOTH **********

            // ********* WHEN NEW START TIME IS AVAILABLE BUT END TIME CONFLICT WITH OTHER TIME SLOT'S START OR END TIME  = NOT POSSIBLE *************
            if (newStartTime < oldStartTime) {
                if (newEndTime > oldStartTime) {
                    return {
                        msg: "not possible"
                    }
                }

            }
            // ********** WHEN NEW START TIME MORE RECENT THAN OLD START TIMIE  **********
            // BUT NEW END TIME IS LESS RECENT THAN OLD END TIME . SO THE SLOT CONFLICTS=NOT POSSIBLE
            if (newStartTime > oldStartTime && newEndTime < oldEndTime) {
                return {
                    msg: "not possible"
                }
            }

        }
        let stTm = moment(data.start_time,'HH:mm');
        let enTm = moment(data.end_time,'HH:mm');
        let difInMin = moment.duration(enTm.diff(stTm)).asMinutes();
        let possibleSlot = Math.floor(difInMin/duration);
        for(let i=0;i<possibleSlot;i++){
            let x = moment(data.start_time,'HH:mm');
            data.start_time = x.format('HH:mm');
            data.end_time = x.add(duration,'minutes').format('HH:mm')
            await TimeSlot.create(data);
            data.start_time = data.end_time;
        }
        return {
            msg:`${possibleSlot} slot is created`
        }
        // const saveToDb = await TimeSlot.create(data);
        // return {
        //     saveToDb,
        //     msg: "possible and added successfully"
        // }



    }

    public async slots(ctx: HttpContextContract) {
        // console.log(ctx.request.qs());
        let { teacher_id, day_id ,selectedDate } = ctx.request.qs();
        const userId = ctx.auth.user?.id;
        // console.log('sele Date: ',selectedDate);
        // console.log(moment(selectedDate,'DD MM YYYY').format('ddd MMM DD YYYY'));
        selectedDate = moment(selectedDate,'DD MM YYYY').format('ddd MMM DD YYYY');
        // const all = await TimeSlot.query().where("teacherId", teacher_id).andWhere("dayId", day_id).orderBy("start_time", "asc")
        const allTmp = await TimeSlot.query().where("teacherId", teacher_id).andWhere("dayId", day_id).preload('allAppointment',(query)=>{
            query.where('status','1').andWhere('date',selectedDate)
        }).orderBy("start_time", "asc")
        let val = allTmp.map((qu)=>qu.serialize())
        // console.log('*****');
        console.log(val);
        val.forEach((ele)=>{
            if(ele.allAppointment.length > 0){
                // ele.allAppointment[0].date= moment(ele.allAppointment[0].date).format('DD MM YYYY');
                // ele.allAppointment[0].date= moment(ele.allAppointment[0].date);
                // console.log(ele.allAppointment[0].date);
                ele.allAppointment.forEach((appointment)=>{
                    console.log('app Date :',appointment.date);
                    appointment.date = moment(appointment.date).format('DD MM YYYY');
                    // console.log(appointment.date);
                })
                // console.log(ele);
            }
        });
        // val = val.map((ele)=>{
        //     if(ele.allAppointment.length > 0){
        //         // ele.allAppointment[0].date= moment(ele.allAppointment[0].date).format('DD MM YYYY');
        //         ele.allAppointment[0].date= moment(ele.allAppointment[0].date);
        //         console.log(ele.allAppointment[0].date)
        //     }
        // });
        // console.log(val)
        // return all;
        return val;
    }

    //TODO: This Controller only accessable by teacher type user
    public async created(ctx: HttpContextContract) {
        try {
            const payload = await this.timeSlotValidator.created(ctx);
        } catch (error) {
            const errorObject = JSON.parse(error);
            return ctx.response.status(422).send({
                status: 'BAD',
                message: errorObject,
                result: []
            });
        }
        return await this.timeSlotService.created(ctx);
    }
    //TODO: This Controller only accessable by teacher type user
    public async available(ctx: HttpContextContract) {
        return this.timeSlotService.available(ctx);
    }

    //TODO: This controller only accessable by teacher
    public async update(ctx: HttpContextContract) {
        try {
            await this.timeSlotValidator.update(ctx)
        } catch (error) {
            const errorObj = JSON.parse(error);
            return ctx.response.status(422).send({
                status: 'BAD',
                message: errorObj,
                result: []
            });
        }
        return this.timeSlotService.update(ctx);
    }

    //TODO: This controller only accessable by teacher
    public async delete(ctx: HttpContextContract) {
        return this.timeSlotService.delete(ctx);
    }


    public async newAdd(ctx:HttpContextContract){
        return await this.timeSlotService.newAdd(ctx);
    }
}
