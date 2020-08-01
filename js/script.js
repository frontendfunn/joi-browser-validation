const schema = joi.object({
  username: joi.string().min(3).max(30).label("Name").required(),
  email: joi
    .string()
    .email({ tlds: { allow: false } })
    .label("Email")
    .required(),
  password: joi.string().alphanum().min(3).label("Password").required(),
  rememberMe: joi.invalid(false).required(),
  selectDropdown: joi.string().label("Random Number").required(),
  mobileNumber: joi
    .string()
    .ruleset.min(10)
    .max(10)
    .pattern(/^[0][1-9]\d{9}$|^[1-9]\d{9}$/)
    .rule({ keep: true, message: "Invalid Mobile Number" }),
  message: joi.string().min(10).required(),
});

function validate(dataObject) {
  // dataObject = {username:"",email:""}
  const result = schema.validate(
    {
      ...dataObject,
    },
    { abortEarly: false }
  );
  return result;
}

// contact form

$(document).ready(function () {
  $(".contact-form").on("submit", function (e) {
    // prevent form submission
    e.preventDefault();
    const contactForm = this;

    const usernameField = $(contactForm).find("#username");

    const emailField = $(contactForm).find("#email");

    const passwordField = $(contactForm).find("#password");

    const rememberMeField = $(contactForm).find("#rememberMe");

    const selectDropdownField = $(contactForm).find("#selectDropdown");

    const mobileNumberField = $(contactForm).find("#mobileNumber");

    const messageField = $(contactForm).find("#message");

    // bootstrap alert message
    const responseMessage = $(this).find("#responseMessage");

    const formErrors = validate({
      username: usernameField.val(),
      email: emailField.val(),
      password: passwordField.val(),
      rememberMe: rememberMeField.is(":checked"), // false or true
      selectDropdown: selectDropdownField.val(),
      mobileNumber: mobileNumberField.val(),
      message: messageField.val(),
    });

    const initialErros = {
      username: null,
      email: null,
      password: null,
      rememberMe: null,
      selectDropdown: null,
      mobileNumber: null,
      message: null,
    };

    if (formErrors?.error) {
      const { details } = formErrors.error;
      details.map((detail) => {
        initialErros[detail.context.key] = detail.message;
      });
    }

    // write the errors to the UI
    Object.keys(initialErros).map((errorName) => {
      if (initialErros[errorName] !== null) {
        // if the error exist
        // username input #username
        $(`#${errorName}`).removeClass("is-valid").addClass("is-invalid");

        // invalid feedback element
        $(`#${errorName}`)
          .next(".invalid-feedback")
          .text(initialErros[errorName]);
      } else {
        $(`#${errorName}`).removeClass("is-invalid").addClass("is-valid");
      }
    });

    // to submit
    let isFormValid = Object.values(initialErros).every(
      (value) => value === null
    );
    if (isFormValid) {
      contactForm.reset();
      $(responseMessage).addClass("show");
      $(contactForm)
        .find(".is-valid, .is-invalid")
        .removeClass("is-valid is-invalid");
    } else alert("error");
  });
});
