import { describe, expect, it } from "vitest";
import {
  createPromptPreviewTokens,
  renderPromptTemplate,
} from "./prompt-settings-view.model";

describe("prompt-settings-view.model", () => {
  it("uses the provided general rules in preview tokens", () => {
    const tokens = createPromptPreviewTokens("- Keep answers concise");

    expect(tokens.general_rules).toBe("- Keep answers concise");
    expect(tokens.output_format).toBe("[OUTPUT_FORMAT inserted by server]");
    expect(tokens.question_json).toContain("Which number is a prime?");
  });

  it("falls back to a default general rule placeholder", () => {
    const tokens = createPromptPreviewTokens("");

    expect(tokens.general_rules).toBe("- Add your general rules here");
  });

  it("renders placeholders with preview token values", () => {
    const rendered = renderPromptTemplate(
      "Subject: {{subject}}\nRules: {{general_rules}}\nFormat: {{output_format}}",
      createPromptPreviewTokens("- Be explicit"),
    );

    expect(rendered).toContain("Subject: Mathematics");
    expect(rendered).toContain("Rules: - Be explicit");
    expect(rendered).toContain("Format: [OUTPUT_FORMAT inserted by server]");
  });
});