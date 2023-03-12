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

export function joinNonce(policyObj: Policy, nonce?: string | undefined) {
  if (!nonce) return policyObj;
  const policy = {
    ...policyObj,
  };
  if (typeof policy['script-src'] === 'string') {
    policy['script-src'] = [policy['script-src'], `'nonce-${nonce}'`];
  } else {
    policy['script-src'] = [...policy['script-src'], `'nonce-${nonce}'`];
  }
  return policy;
}
