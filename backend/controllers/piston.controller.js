import { executeCode } from "../services/codeExecutor.js";

export const runCode = async (req, res) => {
  const { language, version, source_code, stdin } = req.body;

  try {
    if (!language || !source_code) {
      return res.status(400).json({
        error: "Missing required fields: language and source_code",
      });
    }

    const result = await executeCode(language, source_code, stdin || "");

    if (result.error) {
      return res.status(400).json(result);
    }

    res.json({
      language: language,
      compile: result.compile,
      run: result.run,
    });
  } catch (error) {
    console.error("Code execution failed:", error);
    res.status(500).json({
      error: "Execution failed",
      details: error.message,
    });
  }
};
