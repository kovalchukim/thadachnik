import React from 'react';
import PropTypes from 'prop-types';

const Input = ({
  input,
  meta,
  type,
  placeholder,
  className,
  submitError,
  disable = false
}) => (
  <React.Fragment>
    <label className="form-label">{placeholder}</label>
    <div className="input-wrapper">
      <div className="input-field">
       {input.name === 'text' ?
       <textarea
          {...input}
          disabled={disable}
          type={type}
          placeholder={placeholder}
          className={className}
        /> :
           <input
               {...input}
               disabled={disable}
               type={type}
               placeholder={placeholder}
               className={className}
           />}
      </div>
    </div>
    {((meta.error && meta.touched) ||
        (submitError && submitError[input.name])) && (
        <div className="form-field-error">
            {meta.error || submitError[input.name]}
        </div>
    )}
  </React.Fragment>
);

Input.propTypes = {
  input: PropTypes.any,
  disable: PropTypes.any,
  meta: PropTypes.object,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  submitError: PropTypes.object
};

export default Input;
