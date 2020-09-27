import React, { useState } from 'react';
import { FiPower, FiClock } from 'react-icons/fi';

import logoImg from '../../assets/logo.svg';
import defaultImg from '../../assets/placeholder-avatar.jpg';
import { useAuth } from '../../hooks/auth';

import {
    Container,
    Header,
    HeaderContent,
    Profile,
    Content,
    Schedule,
    Calendar,
    NextAppointment,
    Section,
    Appointment
} from './styles';
const Dashboard: React.FC = () => {

    const { signOut, user } = useAuth();
    const [selectedDate,setSelectedDate] = useState(new Date())
    return (
        <Container>
            <Header>
                <HeaderContent>
                    <img src={logoImg} alt="GoBarber" />

                    <Profile>
                        <img
                            src={user.avatar_url || defaultImg}
                            alt={user.name}
                        />
                        <div>
                            <span>Bem-vindo,</span>
                            <strong>{user.name}</strong>
                        </div>
                    </Profile>

                    <button type="button" onClick={signOut}>
                        <FiPower />
                    </button>
                </HeaderContent>
            </Header>
            <Content>
                <Schedule>
                    <h1>Horários agendados</h1>
                    <p>
                        <span>Hoje</span>
                        <span>Dia 06</span>
                        <span>Segunda-Feira</span>
                    </p>

                    <NextAppointment>
                        <strong>Atendimento a seguir</strong>

                        <div>
                            <img src="" alt=""/>
                            <strong>ItaloNunes</strong>
                            <span>
                                <FiClock/>
                                08:00
                            </span>
                        </div>
                    </NextAppointment>
                    <Section>
                        <strong>Manhã</strong>
                        <Appointment>
                            <span>
                                <FiClock/>
                                08:00
                            </span>
                            <div>
                                <img src="" alt=""/>
                                <strong>Italo Nunes</strong>
                            </div>
                        </Appointment>
                    </Section>
                    <Section>
                        <strong>Tarde</strong>
                        <Appointment>
                            <span>
                                <FiClock/>
                                08:00
                            </span>
                            <div>
                                <img src="" alt=""/>
                                <strong>Italo Nunes</strong>
                            </div>
                        </Appointment>
                    </Section>
                </Schedule>
                <Calendar/>
            </Content>
        </Container>
    );
};

export default Dashboard;
