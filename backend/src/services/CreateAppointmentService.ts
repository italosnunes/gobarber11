import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';
import Appointment from '../models/Appointment';
import AppointmentsRespository from '../repositories/AppointmentRepository';

interface Request {
  provider: string;
  date: Date;
}

class CreateAppointmentService {
  public async execute({ date, provider }: Request): Promise<Appointment> {
    const repository = getCustomRepository(AppointmentsRespository);
    const appointmentDate = startOfHour(date);

    const findAppointmentInSameDate = await repository.findByDate(
      appointmentDate,
    );

    if (findAppointmentInSameDate) {
      throw Error('This appointment is already booked');
    }

    const appointment = repository.create({
      provider,
      date: appointmentDate,
    });

    await repository.save(appointment);
    return appointment;
  }
}

export default CreateAppointmentService;
