# Validator

## What old validator did

The old Validator component took a list of rules, a set of error messages, a value, an
`onValidityChanged` callback, and a children prop that would show in the UI.

The rules would be functions that took the value and returned `null` for no errors, or an object
describing the error (`{[key: string]: Object}`).

If there was an error message passed into the component with the same key as a validation error
returned by one of the rules, Validator would call `formatMessage` with the error data from the
rules passed in as the values so that you could build more complex error messages. These error
messages would only show up if you had focused the field and left focus.

Whenever the validity changed, it would also fire the `onValidityChanged` callback.

To help with styling, the Validator would wrap the children in a div and append classnames based on
the state. (Either `dirty` or `pristine` and either `valid` or `invalid`)

## Things that are annoying about this

* It was easy to show error messages if a field was invalid, but it was a pain to keep track if the
  whole form was valid. (We had to set up all these validity changed callbacks and keep track of it
  in the state)

* There's no flexibilty to change the rendering of the error messages (They showed up below the
  field in red text) and you had to override the container css to show it differently.

* Using the appended classnames for conditional styling made a hidden dependency from our styles to
  strings in the Validator component. It also didn't work as well for using a css-in-js solution.

## How the new solution works

There are `ValidationGroup` and `ValidationField` components. The Group takes the rules and values
for the form and the Fields are in charge of rendering certain fields based on the validation. This
solution makes heavy use of render props, so if you're not familiar, you might want to take a look
at [this](https://cdb.reacttraining.com/use-a-render-prop-50de598f11ce).

`ValidationGroup` takes a `values` prop which is a key/value store of all the data you're
validating. The `rules` prop is an object with the same keys and each key has an array of validation
rules. These rules have the same signature that they did before.

The Group component does all the validation logic and then uses `children` as a render prop to show
the form. It passes `valid` and `errors` into the render method.

The ValidationField component doesn't actually do any validation, it just renders the field. It
takes a `name` prop, which should match a value passed into ValidationGroup and the rules you want
to check.

It also renders with a render prop with the following data:

* `value` - The value of the field
* `errors` - The validation error results from running the validation rules (`null` if v)alid)
* `touched` - A boolean to show if the field was focused and then blurred
* `valid` - A boolean to show if the field is valid or not

The Field component doesn't actually do any validation message rendering. It leaves that to the
component defining the render prop.

## Benefits to the new approach

* This solution basically pulls all the rendering logic out of the Validation component and leaves
  it to just do validation.
* Showing error messages is much more flexible this way
* Don't need to keep track of validity in the state of the component rendering the form
* Doesn't couple styling to extra css classes
* Not tied at all to rendering for our app, so this could be something we could open-source

## Drawbacks to the new approach

* Rules have to be defined for the whole form rather than on individual fields (which means we
  couldn't quickly add a `required` prop for a field)
* Uses context, which isn't completely supported (though it's widely used)

## Things to do before open sourcing it

* [ ] Hook up our apps to use it
* [ ] Namespace context so there can be multiple forms in a hierarchy (or just to reduce collisions)
* [ ] Find a good name for it (`checkmate` was taken 😩)

## Nice to haves

* [ ] Allow composing validation groups (if we have part of a form in a sub-component)
* [ ] Find a way to set rules on the field itself rather than a whole form at a time

## Try it out

```
yarn
yarn start
```
