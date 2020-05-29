import { Router } from 'express';
import {parseISO} from 'date-fns';
import AppointmentRepository from '../repositories/AppointmentRepository';
import CreateAppointmentService from '../services/CreateAppointmentService';

const appointmentsRouter = Router();
const repository = new AppointmentRepository();

appointmentsRouter.post('/',(request, response) => {
  try{
    const { provider, date } = request.body;
    const parsedDate = parseISO(date)
    const createAppointment = new CreateAppointmentService(repository);
    const appointment = createAppointment.execute({date: parsedDate, provider});

    return response.json(appointment);
  }catch (err) {
    return response.status(400).json({err: err.mensage})
  }
})

appointmentsRouter.get('/',(request, response) => {
  const appointments = repository.all();
  return response.json(appointments);
})

export default appointmentsRouter;
