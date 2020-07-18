import React, {useEffect} from 'react';
import {FiAlertCircle,FiXCircle, FiCheckCircle, FiInfo} from 'react-icons/fi';
import { ToastMessages, useToast } from '../../../hooks/toast';
import {Container} from './styles';

interface ToastProps {
  message: ToastMessages;
  style: object;
}

const icons = {
  default: <FiInfo size={24}/>,
  error: <FiAlertCircle size={24}/>,
  success: <FiCheckCircle size={24}/>,
}

const Toast:React.FC<ToastProps> = ({message, style}) => {
  
  const {removeToast} = useToast();

  useEffect(()=> {
    const timer = setTimeout(() => {
      removeToast(message.id);
    }, 3000);

    return () => {
      clearTimeout(timer);
    }
  },[message.id,removeToast])

  return(
    <Container 
      type={message.type} 
      hasDescription={!!message.description}
      style={style}
    >
      {icons[message.type || 'default']}

        <div>
          <strong>{message.title}</strong>
          {message.description && <p>{message.description}</p>}
        </div>

        <button onClick={() => removeToast(message.id)} type="button">
          <FiXCircle size={18}/>
        </button>
    </Container>
  )
}

export default Toast;

