#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const inquirer = require("inquirer");

const Choices = fs.readdirSync(path.join(__dirname, "generate"));

const CurrDir = process.cwd();

const generateResource = (
  resourceTemplatePath,
  targetFilePath,
  resourceName
) => {
  const filesToCreate = fs.readdirSync(resourceTemplatePath, {
    recursive: true,
  });

  filesToCreate.forEach((file) => {
    const originalFilePath = path.join(resourceTemplatePath, file);

    const stats = fs.statSync(originalFilePath);

    if (stats.isFile()) {
      const fileContent = fs.readFileSync(originalFilePath, "utf-8");
      const typeOfFile = file.split(".")[1];
      const writePath = path.join(
        targetFilePath,
        `${resourceName}.${typeOfFile}.js`
      );

      fs.writeFileSync(writePath, fileContent, "utf-8");
    } else if (stats.isDirectory()) {
      const dircPath = path.join(CurrDir, file);
      console.log("file", file);
      if (!fs.existsSync(dircPath)) {
        console.log("hit");
        fs.mkdirSync(path.join(CurrDir, file));
      }
      generateResource(
        path.join(resourceTemplatePath, file),
        path.join(targetFilePath, file),
        resourceName
      );
    }
  });
};

const Questions = [
  {
    name: "resource",
    type: "list",
    message: "What type of resource you want to generate ?",
    choices: Choices,
  },
  {
    name: "name",
    type: "input",
    message: "Enter Resource Name?",
  },
];

const prompt = inquirer.createPromptModule();

prompt(Questions).then((answer) => {
  const selectedResourceTemplate = answer["resource"];
  const resourceName = answer["name"];

  const resourceTemplatePath = path.join(
    __dirname,
    "generate",
    selectedResourceTemplate
  );

  generateResource(resourceTemplatePath, CurrDir, resourceName);
});
