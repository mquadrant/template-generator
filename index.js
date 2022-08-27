#!/usr/bin/node

import inquirer from 'inquirer'
import chalk from 'chalk'
import fs from 'fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { execa } from 'execa';
import Listr from 'listr';
import { projectInstall } from 'pkg-install';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CURRENT_DIRECTORY = process.cwd()
const CHOICES = fs.readdirSync(`${__dirname}/templates`);

const QUESTIONS = [
  {
    name: 'project-choice',
    type: 'list',
    message: 'What project template would you like to generate?',
    choices: CHOICES
  },
  {
    name: 'project-name',
    type: 'input',
    message: 'Project name:',
    validate: function (input) {
      if (/^([A-Za-z\-\_\d])+$/.test(input)) return true;
      else return 'Project name may only include letters, numbers, underscores and hashes.';
    }
  }
];

inquirer.prompt(QUESTIONS)
  .then(async (answers) => {

    const projectChoice = answers['project-choice']
    const projectName = answers['project-name']

    const options = {
        projectChoice,
        projectName,
        projectDirectory: `${CURRENT_DIRECTORY}/${projectName}`
    }

    await runTasks(options)

    console.log('%s Project ready', chalk.green.bold('DONE'))
});

function createProject({projectChoice, projectName, projectDirectory}) {
    const templatePath = `${__dirname}/templates/${projectChoice}`

    fs.mkdirSync(projectDirectory)

    createDirectoryContent(templatePath, projectName)
}

function createDirectoryContent(templatePath, projectPath) {
    const filesToCopy = fs.readdirSync(templatePath);

    filesToCopy.forEach((file) => {
        const filePath = `${templatePath}/${file}`

        const fileStats = fs.statSync(filePath)
        
        if(fileStats.isFile()) {
            const fileContent = fs.readFileSync(filePath, 'utf8')
            const writePath = `${CURRENT_DIRECTORY}/${projectPath}/${file}`
            fs.writeFileSync(writePath, fileContent, 'utf8')
        } else if(fileStats.isDirectory()) {
            fs.mkdirSync(`${CURRENT_DIRECTORY}/${projectPath}/${file}`)

            createDirectoryContent(`${templatePath}/${file}`, `${projectPath}/${file}`)
        }
    })
}

async function initializeGit(options) {
    const result = await execa('git', ['init'], {
        cwd: options.projectDirectory,
    });
    if(result.failed) {
        return Promise.reject(new Error('Failed to initialize git'));
    }
    return;
}

async function installProjectDependencies(options) {

    await projectInstall({
        cwd: options.projectDirectory,
        prefer: 'yarn'
    })
    return;
}

async function runTasks(options) {
    const tasks = new Listr([
        {
          title: 'Generate project folders & files',
          task: () => createProject(options),
        },
        {
          title: 'Initialized a git repository',
          task: () => initializeGit(options),
        },
        {
          title: 'Installing template dependencies using yarn...',
          task: () => installProjectDependencies(options),
        },
      ]);
    
    await tasks.run();
}