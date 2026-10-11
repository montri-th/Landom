#!/usr/bin/env python3
"""Read-only documentation checks; never builds, edits Sheets or deploys apps."""
import argparse
from pathlib import Path
import json, re, hashlib, collections, subprocess

STEM = 'CityMETER_Landom_Unified_Handoff_Implementation_Plan_2026-10-11'
args = argparse.ArgumentParser()
args.add_argument('--workspace', help='Optional original project root for pinned Git blob and receipt verification')
args.add_argument('--citymeter-repo', help='Optional CityMETER clone (with pinned history)')
args.add_argument('--landom-repo', help='Optional Landom clone (with pinned history)')
opt = args.parse_args()
root = Path(__file__).resolve().parent
checks = []
def check(name, ok, detail=None):
    checks.append(dict(check=name, status='pass' if ok else 'fail', detail=detail))
def sha(p): return hashlib.sha256(p.read_bytes()).hexdigest()
data = json.loads((root/(STEM+'.json')).read_text(encoding='utf-8'))
md = (root/(STEM+'.md')).read_text(encoding='utf-8')
blocks = re.findall(r'```json\n(.*?)\n```', md, re.S)
check('one_embedded_contract', len(blocks)==1)
check('embedded_separate_json_parity', len(blocks)==1 and json.loads(blocks[0])==data)
required = ['schemaVersion','documentId','repositories','authority','decisions','tasks',
            'acceptance','datasetInventory','verification','codingPrompts','files','evidenceIndex']
check('required_top_level_fields', all(k in data for k in required))
check('schema_version', data['schemaVersion']=='1.0.0')
for collection in ['repositories','authority','decisions','tasks','acceptance','codingPrompts']:
    ids = [x['id'] for x in data[collection]]
    check('unique_'+collection+'_ids', len(ids)==len(set(ids)))
tasks={x['id']:x for x in data['tasks']}
criteria={x['id'] for x in data['acceptance']}
joined = all(set(x['acceptanceIds']) <= criteria for x in data['tasks']+data['decisions'])
check('acceptance_references', joined)
check('task_dependency_references',all(set(t['dependencies'])<=set(tasks) for t in tasks.values()))
visited=set(); pending=set()
def visit(i):
    if i in pending: raise ValueError('Dependency cycle: '+i)
    if i in visited:return
    pending.add(i)
    for j in tasks[i]['dependencies']:visit(j)
    pending.remove(i); visited.add(i)
try:
    for i in tasks:visit(i)
    acyclic=True
except ValueError:acyclic=False
check('acyclic_task_graph', acyclic)
check('prompt_task_references', all(set(x['tasks'])<=set(tasks) for x in data['codingPrompts']))
inventory=data['datasetInventory']
check('43_pinned_baseline_records',len(inventory)==43)
check('baseline_groups',dict(collections.Counter(x['group'] for x in inventory))=={'land':13,'location':16,'living':14})
for field in ['datasetCode','slug','moduleSlug']:
    check('unique_inventory_'+field,len({x[field] for x in inventory})==43)
check('43_credit_modules_with_people', all(x['contributors'] and x['moduleSlug']=='dataset-'+x['slug'] for x in inventory))
check('86_localized_article_routes',len({u for x in inventory for u in x['articleUrl'].values()})==86)
checks.append(dict(check='schema_profile',status='pass',detail='This standard-library validator checks document joins and contract shape; it is not a general JSON Schema engine.'))
body=md[:md.index('## 14. Machine-readable contract')]
local=[]
for target in re.findall(r'\]\(([^)]+)\)',body):
    if '://' in target or target.startswith('#'):continue
    candidate=target.split('#',1)[0]
    local.append(candidate)
check('markdown_local_links',all((root/x).is_file() for x in local),{'count':len(local)})
check('no_absolute_host_paths_or_private_email',not re.search(r'/Users/|[\w.+-]+@(?:gmail|hotmail|outlook)\.com',md))
bound={x['id']:x for x in data['authority']}
check('location_profile_base_binding',bound['AUTH-LI']['baseDocument']['sha256']==bound['AUTH-LDS']['sha256'])
authorities=[x for x in data['authority'] if 'bundledPath' in x]
check('bundled_authority_hashes',all((root/x['bundledPath']).is_file() and sha(root/x['bundledPath'])==x['sha256'] for x in authorities),{'count':len(authorities)})
check('future_recipes_not_pending_rebuilds',all(t['status']=='future_maintenance_recipe' for t in data['tasks']))
check('published_vs_documentation_state',data['verification']['documentationThisTask']['newDeployment'] is False)
check('receipt_relative_reference_scope',len(data['evidenceIndex'])==2 and all('not bundled' in x['supportingReferences'] for x in data['evidenceIndex'].values()))
repo_paths={}
if opt.workspace:
    base=Path(opt.workspace)
    repo_paths={r['id']:base/r['localWorkspaceRelative'] for r in data['repositories']}
if opt.citymeter_repo: repo_paths['CityMETER']=Path(opt.citymeter_repo)
if opt.landom_repo: repo_paths['Landom']=Path(opt.landom_repo)
if repo_paths:
    repos={r['id']:r for r in data['repositories']}
    failed=[]; checked=0; baselines=[]
    for rid,p in repo_paths.items():
        r=repos[rid]
        try:
            tree=subprocess.check_output(['git','-C',str(p),'rev-parse',r['baselineSha']+'^{tree}'],stderr=subprocess.DEVNULL).decode().strip()
            baselines.append(dict(repository=rid,tree=tree,expectedTree=r['baselineTree']))
            if tree!=r['baselineTree']:failed.append(rid+':baselineTree')
        except (OSError,subprocess.CalledProcessError):failed.append(rid+':pinned_history_unavailable')
    for f in data['files']:
        rid=f['repository']
        if rid not in repo_paths:continue
        checked+=1
        try:
            blob=subprocess.check_output(['git','-C',str(repo_paths[rid]),'show',repos[rid]['baselineSha']+':'+f['path']],stderr=subprocess.DEVNULL)
            if hashlib.sha256(blob).hexdigest()!=f['sha256']:failed.append(rid+':'+f['path'])
        except (OSError,subprocess.CalledProcessError):failed.append(rid+':'+f['path']+':unavailable')
    check('pinned_source_git_blob_hashes',not failed,{'count':checked,'fullInventoryCount':len(data['files']),'failed':failed,'baselines':baselines})
    if len(repo_paths)<len(repos):checks.append(dict(check='other_repo_pinned_hashes',status='not_run',detail='Supply both clone paths to verify all 90 historical sources.'))
else:
    checks.append(dict(check='pinned_source_hashes',status='not_run',detail='Supply --workspace or explicit clone paths; source repositories are not bundled.'))
if opt.workspace:
    same=all((Path(opt.workspace)/e['originalWorkspaceRelativePath']).is_file() and sha(root/p)==sha(Path(opt.workspace)/e['originalWorkspaceRelativePath']) for p,e in data['evidenceIndex'].items())
    check('immutable_release_receipt_copies',same)
else:
    checks.append(dict(check='original_receipt_copy_comparison',status='not_run',detail='Original release workspace not supplied; bundled receipt bytes remain covered by package manifest.'))
li=next(x for x in inventory if x['datasetCode']=='localeInsights')
lineage=li.get('creditLineage',{})
check('locale_insight_owner_continuation',{'I0011','I0034'}=={x['personId'] for x in li['contributors']} and lineage.get('latestDeveloperPersonId')=='I0034' and lineage.get('originalDeveloperPersonId')=='I0011' and lineage.get('latestDeveloperProgramLabel')=='CEDT')
manifest=root/'package-manifest.json'
if manifest.exists():
    m=json.loads(manifest.read_text())
    bad=[f['path'] for f in m['files'] if not (root/f['path']).is_file() or sha(root/f['path'])!=f['sha256']]
    check('package_file_hashes',not bad,{'count':len(m['files']),'failed':bad})
else:
    checks.append(dict(check='package_file_hashes',status='not_run',detail='Manifest not yet prepared.'))
passed=all(x['status']!='fail' for x in checks)
print(json.dumps(dict(status='pass' if passed else 'fail',scope='documentation_only',checks=checks),indent=2))
raise SystemExit(0 if passed else 1)
