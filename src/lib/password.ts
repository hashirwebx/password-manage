type PasswordGeneratorOptions = {
  length?: number;
  includeUppercase?: boolean;
  includeLowercase?: boolean;
  includeNumbers?: boolean;
  includeSymbols?: boolean;
};

const DEFAULT_OPTIONS: Required<PasswordGeneratorOptions> = {
  length: 16,
  includeUppercase: true,
  includeLowercase: true,
  includeNumbers: true,
  includeSymbols: true,
};

const CHARSETS = {
  uppercase: "ABCDEFGHJKLMNPQRSTUVWXYZ",
  lowercase: "abcdefghijkmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>/?",
};

const resolveOptions = (lengthOrOptions?: number | PasswordGeneratorOptions) => {
  if (typeof lengthOrOptions === "number") {
    return { ...DEFAULT_OPTIONS, length: lengthOrOptions };
  }
  return { ...DEFAULT_OPTIONS, ...(lengthOrOptions || {}) };
};

export const generatePassword = (lengthOrOptions?: number | PasswordGeneratorOptions) => {
  const options = resolveOptions(lengthOrOptions);
  let charset = "";

  if (options.includeUppercase) charset += CHARSETS.uppercase;
  if (options.includeLowercase) charset += CHARSETS.lowercase;
  if (options.includeNumbers) charset += CHARSETS.numbers;
  if (options.includeSymbols) charset += CHARSETS.symbols;

  if (!charset) {
    charset = CHARSETS.lowercase;
  }

  const values = crypto.getRandomValues(new Uint32Array(options.length));

  return Array.from(values, (value) => charset[value % charset.length]).join("");
};

export type { PasswordGeneratorOptions };
