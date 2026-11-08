---
'@anansi/core': patch
'@anansi/storybook': patch
---

Support @data-client/react 0.19

`dataClientSpout({ getManagers })` passes `getManagers` to 0.19 as the function it now takes, so each store gets its own Managers. Earlier versions still get the array. Your `getManagers` doesn't change.

```tsx
dataClientSpout({
  getManagers: () => [new MyManager(), ...getDefaultManagers()],
});
```
