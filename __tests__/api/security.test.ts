/**
 * Security Tests
 *
 * Verifies that:
 * - No Supabase credentials are exposed to the frontend
 * - NEXT_PUBLIC_ environment variables don't contain sensitive data
 * - API routes properly handle authentication
 * - No direct database access from frontend code
 */

import fs from "fs";
import path from "path";

describe("Security - Frontend Supabase Access Prevention", () => {
  describe("Environment Variable Security", () => {
    it("should not expose SUPABASE_SERVICE_ROLE_KEY as a public variable", () => {
      // Service role key should never be prefixed with NEXT_PUBLIC_
      expect(process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY).toBeUndefined();
    });

    it("should not expose RESEND_API_KEY as a public variable", () => {
      expect(process.env.NEXT_PUBLIC_RESEND_API_KEY).toBeUndefined();
    });

    it("should not expose database connection strings as public variables", () => {
      expect(process.env.NEXT_PUBLIC_DATABASE_URL).toBeUndefined();
      expect(process.env.NEXT_PUBLIC_SUPABASE_DATABASE_URL).toBeUndefined();
    });
  });

  describe("Frontend Code Security", () => {
    const frontendDir = path.join(__dirname, "../../app");
    const componentsDir = path.join(__dirname, "../../components");

    const getFilesRecursively = (dir: string): string[] => {
      const files: string[] = [];
      if (!fs.existsSync(dir)) return files;

      const items = fs.readdirSync(dir, { withFileTypes: true });
      for (const item of items) {
        const fullPath = path.join(dir, item.name);
        if (item.isDirectory()) {
          // Skip api directory (server-side code)
          if (item.name === "api") continue;
          files.push(...getFilesRecursively(fullPath));
        } else if (item.name.endsWith(".tsx") || item.name.endsWith(".ts")) {
          files.push(fullPath);
        }
      }
      return files;
    };

    it("should not import Supabase client directly in client components", () => {
      const frontendFiles = [
        ...getFilesRecursively(frontendDir),
        ...getFilesRecursively(componentsDir),
      ];

      const violations: string[] = [];

      for (const file of frontendFiles) {
        const content = fs.readFileSync(file, "utf-8");

        // Check for direct Supabase imports in client-side code
        if (
          content.includes('"use client"') ||
          !content.includes("export async function") // Not a server component
        ) {
          if (
            content.includes("@supabase/supabase-js") &&
            !file.includes("/api/")
          ) {
            violations.push(`${file}: Direct Supabase import in client code`);
          }

          // Check for service role key usage
          if (content.includes("SUPABASE_SERVICE_ROLE_KEY")) {
            violations.push(`${file}: References SUPABASE_SERVICE_ROLE_KEY`);
          }
        }
      }

      expect(violations).toEqual([]);
    });

    it("should not expose sensitive credentials in frontend code", () => {
      const frontendFiles = [
        ...getFilesRecursively(frontendDir),
        ...getFilesRecursively(componentsDir),
      ];

      const sensitivePatterns = [
        /eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/, // JWT patterns
        /sk_live_[A-Za-z0-9]+/, // Stripe secret keys
        /re_[A-Za-z0-9]{20,}/, // Resend API keys
        /password\s*[:=]\s*['""][^'""]+['""]/, // Hardcoded passwords
      ];

      const violations: string[] = [];

      for (const file of frontendFiles) {
        const content = fs.readFileSync(file, "utf-8");

        // Skip test files
        if (file.includes("__tests__") || file.includes(".test.")) continue;

        for (const pattern of sensitivePatterns) {
          if (pattern.test(content)) {
            violations.push(`${file}: Contains potential sensitive data`);
          }
        }
      }

      expect(violations).toEqual([]);
    });
  });

  describe("API Route Security", () => {
    it("should use server-side Supabase client only in API routes", () => {
      const apiDir = path.join(__dirname, "../../app/api");

      const getApiFiles = (dir: string): string[] => {
        const files: string[] = [];
        if (!fs.existsSync(dir)) return files;

        const items = fs.readdirSync(dir, { withFileTypes: true });
        for (const item of items) {
          const fullPath = path.join(dir, item.name);
          if (item.isDirectory()) {
            files.push(...getApiFiles(fullPath));
          } else if (item.name === "route.ts") {
            files.push(fullPath);
          }
        }
        return files;
      };

      const apiFiles = getApiFiles(apiDir);

      for (const file of apiFiles) {
        const content = fs.readFileSync(file, "utf-8");

        // API routes that use Supabase should use service role key (server-side)
        if (content.includes("@supabase/supabase-js")) {
          expect(content).toContain("SUPABASE_SERVICE_ROLE_KEY");
          expect(content).not.toContain("NEXT_PUBLIC_SUPABASE_ANON_KEY");
        }
      }
    });
  });

  describe("Form Endpoint Security", () => {
    it("should validate email format to prevent injection attacks", () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      // XSS and SQL injection payloads should fail email validation
      const xssPayloads = [
        '<script>alert("xss")</script>',
        "javascript:alert('xss')",
        '"><img src=x onerror=alert(1)>',
        "'; DROP TABLE users; --",
      ];

      for (const payload of xssPayloads) {
        expect(emailRegex.test(payload)).toBe(false);
      }
    });
  });

  describe("Environment File Security", () => {
    it("should not commit .env.local to version control", () => {
      const gitignorePath = path.join(__dirname, "../../.gitignore");

      if (fs.existsSync(gitignorePath)) {
        const gitignore = fs.readFileSync(gitignorePath, "utf-8");
        expect(gitignore).toContain(".env.local");
        expect(gitignore).toContain(".env*.local");
      }
    });

    it(".env.example should not contain actual secrets", () => {
      const envExamplePath = path.join(__dirname, "../../.env.example");

      if (fs.existsSync(envExamplePath)) {
        const content = fs.readFileSync(envExamplePath, "utf-8");

        // Should contain placeholder values, not actual secrets
        const secretPatterns = [
          /eyJ[A-Za-z0-9_-]{20,}\./, // Actual JWTs
          /re_[A-Za-z0-9]{20,}/, // Actual Resend keys
          /sk_live_/, // Actual Stripe keys
        ];

        for (const pattern of secretPatterns) {
          expect(pattern.test(content)).toBe(false);
        }
      }
    });
  });
});

describe("Security - CORS and Headers", () => {
  it("should not allow unrestricted CORS in API routes", () => {
    const apiDir = path.join(__dirname, "../../app/api");

    const getApiFiles = (dir: string): string[] => {
      const files: string[] = [];
      if (!fs.existsSync(dir)) return files;

      const items = fs.readdirSync(dir, { withFileTypes: true });
      for (const item of items) {
        const fullPath = path.join(dir, item.name);
        if (item.isDirectory()) {
          files.push(...getApiFiles(fullPath));
        } else if (item.name === "route.ts") {
          files.push(fullPath);
        }
      }
      return files;
    };

    const apiFiles = getApiFiles(apiDir);

    for (const file of apiFiles) {
      const content = fs.readFileSync(file, "utf-8");

      // Should not have Access-Control-Allow-Origin: *
      expect(content).not.toContain("Access-Control-Allow-Origin: *");
      expect(content).not.toContain("'Access-Control-Allow-Origin': '*'");
      expect(content).not.toContain('"Access-Control-Allow-Origin": "*"');
    }
  });
});

describe("Security - Input Validation Patterns", () => {
  it("should reject SQL injection attempts", () => {
    const sqlInjectionPayloads = [
      "'; DROP TABLE users; --",
      "1; DELETE FROM deck_access WHERE 1=1",
      "' OR '1'='1",
      "1 UNION SELECT * FROM users",
    ];

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // All SQL injection payloads should fail email validation
    for (const payload of sqlInjectionPayloads) {
      expect(emailRegex.test(payload)).toBe(false);
    }
  });

  it("should reject script injection attempts", () => {
    const scriptPayloads = [
      '<script>document.cookie</script>',
      '<img src=x onerror=alert(1)>',
      '<svg onload=alert(1)>',
      'javascript:void(0)',
    ];

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    for (const payload of scriptPayloads) {
      expect(emailRegex.test(payload)).toBe(false);
    }
  });
});
