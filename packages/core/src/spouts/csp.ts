export interface Policy {
  [directive: string]: string | string[];
}

// TODO: memoize this
export function buildPolicy(policyObj: Policy) {
  return Object.keys(policyObj)
    .map(key => {
      const val = Array.isArray(policyObj[key])
        ? [...new Set(policyObj[key]).values()].filter(v => v).join(' ')
        : policyObj[key];

      // move strict dynamic to the end of the policy if it exists to be backwards compatible with csp2
      // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src#strict-dynamic
      if (typeof val === 'string' && val.includes("'strict-dynamic'")) {
        const newVal = `${val
          .replace(/\s?'strict-dynamic'\s?/gi, ' ')
          .trim()} 'strict-dynamic'`;
        return `${key} ${newVal}`;
      }

      return `${key} ${val}`;
    })
    .join('; ');
}
