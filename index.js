#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const inquirer = require("inquirer");
const shell = require("shelljs");

const CHOICES = fs.readdirSync(path.join(__dirname, "template"));

const createProjectDir = (projectPath) => {
  if (fs.existsSync(projectPath)) {
    return false;
  }

  fs.mkdirSync(projectPath);
  return true;
};

const CurrDir = process.cwd();

const filesToSkip = [".env", "node_modules"];

const createTemplateContent = (templatePath, projectName) => {
  //*First read the content of the template
  const filesToCreate = fs.readdirSync(templatePath, { recursive: true });

  filesToCreate.forEach((file) => {
    const originalFilePath = path.join(templatePath, file);

    const stats = fs.statSync(originalFilePath);

    //*Skip files
    if (filesToSkip.indexOf(file) > -1) return;

    if (stats.isFile()) {
      let fileContent = fs.readFileSync(originalFilePath, "utf-8");

      const writePath = path.join(CurrDir, projectName, file);

      fs.writeFileSync(writePath, fileContent, "utf-8");
    } else if (stats.isDirectory()) {
      fs.mkdirSync(path.join(CurrDir, projectName, file));
      createTemplateContent(
        path.join(templatePath, file),
        path.join(projectName, file)
      );
    }
  });
};

const postProccessInstall = (templatePath, targetProjectPath) => {
  const isNodeProject = fs.existsSync(path.join(templatePath, "package.json"));

  if (isNodeProject) {
    shell.cd(targetProjectPath);
    const result = shell.exec("npm install");

    if (result.code !== 0) {
      return false;
    }
  }
  return true;
};
const Questions = [
  {
    name: "template",
    type: "list",
    message: "What project template would you like to use ?",
    choices: CHOICES,
  },
  {
    name: "name",
    type: "input",
    message: "Enter Project Name?",
  },
];

const propmt = inquirer.createPromptModule();
propmt(Questions).then((answer) => {
  const seletedTemplate = answer["template"];
  const projectName = answer["name"];

  const templatePath = path.join(__dirname, "template", seletedTemplate);
  const targetPath = path.join(CurrDir, projectName);

  createProjectDir(targetPath);

  createTemplateContent(templatePath, projectName);

  postProccessInstall(templatePath, targetPath);
});
