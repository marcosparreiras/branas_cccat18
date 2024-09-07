export class ValidateService {
  static validateName(name: string): boolean {
    return /[a-zA-Z] [a-zA-Z]+/.test(name);
  }

  static validateEmail(email: string): boolean {
    return /^(.+)@(.+)$/.test(email);
  }

  static validateCarPlate(carPlate?: string): boolean {
    if (!carPlate) {
      return false;
    }
    return /[A-Z]{3}[0-9]{4}/.test(carPlate);
  }

  static validateCpf(cpf: string) {
    const CPF_VALID_LENGTH = 11;
    const FIRST_DIGIT_FACTOR = 10;
    const SECOND_DIGIT_FACTOR = 11;
    cpf = cpf.replace(/\D/g, "");
    if (cpf.length !== CPF_VALID_LENGTH) return false;
    if (this.allDigitsTheSame(cpf)) return false;
    const digit1 = this.calculateDigit(cpf, FIRST_DIGIT_FACTOR);
    const digit2 = this.calculateDigit(cpf, SECOND_DIGIT_FACTOR);
    return `${digit1}${digit2}` === this.extractDigit(cpf);
  }

  private static allDigitsTheSame(cpf: string) {
    const [firstDigit] = cpf;
    return [...cpf].every((digit) => digit === firstDigit);
  }

  private static calculateDigit(cpf: string, factor: number) {
    let total = 0;
    for (const digit of cpf) {
      if (factor > 1) total += parseInt(digit) * factor--;
    }
    const remainder = total % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  }

  private static extractDigit(cpf: string) {
    return cpf.slice(9);
  }
}
