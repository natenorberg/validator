// @flow
import * as React from 'react';
import * as PropTypes from 'prop-types';

type ValidationErrors = {[key: string]: Object}; // TODO: Check object shape somehow

type ValidationRule<T> = (value: T) => ValidationErrors | null;

type ValidationGroupRules = {[name: string]: Array<ValidationRule<*>>};
type ValidationGroupErrors = {[name: string]: ValidationErrors};

export type ValidationGroupProps = {
  rules: ValidationGroupRules,
  values: Object, // TODO: Get a better type here
};

export type ValidationGroupChildProps = {
  valid: boolean,
  errors: {[name: string]: ValidationErrors} | null,
};

export class ValidationGroup extends React.Component<ValidationGroupProps> {
  static childContextTypes = {
    values: PropTypes.object.isRequired,
    errors: PropTypes.object,
  };

  getChildContext() {
    return {
      values: this.props.values,
      errors: this.getErrors(),
    };
  }

  getErrors = () =>
    Object.keys(this.props.rules).reduce((errors, key) => {
      const rules = this.props.rules[key];
      const value = this.props.values[key];

      const newErrors = rules.reduce(
        (e: ValidationErrors | null, rule: ValidationRule<*>) => e || rule(value),
        null,
      );

      if (!newErrors) {
        return errors;
      }
      if (!errors) {
        // Initialize error object if this is the first error
        errors = {};
      }

      errors[key] = newErrors;

      return errors;
    }, null);

  render() {
    const errors = this.getErrors();
    const valid = !errors;

    return this.props.children({valid, errors});
  }
}

type ValidationFieldProps<T> = {
  name: string,
  value: T,
};

type ValidationFieldChildProps = {
  value: T,
  errors: ValidationErrors | null,
  touched: boolean,
  valid: boolean,
};

export class ValidationField extends React.Component<ValidationFieldProps<*>> {
  state = {
    touched: false,
  };

  static contextTypes = {
    values: PropTypes.object.isRequired,
    errors: PropTypes.object,
  };

  markFieldTouched = () => {
    this.setState({touched: true});
  };

  render() {
    const {values, errors: formErrors} = this.context;
    const {name} = this.props;
    const {touched} = this.state;
    const value = values[name];
    const errors = formErrors ? formErrors[name] : null;
    const valid = !errors;

    return (
      <div className="Validator" onBlur={this.markFieldTouched}>
        {this.props.children({value, errors, touched, valid})}
      </div>
    );
  }
}
