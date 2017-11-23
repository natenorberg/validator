// @flow
import * as React from 'react';

type ValidationErrors = {[key: string]: Object}; // TODO: Check object shape somehow

type ValidationRule<T> = (value: T) => ValidationErrors | null;

type ValidatorChildProps = {
  value: T,
  errors: ValidationErrors | null,
};

export type ValidatorProps<T> = {
  value: T,
  rules: Array<ValidationRule<T>>,
  children: (childProps: ValidatorChildProps) => React.ReactNode,
};

export class Validator extends React.Component<ValidatorProps<*>, ValidatorState<*>> {
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
    const errors = this.getErrors();

    return this.props.children({value, errors});
  }
}

export default Validator;
