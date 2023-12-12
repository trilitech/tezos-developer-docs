---
title: compile
---

Refer to one of the following:
- [The LIGO plugin](/taqueria/plugins/plugin-ligo)
- [The SmartPy plugin](/taqueria/plugins/plugin-smartpy)
- [The Archetype plugin](/taqueria/plugins/plugin-archetype)

If you have more than two of the above plugins installed, you'll need to be explicit about what plugin to use when invoking the task. You can do this by specifying the `--plugin` option to the taq command:

 ```shell
 taq --plugin [ligo|smartpy|archetype] compile
 ```