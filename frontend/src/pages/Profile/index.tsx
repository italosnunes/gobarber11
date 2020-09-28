import React, { ChangeEvent, useCallback, useRef } from 'react';
import { FiMail, FiLock, FiUser, FiCamera, FiArrowLeft } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import { Link, useHistory } from 'react-router-dom';
import * as Yup from 'yup';

import getValidationErrors from '../../utils/getValidationErrors';

import api from '../../services/api';

import { useToast } from '../../hooks/toast';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Content, AvatarInput } from './styles';
import { useAuth } from '../../hooks/auth';

import defaultImg from '../../assets/placeholder-avatar.jpg';


interface ProfileFormData {
    name: string;
    email: string;
    password: string;
    old_password:string;
    password_confirmation:string;
}

const Profile: React.FC = () => {
    const formRef = useRef<FormHandles>(null);
    const { addToast } = useToast();
    const history = useHistory();

    const { user, updateUser } = useAuth();

    const handleSubmit = useCallback(
        async (data: ProfileFormData) => {
            try {
                formRef.current?.setErrors({});
                const schema = Yup.object().shape({
                    name: Yup.string().required('Nome obrigatório'),
                    email: Yup.string()
                        .required('E-mail obrigatório')
                        .email('Digite um e-mail válido'),
                    old_password: Yup.string(),
                    password: Yup.string().when('old_password',{
                        is:val => !!val.length,
                        then:Yup.string().required('Campo Obrigatório'),
                        otherwise:Yup.string()
                    }),
                    password_confirmation:Yup.string()
                    .when('old_password',{
                        is:val => !!val.length,
                        then:Yup.string().required('Campo Obrigatório'),
                        otherwise:Yup.string(),
                    })
                    .oneOf([Yup.ref('password')],'Senhas não conferem')
                });

                await schema.validate(data, {
                    abortEarly: false,
                });


                const { name, email, password, old_password, password_confirmation } = data;

                const formData = Object.assign({
                    name,
                    email,
                }, old_password ? {
                    old_password,
                    password,
                    password_confirmation,
                } : {})

                const response = await api.put('/profile', formData);

                updateUser(response.data);

                history.push('/dashboard');

                addToast({
                    type: 'success',
                    title: 'Perfil atualizado com sucesso',
                    description: 'Suas informações do perfil foram atualizadas com sucesso!',
                });
            } catch (err) {
                if (err instanceof Yup.ValidationError) {
                    const errors = getValidationErrors(err);
                    formRef.current?.setErrors(errors);

                    return;
                }

                addToast({
                    type: 'error',
                    title: 'Erro no cadastro',
                    description:
                        'Ocorreu um erro ao atualizar o perfil. Tente novamente',
                });
            }
        },
        [addToast, history, updateUser],
    );

    const handleAvatarChange = useCallback((e: ChangeEvent<HTMLInputElement>)=> {

        if(e.target.files){
            const data = new FormData()

            data.append('avatar', e.target.files[0])
            api.patch('/users/avatar', data).then((response)=> {

                updateUser(response.data);

                addToast({
                    type:'success',
                    title: 'Avatar atualizado'
                })
            })

        }
    },[addToast, updateUser])
    return (
        <Container>
            <header>
               <div>
                <Link to="/dashboard">
                    <FiArrowLeft/>
                </Link>

               </div>

            </header>
            <Content>
                    <Form
                        ref={formRef}
                        initialData={{
                            name:user.name,
                            email:user.email
                        }}
                        onSubmit={handleSubmit}
                        >
                        <AvatarInput>
                            <img src={user.avatar_url || defaultImg} alt=""/>
                            <label htmlFor="avatar">
                                <FiCamera/>
                                <input type="file" id="avatar" onChange={handleAvatarChange}/>
                            </label>
                        </AvatarInput>

                        <h1>Meu Perfil</h1>


                        <Input
                            name="name"
                            type="text"
                            icon={FiUser}
                            placeholder="Nome"
                        />
                        <Input
                            name="email"
                            type="text"
                            icon={FiMail}
                            placeholder="E-mail"
                        />
                        <Input
                            containerStyle={{marginTop: 24}}
                            name="old_password"
                            type="password"
                            icon={FiLock}
                            placeholder="Senha atual"
                        />

                        <Input
                            name="password"
                            type="password"
                            icon={FiLock}
                            placeholder="Nova Senha"
                        />

                        <Input
                            name="password_confirmation"
                            type="password"
                            icon={FiLock}
                            placeholder="Confirmar Senha"
                        />

                        <Button type="submit">Salvar</Button>

                    </Form>


            </Content>
        </Container>
    );
};

export default Profile;
