// @flow
import * as React from 'react';

type ValidationErrors = {[key: string]: Object}; // TODO: Check object shape somehow

type ValidationRule<T> = (value: T) => ValidationErrors | null;

type ValidatorChildProps = {
  value: T,
  errors: ValidationErrors | null,
  touched: boolean,
  valid: boolean,
};

export type ValidatorProps<T> = {
  value: T,
  rules: Array<ValidationRule<T>>,
  children: (childProps: ValidatorChildProps) => React.ReactNode,
};

type ValidatorState = {
  touched: boolean,
};

export class Validator extends React.Component<ValidatorProps<*>, ValidatorState> {
  state = {
    touched: false,
  };

  markFieldTouched = () => {
    this.setState({touched: true});
  };

  getErrors = () => {
    const {value, rules} = this.props;

    const errors = rules.reduce(
      (e: ValidationErrors | null, rule: ValidationRule<*>) => e || rule(value),
      null,
    );

    return errors;
  };

  render() {
    const {value} = this.props;
    const {touched} = this.state;
    const errors = this.getErrors();
    const valid = !errors;

    return (
      <div className="Validator" onBlur={this.markFieldTouched}>
        {this.props.children({value, errors, touched, valid})}
      </div>
    );
  }
}

export default Validator;
