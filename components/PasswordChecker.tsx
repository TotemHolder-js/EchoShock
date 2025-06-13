interface PasswordCheckerProps {
  password: string
}

export default function PasswordChecker({ password }: PasswordCheckerProps) {
  // 1) Define each test
  const tests = [
    {
      label: "At least 8 characters",
      valid: password.length >= 8,
    },
    {
      label: "One uppercase letter",
      valid: /[A-Z]/.test(password),
    },
    {
      label: "One lowercase letter",
      valid: /[a-z]/.test(password),
    },
    {
      label: "One digit",
      valid: /\d/.test(password),
    },
    {
      label: "One special character (!@#$%^&*)",
      valid: /[!@#$%^&*]/.test(password),
    },
  ]

  return (
    <ul>
      {tests.map((test) => (
        <li className={test.valid ? "text-green-500" : ""} key={test.label}>
          {test.valid ? "✓" : "✗"} {test.label}
        </li>
      ))}
    </ul>
  )
}
