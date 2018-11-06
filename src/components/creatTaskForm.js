import React from 'react'
import { Form, Field } from 'react-final-form'
import Styles from './Styles';
import Input from "./input-component";

const CreateTaskForm = props => (
    <Styles>
        <Form
            onSubmit={props.onSubmit}
            initialValues={{ ...props.formValue || ''}}
            render={({ handleSubmit, form, submitting, pristine, values }) => (
                <form onSubmit={handleSubmit}>
                    <Field
                        name="username"
                        component={Input}
                        type="text"
                        placeholder="First Name"
                        disable={props.formValue}
                    />
                    <Field
                        name="email"
                        component={Input}
                        type="email"
                        placeholder="Email"
                        disable={props.formValue}
                    />

                    <Field
                        name="text"
                        component={Input}
                        placeholder="Text"
                        type="text"
                    />
                    {props.formValue ?
                        <React.Fragment>
                            <Field
                                name="status"
                                component={Input}
                                type="text"
                                placeholder="Status"
                            />
                        </React.Fragment> :
                        <React.Fragment>
                        <input type="file" onChange={props.handelFileSelected}/>
                            {props.submitError && !props.selectedImg &&
                            <div className="form-field-error">
                                {props.submitError[Object.keys(props.submitError)[0]]}
                            </div>
                            }
                        </React.Fragment>
                    }

                    <div className="buttons">
                        {!props.formValue ?
                        (<React.Fragment>
                            <button type="submit" disabled={submitting || pristine}>
                                Submit
                            </button>
                            <button
                                type="button"
                                onClick={form.reset}
                                disabled={submitting || pristine}
                            >
                                Reset
                            </button>
                        </React.Fragment>) :
                        (<button type='button' onClick={() => props.updateTask(values)}>
                            Update
                        </button>)
                        }
                    </div>
                </form>
            )}
            validate={values => {
                const errors = {};
                const emailPattern = /(.+)@(.+){2,}\.(.+){2,}/;

                if (!values.username) {
                    errors.username = 'Поле User Name является обязательным для заполнения';
                }
                if (!values.email) {
                    errors.email = 'Поле Email является обязательным для заполнения';
                } else if (!emailPattern.test(values.email)) {
                    errors.email = 'Неверный Email';
                }
                if (!values.text) {
                    errors.text = 'Поле Text является обязательным для заполнения';
                }
                if (isNaN(values.status) || values.status < 0 || values.status > 10) {
                    errors.status = 'Поле Status должно содержать числа от 0 до 10';
                }
                return errors;
            }}
        />
    </Styles>
);

export default CreateTaskForm;
