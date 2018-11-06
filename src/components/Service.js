import axios from 'axios/index';
import FormData from 'form-data'
const server_URL = 'https://uxcandy.com/~shapoval/test-task-backend';

export const getTasks = (params) => {
    return axios({
        method: 'get',
        url: `${server_URL}/?developer=${params.toString()}`
    })
    .then(resp => {
        return resp.data.message
    });
};

export const createTask = (username, email, text, image) => {
    let data = new FormData();
    data.append('username', username);
    data.append('email', email);
    data.append('text', text);
    data.append('image', image);

    return axios({
        method: 'post',
        url: `${server_URL}/create?developer=Ivan`,
        data: data,
        contentType:'multipart/form-data'
    })
        .then(val => val.data);

};

export const updateTask = (data, id) => {

    return axios({
        method: 'post',
        url: `${server_URL}/edit/${id}?developer=Ivan`,
        data
    });

};

export const Service = {
    createTask,
    updateTask,
    getTasks
};
