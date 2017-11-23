// @flow
import * as React from 'react';
import classnames from 'classnames';

/**
 * Stub out formatMessage so that it will return the defaultMessage with basic variable replacement
 */
export const formatMessage = (msg: IntlMessage, values?: {[key: string]: string}) => {
  if (!values) {
    return msg.defaultMessage;
  }

  let returnValue = msg.defaultMessage;
  Object.keys(values).forEach(key => {
    if (values) {
      const value = values[key];
      returnValue = returnValue.replace(`{${key}}`, value);
    }
  });

  return returnValue;
};

type IntlMessage = {
  id: string,
  description?: string,
  defaultMessage: string,
};

const errorTextStyle = {
  color: 'red',
};

// TODO: See if this can be some kind of enum
type ValidationErrors = {[key: string]: Object}; // TODO: Check object shape somehow
type ErrorMessages = {[key: string]: IntlMessage};

type ValidationRule<T> = (value: T) => ValidationErrors | null;

export const required = (value: string) => {
  return value === '' ? {required: {}} : null;
};

export const requiredField = (field: string) => (value: *) => {
  return value || value === 0 ? null : {required: {field}};
};

export const greaterThanZero = (value: number) => {
  return value > 0 ? null : {greaterThanZero: {value}};
};

export type ValidatorProps<T> = {
  value: T,
  rules: Array<ValidationRule<T>>,
  errorMessages: ErrorMessages,
  onValidityChanged?: (valid: boolean) => void,
  children?: any,
};

type ValidatorState = {touched: boolean};

export default class Validator extends React.Component<ValidatorProps<*>, ValidatorState> {
  state = {
    touched: false,
  };
  static defaultProps = {
    rules: [],
    errorMessages: {},
  };
  valid: ?boolean;

  componentWillReceiveProps(nextProps: ValidatorProps<*>) {
    if (this.props.onValidityChanged) {
      const wasValid = this.valid;
      const nextErrors = this.getErrors(nextProps.value);

      if (!wasValid !== !!nextErrors) {
        this.props.onValidityChanged && this.props.onValidityChanged(!nextErrors);
      }
    }
  }

  componentDidMount() {
    if (this.props.onValidityChanged && !!this.getErrors(this.props.value)) {
      this.props.onValidityChanged(false);
    }
  }

  markFieldTouched = () => {
    this.setState({touched: true});
  };

  getErrors = (value: *) => {
    const errors = this.props.rules.reduce(
      (e: ValidationErrors | null, rule: ValidationRule<*>) => e || rule(value),
      null,
    );
    console.log(errors);

    this.valid = !errors;
    return errors;
  };

  renderErrorMessages = (errors: ValidationErrors | null) => {
    if (!errors) {
      return null;
    }

    return Object.keys(errors).map(key => {
      const errorMessage = this.props.errorMessages[key];
      const errorData = errors && errors[key];

      if (!errorMessage) {
        return null;
      }

      return (
        <div style={errorTextStyle} key={key}>
          {formatMessage(errorMessage, errorData || {})}
        </div>
      );
    });
  };

  render() {
    const errors = this.getErrors(this.props.value);
    const valid = !errors;

    return (
      <div
        className={classnames('Validator', {
          dirty: this.state.touched,
          pristine: !this.state.touched,
          valid,
          invalid: !valid,
        })}
        onBlur={this.markFieldTouched}
      >
        {this.props.children}
        {this.state.touched && this.renderErrorMessages(errors)}
      </div>
    );
  }
}
