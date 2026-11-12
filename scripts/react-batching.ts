// React 19 batches updates automatically on web and native. This adapter lets the
// observer scheduler run without importing a second, DOM-only React renderer.
export function unstable_batchedUpdates<T>(callback: () => T): T { return callback(); }
