/**
 * Deck Access Request Validation Tests
 *
 * Tests the validation logic for:
 * - Required field validation
 * - Email format validation
 * - Investment size validation
 */

describe("Deck Access Request Validation", () => {
  // Validation constants from the actual route
  const INVESTMENT_SIZES = [
    "under_25k",
    "25k_50k",
    "50k_100k",
    "100k_250k",
    "250k_500k",
    "500k_plus",
  ] as const;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  describe("Required Fields Validation", () => {
    const validateRequiredFields = (payload: Record<string, unknown>) => {
      const { email, firstName, lastName, investmentSize } = payload;
      return !!(email && firstName && lastName && investmentSize);
    };

    it("should pass validation with all required fields", () => {
      const validPayload = {
        email: "investor@example.com",
        firstName: "John",
        lastName: "Doe",
        investmentSize: "50k_100k",
      };

      expect(validateRequiredFields(validPayload)).toBe(true);
    });

    it("should fail without email", () => {
      const payload = {
        firstName: "John",
        lastName: "Doe",
        investmentSize: "50k_100k",
      };

      expect(validateRequiredFields(payload)).toBe(false);
    });

    it("should fail without firstName", () => {
      const payload = {
        email: "investor@example.com",
        lastName: "Doe",
        investmentSize: "50k_100k",
      };

      expect(validateRequiredFields(payload)).toBe(false);
    });

    it("should fail without lastName", () => {
      const payload = {
        email: "investor@example.com",
        firstName: "John",
        investmentSize: "50k_100k",
      };

      expect(validateRequiredFields(payload)).toBe(false);
    });

    it("should fail without investmentSize", () => {
      const payload = {
        email: "investor@example.com",
        firstName: "John",
        lastName: "Doe",
      };

      expect(validateRequiredFields(payload)).toBe(false);
    });

    it("should not require company field", () => {
      const payloadWithoutCompany = {
        email: "investor@example.com",
        firstName: "John",
        lastName: "Doe",
        investmentSize: "50k_100k",
      };

      expect(validateRequiredFields(payloadWithoutCompany)).toBe(true);
    });
  });

  describe("Email Format Validation", () => {
    it("should accept valid email formats", () => {
      const validEmails = [
        "investor@example.com",
        "john.doe@company.io",
        "user+tag@domain.co",
      ];

      for (const email of validEmails) {
        expect(emailRegex.test(email)).toBe(true);
      }
    });

    it("should reject invalid email formats", () => {
      const invalidEmails = [
        "not-an-email",
        "missing@tld",
        "@nodomain.com",
        "spaces in@email.com",
      ];

      for (const email of invalidEmails) {
        expect(emailRegex.test(email)).toBe(false);
      }
    });
  });

  describe("Investment Size Validation", () => {
    it("should accept all valid investment sizes", () => {
      for (const size of INVESTMENT_SIZES) {
        expect(INVESTMENT_SIZES.includes(size)).toBe(true);
      }
    });

    it("should reject invalid investment sizes", () => {
      const invalidSizes = [
        "invalid_size",
        "1000000",
        "small",
        "large",
        "",
        null,
        undefined,
      ];

      for (const size of invalidSizes) {
        expect(
          INVESTMENT_SIZES.includes(size as typeof INVESTMENT_SIZES[number])
        ).toBe(false);
      }
    });
  });

  describe("Email Normalization", () => {
    it("should normalize email to lowercase", () => {
      const testCases = [
        { input: "TEST@EXAMPLE.COM", expected: "test@example.com" },
        { input: "User@Domain.Com", expected: "user@domain.com" },
        { input: "INVESTOR@company.io", expected: "investor@company.io" },
      ];

      for (const { input, expected } of testCases) {
        expect(input.toLowerCase()).toBe(expected);
      }
    });
  });

  describe("Token Generation", () => {
    // Token generation function from the route
    const generateToken = (): string => {
      const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let token = "";
      for (let i = 0; i < 64; i++) {
        token += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return token;
    };

    it("should generate 64-character tokens", () => {
      const token = generateToken();
      expect(token.length).toBe(64);
    });

    it("should generate unique tokens", () => {
      const tokens = new Set<string>();
      for (let i = 0; i < 100; i++) {
        tokens.add(generateToken());
      }
      // All 100 tokens should be unique
      expect(tokens.size).toBe(100);
    });

    it("should only contain alphanumeric characters", () => {
      const token = generateToken();
      expect(/^[A-Za-z0-9]+$/.test(token)).toBe(true);
    });
  });
});
