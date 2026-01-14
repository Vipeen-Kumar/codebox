import axios from "axios";

export const runCode = async (req, res) => {
  const { language, version, source_code, stdin } = req.body;

  try {
    const response = await axios.post(
      `${process.env.PISTON_API_URL}/execute`,
      {
        language,
        version,
        files: [
          {
            content: source_code,
          },
        ],
        stdin: stdin || "",
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Piston execution failed:", error.response?.data || error.message);
    res.status(500).json({ error: "Execution failed", details: error.response?.data || error.message });
  }
};
