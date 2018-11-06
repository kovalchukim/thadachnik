import React from 'react';

const Task = props => (
            <li key={props.id} className='li-task'>
                <img src={props.image_path} />
                <h3>Имя: {props.username}</h3>
                <p>Email: {props.email}</p>
                <p>Описание:  {props.text}</p>
                <p>Статус: {props.status}</p>
                {props.isAuth && <button onClick={() => props.editTask(props.id)}>Edit task</button>}
            </li>
);

export default Task;
