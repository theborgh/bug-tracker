import { getNameLetters } from "./data";

describe("getNameLetters", () => {
  it("should return the first letter of the first word and the first letter of the second word", () => {
    expect(getNameLetters("User B")).toBe("UB");
  });

  it("should return AN if there are no words", () => {
    expect(getNameLetters("")).toBe("AN");
  });

  it("should return the first letter of the first word if there is no second word", () => {
    expect(getNameLetters("User")).toBe("U");
  });
});