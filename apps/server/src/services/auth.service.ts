// Services are where business rules live. Keeping auth logic out of controllers
// will make registration, password hashing, and token creation easier to test.
export function createRegisterPlaceholder() {
  return {
    message: "Registration endpoint scaffolded. Full auth is not implemented yet."
  };
}

export function createLoginPlaceholder() {
  return {
    message: "Login endpoint scaffolded. Full auth is not implemented yet."
  };
}
