import { existsSync } from "node:fs";
import { spawn, spawnSync } from "node:child_process";
import { delimiter, resolve } from "node:path";

const candidates = [
  process.env.PHP_BINARY,
  process.env.PHP_HOME && resolve(process.env.PHP_HOME, "php.exe"),
  "D:\\codeT7\\tools\\php\\php.exe",
  "C:\\php\\php.exe",
  "C:\\xampp\\php\\php.exe",
];

if (process.env.PATH) {
  for (const directory of process.env.PATH.split(delimiter)) {
    candidates.push(resolve(directory, "php.exe"));
  }
}

const php = candidates.find((candidate) => candidate && existsSync(candidate));

if (!php) {
  const availableOnPath = spawnSync("php", ["--version"], { stdio: "ignore" }).status === 0;
  if (availableOnPath) {
    start("php");
  } else {
    console.error(
      "PHP introuvable. Installe PHP ou definis PHP_BINARY avec le chemin vers php.exe.",
    );
    process.exit(1);
  }
} else {
  start(php);
}

function start(executable) {
  const caBundle = resolve(process.cwd(), ".php", "cacert.pem");
  const phpArguments = ["-S", "localhost:8000", "-t", "."];

  if (existsSync(caBundle)) {
    phpArguments.unshift(
      "-d",
      `curl.cainfo=${caBundle}`,
      "-d",
      `openssl.cafile=${caBundle}`,
    );
  }

  const server = spawn(
    executable,
    phpArguments,
    { stdio: "inherit", shell: false },
  );

  server.on("error", (error) => {
    console.error(`Impossible de demarrer PHP : ${error.message}`);
    process.exit(1);
  });

  server.on("exit", (code, signal) => {
    if (signal) process.exit(0);
    process.exit(code ?? 1);
  });
}
