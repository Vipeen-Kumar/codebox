import axios from 'axios';

const API_URL = 'http://localhost:5000/api/piston/execute';

const testLanguage = async (lang, version, code, expectedOutput) => {
    console.log(`Testing ${lang} execution...`);
    try {
      const response = await axios.post(API_URL, {
        language: lang,
        version: version,
        source_code: code,
        stdin: ''
      });
      
      const output = response.data.run.stdout.trim();
      if (output === expectedOutput) {
          console.log(`✅ ${lang} Test Passed`);
      } else {
          console.error(`❌ ${lang} Test Failed. Expected "${expectedOutput}", got "${output}"`);
          if (response.data.run.stderr) console.error('Stderr:', response.data.run.stderr);
          if (response.data.compile && response.data.compile.stderr) console.error('Compile Stderr:', response.data.compile.stderr);
      }
    } catch (error) {
      console.error(`❌ ${lang} Test Failed with error:`, error.message);
      if(error.response) console.error('Response data:', error.response.data);
    }
  };

const runTests = async () => {
    // Python
    await testLanguage('python', '3.10.0', 'print("Hello Python")', 'Hello Python');
    
    // JavaScript
    await testLanguage('javascript', '18.15.0', 'console.log("Hello JS")', 'Hello JS');
    
    // C++
    await testLanguage('c++', '10.2.0', 
    '#include <iostream>\nint main() { std::cout << "Hello CPP"; return 0; }', 
    'Hello CPP');

    // Java
    // Java is tricky because class name must match file name usually, or be Main. 
    // Piston usually handles "Main" or assumes main class.
    await testLanguage('java', '15.0.2', 
    'public class Main { public static void main(String[] args) { System.out.println("Hello Java"); } }', 
    'Hello Java');
};

runTests();
