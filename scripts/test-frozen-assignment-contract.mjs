import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const mapper = readFileSync("plugin/src/plugin/Mapper.ts", "utf8");
const enums = readFileSync("plugin/src/plugin/enums.ts", "utf8");
const plugin = readFileSync("plugin/plugin.xml", "utf8");

assert.match(enums, /FROZEN\s*=\s*["']frozen["']/);
assert.match(mapper, /case\s+["']frozen["']:[\s\S]*RemoteConfigurationAssignmentType\.FROZEN/);
assert.match(mapper, /default:[\s\S]*RemoteConfigurationAssignmentType\.UNKNOWN/);
assert.match(plugin, /io\.qonversion:sandwich:7\.13\.0/);
assert.match(plugin, /QonversionSandwich" spec="7\.13\.0"/);

console.log("Frozen assignment bridge contract is intact.");
