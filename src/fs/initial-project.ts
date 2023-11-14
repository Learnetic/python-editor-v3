/**
 * (c) 2021, Micro:bit Educational Foundation and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import { Buffer } from "buffer";
import { fromByteArray } from "base64-js";
import { MAIN_FILE } from "./fs";

/**
 * We can now initialize a project with multiple files.
 * Handling is in place for backwards compatibility for V2 projects
 * where only the main file content is initialized as a string.
 */
export interface PythonProject {
  // File content as base64.
  files: Record<string, string>;
  projectName?: string;
}

/**
 *
 * @param project PythonProject.
 * @returns PythonProject where all file content has been converted to base64.
 */
export const projectFilesToBase64 = (
  files: Record<string, string>
): Record<string, string> => {
  for (const file in files) {
    files[file] = fromByteArray(new TextEncoder().encode(files[file]));
  }
  return files;
};


// sendMessage(12, 1, {
//   "test": 123
// });

const url = new URL(window.location.href);


const code: string = url.searchParams.get('code')!
export const defaultMainFileContent = (url.searchParams.has('code') && url.searchParams.get('code') !== '' )? Buffer.from(code, 'base64').toString('utf8')! : '';

export const defaultInitialProject: PythonProject = {
  files: projectFilesToBase64({
    [MAIN_FILE]: defaultMainFileContent,
  }),
};
