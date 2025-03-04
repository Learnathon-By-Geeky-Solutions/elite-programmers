'use client'
import React from "react";
import { Card, CardBody, Button, Select, SelectItem, Tabs, Tab } from "@heroui/react";
import { Icon } from "@iconify/react";
import Editor from "@monaco-editor/react";

interface TestCase {
  input: string;
  expectedOutput: string;
  receivedOutput?: string;
  status?: "success" | "error" | "pending";
}

interface Question {
  id: number;
  title: string;
  description: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string;
  examples: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  testCases: TestCase[];
}

interface CodeState {
  [key: string]: string;
}

const languages = [
  { label: "C++", value: "cpp", defaultCode: "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    // Your code here\n    return 0;\n}" },
  { label: "Python", value: "python", defaultCode: "# Your code here" },
  { label: "Java", value: "java", defaultCode: "public class Main {\n    public static void main(String[] args) {\n        // Your code here\n    }\n}" },
  { label: "JavaScript", value: "javascript", defaultCode: "function solve(input) {\n    // Your code here\n}" },
  { label: "C", value: "c", defaultCode: "#include <stdio.h>\n\nint main() {\n    // Your code here\n    return 0;\n}" }
];

export default function App() {
  const [selectedLanguage, setSelectedLanguage] = React.useState("cpp");
  const [codeStates, setCodeStates] = React.useState<CodeState>({});
  const [activeTab, setActiveTab] = React.useState("code");

  const question: Question = {
    id: 1,
    title: "Alice and Bob",
    description: "Write a program that takes two integers as input and prints their sum.",
    inputFormat: "Two space-separated integers, a and b.",
    outputFormat: "Print the sum of a and b.",
    constraints: "-10⁹ ≤ a, b ≤ 10⁹",
    examples: [
      {
        input: "3 7",
        output: "10",
        explanation: "The sum of 3 and 7 is 10."
      },
      {
        input: "99999 -99999",
        output: "0",
        explanation: "The sum of 99999 and -99999 is 0."
      }
    ],
    testCases: [
      { input: "3 7", expectedOutput: "10" },
      { input: "99999 -99999", expectedOutput: "0" },
      { input: "1000000000 1000000000", expectedOutput: "2000000000" }
    ]
  };

  React.useEffect(() => {
    const initialStates: CodeState = {};
    languages.forEach(lang => {
      initialStates[lang.value] = lang.defaultCode;
    });
    setCodeStates(initialStates);
  }, []);

  const handleCodeChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCodeStates(prev => ({
        ...prev,
        [selectedLanguage]: value
      }));
    }
  };

  const runTests = () => {
    console.log("Running tests for", selectedLanguage);
    console.log("Code:", codeStates[selectedLanguage]);
  };

  return (
        <div className="grid grid-cols-2">
          <Card className=" border-none ">
            <CardBody>
              <h2 className="text-xl font-bold">{question.title}</h2>
              <div className="space-y-4">
                <div>
                  <p>{question.description}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Input Format:</h3>
                  <p>{question.inputFormat}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Output Format:</h3>
                  <p>{question.outputFormat}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Constraints:</h3>
                  <p>{question.constraints}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Examples:</h3>
                  {question.examples.map((example, index) => (
                    <div key={index} className="mt-2 p-3 rounded-lg">
                      <div>
                        <span className="font-semibold">Input:</span> {example.input}
                      </div>
                      <div>
                        <span className="font-semibold">Output:</span> {example.output}
                      </div>
                      {example.explanation && (
                        <div>
                          <span className="font-semibold">Explanation:</span> {example.explanation}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardBody>
          </Card>
          <Card className=" border-none">
            <CardBody>
                <div className="flex items-center justify-end gap-2">
                  <Button
                    color="primary"
                    startContent={<Icon icon="lucide:play" />}
                    onPress={runTests}>
                    Run Tests
                  </Button>
                  <Select
                    label="Language"
                    selectedKeys={[selectedLanguage]}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="w-40"
                  >
                    {languages.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </Select>

                </div>
              <Tabs
                selectedKey={activeTab}
                onSelectionChange={(key) => setActiveTab(key.toString())}
                className="mb-4">
                <Tab
                  key="code"
                  title={
                    <div className="flex items-center gap-2">
                      <Icon icon="lucide:code" />
                      <span>Code</span>
                    </div>
                  }
                >
                  <div className="h-[600px] rounded-lg overflow-hidden shadow-xl">
                    <Editor
                      height="100%"
                      defaultLanguage={selectedLanguage}
                      value={codeStates[selectedLanguage]}
                      onChange={handleCodeChange}
                      theme="vs-dark"
                      options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        lineNumbers: "on",
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                      }}
                    />
                  </div>
                </Tab>
                <Tab
                  key="testcases"
                  title={
                    <div className="flex items-center gap-2">
                      <Icon icon="lucide:check-circle" />
                      <span>Test Cases</span>
                    </div>
                  }
                >
                  <div className="space-y-4">
                    {question.testCases.map((testCase, index) => (
                      <div key={index} className="p-4 rounded-lg">
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <div className="text-sm text-default-500 mb-1">Input</div>
                            <div className="font-mono">{testCase.input}</div>
                          </div>
                          <div>
                            <div className="text-sm text-default-500 mb-1">Expected Output</div>
                            <div className="font-mono">{testCase.expectedOutput}</div>
                          </div>
                          <div>
                            <div className="text-sm text-default-500 mb-1">Status</div>
                            <div className="font-mono">
                              {testCase.status === "success" && (
                                <Icon icon="lucide:check-circle" className="text-success" />
                              )}
                              {testCase.status === "error" && (
                                <Icon icon="lucide:x-circle" className="text-danger" />
                              )}
                              {(!testCase.status || testCase.status === "pending") && (
                                <Icon icon="lucide:minus-circle" className="text-default-500" />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Tab>
              </Tabs>
            </CardBody>
          </Card>
        </div>
  );
}