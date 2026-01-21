
export function checkPasswordStrength(password: string) {
    let score = 0;
    const feedback = [];

if (password.length >= 8) score++;
else feedback.push("Kam se kam 8 characters");

if (/[a-z]/.test(password)) score++;
else feedback.push("Lowercase letter add karo");

if (/[A-Z]/.test(password)) score++;
else feedback.push("Uppercase letter add karo");

if (/[0-9]/.test(password)) score++;
else feedback.push("Number add karo");

if (/[!@#$%^&*]/.test(password)) score++;
else feedback.push("Special character add karo");

return {
    score: score,
    level: score <= 2 ? "Weak" : score <= 3 ? "Medium" : "Strong",
    color: score <= 2 ? "red" : score <= 3 ? "yellow" : "green",
    feedback
};
}