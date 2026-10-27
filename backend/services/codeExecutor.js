import { execSync, spawn } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import os from "os";
import process from "process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const tempDir = path.join(os.tmpdir(), "codebox-exec");

// Ensure temp directory exists
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

export const executeCode = async (language, code, stdin = "") => {
  const uniqueId = `exec${Date.now()}${Math.random().toString(36).substr(2, 9)}`.replace(/[-]/g, "_");
  let tempFile;

  try {
    switch (language) {
      case "python":
      case "python3":
        tempFile = path.join(tempDir, `${uniqueId}.py`);
        fs.writeFileSync(tempFile, code);
        return await runCommand("python3", [tempFile], stdin);

      case "javascript":
      case "js":
      case "node":
        tempFile = path.join(tempDir, `${uniqueId}.js`);
        fs.writeFileSync(tempFile, code);
        return await runCommand("node", [tempFile], stdin);

      case "cpp":
      case "c++":
        tempFile = path.join(tempDir, `${uniqueId}.cpp`);
        const binFile = path.join(tempDir, `${uniqueId}.exe`);
        fs.writeFileSync(tempFile, code);
        
        // Compile
        try {
          execSync(`g++ "${tempFile}" -o "${binFile}"`, {
            stdio: "pipe",
            timeout: 10000,
          });
        } catch (compileErr) {
          return {
            compile: {
              code: 1,
              output: "",
              stderr: compileErr.stderr?.toString() || compileErr.message || "Compilation error",
            },
            run: {
              code: null,
              stdout: "",
              stderr: "",
              output: "",
            },
          };
        }

        // Run
        return await runCommand(binFile, [], stdin);

      case "java":
        tempFile = path.join(tempDir, `Main_${uniqueId}.java`);
        const classDir = path.join(tempDir, `class-${uniqueId}`);
        fs.mkdirSync(classDir, { recursive: true });
        
        // Replace public class name with generic Main_* class - more carefully
        let javaCode = code.replace(/public\s+class\s+\w+(?=\s*\{)/g, `public class Main_${uniqueId}`);
        // Also handle case where user didn't use public
        if (!javaCode.includes("public class")) {
          javaCode = javaCode.replace(/class\s+\w+(?=\s*\{)/g, `public class Main_${uniqueId}`);
        }
        fs.writeFileSync(tempFile, javaCode);

        // Compile
        try {
          execSync(`javac -d "${classDir}" "${tempFile}"`, {
            stdio: "pipe",
            timeout: 10000,
          });
        } catch (compileErr) {
          return {
            compile: {
              code: 1,
              output: "",
              stderr: compileErr.stderr?.toString() || compileErr.message || "Compilation error",
            },
            run: {
              code: null,
              stdout: "",
              stderr: "",
              output: "",
            },
          };
        }

        // Run
        return await runCommand("java", ["-cp", classDir, `Main_${uniqueId}`], stdin);

      default:
        return {
          error: `Unsupported language: ${language}`,
          details: `Only python, javascript, cpp, and java are supported`,
        };
    }
  } finally {
    // Cleanup temp files (async, don't block)
    setTimeout(() => {
      try {
        if (tempFile && fs.existsSync(tempFile)) {
          fs.unlinkSync(tempFile);
        }
      } catch (e) {
        // Silent fail on cleanup
      }
    }, 2000);
  }
};

const runCommand = async (command, args, stdin = "") => {
  return new Promise((resolve) => {
    const isWindows = process.platform === "win32";
    const proc = spawn(command, args, {
      timeout: 5000,
      stdio: ["pipe", "pipe", "pipe"],
      shell: isWindows,
    });

    let stdout = "";
    let stderr = "";
    let exitCode = 0;

    proc.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    proc.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    proc.on("close", (code) => {
      exitCode = code || 0;
      resolve({
        compile: {
          code: 0,
          output: "",
          stderr: "",
        },
        run: {
          code: exitCode,
          stdout: stdout,
          stderr: stderr,
          output: stdout,
        },
      });
    });

    proc.on("error", (err) => {
      resolve({
        compile: {
          code: 0,
          output: "",
          stderr: "",
        },
        run: {
          code: 1,
          stdout: "",
          stderr: `Error executing: ${err.message}`,
          output: "",
        },
      });
    });

    // Send stdin
    if (stdin) {
      proc.stdin.write(stdin);
    }
    proc.stdin.end();

    // Timeout after 5 seconds
    const timeout = setTimeout(() => {
      if (proc.exitCode === null) {
        try {
          proc.kill();
        } catch (e) {
          // Process already killed
        }
      }
    }, 5000);

    proc.on("close", () => {
      clearTimeout(timeout);
    });
  });
};
