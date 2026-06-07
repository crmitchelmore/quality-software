import { cmdCheck } from "./cli/check.js";
import { cmdHook } from "./cli/hooks.js";
import { cmdInit, cmdOnboard, cmdProfile } from "./cli/onboard.js";
import { cmdDoctor, cmdInstallCopilot } from "./cli/plugin.js";
import { cmdReview } from "./cli/review.js";
import { USAGE } from "./cli/usage.js";

async function main(): Promise<void> {
  const [cmd, ...rest] = process.argv.slice(2);
  switch (cmd) {
    case "hook":
      await cmdHook(rest[0] ?? "", rest.slice(1));
      break;
    case "init":
      cmdInit(rest.includes("--write"));
      break;
    case "check":
      await cmdCheck(rest);
      break;
    case "profile":
      cmdProfile();
      break;
    case "onboard":
      cmdOnboard(rest);
      break;
    case "review":
      await cmdReview(rest);
      break;
    case "install-copilot":
      cmdInstallCopilot(rest);
      break;
    case "doctor":
      cmdDoctor();
      break;
    default:
      process.stderr.write(USAGE);
      process.exitCode = cmd && !["help", "-h", "--help"].includes(cmd) ? 1 : 0;
  }
}

main();
