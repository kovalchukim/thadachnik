import React, { Component } from 'react';
import { Form, Field } from 'react-final-form';
import Input from './input-component';
import Styles from './Styles';

class LoginForm extends Component {
  constructor() {
    super();
    this.state = {
      error: '',
      redirect: false,
      loading: false,
      login: 'admin',
      password: 123
    };

  }

  render() {
    const reset = () => {
      if (this.state.error) {
        this.setState({ error: '' });
      }
    };
    const onSubmit = values => {
      if (values && +values.password === +this.state.password &&
      values.login === this.state.login) {
        this.props.setAuth(true)
      } else {
          this.setState({error: 'Неправильно введены поля логина и/или пароля'})
      }
    };

    if (this.state.redirect) {
      return this.state.redirect;
    }

    return (
      <Styles>
        <Form
          onSubmit={onSubmit}
          render={({ handleSubmit, submitting, pristine }) => (
            <form onSubmit={handleSubmit} onChange={reset}>

              <Field
                name="login"
                component={Input}
                type="text"
                placeholder="Login"
              />
              <Field
                name="password"
                component={Input}
                type="password"
                placeholder="Password"
              />

              <div className="buttons">
                <button
                  type="submit"
                  className="btn btn-main"
                  disabled={submitting || pristine}
                >
                  Sign In
                </button>
              </div>
            </form>
          )}
          validate={values => {
            const errors = {};

            if (!values.login) {
              errors.login = 'Поле является обязательным для заполнения';
            }
            if (!values.password) {
              errors.password = 'Поле является обязательным для заполнения';
            } else if (this.state.error) {
              errors.password = this.state.error;
            }
            return errors;
          }}
        />
      </Styles>
    );
  }
}

export default LoginForm;
