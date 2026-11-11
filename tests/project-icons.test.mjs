import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { registerHooks } from 'node:module';
const resolver = registerHooks({ resolve(specifier, context, nextResolve) {
  return nextResolve(['../shared/project-icons', './project-icon-discovery'].includes(specifier) ? `${specifier}.ts` : specifier, context);
} });
const { createProjectIconReader } = await import('../server/project-icons.ts');
const { groupIconProject, projectIconRpc } = await import('../shared/project-icons.ts');
resolver.deregister();
const png = (size) => {
  const bytes = Buffer.alloc(24);
  Buffer.from([137,80,78,71,13,10,26,10]).copy(bytes);
  bytes.writeUInt32BE(size,16);bytes.writeUInt32BE(size,20);
  return bytes;
};

test('copies sharing a remote resolve their own logo; worktrees use their named project', () => {
  const projects = [{ projectId:'one',projectKey:'remote:same',projectDisplayName:'one',projectRootPath:'/repos/one' },
    { projectId:'two',projectKey:'remote:same',projectDisplayName:'two',projectRootPath:'/repos/two' }];
  const group = (cwd,name='two') => ({key:'remote:same',name,entries:[{agent:{cwd}}]});
  assert.equal(groupIconProject(group('/repos/two/sub'),projects).projectId,'two');
  assert.equal(groupIconProject(group('/worktrees/change'),projects).projectId,'two');
  assert.equal(groupIconProject({...group('/worktrees/change'),key:'two'},projects).projectId,'two');
  assert.equal(groupIconProject(group('/repos/one-more','unknown'),projects),undefined);
});

test('automatic icons follow native priority and cache concurrent reads; unknown IDs cannot read files', async () => {
  const root=await mkdtemp(join(tmpdir(),'inbox-icons-'));
  try {
    await mkdir(join(root,'public'));
    await writeFile(join(root,'public','favicon.png'),png(18));
    await writeFile(join(root,'favicon.png'),png(20));
    let calls=0;
    const read=createProjectIconReader({projects:{list:async()=>{calls++;return {projects:[{projectId:'p',projectRootPath:root}]};}}},root);
    const [first,second]=await Promise.all([read('p'),read('p')]);
    assert.deepEqual(first,second);
    assert.equal(calls,1);
    assert.equal(first.uri,`data:image/png;base64,${png(18).toString('base64')}`);
    projectIconRpc.output.parse({icon:first});
    await writeFile(join(root,'public','favicon.png'),png(22));
    assert.deepEqual(await read('p'),first);
    assert.equal(await read('../outside'),null);
  } finally { await rm(root,{recursive:true,force:true}); }
});

test('chosen Paseo icons override automatic discovery and missing icons fall back without repository scanning', async () => {
  const root=await mkdtemp(join(tmpdir(),'inbox-icons-'));
  try {
    await mkdir(join(root,'projects','icons'),{recursive:true});
    await writeFile(join(root,'favicon.png'),png(18));
    const path=join(root,'projects','icons',`${createHash('sha256').update('p').digest('hex')}.bin`);
    await writeFile(path,png(32));
    const read=createProjectIconReader({projects:{list:async()=>({projects:[
      {projectId:'p',projectRootPath:root,projectCustomIconRevision:'r1'},
      {projectId:'missing',projectRootPath:root,projectCustomIconRevision:'r1'},
    ]})}},root);
    assert.equal((await read('p')).uri,`data:image/png;base64,${png(32).toString('base64')}`);
    assert.equal(await read('missing'),null);
  } finally { await rm(root,{recursive:true,force:true}); }
});

test('safe SVGs use public native-capable Icon; active SVGs fall back', async () => {
  const root=await mkdtemp(join(tmpdir(),'inbox-icons-'));
  try {
    const safe='<svg viewBox="0 0 24 24"><path fill="red" d="M0 0h24v24H0z"/></svg>';
    await writeFile(join(root,'favicon.svg'),safe);
    const api={projects:{list:async()=>({projects:[{projectId:'p',projectRootPath:root}]})}};
    assert.deepEqual(await createProjectIconReader(api,root)('p'),{uri:null,svg:safe});
    await writeFile(join(root,'favicon.svg'),'<svg><script>alert(1)</script></svg>');
    assert.equal(await createProjectIconReader(api,root)('p'),null);
  } finally { await rm(root,{recursive:true,force:true}); }
});
