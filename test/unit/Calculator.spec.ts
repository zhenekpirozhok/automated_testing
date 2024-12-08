import Calculator from "./../../src/Calculator";
import * as fs from "fs";
import { describe, test, expect, beforeEach, vi } from "vitest";

vi.mock("fs"); // Mocking the fs module

describe("Calculator", () => {
  let calculator: Calculator;

  beforeEach(() => {
    calculator = new Calculator();
    vi.clearAllMocks(); // Clear mocks before each test
  });

  test("sum should add multiple numbers correctly", () => {
    expect(calculator.sum(1, 2, 3)).toBe(6);
    expect(calculator.sum(5, -5, 10)).toBe(10);
  });

  test("subduct should subtract two numbers correctly", () => {
    expect(calculator.subduct(10, 5)).toBe(5);
    expect(calculator.subduct(5, 10)).toBe(-5);
  });

  test("multiply should multiply multiple numbers correctly", () => {
    expect(calculator.multiply(2, 3, 4)).toBe(24);
    expect(calculator.multiply(5, -1)).toBe(-5);
  });

  test("divide should divide two numbers correctly", () => {
    expect(calculator.divide(10, 2)).toBe(5);
    expect(calculator.divide(9, 3)).toBe(3);
  });

  test("divide should throw an error when dividing by zero", () => {
    expect(() => calculator.divide(10, 0)).toThrow("Cannot divide by zero");
  });

  test("sumFromFile should sum numbers read from a file", async () => {
    const mockData = "1,2,3,4";
    // Mock the readFile method to return mockData
    vi.spyOn(fs.promises, "readFile").mockResolvedValue(mockData);

    const sum = await calculator.sumFromFile("mockFilePath.txt");
    expect(sum).toBe(10);

    // Verify that fs.promises.readFile was called with the correct file path
    expect(fs.promises.readFile).toHaveBeenCalledWith(
      "mockFilePath.txt",
      "utf8"
    );
  });

  test("writeToFile should write data to file", async () => {
    const mockWriteFile = vi
      .spyOn(fs.promises, "writeFile")
      .mockResolvedValue();
    const filePath = "outputFile.txt";
    const data = 42;

    await Calculator.writeToFile(filePath, data);

    // Verify that fs.promises.writeFile was called with correct arguments
    expect(mockWriteFile).toHaveBeenCalledWith(filePath, "Результат: 42");
  });
});
